import { MealOrmProps } from '@/db/schema';
import {
  GetMealsListParams,
  MealListFilter,
} from '@/utils/mcp/interfaces/meal-interfaces';
import { CuisineTypeEnum } from '@/utils/enum/meal.enum';
import { getCurrentUserIdSync } from '@/utils/helpers/userContext';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { invalidateCache, DataType } from '@/utils/helpers/queryInvalidation';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Service pour la gestion des repas
 * Centralise les opérations liées aux repas pour éviter la duplication de code et maintenir la cohérence
 */
export const mealService = {
  /**
   * Récupère la liste des repas avec filtrage pour la page d'index
   */
  async getMealsList(
    filters: GetMealsListParams & {
      cuisineType?: CuisineTypeEnum;
      cuisine?: CuisineTypeEnum;
    },
  ): Promise<{
    success: boolean;
    meals: any[];
    totalCount: number;
    pageInfo?: { currentPage: number; totalPages: number };
    error?: string;
  }> {
    try {
      const userId = getCurrentUserIdSync();
      if (!userId) {
        logger.error(
          LogCategory.AUTH,
          'Authentication required to get meals list',
        );
        return {
          success: false,
          meals: [],
          totalCount: 0,
          error: 'You must be logged in to view meals',
        };
      }

      logger.info(LogCategory.DATABASE, 'Getting meals list via MCP Server', {
        userId,
        filters,
      });

      // Appel MCP pour récupérer la liste des repas
      // Transform filters to match MCP API expectations
      const mcpFilters = {
        ...filters,
        cuisine: filters.cuisineType || (filters as any).cuisine || undefined, // Convert cuisineType to cuisine
        cuisineType: undefined, // Remove cuisineType to avoid conflicts
      } as GetMealsListParams;

      const result = await sqliteMCPServer.getMealsListViaMCP({
        ...mcpFilters,
        userId,
      });

      if (!result.success) {
        logger.error(
          LogCategory.DATABASE,
          `Failed to get meals list: ${result.error}`,
        );
        return {
          success: false,
          meals: [],
          totalCount: 0,
          error: result.error || 'Error retrieving meals',
        };
      }

      // Vérifier la présence de repas dans le résultat
      if (!result.meals || result.meals.length === 0) {
        logger.warn(LogCategory.DATABASE, 'No meals returned from service');
      } else {
        logger.info(
          LogCategory.DATABASE,
          `Successfully retrieved ${result.meals.length} meals`,
        );
      }

      // La structure de retour correspond à l'interface GetMealsListResult
      return {
        success: true,
        meals: result.meals || [],
        totalCount: result.meals?.length || 0,
        pageInfo: filters.page
          ? {
              currentPage: filters.page,
              totalPages: Math.ceil(
                (result.meals?.length || 0) / (filters.limit || 10),
              ),
            }
          : undefined,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error(
        LogCategory.DATABASE,
        `Error getting meals list: ${errorMessage}`,
      );
      return { success: false, meals: [], totalCount: 0, error: errorMessage };
    }
  },

  /**
   * Récupère les détails d'un repas avec ingrédients et standards via MCP
   */
  async getMealDetails(
    mealId: number,
  ): Promise<{
    success: boolean;
    meal?: any;
    ingredients?: any[];
    error?: string;
  }> {
    try {
      const userId = getCurrentUserIdSync();
      if (!userId) {
        logger.error(
          LogCategory.AUTH,
          'Authentication required to get meal details',
        );
        return {
          success: false,
          error: 'You must be logged in to get meal details',
        };
      }
      // Appel MCP pour récupérer les détails complets du repas (avec ingrédients)
      const result = await sqliteMCPServer.getMealByIdWithIngredientsViaMCP(
        mealId,
        userId,
      );
      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Erreur lors de la récupération du repas',
        };
      }
      return {
        success: true,
        meal: result.meal,
        ingredients: result.ingredients,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error(
        LogCategory.DATABASE,
        `Erreur getMealDetails: ${errorMessage}`,
      );
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Supprime un repas après vérification que l'utilisateur en est le propriétaire
   * @param mealId - Identifiant du repas à supprimer
   * @returns Promise avec le résultat de l'opération
   */
  async deleteMeal(
    mealId: number,
  ): Promise<{ success: boolean; error?: string }> {
    // 1. Récupérer l'ID utilisateur de manière centralisée
    const userId = getCurrentUserIdSync();
    if (!userId) {
      logger.error(
        LogCategory.AUTH,
        'Authentication required to delete a meal',
      );
      return {
        success: false,
        error: 'You must be logged in to delete a meal',
      };
    }

    logger.info(
      LogCategory.DATABASE,
      `Attempting to delete meal ${mealId} for user ${userId}`,
    );

    try {
      // 2. Appeler le MCP pour effectuer la suppression
      // Le MCP effectue déjà les vérifications de propriété dans handleDeleteMeal
      const result = await sqliteMCPServer.deleteMealViaMCP(mealId, userId);

      if (!result.success) {
        logger.error(
          LogCategory.DATABASE,
          `Failed to delete meal: ${result.error}`,
        );
        return {
          success: false,
          error: result.error || `Failed to delete meal ${mealId}`,
        };
      }

      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error(
        LogCategory.DATABASE,
        `Error deleting meal: ${errorMessage}`,
      );
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Invalide le cache après une opération de suppression réussie
   * @param queryClient - Instance du queryClient pour la gestion du cache
   * @param mealId - Identifiant du repas supprimé
   */
  invalidateMealCache(
    queryClient: ReturnType<typeof useQueryClient>,
    mealId: number,
  ) {
    return invalidateCache(queryClient, DataType.MEAL, {
      id: mealId,
      invalidateRelated: true,
    });
  },

  /**
   * Vérifie si l'utilisateur est autorisé à modifier un repas
   * @param meal - Le repas à vérifier
   * @returns Booléen indiquant si l'utilisateur est autorisé
   */
  /**
   * Met à jour le statut favori d'un repas
   * @param mealId Identifiant du repas
   * @param isFavorite Nouveau statut favori
   */
  async updateMealFavoriteStatus(
    mealId: number,
    isFavorite: boolean,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const userId = getCurrentUserIdSync();
      if (!userId) {
        logger.error(
          LogCategory.AUTH,
          'Authentication required to update favorite status',
        );
        return {
          success: false,
          error: 'You must be logged in to update a meal',
        };
      }

      logger.info(
        LogCategory.DATABASE,
        `Updating favorite status for meal ${mealId} to ${isFavorite}`,
      );

      const result = await sqliteMCPServer.updateMealViaMCP(
        mealId,
        { isFavorite },
        undefined,
        userId,
      );
      if (!result.success) {
        logger.error(
          LogCategory.DATABASE,
          `Failed to update favorite status: ${result.error}`,
        );
        return {
          success: false,
          error: result.error || 'Failed to update favorite status',
        };
      }
      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error(
        LogCategory.DATABASE,
        `Error updating favorite status: ${errorMessage}`,
      );
      return { success: false, error: errorMessage };
    }
  },

  isAuthorizedToModify(meal: MealOrmProps): boolean {
    const userId = getCurrentUserIdSync();
    return userId === meal.creatorId;
  },
};
