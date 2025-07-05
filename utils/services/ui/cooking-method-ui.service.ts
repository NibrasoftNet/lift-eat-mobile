/**
 * Service UI pour les méthodes de cuisson
 * Gère le formatage et les aspects visuels des méthodes de cuisson
 */

import { formattingUIService } from '@/utils/services/ui/formatting-ui.service';

/**
 * Service pour les aspects UI des méthodes de cuisson
 */
class CookingMethodUIService {
  /**
   * Formater un pourcentage pour l'affichage
   * @param value Valeur en pourcentage
   * @returns Chaîne formatée avec signe + ou -
   */
  formatPercentage(value: number): string {
    return formattingUIService.formatPercentage(value);
  }

  /**
   * Obtenir une classe CSS basée sur le pourcentage
   * @param percentage Valeur en pourcentage
   * @returns Nom de classe CSS
   */
  getDifferenceClass(percentage: number): string {
    return formattingUIService.getDifferenceClass(percentage);
  }
}

export const cookingMethodUIService = new CookingMethodUIService();
