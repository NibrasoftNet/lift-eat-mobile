import { queryKeys } from '@/utils/helpers/queryKeys';
import { mealPagesService } from '@/utils/services/pages/meal-pages.service';
import { MealTypeEnum } from '@/utils/enum/meal.enum';
import { useMealQuery } from '../useServiceQuery';

interface Params {
  planId: number | string;
  date?: string;
  slot: MealTypeEnum;
}

export function useMealsBySlot({ planId, date, slot }: Params) {
  return useMealQuery(
    queryKeys.mealsBySlot(planId, date ?? '', slot),
    () =>
      mealPagesService.getMealsList({
        planId: Number(planId),
        date: date ?? '',
        type: slot,
      }),
    {
      enabled: !!date,
    },
  );
}
