/**
 * Service de gestion du formulaire d'objectifs
 * Fournit des fonctionnalités pour la gestion des objectifs d'entraînement
 */

import { GoalEnum } from "@/utils/enum/user-details.enum";
import { GoalFormServiceInterface } from "@/utils/interfaces/form-input.interface";
import { logger } from "@/utils/services/common/logging.service";
import { LogCategory } from "@/utils/enum/logging.enum";

/**
 * Implémentation du service de gestion du formulaire d'objectifs
 */
class GoalFormService implements GoalFormServiceInterface {
  /**
   * Obtient les styles pour les boutons d'objectif
   * @param selectedGoal - L'objectif actuellement sélectionné
   * @param buttonGoal - L'objectif du bouton pour lequel obtenir les styles
   * @returns Les classes CSS pour le bouton et le texte
   */
  getGoalButtonStyles(selectedGoal: GoalEnum, buttonGoal: GoalEnum): {
    buttonClass: string;
    textClass: string;
  } {
    try {
      // Vérifier si le bouton correspond à l'objectif sélectionné
      const isSelected = selectedGoal === buttonGoal;
      
      // Classes pour le bouton
      const baseButtonClass = "flex-1 mx-1";
      const buttonClass = isSelected
        ? `${baseButtonClass} bg-blue-600`
        : `${baseButtonClass} bg-gray-200`;
      
      // Classes pour le texte
      const textClass = isSelected ? "text-white" : "text-gray-700";
      
      return { buttonClass, textClass };
    } catch (error) {
      logger.error(LogCategory.FORM, `Error getting goal button styles: ${error}`);
      // Retourner des styles par défaut en cas d'erreur
      return {
        buttonClass: "flex-1 mx-1 bg-gray-200",
        textClass: "text-gray-700"
      };
    }
  }

  /**
   * Obtient la liste des objectifs disponibles avec leurs libellés
   * @returns Un tableau d'objets contenant les valeurs et libellés des objectifs
   */
  getGoalOptions(): Array<{ value: GoalEnum; label: string }> {
    try {
      return [
        { value: GoalEnum.MAINTAIN, label: "Maintain" },
        { value: GoalEnum.WEIGHT_LOSS, label: "Lose" },
        { value: GoalEnum.GAIN_MUSCLE, label: "Gain" }
      ];
    } catch (error) {
      logger.error(LogCategory.FORM, `Error getting goal options: ${error}`);
      // Retourner un tableau vide en cas d'erreur
      return [];
    }
  }

  /**
   * Obtient une description de l'objectif sélectionné
   * @param goal - L'objectif pour lequel obtenir la description
   * @returns La description de l'objectif
   */
  getGoalDescription(goal: GoalEnum): string {
    try {
      switch (goal) {
        case GoalEnum.MAINTAIN:
          return "Maintain your current weight while improving body composition.";
        case GoalEnum.WEIGHT_LOSS:
          return "Reduce body fat while preserving lean muscle mass.";
        case GoalEnum.GAIN_MUSCLE:
          return "Increase muscle mass and strength with a caloric surplus.";
        default:
          return "Select a goal to see its description.";
      }
    } catch (error) {
      logger.error(LogCategory.FORM, `Error getting goal description: ${error}`);
      return "Select a goal to see its description.";
    }
  }
}

// Exporter une instance unique du service
export const goalFormService = new GoalFormService();
