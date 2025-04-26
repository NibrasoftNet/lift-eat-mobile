/**
 * Service de gestion du formulaire d'activité physique
 * Fournit des fonctionnalités pour la gestion des niveaux d'activité physique
 */

import { PhysicalActivityEnum } from "@/utils/enum/user-gender-activity.enum";
import { PhysicalActivityFormServiceInterface } from "../interfaces/form-input.interface";
import { logger } from "./logging.service";
import { LogCategory } from "@/utils/enum/logging.enum";
import { activityOptions } from "@/utils/constants/constant";
import { GetPhysicalActivityImages } from "@/utils/utils";

/**
 * Implémentation du service de gestion du formulaire d'activité physique
 */
class PhysicalActivityFormService implements PhysicalActivityFormServiceInterface {
  /**
   * Obtient les options d'activité physique disponibles
   * @returns Un tableau d'options d'activité physique formattées avec descriptions
   */
  getPhysicalActivityOptions(): Array<{ level: PhysicalActivityEnum; description: string }> {
    try {
      // Ajouter les descriptions pour chaque niveau d'activité
      return activityOptions.map(option => ({
        level: option.level,
        description: this.getActivityDescription(option.level)
      }));
    } catch (error) {
      logger.error(LogCategory.FORM, `Error getting physical activity options: ${error}`);
      return [];
    }
  }

  /**
   * Obtient l'image correspondant à un niveau d'activité physique
   * @param level - Le niveau d'activité physique
   * @returns La source de l'image
   */
  getPhysicalActivityImage(level: PhysicalActivityEnum): any {
    try {
      return GetPhysicalActivityImages[level];
    } catch (error) {
      logger.error(LogCategory.FORM, `Error getting physical activity image: ${error}`);
      return null;
    }
  }

  /**
   * Obtient les styles pour les boutons d'activité physique
   * @param selectedActivity - L'activité actuellement sélectionnée
   * @param buttonActivity - L'activité du bouton pour lequel obtenir les styles
   * @returns Les classes CSS pour l'indicateur d'activité
   */
  getActivityIndicatorStyles(selectedActivity: PhysicalActivityEnum, buttonActivity: PhysicalActivityEnum): string {
    try {
      // Vérifier si le bouton correspond à l'activité sélectionnée
      return buttonActivity === selectedActivity ? 'bg-primary-500' : 'bg-secondary-500';
    } catch (error) {
      logger.error(LogCategory.FORM, `Error getting activity indicator styles: ${error}`);
      return 'bg-secondary-500'; // Style par défaut
    }
  }

  /**
   * Obtient une description du niveau d'activité physique
   * @param level - Le niveau d'activité physique
   * @returns La description du niveau d'activité
   */
  getActivityDescription(level: PhysicalActivityEnum): string {
    try {
      // Retourne une description basée sur le niveau d'activité
      switch (level) {
        case PhysicalActivityEnum.LOW:
          return 'Rarely or never exercise, desk job';
        case PhysicalActivityEnum.SEDENTARY:
          return 'Light exercise 1-3 times/week';
        case PhysicalActivityEnum.MODERATE:
          return 'Moderate exercise 3-5 times/week';
        case PhysicalActivityEnum.HIGH:
          return 'Very active, exercise 6-7 times/week';
        default:
          return 'Select an activity level';
      }
    } catch (error) {
      logger.error(LogCategory.FORM, `Error getting activity description: ${error}`);
      return 'Select an activity level';
    }
  }

  /**
   * Obtient les styles pour les boutons d'activité physique
   * @param selectedActivity - L'activité actuellement sélectionnée
   * @param buttonActivity - L'activité du bouton pour lequel obtenir les styles
   * @returns Les classes CSS pour le bouton et le texte
   */
  getActivityButtonStyles(selectedActivity: PhysicalActivityEnum, buttonActivity: PhysicalActivityEnum): {
    buttonClass: string;
    textClass: string;
  } {
    try {
      // Classes de base
      const baseButtonClass = "flex flex-col items-center justify-center w-full h-24 bg-transparent";
      const baseTextClass = "text-white capitalize";
      
      // Pas de modification nécessaire car les styles sont gérés par l'indicateur
      return {
        buttonClass: baseButtonClass,
        textClass: baseTextClass
      };
    } catch (error) {
      logger.error(LogCategory.FORM, `Error getting activity button styles: ${error}`);
      return {
        buttonClass: "flex flex-col items-center justify-center w-full h-24 bg-transparent",
        textClass: "text-white capitalize"
      };
    }
  }
}

// Exporter une instance unique du service
export const physicalActivityFormService = new PhysicalActivityFormService();
