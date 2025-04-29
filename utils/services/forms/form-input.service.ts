/**
 * Service générique de gestion des formulaires
 * Fournit des fonctionnalités communes pour tous les composants de formulaire
 */

import { FormInputServiceInterface, ValidationResult } from "@/utils/interfaces/form-input.interface";
import { logger } from "@/utils/services/common/logging.service";
import { LogCategory } from "@/utils/enum/logging.enum";

/**
 * Implémentation du service générique pour les formulaires
 */
class FormInputService implements FormInputServiceInterface {
  /**
   * Valide une valeur numérique (entier positif)
   * @param value - La valeur à valider
   * @param fieldName - Le nom du champ pour les messages d'erreur
   * @param options - Options de validation (min, max, requis)
   * @returns Le résultat de la validation
   */
  validateNumber(value: any, fieldName: string, options: {
    min?: number;
    max?: number;
    required?: boolean;
  } = {}): ValidationResult {
    try {
      // Par défaut, la validation est réussie
      const result: ValidationResult = { isValid: true };
      
      // Valeur null ou undefined
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
      
      // Vérification de la conversion
      if (isNaN(numValue)) {
        return {
          isValid: false,
          errorMessage: `${fieldName} must be a valid number`
        };
      }
      
      // Vérification de la valeur minimale
      if (options.min !== undefined && numValue < options.min) {
        return {
          isValid: false,
          errorMessage: `${fieldName} must be at least ${options.min}`
        };
      }
      
      // Vérification de la valeur maximale
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
   * @param value - La valeur à convertir
   * @param defaultValue - Valeur par défaut si la conversion échoue
   * @returns La valeur convertie en nombre
   */
  parseNumber(value: any, defaultValue: number = 0): number {
    try {
      // Cas particuliers
      if (value === null || value === undefined || value === '') {
        return defaultValue;
      }
      
      // Si c'est déjà un nombre, retourner directement
      if (typeof value === 'number') {
        return isNaN(value) ? defaultValue : value;
      }
      
      // Si c'est une chaîne, convertir
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
   * @param value - La valeur à formater
   * @returns La valeur formatée pour l'affichage
   */
  formatDisplayValue(value: any): string {
    try {
      // Cas particuliers
      if (value === null || value === undefined || value === '') {
        return '';
      }
      
      // Conversion en nombre si nécessaire
      const numValue = typeof value === 'number' ? value : this.parseNumber(value);
      
      // Formater sans décimales si entier, avec sinon
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

  /**
   * Crée un résultat de validation réussi
   * @returns Un objet ValidationResult avec isValid=true
   */
  createValidationSuccess(): ValidationResult {
    return { isValid: true };
  }

  /**
   * Crée un résultat de validation en erreur
   * @param errorMessage - Le message d'erreur
   * @returns Un objet ValidationResult avec isValid=false et le message d'erreur
   */
  createValidationError(errorMessage: string): ValidationResult {
    return {
      isValid: false,
      errorMessage
    };
  }
}

// Exporter une instance unique du service
export const formInputService = new FormInputService();
