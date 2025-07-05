/**
 * Définitions des énumérations liées à la nutrition dans l'application Lift
 * Ce fichier centralise toutes les énumérations et constantes liées aux calculs nutritionnels
 */

import { STANDARD_WEIGHT } from '@/utils/constants/NutritionConstants';

/**
 * Modes d'affichage des valeurs nutritionnelles
 * Contrôle comment les valeurs nutritionnelles sont présentées à l'utilisateur
 * @enum {string}
 */
export enum NutritionDisplayMode {
  /**
   * Valeurs normalisées pour 100g du produit
   * Idéal pour comparer différents repas sur une base standard
   * Exemple: 25g de protéines pour 100g de poulet
   */
  PER_100G = 'per100g',

  /**
   * Valeurs normalisées par portion définie
   * Utilisé pour montrer les valeurs pour une portion typique
   * Exemple: 15g de protéines pour une portion de 60g
   */
  PER_SERVING = 'perServing',

  /**
   * Valeurs totales du repas/produit
   * Affiche les macros pour la totalité du repas ou de l'ingrédient
   * Exemple: 50g de protéines pour un repas complet de 250g
   */
  FULL = 'full',

  /**
   * Valeurs telles quelles, sans normalisation
   * Utilise les valeurs brutes telles qu'elles sont stockées
   * Généralement utilisé en interne sans ajustement pour l'affichage
   */
  AS_IS = 'asIs',
}

/**
 * Retourne le texte à afficher pour un mode d'affichage nutritionnel
 * @param mode Mode d'affichage à utiliser
 * @param quantity Quantité en grammes (optionnel)
 * @param servingSize Taille d'une portion en grammes (optionnel)
 * @returns Texte explicatif du mode d'affichage
 */
export function getDisplayTextForMode(
  mode: NutritionDisplayMode,
  quantity?: number,
  servingSize?: number,
): string {
  switch (mode) {
    case NutritionDisplayMode.PER_100G:
      return 'Pour 100g';

    case NutritionDisplayMode.PER_SERVING:
      const servingSizeText = servingSize ? `${servingSize}g` : 'portion';
      return `Par ${servingSizeText}`;

    case NutritionDisplayMode.FULL:
      const totalText = quantity ? `${quantity}g` : 'total';
      return `Pour ${totalText}`;

    case NutritionDisplayMode.AS_IS:
      return quantity ? `Pour ${quantity}g` : 'Valeurs brutes';

    default:
      return 'Valeurs nutritionnelles';
  }
}

/**
 * Retourne le facteur de normalisation pour un mode d'affichage donné
 * @param mode Mode d'affichage
 * @param totalWeight Poids total du repas en grammes
 * @param servingSize Taille d'une portion (utilisé uniquement pour PER_SERVING)
 * @returns Facteur de normalisation
 */
export function getNormalizationFactorForMode(
  mode: NutritionDisplayMode,
  totalWeight: number,
  servingSize?: number,
): number {
  switch (mode) {
    case NutritionDisplayMode.PER_100G:
      return STANDARD_WEIGHT / totalWeight;

    case NutritionDisplayMode.PER_SERVING:
      const portion = servingSize || STANDARD_WEIGHT;
      return portion / totalWeight;

    case NutritionDisplayMode.FULL:
      return 1;

    case NutritionDisplayMode.AS_IS:
    default:
      return 1;
  }
}

/**
 * Constantes pour les conversions nutritionnelles
 */
export const NUTRITION_CONVERSION = {
  // Calories par gramme de macronutriment
  CALORIES_PER_G_PROTEIN: 4,
  CALORIES_PER_G_CARBS: 4,
  CALORIES_PER_G_FAT: 9,

  // Pourcentage recommandé de macronutriments dans l'apport calorique total
  RECOMMENDED_PROTEIN_PERCENT: 0.25, // 25%
  RECOMMENDED_CARBS_PERCENT: 0.45, // 45%
  RECOMMENDED_FAT_PERCENT: 0.3, // 30%
};
