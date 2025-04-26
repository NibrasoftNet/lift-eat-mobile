/**
 * Interfaces pour les services de gestion des formulaires complets
 * Ces interfaces définissent les contrats pour les services gérant les formulaires
 */

import { UserGenderActivityDefaultValueProps, UserGenderActivityFormData } from "../validation/user/user-gender-activity.validation";
import { UserDetailsDefaultValuesProps, UserDetailsFormData } from "../validation/user/user-details.validation";
import { UserProfileDefaultValuesProps, UserProfileFormData } from "../validation/user/user-profile.validation";
import { CalculateCaloriesIntakeDefaultValueProps, CalculateCaloriesIntakeFormData } from "../validation/plan/calculate-calories-intake.validation";
import { NutritionGoalDefaultValueProps, NutritionGoalSchemaFormData } from "../validation/plan/nutrition-goal.validation";
import { MealDefaultValuesProps, MealFormData } from "../validation/meal/meal.validation";
import { useToast } from "@/components/ui/toast";

// Type pour le service de toast
type ToastServiceType = ReturnType<typeof useToast>;

/**
 * Interface pour les résultats d'opération de formulaire
 */
export interface FormOperationResult {
  success: boolean;
  message: string;
  data?: any;
  error?: any;
}

/**
 * Interface pour le service de gestion du formulaire d'activité et genre
 */
export interface UserGenderActivityFormServiceInterface {
  /**
   * Valide l'utilisateur courant pour les opérations sur le formulaire
   * @param userId - L'ID de l'utilisateur courant
   * @param targetUserId - L'ID de l'utilisateur cible (dont les données sont modifiées)
   * @param toast - Service toast pour afficher les messages
   * @returns Un booléen indiquant si l'utilisateur est autorisé
   */
  validateUserAccess(userId: string | null, targetUserId: string, toast: ToastServiceType): boolean;
  
  /**
   * Soumet les données du formulaire pour création ou mise à jour
   * @param data - Les données du formulaire
   * @param userId - L'ID de l'utilisateur
   * @param operation - L'opération (create ou update)
   * @returns Le résultat de l'opération
   */
  submitForm(data: UserGenderActivityFormData, userId: string, operation: 'create' | 'update'): Promise<FormOperationResult>;
  
  /**
   * Gère l'action d'annulation du formulaire
   * @param operation - L'opération en cours (create ou update)
   * @param router - Le router pour la navigation
   */
  handleCancel(operation: 'create' | 'update', router: any): void;
  
  /**
   * Prépare les valeurs par défaut pour le formulaire
   * @param defaultValues - Les valeurs par défaut fournies
   * @returns Les valeurs par défaut normalisées
   */
  prepareDefaultValues(defaultValues: UserGenderActivityDefaultValueProps): UserGenderActivityDefaultValueProps;
}

/**
 * Interface pour le service de gestion du formulaire de détails utilisateur
 */
export interface UserDetailsFormServiceInterface {
  /**
   * Valide l'utilisateur courant pour les opérations sur le formulaire
   * @param userId - L'ID de l'utilisateur courant
   * @param targetUserId - L'ID de l'utilisateur cible (dont les données sont modifiées)
   * @param toast - Service toast pour afficher les messages
   * @returns Un booléen indiquant si l'utilisateur est autorisé
   */
  validateUserAccess(userId: string | null, targetUserId: string, toast: ToastServiceType): boolean;
  
  /**
   * Soumet les données du formulaire pour création ou mise à jour
   * @param data - Les données du formulaire
   * @param userId - L'ID de l'utilisateur
   * @param operation - L'opération (create ou update)
   * @returns Le résultat de l'opération
   */
  submitForm(data: UserDetailsFormData, userId: string, operation: 'create' | 'update'): Promise<FormOperationResult>;
  
  /**
   * Gère l'action d'annulation du formulaire
   * @param operation - L'opération en cours (create ou update)
   * @param router - Le router pour la navigation
   */
  handleCancel(operation: 'create' | 'update', router: any): void;
  
  /**
   * Prépare les valeurs par défaut pour le formulaire
   * @param defaultValues - Les valeurs par défaut fournies
   * @returns Les valeurs par défaut normalisées
   */
  prepareDefaultValues(defaultValues: UserDetailsDefaultValuesProps): UserDetailsDefaultValuesProps;

  /**
   * Gère le changement d'unité de poids
   * @param unit - L'unité de poids sélectionnée
   * @param setValue - Fonction pour mettre à jour la valeur du champ
   * @param index - Index pour l'animation
   */
  handleWeightUnitChange(unit: string, setValue: Function, index: number): void;

  /**
   * Gère le changement d'unité de taille
   * @param unit - L'unité de taille sélectionnée
   * @param setValue - Fonction pour mettre à jour la valeur du champ
   * @param index - Index pour l'animation
   */
  handleHeightUnitChange(unit: string, setValue: Function, index: number): void;
}

/**
 * Interface pour le service de gestion du formulaire de profil utilisateur
 */
export interface UserProfileFormServiceInterface {
  /**
   * Valide l'utilisateur courant pour les opérations sur le formulaire
   * @param userId - L'ID de l'utilisateur courant
   * @param targetUserId - L'ID de l'utilisateur cible (dont les données sont modifiées)
   * @param toast - Service toast pour afficher les messages
   * @returns Un booléen indiquant si l'utilisateur est autorisé
   */
  validateUserAccess(userId: string | null, targetUserId: string, toast: ToastServiceType): boolean;
  
  /**
   * Soumet les données du formulaire pour mise à jour du profil
   * @param data - Les données du formulaire
   * @param userId - L'ID de l'utilisateur
   * @returns Le résultat de l'opération
   */
  submitForm(data: UserProfileFormData, userId: string): Promise<FormOperationResult>;
  
  /**
   * Prépare les valeurs par défaut pour le formulaire
   * @param defaultValues - Les valeurs par défaut fournies
   * @returns Les valeurs par défaut normalisées
   */
  prepareDefaultValues(defaultValues: UserProfileDefaultValuesProps): UserProfileFormData;
  
  /**
   * Gère la sélection d'image depuis la caméra ou la galerie
   * @param source - La source de l'image (camera ou gallery)
   * @returns La promesse contenant le résultat de la sélection
   */
  handleImageSelection(source: 'camera' | 'gallery'): Promise<any>;
}

/**
 * Interface pour le service de gestion du formulaire de calcul des calories
 */
export interface CaloriesIntakeFormServiceInterface {
  /**
   * Valide l'utilisateur courant pour les opérations sur le formulaire
   * @param userId - L'ID de l'utilisateur courant
   * @param toast - Service toast pour afficher les messages
   * @returns Un booléen indiquant si l'utilisateur est autorisé
   */
  validateUserAccess(userId: string | null, toast: ToastServiceType): boolean;
  
  /**
   * Soumet les données du formulaire pour le calcul des calories
   * @param data - Les données du formulaire
   * @param userId - L'ID de l'utilisateur
   * @returns Le résultat de l'opération
   */
  submitForm(data: CalculateCaloriesIntakeFormData, userId: string): Promise<FormOperationResult>;
  
  /**
   * Prépare les valeurs par défaut pour le formulaire
   * @param defaultValues - Les valeurs par défaut fournies
   * @returns Les valeurs par défaut normalisées
   */
  prepareDefaultValues(defaultValues: CalculateCaloriesIntakeDefaultValueProps): CalculateCaloriesIntakeFormData;
  
  /**
   * Calcule les besoins caloriques basés sur les données du formulaire
   * @param data - Les données du formulaire
   * @param weight - Le poids de l'utilisateur
   * @param height - La taille de l'utilisateur
   * @returns Le calcul des besoins caloriques totaux
   */
  calculateCalories(data: CalculateCaloriesIntakeFormData, weight: number, height: number): number;
  
  /**
   * Gère l'action d'annulation du formulaire
   * @param router - Le router pour la navigation
   */
  handleCancel(router: any): void;
}

/**
 * Interface pour le service de gestion du formulaire d'objectif nutritionnel
 */
export interface NutritionGoalFormServiceInterface {
  /**
   * Valide l'utilisateur courant pour les opérations sur le formulaire
   * @param userId - L'ID de l'utilisateur courant
   * @param targetUserId - L'ID de l'utilisateur cible (dont les données sont modifiées)
   * @param toast - Service toast pour afficher les messages
   * @returns Un booléen indiquant si l'utilisateur est autorisé
   */
  validateUserAccess(userId: string | null, targetUserId: string, toast: ToastServiceType): boolean;
  
  /**
   * Soumet les données du formulaire pour la création d'un objectif nutritionnel
   * @param data - Les données du formulaire
   * @param userId - L'ID de l'utilisateur
   * @returns Le résultat de l'opération
   */
  submitForm(data: NutritionGoalSchemaFormData, userId: string): Promise<FormOperationResult>;
  
  /**
   * Prépare les valeurs par défaut pour le formulaire
   * @param defaultValues - Les valeurs par défaut fournies
   * @returns Les valeurs par défaut normalisées
   */
  prepareDefaultValues(defaultValues: NutritionGoalDefaultValueProps): NutritionGoalSchemaFormData;
  
  /**
   * Gère le changement de type d'objectif
   * @param goalUnit - Le type d'objectif sélectionné
   * @param setValue - Fonction pour mettre à jour la valeur du champ
   */
  handleGoalUnitChange(goalUnit: string, setValue: Function): void;
  
  /**
   * Calcule la répartition des macronutriments en fonction de l'objectif
   * @param data - Les données du formulaire
   * @param caloriesPerDay - Nombre de calories quotidiennes
   * @returns La répartition des macronutriments en pourcentage
   */
  calculateMacrosDistribution(data: NutritionGoalSchemaFormData, caloriesPerDay: number): { carbs: number, protein: number, fat: number };
  
  /**
   * Gère l'action d'annulation du formulaire
   * @param router - Le router pour la navigation
   */
  handleCancel(router: any): void;
}
