import { MealOrmProps } from '@/db/schema';
import { getCurrentUserIdSync } from '@/utils/helpers/userContext';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { invalidateCache, DataType } from '@/utils/helpers/queryInvalidation';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Service pour la gestion des repas
 * Centralise les opérations liées aux repas pour éviter la duplication de code et maintenir la cohérence
 */
export const mealService = {
  /**
   * Supprime un repas après vérification que l'utilisateur en est le propriétaire
   * @param mealId - Identifiant du repas à supprimer
   * @returns Promise avec le résultat de l'opération
   */
  async deleteMeal(mealId: number): Promise<{ success: boolean; error?: string }> {
    // 1. Récupérer l'ID utilisateur de manière centralisée
    const userId = getCurrentUserIdSync();
    if (!userId) {
      logger.error(LogCategory.AUTH, 'Authentication required to delete a meal');
      return { success: false, error: 'You must be logged in to delete a meal' };
    }

    logger.info(LogCategory.DATABASE, `Attempting to delete meal ${mealId} for user ${userId}`);
    
    try {
      // 2. Appeler le MCP pour effectuer la suppression
      // Le MCP effectue déjà les vérifications de propriété dans handleDeleteMeal
      const result = await sqliteMCPServer.deleteMealViaMCP(mealId, userId);
      
      if (!result.success) {
        logger.error(LogCategory.DATABASE, `Failed to delete meal: ${result.error}`);
        return { success: false, error: result.error || `Failed to delete meal ${mealId}` };
      }
      
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(LogCategory.DATABASE, `Error deleting meal: ${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Invalide le cache après une opération de suppression réussie
   * @param queryClient - Instance du queryClient pour la gestion du cache
   * @param mealId - Identifiant du repas supprimé
   */
  invalidateMealCache(queryClient: ReturnType<typeof useQueryClient>, mealId: number) {
    return invalidateCache(queryClient, DataType.MEAL, { 
      id: mealId, 
      invalidateRelated: true 
    });
  },

  /**
   * Vérifie si l'utilisateur est autorisé à modifier un repas
   * @param meal - Le repas à vérifier
   * @returns Booléen indiquant si l'utilisateur est autorisé
   */
  isAuthorizedToModify(meal: MealOrmProps): boolean {
    const userId = getCurrentUserIdSync();
    return userId === meal.creatorId;
  }
};
