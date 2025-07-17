import { useMutation, useQueryClient } from '@tanstack/react-query';
import { progressPagesService } from '@/utils/services/pages/progress-pages.service';
import { OperationResult } from '@/utils/interfaces/pages.interface';

interface Variables {
  dailyProgressId: number;
  mealId: number;
  dailyPlanMealId: number;
  consumed: boolean;
}

/**
 * Mutation hook pour marquer ou dé-marquer un repas comme consommé
 *
 * Ce hook encapsule l'appel au service de pages et gère l'invalidation
 * du cache de progression via `progressPagesService.invalidateProgressionCache`.
 */
export function useMarkMealAsConsumed() {
  const queryClient = useQueryClient();

  return useMutation<OperationResult<any>, Error, Variables>({
    mutationFn: async ({ dailyProgressId, mealId, dailyPlanMealId, consumed }) => {
      return progressPagesService.markMealAsConsumed(
        dailyProgressId,
        mealId,
        dailyPlanMealId,
        consumed,
      );
    },
    // Invalider uniquement la progression concernée
    onSuccess: async (_res, { dailyProgressId }) => {
      progressPagesService.invalidateProgressionCache(queryClient, dailyProgressId);
    },
  });
}
