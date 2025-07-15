import { useMutation, useQueryClient } from '@tanstack/react-query';

import { planPagesService } from '@/utils/services/pages/plan-pages.service';
import { OperationResult } from '@/utils/interfaces/pages.interface';
import { invalidateCache, DataType } from '@/utils/helpers/queryInvalidation';
import { queryKeys } from '@/utils/helpers/queryKeys';
import { MealTypeEnum } from '@/utils/enum/meal.enum';

interface Variables {
  /** ID du plan auquel appartient le daily plan */
  planId: number;
  /** Date au format ISO (yyyy-mm-dd) du daily plan */
  date: string;
  /** ID du daily plan */
  dailyPlanId: number;
  /** ID du repas à ajouter */
  mealId: number;
  /** Quantité du repas (par défaut 100g) */
  quantity?: number;
  /** Slot où ajouter le repas (BREAKFAST, LUNCH, DINNER, SNACK) */
  slot: MealTypeEnum;
}

/**
 * Mutation hook pour ajouter un repas à un daily plan.
 *
 * Il encapsule l'appel à `planPagesService.addMealToDailyPlan` et gère
 * l'invalidation des caches React-Query impactés :
 *   – Toutes les queries du plan (DataType.PLAN)
 *   – La nutrition quotidienne (`queryKeys.dailyNutrition`)
 *   – La liste des repas du slot concerné (`queryKeys.mealsBySlot`)
 */
export function useAddMealToDailyPlan() {
  const queryClient = useQueryClient();

  return useMutation<OperationResult<any>, Error, Variables>({
    mutationFn: async ({ dailyPlanId, mealId, quantity = 100, slot }) => {
      return planPagesService.addMealToDailyPlan(
        dailyPlanId,
        mealId,
        quantity,
        slot,
      );
    },
    // Invalidation des caches à la réussite
    onSuccess: async (_res, { planId, date, slot }) => {
      // 1) Invalidation générique du plan (cascade: PLANS_LIST, DAILY_PLAN, etc.)
      await invalidateCache(queryClient, DataType.PLAN, {
        id: planId,
        invalidateRelated: true,
      });

      // 2) Invalidation des objectifs nutritionnels (au cas où)
      await queryClient.invalidateQueries({
        queryKey: queryKeys.nutritionGoals(planId),
      });

      // 3) Invalidation de la nutrition quotidienne pour rafraîchir le tracker
      await queryClient.invalidateQueries({
        queryKey: queryKeys.dailyNutrition(planId, date),
      });

      // 4) Invalidation du slot concerné pour rafraîchir la liste des repas
      await queryClient.invalidateQueries({
        queryKey: queryKeys.mealsBySlot(planId, date, slot),
      });
    },
  });
}
