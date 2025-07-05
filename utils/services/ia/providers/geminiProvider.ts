/**
 * Implémentation du fournisseur d'IA pour Google Gemini
 */
import {
  IaProvider,
  IaProviderResponse,
  IaRequestOptions,
} from './iaProvider.interface';
import { IaError, IaErrorType } from '../errorHandler';
import { createIaLogger } from '../loggingEnhancer';

// Configuration du logger pour ce provider
const logger = createIaLogger('GeminiProvider');

/**
 * Configuration pour le fournisseur Gemini
 */
export interface GeminiConfig {
  apiKey: string; // Clé API Gemini
  apiBaseUrl?: string; // URL de base de l'API (optionnel)
  defaultModel?: string; // Modèle par défaut à utiliser
  timeout?: number; // Timeout par défaut en ms
  defaultMaxTokens?: number; // Nombre max de tokens par défaut
  defaultTemperature?: number; // Température par défaut
}

/**
 * Implémentation du fournisseur d'IA pour Google Gemini
 */
export class GeminiProvider implements IaProvider {
  readonly name = 'Gemini';
  readonly apiVersion = '2.0';
  readonly availableModels = [
    'gemini-2.0-flash',
    'gemini-2.0-pro',
    'gemini-1.5-flash',
    'gemini-1.5-pro',
  ];
  readonly defaultModel: string;

  private apiKey: string;
  private apiBaseUrl: string;
  private defaultTimeout: number;
  private defaultMaxTokens: number;
  private defaultTemperature: number;

  /**
   * Crée une nouvelle instance du fournisseur Gemini
   * @param config Configuration du fournisseur
   * @throws Error si la clé API n'est pas fournie
   */
  constructor(config: GeminiConfig) {
    if (!config.apiKey) {
      throw new Error('Gemini API key is required');
    }

    this.apiKey = config.apiKey;
    this.apiBaseUrl =
      config.apiBaseUrl || 'https://generativelanguage.googleapis.com';
    this.defaultModel = config.defaultModel || 'gemini-2.0-flash';
    this.defaultTimeout = config.timeout || 30000;
    this.defaultMaxTokens = config.defaultMaxTokens || 1024;
    this.defaultTemperature = config.defaultTemperature || 0.7;

    logger.debug('Configuration Gemini initialisée', 'constructor', {
      baseUrl: this.apiBaseUrl,
      model: this.defaultModel,
      apiKeyFormat: this.apiKey
        ? this.apiKey.startsWith('AIza')
          ? 'Standard Google'
          : 'Non-standard'
        : 'Non définie',
    });

    logger.info('GeminiProvider initialisé', 'constructor', {
      model: this.defaultModel,
      baseUrl: this.apiBaseUrl,
    });
  }

  /**
   * Envoie une requête à l'API Gemini
   * @param prompt Le prompt à envoyer
   * @param options Options de la requête
   * @returns Réponse de l'API
   * @throws IaError en cas d'erreur
   */
  /**
   * Crée un AbortSignal avec un timeout
   * @param timeoutMs Délai en millisecondes avant l'abandon automatique
   * @returns Un objet contenant le signal et une fonction pour nettoyer le timeout
   */
  private createTimeoutSignal(timeoutMs: number): {
    signal: AbortSignal;
    cleanup: () => void;
  } {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort(new Error('Timeout exceeded'));
    }, timeoutMs);

    return {
      signal: controller.signal,
      cleanup: () => clearTimeout(timeoutId),
    };
  }

  async sendRequest(
    prompt: string,
    options?: IaRequestOptions,
  ): Promise<IaProviderResponse> {
    const operationId = logger.beginOperation('sendRequest');

    // Créer un signal avec timeout
    const timeout = options?.timeout ?? this.defaultTimeout;
    const { signal, cleanup } = this.createTimeoutSignal(timeout);

    try {
      // Préparer les options
      const model = options?.modelName || this.defaultModel;
      const temperature = options?.temperature ?? this.defaultTemperature;
      const maxTokens = options?.maxTokens ?? this.defaultMaxTokens;

      // Construire l'URL avec le format approprié
      // Généralement formatée comme v1beta/models/gemini-pro:generateContent
      const url = `${this.apiBaseUrl}/v1beta/models/${model}:generateContent?key=${this.apiKey}`;

      logger.debug('URL API Gemini construite', 'sendRequest', {
        url: url.replace(this.apiKey, '***API_KEY***'), // Masquer la clé API dans les logs
        model: model,
      });

      // Préparer le corps de la requête
      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature,
          maxOutputTokens: maxTokens,
          topP: options?.topP,
          topK: 40,
          stopSequences: options?.stopSequences,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
        ],
      };

      logger.debug('Envoi de requête à Gemini', 'sendRequest', {
        model,
        temperature,
        maxTokens,
        promptPreview:
          prompt.substring(0, 100) + (prompt.length > 100 ? '...' : ''),
      });

      // Envoi de la requête
      const startTime = Date.now();
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal,
      });
      const latencyMs = Date.now() - startTime;

      // Nettoyer le timeout car la requête est terminée
      cleanup();

      // Vérifier si la requête a réussi
      if (!response.ok) {
        logger.error(
          `Réponse HTTP non-ok: ${response.status} ${response.statusText}`,
          'sendRequest',
        );

        let errorData;
        try {
          errorData = await response.json();
          logger.error("Détails de l'erreur:", 'sendRequest', errorData);
        } catch (e) {
          logger.error(
            "Impossible de parser la réponse d'erreur en JSON",
            'sendRequest',
          );
          errorData = null;
        }

        const errorMessage = errorData?.error?.message || response.statusText;
        const errorType = this.getErrorTypeFromStatus(response.status);

        throw new IaError(
          `Gemini API error (${response.status}): ${errorMessage}`,
          errorType,
          { status: response.status, errorData },
        );
      }

      // Extraire la réponse
      const responseData = await response.json();

      // Vérifier si la génération de contenu a été bloquée par les filtres de sécurité
      if (
        responseData.promptFeedback &&
        responseData.promptFeedback.blockReason
      ) {
        throw new IaError(
          `Contenu bloqué par Gemini: ${responseData.promptFeedback.blockReason}`,
          IaErrorType.CONTENT_FILTERED,
          responseData.promptFeedback,
        );
      }

      // Vérifier si des candidats ont été générés
      if (!responseData.candidates || responseData.candidates.length === 0) {
        throw new IaError(
          'Aucune réponse générée par Gemini',
          IaErrorType.EMPTY_RESPONSE,
          responseData,
        );
      }

      // Extraire le texte de la réponse
      const candidate = responseData.candidates[0];
      let text = '';

      if (candidate.content && candidate.content.parts) {
        for (const part of candidate.content.parts) {
          if (part.text) {
            text += part.text;
          }
        }
      }

      // Construire la réponse
      const providerResponse: IaProviderResponse = {
        text,
        usage: {
          // Gemini ne fournit pas directement ces informations, donc on les estime
          promptTokens: Math.ceil(prompt.length / 4), // Estimation grossière
          completionTokens: Math.ceil(text.length / 4), // Estimation grossière
          totalTokens: Math.ceil((prompt.length + text.length) / 4), // Estimation grossière
        },
        metadata: {
          modelName: model,
          finishReason: candidate.finishReason || 'STOP',
          latencyMs,
          rawResponse: responseData,
        },
      };

      logger.debug('Réponse reçue de Gemini', 'sendRequest', {
        latencyMs,
        textLength: text.length,
        finishReason: candidate.finishReason,
      });

      logger.endOperation(operationId, 'sendRequest', 'success', {
        model,
        latencyMs,
        textLength: text.length,
      });

      return providerResponse;
    } catch (error: unknown) {
      // S'assurer que le timeout est nettoyé en cas d'erreur
      cleanup();

      // Gérer le cas d'un timeout
      if (
        error instanceof Error &&
        (error.name === 'AbortError' ||
          error.name === 'TimeoutError' ||
          error.message.includes('Timeout exceeded'))
      ) {
        throw new IaError(
          'La requête à Gemini a été interrompue par un timeout',
          IaErrorType.TIMEOUT_ERROR,
          error,
        );
      }

      // Si c'est déjà une erreur IA, la propager
      if (error instanceof IaError) {
        logger.error(`Erreur Gemini: ${error.message}`, 'sendRequest', error);
        logger.endOperation(operationId, 'sendRequest', 'failure', {
          errorType: error.type,
        });
        throw error;
      }

      // Sinon, créer une nouvelle erreur IA
      const errorType = this.translateErrorType(error);
      const iaError = new IaError(
        `Erreur lors de l'appel à Gemini: ${
          error instanceof Error ? error.message : String(error)
        }`,
        errorType,
        error,
      );

      logger.error(`Erreur Gemini: ${iaError.message}`, 'sendRequest', error);
      logger.endOperation(operationId, 'sendRequest', 'failure', { errorType });

      throw iaError;
    }
  }

  /**
   * Vérifie si l'API Gemini est disponible
   * @returns true si l'API est disponible, false sinon
   */
  async checkAvailability(): Promise<boolean> {
    try {
      // Utiliser une requête légère pour vérifier la disponibilité
      const response = await this.sendRequest('Test de disponibilité', {
        temperature: 0.1,
        maxTokens: 10,
      });

      return !!response.text;
    } catch (error: unknown) {
      logger.warn(
        `Vérification de disponibilité de Gemini échouée: ${
          error instanceof Error ? error.message : String(error)
        }`,
        'checkAvailability',
      );
      return false;
    }
  }

  /**
   * Traduit une erreur HTTP en IaErrorType
   * @param status Code HTTP
   * @returns Type d'erreur standardisé
   */
  private getErrorTypeFromStatus(status: number): IaErrorType {
    switch (status) {
      case 400:
        return IaErrorType.VALIDATION_ERROR;
      case 401:
      case 403:
        return IaErrorType.UNAUTHORIZED_ERROR;
      case 404:
        return IaErrorType.API_ERROR;
      case 429:
        return IaErrorType.RATE_LIMIT_ERROR;
      case 500:
      case 502:
      case 503:
      case 504:
        return IaErrorType.CONNECTION_ERROR;
      default:
        return IaErrorType.API_ERROR;
    }
  }

  /**
   * Traduit une erreur spécifique à Gemini en IaErrorType
   * @param error Erreur spécifique à Gemini
   * @returns Type d'erreur standardisé
   */
  translateErrorType(error: unknown): IaErrorType {
    // Erreurs de timeout ou d'annulation
    if (
      error instanceof Error &&
      (error.name === 'AbortError' ||
        error.name === 'TimeoutError' ||
        error.message?.includes('timeout') ||
        error.message?.includes('aborted') ||
        error.message?.includes('Timeout exceeded'))
    ) {
      return IaErrorType.TIMEOUT_ERROR;
    }

    // Erreurs de réseau
    if (
      error instanceof Error &&
      (error.name === 'NetworkError' ||
        error.message?.includes('network') ||
        error.message?.includes('connection'))
    ) {
      return IaErrorType.CONNECTION_ERROR;
    }

    // Erreurs d'authentification
    if (
      error instanceof Error &&
      (error.message?.includes('api key') ||
        error.message?.includes('unauthorized') ||
        error.message?.includes('authentication'))
    ) {
      return IaErrorType.UNAUTHORIZED_ERROR;
    }

    // Erreurs de limite de taux
    if (
      error instanceof Error &&
      (error.message?.includes('rate limit') ||
        error.message?.includes('quota') ||
        error.message?.includes('exceeded'))
    ) {
      return IaErrorType.RATE_LIMIT_ERROR;
    }

    // Par défaut
    return IaErrorType.API_ERROR;
  }
}
