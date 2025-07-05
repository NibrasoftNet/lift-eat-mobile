import { ModalOperationResult } from '@/utils/interfaces/modals.interface';
import { ResetPasswordData } from '@/utils/interfaces/auth.interface';
import { authCoreService } from '@/utils/services/core/auth-core.service';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

/**
 * Service pour la gestion du modal de mot de passe oublié
 */
class ForgetPasswordModalUIService {
  /**
   * Récupère les valeurs par défaut pour le formulaire
   */
  getDefaultValues(): ResetPasswordData {
    return {
      email: '',
    };
  }

  /**
   * Soumet le formulaire de réinitialisation de mot de passe
   * @param data Données du formulaire
   */
  async submitForm(data: ResetPasswordData): Promise<ModalOperationResult> {
    try {
      logger.info(
        LogCategory.AUTH,
        'Tentative de réinitialisation de mot de passe',
        {
          email: data.email,
        },
      );

      const result = await authCoreService.resetPassword(data);

      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Échec de la réinitialisation du mot de passe',
          message:
            'Une erreur est survenue lors de la réinitialisation du mot de passe',
        };
      }

      return {
        success: true,
        message: 'Email de réinitialisation envoyé avec succès',
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error(
        LogCategory.AUTH,
        'Erreur lors de la réinitialisation du mot de passe',
        {
          error: errorMessage,
        },
      );
      return {
        success: false,
        error: errorMessage,
        message:
          'Une erreur est survenue lors de la réinitialisation du mot de passe',
      };
    }
  }

  /**
   * Gère la navigation après une soumission réussie
   * @param router Router pour la navigation
   * @param setShowModal Fonction pour fermer le modal
   */
  handleSuccessNavigation(router: any, setShowModal: (show: boolean) => void) {
    setShowModal(false);
    router.push('/login');
  }

  /**
   * Gère l'affichage des erreurs
   * @param error Message d'erreur
   * @param toast Service toast
   */
  handleError(error: any, toast: any) {
    toast.show({
      title: error instanceof Error ? error.message : String(error),
      type: 'error',
    });
  }

  /**
   * Ferme le modal
   * @param setShowModal Fonction pour fermer le modal
   */
  closeModal(setShowModal: (show: boolean) => void) {
    setShowModal(false);
  }
}

export const forgetPasswordModalUIService = new ForgetPasswordModalUIService();
