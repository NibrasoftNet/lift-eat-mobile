import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import * as schema from '../../db/schema';
import { CuisineTypeEnum, MealTypeEnum } from '../enum/meal.enum';
import { ingredientsStandard, mealIngredients, meals, MealWithIngredientAndStandardProps } from '../../db/schema';
import { eq, inArray, like } from 'drizzle-orm';

export const getMealsList = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  cuisine?: CuisineTypeEnum,
  mealType?: MealTypeEnum,
  mealName?: string,
) => {
  // Simulate a delay (e.g., 5 seconds)
  console.log("cuisine, meal type", cuisine, mealType, mealName);
  // await new Promise((resolve) => setTimeout(resolve, 5000));
  try {
    let query = drizzleDb.select().from(meals).$dynamic();

    if (cuisine) {
      query.where(eq(meals.cuisine, cuisine));
    }

    if (mealType) {
      query.where(eq(meals.type, mealType));
    }

    if (mealName) {
      query.where(like(meals.name, `%${mealName}%`));
    }

    return  await query.execute();
  } catch (error) {
    console.error('Error get meals list:', error); // Debugging log
    throw error;
  }
};

export const getMealByIdWithIngredients = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  mealId: number,
) => {
  try {
    // 1. Fetch the meal
    const foundMeal = await drizzleDb.query.meals.findFirst({
      where: eq(meals.id, mealId),
    });

    if (!foundMeal) return null;
    // 2. Fetch all related meal ingredients
    const mealIngredientRecords = await drizzleDb.query.mealIngredients.findMany({
      where: eq(mealIngredients.mealId, mealId),
    });

    if (mealIngredientRecords.length === 0) {
      return { ...foundMeal, mealIngredients: [] };
    }

    // 3.️ Fetch all related ingredient standards
    const ingredientStandardIds = mealIngredientRecords.map(
      (mi) => mi.ingredientStandardId,
    );
    const ingredientStandardRecords =
      await drizzleDb.query.ingredientsStandard.findMany({
        where: inArray(ingredientsStandard.id, ingredientStandardIds),
      });

    // 4. Combine results efficiently using a Map
    const mealWithIngredients: MealWithIngredientAndStandardProps = {
      ...foundMeal,
      mealIngredients: mealIngredientRecords.map((mi) => ({
        ...mi,
        ingredientStandard: ingredientStandardRecords.find(
          (is) => is.id === mi.ingredientStandardId,
        )!,
      })),
    };
    return mealWithIngredients
  } catch (error) {
    console.error('Error fetching meal by ID:', error);
    throw error;
  }
};
