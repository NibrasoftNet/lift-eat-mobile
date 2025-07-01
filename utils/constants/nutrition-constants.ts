/**
 * Fichier central de constantes nutritionnelles
 * 
 * Ce fichier regroupe toutes les constantes liées à la nutrition
 * pour éviter la duplication et assurer la cohérence à travers l'application.
 * 
 * Il réexporte également les données de NutritionUnits et NutritionLimits
 * pour fournir un point d'entrée unique.
 */

import { NutritionUnits, UnitConversionFactors, DefaultNutritionUnits, MacroCalorieFactors } from './NutritionUnits';
import { NutritionLimits, RecommendedDailyIntake, MacroDistribution } from './NutritionLimits';
import { CookingMethod, CookingMethodFactors, STANDARD_WEIGHT } from './CookingConstants';

// Ré-export pour point d'entrée unique
export { 
  NutritionUnits, 
  UnitConversionFactors, 
  DefaultNutritionUnits, 
  MacroCalorieFactors,
  NutritionLimits, 
  RecommendedDailyIntake, 
  MacroDistribution,
  CookingMethod,
  CookingMethodFactors,
  STANDARD_WEIGHT
};

/**
 * Politique d'arrondi pour les valeurs nutritionnelles
 */
export const NutritionRoundingPolicy = {
  // Précision pour l'interface utilisateur (affichage)
  UI: {
    CALORIES: 0,      // Pas de décimales pour les calories
    MACROS: 1,        // Une décimale pour les macronutriments
    WEIGHT: 1,        // Une décimale pour les poids
    PERCENTAGE: 1,    // Une décimale pour les pourcentages
  },
  
  // Précision pour le stockage en base de données
  STORAGE: {
    CALORIES: 0,     // Entier pour les calories
    MACROS: 2,       // Deux décimales pour les macronutriments
    WEIGHT: 2,       // Deux décimales pour les poids
    PERCENTAGE: 4,   // Quatre décimales pour les pourcentages (précision)
  },
  
  // Précision pour les calculs intermédiaires
  CALCULATION: {
    CALORIES: 2,     // Deux décimales pour les calculs de calories
    MACROS: 4,       // Quatre décimales pour les calculs de macronutriments
    WEIGHT: 4,       // Quatre décimales pour les calculs de poids
    PERCENTAGE: 6,   // Six décimales pour les calculs de pourcentages
  },
};

/**
 * Facteurs de densité pour conversion volume ↔ poids
 * Valeurs en grammes par millilitre (g/ml)
 */
export const DensityFactors = {
  // Liquides
  WATER: 1.0,           // Eau (référence)
  MILK: 1.03,           // Lait
  CREAM: 1.02,          // Crème
  YOGURT: 1.03,         // Yaourt
  COOKING_OIL: 0.92,    // Huile de cuisson
  OLIVE_OIL: 0.92,      // Huile d'olive
  HONEY: 1.42,          // Miel
  MAPLE_SYRUP: 1.32,    // Sirop d'érable
  
  // Liquides transformés
  VEGETABLE_BROTH: 1.0, // Bouillon de légumes
  CHICKEN_BROTH: 1.0,   // Bouillon de poulet
  TOMATO_SAUCE: 1.03,   // Sauce tomate
  
  // Semi-liquides
  BATTER: 1.1,          // Pâte à gâteau/crêpe
  SMOOTHIE: 1.1,        // Smoothie
  
  // Poudres
  FLOUR: 0.53,          // Farine
  SUGAR: 0.85,          // Sucre
  SALT: 1.2,            // Sel
  OATS: 0.4,            // Flocons d'avoine
  PROTEIN_POWDER: 0.3,  // Poudre protéinée
};

/**
 * Facteurs de conversion pour les unités de volume communes
 * Valeurs en millilitres (ml)
 */
export const VolumeConversionFactors = {
  TEASPOON: 5,        // Cuillère à café
  TABLESPOON: 15,     // Cuillère à soupe
  CUP_US: 236.59,     // Tasse américaine
  CUP_METRIC: 250,    // Tasse métrique
  FLUID_OUNCE: 29.57, // Once liquide
  PINT_US: 473.18,    // Pinte américaine
  PINT_UK: 568.26,    // Pinte britannique
  QUART_US: 946.35,   // Quart américain
  LITER: 1000,        // Litre
};

/**
 * Micro-nutriments supportés et leurs unités
 */
export const MicroNutrients = {
  // Vitamines
  VITAMIN_A: { unit: 'μg', dailyValue: 900 },
  VITAMIN_C: { unit: 'mg', dailyValue: 90 },
  VITAMIN_D: { unit: 'μg', dailyValue: 20 },
  VITAMIN_E: { unit: 'mg', dailyValue: 15 },
  
  // Minéraux
  CALCIUM: { unit: 'mg', dailyValue: 1300 },
  IRON: { unit: 'mg', dailyValue: 18 },
  SODIUM: { unit: 'mg', dailyValue: 2300 },
  POTASSIUM: { unit: 'mg', dailyValue: 4700 },
  
  // Autres
  FIBER: { unit: 'g', dailyValue: 25 },
  SUGAR: { unit: 'g', dailyValue: 50 }, // Valeur recommandée max.
  CHOLESTEROL: { unit: 'mg', dailyValue: 300 },
  CAFFEINE: { unit: 'mg', dailyValue: 400 },
};
