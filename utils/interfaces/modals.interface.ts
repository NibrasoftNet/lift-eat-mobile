/**
 * Interfaces pour les services de gestion des modaux
 * Ces interfaces définissent les contrats pour les services gérant les différents modaux
 */

import { ForgetPasswordFormData } from "../validation/auth/forget-schema.validation";
import { MealOrmProps } from "@/db/schema";
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import * as schema from '@/db/schema';
import { QueryClient } from '@tanstack/react-query';

// Type pour le service de toast
type ToastServiceType = any; // À remplacer par le type réel si nécessaire

/**
 * Interface pour les résultats d'opération de modal
 */
export interface ModalOperationResult {
  success: boolean;
  message: string;
  data?: any;
  error?: any;
}

/**
 * Interface pour le service de gestion du modal d'oubli de mot de passe
 */
export interface ForgetPasswordModalServiceInterface {
  /**
   * Initialise les valeurs par défaut pour le formulaire
   * @returns Les valeurs par défaut pour le formulaire
   */
  getDefaultValues(): ForgetPasswordFormData;
  
  /**
   * Soumet le formulaire de réinitialisation de mot de passe
   * @param data - Les données du formulaire
   * @returns Le résultat de l'opération
   */
  submitForm(data: ForgetPasswordFormData): Promise<ModalOperationResult>;
  
  /**
   * Gère la navigation après une soumission réussie
   * @param router - Le router pour la navigation
   * @param setShowModal - Fonction pour modifier la visibilité du modal
   */
  handleSuccessNavigation(router: any, setShowModal: (show: boolean) => void): void;
  
  /**
   * Gère l'affichage des erreurs
   * @param error - L'erreur à afficher
   * @param toast - Service toast pour afficher les messages
   */
  handleError(error: any, toast: ToastServiceType): void;
  
  /**
   * Ferme le modal
   * @param setShowModal - Fonction pour modifier la visibilité du modal
   */
  closeModal(setShowModal: (show: boolean) => void): void;
}

/**
 * Interface pour le service de gestion du modal de modification de quantité de repas
 */
export interface MealQuantityModalServiceInterface {
  /**
   * Met à jour la quantité d'un repas dans un plan journalier
   * @param dailyPlanId - ID du plan journalier
   * @param mealId - ID du repas
   * @param quantity - Nouvelle quantité
   * @param onSuccess - Callback en cas de succès
   * @param queryClient - Client QueryClient pour l'invalidation du cache
   * @param toast - Service toast pour afficher les messages
   * @returns Le résultat de l'opération
   */
  updateMealQuantity(
    dailyPlanId: number,
    mealId: number,
    quantity: number,
    onSuccess?: () => Promise<void>,
    queryClient?: QueryClient,
    toast?: ToastServiceType
  ): Promise<ModalOperationResult>;
  
  /**
   * Gère le changement de quantité
   * @param value - Nouvelle valeur
   * @returns La nouvelle quantité validée
   */
  handleQuantityChange(value: string): number;
  
  /**
   * Ajuste la quantité par incrémentation ou décrémentation
   * @param currentQuantity - Quantité actuelle
   * @param increment - Si vrai, incrémente la quantité; si faux, décrémente
   * @param step - Pas d'incrémentation/décrémentation
   * @returns La nouvelle quantité ajustée
   */
  adjustQuantity(currentQuantity: number, increment: boolean, step?: number): number;
  
  /**
   * Ferme le modal
   * @param onClose - Fonction de fermeture du modal
   */
  closeModal(onClose: () => void): void;
}

/**
 * Interface pour le service de gestion du modal d'options de repas
 */
export interface MealOptionsModalServiceInterface {
  /**
   * Navigue vers les détails d'un repas
   * @param meal - Le repas dont on souhaite voir les détails
   * @param router - Le router pour la navigation
   * @param onClose - Fonction de fermeture du modal
   */
  handleViewDetails(meal: MealOrmProps, router: any, onClose: () => void): void;
  
  /**
   * Navigue vers la page de mise à jour d'un repas
   * @param meal - Le repas à mettre à jour
   * @param router - Le router pour la navigation
   * @param onClose - Fonction de fermeture du modal
   */
  handleUpdate(meal: MealOrmProps, router: any, onClose: () => void): void;
  
  /**
   * Gère la suppression d'un repas
   * @param onDelete - Fonction de suppression fournie par le parent
   * @param onClose - Fonction de fermeture du modal
   * @returns Une promesse résolue après la suppression
   */
  handleDelete(onDelete?: () => Promise<void>, onClose?: () => void): Promise<void>;
  
  /**
   * Ouvre le modal de modification de quantité
   * @param setShowQuantityModal - Fonction pour modifier la visibilité du modal de quantité
   * @param onClose - Fonction de fermeture du modal d'options
   */
  openQuantityModal(setShowQuantityModal: (show: boolean) => void, onClose: () => void): void;
}

/**
 * Interface pour le service de gestion du modal de suppression
 */
export interface DeletionModalServiceInterface {
  /**
   * Gère la confirmation de suppression
   * @param handleDelete - Fonction de suppression à exécuter
   * @param setShowModal - Fonction pour fermer le modal
   */
  handleConfirmDelete(handleDelete: () => void, setShowModal: (show: boolean) => void): Promise<void>;
  
  /**
   * Gère l'annulation de la suppression
   * @param setShowModal - Fonction pour fermer le modal
   */
  handleCancelDelete(setShowModal: (show: boolean) => void): void;
}
