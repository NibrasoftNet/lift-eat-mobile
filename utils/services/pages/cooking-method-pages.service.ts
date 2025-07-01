/**
 * Service d'orchestration pour les méthodes de cuisson (Presenter)
 * Respecte l'architecture MCP en délégant la logique métier au service core
 * et les aspects UI au service UI correspondant
 */

import { MacroNutrientsBase } from "@/types/nutrition.type";
import { CookingMethod } from "@/utils/constants/CookingConstants";
import { COOKING_METHODS_INFO } from "@/utils/constants/cooking-method-info.constants";
import { STANDARD_WEIGHT } from "@/utils/constants/NutritionConstants";
import { NutritionDisplayMode } from "@/utils/enum/nutrition.enum";
import { LogCategory } from "@/utils/enum/logging.enum";
import { logger } from "@/utils/services/common/logging.service";
import { cookingMethodCoreService, CookingMethodAdjustmentResult } from "@/utils/services/core/cooking-method-core.service";
import { cookingMethodUIService } from "@/utils/services/ui/cooking-method-ui.service";

/**
 * Service Presenter pour les méthodes de cuisson
 * Délègue les calculs au service core et le formatage au service UI
 */
class CookingMethodPagesService {
  
  /**
   * Calculer les ajustements de cuisson pour des macros et un poids donnés
   * Délègue au service core pour les calculs métier
   * 
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
      // Délégation au service core pour tous les calculs métier
      return cookingMethodCoreService.calculateCookingMethodAdjustments(
        initialMacros,
        initialWeight,
        cookingMethod,
        displayMode
      );
    } catch (error) {
      logger.error(
        LogCategory.NUTRITION,
        "Erreur lors de l'ajustement de cuisson dans le service pages",
        { error, method: cookingMethod }
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
   * Formater un pourcentage pour l'affichage
   * Délègue au service UI pour le formatage
   * 
   * @param value Valeur en pourcentage
   * @returns Chaîne formatée avec signe + ou -
   */
  formatPercentage(value: number): string {
    // Délégation au service UI
    return cookingMethodUIService.formatPercentage(value);
  }
  
  /**
   * Obtenir une classe CSS basée sur le pourcentage
   * Délègue au service UI pour la logique d'affichage
   * 
   * @param percentage Valeur en pourcentage
   * @returns Nom de classe CSS
   */
  getDifferenceClass(percentage: number): string {
    // Délégation au service UI
    return cookingMethodUIService.getDifferenceClass(percentage);
  }
}

// Exporter une instance singleton du service
export const cookingMethodPagesService = new CookingMethodPagesService();

// Pour la rétrocompatibilité, exporter aussi sous l'ancien nom
// Cela permet une transition en douceur dans le code existant
export const cookingMethodService = cookingMethodPagesService;
