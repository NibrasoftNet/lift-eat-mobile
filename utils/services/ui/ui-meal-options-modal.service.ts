import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { MealOrmProps } from '@/db/schema';
import { Router } from 'expo-router';

interface MealOptionsModalServiceInterface {
  handleViewDetails: (meal: MealOrmProps, router: Router, onClose: () => void) => void;
  handleDelete: (onDelete?: () => Promise<void>, onClose?: () => void) => Promise<void>;
}

class MealOptionsModalService implements MealOptionsModalServiceInterface {
  handleViewDetails(meal: MealOrmProps, router: Router, onClose: () => void): void {
    try {
      router.push({
        pathname: '/(root)/(tabs)/meals/my-meals/details/[id]',
        params: { id: meal.id }
      });
      onClose();
    } catch (error) {
      logger.error(LogCategory.NAVIGATION, 'Error navigating to meal details', {
        error: error instanceof Error ? error.message : String(error),
        mealId: meal.id
      });
    }
  }

  async handleDelete(onDelete?: () => Promise<void>, onClose?: () => void): Promise<void> {
    try {
      if (onDelete) {
        await onDelete();
      }
      if (onClose) {
        onClose();
      }
    } catch (error) {
      logger.error(LogCategory.DATABASE, 'Error in meal deletion handler', {
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }
}

// Exporter une instance unique du service
export const mealOptionsModalService = new MealOptionsModalService();
