import { useMutation, useQueryClient } from '@tanstack/react-query';
import { planPagesService } from '@/utils/services/pages/plan-pages.service';
import { OperationResult } from '@/utils/interfaces/pages.interface';
import { invalidateCache, DataType } from '@/utils/helpers/queryInvalidation';
import { queryKeys } from '@/utils/helpers/queryKeys';
import { MealTypeEnum } from '@/utils/enum/meal.enum';

interface Variables {
  planId: number;
  date: string;
  dailyPlanId: number;
  mealId: number;
  slot: MealTypeEnum;
}

/**
 * Mutation hook pour retirer un repas d'un plan journalier
 */
export function useRemoveMealFromDailyPlan() {
  const queryClient = useQueryClient();

  return useMutation<OperationResult<any>, Error, Variables>({
    mutationFn: async ({ dailyPlanId, mealId }: Variables) => {
      return planPagesService.removeMealFromDailyPlan(dailyPlanId, mealId);
    },
    onSuccess: async (_res, { planId, date, slot }) => {
      // Invalidation au niveau du plan, nutrition quotidienne et slot concerné
      await invalidateCache(queryClient, DataType.PLAN, {
        id: planId,
        invalidateRelated: true,
      });

      await queryClient.invalidateQueries({
        queryKey: queryKeys.nutritionGoals(planId),
      });

      await queryClient.invalidateQueries({
        queryKey: queryKeys.dailyNutrition(planId, date),
      });

      await queryClient.invalidateQueries({
        queryKey: queryKeys.mealsBySlot(planId, date, slot),
      });
    },
  });
}
