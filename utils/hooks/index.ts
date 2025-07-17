/**
 * Point d'export central pour tous les hooks personnalisés
 * Facilite l'importation et évite les imports circulaires
 */

export {
  useServiceQuery,
  usePlanQuery,
  useMealQuery,
  useUserQuery,
  useProgressQuery,
} from './useServiceQuery';

export { usePlanDetails } from './queries/usePlanDetails';
export { useMealsBySlot } from './queries/useMealsBySlot';
export { useDailyNutrition } from './queries/useDailyNutrition';
export { useRemoveMealFromDailyPlan } from './mutations/useRemoveMealFromDailyPlan';
export { useMarkMealAsConsumed } from './mutations/useMarkMealAsConsumed';
