/**
 * Service de gestion des entrées de poids
 * Fournit des fonctionnalités pour la validation et le formatage des valeurs de poids
 */

import { WeightInputServiceInterface, ValidationResult } from "../interfaces/form-input.interface";
import { logger } from "./logging.service";
import { LogCategory } from "@/utils/enum/logging.enum";
import { formInputService } from "./form-input.service";

/**
 * Implémentation du service de gestion des entrées de poids
 */
class WeightInputService implements WeightInputServiceInterface {
  /**
   * Valide une valeur de poids
   * @param value - La valeur de poids à valider
   * @param options - Options de validation (min, max, requis)
   * @returns Le résultat de la validation
   */
  validateWeight(value: any, options: {
    min?: number;
    max?: number;
    required?: boolean;
  } = {}): ValidationResult {
    try {
      // Utiliser le service générique pour valider la valeur numérique
      return formInputService.validateNumber(value, 'Weight', {
        min: options.min || 30, // Poids minimum par défaut (30kg/66lbs)
        max: options.max || 300, // Poids maximum par défaut (300kg/661lbs)
        required: options.required || false
      });
    } catch (error) {
      logger.error(LogCategory.FORM, `Error validating weight: ${error}`);
      return {
        isValid: false,
        errorMessage: 'Invalid weight value'
      };
    }
  }

  /**
   * Convertit une valeur en poids
   * @param value - La valeur à convertir
   * @param defaultValue - Valeur par défaut si la conversion échoue
   * @returns La valeur convertie en poids
   */
  parseWeight(value: any, defaultValue: number = 0): number {
    try {
      // Utiliser le service générique pour convertir la valeur en nombre
      return formInputService.parseNumber(value, defaultValue);
    } catch (error) {
      logger.error(LogCategory.FORM, `Error parsing weight: ${error}`);
      return defaultValue;
    }
  }

  /**
   * Formate une valeur de poids pour l'affichage
   * @param value - La valeur de poids à formater
   * @param unit - L'unité de poids (kg, lbs)
   * @returns La valeur de poids formatée pour l'affichage
   */
  formatWeightValue(value: number, unit: string = 'kg'): string {
    try {
      // Valeurs nulles ou indéfinies
      if (value === null || value === undefined || isNaN(value)) {
        return '';
      }
      
      // Formater avec l'unité
      const formattedValue = formInputService.formatDisplayValue(value);
      return `${formattedValue} ${unit}`;
    } catch (error) {
      logger.error(LogCategory.FORM, `Error formatting weight value: ${error}`);
      return `${value} ${unit}`;
    }
  }
}

// Exporter une instance unique du service
export const weightInputService = new WeightInputService();
