import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { MealOrmProps } from '@/db/schema';

/**
 * MealDetailsRowUIService
 *
 * Helper utilities used by the `MealDetailsRow` component.
 * For now it only contains calorie/macros helpers for a given quantity,
 * but new UI-centric helpers can be added here in the future.
 */
class MealDetailsRowUIService {
  /**
   * Returns the number of calories for the specified meal **and** quantity (in g).
   *
   * The database stores nutrition values per 100 g.  Therefore the formula is:
   *     caloriesForQty = (caloriesPer100g / 100) * quantity
   * If `meal.calories` is undefined we assume 0.
   */
  calculateCaloriesForQuantity(meal: MealOrmProps, quantity: number): number {
    if (!meal || !quantity) return 0;
    const caloriesPer100 = meal.calories ?? 0;
    const calories = (caloriesPer100 / 100) * quantity;
    return calories;
  }

  /**
   * Convenience helper returning macros (kcal, P, C, F) scaled to `quantity` grams.
   * Currently unused but ready for future UI needs.
   */
  calculateMacrosForQuantity(
    meal: MealOrmProps,
    quantity: number,
  ): { calories: number; protein: number; carbs: number; fat: number } {
    if (!meal || !quantity) {
      return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    }
    const factor = quantity / 100;
    return {
      calories: (meal.calories ?? 0) * factor,
      protein: (meal.protein ?? 0) * factor,
      carbs: (meal.carbs ?? 0) * factor,
      fat: (meal.fat ?? 0) * factor,
    };
  }
}

// Export a singleton instance
export const mealDetailsRowUIService = new MealDetailsRowUIService();
