import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

export interface OptionsDrawerServiceInterface {
  handleDetailAction: (itemId: number, onDetail: () => void) => void;
  handleEditAction: (itemId: number, onEdit: () => void) => void;
  handleDeleteAction: (itemId: number, onDelete: () => void) => void;
  isEditAvailable: (itemType: string, itemId: number) => boolean;
  isDeleteAvailable: (itemType: string, itemId: number) => boolean;
}

class OptionsDrawerUIService implements OptionsDrawerServiceInterface {
  handleDetailAction(itemId: number, onDetail: () => void): void {
    try {
      logger.info(LogCategory.UI, 'Viewing details', { itemId });
      onDetail();
    } catch (error) {
      logger.error(LogCategory.UI, 'Error viewing details', {
        error: error instanceof Error ? error.message : String(error),
        itemId,
      });
    }
  }

  handleEditAction(itemId: number, onEdit: () => void): void {
    try {
      logger.info(LogCategory.UI, 'Editing item', { itemId });
      onEdit();
    } catch (error) {
      logger.error(LogCategory.UI, 'Error editing item', {
        error: error instanceof Error ? error.message : String(error),
        itemId,
      });
    }
  }

  handleDeleteAction(itemId: number, onDelete: () => void): void {
    try {
      logger.info(LogCategory.UI, 'Deleting item', { itemId });
      onDelete();
    } catch (error) {
      logger.error(LogCategory.UI, 'Error deleting item', {
        error: error instanceof Error ? error.message : String(error),
        itemId,
      });
    }
  }

  isEditAvailable(itemType: string, itemId: number): boolean {
    // Logique pour vérifier si l'édition est disponible selon le type d'élément
    // Par exemple, certains éléments système peuvent ne pas être modifiables
    const nonEditableTypes = ['system', 'default'];
    return !nonEditableTypes.includes(itemType);
  }

  isDeleteAvailable(itemType: string, itemId: number): boolean {
    // Logique pour vérifier si la suppression est disponible selon le type d'élément
    // Par exemple, les éléments système ne peuvent pas être supprimés
    const nonDeletableTypes = ['system', 'default'];
    return !nonDeletableTypes.includes(itemType);
  }
}

// Exporter une instance unique du service
export const optionsDrawerUIService = new OptionsDrawerUIService();
