import { MacroNutrientsBase } from '@/types/nutrition.type';

export interface NutritionProgress {
  current: MacroNutrientsBase;
  goals: MacroNutrientsBase;
  percentages: {
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
  };
  remaining: MacroNutrientsBase;
}

export interface GetNutritionProgressResult {
  success: boolean;
  error?: string;
  progress?: NutritionProgress;
}
