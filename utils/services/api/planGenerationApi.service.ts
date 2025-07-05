/**
 * Service dédié aux appels API pour la génération et la gestion des plans nutritionnels
 */
import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { IaError, IaErrorType } from '@/utils/services/ia/errorHandler';
import { IaPlanType } from '@/utils/validation/ia/ia.schemas';
import { getQueryClient } from '@/utils/helpers/queryClient';
import { planService } from '@/utils/services/core/plan-core.service';
// Importer GoalEnum depuis le fichier correct
import { GoalEnum } from '@/utils/enum/user-details.enum';
import { MealTypeEnum } from '@/utils/enum/meal.enum';

/**
 * Interface pour la réponse de création de plan
 */
export interface CreatePlanResponse {
  success: boolean;
  planId?: number;
  error?: string;
}

/**
 * Interface pour les paramètres de recherche de plans
 */
export interface SearchPlanParams {
  userId: number;
  goal?: GoalEnum;
  searchTerm?: string;
  limit?: number;
}

/**
 * Service API pour la génération et la gestion des plans nutritionnels
 */
export const planGenerationApiService = {
  /**
   * Crée un plan nutritionnel dans la base de données
   * @param plan Données du plan à créer
   * @param userId ID de l'utilisateur
   * @returns Réponse de création
   */
  async createPlan(
    plan: IaPlanType,
    userId: number,
  ): Promise<CreatePlanResponse> {
    try {
      logger.debug(
        LogCategory.IA,
        `Création du plan ${plan.name} pour l'utilisateur ${userId}`,
        'createPlan',
      );

      // Utiliser le MCP Server pour ajouter le plan
      const result = await sqliteMCPServer.addPlanViaMCP(plan, userId);

      if (!result.success) {
        logger.error(
          LogCategory.IA,
          `Erreur lors de la création du plan: ${result.error}`,
          'createPlan',
        );
        return {
          success: false,
          error: result.error,
        };
      }

      // Invalider le cache pour actualiser la liste des plans
      const queryClient = getQueryClient();
      if (queryClient) {
        logger.debug(
          LogCategory.IA,
          `Invalidation du cache des plans pour l'utilisateur ${userId}`,
          'createPlan',
        );
        await queryClient.invalidateQueries({
          predicate: (query) => {
            const queryKey = query.queryKey[0];
            return (
              typeof queryKey === 'string' && queryKey.startsWith('my-plans')
            );
          },
        });
      }

      logger.info(
        LogCategory.IA,
        `Plan ${plan.name} créé avec succès (ID: ${result.planId})`,
        'createPlan',
      );

      return {
        success: true,
        planId: result.planId,
      };
    } catch (error) {
      logger.error(
        LogCategory.IA,
        `Erreur lors de la création du plan: ${
          error instanceof Error ? error.message : String(error)
        }`,
        'createPlan',
      );

      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  },

  /**
   * Récupère un plan par son ID
   * @param planId ID du plan
   * @param userId ID de l'utilisateur
   * @returns Données du plan
   */
  async getPlanById(planId: number, userId: number): Promise<any> {
    try {
      logger.debug(
        LogCategory.IA,
        `Récupération du plan ${planId} pour l'utilisateur ${userId}`,
        'getPlanById',
      );

      // Utiliser la méthode disponible dans sqliteMCPServer - le serveur gère déjà l'accès à la base de données
      const result = await sqliteMCPServer.getPlanDetailsViaMCP(planId, userId);

      if (!result.success || !result.plan) {
        throw new IaError(
          `Plan ${planId} non trouvé`,
          IaErrorType.MISSING_DATA_ERROR,
        );
      }

      const plan = result.plan;

      // Vérifier que le plan appartient à l'utilisateur
      if (plan && plan.userId !== userId) {
        throw new IaError(
          `Plan ${planId} n'appartient pas à l'utilisateur ${userId}`,
          IaErrorType.UNAUTHORIZED_ERROR,
        );
      }

      return plan;
    } catch (error) {
      logger.error(
        LogCategory.IA,
        `Erreur lors de la récupération du plan: ${
          error instanceof Error ? error.message : String(error)
        }`,
        'getPlanById',
      );

      throw new IaError(
        `Erreur lors de la récupération du plan: ${
          error instanceof Error ? error.message : String(error)
        }`,
        IaErrorType.API_ERROR,
        error,
      );
    }
  },

  /**
   * Recherche des plans selon des critères
   * @param params Paramètres de recherche
   * @returns Liste des plans correspondants
   */
  async searchPlans(params: SearchPlanParams): Promise<any[]> {
    try {
      logger.debug(
        LogCategory.IA,
        `Recherche de plans pour l'utilisateur ${params.userId}`,
        'searchPlans',
      );

      // Utiliser la méthode disponible dans sqliteMCPServer - le serveur gère déjà l'accès à la base de données
      const result = await sqliteMCPServer.getPlansListViaMCP(params.userId);

      if (!result.success) {
        throw new IaError(
          `Erreur lors de la recherche de plans: ${result.error}`,
          IaErrorType.API_ERROR,
        );
      }

      return result.plans || [];
    } catch (error) {
      logger.error(
        LogCategory.IA,
        `Erreur lors de la recherche de plans: ${
          error instanceof Error ? error.message : String(error)
        }`,
        'searchPlans',
      );

      throw new IaError(
        `Erreur lors de la recherche de plans: ${
          error instanceof Error ? error.message : String(error)
        }`,
        IaErrorType.API_ERROR,
        error,
      );
    }
  },

  /**
   * Associer un repas à un plan nutritionnel
   * @param planId ID du plan
   * @param mealId ID du repas
   * @param dayIndex Jour de la semaine (0-6)
   * @param mealOrder Ordre du repas dans la journée
   * @param userId ID de l'utilisateur
   * @returns true si l'association a réussi
   */
  async associateMealToPlan(
    planId: number,
    mealId: number,
    dayIndex: number,
    mealOrder: number,
    userId: number,
  ): Promise<boolean> {
    try {
      logger.debug(
        LogCategory.IA,
        `Association du repas ${mealId} au plan ${planId} (jour ${dayIndex}, ordre ${mealOrder})`,
        'associateMealToPlan',
      );

      // Vérifier que le plan appartient à l'utilisateur
      const planResult = await sqliteMCPServer.getPlanDetailsViaMCP(
        planId,
        userId,
      );

      if (!planResult.success || !planResult.plan) {
        throw new IaError(
          `Plan ${planId} non trouvé`,
          IaErrorType.MISSING_DATA_ERROR,
        );
      }

      const plan = planResult.plan;

      if (plan && plan.userId !== userId) {
        throw new IaError(
          `Plan ${planId} n'appartient pas à l'utilisateur ${userId}`,
          IaErrorType.UNAUTHORIZED_ERROR,
        );
      }

      // Associer le repas au plan en utilisant la méthode correcte
      // Le MCP server possède déjà cette méthode
      const dailyPlanId = dayIndex; // On suppose que dailyPlanId correspond au jour de la semaine
      const result = await sqliteMCPServer.addMealToDailyPlanViaMCP(
        dailyPlanId,
        planId,
        mealId,
        mealOrder as unknown as MealTypeEnum,
      );

      if (!result.success) {
        throw new IaError(
          `Erreur lors de l'association du repas au plan: ${result.error}`,
          IaErrorType.API_ERROR,
        );
      }

      // Invalider le cache
      const queryClient = getQueryClient();
      if (queryClient) {
        await queryClient.invalidateQueries({
          predicate: (query) => {
            const queryKey = query.queryKey[0];
            return (
              typeof queryKey === 'string' &&
              (queryKey.startsWith('my-plans') || queryKey === `plan-${planId}`)
            );
          },
        });
      }

      logger.info(
        LogCategory.IA,
        `Repas ${mealId} associé au plan ${planId} avec succès`,
        'associateMealToPlan',
      );

      return true;
    } catch (error) {
      logger.error(
        LogCategory.IA,
        `Erreur lors de l'association du repas au plan: ${
          error instanceof Error ? error.message : String(error)
        }`,
        'associateMealToPlan',
      );

      throw new IaError(
        `Erreur lors de l'association du repas au plan: ${
          error instanceof Error ? error.message : String(error)
        }`,
        IaErrorType.API_ERROR,
        error,
      );
    }
  },

  /**
   * Supprime un plan
   * @param planId ID du plan
   * @param userId ID de l'utilisateur
   * @returns true si la suppression a réussi
   */
  async deletePlan(planId: number, userId: number): Promise<boolean> {
    try {
      logger.debug(
        LogCategory.IA,
        `Suppression du plan ${planId} pour l'utilisateur ${userId}`,
        'deletePlan',
      );

      // Vérifier que le plan appartient à l'utilisateur
      const planResult = await sqliteMCPServer.getPlanDetailsViaMCP(
        planId,
        userId,
      );

      if (!planResult.success || !planResult.plan) {
        throw new IaError(
          `Plan ${planId} non trouvé`,
          IaErrorType.MISSING_DATA_ERROR,
        );
      }

      const plan = planResult.plan;

      if (plan && plan.userId !== userId) {
        throw new IaError(
          `Plan ${planId} n'appartient pas à l'utilisateur ${userId}`,
          IaErrorType.UNAUTHORIZED_ERROR,
        );
      }

      // Supprimer le plan
      const result = await planService.deletePlan(planId);

      if (!result.success) {
        throw new IaError(
          `Erreur lors de la suppression du plan: ${result.error}`,
          IaErrorType.API_ERROR,
        );
      }

      // Invalider le cache
      const queryClient = getQueryClient();
      if (queryClient) {
        logger.debug(
          LogCategory.IA,
          `Invalidation du cache des plans pour l'utilisateur ${userId}`,
          'deletePlan',
        );
        await queryClient.invalidateQueries({
          predicate: (query) => {
            const queryKey = query.queryKey[0];
            return (
              typeof queryKey === 'string' && queryKey.startsWith('my-plans')
            );
          },
        });
      }

      logger.info(
        LogCategory.IA,
        `Plan ${planId} supprimé avec succès`,
        'deletePlan',
      );

      return true;
    } catch (error) {
      logger.error(
        LogCategory.IA,
        `Erreur lors de la suppression du plan: ${
          error instanceof Error ? error.message : String(error)
        }`,
        'deletePlan',
      );

      throw new IaError(
        `Erreur lors de la suppression du plan: ${
          error instanceof Error ? error.message : String(error)
        }`,
        IaErrorType.API_ERROR,
        error,
      );
    }
  },
};
