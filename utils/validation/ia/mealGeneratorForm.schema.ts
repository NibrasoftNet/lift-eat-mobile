import { z } from 'zod';
import { MealTypeEnum, CuisineTypeEnum } from '@/utils/enum/meal.enum';

// Énumération pour l'objectif de poids
export enum WeightGoalEnum {
  NONE = 'AUCUN',
  LOSE = 'PERDRE_DU_POIDS',
  GAIN = 'PRENDRE_DU_POIDS',
}

// Schéma pour un ingrédient dans le formulaire
export const ingredientSchema = z.object({
  id: z.number(),
  name: z.string(),
  quantity: z.number().min(1, 'La quantité doit être supérieure à 0'),
});

// Type dérivé du schéma d'ingrédient
export type IngredientFormType = z.infer<typeof ingredientSchema>;

// Schéma complet pour le formulaire de génération de repas
export const mealGeneratorFormSchema = z.object({
  mealType: z.nativeEnum(MealTypeEnum, {
    errorMap: () => ({ message: 'Type de repas invalide' }),
  }),
  cuisineType: z.nativeEnum(CuisineTypeEnum, {
    errorMap: () => ({ message: 'Type de cuisine invalide' }),
  }),
  // Objectif de poids (perdre ou prendre du poids)
  weightGoal: z
    .nativeEnum(WeightGoalEnum, {
      errorMap: () => ({ message: 'Objectif de poids invalide' }),
    })
    .default(WeightGoalEnum.NONE),
  // Préférence calorique (avec une marge de +/- 50 kcal)
  caloriesTarget: z
    .number()
    .min(0, 'La valeur doit être positive')
    .max(3000, 'La valeur est trop élevée')
    .optional(),
  selectedIngredients: z.array(ingredientSchema).optional(),
  specificRequirements: z.string().optional(),
});

// Type dérivé du schéma du formulaire
export type MealGeneratorFormType = z.infer<typeof mealGeneratorFormSchema>;

// Valeurs par défaut pour initialiser le formulaire
export const defaultMealGeneratorFormValues: MealGeneratorFormType = {
  mealType: MealTypeEnum.BREAKFAST,
  cuisineType: CuisineTypeEnum.GENERAL,
  weightGoal: WeightGoalEnum.NONE,
  caloriesTarget: undefined,
  selectedIngredients: [],
  specificRequirements: '',
};
