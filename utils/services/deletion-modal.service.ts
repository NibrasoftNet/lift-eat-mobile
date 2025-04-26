/**
 * Service pour la gestion du modal de suppression
 * Ce service encapsule la logique simplifiée liée au modal de confirmation de suppression
 */

import { DeletionModalServiceInterface } from "../interfaces/modals.interface";
import { LogCategory } from "../enum/logging.enum";
import { logger } from "./logging.service";

/**
 * Service pour la gestion du modal de suppression
 * Implémente l'interface DeletionModalServiceInterface
 */
class DeletionModalService implements DeletionModalServiceInterface {
  /**
   * Gère la confirmation de suppression
   * @param handleDelete - Fonction de suppression à exécuter
   * @param setShowModal - Fonction pour fermer le modal
   */
  async handleConfirmDelete(handleDelete: () => void, setShowModal: (show: boolean) => void): Promise<void> {
    try {
      logger.info(LogCategory.USER, 'User confirmed deletion');
      
      // Exécuter la fonction de suppression
      await handleDelete();
      
      // Fermer le modal après la suppression réussie
      setShowModal(false);
    } catch (error) {
      logger.error(LogCategory.USER, 'Error during deletion process', {
        error: error instanceof Error ? error.message : String(error)
      });
      
      // Même en cas d'erreur, nous fermons le modal pour éviter de bloquer l'utilisateur
      setShowModal(false);
      
      // Propager l'erreur pour un traitement supplémentaire au niveau du composant
      throw error;
    }
  }
  
  /**
   * Gère l'annulation de la suppression
   * @param setShowModal - Fonction pour fermer le modal
   */
  handleCancelDelete(setShowModal: (show: boolean) => void): void {
    logger.info(LogCategory.USER, 'User cancelled deletion');
    setShowModal(false);
  }
}

// Créer une instance singleton du service
export const deletionModalService = new DeletionModalService();
