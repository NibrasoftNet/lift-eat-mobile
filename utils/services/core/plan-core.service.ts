import { PlanOrmProps, MealOrmProps } from '@/db/schema';
import { getCurrentUserIdSync } from '@/utils/helpers/userContext';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { nutritionCoreService } from '@/utils/services/core/nutrition-core.service';
import { invalidateCache, DataType } from '@/utils/helpers/queryInvalidation';
import { useQueryClient } from '@tanstack/react-query';
import { NutritionDisplayMode } from '@/utils/enum/nutrition.enum';
import { normalizeMacrosToReferenceWeight } from '@/utils/helpers/nutritionConverter.helper';
import { MealTypeEnum } from '@/utils/enum/meal.enum';
import { MacroNutrientsBase } from '@/types/nutrition.type';

/**
 * Interface pour les filtres de plans
 */
interface PlanFilters {
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * Service pour la gestion des plans nutritionnels
 * Centralise les opérations liées aux plans pour éviter la duplication de code et maintenir la cohérence
 */
export const planService = {
  /**
   * Récupère la liste des plans avec filtrage et pagination
   * @param filters Filtres à appliquer (recherche, pagination)
   * @returns Résultat avec les plans filtrés et paginés
   */
  async getPlansListFiltered(filters: PlanFilters): Promise<{
    success: boolean;
    error?: string;
    plans?: any[];
    totalCount?: number;
    pageInfo?: {
      currentPage: number;
      totalPages: number;
    };
  }> {
    try {
      // Récupérer l'ID utilisateur
      const userId = getCurrentUserIdSync();
      if (!userId) {
        logger.error(
          LogCategory.AUTH,
          'Utilisateur non authentifié pour récupérer les plans',
        );
        return { success: false, error: 'Utilisateur non authentifié' };
      }

      logger.info(
        LogCategory.DATABASE,
        'Récupération de la liste des plans avec filtres',
        { userId, filters },
      );

      // Appel au service MCP pour récupérer tous les plans
      const result = await sqliteMCPServer.getPlansListViaMCP(userId);

      if (!result || !result.success) {
        logger.error(
          LogCategory.DATABASE,
          'Échec de la récupération des plans',
          {
            error: result?.error,
          },
        );

        return {
          success: false,
          error: result?.error || 'Échec de la récupération des plans',
        };
      }

      // S'assurer que nous avons un tableau de plans
      const plans = Array.isArray(result.plans) ? result.plans : [];

      // Définir les options de pagination
      const page = filters.page || 1;
      const limit = filters.limit || 10;

      // Appliquer le filtre de recherche si spécifié
      let filteredPlans = plans;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredPlans = plans.filter((plan) =>
          plan.name?.toLowerCase().includes(searchLower),
        );
      }

      // Appliquer la pagination
      const totalCount = filteredPlans.length;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedPlans = filteredPlans.slice(startIndex, endIndex);

      // Calculer le nombre total de pages
      const totalPages = Math.ceil(totalCount / limit);

      return {
        success: true,
        plans: paginatedPlans,
        totalCount,
        pageInfo: {
          currentPage: page,
          totalPages,
        },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error(
        LogCategory.DATABASE,
        'Erreur lors de la récupération des plans',
        { error: errorMessage },
      );
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Récupère les détails d'un plan et ses plans journaliers
   * @param planId ID du plan
   * @returns Résultat avec les détails du plan et ses plans journaliers
   */
  async getPlanDetails(planId: number): Promise<{
    success: boolean;
    error?: string;
    plan?: any;
    dailyPlans?: any[];
  }> {
    try {
      // Récupérer l'ID utilisateur
      const userId = getCurrentUserIdSync();
      if (!userId) {
        logger.error(
          LogCategory.AUTH,
          'Utilisateur non authentifié pour récupérer les détails du plan',
        );
        return { success: false, error: 'Utilisateur non authentifié' };
      }

      logger.info(
        LogCategory.DATABASE,
        `Récupération des détails du plan ${planId}`,
      );

      // Récupérer les détails du plan
      const planResult = await sqliteMCPServer.getPlanDetailsViaMCP(
        planId,
        userId,
      );

      if (!planResult || !planResult.success) {
        logger.error(
          LogCategory.DATABASE,
          `Échec de la récupération du plan ${planId}`,
          {
            error: planResult?.error,
          },
        );

        return {
          success: false,
          error: planResult?.error || `Plan introuvable (ID: ${planId})`,
        };
      }

      // Vérifier que l'utilisateur est le propriétaire du plan
      if (!this.isAuthorizedToModify(planResult.plan)) {
        logger.error(
          LogCategory.AUTH,
          `L'utilisateur ${userId} n'est pas autorisé à voir le plan ${planId}`,
        );
        return {
          success: false,
          error: "Vous n'êtes pas autorisé à voir ce plan",
        };
      }

      // Les plans journaliers devraient déjà être inclus dans la réponse getPlanDetailsViaMCP
      // Si non inclus, nous créons un tableau vide par défaut
      const dailyPlans = planResult.dailyPlans || [];

      return {
        success: true,
        plan: planResult.plan,
        dailyPlans: dailyPlans,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error(
        LogCategory.DATABASE,
        `Erreur lors de la récupération des détails du plan ${planId}`,
        { error: errorMessage },
      );
      return { success: false, error: errorMessage };
    }
  },
  /**
   * Supprime un plan apru00e8s vu00e9rification que l'utilisateur en est le propriu00e9taire
   * @param planId - Identifiant du plan u00e0 supprimer
   * @returns Promise avec le ru00e9sultat de l'opu00e9ration
   */
  async deletePlan(
    planId: number,
  ): Promise<{ success: boolean; error?: string }> {
    // 1. Ru00e9cupu00e9rer l'ID utilisateur de maniu00e8re centralisu00e9e
    const userId = getCurrentUserIdSync();
    if (!userId) {
      logger.error(
        LogCategory.AUTH,
        'Authentication required to delete a plan',
      );
      return {
        success: false,
        error: 'You must be logged in to delete a plan',
      };
    }

    logger.info(
      LogCategory.DATABASE,
      `Attempting to delete plan ${planId} for user ${userId}`,
    );

    try {
      // 2. Appeler le MCP pour effectuer la suppression
      // Le MCP effectue du00e9ju00e0 les vu00e9rifications de propriu00e9tu00e9 dans handleDeletePlan
      const result = await sqliteMCPServer.deletePlanViaMCP(planId, userId);

      if (!result.success) {
        logger.error(
          LogCategory.DATABASE,
          `Failed to delete plan: ${result.error}`,
        );
        return {
          success: false,
          error: result.error || `Failed to delete plan ${planId}`,
        };
      }

      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error(
        LogCategory.DATABASE,
        `Error deleting plan: ${errorMessage}`,
      );
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Du00e9finit un plan comme plan actuel pour l'utilisateur
   * @param planId - Identifiant du plan u00e0 du00e9finir comme actuel
   * @returns Promise avec le ru00e9sultat de l'opu00e9ration
   */
  async setCurrentPlan(
    planId: number,
  ): Promise<{ success: boolean; error?: string }> {
    const userId = getCurrentUserIdSync();
    if (!userId) {
      logger.error(
        LogCategory.AUTH,
        'Authentication required to set current plan',
      );
      return {
        success: false,
        error: 'You must be logged in to set current plan',
      };
    }

    logger.info(
      LogCategory.DATABASE,
      `Attempting to set plan ${planId} as current for user ${userId}`,
    );

    try {
      const result = await sqliteMCPServer.setCurrentPlanViaMCP(planId, userId);

      if (!result.success) {
        logger.error(
          LogCategory.DATABASE,
          `Failed to set current plan: ${result.error}`,
        );
        return {
          success: false,
          error: result.error || `Failed to set plan ${planId} as current`,
        };
      }

      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error(
        LogCategory.DATABASE,
        `Error setting current plan: ${errorMessage}`,
      );
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Invalide le cache apru00e8s une opu00e9ration sur un plan
   * @param queryClient - Instance du queryClient pour la gestion du cache
   * @param planId - Identifiant du plan modifiu00e9
   */
  invalidatePlanCache(
    queryClient: ReturnType<typeof useQueryClient>,
    planId: number,
  ) {
    return invalidateCache(queryClient, DataType.PLAN, {
      id: planId,
      invalidateRelated: true,
    });
  },

  /**
   * Vu00e9rifie si l'utilisateur est autorisu00e9 u00e0 modifier un plan
   * @param plan - Le plan u00e0 vu00e9rifier
   * @returns Boolu00e9en indiquant si l'utilisateur est autorisu00e9
   */
  isAuthorizedToModify(plan?: PlanOrmProps): boolean {
    if (!plan) return false;
    const currentUserId = getCurrentUserIdSync();
    if (!currentUserId) return false;
    return plan.userId === currentUserId;
  },

  /**
   * Récupère la quantité d'un repas dans un plan journalier
   * @param dailyPlanId - ID du plan journalier
   * @param mealId - ID du repas
   * @returns Promise avec la quantité ou une erreur
   */
  async getMealQuantityInPlan(
    dailyPlanId: number,
    mealId: number,
  ): Promise<{ success: boolean; quantity?: number; error?: string }> {
    try {
      logger.info(
        LogCategory.DATABASE,
        `Getting quantity for meal ${mealId} in daily plan ${dailyPlanId}`,
      );
      return await sqliteMCPServer.getMealQuantityInPlanViaMCP(
        dailyPlanId,
        mealId,
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error(
        LogCategory.DATABASE,
        `Error getting meal quantity: ${errorMessage}`,
      );
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Méthode calculateMealNutrition supprimée le 13 mai 2025
   *
   * Cette méthode permettait de calculer les valeurs nutritionnelles d'un repas pour une quantité donnée.
   * Elle était dépréciée et a été supprimée dans le cadre de la refactorisation du module de nutrition.
   *
   * Alternatives recommandées :
   * - nutritionEngine.getMealNutrition(mealId, quantity, displayMode)
   * - nutritionPagesService.getMealNutritionForDisplay(mealId, quantity, displayMode)
   */

  /**
   * Met à jour la quantité d'un repas dans un plan journalier
   * @param dailyPlanId - ID du plan journalier
   * @param mealId - ID du repas
   * @param newQuantity - Nouvelle quantité
   * @returns Promise avec le résultat de l'opération
   */
  async updateMealQuantityInPlan(
    dailyPlanId: number,
    mealId: number,
    newQuantity: number,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      logger.info(
        LogCategory.DATABASE,
        `Updating quantity for meal ${mealId} in daily plan ${dailyPlanId} to ${newQuantity}`,
      );
      return await sqliteMCPServer.updateMealQuantityInPlanViaMCP(
        dailyPlanId,
        mealId,
        newQuantity,
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error(
        LogCategory.DATABASE,
        `Error updating meal quantity: ${errorMessage}`,
      );
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Retire un repas d'un plan journalier
   * @param dailyPlanId - ID du plan journalier
   * @param mealId - ID du repas à retirer
   * @returns Promise avec le résultat de l'opération
   */
  async removeMealFromDailyPlan(
    dailyPlanId: number,
    mealId: number,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      logger.info(
        LogCategory.DATABASE,
        `Removing meal ${mealId} from daily plan ${dailyPlanId}`,
      );
      return await sqliteMCPServer.removeMealFromDailyPlanViaMCP(
        dailyPlanId,
        mealId,
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error(
        LogCategory.DATABASE,
        `Error removing meal from daily plan: ${errorMessage}`,
      );
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Calcule les valeurs nutritionnelles d'un plan journalier
   * Cette méthode est dépréciée et ne devrait plus être utilisée directement.
   * Utilisez nutritionEngine.getPlanNutrition() à la place.
   *
   * @param dailyPlanId ID du plan journalier
   * @param displayMode Mode d'affichage (default: AS_IS pour plans)
   * @returns Valeurs nutritionnelles calculées
   */
  /**
   * Crée un nouveau plan nutritionnel
   * @param planData Données du plan à créer
   * @returns Résultat avec l'ID du plan créé
   */
  async createPlan(planData: any): Promise<{
    success: boolean;
    error?: string;
    planId?: number;
  }> {
    try {
      // Récupérer l'ID utilisateur
      const userId = getCurrentUserIdSync();
      if (!userId) {
        logger.error(
          LogCategory.AUTH,
          'Utilisateur non authentifié pour créer un plan',
        );
        return { success: false, error: 'Utilisateur non authentifié' };
      }

      logger.info(LogCategory.DATABASE, "Création d'un nouveau plan", {
        planData,
      });

      // Valider les données du plan
      if (!planData.name) {
        return { success: false, error: 'Le nom du plan est requis' };
      }

      // Créer le plan via MCP en passant les données du plan et l'ID utilisateur séparément
      const result = await sqliteMCPServer.createPlanViaMCP(planData, userId);

      if (!result || !result.success) {
        logger.error(LogCategory.DATABASE, 'Échec de la création du plan', {
          error: result?.error,
        });

        return {
          success: false,
          error: result?.error || 'Échec de la création du plan',
        };
      }

      return {
        success: true,
        planId: result.planId,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error(LogCategory.DATABASE, 'Erreur lors de la création du plan', {
        error: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Récupère le plan courant de l'utilisateur
   * @returns Résultat avec le plan courant
   */
  async getCurrentPlan(): Promise<{
    success: boolean;
    error?: string;
    plan?: any;
  }> {
    try {
      // Récupérer l'ID utilisateur
      const userId = getCurrentUserIdSync();
      if (!userId) {
        logger.error(
          LogCategory.AUTH,
          'Utilisateur non authentifié pour récupérer le plan courant',
        );
        return { success: false, error: 'Utilisateur non authentifié' };
      }

      logger.info(
        LogCategory.DATABASE,
        "Récupération du plan courant pour l'utilisateur",
        { userId },
      );

      // Récupérer le plan courant via MCP
      const result = await sqliteMCPServer.getCurrentPlanViaMCP(userId);

      if (!result || !result.success) {
        logger.error(
          LogCategory.DATABASE,
          'Échec de la récupération du plan courant',
          {
            error: result?.error,
          },
        );

        return {
          success: false,
          error: result?.error || 'Échec de la récupération du plan courant',
        };
      }

      return {
        success: true,
        plan: result.plan,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error(
        LogCategory.DATABASE,
        'Erreur lors de la récupération du plan courant',
        { error: errorMessage },
      );
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Ajoute un repas à un plan journalier
   * @param dailyPlanId ID du plan journalier
   * @param mealId ID du repas à ajouter
   * @param quantity Quantité du repas (poids en grammes)
   * @param mealType Type du repas (optionnel)
   * @returns Résultat de l'opération
   */
  async addMealToDailyPlan(
    dailyPlanId: number,
    mealId: number,
    quantity: number = 100,
    mealType?: MealTypeEnum,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Valider que la quantité est positive
      if (isNaN(quantity) || quantity <= 0) {
        logger.error(
          LogCategory.FORM,
          'La quantité du repas doit être positive',
        );
        return {
          success: false,
          error: 'La quantité du repas doit être positive',
        };
      }

      logger.info(
        LogCategory.DATABASE,
        `Ajout du repas ${mealId} au plan journalier ${dailyPlanId}`,
        {
          quantity,
          mealType,
        },
      );

      // Ajouter le repas au plan journalier via MCP
      const result = await sqliteMCPServer.addMealToDailyPlanViaMCP(
        dailyPlanId,
        mealId,
        quantity,
        mealType,
      );

      if (!result || !result.success) {
        logger.error(
          LogCategory.DATABASE,
          `Échec de l'ajout du repas ${mealId} au plan journalier ${dailyPlanId}`,
          {
            error: result?.error,
          },
        );

        return {
          success: false,
          error:
            result?.error || `Échec de l'ajout du repas au plan journalier`,
        };
      }

      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error(
        LogCategory.DATABASE,
        `Erreur lors de l'ajout du repas ${mealId} au plan journalier ${dailyPlanId}`,
        {
          error: errorMessage,
        },
      );
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Met à jour un plan existant
   * @param planId ID du plan à mettre à jour
   * @param planData Données du plan à mettre à jour
   * @returns Résultat de l'opération
   */
  async updatePlan(
    planId: number,
    planData: any,
  ): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      // Récupérer l'ID utilisateur
      const userId = getCurrentUserIdSync();
      if (!userId) {
        logger.error(
          LogCategory.AUTH,
          'Utilisateur non authentifié pour mettre à jour un plan',
        );
        return { success: false, error: 'Utilisateur non authentifié' };
      }

      logger.info(LogCategory.DATABASE, `Mise à jour du plan ${planId}`, {
        planData,
      });

      // Récupérer le plan existant pour vérifier les droits
      const existingPlanResult = await sqliteMCPServer.getPlanDetailsViaMCP(
        planId,
        userId,
      );

      if (!existingPlanResult || !existingPlanResult.success) {
        logger.error(LogCategory.DATABASE, `Plan introuvable (ID: ${planId})`);
        return { success: false, error: `Plan introuvable (ID: ${planId})` };
      }

      // Vérifier que l'utilisateur est le propriétaire du plan
      if (!this.isAuthorizedToModify(existingPlanResult.plan)) {
        logger.error(
          LogCategory.AUTH,
          `L'utilisateur ${userId} n'est pas autorisé à modifier le plan ${planId}`,
        );
        return {
          success: false,
          error: "Vous n'êtes pas autorisé à modifier ce plan",
        };
      }

      // Valider les données du plan
      if (!planData.name) {
        return { success: false, error: 'Le nom du plan est requis' };
      }

      // Préparer les données à envoyer au MCP
      const planToUpdate = {
        ...planData,
        id: planId,
      };

      // Mettre à jour le plan via MCP
      const result = await sqliteMCPServer.updatePlanViaMCP(
        planId,
        planToUpdate,
        userId,
      );

      if (!result || !result.success) {
        logger.error(
          LogCategory.DATABASE,
          `Échec de la mise à jour du plan ${planId}`,
          {
            error: result?.error,
          },
        );

        return {
          success: false,
          error: result?.error || `Échec de la mise à jour du plan ${planId}`,
        };
      }

      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error(
        LogCategory.DATABASE,
        `Erreur lors de la mise à jour du plan ${planId}`,
        { error: errorMessage },
      );
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Méthode calculateDailyPlanNutrition supprimée le 13 mai 2025
   *
   * Cette méthode permettait de calculer les valeurs nutritionnelles d'un plan journalier.
   * Elle a été supprimée dans le cadre de la refactorisation du module de nutrition
   * pour centraliser la logique nutritionnelle dans le nutritionEngine et éviter les cycles de dépendances.
   *
   * Alternatives recommandées :
   * - nutritionEngine.getDailyPlanNutrition(dailyPlanId, displayMode)
   * - nutritionPagesService.getDailyPlanMacrosForDisplay(dailyPlanId, displayMode)
   */
};
