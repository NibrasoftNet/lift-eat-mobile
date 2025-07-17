import { queryKeys } from '@/utils/helpers/queryKeys';
import { planPagesService } from '@/utils/services/pages/plan-pages.service';
import { usePlanQuery } from '../useServiceQuery';

export function usePlanDetails(planId: number | string) {
  return usePlanQuery(
    queryKeys.plan(planId),
    () => planPagesService.getPlanDetails(Number(planId)),
  );
}
