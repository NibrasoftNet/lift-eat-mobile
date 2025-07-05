/**
 * Service IA amélioré avec gestion robuste des erreurs et cas limites
 */
import { buildEnrichedPrompt, PromptTypeEnum } from './promptBuilder';
import { detectDatabaseAction, cleanResponseText } from './responseParser';
import { processDatabaseAction } from './iaActions';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import {
  IaErrorHandler,
  IaErrorType,
  IaError,
  hasError,
  createComponentErrorHandler,
} from './errorHandler';
import {
  validateMealWithRecovery,
  validatePlanWithRecovery,
} from './responseValidation';
import { IaMealType, IaPlanType } from '@/utils/validation/ia/ia.schemas';
import { getCurrentUserIdSync } from '@/utils/helpers/userContext';
import { iaProviderFactory } from './providers/iaProviderFactory';
import { IaRequestOptions } from './providers/iaProvider.interface';
import { IaProviderType } from './providers/iaProviderFactory';

// Créer un gestionnaire d'erreurs propre au service IA
const errorHandler = createComponentErrorHandler('iaService');

// Constantes pour les paramètres de retry
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
const BACKOFF_FACTOR = 1.5;

// Types pour les réponses du service IA
export interface IaServiceResponse<T> {
  success: boolean;
  data?: T;
  cleanText?: string;
  error?: string;
  retryCount?: number;
  hadRecovery?: boolean;
}

/**
 * Service amélioré pour interagir avec l'IA
 */
export const iaService = {
  /**
   * Effectue une requête à l'IA avec gestion robuste des erreurs et retries automatiques
   * @param prompt - Le prompt à envoyer à l'IA
   * @param context - Contexte supplémentaire pour enrichir le prompt
   */
  async request<T = any>(
    prompt: string,
    context: Record<string, any> = {},
    maxRetries: number = MAX_RETRIES,
  ): Promise<IaServiceResponse<T>> {
    let retryCount = 0;
    let lastError: any = null;
    let delayMs = RETRY_DELAY_MS;

    // Vérifier que l'utilisateur est authentifié
    const userId = getCurrentUserIdSync();
    if (!userId) {
      const error = IaErrorHandler.handle(
        new Error('Utilisateur non authentifié'),
        "Impossible d'effectuer la requête IA",
        IaErrorType.UNAUTHORIZED_ERROR,
      );

      return {
        success: false,
        error: error.message,
      };
    }

    // Log détaillé pour le debugging
    logger.debug(LogCategory.IA, `iaService.request: Démarrage requête IA`, {
      promptPreview:
        prompt.substring(0, 100) + (prompt.length > 100 ? '...' : ''),
      contextKeys: Object.keys(context),
    });

    try {
      // Enrichir le prompt avec le contexte avant de démarrer les tentatives
      const enrichedPrompt = await buildEnrichedPrompt(
        userId,
        prompt,
        context.promptType || PromptTypeEnum.GENERAL_QUESTION,
      );

      // Récupérer le fournisseur IA par défaut
      const iaProvider = iaProviderFactory.getDefaultProvider();

      // Préparer les options de la requête
      const requestOptions: IaRequestOptions = {
        temperature: context.temperature || 0.7,
        maxTokens: context.maxTokens || 1024,
        topP: context.topP,
        timeout: context.timeout,
        stopSequences: context.stopSequences,
      };

      while (retryCount <= maxRetries) {
        try {
          // Si ce n'est pas la première tentative, attendre avant de réessayer
          if (retryCount > 0) {
            logger.info(
              LogCategory.IA,
              `iaService.request: Tentative ${retryCount}/${maxRetries} après une erreur`,
            );
            await new Promise((resolve) => setTimeout(resolve, delayMs));
            delayMs *= BACKOFF_FACTOR; // Backoff exponentiel
          }

          // Appel au fournisseur IA
          const providerResponse = await iaProvider.sendRequest(
            enrichedPrompt,
            requestOptions,
          );

          // Récupérer le texte de la réponse
          const response = providerResponse.text;

          // Détecter les actions dans la réponse
          const action = detectDatabaseAction(response);

          // Nettoyer le texte pour l'affichage utilisateur
          const cleanText = cleanResponseText(response);

          if (action.type !== 'NONE') {
            // Si une action DB a été détectée
            if (action.isValid) {
              // Traiter l'action DB
              const processingResult = await processDatabaseAction(
                action,
                userId,
              );

              logger.info(
                LogCategory.IA,
                `iaService.request: Action ${action.type} traitée avec succès${
                  action.hadRecovery ? ' (avec récupération)' : ''
                }`,
              );

              return {
                success: true,
                data: (processingResult?.data as T) || (action.parsedData as T),
                cleanText,
                retryCount,
                hadRecovery: action.hadRecovery,
              };
            } else {
              // Action invalide
              logger.warn(
                LogCategory.IA,
                `iaService.request: Action ${action.type} invalidée: ${
                  action.validationMessage || 'Raison inconnue'
                }`,
              );

              // Si on a atteint le nombre maximum de tentatives, retourner l'erreur
              if (retryCount >= maxRetries) {
                return {
                  success: false,
                  error: `Action invalidée: ${
                    action.validationMessage || 'Raison inconnue'
                  }`,
                  cleanText,
                  retryCount,
                };
              }

              // Sinon, on réessaye
              retryCount++;
              continue;
            }
          } else {
            // Pas d'action DB détectée, on retourne le texte brut
            logger.info(
              LogCategory.IA,
              `iaService.request: Réponse textuelle reçue (${response.length} caractères)`,
            );

            return {
              success: true,
              data: response as unknown as T,
              cleanText,
              retryCount,
            };
          }
        } catch (error) {
          lastError = error;

          // Vérifier si l'erreur est récupérable
          const isRetryable =
            retryCount < maxRetries &&
            (error instanceof IaError
              ? error.type === IaErrorType.CONNECTION_ERROR ||
                error.type === IaErrorType.TIMEOUT_ERROR ||
                error.type === IaErrorType.RATE_LIMIT_ERROR
              : true);

          if (isRetryable) {
            retryCount++;
            logger.warn(
              LogCategory.IA,
              `iaService.request: Erreur récupérable, nouvelle tentative ${retryCount}/${maxRetries}`,
            );
            continue;
          } else {
            logger.error(
              LogCategory.IA,
              `iaService.request: Erreur non récupérable`,
              error,
            );
            throw error;
          }
        }
      }

      // Si on arrive ici, c'est qu'on a dépassé le nombre maximum de tentatives
      logger.error(
        LogCategory.IA,
        `iaService.request: Nombre maximum de tentatives dépassé (${maxRetries})`,
      );

      throw lastError || new Error('Nombre maximum de tentatives dépassé');
    } catch (error) {
      const handled = IaErrorHandler.handle(
        error,
        'Erreur lors de la requête IA',
        IaErrorType.API_ERROR,
      );

      return {
        success: false,
        error: handled.message,
        retryCount,
      };
    }
  },

  /**
   * Appel à l'API Gemini avec gestion des erreurs spécifiques
   * @param prompt - Le prompt enrichi à envoyer
   * @returns La réponse textuelle de l'IA
   */
  async callGeminiApi(prompt: string): Promise<string> {
    try {
      // Récupérer le fournisseur IA de type Gemini
      const geminiProvider = iaProviderFactory.createProvider(
        IaProviderType.GEMINI,
      );

      // Envoyer la requête au fournisseur
      const response = await geminiProvider.sendRequest(prompt);

      // Retourner le texte de la réponse
      return response.text;
    } catch (error: unknown) {
      // Si c'est déjà une IaError, la propager
      if (error instanceof IaError) {
        throw error;
      }

      // Sinon, créer une nouvelle IaError
      throw new IaError(
        `Erreur lors de l'appel à l'API Gemini: ${
          error instanceof Error ? error.message : String(error)
        }`,
        IaErrorType.API_ERROR,
        error,
      );
    }
  },

  /**
   * Génère un repas via l'IA avec validation et récupération robustes
   * @param prompt - Prompt pour la génération de repas
   * @param context - Contexte supplémentaire
   */
  async generateMeal(
    prompt: string,
    context: Record<string, any> = {},
  ): Promise<IaServiceResponse<IaMealType>> {
    try {
      const result = await errorHandler.tryCatch(
        async () => {
          const response = await this.request<any>(prompt, context);

          if (!response.success || !response.data) {
            return response as IaServiceResponse<any>;
          }

          // Valider le résultat avec notre système de validation robuste
          const validationResult = await validateMealWithRecovery(
            typeof response.data === 'string'
              ? response.data
              : JSON.stringify(response.data),
          );

          if (!validationResult.success) {
            return {
              success: false,
              error: validationResult.message,
              cleanText: response.cleanText,
            };
          }

          return {
            success: true,
            data: validationResult.data,
            cleanText: response.cleanText,
            retryCount: response.retryCount,
            hadRecovery: validationResult.hadRecovery,
          };
        },
        'generateMeal',
        'Échec de la génération du repas',
        IaErrorType.BUSINESS_LOGIC_ERROR,
      );

      // Convertir explicitement le résultat au type attendu
      if (hasError(result)) {
        return {
          success: false,
          error: result.message,
        };
      }

      return result as IaServiceResponse<IaMealType>;
    } catch (error) {
      const handled = IaErrorHandler.handle(
        error,
        'Erreur lors de la génération du repas',
        IaErrorType.UNKNOWN_ERROR,
      );

      return {
        success: false,
        error: handled.message,
      };
    }
  },

  /**
   * Génère un plan nutritionnel via l'IA avec validation et récupération robustes
   * @param prompt - Prompt pour la génération de plan
   * @param context - Contexte supplémentaire
   */
  async generatePlan(
    prompt: string,
    context: Record<string, any> = {},
  ): Promise<IaServiceResponse<IaPlanType>> {
    try {
      const result = await errorHandler.tryCatch(
        async () => {
          const response = await this.request<any>(prompt, context);

          if (!response.success || !response.data) {
            return response as IaServiceResponse<any>;
          }

          // Valider le résultat avec notre système de validation robuste
          const validationResult = await validatePlanWithRecovery(
            typeof response.data === 'string'
              ? response.data
              : JSON.stringify(response.data),
          );

          if (!validationResult.success) {
            return {
              success: false,
              error: validationResult.message,
              cleanText: response.cleanText,
            };
          }

          return {
            success: true,
            data: validationResult.data,
            cleanText: response.cleanText,
            retryCount: response.retryCount,
            hadRecovery: validationResult.hadRecovery,
          };
        },
        'generatePlan',
        'Échec de la génération du plan nutritionnel',
        IaErrorType.BUSINESS_LOGIC_ERROR,
      );

      // Convertir explicitement le résultat au type attendu
      if (hasError(result)) {
        return {
          success: false,
          error: result.message,
        };
      }

      return result as IaServiceResponse<IaPlanType>;
    } catch (error) {
      const handled = IaErrorHandler.handle(
        error,
        'Erreur lors de la génération du plan nutritionnel',
        IaErrorType.UNKNOWN_ERROR,
      );

      return {
        success: false,
        error: handled.message,
      };
    }
  },
};
