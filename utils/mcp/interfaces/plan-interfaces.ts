import { NutritionGoalSchemaFormData } from '@/utils/validation/plan/nutrition-goal.validation';
import { PlanOrmProps, DailyPlanOrmProps } from '@/db/schema';
import { MealTypeEnum } from '@/utils/enum/meal.enum';

// Interfaces pour createPlanViaMCP
export interface CreatePlanParams {
  data: NutritionGoalSchemaFormData & { startDate?: string };
  userId: number;
}

export interface PlanResult {
  success: boolean;
  planId?: number;
  error?: string;
}

// Interfaces pour createDailyPlansViaMCP
export interface CreateDailyPlansParams {
  planId: number;
  durationWeeks: number;
  transaction?: any; // Typed as 'any' for now, could be better typed
}

export interface DailyPlansResult {
  success: boolean;
  error?: string;
}

// Interface générique pour les résultats basiques (success/error)
export interface BasicResult {
  success: boolean;
  error?: string;
}

// Interface pour updatePlanViaMCP
export interface UpdatePlanParams {
  planId: number;
  data: Partial<PlanOrmProps>;
  userId: number; // ID de l'utilisateur qui effectue la mise à jour, obligatoire pour la sécurité
}

// Interface pour deletePlanViaMCP
export interface DeletePlanParams {
  planId: number;
  userId: number; // ID de l'utilisateur qui effectue la suppression, obligatoire pour la sécurité
}

export interface DeletePlanResult {
  success: boolean;
  planId?: number;
  error?: string;
}

// Interface pour getPlanWithDailyPlansViaMCP
export interface GetPlanWithDailyPlansParams {
  planId: number;
}

export interface GetPlanWithDailyPlansResult {
  success: boolean;
  plan?: PlanOrmProps & { dailyPlans: DailyPlanOrmProps[] };
  error?: string;
}

// Interface pour getPlanDetailsViaMCP
export interface GetPlanDetailsParams {
  planId: number | string;
  userId: number; // ID de l'utilisateur propriétaire du plan, obligatoire pour la sécurité
}

export interface GetPlanDetailsResult {
  success: boolean;
  plan?: PlanOrmProps;
  dailyPlans?: DailyPlanOrmProps[];
  error?: string;
}

// Interface pour getPlansListViaMCP
export interface GetPlansListResult {
  success: boolean;
  plans?: PlanOrmProps[];
  error?: string;
}

// Interface pour addDailyPlanViaMCP
export interface AddDailyPlanParams {
  planId: number;
  dailyPlanData: {
    date: string; // YYYY-MM-DD
    day?: string;
    calories?: number;
    carbs?: number;
    protein?: number;
    fat?: number;
  };
}

export interface AddDailyPlanResult {
  success: boolean;
  dailyPlanId?: number;
  error?: string;
}

// Interface pour addMealToDailyPlanViaMCP
export interface AddMealToDailyPlanParams {
  dailyPlanId: number;
  mealId: number;
  quantity?: number;
  mealType?: MealTypeEnum; // Type de repas spécifique (petit-déjeuner, déjeuner, dîner...)
}

export interface AddMealToDailyPlanResult {
  success: boolean;
  error?: string;
}

// Interface pour removeMealFromDailyPlanViaMCP
export interface RemoveMealFromDailyPlanParams {
  dailyPlanId: number;
  mealId: number;
}

export interface RemoveMealFromDailyPlanResult extends BasicResult {}

// Interface pour getMealQuantityInPlanViaMCP
export interface GetMealQuantityInPlanParams {
  dailyPlanId: number;
  mealId: number;
}

export interface GetMealQuantityInPlanResult {
  success: boolean;
  quantity?: number;
  error?: string;
}

// Interface pour updateMealQuantityInPlanViaMCP
export interface UpdateMealQuantityInPlanParams {
  dailyPlanId: number;
  mealId: number;
  newQuantity: number;
}

export interface UpdateMealQuantityInPlanResult {
  success: boolean;
  error?: string;
}

// Interface pour setCurrentPlanViaMCP
export interface SetCurrentPlanParams {
  planId: number;
  userId: number;
}

export interface SetCurrentPlanResult extends BasicResult {}

// Interface pour getCurrentPlanViaMCP
export interface GetCurrentPlanParams {
  userId: number;
}

export interface GetCurrentPlanResult {
  success: boolean;
  plan?: PlanOrmProps | null;
  error?: string;
}

// Interface pour getDailyPlanNutritionViaMCP
import { NutritionProgress } from '@/utils/interfaces/nutrition-progress.interface';

export interface GetDailyPlanNutritionParams {
  dailyPlanId: number;
  userId: number; // ID de l'utilisateur pour sécurité
}

export interface GetDailyPlanProgressParams {
  dailyPlanId: number;
  userId: number;
}

export interface GetDailyPlanProgressResult {
  success: boolean;
  error?: string;
  progress?: NutritionProgress;
}

export interface GetDailyPlanNutritionResult {
  success: boolean;
  error?: string;
  nutrition?: {
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    totalWeight: number;
  };
  progress?: NutritionProgress;
}
