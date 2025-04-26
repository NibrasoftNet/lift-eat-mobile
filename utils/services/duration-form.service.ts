/**
 * Service de gestion du formulaire de duru00e9e
 * Fournit des fonctionnalitu00e9s pour la validation et le formatage des valeurs de duru00e9e
 */

import { ValidationResult } from "../interfaces/form-input.interface";
import { logger } from "./logging.service";
import { LogCategory } from "@/utils/enum/logging.enum";
import { formInputService } from "./form-input.service";

/**
 * Interface pour le service de gestion du formulaire de duru00e9e
 */
export interface DurationFormServiceInterface {
  /**
   * Valide une valeur de duru00e9e en semaines
   * @param value - La valeur de duru00e9e u00e0 valider
   * @param options - Options de validation (min, max, requis)
   * @returns Le ru00e9sultat de la validation
   */
  validateDuration(value: any, options?: {
    min?: number;
    max?: number;
    required?: boolean;
  }): ValidationResult;

  /**
   * Convertit une valeur en duru00e9e
   * @param value - La valeur u00e0 convertir
   * @param defaultValue - Valeur par du00e9faut si la conversion u00e9choue
   * @returns La valeur convertie en duru00e9e
   */
  parseDuration(value: any, defaultValue?: number): number;

  /**
   * Formate une valeur de duru00e9e pour l'affichage
   * @param value - La valeur de duru00e9e u00e0 formater
   * @returns La valeur de duru00e9e formatu00e9e pour l'affichage
   */
  formatDurationValue(value: number): string;
}

/**
 * Implu00e9mentation du service de gestion du formulaire de duru00e9e
 */
class DurationFormService implements DurationFormServiceInterface {
  /**
   * Valide une valeur de duru00e9e en semaines
   * @param value - La valeur de duru00e9e u00e0 valider
   * @param options - Options de validation (min, max, requis)
   * @returns Le ru00e9sultat de la validation
   */
  validateDuration(value: any, options: {
    min?: number;
    max?: number;
    required?: boolean;
  } = {}): ValidationResult {
    try {
      // Utiliser le service gu00e9nu00e9rique pour valider la valeur numu00e9rique
      return formInputService.validateNumber(value, 'Duration', {
        min: options.min || 1, // Duru00e9e minimum par du00e9faut (1 semaine)
        max: options.max || 52, // Duru00e9e maximum par du00e9faut (52 semaines / 1 an)
        required: options.required || false
      });
    } catch (error) {
      logger.error(LogCategory.FORM, `Error validating duration: ${error}`);
      return {
        isValid: false,
        errorMessage: 'Invalid duration value'
      };
    }
  }

  /**
   * Convertit une valeur en duru00e9e
   * @param value - La valeur u00e0 convertir
   * @param defaultValue - Valeur par du00e9faut si la conversion u00e9choue
   * @returns La valeur convertie en duru00e9e
   */
  parseDuration(value: any, defaultValue: number = 0): number {
    try {
      // Utiliser le service gu00e9nu00e9rique pour convertir la valeur en nombre
      return formInputService.parseNumber(value, defaultValue);
    } catch (error) {
      logger.error(LogCategory.FORM, `Error parsing duration: ${error}`);
      return defaultValue;
    }
  }

  /**
   * Formate une valeur de duru00e9e pour l'affichage
   * @param value - La valeur de duru00e9e u00e0 formater
   * @returns La valeur de duru00e9e formatu00e9e pour l'affichage
   */
  formatDurationValue(value: number): string {
    try {
      // Valeurs nulles ou indu00e9finies
      if (value === null || value === undefined || isNaN(value)) {
        return '';
      }
      
      // Formater avec l'unitu00e9
      const formattedValue = formInputService.formatDisplayValue(value);
      return value === 1 ? `${formattedValue} week` : `${formattedValue} weeks`;
    } catch (error) {
      logger.error(LogCategory.FORM, `Error formatting duration value: ${error}`);
      return value === 1 ? `${value} week` : `${value} weeks`;
    }
  }
}

// Exporter une instance unique du service
export const durationFormService = new DurationFormService();
