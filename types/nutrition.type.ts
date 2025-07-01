/**
 * Types partagés pour les données nutritionnelles
 * Ces types assurent la cohérence entre l'IA et la base de données
 * 
 * STANDARD DE NORMALISATION:
 * Toutes les valeurs nutritionnelles sont stockées selon leurs valeurs brutes, mais 
 * affichées normalisées à 100g pour faciliter la comparaison entre produits/repas.
 */

import { NutritionUnits, DefaultNutritionUnits } from '../utils/constants/NutritionUnits';
import { NutritionDisplayMode } from '../utils/enum/nutrition.enum';

/**
 * Interface de base pour les macronutriments
 * Utilisée à la fois par l'IA et la DB
 */
export interface MacroNutrientsBase {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  unit?: string; // Unité de mesure pour les macros (g par défaut)
}

/**
 * Extension incluant les unités spécifiques pour chaque macro
 * Utilisée principalement pour l'affichage
 */
export interface MacroNutrientsExtended extends MacroNutrientsBase {
  caloriesUnit: string;
  proteinUnit: string;
  carbsUnit: string;
  fatUnit: string;
}

/**
 * Interface pour les totaux des macronutriments
 * Utilisée dans le store d'ingrédients
 */
export interface TotalMacroNutrients {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
}

/**
 * Interface pour les valeurs nutritionnelles ajustées par poids
 */
export interface AdjustedNutrients extends MacroNutrientsBase {
  originalWeight: number;
  adjustedWeight: number;
  adjustmentFactor: number;
}

/**
 * Interface pour les valeurs nutritionnelles normalisées (standard 100g)
 */
export interface NormalizedNutrients extends MacroNutrientsBase {
  referenceWeight: number; // Poids de référence (généralement 100g)
  originalWeight: number;  // Poids original avant normalisation
  normalizationFactor: number; // Facteur de normalisation appliqué
  displayMode: NutritionDisplayMode; // Mode d'affichage
}

// Note: Le type NutritionDisplayMode est maintenant importé depuis useNormalizedNutrition.ts

/**
 * Interface commune pour les ingrédients entre IA et DB
 */
export interface NutritionIngredientBase extends MacroNutrientsBase {
  id?: number;
  quantity: number;
  name: string;
  unit: string;
}

/**
 * Interface commune pour les repas entre IA et DB
 */
export interface NutritionMealBase extends MacroNutrientsBase {
  id?: number;
  name: string;
  mealWeight: number;
  totalIngredientsWeight?: number;
  ingredients?: NutritionIngredientBase[];
}

/**
 * Fonction pour créer un objet MacroNutrientsBase avec des valeurs par défaut
 */
export const createDefaultMacroNutrients = (): MacroNutrientsBase => ({
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  unit: DefaultNutritionUnits.MACROS,
});

/**
 * Fonction pour créer un objet TotalMacroNutrients avec des valeurs par défaut
 */
export const createDefaultTotalMacros = (): TotalMacroNutrients => ({
  totalCalories: 0,
  totalProtein: 0,
  totalCarbs: 0,
  totalFats: 0,
});

/**
 * Types d'ajustement pour les valeurs nutritionnelles
 */
export enum NutritionAdjustmentType {
  NONE = 'none',
  COOKING = 'cooking',
  PORTION = 'portion',
  INGREDIENT_SUBSTITUTE = 'ingredient_substitute',
}

/**
 * Facteurs d'ajustement par type de cuisson
 * Ces valeurs sont approximatives et basées sur des moyennes
 */
export const CookingAdjustmentFactors = {
  RAW: 1.0,
  BOILED: 0.9,  // Perte d'environ 10% des nutriments lors de l'ébullition
  STEAMED: 0.95, // Perte d'environ 5% lors de la cuisson à la vapeur
  FRIED: 1.2,   // Gain d'environ 20% de calories (absorption d'huile)
  BAKED: 0.85,  // Perte d'environ 15% (déshydratation)
  GRILLED: 0.8, // Perte d'environ 20% (perte de graisse + déshydratation)
};
