import { MealTypeEnum } from '@/utils/enum/meal.enum';

/**
 * Centralise la définition des clés React Query.
 * Utilise des tuples "as const" afin de conserver le type littéral.
 *
 * Exemple d'utilisation :
 *   const { data } = useQuery(queryKeys.dailyPlan(planId, date), () => ...);
 */
export const queryKeys = {
  // Détails d'un plan
  plan: (planId: number | string) => ['plan', planId] as const,

  // Détails d'un daily plan par date
  dailyPlan: (planId: number | string, date: string) =>
    ['dailyPlan', planId, date] as const,

  // Macros / nutrition (objectifs + consommé) pour une date
  dailyNutrition: (planId: number | string, date: string) =>
    ['dailyNutrition', planId, date] as const,

  // Repas d'un slot (B, L, S, D) pour une date

  // Objectifs nutritionnels globaux du plan
  nutritionGoals: (planId: number | string) => ['nutritionGoals', planId] as const,

  mealsBySlot: (
    planId: number | string,
    date: string,
    slot: MealTypeEnum,
  ) => ['mealsBySlot', planId, date, slot] as const,
};
