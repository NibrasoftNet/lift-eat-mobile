/**
 * Interfaces pour les services de gestion des composants forms-input
 * Ces interfaces du00e9finissent les structures utilisu00e9es par les services de formulaire
 */

import { GoalEnum } from "@/utils/enum/user-details.enum";
import { GenderEnum, PhysicalActivityEnum } from "@/utils/enum/user-gender-activity.enum";
import { SharedValue } from "react-native-reanimated";

/**
 * Interface pour les ru00e9sultats de validation
 */
export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

/**
 * Interface pour le service gu00e9nu00e9rique de gestion des formulaires
 */
export interface FormInputServiceInterface {
  /**
   * Valide une valeur nume00e9rique (entier positif)
   * @param value - La valeur u00e0 valider
   * @param fieldName - Le nom du champ pour les messages d'erreur
   * @param options - Options de validation (min, max, requis)
   * @returns Le ru00e9sultat de la validation
   */
  validateNumber(value: any, fieldName: string, options?: {
    min?: number;
    max?: number;
    required?: boolean;
  }): ValidationResult;

  /**
   * Convertit une valeur en nombre
   * @param value - La valeur u00e0 convertir
   * @param defaultValue - Valeur par du00e9faut si la conversion u00e9choue
   * @returns La valeur convertie en nombre
   */
  parseNumber(value: any, defaultValue?: number): number;

  /**
   * Formate une valeur pour l'affichage
   * @param value - La valeur u00e0 formater
   * @returns La valeur formatu00e9e pour l'affichage
   */
  formatDisplayValue(value: any): string;
}

/**
 * Interface pour le service de gestion du formulaire de genre
 */
export interface GenderFormServiceInterface {
  /**
   * Initialise les valeurs d'animation pour le genre
   * @param defaultGender - Le genre par du00e9faut
   * @param maleBarWidth - Valeur partagee pour la largeur de la barre masculine
   * @param femaleBarWidth - Valeur partagee pour la largeur de la barre fu00e9minine
   */
  initializeGenderAnimations(
    defaultGender: GenderEnum,
    maleBarWidth: SharedValue<number>,
    femaleBarWidth: SharedValue<number>
  ): void;

  /**
   * Anime les barres de genre lors du changement
   * @param selectedGender - Le genre su00e9lectionnu00e9
   * @param maleBarWidth - Valeur partagee pour la largeur de la barre masculine
   * @param femaleBarWidth - Valeur partagee pour la largeur de la barre fu00e9minine
   * @param duration - Duru00e9e de l'animation en ms
   */
  animateGenderChange(
    selectedGender: GenderEnum,
    maleBarWidth: SharedValue<number>,
    femaleBarWidth: SharedValue<number>,
    duration?: number
  ): void;

  /**
   * Obtient les styles CSS pour les boutons de genre
   * @param currentGender - Le genre actuel
   * @param targetGender - Le genre cible pour les styles
   * @returns Les classes CSS pour le bouton
   */
  getGenderButtonStyles(currentGender: GenderEnum, targetGender: GenderEnum): {
    buttonClass: string;
    textClass: string;
  };
}

/**
 * Interface pour le service de gestion du formulaire d'objectifs
 */
export interface GoalFormServiceInterface {
  /**
   * Obtient les styles pour les boutons d'objectif
   * @param selectedGoal - L'objectif actuellement su00e9lectionnu00e9
   * @param buttonGoal - L'objectif du bouton pour lequel obtenir les styles
   * @returns Les classes CSS pour le bouton et le texte
   */
  getGoalButtonStyles(selectedGoal: GoalEnum, buttonGoal: GoalEnum): {
    buttonClass: string;
    textClass: string;
  };

  /**
   * Obtient la liste des objectifs disponibles avec leurs libellu00e9s
   * @returns Un tableau d'objets contenant les valeurs et libellu00e9s des objectifs
   */
  getGoalOptions(): Array<{ value: GoalEnum; label: string }>;

  /**
   * Obtient une description de l'objectif su00e9lectionnu00e9
   * @param goal - L'objectif pour lequel obtenir la description
   * @returns La description de l'objectif
   */
  getGoalDescription(goal: GoalEnum): string;
}

/**
 * Interface pour le service de gestion du formulaire d'activitu00e9 physique
 */
export interface PhysicalActivityFormServiceInterface {
  /**
   * Obtient les options d'activitu00e9 physique disponibles
   * @returns Un tableau d'options d'activitu00e9 physique
   */
  getPhysicalActivityOptions(): Array<{ level: PhysicalActivityEnum; description: string }>;

  /**
   * Obtient l'image correspondant u00e0 un niveau d'activitu00e9 physique
   * @param level - Le niveau d'activitu00e9 physique
   * @returns La source de l'image
   */
  getPhysicalActivityImage(level: PhysicalActivityEnum): any;

  /**
   * Obtient les styles pour les boutons d'activitu00e9 physique
   * @param selectedActivity - L'activitu00e9 actuellement su00e9lectionnu00e9e
   * @param buttonActivity - L'activitu00e9 du bouton pour lequel obtenir les styles
   * @returns Les classes CSS pour l'indicateur d'activitu00e9
   */
  getActivityIndicatorStyles(selectedActivity: PhysicalActivityEnum, buttonActivity: PhysicalActivityEnum): string;

  /**
   * Obtient une description du niveau d'activitu00e9 physique
   * @param level - Le niveau d'activitu00e9 physique
   * @returns La description du niveau d'activitu00e9
   */
  getActivityDescription(level: PhysicalActivityEnum): string;
}

/**
 * Interface pour le service de gestion des entru00e9es de poids
 */
export interface WeightInputServiceInterface {
  /**
   * Valide une valeur de poids
   * @param value - La valeur de poids u00e0 valider
   * @param options - Options de validation (min, max, requis)
   * @returns Le ru00e9sultat de la validation
   */
  validateWeight(value: any, options?: {
    min?: number;
    max?: number;
    required?: boolean;
  }): ValidationResult;

  /**
   * Convertit une valeur en poids
   * @param value - La valeur u00e0 convertir
   * @param defaultValue - Valeur par du00e9faut si la conversion u00e9choue
   * @returns La valeur convertie en poids
   */
  parseWeight(value: any, defaultValue?: number): number;

  /**
   * Formate une valeur de poids pour l'affichage
   * @param value - La valeur de poids u00e0 formater
   * @param unit - L'unitu00e9 de poids (kg, lbs)
   * @returns La valeur de poids formatu00e9e pour l'affichage
   */
  formatWeightValue(value: number, unit?: string): string;
}
