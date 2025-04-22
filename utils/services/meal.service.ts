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
import { logger } from './logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

export const createNewMeal = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  data: MealFormData,
  selectedIngredients: IngredientWithStandardProps[],
  totalMacros: TotalMacrosProps,
  creatorId: number,
) => {
  const startTime = logger.startPerformanceLog('createNewMeal');
  try {
    logger.info(LogCategory.DATABASE, 'Creating new meal', { mealName: data.name });

    // Start a transaction to ensure data consistency
    return await drizzleDb.transaction(async (tx) => {
      // 1. Insert meal
      // Make sure we're using the meal weight for nutritional values
      const newMeal: Omit<MealOrmProps, 'id'> = {
        ...data,
        calories: totalMacros.totalCalories,
        carbs: totalMacros.totalCarbs,
        fat: totalMacros.totalFats,
        protein: totalMacros.totalProtein,
        creatorId,
        image: data.image ?? null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      logger.debug(LogCategory.DATABASE, 'Creating meal with adjusted nutrition values', {
        mealWeight: data.quantity,
        totalIngredientsWeight: selectedIngredients.reduce((sum, ing) => sum + ing.quantity, 0),
        nutritionValues: {
          calories: totalMacros.totalCalories,
          carbs: totalMacros.totalCarbs,
          fat: totalMacros.totalFats,
          protein: totalMacros.totalProtein,
        }
      });

      const insertedMeal = await tx
        .insert(meals)
        .values(newMeal)
        .returning({ id: meals.id });

      if (!insertedMeal || insertedMeal.length === 0) {
        throw new Error('Failed to insert meal');
      }

      // 2. Batch insert ingredients
      if (selectedIngredients.length > 0) {
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

        await tx.insert(mealIngredients).values(mealIngredientsData);
        logger.debug(LogCategory.DATABASE, 'Inserted meal ingredients', {
          mealId: insertedMeal[0].id,
          ingredientCount: selectedIngredients.length,
        });
      }

      return insertedMeal[0];
    });
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Failed to create meal', { error });
    throw error;
  } finally {
    logger.endPerformanceLog('createNewMeal', startTime);
  }
};

export const getMealsList = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  cuisine?: CuisineTypeEnum,
  mealType?: MealTypeEnum,
  mealName?: string,
) => {
  const startTime = logger.startPerformanceLog('getMealsList');
  try {
    logger.info(LogCategory.DATABASE, 'Fetching meals list', {
      filters: { cuisine, mealType, mealName },
    });

    // Build conditions array for better query optimization
    const conditions = [];
    if (cuisine) conditions.push(eq(meals.cuisine, cuisine));
    if (mealType) conditions.push(eq(meals.type, mealType));
    if (mealName) conditions.push(like(meals.name, `%${mealName}%`));

    const query = drizzleDb
      .select()
      .from(meals)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(meals.createdAt);

    const results = await query.execute();
    logger.debug(LogCategory.DATABASE, 'Meals list fetched', {
      count: results.length,
    });
    return results;
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Failed to fetch meals list', { error });
    throw error;
  } finally {
    logger.endPerformanceLog('getMealsList', startTime);
  }
};

export const getMealByIdWithIngredients = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  mealId: number,
) => {
  const startTime = logger.startPerformanceLog('getMealByIdWithIngredients');
  try {
    logger.info(LogCategory.DATABASE, 'Fetching meal with ingredients', { mealId });

    // Optimize by fetching meal and ingredients in parallel
    const [meal, mealIngredientRecords] = await Promise.all([
      drizzleDb.query.meals.findFirst({
        where: eq(meals.id, mealId),
      }),
      drizzleDb.query.mealIngredients.findMany({
        where: eq(mealIngredients.mealId, mealId),
      }),
    ]);

    if (!meal) {
      logger.warn(LogCategory.DATABASE, 'Meal not found', { mealId });
      return null;
    }

    if (mealIngredientRecords.length === 0) {
      logger.debug(LogCategory.DATABASE, 'Meal has no ingredients', { mealId });
      return { ...meal, mealIngredients: [] };
    }

    // Fetch ingredient standards in one query
    const ingredientStandardIds = mealIngredientRecords.map(
      (mi) => mi.ingredientStandardId,
    );
    const ingredientStandardRecords =
      await drizzleDb.query.ingredientsStandard.findMany({
        where: inArray(ingredientsStandard.id, ingredientStandardIds),
      });

    // Create a map for O(1) lookups
    const ingredientStandardMap = new Map(
      ingredientStandardRecords.map((is) => [is.id, is]),
    );

    // Combine results efficiently
    const mealWithIngredients: MealWithIngredientAndStandardOrmProps = {
      ...meal,
      mealIngredients: mealIngredientRecords.map((mi) => ({
        ...mi,
        ingredientsStandard: ingredientStandardMap.get(mi.ingredientStandardId)!,
      })),
    };

    logger.debug(LogCategory.DATABASE, 'Meal fetched with ingredients', {
      mealId,
      ingredientCount: mealWithIngredients.mealIngredients.length,
    });

    return mealWithIngredients;
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Failed to fetch meal by ID', {
      mealId,
      error,
    });
    throw error;
  } finally {
    logger.endPerformanceLog('getMealByIdWithIngredients', startTime);
  }
};

export const updateMeal = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  data: MealFormData,
  selectedIngredients: IngredientWithStandardProps[],
  totalMacros: TotalMacrosProps,
) => {
  const startTime = logger.startPerformanceLog('updateMeal');
  try {
    logger.info(LogCategory.DATABASE, 'Updating meal', {
      mealId: data.id,
      mealName: data.name,
    });

    return await drizzleDb.transaction(async (tx) => {
      // 1. Update meal - exclude id from the update values
      const { id, ...updateData } = data;
      
      logger.debug(LogCategory.DATABASE, 'Updating meal with adjusted nutrition values', {
        mealId: id,
        mealWeight: data.quantity,
        totalIngredientsWeight: selectedIngredients.reduce((sum, ing) => sum + ing.quantity, 0),
        nutritionValues: {
          calories: totalMacros.totalCalories,
          carbs: totalMacros.totalCarbs,
          fat: totalMacros.totalFats,
          protein: totalMacros.totalProtein,
        }
      });
      
      const updatedMeal = await tx
        .update(meals)
        .set({
          ...updateData,
          calories: totalMacros.totalCalories,
          carbs: totalMacros.totalCarbs,
          fat: totalMacros.totalFats,
          protein: totalMacros.totalProtein,
          image: data.image ?? null,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(meals.id, id!))
        .returning({ id: meals.id });

      if (!updatedMeal || updatedMeal.length === 0) {
        throw new Error('Failed to update meal');
      }

      // 2. Delete old ingredients and insert new ones in a transaction
      await tx.delete(mealIngredients).where(eq(mealIngredients.mealId, id!));

      if (selectedIngredients.length > 0) {
        const mealIngredientsData: Omit<MealIngredientsOrmProps, 'id'>[] =
          selectedIngredients.map((ingredient) => ({
            mealId: id!,
            ingredientStandardId: ingredient.ingredientStandardId,
            quantity: ingredient.quantity,
            calories: ingredient.calories,
            carbs: ingredient.carbs,
            fat: ingredient.fat,
            protein: ingredient.protein,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }));

        await tx.insert(mealIngredients).values(mealIngredientsData);
      }

      logger.debug(LogCategory.DATABASE, 'Meal updated successfully', {
        mealId: id,
        newIngredientCount: selectedIngredients.length,
      });

      return updatedMeal[0];
    });
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Failed to update meal', {
      mealId: data.id,
      error,
    });
    throw error;
  } finally {
    logger.endPerformanceLog('updateMeal', startTime);
  }
};

export const deleteMeal = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  mealId: number,
) => {
  const startTime = logger.startPerformanceLog('deleteMeal');
  try {
    logger.info(LogCategory.DATABASE, 'Deleting meal', { mealId });

    return await drizzleDb.transaction(async (tx) => {
      // Delete meal ingredients first (foreign key constraint)
      await tx.delete(mealIngredients).where(eq(mealIngredients.mealId, mealId));
      
      // Then delete the meal
      const deletedMeal = await tx
        .delete(meals)
        .where(eq(meals.id, mealId))
        .returning({ id: meals.id });

      if (!deletedMeal || deletedMeal.length === 0) {
        throw new Error('Failed to delete meal');
      }

      logger.debug(LogCategory.DATABASE, 'Meal deleted successfully', { mealId });
      return deletedMeal[0];
    });
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Failed to delete meal', { mealId, error });
    throw error;
  } finally {
    logger.endPerformanceLog('deleteMeal', startTime);
  }
};
