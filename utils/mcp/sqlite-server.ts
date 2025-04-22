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
  users,
  PlanOrmProps,
  DailyPlanOrmProps 
} from '@/db/schema';
import { eq, and, like, inArray } from 'drizzle-orm';
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
  DayEnum,
  DayUnitArray,
  DailyPlanGeneratedWithEnum
} from '@/utils/enum/general.enum';
import { WeightUnitEnum } from '@/utils/enum/user-details.enum';
import { NutritionGoalSchemaFormData } from '@/utils/validation/plan/nutrition-goal.validation';

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
      
      // Définir les colonnes utilisateur valides (hors id)
      const userColumns = [
        'age', 'gender', 'weight', 'weightUnit',
        'height', 'heightUnit', 'physicalActivity'
      ];
      
      // Filtrer pour ne garder que les préférences qui sont réellement fournies
      const validPreferences: Record<string, any> = {};
      
      for (const key in preferences) {
        // Vérifier si key est une clé valide de preferences et dans userColumns
        if (key in preferences && userColumns.includes(key) && key !== 'id') {
          // Utiliser une assertion de type pour indiquer que l'accès est sécurisé
          validPreferences[key] = preferences[key as keyof typeof preferences];
        }
      }
      
      if (Object.keys(validPreferences).length === 0) {
        throw new Error('No valid preferences to update');
      }
      
      // Mettre à jour les préférences de l'utilisateur
      await this.db
        .update(users)
        .set(validPreferences)
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

  /**
   * Crée un nouveau repas avec ses ingrédients associés via le MCP server
   * @param data Données du formulaire de repas
   * @param selectedIngredients Liste des ingrédients sélectionnés
   * @param totalMacros Totaux des macronutriments calculés
   * @param creatorId ID de l'utilisateur créateur
   * @returns Résultat de l'opération avec l'ID du repas créé ou une erreur
   */
  public async createNewMealViaMCP(
    data: any, // MealFormData (importation évitée pour simplifier)
    selectedIngredients: any[], // IngredientWithStandardProps[] (importation évitée pour simplifier)
    totalMacros: { totalCalories: number; totalCarbs: number; totalFats: number; totalProtein: number },
    creatorId: number
  ): Promise<{ success: boolean; mealId?: number; error?: string }> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      // Utiliser une transaction pour assurer l'intégrité des données
      return await this.db.transaction(async (tx: typeof this.db) => {
        logger.info(LogCategory.DATABASE, `Creating new meal "${data.name}" via MCP Server`);
        
        // 1. Créer le repas
        const newMeal = {
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
        
        const insertedMeal = await tx
          .insert(meals)
          .values(newMeal)
          .returning({ id: meals.id });
        
        if (!insertedMeal || insertedMeal.length === 0) {
          throw new Error('Failed to insert meal');
        }
        
        const mealId = insertedMeal[0].id;
        logger.info(LogCategory.DATABASE, `Created meal with ID ${mealId}`);
        
        // 2. Ajouter les ingrédients si fournis
        if (selectedIngredients && selectedIngredients.length > 0) {
          logger.info(LogCategory.DATABASE, `Adding ${selectedIngredients.length} ingredients to meal ${mealId}`);
          
          const mealIngredientsData = selectedIngredients.map((ingredient) => ({
            mealId: mealId,
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
          logger.info(LogCategory.DATABASE, `Added ${selectedIngredients.length} ingredients to meal ${mealId}`);
        }
        
        return { success: true, mealId };
      });
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error in createNewMealViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
  
  /**
   * Récupère une liste de repas avec filtrage optionnel
   * @param cuisine Filtrer par type de cuisine
   * @param mealType Filtrer par type de repas
   * @param mealName Filtrer par nom (recherche approximative)
   * @returns Liste des repas filtrés
   */
  public async getMealsListViaMCP(
    cuisine?: CuisineTypeEnum,
    mealType?: MealTypeEnum,
    mealName?: string,
  ): Promise<{ success: boolean; meals: any[]; error?: string }> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      logger.info(LogCategory.DATABASE, 'Fetching meals list via MCP Server', {
        filters: { cuisine, mealType, mealName },
      });

      // Construire un tableau de conditions pour optimiser la requête
      const conditions = [];
      if (cuisine) conditions.push(eq(meals.cuisine, cuisine));
      if (mealType) conditions.push(eq(meals.type, mealType));
      if (mealName) conditions.push(like(meals.name, `%${mealName}%`));

      const query = this.db
        .select()
        .from(meals)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(meals.createdAt);

      const results = await query.execute();
      logger.debug(LogCategory.DATABASE, 'Meals list fetched successfully via MCP', {
        count: results.length,
      });
      
      return { 
        success: true, 
        meals: results 
      };
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error in getMealsListViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error),
        meals: []
      };
    }
  }
  
  /**
   * Récupère un repas spécifique avec tous ses ingrédients
   * @param mealId Identifiant du repas à récupérer
   * @returns Données du repas avec ses ingrédients ou une erreur
   */
  public async getMealByIdWithIngredientsViaMCP(
    mealId: number
  ): Promise<{ success: boolean; meal?: any; ingredients?: any[]; error?: string }> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      logger.info(LogCategory.DATABASE, 'Fetching meal with ingredients via MCP Server', { mealId });

      // Optimisation en récupérant le repas et les ingrédients en parallèle
      const [meal, mealIngredientRecords] = await Promise.all([
        this.db.query.meals.findFirst({
          where: eq(meals.id, mealId),
        }),
        this.db.query.mealIngredients.findMany({
          where: eq(mealIngredients.mealId, mealId),
        }),
      ]);

      if (!meal) {
        logger.warn(LogCategory.DATABASE, `Meal not found with ID ${mealId}`);
        return { success: false, error: `Meal not found with ID ${mealId}` };
      }

      // Si aucun ingrédient, retourner le repas seul
      if (mealIngredientRecords.length === 0) {
        logger.debug(LogCategory.DATABASE, `Meal ${mealId} has no ingredients`);
        return { success: true, meal, ingredients: [] };
      }

      // Récupérer les données des ingrédients standards pour les ingrédients du repas
      const standardIngredientIds = mealIngredientRecords.map((i: { ingredientStandardId: number }) => i.ingredientStandardId);
      
      const standardIngredients = await this.db
        .select()
        .from(ingredientsStandard)
        .where(inArray(ingredientsStandard.id, standardIngredientIds));

      // Combiner les données de mealIngredients et ingredientsStandard
      const ingredients = mealIngredientRecords.map((mealIngredient: { ingredientStandardId: number }) => {
        const standardIngredient = standardIngredients.find(
          (s: { id: number }) => s.id === mealIngredient.ingredientStandardId
        );
        
        return {
          ...mealIngredient,
          standard: standardIngredient || null
        };
      });

      logger.debug(LogCategory.DATABASE, `Meal ${mealId} fetched with ${ingredients.length} ingredients via MCP Server`);
      
      return { 
        success: true, 
        meal, 
        ingredients 
      };
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error in getMealByIdWithIngredientsViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
  
  /**
   * Met à jour un repas existant avec ses ingrédients via le MCP server
   * @param data Données du formulaire de repas incluant l'ID du repas à mettre à jour
   * @param selectedIngredients Liste des ingrédients sélectionnés (nouveaux et existants)
   * @param totalMacros Totaux des macronutriments calculés
   * @returns Résultat de l'opération avec l'ID du repas mis à jour ou une erreur
   */
  public async updateMealViaMCP(
    data: any, // MealFormData (importation évitée pour simplifier)
    selectedIngredients: any[], // IngredientWithStandardProps[] (importation évitée pour simplifier)
    totalMacros: { totalCalories: number; totalCarbs: number; totalFats: number; totalProtein: number }
  ): Promise<{ success: boolean; mealId?: number; error?: string }> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      const mealId = data.id;
      if (!mealId) {
        return { success: false, error: 'Meal ID is required for update' };
      }
      
      logger.info(LogCategory.DATABASE, `Updating meal "${data.name}" (ID: ${mealId}) via MCP Server`);
      
      // Vérifier si le repas existe
      const mealExists = await this.db
        .select({ id: meals.id })
        .from(meals)
        .where(eq(meals.id, mealId))
        .limit(1);
        
      if (mealExists.length === 0) {
        logger.warn(LogCategory.DATABASE, `Cannot update: Meal with ID ${mealId} not found`);
        return { success: false, error: `Meal with ID ${mealId} not found` };
      }

      // Utiliser une transaction pour assurer l'intégrité des données
      return await this.db.transaction(async (tx: typeof this.db) => {
        // 1. Exclure l'id des données de mise à jour
        const { id, ...updateData } = data;
        
        logger.debug(LogCategory.DATABASE, `Updating meal ${mealId} with adjusted nutrition values`);
        
        // 2. Mettre à jour le repas
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
          .where(eq(meals.id, mealId))
          .returning({ id: meals.id });

        if (!updatedMeal || updatedMeal.length === 0) {
          throw new Error(`Failed to update meal ${mealId}`);
        }
        
        // 3. Supprimer les anciens ingrédients
        await tx.delete(mealIngredients).where(eq(mealIngredients.mealId, mealId));
        logger.debug(LogCategory.DATABASE, `Deleted existing ingredients for meal ${mealId}`);

        // 4. Insérer les nouveaux ingrédients
        if (selectedIngredients && selectedIngredients.length > 0) {
          const mealIngredientsData = selectedIngredients.map((ingredient) => ({
            mealId: mealId,
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
          logger.debug(LogCategory.DATABASE, `Added ${selectedIngredients.length} ingredients to updated meal ${mealId}`);
        }

        logger.info(LogCategory.DATABASE, `Successfully updated meal ${mealId} via MCP Server`);
        return { success: true, mealId };
      });
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error in updateMealViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
  
  /**
   * Ajoute un plan journalier à un plan existant via le MCP server
   * @param planId ID du plan parent
   * @param dailyPlanData Données du plan journalier à ajouter
   * @returns Résultat de l'opération avec l'ID du plan journalier créé ou une erreur
   */
  public async addDailyPlanViaMCP(
    planId: number,
    dailyPlanData: {
      day: DayEnum;
      week?: number;
      calories?: number;
      carbs?: number;
      protein?: number;
      fat?: number;
    }
  ): Promise<{ success: boolean; dailyPlanId?: number; error?: string }> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      logger.info(LogCategory.DATABASE, `Adding daily plan for day ${dailyPlanData.day} to plan ${planId} via MCP Server`);
      
      // Vérifier si le plan existe
      const planExists = await this.db
        .select({ id: plan.id })
        .from(plan)
        .where(eq(plan.id, planId))
        .limit(1);
        
      if (planExists.length === 0) {
        logger.warn(LogCategory.DATABASE, `Cannot add daily plan: Plan with ID ${planId} not found`);
        return { success: false, error: `Plan with ID ${planId} not found` };
      }

      // Créer le plan journalier
      const result = await this.db
        .insert(dailyPlan)
        .values({
          planId,
          day: dailyPlanData.day,
          week: dailyPlanData.week || 1,
          calories: dailyPlanData.calories || 0,
          carbs: dailyPlanData.carbs || 0,
          protein: dailyPlanData.protein || 0,
          fat: dailyPlanData.fat || 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        .returning({ id: dailyPlan.id });

      if (!result || result.length === 0) {
        throw new Error('Failed to create daily plan');
      }
      
      const dailyPlanId = result[0].id;
      logger.info(LogCategory.DATABASE, `Successfully created daily plan ${dailyPlanId} for plan ${planId} via MCP Server`);
      
      return { success: true, dailyPlanId };
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error in addDailyPlanViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Supprime un repas et ses ingrédients associés via le MCP server
   * @param mealId Identifiant du repas à supprimer
   * @returns Résultat de l'opération
   */
  public async deleteMealViaMCP(
    mealId: number
  ): Promise<{ success: boolean; mealId?: number; error?: string }> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      logger.info(LogCategory.DATABASE, `Deleting meal ${mealId} via MCP Server`);
      
      // Vérifier si le repas existe
      const mealExists = await this.db
        .select({ id: meals.id })
        .from(meals)
        .where(eq(meals.id, mealId))
        .limit(1);
        
      if (mealExists.length === 0) {
        logger.warn(LogCategory.DATABASE, `Cannot delete: Meal with ID ${mealId} not found`);
        return { success: false, error: `Meal with ID ${mealId} not found` };
      }

      // Utiliser une transaction pour assurer l'intégrité des données
      return await this.db.transaction(async (tx: typeof this.db) => {
        // 1. Supprimer les ingrédients associés (contrainte de clé étrangère)
        await tx.delete(mealIngredients).where(eq(mealIngredients.mealId, mealId));
        logger.debug(LogCategory.DATABASE, `Deleted ingredients for meal ${mealId}`);
        
        // 2. Supprimer le repas
        const deletedMeal = await tx
          .delete(meals)
          .where(eq(meals.id, mealId))
          .returning({ id: meals.id });

        if (!deletedMeal || deletedMeal.length === 0) {
          throw new Error(`Failed to delete meal ${mealId}`);
        }

        logger.info(LogCategory.DATABASE, `Successfully deleted meal ${mealId} via MCP Server`);
        return { success: true, mealId };
      });
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error in deleteMealViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }

  /**
   * Récupère la liste de tous les plans nutritionnels
   * @returns Liste des plans ou une erreur
   */
  public async getPlansListViaMCP(): Promise<{ success: boolean; plans?: any[]; error?: string }> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      logger.info(LogCategory.DATABASE, `Fetching all nutrition plans via MCP Server`);
      
      const plansResult = await this.db.query.plan.findMany();
      
      logger.info(LogCategory.DATABASE, `Successfully fetched ${plansResult.length} plans via MCP Server`);
      
      return { 
        success: true, 
        plans: plansResult 
      };
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error in getPlansListViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }

  /**
   * Récupère les détails d'un plan nutritionnel et ses plans journaliers
   * @param planId Identifiant du plan à récupérer
   * @returns Détails du plan avec ses plans journaliers ou une erreur
   */
  public async getPlanDetailsViaMCP(
    planId: number | string
  ): Promise<{ success: boolean; plan?: any; dailyPlans?: any[]; error?: string }> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      // Convertir l'ID en nombre si nécessaire
      const numericPlanId = typeof planId === 'string' ? Number(planId) : planId;
      
      logger.info(LogCategory.DATABASE, `Fetching details for plan ${numericPlanId} via MCP Server`);
      
      // Récupérer le plan
      const foundPlan = await this.db.query.plan.findFirst({
        where: eq(plan.id, numericPlanId),
      });
      
      if (!foundPlan) {
        logger.warn(LogCategory.DATABASE, `Plan with ID ${numericPlanId} not found`);
        return { success: false, error: `Plan with ID ${numericPlanId} not found` };
      }
      
      // Récupérer tous les plans journaliers associés
      const dailyPlans = await this.db.query.dailyPlan.findMany({
        where: eq(dailyPlan.planId, numericPlanId),
      });
      
      logger.info(LogCategory.DATABASE, `Successfully fetched plan ${numericPlanId} with ${dailyPlans.length} daily plans via MCP Server`);
      
      return { 
        success: true, 
        plan: foundPlan, 
        dailyPlans: dailyPlans 
      };
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error in getPlanDetailsViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }

  /**
   * Récupère un plan nutritionnel avec ses plans journaliers et leurs repas associés
   * @param planId Identifiant du plan à récupérer
   * @returns Plan complet avec plans journaliers et repas ou une erreur
   */
  public async getPlanWithDailyPlansViaMCP(
    planId: number
  ): Promise<{ success: boolean; plan?: any; error?: string }> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      logger.info(LogCategory.DATABASE, `Fetching plan ${planId} with daily plans via MCP Server`);
      
      // Récupérer le plan
      const foundPlan = await this.db.query.plan.findFirst({
        where: eq(plan.id, planId),
      });
      
      if (!foundPlan) {
        logger.warn(LogCategory.DATABASE, `Plan with ID ${planId} not found`);
        return { success: false, error: `Plan with ID ${planId} not found` };
      }
      
      // Récupérer tous les plans journaliers associés
      const dailyPlans = await this.db.query.dailyPlan.findMany({
        where: eq(dailyPlan.planId, planId),
      });
      
      logger.info(LogCategory.DATABASE, `Successfully fetched plan ${planId} with ${dailyPlans.length} daily plans via MCP Server`);
      
      return { 
        success: true, 
        plan: {
          ...foundPlan,
          dailyPlans: dailyPlans
        }
      };
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error in getPlanWithDailyPlansViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }

  /**
   * Crée un nouveau plan nutritionnel via le MCP server
   * @param data Données du plan à créer
   * @param userId ID de l'utilisateur propriétaire du plan
   * @returns Résultat de l'opération avec l'ID du plan créé ou une erreur
   */
  public async createPlanViaMCP(
    data: NutritionGoalSchemaFormData,
    userId: number
  ): Promise<{ success: boolean; planId?: number; error?: string }> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      logger.info(LogCategory.DATABASE, `Creating nutrition plan for user ${userId} via MCP Server`);
      
      // Vérifier si l'utilisateur existe
      const userExists = await this.db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
      
      if (userExists.length === 0) {
        logger.warn(LogCategory.DATABASE, `Cannot create plan: User with ID ${userId} not found`);
        return { success: false, error: `User with ID ${userId} not found` };
      }
      
      // Créer un nouveau plan avec les données appropriées
      const newPlan: Omit<PlanOrmProps, 'id'> = {
        name: `Plan ${new Date().toLocaleDateString()}`,
        goal: data.goalUnit,
        unit: WeightUnitEnum.KG, // Utilisation d'une valeur par défaut car non définie dans le schéma
        initialWeight: data.initialWeight,
        targetWeight: data.targetWeight,
        durationWeeks: data.durationWeeks,
        calories: 0, // Sera calculé plus tard
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
      
      // Utiliser une transaction pour assurer l'intégrité des données
      return await this.db.transaction(async (tx: typeof this.db) => {
        // 1. Insérer le plan dans la base de données et récupérer l'ID
        const [insertedPlan] = await tx
          .insert(plan)
          .values(newPlan)
          .returning({ id: plan.id });
        
        // 2. Créer les plans journaliers automatiquement
        await this.createDailyPlansViaMCP(insertedPlan.id, data.durationWeeks, tx);
        
        logger.info(LogCategory.DATABASE, `Successfully created plan ${insertedPlan.id} for user ${userId} via MCP Server`);
        return { success: true, planId: insertedPlan.id };
      });
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error in createPlanViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }
  
  /**
   * Crée des plans journaliers pour un plan nutritionnel via le MCP server
   * @param planId ID du plan nutritionnel parent
   * @param durationWeeks Durée en semaines du plan
   * @param transaction Instance de transaction optionnelle (pour utilisation interne)
   * @returns Résultat de l'opération
   */
  public async createDailyPlansViaMCP(
    planId: number,
    durationWeeks: number,
    transaction?: typeof this.db
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      logger.info(LogCategory.DATABASE, `Creating daily plans for plan ${planId} (${durationWeeks} weeks) via MCP Server`);
      
      // Vérifier si le plan existe
      if (!transaction) {
        const planExists = await this.db
          .select({ id: plan.id })
          .from(plan)
          .where(eq(plan.id, planId))
          .limit(1);
          
        if (planExists.length === 0) {
          logger.warn(LogCategory.DATABASE, `Cannot create daily plans: Plan with ID ${planId} not found`);
          return { success: false, error: `Plan with ID ${planId} not found` };
        }
      }
      
      // Préparer les données pour l'insertion en bloc
      const dailyPlansData: Omit<DailyPlanOrmProps, 'id'>[] = [];
      
      for (let week = 1; week <= durationWeeks; week++) {
        // Créer un plan pour chaque jour de la semaine
        for (const day of DayUnitArray) {
          dailyPlansData.push({
            week,
            day,
            calories: 0, // Sera calculé plus tard
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
      
      // Insérer tous les plans journaliers en une seule transaction
      const db = transaction || this.db;
      await db.insert(dailyPlan).values(dailyPlansData);
      
      logger.info(LogCategory.DATABASE, `Successfully created ${dailyPlansData.length} daily plans for plan ${planId} via MCP Server`);
      return { success: true };
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error in createDailyPlansViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }

  /**
   * Met à jour un plan nutritionnel existant via le MCP server
   * @param planId ID du plan à mettre à jour
   * @param data Données à mettre à jour
   * @returns Résultat de l'opération
   */
  public async updatePlanViaMCP(
    planId: number,
    data: Partial<PlanOrmProps>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      logger.info(LogCategory.DATABASE, `Updating plan ${planId} via MCP Server`);
      
      // Vérifier si le plan existe
      const planExists = await this.db
        .select({ id: plan.id })
        .from(plan)
        .where(eq(plan.id, planId))
        .limit(1);
        
      if (planExists.length === 0) {
        logger.warn(LogCategory.DATABASE, `Cannot update: Plan with ID ${planId} not found`);
        return { success: false, error: `Plan with ID ${planId} not found` };
      }
      
      // Mettre à jour le plan
      await this.db
        .update(plan)
        .set({
          ...data,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(plan.id, planId));
      
      logger.info(LogCategory.DATABASE, `Successfully updated plan ${planId} via MCP Server`);
      return { success: true };
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error in updatePlanViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }
  
  /**
   * Supprime un plan nutritionnel et toutes ses données associées via le MCP server
   * @param planId ID du plan à supprimer
   * @returns Résultat de l'opération
   */
  public async deletePlanViaMCP(
    planId: number
  ): Promise<{ success: boolean; planId?: number; error?: string }> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      logger.info(LogCategory.DATABASE, `Deleting plan ${planId} via MCP Server`);
      
      // Vérifier si le plan existe
      const planExists = await this.db
        .select({ id: plan.id })
        .from(plan)
        .where(eq(plan.id, planId))
        .limit(1);
        
      if (planExists.length === 0) {
        logger.warn(LogCategory.DATABASE, `Cannot delete: Plan with ID ${planId} not found`);
        return { success: false, error: `Plan with ID ${planId} not found` };
      }

      // Utiliser une transaction pour assurer l'intégrité des données
      return await this.db.transaction(async (tx: typeof this.db) => {
        // 1. Trouver tous les plans journaliers pour ce plan
        const dailyPlans = await tx.query.dailyPlan.findMany({
          where: eq(dailyPlan.planId, planId),
        });

        // 2. Récupérer tous les IDs des plans journaliers
        const dailyPlanIds = dailyPlans.map((dp: { id: number }) => dp.id);

        // 3. Supprimer toutes les relations de repas
        if (dailyPlanIds.length > 0) {
          await tx
            .delete(dailyPlanMeals)
            .where(inArray(dailyPlanMeals.dailyPlanId, dailyPlanIds));
          
          logger.debug(LogCategory.DATABASE, `Deleted meal relationships for ${dailyPlanIds.length} daily plans`);
        }

        // 4. Supprimer tous les plans journaliers
        await tx.delete(dailyPlan).where(eq(dailyPlan.planId, planId));
        logger.debug(LogCategory.DATABASE, `Deleted daily plans for plan ${planId}`);

        // 5. Supprimer le plan
        await tx.delete(plan).where(eq(plan.id, planId));

        logger.info(LogCategory.DATABASE, `Successfully deleted plan ${planId} via MCP Server`);
        return { success: true, planId };
      });
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error in deletePlanViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }

  /**
   * Ajoute un repas à un plan journalier via le MCP server
   * @param dailyPlanId ID du plan journalier
   * @param mealId ID du repas à ajouter
   * @param quantity Quantité du repas (par défaut: 10 grammes)
   * @returns Résultat de l'opération
   */
  /**
   * Met à jour la quantité d'un repas dans un plan journalier via le MCP server
   * @param dailyPlanId ID du plan journalier
   * @param mealId ID du repas à mettre à jour
   * @param newQuantity Nouvelle quantité du repas
   * @returns Résultat de l'opération
   */
  public async updateMealQuantityInPlanViaMCP(
    dailyPlanId: number,
    mealId: number,
    newQuantity: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      logger.info(LogCategory.DATABASE, `Updating meal ${mealId} quantity to ${newQuantity} in daily plan ${dailyPlanId} via MCP Server`);
      
      // 1. Vérification que le repas existe
      const meal = await this.db.query.meals.findFirst({
        where: eq(meals.id, mealId),
      });

      if (!meal) {
        logger.warn(LogCategory.DATABASE, `Cannot update meal: Meal with ID ${mealId} not found`);
        return { success: false, error: `Meal with ID ${mealId} not found` };
      }

      // 2. Vérification que le plan journalier existe
      const currentDailyPlan = await this.db.query.dailyPlan.findFirst({
        where: eq(dailyPlan.id, dailyPlanId),
      });

      if (!currentDailyPlan) {
        logger.warn(LogCategory.DATABASE, `Cannot update meal: Daily plan with ID ${dailyPlanId} not found`);
        return { success: false, error: `Daily plan with ID ${dailyPlanId} not found` };
      }

      // 3. Vérification que la relation repas-plan existe
      const currentRelation = await this.db.query.dailyPlanMeals.findFirst({
        where: (fields: any) => 
          eq(dailyPlanMeals.dailyPlanId, dailyPlanId) && 
          eq(dailyPlanMeals.mealId, mealId)
      });

      if (!currentRelation) {
        logger.warn(LogCategory.DATABASE, `Cannot update: Meal ${mealId} not found in daily plan ${dailyPlanId}`);
        return { success: false, error: `Meal not found in this daily plan` };
      }

      // Utiliser une transaction pour assurer l'intégrité des données
      return await this.db.transaction(async (tx: typeof this.db) => {
        // Calculer le ratio pour la nouvelle quantité basé sur le repas original
        const ratio = newQuantity / meal.quantity;

        // Calculer les valeurs nutritionnelles ajustées en fonction du ratio
        const adjustedCalories = meal.calories * ratio;
        const adjustedCarbs = meal.carbs * ratio;
        const adjustedFat = meal.fat * ratio;
        const adjustedProtein = meal.protein * ratio;

        // Calculer la différence en valeurs nutritionnelles
        const caloriesDiff = adjustedCalories - (currentRelation.calories || 0);
        const carbsDiff = adjustedCarbs - (currentRelation.carbs || 0);
        const fatDiff = adjustedFat - (currentRelation.fat || 0);
        const proteinDiff = adjustedProtein - (currentRelation.protein || 0);

        // 4. Mettre à jour la relation repas-plan avec les nouvelles valeurs
        await tx
          .update(dailyPlanMeals)
          .set({
            quantity: newQuantity,
            calories: adjustedCalories,
            carbs: adjustedCarbs,
            fat: adjustedFat,
            protein: adjustedProtein,
          })
          .where(
            and(
              eq(dailyPlanMeals.dailyPlanId, dailyPlanId),
              eq(dailyPlanMeals.mealId, mealId)
            )
          );

        // 5. Mettre à jour les valeurs nutritionnelles du plan journalier
        await tx
          .update(dailyPlan)
          .set({
            calories: currentDailyPlan.calories + caloriesDiff,
            carbs: currentDailyPlan.carbs + carbsDiff,
            fat: currentDailyPlan.fat + fatDiff,
            protein: currentDailyPlan.protein + proteinDiff,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(dailyPlan.id, dailyPlanId));

        // 6. Mettre à jour les statistiques totales du plan principal
        const planId = currentDailyPlan.planId;

        // Récupérer tous les plans journaliers du plan principal
        const allDailyPlans = await tx.query.dailyPlan.findMany({
          where: eq(dailyPlan.planId, planId),
        });

        // Calculer les valeurs nutritionnelles totales pour le plan
        const totalCalories = allDailyPlans.reduce(
          (sum: number, dp: { calories: number }) => sum + dp.calories,
          0,
        );
        const totalCarbs = allDailyPlans.reduce((sum: number, dp: { carbs: number }) => sum + dp.carbs, 0);
        const totalFat = allDailyPlans.reduce((sum: number, dp: { fat: number }) => sum + dp.fat, 0);
        const totalProtein = allDailyPlans.reduce(
          (sum: number, dp: { protein: number }) => sum + dp.protein,
          0,
        );

        // Mettre à jour le plan avec les nouveaux totaux
        await tx
          .update(plan)
          .set({
            calories: totalCalories,
            carbs: totalCarbs,
            fat: totalFat,
            protein: totalProtein,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(plan.id, planId));

        logger.info(LogCategory.DATABASE, `Successfully updated meal ${mealId} quantity in daily plan ${dailyPlanId} via MCP Server`);
        return { success: true };
      });
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error in updateMealQuantityInPlanViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }

  /**
   * Définit un plan comme plan courant pour un utilisateur via le MCP server
   * @param planId ID du plan à définir comme courant
   * @param userId ID de l'utilisateur
   * @returns Résultat de l'opération
   */
  public async setCurrentPlanViaMCP(
    planId: number,
    userId: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      logger.info(LogCategory.DATABASE, `Setting plan ${planId} as current for user ${userId} via MCP Server`);
      
      // Vérifier si le plan existe et appartient à l'utilisateur
      const targetPlan = await this.db.query.plan.findFirst({
        where: and(
          eq(plan.id, planId),
          eq(plan.userId, userId)
        ),
      });
      
      if (!targetPlan) {
        logger.warn(LogCategory.DATABASE, `Cannot set current: Plan with ID ${planId} not found or does not belong to user ${userId}`);
        return { success: false, error: `Plan not found or does not belong to this user` };
      }
      
      // Utiliser une transaction pour assurer la cohérence des données
      await this.db.transaction(async (tx: typeof this.db) => {
        // 1. Définir tous les plans de cet utilisateur comme non courants
        await tx
          .update(plan)
          .set({ 
            current: false,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(plan.userId, userId));
        
        // 2. Définir le plan cible comme courant
        await tx
          .update(plan)
          .set({ 
            current: true,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(plan.id, planId));
      });
      
      logger.info(LogCategory.DATABASE, `Successfully set plan ${planId} as current for user ${userId} via MCP Server`);
      return { success: true };
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error in setCurrentPlanViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }
  
  /**
   * Récupère le plan courant d'un utilisateur via le MCP server
   * @param userId ID de l'utilisateur
   * @returns Plan courant ou une erreur
   */
  public async getCurrentPlanViaMCP(
    userId: number
  ): Promise<{ success: boolean; plan?: any; error?: string }> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      logger.info(LogCategory.DATABASE, `Getting current plan for user ${userId} via MCP Server`);
      
      // Vérifier si l'utilisateur existe
      const userExists = await this.db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
      
      if (userExists.length === 0) {
        logger.warn(LogCategory.DATABASE, `Cannot get current plan: User with ID ${userId} not found`);
        return { success: false, error: `User with ID ${userId} not found` };
      }
      
      // Trouver le plan marqué comme courant pour cet utilisateur
      const currentPlan = await this.db.query.plan.findFirst({
        where: and(
          eq(plan.userId, userId),
          eq(plan.current, true)
        ),
      });
      
      if (!currentPlan) {
        logger.info(LogCategory.DATABASE, `No current plan found for user ${userId}`);
        return { success: true, plan: null };
      }
      
      logger.info(LogCategory.DATABASE, `Successfully got current plan for user ${userId} via MCP Server`);
      return { success: true, plan: currentPlan };
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error in getCurrentPlanViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }
  
  public async addMealToDailyPlanViaMCP(
    dailyPlanId: number,
    mealId: number,
    quantity: number = 10
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      logger.info(LogCategory.DATABASE, `Adding meal ${mealId} to daily plan ${dailyPlanId} (quantity: ${quantity}) via MCP Server`);
      
      // 1. Vérification que le repas existe
      const meal = await this.db.query.meals.findFirst({
        where: eq(meals.id, mealId),
      });

      if (!meal) {
        logger.warn(LogCategory.DATABASE, `Cannot add meal: Meal with ID ${mealId} not found`);
        return { success: false, error: `Meal with ID ${mealId} not found` };
      }

      // 2. Vérification que le plan journalier existe
      const currentDailyPlan = await this.db.query.dailyPlan.findFirst({
        where: eq(dailyPlan.id, dailyPlanId),
      });

      if (!currentDailyPlan) {
        logger.warn(LogCategory.DATABASE, `Cannot add meal: Daily plan with ID ${dailyPlanId} not found`);
        return { success: false, error: `Daily plan with ID ${dailyPlanId} not found` };
      }

      // 3. Vérification si le repas est déjà ajouté au plan journalier (pour éviter les doublons)
      const existingRelation = await this.db
        .select()
        .from(dailyPlanMeals)
        .where(
          and(
            eq(dailyPlanMeals.dailyPlanId, dailyPlanId),
            eq(dailyPlanMeals.mealId, mealId)
          )
        )
        .limit(1);

      if (existingRelation.length > 0) {
        logger.warn(LogCategory.DATABASE, `Meal ${mealId} is already added to daily plan ${dailyPlanId}`);
        return { success: false, error: `Meal is already added to this daily plan` };
      }

      // Utiliser une transaction pour assurer l'intégrité des données
      return await this.db.transaction(async (tx: typeof this.db) => {
        // Calculer le ratio de la quantité demandée par rapport à la quantité d'origine du repas
        const ratio = quantity / meal.quantity;

        // Calculer les valeurs nutritionnelles ajustées en fonction du ratio
        const adjustedCalories = meal.calories * ratio;
        const adjustedCarbs = meal.carbs * ratio;
        const adjustedFat = meal.fat * ratio;
        const adjustedProtein = meal.protein * ratio;

        // 4. Ajouter le repas au plan journalier avec la quantité personnalisée et les valeurs nutritionnelles calculées
        await tx.insert(dailyPlanMeals).values({
          dailyPlanId,
          mealId,
          quantity,
          calories: adjustedCalories,
          carbs: adjustedCarbs,
          fat: adjustedFat,
          protein: adjustedProtein,
        });

        // 5. Mettre à jour les valeurs nutritionnelles du plan journalier
        await tx
          .update(dailyPlan)
          .set({
            calories: currentDailyPlan.calories + adjustedCalories,
            carbs: currentDailyPlan.carbs + adjustedCarbs,
            fat: currentDailyPlan.fat + adjustedFat,
            protein: currentDailyPlan.protein + adjustedProtein,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(dailyPlan.id, dailyPlanId));

        // 6. Mettre à jour les statistiques totales du plan principal
        const planId = currentDailyPlan.planId;

        // Récupérer tous les plans journaliers du plan principal
        const allDailyPlans = await tx.query.dailyPlan.findMany({
          where: eq(dailyPlan.planId, planId),
        });

        // Calculer les valeurs nutritionnelles totales pour le plan
        const totalCalories = allDailyPlans.reduce(
          (sum: number, dp: { calories: number }) => sum + dp.calories,
          0,
        );
        const totalCarbs = allDailyPlans.reduce((sum: number, dp: { carbs: number }) => sum + dp.carbs, 0);
        const totalFat = allDailyPlans.reduce((sum: number, dp: { fat: number }) => sum + dp.fat, 0);
        const totalProtein = allDailyPlans.reduce(
          (sum: number, dp: { protein: number }) => sum + dp.protein,
          0,
        );

        // Mettre à jour le plan avec les nouveaux totaux
        await tx
          .update(plan)
          .set({
            calories: totalCalories,
            carbs: totalCarbs,
            fat: totalFat,
            protein: totalProtein,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(plan.id, planId));

        logger.info(LogCategory.DATABASE, `Successfully added meal ${mealId} to daily plan ${dailyPlanId} via MCP Server`);
        return { success: true };
      });
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error in addMealToDailyPlanViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }
}

export default SQLiteMCPServer.getInstance();
