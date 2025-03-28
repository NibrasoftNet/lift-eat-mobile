import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import * as schema from '../../db/schema';
import { CuisineTypeEnum, MealTypeEnum } from '../enum/meal.enum';
import {
  ingredientsStandard,
  mealIngredients,
  MealIngredientsOrmProps,
  MealOrmProps,
  meals,
  MealWithIngredientAndStandardOrmProps,
} from '../../db/schema';
import { and, eq, inArray, like } from 'drizzle-orm';
import { MealFormData } from '../validation/meal/meal.validation';
import { IngredientWithStandardProps } from '@/types/ingredient.type';
import { TotalMacrosProps } from '@/types/meal.type';

export const createNewMeal = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  data: MealFormData,
  selectedIngredients: IngredientWithStandardProps[],
  totalMacros: TotalMacrosProps,
  creatorId: number,
) => {
  //await new Promise((resolve) => setTimeout(resolve, 3000));
  try {
    console.log('Creating new meal...');
    const newMeal: Omit<MealOrmProps, 'id'> = {
      ...data,
      calories: totalMacros.totalCalories,
      carbs: totalMacros.totalCarbs,
      fat: totalMacros.totalFats,
      protein: totalMacros.totalProtein,
      creatorId: creatorId,
      image: data.image ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const insertedMeal = await drizzleDb
      .insert(meals)
      .values(newMeal)
      .returning({ id: meals.id });

    if (!insertedMeal || insertedMeal.length === 0) {
      throw new Error('Failed to insert meal');
    }
    // ✅ Insert selected ingredients into mealIngredients table
    const mealIngredientsData: Omit<MealIngredientsOrmProps, 'id'>[] =
      selectedIngredients.map((ingredient) => ({
        mealId: insertedMeal[0].id,
        ingredientStandardId: ingredient.ingredientStandardId,
        quantity: ingredient.quantity,
        calories: ingredient.calories,
        carbs: ingredient.carbs,
        fat: ingredient.fat,
        protein: ingredient.protein,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

    await drizzleDb.insert(mealIngredients).values(mealIngredientsData);
    console.log(
      `Inserted ${selectedIngredients.length} ingredients for meal ID: ${insertedMeal[0].id}`,
    );
    return insertedMeal[0];
  } catch (error) {
    console.error('Error crete new meal:', error); // Debugging log
    throw error;
  }
};

export const getMealsList = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  cuisine?: CuisineTypeEnum,
  mealType?: MealTypeEnum,
  mealName?: string,
) => {
  try {
    let query = drizzleDb.select().from(meals).$dynamic();

    if (cuisine && mealType) {
      query.where(and(eq(meals.cuisine, cuisine), eq(meals.type, mealType)));
    } else if (cuisine) {
      query.where(eq(meals.cuisine, cuisine));
    } else if (mealType) {
      query.where(eq(meals.type, mealType));
    }

    if (mealName) {
      query.where(like(meals.name, `%${mealName}%`));
    }

    return await query.execute();
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
    const mealIngredientRecords =
      await drizzleDb.query.mealIngredients.findMany({
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
    const mealWithIngredients: MealWithIngredientAndStandardOrmProps = {
      ...foundMeal,
      mealIngredients: mealIngredientRecords.map((mi) => ({
        ...mi,
        ingredientsStandard: ingredientStandardRecords.find(
          (is) => is.id === mi.ingredientStandardId,
        )!,
      })),
    };
    return mealWithIngredients;
  } catch (error) {
    console.error('Error fetching meal by ID:', error);
    throw error;
  }
};

export const updateMeal = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  data: MealFormData,
  selectedIngredients: IngredientWithStandardProps[],
  totalMacros: TotalMacrosProps,
) => {
  try {
    console.log('Updating meal...');

    // Update the meal in the meals table
    const updatedMeal = await drizzleDb
      .update(meals)
      .set({
        ...data,
        id: data?.id!,
        calories: totalMacros.totalCalories,
        carbs: totalMacros.totalCarbs,
        fat: totalMacros.totalFats,
        protein: totalMacros.totalProtein,
        image: data.image ?? null,
      })
      .where(eq(meals.id, data?.id!)) // Use the id from data to find the meal
      .returning({ id: meals.id });

    if (!updatedMeal || updatedMeal.length === 0) {
      throw new Error('Failed to update meal');
    }

    // Delete old meal ingredients
    await drizzleDb
      .delete(mealIngredients)
      .where(eq(mealIngredients.mealId, data?.id!));

    console.log(`Deleted old ingredients for meal ID: ${data.id}`);

    // Insert new meal ingredients
    const mealIngredientsData: Omit<MealIngredientsOrmProps, 'id'>[] =
      selectedIngredients.map((ingredient) => ({
        mealId: data?.id!,
        ingredientStandardId: ingredient.ingredientStandardId,
        quantity: ingredient.quantity,
        calories: ingredient.calories,
        carbs: ingredient.carbs,
        fat: ingredient.fat,
        protein: ingredient.protein,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

    await drizzleDb.insert(mealIngredients).values(mealIngredientsData);

    console.log(
      `Inserted ${selectedIngredients.length} new ingredients for meal ID: ${data.id}`,
    );

    return updatedMeal[0];
  } catch (error) {
    console.error('Error updating meal:', error); // Debugging log
    throw error;
  }
};

export const deleteMeal = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  mealId: number,
) => {
  try {
    console.log(`Deleting meal with ID: ${mealId}...`);

    // Step 1: Delete associated mealIngredients
    await drizzleDb
      .delete(mealIngredients)
      .where(eq(mealIngredients.mealId, mealId));

    console.log(`Deleted mealIngredients for meal ID: ${mealId}`);

    // Step 2: Delete the meal
    const deletedMeal = await drizzleDb
      .delete(meals)
      .where(eq(meals.id, mealId))
      .returning({ id: meals.id });

    if (!deletedMeal || deletedMeal.length === 0) {
      throw new Error('Failed to delete meal'); // Throw error if deletion fails
    }

    console.log(`Successfully deleted meal with ID: ${mealId}`);
    return deletedMeal[0]; // Return the deleted meal ID
  } catch (error) {
    console.error(`Error deleting meal with ID: ${mealId}:`, error); // Log the error
    throw error; // Rethrow the error to propagate it to the caller
  }
};
