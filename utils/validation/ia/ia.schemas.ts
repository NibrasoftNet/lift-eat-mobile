import { z } from 'zod';
import { 
  MealTypeEnum, 
  CuisineTypeEnum, 
  MealUnitEnum 
} from '@/utils/enum/meal.enum';
import { GoalEnum } from '@/utils/enum/user-details.enum';

/**
 * Schéma de validation pour un ingrédient dans une réponse IA
 */
export const iaIngredientSchema = z.object({
  name: z.string({
    required_error: "Le nom de l'ingrédient est requis",
    invalid_type_error: "Le nom doit être une chaîne de caractères",
  }).min(1, "Le nom de l'ingrédient est requis"),
  unit: z.nativeEnum(MealUnitEnum, {
    errorMap: () => ({ message: "L'unité n'est pas valide" }),
  }).default(MealUnitEnum.GRAMMES),
  quantity: z.number().positive("La quantité doit être positive").default(100),
  calories: z.number().nonnegative("Les calories ne peuvent pas être négatives").default(0),
  carbs: z.number().nonnegative("Les glucides ne peuvent pas être négatifs").default(0),
  protein: z.number().nonnegative("Les protéines ne peuvent pas être négatives").default(0),
  fat: z.number().nonnegative("Les lipides ne peuvent pas être négatifs").default(0),
});

/**
 * Type inféré pour un ingrédient validé
 */
export type IaIngredientType = z.infer<typeof iaIngredientSchema>;

/**
 * Schéma de validation pour un repas dans une réponse IA
 */
export const iaMealSchema = z.object({
  name: z.string({
    required_error: "Le nom du repas est requis",
    invalid_type_error: "Le nom doit être une chaîne de caractères",
  }).min(1, "Le nom du repas est requis"),
  type: z.nativeEnum(MealTypeEnum, {
    errorMap: () => ({ message: "Le type de repas n'est pas valide" }),
  }).default(MealTypeEnum.BREAKFAST),
  description: z.string().optional().default(""),
  cuisine: z.nativeEnum(CuisineTypeEnum, {
    errorMap: () => ({ message: "Le type de cuisine n'est pas valide" }),
  }).default(CuisineTypeEnum.GENERAL),
  calories: z.number().nonnegative("Les calories ne peuvent pas être négatives").default(0),
  carbs: z.number().nonnegative("Les glucides ne peuvent pas être négatifs").default(0),
  protein: z.number().nonnegative("Les protéines ne peuvent pas être négatives").default(0),
  fat: z.number().nonnegative("Les lipides ne peuvent pas être négatifs").default(0),
  unit: z.nativeEnum(MealUnitEnum, {
    errorMap: () => ({ message: "L'unité n'est pas valide" }),
  }).default(MealUnitEnum.GRAMMES),
  ingredients: z.array(iaIngredientSchema).optional().default([])
});

/**
 * Type inféré pour un repas validé
 */
export type IaMealType = z.infer<typeof iaMealSchema>;

/**
 * Schéma de validation pour un plan nutritionnel dans une réponse IA
 */
export const iaPlanSchema = z.object({
  name: z.string({
    required_error: "Le nom du plan est requis",
    invalid_type_error: "Le nom doit être une chaîne de caractères",
  }).min(1, "Le nom du plan est requis"),
  goal: z.nativeEnum(GoalEnum, {
    errorMap: () => ({ message: "L'objectif n'est pas valide" }),
  }),
  calories: z.number().nonnegative("Les calories ne peuvent pas être négatives").default(0),
  carbs: z.number().nonnegative("Les glucides ne peuvent pas être négatifs").default(0),
  protein: z.number().nonnegative("Les protéines ne peuvent pas être négatives").default(0),
  fat: z.number().nonnegative("Les lipides ne peuvent pas être négatifs").default(0),
  meals: z.array(iaMealSchema).min(1, "Au moins un repas est requis"),
});

/**
 * Type inféré pour un plan validé
 */
export type IaPlanType = z.infer<typeof iaPlanSchema>;

/**
 * Fonction pour valider les données d'ingrédient
 * @param data Données JSON d'ingrédient à valider
 * @returns Résultat de validation avec données typées ou erreurs
 */
export const validateIngredient = (data: string) => {
  try {
    const jsonData = JSON.parse(data);
    const result = iaIngredientSchema.safeParse(jsonData);

    if (result.success) {
      return {
        success: true,
        data: result.data,
      };
    } else {
      // Formatage des erreurs de validation
      const errorMessages = result.error.errors
        .map(({ path, message }) => `${path.join('.')}: ${message}`)
        .join('; ');
      
      return {
        success: false,
        errors: result.error,
        message: `Validation échouée: ${errorMessages}`
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Erreur de parsing JSON: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

/**
 * Fonction pour valider les données de repas
 * @param data Données JSON de repas à valider
 * @returns Résultat de validation avec données typées ou erreurs
 */
export const validateMeal = (data: string) => {
  try {
    const jsonData = JSON.parse(data);
    const result = iaMealSchema.safeParse(jsonData);

    if (result.success) {
      return {
        success: true,
        data: result.data,
      };
    } else {
      // Formatage des erreurs de validation
      const errorMessages = result.error.errors
        .map(({ path, message }) => `${path.join('.')}: ${message}`)
        .join('; ');
      
      return {
        success: false,
        errors: result.error,
        message: `Validation échouée: ${errorMessages}`
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Erreur de parsing JSON: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

/**
 * Fonction pour valider les données de plan
 * @param data Données JSON de plan à valider
 * @returns Résultat de validation avec données typées ou erreurs
 */
export const validatePlan = (data: string) => {
  try {
    const jsonData = JSON.parse(data);
    const result = iaPlanSchema.safeParse(jsonData);

    if (result.success) {
      return {
        success: true,
        data: result.data,
      };
    } else {
      // Formatage des erreurs de validation
      const errorMessages = result.error.errors
        .map(({ path, message }) => `${path.join('.')}: ${message}`)
        .join('; ');
      
      return {
        success: false,
        errors: result.error,
        message: `Validation échouée: ${errorMessages}`
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Erreur de parsing JSON: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};
