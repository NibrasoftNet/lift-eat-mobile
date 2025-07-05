/**
 * Utilitaires de conversion pour les données nutritionnelles
 *
 * Ce fichier centralise toutes les fonctions de conversion nutritionnelles
 * et standardise les arrondis pour garantir la cohérence des calculs.
 */

import {
  MacroNutrientsBase,
  NormalizedNutrients,
} from '@/types/nutrition.type';
import { NutritionDisplayMode } from '@/utils/enum/nutrition.enum';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

// Constants de validation
const MAX_CALORIES = 10000; // Maximum de calories par repas
const MAX_MACROS = 1000; // Maximum de grammes par macro
const MIN_WEIGHT = 0.1; // Poids minimum en grammes
const DEFAULT_REFERENCE_WEIGHT = 100; // Poids de référence standard (100g)

/**
 * Normalise les macronutriments pour un poids de référence (généralement 100g)
 *
 * @param macros Macronutriments à normaliser
 * @param originalWeight Poids original en g/ml
 * @param referenceWeight Poids de référence (défaut: 100g)
 * @param displayMode Mode d'affichage
 * @returns Macronutriments normalisés
 */
export function normalizeMacrosToReferenceWeight(
  macros: MacroNutrientsBase,
  originalWeight: number,
  referenceWeight: number = DEFAULT_REFERENCE_WEIGHT,
  displayMode: NutritionDisplayMode = NutritionDisplayMode.PER_100G,
): NormalizedNutrients {
  try {
    // Vérifier la validité des poids
    if (originalWeight <= 0 || referenceWeight <= 0) {
      throw new Error('Les poids doivent être strictement positifs');
    }

    // Calculer le facteur de normalisation
    const normalizationFactor = referenceWeight / originalWeight;

    logger.debug(
      LogCategory.NUTRITION,
      `Normalisation nutritionnelle de ${originalWeight}g vers ${referenceWeight}g`,
      { factor: normalizationFactor, mode: displayMode },
    );

    // Appliquer le facteur à tous les macronutriments
    const normalized: NormalizedNutrients = {
      calories: standardizeNutritionalRounding(
        macros.calories * normalizationFactor,
        'calories',
      ),
      protein: standardizeNutritionalRounding(
        macros.protein * normalizationFactor,
        'protein',
      ),
      carbs: standardizeNutritionalRounding(
        macros.carbs * normalizationFactor,
        'carbs',
      ),
      fat: standardizeNutritionalRounding(
        macros.fat * normalizationFactor,
        'fat',
      ),
      unit: macros.unit || 'g',
      referenceWeight,
      originalWeight,
      normalizationFactor,
      displayMode,
    };

    return normalized;
  } catch (error) {
    logger.error(
      LogCategory.NUTRITION,
      'Erreur lors de la normalisation des macros',
      { error, macros, originalWeight, referenceWeight },
    );

    // En cas d'erreur, retourner une structure valide mais avec des valeurs à zéro
    return {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      unit: macros.unit || 'g',
      referenceWeight,
      originalWeight,
      normalizationFactor: 1,
      displayMode,
    };
  }
}

/**
 * Standardise l'arrondi des valeurs nutritionnelles
 *
 * @param value Valeur à arrondir
 * @param nutrientType Type de nutriment (pour appliquer les règles spécifiques)
 * @returns Valeur arrondie
 */
export function standardizeNutritionalRounding(
  value: number,
  nutrientType: 'calories' | 'protein' | 'carbs' | 'fat' | 'weight',
): number {
  if (isNaN(value) || !isFinite(value)) {
    return 0;
  }

  // S'assurer que la valeur est un nombre avec précision limitée
  const preciseValue = parseFloat(value.toFixed(3));

  switch (nutrientType) {
    case 'calories':
      // Calories toujours arrondies à l'entier le plus proche
      return Math.round(preciseValue);
    case 'protein':
    case 'carbs':
    case 'fat':
      // Macronutriments avec une décimale pour plus de précision
      return Math.round(preciseValue * 10) / 10;
    case 'weight':
      // Poids avec une précision à 0.1g
      return Math.round(preciseValue * 10) / 10;
    default:
      return Math.round(preciseValue);
  }
}

/**
 * Vérifie si les macronutriments sont cohérents avec les calories
 *
 * @param macros Macronutriments à vérifier
 * @param tolerancePercent Tolérance en pourcentage (par défaut 5%)
 * @returns Vrai si cohérent, faux sinon
 */
export function validateMacroBalance(
  macros: MacroNutrientsBase,
  tolerancePercent: number = 5,
): boolean {
  // Calculer les calories à partir des macros avec précision accrue
  const calculatedCalories = calculateCaloriesFromMacros(macros);

  logger.debug(
    LogCategory.NUTRITION,
    `Vérification équilibre: ${calculatedCalories}kcal calculées vs ${macros.calories}kcal déclarées`,
    { calculatedCalories, declaredCalories: macros.calories },
  );

  // Différence absolue entre les calories calculées et déclarées
  const diff = parseFloat(
    Math.abs(calculatedCalories - macros.calories).toFixed(3),
  );

  // Tolérance en valeur absolue (pourcentage des calories calculées)
  const toleranceValue = parseFloat(
    ((calculatedCalories * tolerancePercent) / 100).toFixed(3),
  );

  logger.debug(
    LogCategory.NUTRITION,
    `Écart: ${diff}, Tolérance: ${toleranceValue} (${tolerancePercent}%)`,
    { diff, toleranceValue, tolerancePercent },
  );

  // Comparer avec tolérance
  return diff <= toleranceValue;
}

/**
 * Calcule les calories à partir des macronutriments avec une précision accrue
 *
 * @param macros Macronutriments
 * @returns Calories calculées
 */
export function calculateCaloriesFromMacros(
  macros: MacroNutrientsBase,
): number {
  // Facteurs caloriques standards avec précision à 3 décimales
  const carbsCal = parseFloat((macros.carbs * 4).toFixed(3));
  const proteinCal = parseFloat((macros.protein * 4).toFixed(3));
  const fatCal = parseFloat((macros.fat * 9).toFixed(3));

  // Somme des calories avec précision
  const rawCalories = parseFloat((carbsCal + proteinCal + fatCal).toFixed(3));

  logger.debug(
    LogCategory.NUTRITION,
    `Calcul calories: ${macros.carbs}g glucides + ${macros.protein}g protéines + ${macros.fat}g lipides = ${rawCalories}kcal`,
    { carbsCal, proteinCal, fatCal, rawCalories },
  );

  // Appliquer l'arrondi standardisé pour obtenir le résultat final
  return standardizeNutritionalRounding(rawCalories, 'calories');
}

/**
 * Convertit les unités nutritionnelles
 *
 * @param value Valeur à convertir
 * @param fromUnit Unité source
 * @param toUnit Unité cible
 * @returns Valeur convertie
 */
export function convertNutritionalUnit(
  value: number,
  fromUnit: string,
  toUnit: string,
): number {
  // Si les unités sont identiques, pas de conversion nécessaire
  if (fromUnit === toUnit) {
    return value;
  }

  // Facteurs de conversion (à compléter selon les besoins)
  const conversionFactors: Record<string, Record<string, number>> = {
    g: { mg: 1000, kg: 0.001, oz: 0.03527396 },
    mg: { g: 0.001, kg: 0.000001, oz: 0.00003527396 },
    kg: { g: 1000, mg: 1000000, oz: 35.27396 },
    oz: { g: 28.3495, mg: 28349.5, kg: 0.0283495 },
    ml: { l: 0.001, fl_oz: 0.033814 },
    l: { ml: 1000, fl_oz: 33.814 },
    fl_oz: { ml: 29.5735, l: 0.0295735 },
  };

  try {
    if (conversionFactors[fromUnit] && conversionFactors[fromUnit][toUnit]) {
      return value * conversionFactors[fromUnit][toUnit];
    } else {
      logger.warn(
        LogCategory.NUTRITION,
        `Conversion d'unité non supportée: ${fromUnit} à ${toUnit}`,
        { value },
      );
      return value; // Retourner la valeur d'origine si conversion non supportée
    }
  } catch (error) {
    logger.error(
      LogCategory.NUTRITION,
      "Erreur lors de la conversion d'unité",
      { error, value, fromUnit, toUnit },
    );
    return value; // Retourner la valeur d'origine en cas d'erreur
  }
}

/**
 * Génère un texte descriptif pour l'affichage des valeurs nutritionnelles
 *
 * @param displayMode Mode d'affichage
 * @param referenceWeight Poids de référence
 * @param unit Unité (g, ml, etc.)
 * @returns Texte descriptif
 */
export function generateNutritionDisplayText(
  displayMode: NutritionDisplayMode,
  referenceWeight: number,
  unit: string = 'g',
): string {
  switch (displayMode) {
    case NutritionDisplayMode.PER_100G:
      return `Pour 100${unit !== 'g' ? `${unit}` : 'g'}`;
    case NutritionDisplayMode.PER_SERVING:
      return `Pour ${referenceWeight}${unit}`;
    case NutritionDisplayMode.AS_IS:
      return `Valeurs nutritionnelles`;
    default:
      return `Pour 100${unit}`;
  }
}
