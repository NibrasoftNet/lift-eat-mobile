import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import * as schema from '../../db/schema';
import { ingredientsStandard } from '../../db/schema';
import { like } from 'drizzle-orm';

export const getIngredientStandardList = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  ingredientName?: string,
) => {
  // Simulate a delay (e.g., 5 seconds)
  // await new Promise((resolve) => setTimeout(resolve, 5000));
  try {
    // Fetch all meals
    let query = drizzleDb.select().from(ingredientsStandard).$dynamic();

    if (ingredientName) {
      query.where(like(ingredientsStandard.name, `%${ingredientName}%`));
    }

    return await query.execute();
  } catch (error) {
    console.error('Error get plan list:', error); // Debugging log
    throw error;
  }
};
