import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import * as schema from '../../db/schema';
import {
  dailyPlan,
  dailyPlanMeals,
  DailyPlanProps,
  MealProps,
  meals,
  plan,
} from '../../db/schema';
import { eq, inArray } from 'drizzle-orm';

export const getPlanDetails = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  planId: string,
) => {
  // Simulate a delay (e.g., 5 seconds)
  await new Promise((resolve) => setTimeout(resolve, 5000));
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
      DailyPlanProps & { meals: MealProps[] }
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
