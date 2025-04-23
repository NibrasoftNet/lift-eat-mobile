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
  DailyPlanOrmProps,
  MealOrmProps
} from '@/db/schema';
import { eq, and, like, inArray } from 'drizzle-orm';
import { 
  IaIngredientType,
  IaMealType,
  IaPlanType 
} from '@/utils/validation/ia/ia.schemas';
import { GoalEnum } from '@/utils/enum/user-details.enum';
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
import { WeightUnitEnum } from '@/utils/enum/user-details.enum';

// Import des handlers et interfaces
import { 
  handleCreatePlan, 
  handleCreateDailyPlans, 
  handleUpdatePlan, 
  handleDeletePlan,
  handleAddDailyPlan,
  handleGetPlansList,
  handleGetPlanDetails
} from './handlers/plan-handlers';
import { 
  handleGetMealsList,
  handleGetMealDetails,
  handleCreateMeal,
  handleCreateNewMeal,
  handleAddMealToDailyPlan,
  handleUpdateMeal,
  handleDeleteMeal
} from './handlers/meal-handlers';
import {
  handleAddIngredient,
  handleGetIngredientsList,
  handleUpdateIngredient,
  handleDeleteIngredient
} from './handlers/ingredient-handlers';
import { handleUpdateUserPreferences, handleGetUserDetails, handleCreateUser, handleValidateUserExists } from './handlers/user-handlers';
import {
  handleGetDailyProgressByDate,
  handleCreateDailyProgress,
  handleUpdateDailyProgress,
  handleGetMealProgressByDate,
  handleMarkMealAsConsumed,
  handleGetMealProgressByDailyProgress
} from './handlers/progress-handlers';

// Imports des interfaces
import { CreateNewMealResult } from './interfaces/meal-interfaces';
import { 
  CreatePlanParams, 
  CreateDailyPlansParams, 
  PlanResult, 
  DailyPlansResult, 
  UpdatePlanParams, 
  DeletePlanParams, 
  DeletePlanResult, 
  BasicResult,
  AddDailyPlanParams,
  AddDailyPlanResult
} from './interfaces/plan-interfaces';
import {
  GetMealsListParams,
  GetMealsListResult,
  GetMealDetailsParams,
  GetMealDetailsResult,
  CreateMealParams,
  CreateMealResult,
  AddMealToDailyPlanParams,
  AddMealToDailyPlanResult
} from './interfaces/meal-interfaces';
import { NutritionGoalSchemaFormData } from '@/utils/validation/plan/nutrition-goal.validation';
import {
  AddIngredientParams,
  AddIngredientResult,
  GetIngredientsListParams,
  GetIngredientsListResult,
  UpdateIngredientParams,
  UpdateIngredientResult,
  DeleteIngredientParams,
  DeleteIngredientResult
} from './interfaces/ingredient-interfaces';
import {
  UpdateUserPreferencesParams,
  UpdateUserPreferencesResult,
  GetUserDetailsParams,
  GetUserDetailsResult,
  CreateUserParams,
  CreateUserResult,
  ValidateUserExistsParams,
  ValidateUserExistsResult
} from './interfaces/user-interfaces';
import {
  GetDailyProgressByDateParams,
  GetDailyProgressByDateResult,
  CreateDailyProgressParams,
  CreateDailyProgressResult,
  UpdateDailyProgressParams,
  UpdateDailyProgressResult,
  GetMealProgressByDateParams,
  GetMealProgressByDateResult,
  MarkMealAsConsumedParams,
  MarkMealAsConsumedResult,
  GetMealProgressByDailyProgressParams,
  GetMealProgressByDailyProgressResult
} from './interfaces/progress-interfaces';

// Ajout de l'import pour les handlers IA
import { 
  handleGetUserContext, 
  handleGetUserPreferences,
  handleGetUserFavoriteMeals,
  handleGetUserActivePlans,
  handleGetUserActivityHistory
} from './handlers/ia-handlers';

/**
 * Système de cache simple pour les requêtes fréquentes
 */
// Import du nouveau système de cache optimisé
import mcpCache, { CacheGroup, CacheDuration } from './cache/mcp-cache';
import { buildCacheKey, getCacheDuration } from './cache/cache-config';

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
      
      // Extract nutritional preferences from user
      return {
        gender: user.gender,
        age: user.age,
        weight: user.weight,
        weightUnit: user.weightUnit,
        height: user.height,
        heightUnit: user.heightUnit,
        physicalActivity: user.physicalActivity,
        goalWeight: user.goalWeight,
        goal: user.goal,
        dietaryRestrictions: user.dietaryRestrictions || []
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
      
      // For now, just return the most recent meals added by the user
      // In the future, this could be based on ratings or frequency of consumption
      const userMeals = await this.db.select()
        .from(meals)
        .where(eq(meals.creatorId, userId))
        .orderBy(sql`${meals.createdAt} DESC`)
        .limit(limit);
      
      return userMeals;
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
      
      const userPlans = await this.db.select()
        .from(plan)
        .where(
          and(
            eq(plan.userId, userId),
            eq(plan.completed, false)
          )
        )
        .orderBy(sql`${plan.createdAt} DESC`);
      
      if (userPlans.length === 0) {
        return [];
      }
      
      // Get the plan that is marked as current
      const currentPlan = userPlans.find((p: PlanOrmProps) => p.current === true);
      
      // Add a property to indicate which plan is current
      return {
        plans: userPlans,
        currentPlan: currentPlan || null
      };
    } catch (error) {
      console.error("Error fetching user active plans:", error);
      throw error;
    }
  }

  /**
   * Generate user context for AI prompts
   * @param userId User ID
   * @returns User context string for AI prompts
   */
  public async generateUserContext(userId: number): Promise<string> {
    try {
      // Construire une clé de cache précise avec le nouveau système
      const cacheKey = buildCacheKey(
        CacheGroup.IA_CONTEXT,  // Groupe de cache pour le contexte utilisateur IA
        'userContext',         // Type de donnée spécifique
        undefined,             // Pas d'ID spécifique autre que l'utilisateur
        userId                 // ID de l'utilisateur
      );
      
      // Récupérer depuis le cache si disponible
      const cachedData = mcpCache.get<string>(cacheKey);
      
      if (cachedData) {
        logger.debug(LogCategory.DATABASE, `Using cached user context for user ${userId}`);
        return cachedData;
      }
      
      // Générer le contexte s'il n'est pas dans le cache
      const result = await handleGetUserContext(this.db, { userId });
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      // Mettre en cache le contexte avec la durée optimisée pour les contextes IA
      if (result.context) {
        // Récupérer la durée optimisée depuis la configuration
        const cacheDuration = getCacheDuration(CacheGroup.IA_CONTEXT, 'userContext');
        mcpCache.set(cacheKey, result.context, CacheGroup.IA_CONTEXT, cacheDuration);
        
        logger.debug(LogCategory.DATABASE, `Stored user context in cache for ${cacheDuration/1000} seconds`);
        return result.context;
      }
      
      return "USER CONTEXT: Not available";
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error generating user context: ${error}`);
      return "USER CONTEXT: Not available";
    }
  }

  /**
   * Récupère les préférences utilisateur via MCP
   * @param userId ID de l'utilisateur
   * @returns Préférences utilisateur ou erreur
   */
  public async getUserPreferencesViaMCP(userId: number) {
    return handleGetUserPreferences(this.db, { userId });
  }

  /**
   * Récupère les repas favoris d'un utilisateur via MCP
   * @param userId ID de l'utilisateur
   * @returns Liste des repas favoris ou erreur
   */
  public async getUserFavoriteMealsViaMCP(userId: number) {
    return handleGetUserFavoriteMeals(this.db, { userId });
  }

  /**
   * Récupère les plans actifs d'un utilisateur via MCP
   * @param userId ID de l'utilisateur
   * @returns Liste des plans actifs ou erreur
   */
  public async getUserActivePlansViaMCP(userId: number) {
    return handleGetUserActivePlans(this.db, { userId });
  }

  /**
   * Récupère l'historique d'activité d'un utilisateur via MCP
   * @param userId ID de l'utilisateur
   * @param daysLimit Nombre de jours à inclure (défaut: 7)
   * @returns Historique d'activité ou erreur
   */
  public async getUserActivityHistoryViaMCP(userId: number, daysLimit?: number) {
    return handleGetUserActivityHistory(this.db, { userId, daysLimit });
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
  ): Promise<CreateMealResult> {
    // Transformer le type IaMealType en type attendu par handleCreateMeal
    const mealData = {
      ...meal,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      quantity: 100, // Valeur par défaut pour la quantité du repas
      image: null,
      creatorId
    };
    return handleCreateMeal(this.db, { data: mealData, userId: creatorId });
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
  ): Promise<PlanResult> {
    // Créer un objet NutritionGoalSchemaFormData à partir des données disponibles
    // Comme IaPlanType ne contient pas les propriétés requises pour NutritionGoalSchemaFormData,
    // nous utilisons des valeurs par défaut tout en conservant l'objectif
    const formData: NutritionGoalSchemaFormData = {
      initialWeight: 70, // Valeur par défaut
      targetWeight: 65, // Valeur par défaut
      durationWeeks: 4, // Valeur par défaut
      goalUnit: planData.goal // Seule propriété que nous pouvons récupérer du plan IA
    };
    
    return handleCreatePlan(this.db, { data: formData, userId });
  }

  /**
   * Ajoute un ingrédient standard via le MCP server
   * @param ingredientData Données de l'ingrédient à ajouter
   * @returns Résultat de l'opération avec l'ID de l'ingrédient créé ou une erreur
   */
  public async addIngredientViaMCP(
    ingredientData: IaIngredientType
  ): Promise<AddIngredientResult> {
    logger.info(LogCategory.DATABASE, `Adding ingredient via MCP: ${ingredientData.name}`);
    return handleAddIngredient(this.db, { ingredientData });
  }

  /**
   * Récupère une liste d'ingrédients standards via le MCP server
   * @param search Terme de recherche (optionnel)
   * @param limit Nombre maximum d'ingrédients à retourner (par défaut: 50)
   * @returns Résultat de l'opération avec la liste des ingrédients
   */
  public async getIngredientsListViaMCP(
    search?: string,
    limit: number = 50
  ): Promise<GetIngredientsListResult> {
    try {
      // Construire une clé de cache standardisée pour la liste des ingrédients
      // Format: ${group}:${subType}:${id}:${userId}
      const searchParam = search ? `search_${search}` : 'all';
      const listId = `${searchParam}_limit_${limit}`;
      
      const cacheKey = buildCacheKey(
        CacheGroup.INGREDIENT,
        'list',
        listId,    // On utilise ce paramètre comme ID pour différencier les requêtes
        undefined   // Pas d'ID utilisateur spécifique
      );
      
      // Récupérer depuis le cache si disponible
      const cachedData = mcpCache.get<GetIngredientsListResult>(cacheKey);
      
      if (cachedData) {
        logger.debug(LogCategory.CACHE, `Using cached ingredients list, search: ${search || 'all'}, limit: ${limit}`);
        return cachedData;
      }
      
      logger.info(LogCategory.DATABASE, `Getting ingredients list via MCP, search: ${search || 'all'}, limit: ${limit}`);
      
      // Mesurer le temps d'accès sans cache
      const startTime = performance.now();
      
      const result = await handleGetIngredientsList(this.db, { search, limit });
      
      // Calculer et enregistrer le temps d'accès sans cache
      const accessTime = performance.now() - startTime;
      mcpCache.recordAccessTimeWithoutCache(accessTime);
      logger.debug(LogCategory.CACHE, `Database access time for ingredients list: ${accessTime.toFixed(2)}ms`);
      
      // Mettre en cache les résultats avec la durée optimisée pour les ingrédients (24h)
      if (result.success) {
        // Les ingrédients standards sont rarement modifiés, utilisation d'une longue durée de cache
        mcpCache.set(cacheKey, result, CacheGroup.INGREDIENT, CacheDuration.LONG);
        logger.debug(LogCategory.CACHE, `Stored ingredients list in cache for 24 hours`);
      }
      
      return result;
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error getting ingredients list via MCP: ${error}`);
      return {
        success: false,
        error: `Failed to get ingredients list: ${error}`,
        ingredients: []
      };
    }
  }

  /**
   * Met à jour un ingrédient standard via le MCP server
   * @param ingredientId ID de l'ingrédient à mettre à jour
   * @param data Données de l'ingrédient à mettre à jour
   * @returns Résultat de l'opération
   */
  public async updateIngredientViaMCP(
    ingredientId: number,
    data: Partial<typeof schema.ingredientsStandard.$inferSelect>
  ): Promise<UpdateIngredientResult> {
    logger.info(LogCategory.DATABASE, `Updating ingredient ${ingredientId} via MCP`);
    return handleUpdateIngredient(this.db, { ingredientId, data });
  }

  /**
   * Supprime un ingrédient standard via le MCP server
   * @param ingredientId ID de l'ingrédient à supprimer
   * @returns Résultat de l'opération
   */
  public async deleteIngredientViaMCP(
    ingredientId: number
  ): Promise<DeleteIngredientResult> {
    logger.info(LogCategory.DATABASE, `Deleting ingredient ${ingredientId} via MCP`);
    return handleDeleteIngredient(this.db, { ingredientId });
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
  ): Promise<UpdateUserPreferencesResult> {
    return handleUpdateUserPreferences(this.db, { userId, preferences });
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
  ): Promise<CreateNewMealResult> {
    try {
      logger.info(LogCategory.DATABASE, `Creating new meal via MCP`);
      
      const result = await handleCreateNewMeal(this.db, { data, selectedIngredients, totalMacros, creatorId });
      
      // Invalider le cache des repas si l'opération a réussi
      if (result.success) {
        mcpCache.invalidateByPrefix(`meals:list:${creatorId}`);
      }
      
      return result;
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error creating meal via MCP: ${error}`);
      return {
        success: false,
        error: `Failed to create meal: ${error}`
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
  public async addMealToDailyPlanViaMCP(
    dailyPlanId: number,
    mealId: number,
    quantity: number = 10
  ): Promise<AddMealToDailyPlanResult> {
    return handleAddMealToDailyPlan(this.db, { dailyPlanId, mealId, quantity });
  }

  /**
   * Ajoute un plan journalier à un plan nutritionnel existant via le MCP server
   * @param planId ID du plan nutritionnel
   * @param dailyPlanData Données du plan journalier à ajouter
   * @returns Résultat de l'opération
   */
  public async addDailyPlanViaMCP(
    planId: number,
    dailyPlanData: {
      day: string,
      week?: number,
      calories?: number,
      carbs?: number,
      protein?: number,
      fat?: number
    }
  ): Promise<AddDailyPlanResult> {
    return handleAddDailyPlan(this.db, { planId, dailyPlanData });
  }

  /**
   * Retourne la liste des plans pour un utilisateur spécifique
   * @param userId ID de l'utilisateur dont on veut récupérer les plans
   * @returns Liste des plans
   */
  public async getPlansListViaMCP(userId: number) {
    try {
      if (!userId) {
        logger.error(LogCategory.DATABASE, `Missing userId in getPlansListViaMCP`);
        return { success: false, error: 'Missing required userId parameter' };
      }
      
      // Construire une clé de cache standardisée pour la liste des plans de l'utilisateur
      const cacheKey = buildCacheKey(
        CacheGroup.PLAN,     // Groupe de cache pour les plans
        'plansList',         // Type de donnée spécifique
        undefined,           // Pas d'ID spécifique
        userId               // ID de l'utilisateur spécifique
      );
      
      // Récupérer depuis le cache si disponible
      const cachedData = mcpCache.get<any>(cacheKey);
      
      if (cachedData) {
        logger.debug(LogCategory.DATABASE, `Using cached data for plans list for user ${userId}`);
        return cachedData;
      }
      
      logger.info(LogCategory.DATABASE, `Getting plans list via MCP for user ${userId}`);
      
      const result = await handleGetPlansList(this.db, { userId });
      
      // Mettre en cache les résultats avec la durée optimisée pour les plans
      if (result.success) {
        const cacheDuration = getCacheDuration(CacheGroup.PLAN, 'plansList');
        mcpCache.set(cacheKey, result, CacheGroup.PLAN, cacheDuration);
        logger.debug(LogCategory.DATABASE, `Stored plans list in cache for ${cacheDuration/1000} seconds`);
      }
      
      return result;
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error getting plans list via MCP: ${error}`);
      return {
        success: false,
        error: `Failed to get plans list: ${error}`
      };
    }
  }

  /**
   * Crée un nouveau plan nutritionnel via le MCP server
   * @param data Données du plan à créer (formulaire NutritionGoalSchema)
   * @param userId ID de l'utilisateur propriétaire du plan
   * @returns Résultat de l'opération avec l'ID du plan créé
   */
  public async createPlanViaMCP(data: NutritionGoalSchemaFormData, userId: number) {
    return handleCreatePlan(this.db, { data, userId });
  }

  /**
   * Met à jour un plan nutritionnel existant via le MCP server
   * @param planId ID du plan à mettre à jour
   * @param data Données du plan à mettre à jour
   * @returns Résultat de l'opération
   */
  public async updatePlanViaMCP(planId: number, data: Partial<PlanOrmProps>) {
    return handleUpdatePlan(this.db, { planId, data });
  }

  /**
   * Supprime un plan nutritionnel via le MCP server
   * @param planId ID du plan à supprimer
   * @returns Résultat de l'opération
   */
  public async deletePlanViaMCP(planId: number) {
    return handleDeletePlan(this.db, { planId });
  }

  /**
   * Définit un plan comme étant le plan actuel d'un utilisateur
   * @param planId ID du plan à définir comme actuel
   * @param userId ID de l'utilisateur
   * @returns Résultat de l'opération
   */
  public async setCurrentPlanViaMCP(planId: number, userId: number) {
    // Stub - sera implémenté avec les handlers de plans
    return { 
      success: true, 
      error: null 
    };
  }

  /**
   * Récupère le plan actuel d'un utilisateur
   * @param userId ID de l'utilisateur
   * @returns Plan actuel de l'utilisateur ou null si aucun
   */
  public async getCurrentPlanViaMCP(userId: number) {
    // Stub - sera implémenté avec les handlers de plans
    return { 
      success: true, 
      plan: null,
      error: null 
    };
  }

  /**
   * Obtient les détails d'un plan avec ses plans journaliers
   * @param planId ID du plan
   * @param userId ID de l'utilisateur (pour sécuriser l'accès aux données)
   * @returns Détails du plan avec ses plans journaliers
   */
  public async getPlanDetailsViaMCP(planId: number | string, userId: number) {
    if (!userId) {
      logger.error(LogCategory.DATABASE, `Missing userId in getPlanDetailsViaMCP`);
      return { success: false, error: 'Missing required userId parameter' };
    }
    return handleGetPlanDetails(this.db, { planId, userId });
  }

  /**
   * Récupère un plan nutritionnel avec ses plans journaliers (sans les repas)
   * @param planId ID du plan
   * @returns Plan avec ses plans journaliers sans les repas
   */
  public async getPlanWithDailyPlansViaMCP(planId: number) {
    // Stub - sera implémenté avec les handlers de plans
    return { 
      success: true, 
      plan: null, 
      dailyPlans: [],
      error: null 
    };
  }

  /**
   * Retourne la liste des repas, filtrée par cuisine, type et/ou nom
   * @param userId ID de l'utilisateur dont on veut récupérer les repas
   * @param cuisine Type de cuisine (optionnel, non implémenté par le handler)
   * @param mealType Type de repas (optionnel, non implémenté par le handler)
   * @param mealName Nom du repas (optionnel, non implémenté par le handler)
   * @returns Liste des repas correspondant aux critères
   */
  public async getMealsListViaMCP(userId?: number, cuisine?: string, mealType?: string, mealName?: string) {
    try {
      // Construire une clé de cache standardisée pour la liste des repas
      const cacheKey = buildCacheKey(
        CacheGroup.MEAL,     // Groupe de cache pour les repas
        'mealsList',        // Type de donnée spécifique
        undefined,          // Pas d'ID spécifique
        userId || undefined  // ID de l'utilisateur (si fourni)
      );
      
      // Récupérer depuis le cache si disponible
      const cachedData = mcpCache.get<any>(cacheKey);
      
      if (cachedData) {
        logger.debug(LogCategory.DATABASE, `Using cached data for meals list of user ${userId || 'all'}`);
        return cachedData;
      }
      
      logger.info(LogCategory.DATABASE, `Getting meals list for user ${userId || 'all'} via MCP`);
      
      // Mesurer le temps d'accès sans cache
      const startTime = performance.now();
      
      // Note: Le handler actuel ne supporte que userId comme paramètre
      // Les autres paramètres (cuisine, mealType, mealName) ne sont pas encore supportés
      const result = await handleGetMealsList(this.db, { userId: userId || 0 });
      
      // Calculer et enregistrer le temps d'accès sans cache
      const accessTime = performance.now() - startTime;
      mcpCache.recordAccessTimeWithoutCache(accessTime);
      logger.debug(LogCategory.CACHE, `Database access time for meals list: ${accessTime.toFixed(2)}ms`);
      
      // Mettre en cache les résultats avec la durée optimisée pour les repas
      if (result.success) {
        const cacheDuration = getCacheDuration(CacheGroup.MEAL, 'mealsList');
        mcpCache.set(cacheKey, result, CacheGroup.MEAL, cacheDuration);
        logger.debug(LogCategory.CACHE, `Stored meals list in cache for ${cacheDuration/1000} seconds`);
      }
      
      return result;
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error getting meals list via MCP: ${error}`);
      return {
        success: false,
        error: `Failed to get meals list: ${error}`
      };
    }
  }

  /**
   * Retourne les détails d'un repas avec ses ingrédients
   * @param mealId ID du repas
   * @param userId ID de l'utilisateur (pour sécuriser l'accès aux données)
   * @returns Détails du repas avec ses ingrédients
   */
  public async getMealByIdWithIngredientsViaMCP(mealId: number, userId?: number) {
    try {
      // Construire une clé de cache standardisée pour les détails d'un repas
      // Si userId est fourni, inclure l'ID utilisateur dans la clé de cache pour l'isolation des données
      const cacheKey = buildCacheKey(
        CacheGroup.MEAL,      // Groupe de cache pour les repas
        'mealDetails',       // Type de donnée spécifique (détails du repas)
        mealId.toString(),    // ID du repas spécifique
        userId               // ID utilisateur pour isolation des données
      );
      
      // Récupérer depuis le cache si disponible
      const cachedData = mcpCache.get<any>(cacheKey);
      
      if (cachedData) {
        logger.debug(LogCategory.DATABASE, `Using cached data for meal ${mealId} with ingredients`);
        return cachedData;
      }
      
      logger.info(LogCategory.DATABASE, `Getting meal ${mealId} with ingredients via MCP`);
      
      // Mesurer le temps d'accès sans cache
      const startTime = performance.now();
      
      // Passer userId au handler pour garantir l'isolation des donnu00e9es entre utilisateurs
      const result = await handleGetMealDetails(this.db, { mealId, userId });
      
      // Calculer et enregistrer le temps d'accès sans cache
      const accessTime = performance.now() - startTime;
      mcpCache.recordAccessTimeWithoutCache(accessTime);
      logger.debug(LogCategory.CACHE, `Database access time for meal details: ${accessTime.toFixed(2)}ms`);
      
      // Mettre en cache les résultats avec la durée optimisée pour les détails de repas
      if (result.success) {
        const cacheDuration = getCacheDuration(CacheGroup.MEAL, 'mealDetails');
        mcpCache.set(cacheKey, result, CacheGroup.MEAL, cacheDuration);
        logger.debug(LogCategory.CACHE, `Stored meal ${mealId} details in cache for ${cacheDuration/1000} seconds`);
      }
      
      return result;
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error getting meal by id via MCP: ${error}`);
      return {
        success: false,
        error: `Failed to get meal by id: ${error}`
      };
    }
  }

  /**
   * Met à jour un repas via le serveur MCP
   * @param mealId ID du repas à mettre à jour
   * @param data Données du repas à mettre à jour
   * @param ingredients Ingrédients du repas à mettre à jour (optionnel)
   * @returns Résultat de l'opération
   */
  public async updateMealViaMCP(mealId: number, data: Partial<MealOrmProps>, ingredients?: any[]) {
    try {
      logger.info(LogCategory.DATABASE, `Updating meal ${mealId} via MCP`);
      
      // Appeler le handler handleUpdateMeal
      const result = await handleUpdateMeal(this.db, { mealId, data, ingredients });
      
      // Invalider les caches liés à ce repas et toutes les entités qui en dépendent si l'opération a réussi
      if (result.success) {
        // Utiliser l'invalidation en cascade pour propager l'invalidation automatiquement
        // aux entités qui dépendent de ce repas (plans, progrès, etc.)
        mcpCache.invalidateEntityCascade(CacheGroup.MEAL, mealId);
        
        // Invalider également le contexte utilisateur si l'ID créateur est disponible
        if (data.creatorId) {
          mcpCache.invalidateEntity(CacheGroup.USER, data.creatorId);
          // Mesure de performance : le temps avant et après l'invalidation
          logger.info(LogCategory.CACHE, `Cache invalidation for meal update completed`);
        }
      }
      
      return result;
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error updating meal via MCP: ${error}`);
      return {
        success: false,
        error: `Failed to update meal: ${error}`
      };
    }
  }
  
  /**
   * Supprime un repas via le serveur MCP
   * @param mealId ID du repas à supprimer
   * @param userId ID de l'utilisateur
   * @returns Résultat de l'opération
   */
  public async deleteMealViaMCP(mealId: number, userId: number) {
    try {
      logger.info(LogCategory.DATABASE, `Deleting meal ${mealId} via MCP`);
      
      // Appeler le handler handleDeleteMeal
      const result = await handleDeleteMeal(this.db, { mealId });
      
      // Invalider les caches liés à ce repas et toutes les entités qui en dépendent si l'opération a réussi
      if (result.success) {
        // Utiliser l'invalidation en cascade pour propager l'invalidation automatiquement
        // aux entités qui dépendent de ce repas (plans, progress, etc.)
        mcpCache.invalidateEntityCascade(CacheGroup.MEAL, mealId);
        
        // Invalider également le contexte utilisateur
        mcpCache.invalidateEntity(CacheGroup.USER, userId);
        logger.info(LogCategory.CACHE, `Cache invalidation for meal deletion completed`);
      }
      
      return result;
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error deleting meal via MCP: ${error}`);
      return {
        success: false,
        error: `Failed to delete meal: ${error}`
      };
    }
  }

  /**
   * Récupère les détails d'un utilisateur via le MCP server
   * @param userId ID de l'utilisateur
   * @returns Résultat de l'opération avec les détails de l'utilisateur ou une erreur
   */
  public async getUserDetailsViaMCP(
    userId: number
  ): Promise<GetUserDetailsResult> {
    try {
      logger.info(LogCategory.DATABASE, `Getting user details for user ${userId} via MCP`);
      
      // Construire une clé de cache standardisée pour les détails d'un utilisateur
      const cacheKey = buildCacheKey(
        CacheGroup.USER,       // Groupe de cache pour les utilisateurs
        'userDetails',        // Type de donnée spécifique (détails utilisateur)
        userId.toString(),    // ID de l'utilisateur spécifique
        undefined              // Pas d'ID utilisateur spécifique (ici redondant avec l'ID principal)
      );
      
      // Récupérer depuis le cache si disponible
      const cachedData = mcpCache.get<GetUserDetailsResult>(cacheKey);
      
      if (cachedData) {
        logger.debug(LogCategory.DATABASE, `Using cached data for user ${userId} details`);
        return cachedData;
      }
      
      // Appeler le handler handleGetUserDetails
      const startTime = performance.now();
      const result = await handleGetUserDetails(this.db, { userId });
      const endTime = performance.now();
      
      // Enregistrer les métriques de performance
      const accessTime = endTime - startTime;
      logger.debug(
        LogCategory.CACHE, 
        `Database access time for user details: ${accessTime.toFixed(2)}ms`
      );
      
      // Mettre en cache le résultat si l'opération a réussi
      if (result.success) {
        // Obtenir la durée du cache pour les détails utilisateur (normalement moyenne durée)
        const cacheDuration = getCacheDuration(CacheGroup.USER, 'details');
        mcpCache.set(cacheKey, result, CacheGroup.USER, cacheDuration);
      }
      
      return result;
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error getting user details via MCP: ${error}`);
      return {
        success: false,
        error: `Failed to get user details: ${error}`
      };
    }
  }

  /**
   * Crée un nouvel utilisateur via le MCP server
   * @param userData Données de l'utilisateur à créer
   * @returns Résultat de l'opération avec l'ID de l'utilisateur créé ou une erreur
   */
  public async createUserViaMCP(
    userData: Omit<typeof schema.users.$inferSelect, 'id'>
  ): Promise<CreateUserResult> {
    logger.info(LogCategory.DATABASE, `Creating new user via MCP`);
    return handleCreateUser(this.db, { data: userData });
  }

  /**
   * Récupère la progression quotidienne pour une date spécifique via le MCP server
   * @param userId ID de l'utilisateur
   * @param date Date au format YYYY-MM-DD
   * @returns Résultat de l'opération avec la progression quotidienne ou une erreur
   */
  public async getDailyProgressByDateViaMCP(
    userId: number,
    date: string
  ): Promise<GetDailyProgressByDateResult> {
    logger.info(LogCategory.DATABASE, `Getting daily progress for date ${date} via MCP`);
    return handleGetDailyProgressByDate(this.db, { userId, date });
  }

  /**
   * Crée une nouvelle progression quotidienne via le MCP server
   * @param userId ID de l'utilisateur
   * @param date Date au format YYYY-MM-DD
   * @returns Résultat de l'opération avec la progression quotidienne créée ou une erreur
   */
  public async createDailyProgressViaMCP(
    userId: number,
    date: string
  ): Promise<CreateDailyProgressResult> {
    logger.info(LogCategory.DATABASE, `Creating daily progress for date ${date} via MCP`);
    return handleCreateDailyProgress(this.db, { userId, date });
  }

  /**
   * Met à jour une progression quotidienne via le MCP server
   * @param progressId ID de la progression à mettre à jour
   * @param data Données de la progression à mettre à jour
   * @returns Résultat de l'opération avec la progression quotidienne mise à jour ou une erreur
   */
  public async updateDailyProgressViaMCP(
    progressId: number,
    data: Partial<typeof schema.dailyProgress.$inferSelect>
  ): Promise<UpdateDailyProgressResult> {
    logger.info(LogCategory.DATABASE, `Updating daily progress ${progressId} via MCP`);
    return handleUpdateDailyProgress(this.db, { progressId, data });
  }

  /**
   * Récupère les repas avec leur état de progression pour une date spécifique via le MCP server
   * @param userId ID de l'utilisateur
   * @param date Date au format YYYY-MM-DD
   * @returns Résultat de l'opération avec les repas et leur progression ou une erreur
   */
  public async getMealProgressByDateViaMCP(
    userId: number,
    date: string
  ): Promise<GetMealProgressByDateResult> {
    logger.info(LogCategory.DATABASE, `Getting meal progress for date ${date} via MCP`);
    return handleGetMealProgressByDate(this.db, { userId, date });
  }

  /**
   * Marque un repas comme consommé ou non via le MCP server
   * @param dailyProgressId ID de la progression quotidienne
   * @param mealId ID du repas
   * @param dailyPlanMealId ID du repas dans le plan quotidien
   * @param consumed Indique si le repas a été consommé
   * @param pourcentageConsomme Pourcentage du repas consommé (par défaut: 100)
   * @returns Résultat de l'opération avec la progression du repas ou une erreur
   */
  public async markMealAsConsumedViaMCP(
    dailyProgressId: number,
    mealId: number,
    dailyPlanMealId: number,
    consumed: boolean,
    pourcentageConsomme: number = 100
  ): Promise<MarkMealAsConsumedResult> {
    logger.info(LogCategory.DATABASE, `Marking meal ${mealId} as ${consumed ? 'consumed' : 'not consumed'} via MCP`);
    return handleMarkMealAsConsumed(this.db, { dailyProgressId, mealId, dailyPlanMealId, consumed, pourcentageConsomme });
  }

  /**
   * Récupère les progrès pour une progression quotidienne spécifique via le MCP server
   * @param dailyProgressId ID de la progression quotidienne
   * @returns Résultat de l'opération avec les progrès des repas ou une erreur
   */
  public async getMealProgressByDailyProgressViaMCP(
    dailyProgressId: number
  ): Promise<GetMealProgressByDailyProgressResult> {
    logger.info(LogCategory.DATABASE, `Getting meal progress for daily progress ${dailyProgressId} via MCP`);
    return handleGetMealProgressByDailyProgress(this.db, { dailyProgressId });
  }

  /**
   * Vérifie si un utilisateur existe via le MCP server
   * @param userId ID de l'utilisateur à vérifier
   * @returns Résultat de l'opération indiquant si l'utilisateur existe
   */
  public async validateUserExistsViaMCP(
    userId: number
  ): Promise<ValidateUserExistsResult> {
    logger.info(LogCategory.DATABASE, `Validating user existence via MCP: ${userId}`);
    return handleValidateUserExists(this.db, { userId });
  }

  /**
   * Trouve ou crée un utilisateur via le MCP server
   * @param email Email de l'utilisateur
   * @returns Résultat de l'opération avec l'utilisateur trouvé ou créé
   */
  public async findOrCreateUserViaMCP(
    email: string
  ): Promise<{ success: boolean; user?: any; error?: string }> {
    logger.info(LogCategory.DATABASE, `Finding or creating user via MCP: ${email}`);
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      // Vérifier si l'utilisateur existe
      const existingUser = await this.db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
      
      if (existingUser.length > 0) {
        logger.info(LogCategory.DATABASE, `User found: ${email}`);
        return { success: true, user: existingUser[0] };
      }
      
      // Créer un nouvel utilisateur avec des données par défaut
      // Remarque: nous utilisons directement la base de données pour éviter les problèmes de typage
      // avec createUserViaMCP qui attend tous les champs requis
      const userData = {
        email,
        name: email.split('@')[0], // Nom par défaut basé sur l'email
        gender: 'MALE', // Valeur par défaut
        provider: 'EMAIL', // Valeur par défaut
        role: 'USER', // Valeur par défaut
        age: 30, // Valeur par défaut
        weight: 70, // Valeur par défaut
        height: 175, // Valeur par défaut
        physicalActivity: 'MODERATELY_ACTIVE', // Valeur par défaut
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Insérer directement l'utilisateur dans la base de données
      const [insertedUser] = await this.db
        .insert(users)
        .values(userData)
        .returning({ id: users.id });
        
      if (!insertedUser) {
        throw new Error('Failed to create user');
      }
      
      const userId = insertedUser.id;
      
      // Récupérer l'utilisateur nouvellement créé
      const newUser = await this.getUserDetailsViaMCP(userId);
      
      if (!newUser.success) {
        throw new Error(newUser.error);
      }
      
      logger.info(LogCategory.DATABASE, `New user created: ${email}`);
      return { success: true, user: newUser.user };
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error in findOrCreateUserViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }
}

export default SQLiteMCPServer.getInstance();
