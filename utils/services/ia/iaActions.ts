import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { DetectedAction } from './responseParser';
import {
  IaMealType,
  IaPlanType,
  IaIngredientType,
} from '@/utils/validation/ia/ia.schemas';
import { getQueryClient } from '@/utils/helpers/queryClient';

/**
 * Interface pour le résultat du traitement d'une action
 */
export interface ProcessingResult {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Exécute les actions détectées dans la réponse de l'IA
 * @param action Action détectée
 * @param userId ID de l'utilisateur
 * @returns Résultat du traitement avec les données ou erreurs
 */
export async function processDatabaseAction(
  action: DetectedAction,
  userId: number,
): Promise<ProcessingResult> {
  try {
    // Vérifier si l'ID utilisateur est valide
    if (!userId) {
      logger.error(
        LogCategory.IA,
        `ID utilisateur invalide ou manquant: ${userId}`,
      );
      return {
        success: false,
        error: 'ID utilisateur invalide ou manquant',
      };
    }

    // Vérifier si l'action est valide avant de l'exécuter
    if (!action.isValid) {
      logger.error(
        LogCategory.IA,
        `Action non valide: ${action.validationMessage}`,
      );
      return {
        success: false,
        error: `Action non valide: ${
          action.validationMessage || 'Raison inconnue'
        }`,
      };
    }

    // Tracer les détails de l'action pour aider au débogage
    logger.info(
      LogCategory.IA,
      `Traitement de l'action: ${action.type} pour l'utilisateur ${userId}`,
    );
    logger.debug(
      LogCategory.IA,
      `Données de l'action: ${action.data.substring(0, 200)}...`,
    );

    // Traiter l'action en fonction de son type
    let result;

    switch (action.type) {
      case 'ADD_MEAL':
        if (action.parsedData) {
          result = await processMealAction(
            action.parsedData as IaMealType,
            userId,
          );
          return {
            success: true,
            data: {
              mealData: action.parsedData,
              ...result,
            },
          };
        }
        break;

      case 'ADD_PLAN':
        if (action.parsedData) {
          result = await processPlanAction(
            action.parsedData as IaPlanType,
            userId,
          );
          return {
            success: true,
            data: {
              planData: action.parsedData,
              ...result,
            },
          };
        }
        break;

      case 'ADD_INGREDIENT':
        if (action.parsedData) {
          result = await processIngredientAction(
            action.parsedData as IaIngredientType,
            userId,
          );
          return {
            success: true,
            data: {
              ingredientData: action.parsedData,
              ...result,
            },
          };
        }
        break;

      case 'NUTRITION_PLAN':
        result = await processNutritionPlanAction(action.data, userId);
        return {
          success: true,
          data: {
            nutritionPlanData: action.data,
            ...result,
          },
        };

      case 'MEAL_RECOMMENDATION':
        result = await processMealRecommendationAction(action.data, userId);
        return {
          success: true,
          data: {
            recommendationData: action.data,
            ...result,
          },
        };

      case 'PROGRESS_ANALYSIS':
        result = await processProgressAnalysisAction(action.data, userId);
        return {
          success: true,
          data: {
            analysisData: action.data,
            ...result,
          },
        };

      case 'NUTRITION_ADVICE':
        result = await processNutritionAdviceAction(action.data, userId);
        return {
          success: true,
          data: {
            adviceData: action.data,
            ...result,
          },
        };

      default:
        logger.warn(
          LogCategory.IA,
          `Type d'action non pris en charge: ${action.type}`,
        );
        return {
          success: false,
          error: `Type d'action non pris en charge: ${action.type}`,
        };
    }

    // Si nous arrivons ici, c'est qu'une erreur est survenue dans le switch
    return {
      success: false,
      error: 'Erreur lors du traitement des données',
    };
  } catch (error) {
    logger.error(
      LogCategory.IA,
      `Error processing database action: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Traite l'action d'ajout de repas
 * @param mealData Données du repas validées
 * @param userId ID de l'utilisateur
 * @returns Résultat du traitement
 */
async function processMealAction(
  mealData: IaMealType,
  userId: number,
): Promise<{ mealId?: number }> {
  try {
    logger.info(LogCategory.IA, `Processing meal action: ${mealData.name}`);

    // MODIFICATION: Utiliser le MCP Server au lieu de nutritionDatabaseService
    const result = await sqliteMCPServer.addMealViaMCP(mealData, userId);

    if (!result.success) {
      throw new Error(result.error);
    }

    logger.info(
      LogCategory.IA,
      `Meal added to database via MCP: ${mealData.name} (ID: ${result.mealId})`,
    );

    // Invalider le cache pour actualiser la liste des repas
    const queryClient = getQueryClient();
    if (queryClient) {
      logger.info(LogCategory.IA, `Invalidating meal cache for user ${userId}`);
      await queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey[0];
          return (
            typeof queryKey === 'string' && queryKey.startsWith('my-meals')
          );
        },
      });
    } else {
      logger.warn(
        LogCategory.IA,
        `QueryClient not available, could not invalidate cache`,
      );
    }

    return { mealId: result.mealId };
  } catch (error) {
    logger.error(
      LogCategory.IA,
      `Error processing meal action: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    throw error;
  }
}

/**
 * Traite l'action d'ajout de plan
 * @param planData Données du plan validées
 * @param userId ID de l'utilisateur
 * @returns Résultat du traitement
 */
async function processPlanAction(
  planData: IaPlanType,
  userId: number,
): Promise<{ planId?: number }> {
  try {
    logger.info(LogCategory.IA, `Processing plan action: ${planData.name}`);

    // Enrichir les données du plan pour une meilleure compatibilité avec addPlanViaMCP
    // On transforme d'abord en any pour pouvoir ajouter des propriétés qui ne sont pas dans IaPlanType
    const planToSave: any = {
      ...planData,
      generatedByAI: true,
      type: 'IA',
      // Ces propriétés ne sont pas dans IaPlanType mais sont nécessaires pour addPlanViaMCP
      durationWeeks: 4,
      initialWeight: 70,
      targetWeight: 70,
      // S'assurer que les propriétés essentielles sont présentes avec des valeurs par défaut si nécessaire
      calories: planData.calories || 2000,
      carbs: planData.carbs || 45,
      protein: planData.protein || 30,
      fat: planData.fat || 25,
    };

    // Log des données complètes du plan pour débogage
    logger.debug(
      LogCategory.IA,
      `Plan data to save: ${JSON.stringify(planToSave)}`,
    );

    const result = await sqliteMCPServer.addPlanViaMCP(planToSave, userId);

    if (!result.success) {
      throw new Error(result.error);
    }

    logger.info(
      LogCategory.IA,
      `Plan added to database via MCP: ${planData.name} (ID: ${result.planId})`,
    );

    // Invalider le cache pour actualiser la liste des plans
    const queryClient = getQueryClient();
    if (queryClient) {
      logger.info(
        LogCategory.IA,
        `Invalidating plans cache for user ${userId}`,
      );
      await queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey[0];
          return (
            typeof queryKey === 'string' &&
            (queryKey.includes('plans-list') ||
              queryKey.includes('plan-details'))
          );
        },
      });
    } else {
      logger.warn(
        LogCategory.IA,
        `QueryClient not available, could not invalidate cache`,
      );
    }

    return { planId: result.planId };
  } catch (error) {
    logger.error(
      LogCategory.IA,
      `Error processing plan action: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    throw error;
  }
}

/**
 * Traite l'action d'ajout d'ingrédient
 * @param ingredientData Données de l'ingrédient validées
 * @param userId ID de l'utilisateur (non utilisé pour les ingrédients)
 * @returns Résultat du traitement
 */
async function processIngredientAction(
  ingredientData: IaIngredientType,
  userId: number,
): Promise<{ ingredientId?: number; alreadyExists?: boolean }> {
  try {
    logger.info(
      LogCategory.IA,
      `Processing ingredient action: ${ingredientData.name}`,
    );

    // MODIFICATION: Utiliser le MCP Server au lieu de nutritionDatabaseService
    const result = await sqliteMCPServer.addIngredientViaMCP(ingredientData);

    if (!result.success) {
      throw new Error(result.error);
    }

    const status = result.alreadyExists
      ? `Ingredient already exists: ${ingredientData.name} (ID: ${result.ingredientId})`
      : `Ingredient added to database via MCP: ${ingredientData.name} (ID: ${result.ingredientId})`;

    logger.info(LogCategory.IA, status);

    return {
      ingredientId: result.ingredientId,
      alreadyExists: result.alreadyExists,
    };
  } catch (error) {
    logger.error(
      LogCategory.IA,
      `Error processing ingredient action: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    throw error;
  }
}

/**
 * Traite l'action de plan nutritionnel
 * @param planData Données du plan nutritionnel
 * @param userId ID de l'utilisateur
 * @returns Résultat du traitement
 */
async function processNutritionPlanAction(
  planData: string,
  userId: number,
): Promise<{ processed: boolean }> {
  try {
    logger.info(
      LogCategory.IA,
      `Processing nutrition plan action for user ${userId}`,
    );

    // Pour l'instant, on stocke simplement l'information du plan dans les logs
    // Ces données pourraient être utilisées pour l'historique des analyses ou
    // pour alimenter un tableau de bord de nutrition

    logger.info(LogCategory.IA, `Nutrition plan processed for user ${userId}`);

    return { processed: true };
  } catch (error) {
    logger.error(
      LogCategory.IA,
      `Error processing nutrition plan action: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    throw error;
  }
}

/**
 * Traite l'action de recommandation de repas
 * @param recommendationData Données de recommandation
 * @param userId ID de l'utilisateur
 * @returns Résultat du traitement
 */
async function processMealRecommendationAction(
  recommendationData: string,
  userId: number,
): Promise<{ processed: boolean }> {
  try {
    logger.info(
      LogCategory.IA,
      `Processing meal recommendation action for user ${userId}`,
    );

    // Pour l'instant, on stocke simplement l'information de la recommandation dans les logs
    // Ces données pourraient être utilisées pour alimenter un historique de recommandations

    logger.info(
      LogCategory.IA,
      `Meal recommendation processed for user ${userId}`,
    );

    return { processed: true };
  } catch (error) {
    logger.error(
      LogCategory.IA,
      `Error processing meal recommendation action: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    throw error;
  }
}

/**
 * Traite l'action d'analyse de progrès
 * @param analysisData Données d'analyse
 * @param userId ID de l'utilisateur
 * @returns Résultat du traitement
 */
async function processProgressAnalysisAction(
  analysisData: string,
  userId: number,
): Promise<{ processed: boolean }> {
  try {
    logger.info(
      LogCategory.IA,
      `Processing progress analysis action for user ${userId}`,
    );

    // Pour l'instant, on stocke simplement l'information de l'analyse dans les logs
    // Ces données pourraient être utilisées pour alimenter un historique d'analyses

    logger.info(
      LogCategory.IA,
      `Progress analysis processed for user ${userId}`,
    );

    return { processed: true };
  } catch (error) {
    logger.error(
      LogCategory.IA,
      `Error processing progress analysis action: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    throw error;
  }
}

/**
 * Traite l'action de conseil nutritionnel
 * @param adviceData Données de conseil
 * @param userId ID de l'utilisateur
 * @returns Résultat du traitement
 */
async function processNutritionAdviceAction(
  adviceData: string,
  userId: number,
): Promise<{ processed: boolean }> {
  try {
    logger.info(
      LogCategory.IA,
      `Processing nutrition advice action for user ${userId}`,
    );

    // Pour l'instant, on stocke simplement l'information du conseil dans les logs
    // Ces données pourraient être utilisées pour alimenter un historique de conseils

    logger.info(
      LogCategory.IA,
      `Nutrition advice processed for user ${userId}`,
    );

    return { processed: true };
  } catch (error) {
    logger.error(
      LogCategory.IA,
      `Error processing nutrition advice action: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    throw error;
  }
}
