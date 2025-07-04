/**
 * Service core pour les méthodes de cuisson
 * Contient la logique métier liée aux calculs d'ajustement nutritionnel selon les méthodes de cuisson
 */

import { MacroNutrientsBase } from "@/types/nutrition.type";
import { CookingMethod } from "@/utils/constants/CookingConstants";
import { COOKING_METHODS_INFO, CookingMethodInfo } from "@/utils/constants/cooking-method-info.constants";
import { STANDARD_WEIGHT } from "@/utils/constants/NutritionConstants";
import { NutritionDisplayMode } from "@/utils/enum/nutrition.enum";
import { LogCategory } from "@/utils/enum/logging.enum";
import { nutritionEngine } from "@/utils/engines/nutrition-engine";
import { calculateCookedWeight } from "@/utils/helpers/cookingAdjustment.helper";
import { logger } from "@/utils/services/common/logging.service";

/**
 * Interface pour les pourcentages d'ajustement
 */
export interface AdjustmentPercentages {
  /** Pourcentage de changement des calories */
  calories: number;
  /** Pourcentage de changement des glucides */
  carbs: number;
  /** Pourcentage de changement des protéines */
  protein: number;
  /** Pourcentage de changement des lipides */
  fat: number;
  /** Pourcentage de changement du poids */
  weight: number;
}

/**
 * Interface pour les résultats des calculs d'ajustement
 */
export interface CookingMethodAdjustmentResult {
  /** Méthode de cuisson sélectionnée */
  selectedMethod: CookingMethod;
  /** Macros ajustées après cuisson */
  adjustedMacros: MacroNutrientsBase;
  /** Poids ajusté après cuisson */
  adjustedWeight: number;
  /** Macros normalisées pour l'affichage */
  normalizedMacros: MacroNutrientsBase;
  /** Pourcentages d'ajustement pour chaque nutriment */
  adjustmentPercentages: AdjustmentPercentages;
  /** Informations sur la méthode de cuisson sélectionnée */
  methodInfo: CookingMethodInfo;
  /** Informations sur toutes les méthodes de cuisson */
  allMethods: typeof COOKING_METHODS_INFO;
}

/**
 * Service core pour les calculs liés aux méthodes de cuisson
 * Centralise la logique métier des ajustements nutritionnels selon la méthode de cuisson
 */
class CookingMethodCoreService {
  /**
   * Calculer les ajustements de cuisson pour des macros et un poids donnés
   * @param initialMacros Valeurs nutritionnelles brutes (avant cuisson)
   * @param initialWeight Poids initial en grammes
   * @param cookingMethod Méthode de cuisson
   * @param displayMode Mode d'affichage des valeurs nutritionnelles
   * @returns Résultat des calculs d'ajustement
   */
  calculateCookingMethodAdjustments(
    initialMacros: MacroNutrientsBase, 
    initialWeight: number = STANDARD_WEIGHT,
    cookingMethod: CookingMethod = CookingMethod.RAW,
    displayMode: NutritionDisplayMode = NutritionDisplayMode.PER_100G
  ): CookingMethodAdjustmentResult {
    try {
      // Calculer le poids cuit
      const adjustedWeight = calculateCookedWeight(initialWeight, cookingMethod);

      // Ajuster les macros en fonction de la méthode de cuisson
      const adjustedMacros = nutritionEngine.adjustForCooking(
        initialMacros,
        cookingMethod
      );

      // Normaliser pour l'affichage standard
      const normalizedMacros = nutritionEngine.adjustForFinalMealWeight(
        adjustedMacros,
        adjustedWeight,
        STANDARD_WEIGHT
      );
      
      // Calculer les pourcentages d'ajustement
      const adjustmentPercentages = this.calculateAdjustmentPercentages(
        initialMacros,
        adjustedMacros,
        initialWeight,
        adjustedWeight
      );
      
      // Log pour le débogage
      logger.debug(
        LogCategory.NUTRITION,
        `Ajustement de cuisson: ${cookingMethod}`,
        { original: initialMacros, adjusted: adjustedMacros }
      );

      return {
        selectedMethod: cookingMethod,
        adjustedMacros,
        adjustedWeight,
        normalizedMacros,
        adjustmentPercentages,
        methodInfo: COOKING_METHODS_INFO[cookingMethod],
        allMethods: COOKING_METHODS_INFO
      };
    } catch (error) {
      logger.error(
        LogCategory.NUTRITION,
        "Erreur lors de l'ajustement de cuisson",
        { error, method: cookingMethod, macros: initialMacros, weight: initialWeight }
      );

      // Valeurs par défaut en cas d'erreur
      return {
        selectedMethod: cookingMethod,
        adjustedMacros: { ...initialMacros },
        adjustedWeight: initialWeight,
        normalizedMacros: { ...initialMacros },
        adjustmentPercentages: {
          calories: 0,
          carbs: 0,
          protein: 0,
          fat: 0,
          weight: 0
        },
        methodInfo: COOKING_METHODS_INFO[cookingMethod],
        allMethods: COOKING_METHODS_INFO
      };
    }
  }

  /**
   * Calculer les pourcentages d'ajustement entre les valeurs originales et ajustées
   * @param originalMacros Valeurs nutritionnelles originales
   * @param adjustedMacros Valeurs nutritionnelles ajustées
   * @param originalWeight Poids original
   * @param adjustedWeight Poids ajusté
   * @returns Pourcentages d'ajustement pour chaque nutriment et le poids
   */
  calculateAdjustmentPercentages(
    originalMacros: MacroNutrientsBase,
    adjustedMacros: MacroNutrientsBase,
    originalWeight: number,
    adjustedWeight: number
  ): AdjustmentPercentages {
    return {
      calories: this.getPercentage(originalMacros.calories, adjustedMacros.calories),
      carbs: this.getPercentage(originalMacros.carbs, adjustedMacros.carbs),
      protein: this.getPercentage(originalMacros.protein, adjustedMacros.protein),
      fat: this.getPercentage(originalMacros.fat, adjustedMacros.fat),
      weight: this.getPercentage(originalWeight, adjustedWeight)
    };
  }

  /**
   * Calculer le pourcentage de changement entre deux valeurs
   * @param originalValue Valeur originale
   * @param newValue Nouvelle valeur
   * @returns Pourcentage de changement
   */
  getPercentage(originalValue: number, newValue: number): number {
    if (originalValue === 0) return 0;
    return ((newValue - originalValue) / originalValue) * 100;
  }
}

// Exporter une instance singleton du service
export const cookingMethodCoreService = new CookingMethodCoreService();
