/**
 * Utilitaires pour l'ajustement des valeurs nutritionnelles selon le mode de préparation
 * 
 * Version simplifiée pour les 4 macronutriments principaux uniquement
 */

import { logger } from '../services/common/logging.service';
import { LogCategory } from '../enum/logging.enum';
import { MacroNutrientsBase } from '@/types/nutrition.type';
import { preciseAdjustment } from './precision.helper';
import { CookingMethod, CookingMethodFactors } from '../constants/CookingConstants';

/**
 * Ajuste les valeurs nutritionnelles selon la méthode de cuisson
 * 
 * @param macros Valeurs nutritionnelles à ajuster
 * @param method Méthode de cuisson
 * @returns Valeurs nutritionnelles ajustées
 */
export const adjustForCookingMethod = (
  macros: MacroNutrientsBase,
  method: CookingMethod
): MacroNutrientsBase => {
  try {
    const factors = CookingMethodFactors[method];
    
    // Appliquer les facteurs aux macronutriments
    const result: MacroNutrientsBase = {
      calories: Math.round(macros.calories * factors.calories),
      protein: Math.round(macros.protein * factors.protein),
      carbs: Math.round(macros.carbs * factors.carbs),
      fat: Math.round(macros.fat * factors.fat),
      unit: macros.unit,
    };
    
    return result;
  } catch (error) {
    logger.error(LogCategory.NUTRITION, 'Erreur dans adjustForCookingMethod', { error });
    return macros; // En cas d'erreur, retourner les valeurs d'origine
  }
};

/**
 * Calcule le poids après cuisson
 * 
 * @param rawWeight Poids avant cuisson (en grammes)
 * @param method Méthode de cuisson
 * @returns Poids estimé après cuisson
 */
export const calculateCookedWeight = (
  rawWeight: number,
  method: CookingMethod
): number => {
  try {
    const waterFactor = CookingMethodFactors[method].water;
    return Math.round(rawWeight * waterFactor);
  } catch (error) {
    logger.error(LogCategory.NUTRITION, 'Erreur dans calculateCookedWeight', { error });
    return rawWeight; // En cas d'erreur, retourner le poids d'origine
  }
};
