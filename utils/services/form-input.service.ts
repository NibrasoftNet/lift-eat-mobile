/**
 * Service gu00e9nu00e9rique de gestion des formulaires
 * Fournit des fonctionnalitu00e9s communes pour tous les composants de formulaire
 */

import { FormInputServiceInterface, ValidationResult } from "../interfaces/form-input.interface";
import { logger } from "./logging.service";
import { LogCategory } from "@/utils/enum/logging.enum";

/**
 * Implu00e9mentation du service gu00e9nu00e9rique pour les formulaires
 */
class FormInputService implements FormInputServiceInterface {
  /**
   * Valide une valeur nume00e9rique (entier positif)
   * @param value - La valeur u00e0 valider
   * @param fieldName - Le nom du champ pour les messages d'erreur
   * @param options - Options de validation (min, max, requis)
   * @returns Le ru00e9sultat de la validation
   */
  validateNumber(value: any, fieldName: string, options: {
    min?: number;
    max?: number;
    required?: boolean;
  } = {}): ValidationResult {
    try {
      // Par du00e9faut, la validation est ru00e9ussie
      const result: ValidationResult = { isValid: true };
      
      // Valeur null ou undu00e9finie
      if (value === null || value === undefined || value === '') {
        if (options.required) {
          return {
            isValid: false,
            errorMessage: `${fieldName} is required`
          };
        }
        return result; // Non requis, donc valide
      }
      
      // Conversion en nombre
      const numValue = this.parseNumber(value);
      
      // Vu00e9rification de la conversion
      if (isNaN(numValue)) {
        return {
          isValid: false,
          errorMessage: `${fieldName} must be a valid number`
        };
      }
      
      // Vu00e9rification de la valeur minimale
      if (options.min !== undefined && numValue < options.min) {
        return {
          isValid: false,
          errorMessage: `${fieldName} must be at least ${options.min}`
        };
      }
      
      // Vu00e9rification de la valeur maximale
      if (options.max !== undefined && numValue > options.max) {
        return {
          isValid: false,
          errorMessage: `${fieldName} must be at most ${options.max}`
        };
      }
      
      return result;
    } catch (error) {
      logger.error(LogCategory.FORM, `Error validating number: ${error}`);
      return {
        isValid: false,
        errorMessage: `Invalid ${fieldName} value`
      };
    }
  }

  /**
   * Convertit une valeur en nombre
   * @param value - La valeur u00e0 convertir
   * @param defaultValue - Valeur par du00e9faut si la conversion u00e9choue
   * @returns La valeur convertie en nombre
   */
  parseNumber(value: any, defaultValue: number = 0): number {
    try {
      // Cas particuliers
      if (value === null || value === undefined || value === '') {
        return defaultValue;
      }
      
      // Si c'est du00e9ju00e0 un nombre, retourner directement
      if (typeof value === 'number') {
        return isNaN(value) ? defaultValue : value;
      }
      
      // Si c'est une chau00eene, convertir
      if (typeof value === 'string') {
        const parsed = parseFloat(value.replace(/,/g, '.'));
        return isNaN(parsed) ? defaultValue : parsed;
      }
      
      // Autres cas, essayer la conversion directe
      const parsed = Number(value);
      return isNaN(parsed) ? defaultValue : parsed;
    } catch (error) {
      logger.error(LogCategory.FORM, `Error parsing number: ${error}`);
      return defaultValue;
    }
  }

  /**
   * Formate une valeur pour l'affichage
   * @param value - La valeur u00e0 formater
   * @returns La valeur formatu00e9e pour l'affichage
   */
  formatDisplayValue(value: any): string {
    try {
      // Cas particuliers
      if (value === null || value === undefined || value === '') {
        return '';
      }
      
      // Conversion en nombre si nu00e9cessaire
      const numValue = typeof value === 'number' ? value : this.parseNumber(value);
      
      // Formater sans du00e9cimales si entier, avec sinon
      if (Number.isInteger(numValue)) {
        return numValue.toString();
      } else {
        return numValue.toFixed(1);
      }
    } catch (error) {
      logger.error(LogCategory.FORM, `Error formatting display value: ${error}`);
      return String(value);
    }
  }
}

// Exporter une instance unique du service
export const formInputService = new FormInputService();
