import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';
import { users, meals, plan, dailyPlan } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * SQLite MCP Server
 * 
 * This server provides access to user preferences and data from SQLite
 * to enable the Gemini model to provide more personalized responses.
 */
class SQLiteMCPServer {
  private static instance: SQLiteMCPServer;
  private db: any = null;

  private constructor() {}

  public static getInstance(): SQLiteMCPServer {
    if (!SQLiteMCPServer.instance) {
      SQLiteMCPServer.instance = new SQLiteMCPServer();
    }
    return SQLiteMCPServer.instance;
  }

  public initializeWithDb(sqliteDb: any) {
    this.db = drizzle(sqliteDb, { schema });
  }

  /**
   * Get current user information
   */
  public async getCurrentUser(userId: number) {
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      const userResults = await this.db.select().from(users).where(eq(users.id, userId));
      
      if (userResults.length === 0) {
        throw new Error(`User with ID ${userId} not found`);
      }
      
      return userResults[0];
    } catch (error) {
      console.error("Error fetching current user:", error);
      throw error;
    }
  }

  /**
   * Get user nutritional preferences
   */
  public async getUserNutritionalPreferences(userId: number) {
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      const userResults = await this.db.select().from(users).where(eq(users.id, userId));
      
      if (userResults.length === 0) {
        throw new Error(`User with ID ${userId} not found`);
      }
      
      const user = userResults[0];
      
      // Calculate daily caloric needs based on user data
      // This is a simplified calculation - you might want to use a more sophisticated formula
      
      let bmr = 0;
      if (user.gender === 'MALE') {
        bmr = 88.362 + (13.397 * user.weight) + (4.799 * user.height) - (5.677 * user.age);
      } else {
        bmr = 447.593 + (9.247 * user.weight) + (3.098 * user.height) - (4.330 * user.age);
      }
      
      // Activity multiplier
      const activityMultipliers: Record<string, number> = {
        'SEDENTARY': 1.2,
        'LIGHTLY_ACTIVE': 1.375,
        'MODERATELY_ACTIVE': 1.55,
        'VERY_ACTIVE': 1.725,
        'EXTRA_ACTIVE': 1.9
      };
      
      const activityMultiplier = activityMultipliers[user.physicalActivity] || 1.55;
      const dailyCalories = Math.round(bmr * activityMultiplier);
      
      // Calculate macronutrient distribution (standard is 50% carbs, 30% fats, 20% protein)
      const carbCalories = dailyCalories * 0.5;
      const fatCalories = dailyCalories * 0.3;
      const proteinCalories = dailyCalories * 0.2;
      
      const carbGrams = Math.round(carbCalories / 4); // 4 calories per gram of carbs
      const fatGrams = Math.round(fatCalories / 9); // 9 calories per gram of fat
      const proteinGrams = Math.round(proteinCalories / 4); // 4 calories per gram of protein
      
      return {
        user,
        nutritionalNeeds: {
          dailyCalories,
          macros: {
            carbs: carbGrams,
            fat: fatGrams,
            protein: proteinGrams
          }
        }
      };
    } catch (error) {
      console.error("Error fetching user nutritional preferences:", error);
      throw error;
    }
  }

  /**
   * Get user's favorite meals
   */
  public async getUserFavoriteMeals(userId: number, limit = 5) {
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      // Get meals created by the user
      const mealResults = await this.db
        .select()
        .from(meals)
        .where(eq(meals.creatorId, userId))
        .limit(limit);
      
      return mealResults;
    } catch (error) {
      console.error("Error fetching user favorite meals:", error);
      throw error;
    }
  }

  /**
   * Get user's active nutrition plans
   */
  public async getUserActivePlans(userId: number) {
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      // Get active plans for the user
      const planResults = await this.db
        .select()
        .from(plan)
        .where(eq(plan.userId, userId));
      
      // If no plans are found, return an empty array
      if (planResults.length === 0) {
        return [];
      }
      
      // For each plan, get its daily plans
      const plansWithDailyPlans = await Promise.all(
        planResults.map(async (planItem: typeof schema.plan.$inferSelect) => {
          const dailyPlans = await this.db
            .select()
            .from(dailyPlan)
            .where(eq(dailyPlan.planId, planItem.id));
          
          return {
            ...planItem,
            dailyPlans
          };
        })
      );
      
      return plansWithDailyPlans;
    } catch (error) {
      console.error("Error fetching user active plans:", error);
      throw error;
    }
  }

  /**
   * Generate user context for AI prompts
   */
  public async generateUserContext(userId: number): Promise<string> {
    try {
      const userPrefs = await this.getUserNutritionalPreferences(userId);
      const favoriteMeals = await this.getUserFavoriteMeals(userId);
      const activePlans = await this.getUserActivePlans(userId);
      
      let context = `
USER CONTEXT:
Name: ${userPrefs.user.name}
Age: ${userPrefs.user.age}
Gender: ${userPrefs.user.gender}
Weight: ${userPrefs.user.weight}${userPrefs.user.weightUnit}
Height: ${userPrefs.user.height}${userPrefs.user.heightUnit}
Physical Activity Level: ${userPrefs.user.physicalActivity}

APPLICATION INFORMATION:
- Lift-Eat est une application mobile complète de gestion nutritionnelle et suivi de santé
- Fonctionnalités principales: calcul des besoins caloriques, gestion des repas et ingrédients, plans nutritionnels, suivi des progrès
- Sections principales: repas, plans, analytics, scanner, profil

NUTRITIONAL NEEDS:
Daily Calories: ${userPrefs.nutritionalNeeds.dailyCalories} kcal
Macronutrients:
- Carbohydrates: ${userPrefs.nutritionalNeeds.macros.carbs}g
- Fats: ${userPrefs.nutritionalNeeds.macros.fat}g
- Protein: ${userPrefs.nutritionalNeeds.macros.protein}g

USER PREFERENCES:
- Gender: ${userPrefs.user.gender}
- Age: ${userPrefs.user.age}
- Physical Activity: ${userPrefs.user.physicalActivity}
${favoriteMeals.length > 0 ? '- Favorite Meals: ' + favoriteMeals.map((meal: typeof schema.meals.$inferSelect) => meal.name).slice(0, 3).join(', ') : '- No favorite meals yet'}
${activePlans.length > 0 ? '- Active Plans: ' + activePlans.map((plan: typeof schema.plan.$inferSelect & { dailyPlans: any[] }) => plan.name).slice(0, 2).join(', ') : '- No active plans yet'}

ASSISTANT CAPABILITIES:
- Répondre aux questions sur la nutrition et l'alimentation
- Aider à utiliser l'application et expliquer ses fonctionnalités
- Apporter une assistance technique pour l'utilisation de Lift-Eat
- Créer ou suggérer des repas et plans nutritionnels personnalisés
- Fournir des conseils généraux sur la santé et le bien-être
`;
      
      return context;
    } catch (error) {
      console.error("Error generating user context:", error);
      return "No user context available.";
    }
  }
}

export default SQLiteMCPServer.getInstance();
