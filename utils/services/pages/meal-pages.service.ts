import {
  MealFilters,
  MealPagesServiceInterface,
  OperationResult,
} from '@/utils/interfaces/pages.interface';
import {
  MealOrmProps,
  MealWithIngredientAndStandardOrmProps,
} from '@/db/schema';
import { mealService } from '@/utils/services/core/meal-core.service';
import { getCurrentUserIdSync } from '@/utils/helpers/userContext';
import type { QueryClient } from '@tanstack/react-query';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

/**
 * Service d'orchestration pour les pages de repas (UI)
 * Toute la logique métier doit passer par mealService.
 */
class MealPagesService implements MealPagesServiceInterface {
  async getMealsList(
    filters: MealFilters,
  ): Promise<
    OperationResult<{
      meals: MealOrmProps[];
      totalCount: number;
      pageInfo?: { currentPage: number; totalPages: number };
    }>
  > {
    try {
      const userId = getCurrentUserIdSync();
      if (!userId) {
        return {
          success: false,
          error: 'Utilisateur introuvable',
          data: { meals: [], totalCount: 0 },
        };
      }
      const params = { ...filters, userId } as any;
      const result = await mealService.getMealsList(params);

      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Erreur lors de la récupération des repas',
          data: { meals: [], totalCount: 0 },
        };
      }

      // Convertir le résultat au format attendu par l'interface OperationResult
      return {
        success: true,
        data: {
          meals: result.meals || [],
          totalCount: result.totalCount || 0,
          pageInfo: result.pageInfo,
        },
      };
    } catch (error) {
      logger.error(
        LogCategory.DATABASE,
        `Error in getMealsList service: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Une erreur est survenue',
        data: { meals: [], totalCount: 0 },
      };
    }
  }

  async getMealDetails(
    mealId: number,
  ): Promise<
    OperationResult<{
      meal: MealWithIngredientAndStandardOrmProps;
      ingredients: any[];
    }>
  > {
    const result = await mealService.getMealDetails(mealId);
    if (result.success && result.meal && result.ingredients) {
      return {
        success: true,
        data: {
          meal: result.meal as MealWithIngredientAndStandardOrmProps,
          ingredients: result.ingredients,
        },
      };
    }
    // Pour respecter le typage strict, retourner un objet MealWithIngredientAndStandardOrmProps vide si non trouvé
    return {
      success: false,
      error: result.error || 'Erreur lors de la récupération du repas',
      data: {
        meal: {} as MealWithIngredientAndStandardOrmProps,
        ingredients: [],
      },
    };
  }

  async toggleMealFavorite(
    mealId: number,
    isFavorite: boolean,
  ): Promise<OperationResult<any>> {
    try {
      const result = await mealService.updateMealFavoriteStatus(
        mealId,
        isFavorite,
      );
      if (!result.success) {
        return {
          success: false,
          error:
            result.error || 'Erreur lors de la mise à jour du statut favori',
        };
      }
      return { success: true };
    } catch (error) {
      logger.error(
        LogCategory.DATABASE,
        `Error in toggleMealFavorite service: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Une erreur est survenue',
      };
    }
  }

  async deleteMeal(mealId: number): Promise<OperationResult<any>> {
    return mealService.deleteMeal(mealId);
  }

  invalidateMealCache(queryClient: QueryClient, mealId: number) {
    return mealService.invalidateMealCache(queryClient, mealId);
  }
}

export const mealPagesService = new MealPagesService();
