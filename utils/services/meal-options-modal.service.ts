/**
 * Service pour la gestion du modal d'options de repas
 * Ce service encapsule la logique liée au modal d'options pour les repas,
 * notamment la navigation, la mise à jour et la suppression
 */

import { MealOptionsModalServiceInterface, ModalOperationResult } from "../interfaces/modals.interface";
import { MealOrmProps } from "@/db/schema";
import { LogCategory } from "../enum/logging.enum";
import { logger } from "./logging.service";

/**
 * Service pour la gestion du modal d'options de repas
 * Implémente l'interface MealOptionsModalServiceInterface
 */
class MealOptionsModalService implements MealOptionsModalServiceInterface {
  /**
   * Navigue vers les détails d'un repas
   * @param meal - Le repas dont on souhaite voir les détails
   * @param router - Le router pour la navigation
   * @param onClose - Fonction de fermeture du modal
   */
  handleViewDetails(meal: MealOrmProps, router: any, onClose: () => void): void {
    logger.info(LogCategory.NAVIGATION, 'Navigating to meal details', { mealId: meal.id });
    
    router.push({
      pathname: "/(root)/(tabs)/meals/my-meals/details/[id]",
      params: { id: meal.id }
    });
    
    onClose();
  }
  
  /**
   * Navigue vers la page de mise à jour d'un repas
   * @param meal - Le repas à mettre à jour
   * @param router - Le router pour la navigation
   * @param onClose - Fonction de fermeture du modal
   */
  handleUpdate(meal: MealOrmProps, router: any, onClose: () => void): void {
    logger.info(LogCategory.NAVIGATION, 'Navigating to meal update', { mealId: meal.id });
    
    router.push({
      pathname: "/(root)/(tabs)/meals/my-meals/edit/[id]",
      params: { id: meal.id }
    });
    
    onClose();
  }
  
  /**
   * Gère la suppression d'un repas
   * @param onDelete - Fonction de suppression fournie par le parent
   * @param onClose - Fonction de fermeture du modal
   * @returns Une promesse résolue après la suppression
   */
  async handleDelete(onDelete?: () => Promise<void>, onClose?: () => void): Promise<void> {
    try {
      if (onDelete) {
        logger.info(LogCategory.USER, 'Deleting meal via parent handler');
        await onDelete();
      } else {
        logger.warn(LogCategory.USER, 'No delete handler provided for meal deletion');
      }
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      logger.error(LogCategory.DATABASE, 'Error deleting meal:', { 
        error: error instanceof Error ? error.message : String(error)
      });
      
      // Propagation de l'erreur pour gestion au niveau du composant
      throw error;
    }
  }
  
  /**
   * Ouvre le modal de modification de quantité
   * @param setShowQuantityModal - Fonction pour modifier la visibilité du modal de quantité
   * @param onClose - Fonction de fermeture du modal d'options
   */
  openQuantityModal(setShowQuantityModal: (show: boolean) => void, onClose: () => void): void {
    logger.debug(LogCategory.UI, 'Opening quantity modal');
    setShowQuantityModal(true);
    onClose();
  }
}

// Créer une instance singleton du service
export const mealOptionsModalService = new MealOptionsModalService();
