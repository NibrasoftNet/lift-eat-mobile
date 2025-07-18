import { IngredientStandardOrmProps } from '../db/schema';

export type IngredientWithStandardProps = {
  quantity: number;
  calories: number;
  carbs: number;
  fat: number;
  protein: number;
  ingredientStandardId: number;
  ingredientsStandard: IngredientStandardOrmProps;
  unit?: string;
  /** URL ou chemin d'image déjà résolu */
  imageUrl?: string;
  /** Unité déjà formatée pour l'affichage */
  displayUnit?: string;
};
