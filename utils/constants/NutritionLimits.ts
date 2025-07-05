/**
 * Constantes pour les limites nutritionnelles
 *
 * Ce fichier définit les limites, minimums et maximums utilisés pour
 * la validation et les calculs des valeurs nutritionnelles dans l'application.
 * Version simplifiée pour les 4 macronutriments principaux uniquement.
 */

/**
 * Limites globales pour les valeurs nutritionnelles
 */
export const NutritionLimits = {
  // Limites pour les macronutriments
  CALORIES: {
    MIN: 0,
    MAX: 10000, // Maximum de calories par repas
    DAILY_MIN: 1200, // Minimum journalier recommandé
    DAILY_MAX: 4000, // Maximum journalier recommandé
  },

  MACROS: {
    MIN: 0,
    MAX: 1000, // Maximum de grammes par macro (par repas)
    CARBS: {
      DAILY_MIN: 50, // Minimum journalier recommandé
      DAILY_MAX: 400, // Maximum journalier recommandé
    },
    PROTEIN: {
      DAILY_MIN: 50, // Minimum journalier recommandé
      DAILY_MAX: 250, // Maximum journalier recommandé
    },
    FAT: {
      DAILY_MIN: 20, // Minimum journalier recommandé
      DAILY_MAX: 120, // Maximum journalier recommandé
    },
  },

  // Limites pour les poids
  WEIGHT: {
    MIN: 0.1, // Poids minimum en grammes
    MAX: 10000, // Poids maximum en grammes (10kg)
    INGREDIENT_MAX: 5000, // Maximum pour un ingrédient (5kg)
    MEAL_MAX: 10000, // Maximum pour un repas (10kg)
  },

  // Valeurs d'erreur autorisées
  ERROR_MARGIN: {
    CALORIES: 0.05, // 5% de marge d'erreur pour les calories
    MACROS: 0.05, // 5% de marge d'erreur pour les macros
    WEIGHT: 0.05, // 5% de marge d'erreur pour les poids
  },
};

/**
 * Apports Journaliers Recommandés (AJR) simplifiés
 */
export const RecommendedDailyIntake = {
  // AJR pour un adulte moyen (valeurs par défaut)
  DEFAULT: {
    CALORIES: 3000,
    PROTEIN: 50,
    CARBS: 260,
    FAT: 70,
  },

  // Facteurs d'ajustement par niveau d'activité
  ACTIVITY_LEVEL: {
    SEDENTARY: 1.2,
    LIGHT: 1.375,
    MODERATE: 1.55,
    ACTIVE: 1.725,
    VERY_ACTIVE: 1.9,
  },
};

/**
 * Formule simplifiée pour le calcul des besoins caloriques (TDEE)
 */
export const calculateTDEE = (
  weight: number,
  height: number,
  age: number,
  isMale: boolean,
  activityLevel: number,
): number => {
  // Calcul du métabolisme de base (BMR) avec la formule de Mifflin-St Jeor
  const bmr = isMale
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;

  // Multiplication par le facteur d'activité
  return Math.round(bmr * activityLevel);
};

/**
 * Distribution standard des macronutriments
 */
export const MacroDistribution = {
  BALANCED: {
    PROTEIN: 0.2, // 20% des calories
    CARBS: 0.5, // 50% des calories
    FAT: 0.3, // 30% des calories
  },
};
