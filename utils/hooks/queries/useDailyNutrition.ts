import { queryKeys } from '@/utils/helpers/queryKeys';
import { planPagesService } from '@/utils/services/pages/plan-pages.service';
import { usePlanQuery } from '../useServiceQuery';

interface Params {
  planId: number | string;
  date?: string;
}

/**
 * Retourne les objectifs et le consommé pour une date donnée (nouveau modèle date-based).
 */
export function useDailyNutrition({ planId, date }: Params) {
  return usePlanQuery(
    queryKeys.dailyNutrition(planId, date ?? ''),
    () => planPagesService.getDailyPlanNutritionByDate(Number(planId), date ?? ''),
    {
      // N'exécute la requête que lorsque la date est définie
      enabled: !!date,
    },
  );
}
