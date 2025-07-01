import { MealTypeEnum } from '@/utils/enum/meal.enum';
import { MealOrmProps } from '@/db/schema';

// Enum for meal list filters
export enum MealListFilter {
  RECENT = 'recent',
  FAVORITES = 'favorites',
  PERSONAL = 'personal',
}

// Interface pour getMealsListViaMCP
export interface GetMealsListParams {
  userId: number;
  type?: MealTypeEnum;
  search?: string;
  limit?: number;
  page?: number;
  filter?: MealListFilter;
}

export interface GetMealsListResult {
  success: boolean;
  meals?: any[]; // Type plus précis à définir ultérieurement
  error?: string;
}

// Interface pour getMealDetailsViaMCP
export interface GetMealDetailsParams {
  mealId: number;
}

export interface GetMealDetailsResult {
  success: boolean;
  meal?: any; // Type plus précis à définir ultérieurement
  ingredients?: any[];
  error?: string;
}

// Interface pour createMealViaMCP
export interface CreateMealParams {
  data: Omit<MealOrmProps, 'id'>;
  userId: number;
  ingredients?: any[]; // Liste optionnelle d'ingrédients à associer au repas
}

export interface CreateMealResult {
  success: boolean;
  mealId?: number;
  error?: string;
  missingIngredients?: any[]; // Liste des ingrédients qui n'existent pas dans la base de données
}

// Interface pour updateMealViaMCP
export interface UpdateMealParams {
  mealId: number;
  data: Partial<MealOrmProps>;
  ingredients?: any[]; // IngredientWithStandardProps[] optionnel
  userId: number; // ID de l'utilisateur qui effectue la mise à jour, obligatoire pour la sécurité
}

export interface UpdateMealResult {
  success: boolean;
  error?: string;
}

// Interface pour deleteMealViaMCP
export interface DeleteMealParams {
  mealId: number;
  userId: number; // ID de l'utilisateur qui effectue la suppression, obligatoire pour la sécurité
}

export interface DeleteMealResult {
  success: boolean;
  error?: string;
}

// Interface pour addMealToDailyPlanViaMCP
export interface AddMealToDailyPlanParams {
  dailyPlanId: number;
  mealId: number;
  quantity: number;
  mealType?: MealTypeEnum;
}

export interface AddMealToDailyPlanResult {
  success: boolean;
  error?: string;
  relationId?: number;
}

// Interface pour updateMealQuantityInPlanViaMCP
export interface UpdateMealQuantityInPlanParams {
  dailyPlanId: number;
  mealId: number;
  quantity: number;
}

export interface UpdateMealQuantityInPlanResult {
  success: boolean;
  error?: string;
}

// Interface pour createNewMealViaMCP
export interface CreateNewMealParams {
  data: any; // MealFormData
  selectedIngredients: any[]; // IngredientWithStandardProps[]
  totalMacros: {
    totalCalories: number;
    totalCarbs: number;
    totalFats: number;
    totalProtein: number;
  };
  creatorId: number;
}

export interface CreateNewMealResult {
  success: boolean;
  mealId?: number;
  error?: string;
}
