/**
 * Service UI pour le formatage des valeurs
 * Centralise les fonctions de formatage pour l'affichage dans l'UI
 */

import { LogCategory } from "@/utils/enum/logging.enum";
import { logger } from "@/utils/services/common/logging.service";

/**
 * Service pour le formatage des éléments UI
 */
class FormattingUIService {
  /**
   * Formater un pourcentage pour l'affichage
   * @param value Valeur en pourcentage
   * @returns Chaîne formatée avec signe + ou -
   */
  formatPercentage(value: number): string {
    try {
      const rounded = Math.round(value * 10) / 10;
      return rounded >= 0 ? `+${rounded}%` : `${rounded}%`;
    } catch (error) {
      logger.warn(
        LogCategory.UI,
        "Erreur lors du formatage du pourcentage",
        { value, error }
      );
      return "0%";
    }
  }
  
  /**
   * Obtenir une classe CSS basée sur le pourcentage
   * @param percentage Valeur en pourcentage
   * @returns Nom de classe CSS
   */
  getDifferenceClass(percentage: number): string {
    try {
      if (percentage === 0) return "text-gray-500";
      return percentage > 0 ? "text-amber-500" : "text-green-500";
    } catch (error) {
      logger.warn(
        LogCategory.UI,
        "Erreur lors de la détermination de la classe de différence",
        { percentage, error }
      );
      return "text-gray-500";
    }
  }
}

// Export de l'instance singleton
export const formattingUIService = new FormattingUIService();
