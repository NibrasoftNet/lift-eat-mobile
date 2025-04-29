import { MealFilters, MealPagesServiceInterface, OperationResult } from "@/utils/interfaces/pages.interface";
import { MealOrmProps, MealWithIngredientAndStandardOrmProps } from "@/db/schema";
import { mealService } from "@/utils/services/meal.service";
import type { QueryClient } from '@tanstack/react-query';

/**
 * Service d'orchestration pour les pages de repas (UI)
 * Toute la logique métier doit passer par mealService.
 */
class MealPagesService implements MealPagesServiceInterface {
  async getMealsList(filters: MealFilters): Promise<OperationResult<{ meals: MealOrmProps[]; totalCount: number; pageInfo?: { currentPage: number; totalPages: number } }>> {
    return mealService.getMealsList(filters);
  }

  async getMealDetails(mealId: number): Promise<OperationResult<{ meal: MealWithIngredientAndStandardOrmProps; ingredients: any[] }>> {
    const result = await mealService.getMealDetails(mealId);
    if (result.success && result.meal && result.ingredients) {
      return {
        success: true,
        data: {
          meal: result.meal as MealWithIngredientAndStandardOrmProps,
          ingredients: result.ingredients
        }
      };
    }
    // Pour respecter le typage strict, retourner un objet MealWithIngredientAndStandardOrmProps vide si non trouvé
    return {
      success: false,
      error: result.error || 'Erreur lors de la récupération du repas',
      data: {
        meal: {} as MealWithIngredientAndStandardOrmProps,
        ingredients: []
      }
    };
  }

  async deleteMeal(mealId: number): Promise<OperationResult<any>> {
    return mealService.deleteMeal(mealId);
  }

  invalidateMealCache(queryClient: QueryClient, mealId: number) {
    return mealService.invalidateMealCache(queryClient, mealId);
  }
}

export const mealPagesService = new MealPagesService();
