/**
 * Utilitaires pour le calcul d'équivalence calorique selon le principe 4-9-4
 *
 * Ce module implémente tous les calculs liés à la conversion entre macronutriments
 * et calories selon les facteurs standards d'Atwater:
 * - 4 calories par gramme de glucides
 * - 9 calories par gramme de lipides
 * - 4 calories par gramme de protéines
 */

import { logger } from '../services/common/logging.service';
import { LogCategory } from '../enum/logging.enum';
import { MacroNutrientsBase } from '@/types/nutrition.type';
import { MacroCalorieFactors } from '../constants/NutritionUnits';
import { preciseCalculation, roundToDecimals } from './precision.helper';

/**
 * Calcule les calories à partir des macronutriments selon l'équivalence 4-9-4
 * @param carbs Grammes de glucides
 * @param protein Grammes de protéines
 * @param fat Grammes de lipides
 * @param fiber Grammes de fibres (optionnel, 2 kcal/g)
 * @returns Calories calculées
 */
export const calculateCaloriesFromMacros = (
  carbs: number,
  protein: number,
  fat: number,
  fiber: number = 0,
): number => {
  try {
    return preciseCalculation(
      (c, p, f, fb) =>
        c * MacroCalorieFactors.CARBS +
        p * MacroCalorieFactors.PROTEIN +
        f * MacroCalorieFactors.FAT +
        fb * (MacroCalorieFactors.FIBER || 0),
      [carbs, protein, fat, fiber],
      0, // Arrondir à l'entier pour les calories
    );
  } catch (error) {
    logger.error(
      LogCategory.NUTRITION,
      'Erreur dans calculateCaloriesFromMacros',
      { error },
    );
    return 0;
  }
};

/**
 * Calcule les macronutriments à partir des calories et d'une répartition donnée
 * @param calories Total des calories
 * @param distribution Répartition en pourcentage des macros {protein, carbs, fat}
 * @returns Valeurs en grammes des macronutriments
 */
export const calculateMacrosFromCalories = (
  calories: number,
  distribution: { protein: number; carbs: number; fat: number },
): { protein: number; carbs: number; fat: number } => {
  try {
    // Vérifier que la distribution totalise 100%
    const totalDistribution =
      distribution.protein + distribution.carbs + distribution.fat;
    if (Math.abs(totalDistribution - 1) > 0.01) {
      logger.warn(
        LogCategory.NUTRITION,
        'Distribution des macros incorrecte, doit totaliser 100%',
        { distribution, total: totalDistribution },
      );
      // Normaliser la distribution
      distribution = {
        protein: distribution.protein / totalDistribution,
        carbs: distribution.carbs / totalDistribution,
        fat: distribution.fat / totalDistribution,
      };
    }

    // Calculer les calories allouées à chaque macro
    const proteinCalories = calories * distribution.protein;
    const carbsCalories = calories * distribution.carbs;
    const fatCalories = calories * distribution.fat;

    // Convertir les calories en grammes
    return {
      protein: roundToDecimals(
        proteinCalories / MacroCalorieFactors.PROTEIN,
        1,
      ),
      carbs: roundToDecimals(carbsCalories / MacroCalorieFactors.CARBS, 1),
      fat: roundToDecimals(fatCalories / MacroCalorieFactors.FAT, 1),
    };
  } catch (error) {
    logger.error(
      LogCategory.NUTRITION,
      'Erreur dans calculateMacrosFromCalories',
      { error },
    );
    return { protein: 0, carbs: 0, fat: 0 };
  }
};

/**
 * Vérifie la cohérence entre les calories et les macronutriments
 * @param macros Objet contenant calories, carbs, protein, fat
 * @param marginPercent Pourcentage de marge d'erreur acceptable
 * @returns {boolean} true si cohérent, false sinon
 */
export const verifyCalorieMacroConsistency = (
  macros: MacroNutrientsBase,
  marginPercent: number = 5,
): boolean => {
  try {
    const calculatedCalories = calculateCaloriesFromMacros(
      macros.carbs,
      macros.protein,
      macros.fat,
    );

    const margin = macros.calories * (marginPercent / 100);
    const isConsistent =
      Math.abs(calculatedCalories - macros.calories) <= margin;

    if (!isConsistent) {
      logger.warn(
        LogCategory.NUTRITION,
        'Incohérence entre calories et macros détectée',
        {
          providedCalories: macros.calories,
          calculatedCalories,
          difference: calculatedCalories - macros.calories,
          marginAllowed: margin,
        },
      );
    }

    return isConsistent;
  } catch (error) {
    logger.error(
      LogCategory.NUTRITION,
      'Erreur dans verifyCalorieMacroConsistency',
      { error },
    );
    return false;
  }
};

/**
 * Ajuste les calories pour les rendre cohérentes avec les macronutriments
 * @param macros Objet contenant les macronutriments et calories
 * @returns Objet avec calories ajustées
 */
export const adjustCaloriesToMatchMacros = (
  macros: MacroNutrientsBase,
): MacroNutrientsBase => {
  try {
    const calculatedCalories = calculateCaloriesFromMacros(
      macros.carbs,
      macros.protein,
      macros.fat,
    );

    return {
      ...macros,
      calories: calculatedCalories,
    };
  } catch (error) {
    logger.error(
      LogCategory.NUTRITION,
      'Erreur dans adjustCaloriesToMatchMacros',
      { error },
    );
    return macros;
  }
};

/**
 * Ajuste les macronutriments pour respecter une répartition tout en conservant les calories
 * @param macros Objet contenant calories et macros actuels
 * @param targetDistribution Répartition cible {protein, carbs, fat} en pourcentage
 * @returns Macros ajustés selon la nouvelle répartition
 */
export const adjustMacrosForTargetDistribution = (
  macros: MacroNutrientsBase,
  targetDistribution: { protein: number; carbs: number; fat: number },
): MacroNutrientsBase => {
  try {
    // Calculer les nouveaux grammes de macros selon la distribution cible
    const newMacros = calculateMacrosFromCalories(
      macros.calories,
      targetDistribution,
    );

    return {
      ...macros,
      protein: newMacros.protein,
      carbs: newMacros.carbs,
      fat: newMacros.fat,
    };
  } catch (error) {
    logger.error(
      LogCategory.NUTRITION,
      'Erreur dans adjustMacrosForTargetDistribution',
      { error },
    );
    return macros;
  }
};
