/**
 * Constantes liées à la cuisson et aux méthodes de préparation des aliments
 *
 * Ce fichier centralise les énumérations et facteurs d'ajustement pour les
 * différentes méthodes de cuisson supportées dans l'application.
 */

/**
 * Types de méthodes de cuisson principales
 */
export enum CookingMethod {
  RAW = 'raw', // Cru
  BOILED = 'boiled', // Bouilli
  STEAMED = 'steamed', // Vapeur
  FRIED = 'fried', // Frit
  BAKED = 'baked', // Au four
  GRILLED = 'grilled', // Grillé
}

/**
 * Facteurs d'ajustement par méthode de cuisson pour les macronutriments
 */
export const CookingMethodFactors: Record<
  CookingMethod,
  {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    water: number; // Pour le calcul du poids final
    description: string;
  }
> = {
  [CookingMethod.RAW]: {
    calories: 1.0,
    protein: 1.0,
    carbs: 1.0,
    fat: 1.0,
    water: 1.0,
    description: 'Aliment cru, pas de modification',
  },
  [CookingMethod.BOILED]: {
    calories: 0.9,
    protein: 0.85,
    carbs: 0.9,
    fat: 0.8,
    water: 1.1,
    description: "Perte de nutriments dans l'eau, absorption d'eau",
  },
  [CookingMethod.STEAMED]: {
    calories: 0.95,
    protein: 0.9,
    carbs: 0.95,
    fat: 0.9,
    water: 1.05,
    description: 'Conservation des nutriments, légère humidité',
  },
  [CookingMethod.FRIED]: {
    calories: 1.3,
    protein: 0.95,
    carbs: 0.9,
    fat: 2.5,
    water: 0.7,
    description: "Ajout de calories et lipides, perte d'eau",
  },
  [CookingMethod.BAKED]: {
    calories: 0.95,
    protein: 0.9,
    carbs: 0.95,
    fat: 0.9,
    water: 0.7,
    description: 'Légère perte de nutriments, déshydratation',
  },
  [CookingMethod.GRILLED]: {
    calories: 0.9,
    protein: 0.85,
    carbs: 0.9,
    fat: 0.75,
    water: 0.65,
    description: 'Perte de graisse, déshydratation',
  },
};

/**
 * Poids normalisé par défaut pour l'affichage des valeurs nutritionnelles
 */
export const STANDARD_WEIGHT = 100; // 100g, poids de référence pour les valeurs nutritionnelles
