import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { planPagesService } from '@/utils/services/pages/plan-pages.service';
import { MealTypeEnum } from '@/utils/enum/meal.enum';
import { MealWithQuantity } from '@/utils/interfaces/drawer.interface';
import { drawerUIService } from './drawer-ui.service';

export interface MealDrawerServiceInterface {
  getMealTypeName: (type: MealTypeEnum) => string;
  getMealTypeColor: (type: MealTypeEnum) => {
    bgColor: string;
    textColor: string;
  };
  handleMealSelection: (mealId: number, isSelected: boolean) => void;
  handleQuantityChange: (mealId: number, quantity: number) => void;
  handleMealTypeChange: (mealId: number, type: MealTypeEnum) => void;
  addMealsToPlan: (
    dailyPlanId: number,
    selectedMeals: MealWithQuantity[],
  ) => Promise<{ success: boolean; errors?: string[] }>;
}

class MealDrawerUIService implements MealDrawerServiceInterface {
  // --- Drawer helper constants ---
  readonly PAGE_SIZE = 10;
  readonly MAX_ITEMS = 100;
  readonly DEBOUNCE_DELAY = 300;

  /**
   * Debounce helper relying on generic drawerUIService
   */
  debounceSearchTerm(
    searchTerm: string,
    callback: (term: string) => void,
    delay: number = this.DEBOUNCE_DELAY,
  ) {
    drawerUIService.debounceSearchTerm(searchTerm, callback, delay);
  }

  /**
   * Generate a stable uniqueId for FlashList keyExtractor
   */
  generateUniqueId(item: { id: number }, pageParam: number, index: number) {
    return drawerUIService.generateUniqueId('meal', item.id, pageParam, index);
  }

  /**
   * Item type helper for FlashList optimisation
   */
  getItemType() {
    return 'meal';
  }

  getMealTypeName(type: MealTypeEnum): string {
    const names: Record<MealTypeEnum, string> = {
      [MealTypeEnum.BREAKFAST]: 'Petit-déjeuner',
      [MealTypeEnum.LUNCH]: 'Déjeuner',
      [MealTypeEnum.DINNER]: 'Dîner',
      [MealTypeEnum.SNACK]: 'Collation',
    };
    return names[type] || type;
  }

  getMealTypeColor(type: MealTypeEnum): { bgColor: string; textColor: string } {
    const colors: Record<MealTypeEnum, { bgColor: string; textColor: string }> =
      {
        [MealTypeEnum.BREAKFAST]: {
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
        },
        [MealTypeEnum.LUNCH]: {
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
        },
        [MealTypeEnum.DINNER]: {
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-800',
        },
        [MealTypeEnum.SNACK]: {
          bgColor: 'bg-orange-100',
          textColor: 'text-orange-800',
        },
      };
    return (
      colors[type] || { bgColor: 'bg-gray-100', textColor: 'text-gray-800' }
    );
  }

  handleMealSelection(mealId: number, isSelected: boolean): void {
    logger.info(LogCategory.UI, 'Meal selection changed', {
      mealId,
      isSelected,
    });
  }

  handleQuantityChange(mealId: number, quantity: number): void {
    logger.info(LogCategory.UI, 'Meal quantity changed', { mealId, quantity });
  }

  handleMealTypeChange(mealId: number, type: MealTypeEnum): void {
    logger.info(LogCategory.UI, 'Meal type changed', { mealId, type });
  }

  async addMealsToPlan(
    dailyPlanId: number,
    selectedMeals: MealWithQuantity[],
  ): Promise<{ success: boolean; errors?: string[] }> {
    try {
      logger.info(LogCategory.UI, 'Adding meals to plan', {
        dailyPlanId,
        mealsCount: selectedMeals.length,
      });

      const errors: string[] = [];
      for (const meal of selectedMeals) {
        try {
          // Utiliser planPagesService au lieu d'appeler directement sqliteMCPServer (architecture MCP)
          const result = await planPagesService.addMealToDailyPlan(
            dailyPlanId,
            meal.id,
            meal.quantity,
            meal.mealType,
          );

          if (!result.success) {
            errors.push(
              `Failed to add meal ${meal.id}: ${
                result.error || 'Unknown error'
              }`,
            );
          }
        } catch (error) {
          errors.push(
            `Failed to add meal ${meal.id}: ${
              error instanceof Error ? error.message : String(error)
            }`,
          );
        }
      }

      return {
        success: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined,
      };
    } catch (error) {
      logger.error(LogCategory.UI, 'Error adding meals to plan', {
        error: error instanceof Error ? error.message : String(error),
      });
      return {
        success: false,
        errors: [error instanceof Error ? error.message : String(error)],
      };
    }
  }
}

// Exporter une instance unique du service
export const mealDrawerUIService = new MealDrawerUIService();
