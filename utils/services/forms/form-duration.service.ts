/**
 * Service de gestion du formulaire de durée
 * Fournit des fonctionnalités pour la validation et le formatage des valeurs de durée
 */

import { ValidationResult } from "@/utils/interfaces/form-input.interface";
import { logger } from "@/utils/services/common/logging.service";
import { LogCategory } from "@/utils/enum/logging.enum";
import { formInputService } from "@/utils/services/forms/form-input.service";

/**
 * Interface pour le service de gestion du formulaire de durée
 */
export interface DurationFormServiceInterface {
  /**
   * Valide une valeur de durée en semaines
   * @param value - La valeur de durée à valider
   * @param options - Options de validation (min, max, requis)
   * @returns Le résultat de la validation
   */
  validateDuration(value: any, options?: {
    min?: number;
    max?: number;
    required?: boolean;
  }): ValidationResult;

  /**
   * Convertit une valeur en durée
   * @param value - La valeur à convertir
   * @param defaultValue - Valeur par défaut si la conversion échoue
   * @returns La valeur convertie en durée
   */
  parseDuration(value: any, defaultValue?: number): number;

  /**
   * Formate une valeur de durée pour l'affichage
   * @param value - La valeur de durée à formater
   * @returns La valeur de durée formatée pour l'affichage
   */
  formatDurationValue(value: number): string;
}

/**
 * Implémentation du service de gestion du formulaire de durée
 */
class DurationFormService implements DurationFormServiceInterface {
  /**
   * Valide une valeur de durée en semaines
   * @param value - La valeur de durée à valider
   * @param options - Options de validation (min, max, requis)
   * @returns Le résultat de la validation
   */
  validateDuration(value: any, options: {
    min?: number;
    max?: number;
    required?: boolean;
  } = {}): ValidationResult {
    try {
      // Extraction des options
      const { min, max, required } = options;

      // Vérification si la valeur est requise
      if (required && !value && value !== 0) {
        return formInputService.createValidationError('La durée est requise');
      }

      // Si la valeur n'est pas obligatoire et est vide, on considère que c'est valide
      if (!required && !value && value !== 0) {
        return formInputService.createValidationSuccess();
      }

      // Conversion en nombre
      const numericValue = this.parseDuration(value);

      // Vérifications des contraintes min/max
      if (min !== undefined && numericValue < min) {
        return formInputService.createValidationError(`La durée doit être d'au moins ${min} semaine(s)`);
      }

      if (max !== undefined && numericValue > max) {
        return formInputService.createValidationError(`La durée ne peut pas dépasser ${max} semaine(s)`);
      }

      // Si toutes les vérifications sont passées, on retourne un succès
      return formInputService.createValidationSuccess();
    } catch (error) {
      logger.error(LogCategory.FORM, 'Erreur lors de la validation de la durée', { error });
      return formInputService.createValidationError('Format de durée invalide');
    }
  }

  /**
   * Convertit une valeur en durée
   * @param value - La valeur à convertir
   * @param defaultValue - Valeur par défaut si la conversion échoue
   * @returns La valeur convertie en durée
   */
  parseDuration(value: any, defaultValue: number = 0): number {
    try {
      // Si la valeur est déjà un nombre, on la retourne
      if (typeof value === 'number') {
        return value;
      }

      // Si la valeur est une chaîne, on essaie de la convertir en nombre
      if (typeof value === 'string') {
        const parsedValue = parseFloat(value.trim());
        return isNaN(parsedValue) ? defaultValue : parsedValue;
      }

      // Pour les autres types, on retourne la valeur par défaut
      return defaultValue;
    } catch (error) {
      logger.error(LogCategory.FORM, 'Erreur lors de la conversion de la durée', { error });
      return defaultValue;
    }
  }

  /**
   * Formate une valeur de durée pour l'affichage
   * @param value - La valeur de durée à formater
   * @returns La valeur de durée formatée pour l'affichage
   */
  formatDurationValue(value: number): string {
    try {
      // Arrondir à 1 décimale
      const roundedValue = Math.round(value * 10) / 10;
      
      // Formater avec l'unité appropriée
      return `${roundedValue} semaine${roundedValue !== 1 ? 's' : ''}`;
    } catch (error) {
      logger.error(LogCategory.FORM, 'Erreur lors du formatage de la durée', { error });
      return '0 semaine';
    }
  }
}

// Exporter une instance unique du service
export const durationFormService = new DurationFormService();
