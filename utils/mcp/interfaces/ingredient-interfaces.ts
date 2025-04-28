import { MealUnitEnum } from '@/utils/enum/meal.enum';
import { IngredientStandardOrmProps } from '@/db/schema';
import { IaIngredientType } from '@/utils/validation/ia/ia.schemas';

// Interface pour addIngredientViaMCP
export interface AddIngredientParams {
  ingredientData: IaIngredientType;
}

export interface AddIngredientResult {
  success: boolean;
  ingredientId?: number;
  alreadyExists?: boolean;
  error?: string;
}

// Interface pour getIngredientsListViaMCP
export interface GetIngredientsListParams {
  search?: string;
  limit?: number;
}

export interface GetIngredientsListResult {
  success: boolean;
  ingredients?: IngredientStandardOrmProps[];
  error?: string;
}

// Interface pour updateIngredientViaMCP
export interface UpdateIngredientParams {
  ingredientId: number;
  data: Partial<IngredientStandardOrmProps>;
}

export interface UpdateIngredientResult {
  success: boolean;
  error?: string;
}

// Interface pour deleteIngredientViaMCP
export interface DeleteIngredientParams {
  ingredientId: number;
}

export interface DeleteIngredientResult {
  success: boolean;
  error?: string;
}
