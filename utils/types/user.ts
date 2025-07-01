import { DietaryRestrictionEnum, AllergyEnum, GoalEnum } from '@/utils/enum/user-details.enum';

/**
 * Structure pour les objectifs nutritionnels de l'utilisateur
 */
export interface NutritionGoals {
  goal: GoalEnum;
  targetWeight?: number;
  dailyCalories: number;
  proteinPercentage: number;
  carbsPercentage: number;
  fatPercentage: number;
}

/**
 * Structure pour les détails de l'utilisateur
 */
export interface UserDetails {
  id: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  gender?: string;
  weight?: number;
  height?: number;
  physicalActivity?: string;
  nutritionGoals?: NutritionGoals;
  dietaryRestrictions?: DietaryRestrictionEnum[];
  allergies?: AllergyEnum[];
}
