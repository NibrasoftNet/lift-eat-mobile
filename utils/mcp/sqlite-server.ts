import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';
import { 
  mealIngredients,
  ingredientsStandard,
  meals,
  dailyPlan,
  dailyPlanMeals,
  plan,
  users 
} from '@/db/schema';
import { eq } from 'drizzle-orm';
import { 
  IaIngredientType,
  IaMealType,
  IaPlanType 
} from '@/utils/validation/ia/ia.schemas';
import { sql } from 'drizzle-orm';
import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { 
  MealTypeEnum, 
  CuisineTypeEnum, 
  MealUnitEnum 
} from '@/utils/enum/meal.enum';
import { 
  PlanGeneratedWithEnum,
  DayEnum
} from '@/utils/enum/general.enum';

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

  /**
   * Ajoute un repas via le MCP server
   * @param meal Données du repas à ajouter
   * @param creatorId ID de l'utilisateur créateur
   * @returns Résultat de l'opération avec l'ID du repas créé ou une erreur
   */
  public async addMealViaMCP(
    meal: IaMealType, 
    creatorId: number
  ): Promise<{ success: boolean; mealId?: number; error?: string }> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      // Utiliser une transaction pour assurer l'intégrité des données
      return await this.db.transaction(async (tx: typeof this.db) => {
        logger.info(LogCategory.DATABASE, `Adding meal "${meal.name}" via MCP Server`);
        
        // 1. Créer le repas
        const mealResult = await tx
          .insert(meals)
          .values({
            name: meal.name,
            type: meal.type,
            description: meal.description || '',
            cuisine: meal.cuisine,
            calories: meal.calories,
            carbs: meal.carbs,
            protein: meal.protein,
            fat: meal.fat,
            quantity: 100, // Valeur par défaut si non spécifiée
            unit: meal.unit,
            creatorId
          })
          .returning({ id: meals.id });
        
        if (!mealResult || mealResult.length === 0) {
          throw new Error('Failed to create meal');
        }
        
        const mealId = mealResult[0].id;
        logger.info(LogCategory.DATABASE, `Created meal with ID ${mealId}`);
        
        // 2. Ajouter les ingrédients si fournis
        if (meal.ingredients && meal.ingredients.length > 0) {
          logger.info(LogCategory.DATABASE, `Adding ${meal.ingredients.length} ingredients to meal ${mealId}`);
          
          for (const ingredient of meal.ingredients) {
            // 2.1 Créer ou obtenir l'ingrédient standard
            let ingredientStandardId: number;
            
            // Vérifier si l'ingrédient existe déjà
            const existingIngredients = await tx
              .select()
              .from(ingredientsStandard)
              .where(eq(ingredientsStandard.name, ingredient.name))
              .limit(1);
            
            if (existingIngredients.length > 0) {
              // Utiliser l'ingrédient existant
              ingredientStandardId = existingIngredients[0].id;
              logger.info(LogCategory.DATABASE, `Using existing ingredient "${ingredient.name}" with ID ${ingredientStandardId}`);
            } else {
              // Créer un nouvel ingrédient standard
              const ingredientResult = await tx
                .insert(ingredientsStandard)
                .values({
                  name: ingredient.name,
                  unit: ingredient.unit,
                  quantity: ingredient.quantity || 100,
                  calories: ingredient.calories,
                  carbs: ingredient.carbs,
                  protein: ingredient.protein,
                  fat: ingredient.fat
                })
                .returning({ id: ingredientsStandard.id });
              
              if (!ingredientResult || ingredientResult.length === 0) {
                throw new Error(`Failed to create ingredient standard: ${ingredient.name}`);
              }
              
              ingredientStandardId = ingredientResult[0].id;
              logger.info(LogCategory.DATABASE, `Created new ingredient "${ingredient.name}" with ID ${ingredientStandardId}`);
            }
            
            // 2.2 Ajouter l'ingrédient au repas
            await tx
              .insert(mealIngredients)
              .values({
                mealId,
                ingredientStandardId,
                quantity: ingredient.quantity || 100,
                calories: ingredient.calories,
                carbs: ingredient.carbs,
                protein: ingredient.protein,
                fat: ingredient.fat
              });
            
            logger.info(LogCategory.DATABASE, `Added ingredient "${ingredient.name}" to meal ${mealId}`);
          }
        }
        
        return { success: true, mealId };
      });
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error in addMealViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Ajoute un plan nutritionnel via le MCP server
   * @param planData Données du plan à ajouter
   * @param userId ID de l'utilisateur
   * @returns Résultat de l'opération avec l'ID du plan créé ou une erreur
   */
  public async addPlanViaMCP(
    planData: IaPlanType,
    userId: number
  ): Promise<{ success: boolean; planId?: number; error?: string }> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      // Utiliser une transaction pour assurer l'intégrité des données
      return await this.db.transaction(async (tx: typeof this.db) => {
        logger.info(LogCategory.DATABASE, `Adding plan "${planData.name}" via MCP Server`);
        
        // 1. Créer le plan principal
        const planResult = await tx
          .insert(plan)
          .values({
            name: planData.name,
            goal: planData.goal,
            calories: planData.calories,
            carbs: planData.carbs,
            protein: planData.protein,
            fat: planData.fat,
            userId,
            generatedWith: PlanGeneratedWithEnum.AI, // Plan généré par l'IA
            current: false // Par défaut, un nouveau plan n'est pas le plan courant
          })
          .returning({ id: plan.id });
        
        if (!planResult || planResult.length === 0) {
          throw new Error('Failed to create plan');
        }
        
        const planId = planResult[0].id;
        logger.info(LogCategory.DATABASE, `Created plan with ID ${planId}`);
        
        // 2. Pour un plan simple, créer un jour par défaut
        // Nous simplifions ici, mais vous pourriez vouloir créer plusieurs jours
        const dailyPlanResult = await tx
          .insert(dailyPlan)
          .values({
            planId,
            day: DayEnum.MONDAY, // Jour par défaut
            week: 1,
            calories: planData.calories,
            carbs: planData.carbs,
            protein: planData.protein,
            fat: planData.fat,
            type: 'AI' // Généré par l'IA
          })
          .returning({ id: dailyPlan.id });
        
        if (!dailyPlanResult || dailyPlanResult.length === 0) {
          throw new Error('Failed to create daily plan');
        }
        
        const dailyPlanId = dailyPlanResult[0].id;
        logger.info(LogCategory.DATABASE, `Created daily plan with ID ${dailyPlanId}`);
        
        // 3. Associer les repas au plan quotidien si fournis
        if (planData.meals && planData.meals.length > 0) {
          logger.info(LogCategory.DATABASE, `Adding ${planData.meals.length} meals to plan ${planId}`);
          
          for (const mealData of planData.meals) {
            // 3.1 Créer d'abord le repas
            const mealResult = await this.addMealViaMCP(mealData, userId);
            
            if (!mealResult.success || !mealResult.mealId) {
              throw new Error(`Failed to create meal for plan: ${mealResult.error}`);
            }
            
            // 3.2 Associer le repas au plan quotidien
            await tx
              .insert(dailyPlanMeals)
              .values({
                dailyPlanId,
                mealId: mealResult.mealId,
                quantity: 100, // Valeur par défaut
                calories: mealData.calories,
                carbs: mealData.carbs,
                protein: mealData.protein,
                fat: mealData.fat
              });
            
            logger.info(LogCategory.DATABASE, `Added meal "${mealData.name}" to daily plan ${dailyPlanId}`);
          }
        }
        
        return { success: true, planId };
      });
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error in addPlanViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Ajoute un ingrédient standard via le MCP server
   * @param ingredientData Données de l'ingrédient à ajouter
   * @returns Résultat de l'opération avec l'ID de l'ingrédient créé ou une erreur
   */
  public async addIngredientViaMCP(
    ingredientData: IaIngredientType
  ): Promise<{ success: boolean; ingredientId?: number; alreadyExists?: boolean; error?: string }> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      logger.info(LogCategory.DATABASE, `Adding ingredient "${ingredientData.name}" via MCP Server`);
      
      // Vérifier si l'ingrédient existe déjà
      const existingIngredients = await this.db
        .select()
        .from(ingredientsStandard)
        .where(eq(ingredientsStandard.name, ingredientData.name))
        .limit(1);
      
      if (existingIngredients.length > 0) {
        logger.info(LogCategory.DATABASE, `Ingredient "${ingredientData.name}" already exists with ID ${existingIngredients[0].id}`);
        return { 
          success: true, 
          ingredientId: existingIngredients[0].id, 
          alreadyExists: true 
        };
      }
      
      // Créer l'ingrédient
      const result = await this.db
        .insert(ingredientsStandard)
        .values({
          name: ingredientData.name,
          unit: ingredientData.unit,
          quantity: ingredientData.quantity || 100,
          calories: ingredientData.calories,
          carbs: ingredientData.carbs,
          protein: ingredientData.protein,
          fat: ingredientData.fat
        })
        .returning({ id: ingredientsStandard.id });
      
      if (!result || result.length === 0) {
        throw new Error('Failed to create ingredient');
      }
      
      const ingredientId = result[0].id;
      logger.info(LogCategory.DATABASE, `Created new ingredient "${ingredientData.name}" with ID ${ingredientId}`);
      
      return { success: true, ingredientId, alreadyExists: false };
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error in addIngredientViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Met à jour les préférences utilisateur via le MCP server
   * @param userId ID de l'utilisateur à mettre à jour
   * @param preferences Préférences à mettre à jour
   * @returns Résultat de l'opération
   */
  public async updateUserPreferencesViaMCP(
    userId: number,
    preferences: Partial<{
      age: number;
      gender: string;
      weight: number;
      weightUnit: string;
      height: number;
      heightUnit: string;
      physicalActivity: string;
    }>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      logger.info(LogCategory.DATABASE, `Updating preferences for user ${userId} via MCP Server`);
      
      // Vérifier si l'utilisateur existe
      const userExists = await this.db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
      
      if (userExists.length === 0) {
        return { 
          success: false, 
          error: `User with ID ${userId} not found` 
        };
      }
      
      // Filtrer pour ne garder que les préférences qui sont réellement fournies
      const validPreferences: Record<string, any> = {};
      
      if (preferences.age !== undefined) validPreferences.age = preferences.age;
      if (preferences.gender !== undefined) validPreferences.gender = preferences.gender;
      if (preferences.weight !== undefined) validPreferences.weight = preferences.weight;
      if (preferences.weightUnit !== undefined) validPreferences.weightUnit = preferences.weightUnit;
      if (preferences.height !== undefined) validPreferences.height = preferences.height;
      if (preferences.heightUnit !== undefined) validPreferences.heightUnit = preferences.heightUnit;
      if (preferences.physicalActivity !== undefined) validPreferences.physicalActivity = preferences.physicalActivity;
      
      // Si aucune préférence valide n'est fournie, retourner une erreur
      if (Object.keys(validPreferences).length === 0) {
        return { 
          success: false, 
          error: 'No valid preferences provided' 
        };
      }
      
      // Mettre à jour les préférences
      await this.db
        .update(users)
        .set({
          ...validPreferences,
          updatedAt: sql`CURRENT_TIMESTAMP`
        })
        .where(eq(users.id, userId));
      
      logger.info(LogCategory.DATABASE, `Updated preferences for user ${userId}: ${JSON.stringify(validPreferences)}`);
      
      return { success: true };
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error in updateUserPreferencesViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
}

export default SQLiteMCPServer.getInstance();
