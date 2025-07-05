/**
 * Interfaces standardisées pour les opérations nutritionnelles
 * Ces interfaces définissent les structures de données utilisées pour tous les calculs
 * et transformations nutritionnelles dans l'application.
 */

import { MealOrmProps, MealIngredientsOrmProps } from '@/db/schema';
import { NutritionDisplayMode } from '@/utils/enum/nutrition.enum';
import { MacroNutrientsBase } from '@/types/nutrition.type';

/**
 * Paramètres pour le calcul des valeurs nutritionnelles normalisées d'un repas
 * @version 2.0 - Refactorisation MCP, mai 2025
 */
export interface CalculateNormalizedNutritionParams {
  /** ID du repas pour lequel calculer les valeurs */
  mealId: number;
  /** Quantité en grammes (optionnel, utilise standardQuantity si non fourni) */
  quantity?: number;
  /** Mode d'affichage des valeurs nutritionnelles */
  displayMode?: NutritionDisplayMode;
  /** ID utilisateur pour vérification d'accès (sécurité) */
  userId?: number;
  /** Force le recalcul en ignorant le cache si true */
  forceRefresh?: boolean;
}

/**
 * Structure de base pour les macronutriments
 * @removed - Cette interface a été supprimée le 13 mai 2025.
 * Utiliser directement MacroNutrientsBase importé depuis @/types/nutrition.type
 *
 * Interface de référence:
 * export interface MacroNutrientsBase {
 *   calories: number;  // Calories en kcal
 *   protein: number;   // Protéines en grammes
 *   carbs: number;     // Glucides en grammes
 *   fat: number;       // Lipides en grammes
 * }
 */

/**
 * Résultat d'un calcul de nutrition normalisée
 * Format standardisé pour tous les handlers MCP
 */
export interface NormalizedNutritionResult {
  /** Indique si l'opération a réussi */
  success: boolean;
  /** Valeurs nutritionnelles normalisées */
  normalizedNutrition?: MacroNutrientsBase;
  /** Facteur utilisé pour la normalisation */
  normalizationFactor?: number;
  /** Poids total du repas en grammes */
  totalWeight?: number;
  /** Texte d'affichage formaté (ex: "Pour 100g") */
  displayText?: string;
  /** Message d'erreur en cas d'échec */
  error?: string;
}

/**
 * Paramètres pour obtenir le poids total d'un repas
 */
export interface GetMealWeightParams {
  /** ID du repas */
  mealId: number;
  /** ID utilisateur pour vérification d'accès (sécurité) */
  userId?: number;
}

/**
 * Résultat d'une requête de poids de repas
 */
export interface GetMealWeightResult {
  /** Indique si l'opération a réussi */
  success: boolean;
  /** Poids total du repas en grammes */
  totalWeight?: number;
  /** Nombre d'ingrédients dans le repas */
  ingredientCount?: number;
  /** Message d'erreur en cas d'échec */
  error?: string;
}

/**
 * Paramètres pour le calcul de la répartition des macronutriments
 */
export interface GetMacroBreakdownParams {
  /** ID du repas */
  mealId: number;
  /** ID utilisateur pour vérification d'accès */
  userId?: number;
  /** Mode d'affichage des valeurs nutritionnelles */
  displayMode?: NutritionDisplayMode;
  /** Quantité en grammes (optionnel) */
  quantity?: number;
}

/**
 * Structure détaillant la répartition des macronutriments
 */
export interface MacroBreakdown extends MacroNutrientsBase {
  /** Pourcentage des calories provenant des protéines */
  proteinPercentage: number;
  /** Pourcentage des calories provenant des glucides */
  carbsPercentage: number;
  /** Pourcentage des calories provenant des lipides */
  fatPercentage: number;
  /** Texte explicatif pour l'affichage */
  displayText?: string;
}

/**
 * Résultat d'une requête de répartition des macronutriments
 */
export interface GetMacroBreakdownResult {
  /** Indique si l'opération a réussi */
  success: boolean;
  /** Détails de la répartition des macronutriments */
  macroBreakdown?: MacroBreakdown;
  /** Message d'erreur en cas d'échec */
  error?: string;
}

/**
 * Paramètres pour le calcul des valeurs nutritionnelles d'un plan journalier
 */
export interface CalculateDailyPlanNutritionParams {
  /** ID du plan journalier */
  planId: number;
  /** ID de l'utilisateur */
  userId: number;
  /** Mode d'affichage des valeurs nutritionnelles */
  displayMode?: NutritionDisplayMode;
}

/**
 * Résultat du calcul des valeurs nutritionnelles d'un plan journalier
 */
export interface DailyPlanNutritionResult {
  /** Indique si l'opération a réussi */
  success: boolean;
  /** Valeurs nutritionnelles calculées */
  nutrition?: MacroNutrientsBase & {
    /** Poids total des repas du plan en grammes */
    totalWeight?: number;
    /** Facteur de normalisation utilisé */
    normalizationFactor?: number;
    /** Texte d'affichage pour l'UI */
    displayText?: string;
  };
  /** Message d'erreur en cas d'échec */
  error?: string;
}
