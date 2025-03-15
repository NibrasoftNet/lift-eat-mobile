import { IngredientStandardOrmProps } from '../db/schema';

export type IngredientWithStandardProps = {
  quantity: number;
  calories: number;
  carbs: number;
  fat: number;
  protein: number;
  ingredientStandardId: number;
  ingredientsStandard: IngredientStandardOrmProps;
};
