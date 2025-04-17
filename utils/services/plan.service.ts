import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import * as schema from '../../db/schema';
import {
  dailyPlan,
  dailyPlanMeals,
  DailyPlanOrmProps,
  MealOrmProps,
  meals,
  plan,
  PlanOrmProps,
} from '../../db/schema';
import { eq, inArray } from 'drizzle-orm';
import { NutritionGoalSchemaFormData } from '../validation/plan/nutrition-goal.validation';
import {
  DayUnitArray,
  DailyPlanGeneratedWithEnum,
  PlanGeneratedWithEnum,
} from '../enum/general.enum';
import { WeightUnitEnum } from '../enum/user-details.enum';

export const getPlansList = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
) => {
  try {
    // Fetch all meals
    return await drizzleDb.query.plan.findMany();
  } catch (error) {
    console.error('Error get plan list:', error); // Debugging log
    throw error;
  }
};

export const getPlanDetails = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  planId: string,
) => {
  try {
    // Fetch the plan
    const foundPlan = await drizzleDb.query.plan.findFirst({
      where: eq(plan.id, Number(planId)),
    });

    if (!foundPlan) return null;

    // Fetch all related daily plans
    const dailyPlans = await drizzleDb.query.dailyPlan.findMany({
      where: eq(dailyPlan.planId, Number(planId)),
    });

    if (dailyPlans.length === 0) return { ...foundPlan, dailyPlans: [] };

    // Fetch meal relationships (junction table)
    const dailyPlanIds = dailyPlans.map((dp) => dp.id);
    const dailyPlanMealsRelations =
      await drizzleDb.query.dailyPlanMeals.findMany({
        where: inArray(dailyPlanMeals.dailyPlanId, dailyPlanIds),
      });

    if (dailyPlanMealsRelations.length === 0)
      return {
        ...foundPlan,
        dailyPlans: dailyPlans.map((dp) => ({ ...dp, meals: [] })),
      };

    // 4️⃣ Fetch all meals in those relationships
    const mealIds = dailyPlanMealsRelations.map((dpm) => dpm.mealId);
    const mealRecords = await drizzleDb.query.meals.findMany({
      where: inArray(meals.id, mealIds),
    });

    // Combine results efficiently using a Map
    const dailyPlanMap = new Map<
      number,
      DailyPlanOrmProps & { meals: MealOrmProps[] }
    >();

    dailyPlans.forEach((dp) => {
      dailyPlanMap.set(dp.id, { ...dp, meals: [] });
    });

    dailyPlanMealsRelations.forEach((relation) => {
      const meal = mealRecords.find((m) => m.id === relation.mealId);
      if (meal) {
        dailyPlanMap.get(relation.dailyPlanId)!.meals.push(meal);
      }
    });
    console.log('combining', {
      ...foundPlan,
      dailyPlans: Array.from(dailyPlanMap.values()),
    });
    return {
      ...foundPlan,
      dailyPlans: Array.from(dailyPlanMap.values()),
    };
  } catch (error) {
    console.error('Error get plan details:', error); // Debugging log
    throw error; // Ensure the error is thrown so React Query can catch it
  }
};

/**
 * Get plan with daily plans (without meals)
 */
export const getPlanWithDailyPlans = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  planId: number,
) => {
  try {
    // Fetch the plan
    const foundPlan = await drizzleDb.query.plan.findFirst({
      where: eq(plan.id, planId),
    });

    if (!foundPlan) return null;

    // Fetch all related daily plans
    const dailyPlans = await drizzleDb.query.dailyPlan.findMany({
      where: eq(dailyPlan.planId, planId),
    });

    return {
      ...foundPlan,
      dailyPlans: dailyPlans,
    };
  } catch (error) {
    console.error('Error getting plan with daily plans:', error);
    throw error;
  }
};

/**
 * Create a new nutrition plan with daily plans
 */
export const createPlan = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  data: NutritionGoalSchemaFormData,
  userId: number,
): Promise<number> => {
  try {
    // Create a new plan object with appropriate data
    const newPlan: Omit<PlanOrmProps, 'id'> = {
      name: `Plan ${new Date().toLocaleDateString()}`,
      goal: data.goalUnit,
      unit: WeightUnitEnum.KG, // Utilisation d'une valeur par défaut car non définie dans le schéma
      initialWeight: data.initialWeight,
      targetWeight: data.targetWeight,
      durationWeeks: data.durationWeeks,
      calories: 0, // Will be calculated later
      carbs: 0,
      fat: 0,
      protein: 0,
      type: PlanGeneratedWithEnum.MANUAL,
      public: true,
      current: false,
      completed: false,
      userId: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Insert the plan into the database and get the ID
    const [insertedPlan] = await drizzleDb
      .insert(plan)
      .values(newPlan)
      .returning({ id: plan.id });

    // Create daily plans automatically
    await createDailyPlans(drizzleDb, insertedPlan.id, data.durationWeeks);

    return insertedPlan.id;
  } catch (error) {
    console.error('Error creating plan:', error);
    throw new Error('Failed to create nutrition plan');
  }
};

/**
 * Create daily plans for a nutrition plan
 */
export const createDailyPlans = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  planId: number,
  durationWeeks: number,
): Promise<void> => {
  try {
    // Prepare data for bulk insertion
    const dailyPlansData: Omit<DailyPlanOrmProps, 'id'>[] = [];

    for (let week = 1; week <= durationWeeks; week++) {
      // Create a plan for each day of the week
      for (const day of DayUnitArray) {
        dailyPlansData.push({
          week,
          day,
          calories: 0, // Will be calculated later
          carbs: 0,
          fat: 0,
          protein: 0,
          type: DailyPlanGeneratedWithEnum.MANUAL,
          planId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }

    // Insert all daily plans in a single transaction
    await drizzleDb.insert(dailyPlan).values(dailyPlansData);
  } catch (error) {
    console.error('Error creating daily plans:', error);
    throw new Error('Failed to create daily nutrition plans');
  }
};

/**
 * Update an existing nutrition plan
 */
export const updatePlan = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  planId: number,
  data: Partial<PlanOrmProps>,
): Promise<void> => {
  try {
    await drizzleDb
      .update(plan)
      .set({
        ...data,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(plan.id, planId));
  } catch (error) {
    console.error('Error updating plan:', error);
    throw new Error('Failed to update nutrition plan');
  }
};

/**
 * Delete a nutrition plan and all associated data
 */
export const deletePlan = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  planId: number,
): Promise<void> => {
  try {
    // Find all daily plans for this plan
    const dailyPlans = await drizzleDb.query.dailyPlan.findMany({
      where: eq(dailyPlan.planId, planId),
    });

    // Get all daily plan IDs
    const dailyPlanIds = dailyPlans.map((dp) => dp.id);

    // Delete all meal relationships
    if (dailyPlanIds.length > 0) {
      await drizzleDb
        .delete(dailyPlanMeals)
        .where(inArray(dailyPlanMeals.dailyPlanId, dailyPlanIds));
    }

    // Delete all daily plans
    await drizzleDb.delete(dailyPlan).where(eq(dailyPlan.planId, planId));

    // Delete the plan
    await drizzleDb.delete(plan).where(eq(plan.id, planId));
  } catch (error) {
    console.error('Error deleting plan:', error);
    throw new Error('Failed to delete nutrition plan');
  }
};

/**
 * Add a meal to a daily plan
 */
export const addMealToDailyPlan = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  dailyPlanId: number,
  mealId: number,
  quantity: number = 10, // Default to 10 grams
): Promise<void> => {
  try {
    // Get meal to calculate nutrition values
    const meal = await drizzleDb.query.meals.findFirst({
      where: eq(meals.id, mealId),
    });

    if (!meal) {
      throw new Error('Meal not found');
    }

    // Calculer le ratio de la quantité demandée par rapport à la quantité d'origine du repas
    const ratio = quantity / meal.quantity;

    // Calculate adjusted nutritional values based on ratio
    const adjustedCalories = meal.calories * ratio;
    const adjustedCarbs = meal.carbs * ratio;
    const adjustedFat = meal.fat * ratio;
    const adjustedProtein = meal.protein * ratio;

    // Add meal to daily plan with custom quantity and calculated nutritional values
    await drizzleDb.insert(dailyPlanMeals).values({
      dailyPlanId,
      mealId,
      quantity,
      calories: adjustedCalories,
      carbs: adjustedCarbs,
      fat: adjustedFat,
      protein: adjustedProtein,
    });

    // Get daily plan current values
    const currentDailyPlan = await drizzleDb.query.dailyPlan.findFirst({
      where: eq(dailyPlan.id, dailyPlanId),
    });

    if (!currentDailyPlan) {
      throw new Error('Daily plan not found');
    }

    // Update daily plan nutrition values with the adjusted values
    await drizzleDb
      .update(dailyPlan)
      .set({
        calories: currentDailyPlan.calories + adjustedCalories,
        carbs: currentDailyPlan.carbs + adjustedCarbs,
        fat: currentDailyPlan.fat + adjustedFat,
        protein: currentDailyPlan.protein + adjustedProtein,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(dailyPlan.id, dailyPlanId));

    // Update total plan statistics as well
    const planQuery = await drizzleDb.query.dailyPlan.findFirst({
      where: eq(dailyPlan.id, dailyPlanId),
      columns: {
        planId: true,
      },
    });

    if (planQuery) {
      const allDailyPlans = await drizzleDb.query.dailyPlan.findMany({
        where: eq(dailyPlan.planId, planQuery.planId),
      });

      // Calculate total nutrition values for the plan
      const totalCalories = allDailyPlans.reduce(
        (sum, dp) => sum + dp.calories,
        0,
      );
      const totalCarbs = allDailyPlans.reduce((sum, dp) => sum + dp.carbs, 0);
      const totalFat = allDailyPlans.reduce((sum, dp) => sum + dp.fat, 0);
      const totalProtein = allDailyPlans.reduce(
        (sum, dp) => sum + dp.protein,
        0,
      );

      // Update plan with new totals
      await drizzleDb
        .update(plan)
        .set({
          calories: totalCalories,
          carbs: totalCarbs,
          fat: totalFat,
          protein: totalProtein,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(plan.id, planQuery.planId));
    }
  } catch (error) {
    console.error('Error adding meal to daily plan:', error);
    throw new Error('Failed to add meal to daily plan');
  }
};
