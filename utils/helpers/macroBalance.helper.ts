/**
 * Utilitaires pour l'analyse et l'évaluation de l'équilibre des macronutriments
 *
 * Ce fichier centralise les calculs de pourcentages et l'évaluation
 * de l'équilibre nutritionnel selon les standards diététiques.
 */

import { MacroNutrientsBase } from '@/types/nutrition.type';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

// Seuils recommandés standards
export const MacroBalanceThresholds = {
  PROTEIN: {
    MIN: 15, // Minimum recommandé de protéines (%)
    MAX: 35, // Maximum recommandé de protéines (%)
    OPTIMAL: 25, // Valeur optimale de protéines (%)
  },
  CARBS: {
    MIN: 45, // Minimum recommandé de glucides (%)
    MAX: 65, // Maximum recommandé de glucides (%)
    OPTIMAL: 55, // Valeur optimale de glucides (%)
  },
  FAT: {
    MIN: 20, // Minimum recommandé de lipides (%)
    MAX: 35, // Maximum recommandé de lipides (%)
    OPTIMAL: 25, // Valeur optimale de lipides (%)
  },
};

// Constantes pour les calculs caloriques
export const CalorieFactors = {
  PROTEIN_CALORIES_PER_GRAM: 4,
  CARBS_CALORIES_PER_GRAM: 4,
  FAT_CALORIES_PER_GRAM: 9,
};

/**
 * Interface pour les pourcentages de macronutriments
 */
export interface MacroPercentages {
  proteinPercentage: number;
  carbsPercentage: number;
  fatPercentage: number;
  totalPercentage: number; // Devrait être 100 sauf cas particuliers
}

/**
 * Interface pour l'équilibre des macronutriments
 */
export interface MacroBalance {
  percentages: MacroPercentages;
  isProteinOptimal: boolean;
  isCarbsOptimal: boolean;
  isFatOptimal: boolean;
  isOverallBalanced: boolean;
  recommendations: string[];
}

/**
 * Calcule les pourcentages de macronutriments par rapport au total des calories
 *
 * @param macros Macronutriments à analyser
 * @returns Pourcentages calculés
 */
export function calculateMacroPercentages(
  macros: MacroNutrientsBase,
): MacroPercentages {
  // Calculer les calories pour chaque macronutriment
  const proteinCalories =
    macros.protein * CalorieFactors.PROTEIN_CALORIES_PER_GRAM;
  const carbsCalories = macros.carbs * CalorieFactors.CARBS_CALORIES_PER_GRAM;
  const fatCalories = macros.fat * CalorieFactors.FAT_CALORIES_PER_GRAM;

  // Total des calories calculées
  const totalCalculatedCalories = proteinCalories + carbsCalories + fatCalories;

  // Si le total est trop faible, éviter la division par zéro
  if (totalCalculatedCalories < 1) {
    return {
      proteinPercentage: 0,
      carbsPercentage: 0,
      fatPercentage: 0,
      totalPercentage: 0,
    };
  }

  // Calculer les pourcentages
  const proteinPercentage = (proteinCalories / totalCalculatedCalories) * 100;
  const carbsPercentage = (carbsCalories / totalCalculatedCalories) * 100;
  const fatPercentage = (fatCalories / totalCalculatedCalories) * 100;

  return {
    proteinPercentage: Math.round(proteinPercentage),
    carbsPercentage: Math.round(carbsPercentage),
    fatPercentage: Math.round(fatPercentage),
    totalPercentage: Math.round(
      proteinPercentage + carbsPercentage + fatPercentage,
    ),
  };
}

/**
 * Évalue l'équilibre des macronutriments
 *
 * @param macros Macronutriments à évaluer
 * @returns Analyse de l'équilibre et recommandations
 */
export function evaluateMacroBalance(macros: MacroNutrientsBase): MacroBalance {
  try {
    // Calculer les pourcentages
    const percentages = calculateMacroPercentages(macros);

    // Évaluer chaque macronutriment selon les seuils
    const isProteinOptimal =
      percentages.proteinPercentage >= MacroBalanceThresholds.PROTEIN.MIN &&
      percentages.proteinPercentage <= MacroBalanceThresholds.PROTEIN.MAX;

    const isCarbsOptimal =
      percentages.carbsPercentage >= MacroBalanceThresholds.CARBS.MIN &&
      percentages.carbsPercentage <= MacroBalanceThresholds.CARBS.MAX;

    const isFatOptimal =
      percentages.fatPercentage >= MacroBalanceThresholds.FAT.MIN &&
      percentages.fatPercentage <= MacroBalanceThresholds.FAT.MAX;

    // L'équilibre global est optimal si tous les macros sont dans leurs plages
    const isOverallBalanced =
      isProteinOptimal && isCarbsOptimal && isFatOptimal;

    // Générer des recommandations
    const recommendations: string[] = [];

    if (!isProteinOptimal) {
      if (percentages.proteinPercentage < MacroBalanceThresholds.PROTEIN.MIN) {
        recommendations.push(
          `Augmenter les protéines: ${percentages.proteinPercentage}% → ${MacroBalanceThresholds.PROTEIN.MIN}-${MacroBalanceThresholds.PROTEIN.MAX}%`,
        );
      } else {
        recommendations.push(
          `Réduire les protéines: ${percentages.proteinPercentage}% → ${MacroBalanceThresholds.PROTEIN.MIN}-${MacroBalanceThresholds.PROTEIN.MAX}%`,
        );
      }
    }

    if (!isCarbsOptimal) {
      if (percentages.carbsPercentage < MacroBalanceThresholds.CARBS.MIN) {
        recommendations.push(
          `Augmenter les glucides: ${percentages.carbsPercentage}% → ${MacroBalanceThresholds.CARBS.MIN}-${MacroBalanceThresholds.CARBS.MAX}%`,
        );
      } else {
        recommendations.push(
          `Réduire les glucides: ${percentages.carbsPercentage}% → ${MacroBalanceThresholds.CARBS.MIN}-${MacroBalanceThresholds.CARBS.MAX}%`,
        );
      }
    }

    if (!isFatOptimal) {
      if (percentages.fatPercentage < MacroBalanceThresholds.FAT.MIN) {
        recommendations.push(
          `Augmenter les lipides: ${percentages.fatPercentage}% → ${MacroBalanceThresholds.FAT.MIN}-${MacroBalanceThresholds.FAT.MAX}%`,
        );
      } else {
        recommendations.push(
          `Réduire les lipides: ${percentages.fatPercentage}% → ${MacroBalanceThresholds.FAT.MIN}-${MacroBalanceThresholds.FAT.MAX}%`,
        );
      }
    }

    return {
      percentages,
      isProteinOptimal,
      isCarbsOptimal,
      isFatOptimal,
      isOverallBalanced,
      recommendations,
    };
  } catch (error) {
    logger.error(
      LogCategory.NUTRITION,
      "Erreur lors de l'évaluation de l'équilibre des macros",
      { error, macros },
    );

    // Retourner un résultat par défaut en cas d'erreur
    return {
      percentages: {
        proteinPercentage: 0,
        carbsPercentage: 0,
        fatPercentage: 0,
        totalPercentage: 0,
      },
      isProteinOptimal: false,
      isCarbsOptimal: false,
      isFatOptimal: false,
      isOverallBalanced: false,
      recommendations: ["Impossible d'évaluer l'équilibre nutritionnel"],
    };
  }
}

/**
 * Génère un message d'évaluation nutritionnelle formaté
 *
 * @param macroBalance Résultat de l'analyse d'équilibre
 * @returns Message formaté pour l'affichage
 */
export function generateBalanceMessage(macroBalance: MacroBalance): string {
  const { percentages, isOverallBalanced, recommendations } = macroBalance;

  if (isOverallBalanced) {
    return `Équilibre optimal: P ${percentages.proteinPercentage}% | G ${percentages.carbsPercentage}% | L ${percentages.fatPercentage}%`;
  } else {
    const recommendationText = recommendations.join('. ');
    return `Équilibre à améliorer: P ${percentages.proteinPercentage}% | G ${percentages.carbsPercentage}% | L ${percentages.fatPercentage}%. ${recommendationText}`;
  }
}

/**
 * Obtient la couleur d'affichage en fonction de l'équilibre
 *
 * @param isOptimal Si la valeur est dans la plage optimale
 * @param value Valeur actuelle
 * @param min Minimum recommandé
 * @param max Maximum recommandé
 * @returns Classe CSS de couleur (success, warning, danger)
 */
export function getMacroBalanceColor(
  isOptimal: boolean,
  value: number,
  min: number,
  max: number,
): string {
  if (isOptimal) {
    return 'success';
  }

  // Si trop faible ou trop élevé, mais pas extrêmement
  const isMildlyUnbalanced =
    (value < min && value >= min * 0.7) || (value > max && value <= max * 1.3);

  return isMildlyUnbalanced ? 'warning' : 'danger';
}
