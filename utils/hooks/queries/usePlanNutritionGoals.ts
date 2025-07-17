import { queryKeys } from '@/utils/helpers/queryKeys';
import { planPagesService } from '@/utils/services/pages/plan-pages.service';
import { usePlanQuery } from '../useServiceQuery';

interface Params {
  planId: number | string;
}

/**
 * Objectifs nutritionnels globaux du plan
 */
export function usePlanNutritionGoals({ planId }: Params) {
  return usePlanQuery(
    queryKeys.nutritionGoals(planId),
    () => planPagesService.getPlanNutritionGoals(Number(planId)),
  );
}
