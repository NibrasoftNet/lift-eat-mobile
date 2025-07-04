import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

interface WeightInputServiceInterface {
  parseWeight: (value: string) => number | undefined;
  formatWeightValue: (value: number) => string;
  validateWeight: (value: number) => boolean;
}

class WeightInputUIService implements WeightInputServiceInterface {
  // Convertit une chaîne en nombre, retourne undefined si invalide
  parseWeight(value: string): number | undefined {
    try {
      // Supprimer les espaces et remplacer la virgule par un point
      const cleanValue = value.trim().replace(',', '.');
      
      // Si vide, retourner undefined
      if (!cleanValue) {
        return undefined;
      }
      
      // Convertir en nombre
      const numValue = parseFloat(cleanValue);
      
      // Vérifier si c'est un nombre valide
      if (isNaN(numValue)) {
        logger.warn(LogCategory.UI, 'Invalid weight value', { value });
        return undefined;
      }
      
      // Vérifier si le poids est dans une plage valide
      if (!this.validateWeight(numValue)) {
        logger.warn(LogCategory.UI, 'Weight value out of range', { value: numValue });
        return undefined;
      }
      
      return numValue;
    } catch (error) {
      logger.error(LogCategory.UI, 'Error parsing weight value', {
        error: error instanceof Error ? error.message : String(error),
        value
      });
      return undefined;
    }
  }

  // Formate un nombre pour l'affichage
  formatWeightValue(value: number): string {
    try {
      // Si la valeur est undefined ou invalide, retourner une chaîne vide
      if (value === undefined || !this.validateWeight(value)) {
        return '';
      }
      
      // Formater avec 1 décimale si nécessaire
      return value.toLocaleString('fr-FR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1
      });
    } catch (error) {
      logger.error(LogCategory.UI, 'Error formatting weight value', {
        error: error instanceof Error ? error.message : String(error),
        value
      });
      return '';
    }
  }

  // Valide si le poids est dans une plage acceptable
  validateWeight(value: number): boolean {
    // Vérifier si le poids est entre 0 et 1000 kg
    return value > 0 && value <= 1000;
  }
}

// Exporter une instance unique du service
export const weightInputUIService = new WeightInputUIService();
