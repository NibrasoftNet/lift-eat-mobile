/**
 * Constantes pour les unités nutritionnelles standardisées
 * Ces constantes seront utilisées à travers toute l'application pour
 * assurer la cohérence des unités de mesure des valeurs nutritionnelles
 */

export const NutritionUnits = {
  // Unités de base
  WEIGHT: {
    GRAM: 'g',
    KILOGRAM: 'kg',
    OUNCE: 'oz',
    POUND: 'lb',
  },

  VOLUME: {
    MILLILITER: 'ml',
    LITER: 'l',
    TEASPOON: 'tsp',
    TABLESPOON: 'tbsp',
    CUP: 'cup',
  },

  // Unités pour les macronutriments
  ENERGY: {
    KILOCALORIE: 'kcal', // Unité standard pour l'énergie
    KILOJOULE: 'kJ',
  },

  // Unités pour les pourcentages
  PERCENTAGE: '%',
};

// Facteurs de conversion entre unités (pour développement futur)
export const UnitConversionFactors = {
  // Poids
  [NutritionUnits.WEIGHT.GRAM]: {
    [NutritionUnits.WEIGHT.KILOGRAM]: 0.001,
    [NutritionUnits.WEIGHT.OUNCE]: 0.035274,
  },
  [NutritionUnits.WEIGHT.KILOGRAM]: {
    [NutritionUnits.WEIGHT.GRAM]: 1000,
    [NutritionUnits.WEIGHT.POUND]: 2.20462,
  },

  // Énergie
  [NutritionUnits.ENERGY.KILOCALORIE]: {
    [NutritionUnits.ENERGY.KILOJOULE]: 4.184,
  },
  [NutritionUnits.ENERGY.KILOJOULE]: {
    [NutritionUnits.ENERGY.KILOCALORIE]: 0.239006,
  },
};

// Unités par défaut pour chaque type de valeur nutritionnelle
export const DefaultNutritionUnits = {
  CALORIES: NutritionUnits.ENERGY.KILOCALORIE,
  MACROS: NutritionUnits.WEIGHT.GRAM,
  MEAL_WEIGHT: NutritionUnits.WEIGHT.GRAM,
  INGREDIENT_WEIGHT: NutritionUnits.WEIGHT.GRAM,
  WATER: NutritionUnits.VOLUME.MILLILITER,
};

// Facteurs caloriques des macronutriments (calories par gramme)
export const MacroCalorieFactors = {
  CARBS: 4, // 4 kcal par gramme de glucides
  PROTEIN: 4, // 4 kcal par gramme de protéines
  FAT: 9, // 9 kcal par gramme de lipides
  ALCOHOL: 7, // 7 kcal par gramme d'alcool (pour référence future)
  FIBER: 2, // 2 kcal par gramme de fibres (certains systèmes l'utilisent)
};
