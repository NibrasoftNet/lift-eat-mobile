import { PlanOrmProps } from '@/db/schema';
import { getCurrentUserIdSync } from '@/utils/helpers/userContext';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { invalidateCache, DataType } from '@/utils/helpers/queryInvalidation';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Service pour la gestion des plans nutritionnels
 * Centralise les opu00e9rations liu00e9es aux plans pour u00e9viter la duplication de code et maintenir la cohu00e9rence
 */
export const planService = {
  /**
   * Supprime un plan apru00e8s vu00e9rification que l'utilisateur en est le propriu00e9taire
   * @param planId - Identifiant du plan u00e0 supprimer
   * @returns Promise avec le ru00e9sultat de l'opu00e9ration
   */
  async deletePlan(planId: number): Promise<{ success: boolean; error?: string }> {
    // 1. Ru00e9cupu00e9rer l'ID utilisateur de maniu00e8re centralisu00e9e
    const userId = getCurrentUserIdSync();
    if (!userId) {
      logger.error(LogCategory.AUTH, 'Authentication required to delete a plan');
      return { success: false, error: 'You must be logged in to delete a plan' };
    }

    logger.info(LogCategory.DATABASE, `Attempting to delete plan ${planId} for user ${userId}`);
    
    try {
      // 2. Appeler le MCP pour effectuer la suppression
      // Le MCP effectue du00e9ju00e0 les vu00e9rifications de propriu00e9tu00e9 dans handleDeletePlan
      const result = await sqliteMCPServer.deletePlanViaMCP(planId, userId);
      
      if (!result.success) {
        logger.error(LogCategory.DATABASE, `Failed to delete plan: ${result.error}`);
        return { success: false, error: result.error || `Failed to delete plan ${planId}` };
      }
      
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(LogCategory.DATABASE, `Error deleting plan: ${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Du00e9finit un plan comme plan actuel pour l'utilisateur
   * @param planId - Identifiant du plan u00e0 du00e9finir comme actuel
   * @returns Promise avec le ru00e9sultat de l'opu00e9ration
   */
  async setCurrentPlan(planId: number): Promise<{ success: boolean; error?: string }> {
    const userId = getCurrentUserIdSync();
    if (!userId) {
      logger.error(LogCategory.AUTH, 'Authentication required to set current plan');
      return { success: false, error: 'You must be logged in to set current plan' };
    }

    logger.info(LogCategory.DATABASE, `Attempting to set plan ${planId} as current for user ${userId}`);
    
    try {
      const result = await sqliteMCPServer.setCurrentPlanViaMCP(planId, userId);
      
      if (!result.success) {
        logger.error(LogCategory.DATABASE, `Failed to set current plan: ${result.error}`);
        return { success: false, error: result.error || `Failed to set plan ${planId} as current` };
      }
      
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(LogCategory.DATABASE, `Error setting current plan: ${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Invalide le cache apru00e8s une opu00e9ration sur un plan
   * @param queryClient - Instance du queryClient pour la gestion du cache
   * @param planId - Identifiant du plan modifiu00e9
   */
  invalidatePlanCache(queryClient: ReturnType<typeof useQueryClient>, planId: number) {
    return invalidateCache(queryClient, DataType.PLAN, { 
      id: planId, 
      invalidateRelated: true 
    });
  },

  /**
   * Vu00e9rifie si l'utilisateur est autorisu00e9 u00e0 modifier un plan
   * @param plan - Le plan u00e0 vu00e9rifier
   * @returns Boolu00e9en indiquant si l'utilisateur est autorisu00e9
   */
  isAuthorizedToModify(plan: PlanOrmProps): boolean {
    const userId = getCurrentUserIdSync();
    return userId === plan.userId;
  },

  /**
   * Récupère la quantité d'un repas dans un plan journalier
   * @param dailyPlanId - ID du plan journalier
   * @param mealId - ID du repas
   * @returns Promise avec la quantité ou une erreur
   */
  async getMealQuantityInPlan(
    dailyPlanId: number,
    mealId: number
  ): Promise<{ success: boolean; quantity?: number; error?: string }> {
    try {
      logger.info(LogCategory.DATABASE, `Getting quantity for meal ${mealId} in daily plan ${dailyPlanId}`);
      return await sqliteMCPServer.getMealQuantityInPlanViaMCP(dailyPlanId, mealId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(LogCategory.DATABASE, `Error getting meal quantity: ${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Calcule les valeurs nutritionnelles d'un repas pour une quantité donnée
   * @param mealId - ID du repas
   * @param quantity - Quantité pour laquelle calculer les valeurs
   * @returns Promise avec les valeurs nutritionnelles calculées
   */
  async calculateMealNutrition(
    mealId: number,
    quantity: number
  ): Promise<{
    success: boolean;
    error?: string;
    nutrition?: {
      calories: number;
      carbs: number;
      fat: number;
      protein: number;
    };
  }> {
    try {
      logger.info(LogCategory.DATABASE, `Calculating nutrition for meal ${mealId} with quantity ${quantity}`);
      return await sqliteMCPServer.calculateMealNutritionViaMCP(mealId, quantity);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(LogCategory.DATABASE, `Error calculating meal nutrition: ${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  },

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
    newQuantity: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      logger.info(LogCategory.DATABASE, `Updating quantity for meal ${mealId} in daily plan ${dailyPlanId} to ${newQuantity}`);
      return await sqliteMCPServer.updateMealQuantityInPlanViaMCP(dailyPlanId, mealId, newQuantity);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(LogCategory.DATABASE, `Error updating meal quantity: ${errorMessage}`);
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
    mealId: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      logger.info(LogCategory.DATABASE, `Removing meal ${mealId} from daily plan ${dailyPlanId}`);
      return await sqliteMCPServer.removeMealFromDailyPlanViaMCP(dailyPlanId, mealId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(LogCategory.DATABASE, `Error removing meal from daily plan: ${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  }
};
