/**
 * Service pour la gestion du modal d'oubli de mot de passe
 * Ce service encapsule la logique liée au modal de récupération de mot de passe,
 * notamment la validation, la soumission du formulaire et la gestion des erreurs
 */

import { ForgetPasswordModalServiceInterface, ModalOperationResult } from "../interfaces/modals.interface";
import { ForgetPasswordFormData } from "../validation/auth/forget-schema.validation";
import { ToastTypeEnum } from "../enum/general.enum";
import { LogCategory } from "../enum/logging.enum";
import { logger } from "./logging.service";

/**
 * Service pour la gestion du modal d'oubli de mot de passe
 * Implémente l'interface ForgetPasswordModalServiceInterface
 */
class ForgetPasswordModalService implements ForgetPasswordModalServiceInterface {
  /**
   * Initialise les valeurs par défaut pour le formulaire
   * @returns Les valeurs par défaut pour le formulaire
   */
  getDefaultValues(): ForgetPasswordFormData {
    return {
      email: ''
    };
  }
  
  /**
   * Soumet le formulaire de réinitialisation de mot de passe
   * @param data - Les données du formulaire
   * @returns Le résultat de l'opération
   */
  async submitForm(data: ForgetPasswordFormData): Promise<ModalOperationResult> {
    try {
      logger.info(LogCategory.AUTH, 'Submitting forget password form', { email: data.email });
      
      // Ici, nous simulons l'appel à l'API de réinitialisation de mot de passe
      // En production, remplacer par l'appel réel
      const response = await Promise.resolve({
        status: 200,
        result: data
      });
      
      if (response.status !== 200) {
        logger.error(LogCategory.AUTH, 'Forget password API error', { 
          status: response.status 
        });
        
        return {
          success: false,
          message: 'Erreur lors de la demande de réinitialisation du mot de passe',
          error: new Error('API error: ' + response.status)
        };
      }
      
      logger.info(LogCategory.AUTH, 'Password reset email sent successfully', { 
        email: data.email 
      });
      
      return {
        success: true,
        message: 'Un email de réinitialisation a été envoyé',
        data: response.result
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(LogCategory.AUTH, `Error in forget password submission: ${errorMessage}`);
      
      return {
        success: false,
        message: 'Une erreur est survenue lors de la demande de réinitialisation',
        error
      };
    }
  }
  
  /**
   * Gère la navigation après une soumission réussie
   * @param router - Le router pour la navigation
   * @param setShowModal - Fonction pour modifier la visibilité du modal
   */
  handleSuccessNavigation(router: any, setShowModal: (show: boolean) => void): void {
    setShowModal(false);
    router.push('/reset-password');
  }
  
  /**
   * Gère l'affichage des erreurs
   * @param error - L'erreur à afficher
   * @param toast - Service toast pour afficher les messages
   */
  handleError(error: any, toast: any): void {
    toast.show({
      placement: 'top',
      render: ({ id }: { id: string }) => {
        const toastId = 'toast-' + id;
        return {
          id: toastId,
          color: ToastTypeEnum.ERROR,
          title: "Erreur",
          description: error instanceof Error ? error.message : String(error)
        };
      },
    });
  }
  
  /**
   * Ferme le modal
   * @param setShowModal - Fonction pour modifier la visibilité du modal
   */
  closeModal(setShowModal: (show: boolean) => void): void {
    setShowModal(false);
  }
}

// Créer une instance singleton du service
export const forgetPasswordModalService = new ForgetPasswordModalService();
