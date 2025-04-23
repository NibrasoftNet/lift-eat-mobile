import { NutritionGoalSchemaFormData } from '@/utils/validation/plan/nutrition-goal.validation';
import { PlanOrmProps, DailyPlanOrmProps } from '@/db/schema';

// Interfaces pour createPlanViaMCP
export interface CreatePlanParams {
  data: NutritionGoalSchemaFormData;
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
}

// Interface pour deletePlanViaMCP
export interface DeletePlanParams {
  planId: number;
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
  plan?: any; // Typed as 'any' for now, will need more specific typing
  error?: string;
}

// Interface pour getPlanDetailsViaMCP
export interface GetPlanDetailsParams {
  planId: number | string;
}

export interface GetPlanDetailsResult {
  success: boolean;
  plan?: any;
  dailyPlans?: any[];
  error?: string;
}

// Interface pour getPlansListViaMCP
export interface GetPlansListResult {
  success: boolean;
  plans?: any[];
  error?: string;
}

// Interface pour addDailyPlanViaMCP
export interface AddDailyPlanParams {
  planId: number;
  dailyPlanData: {
    day: string;
    week?: number;
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
