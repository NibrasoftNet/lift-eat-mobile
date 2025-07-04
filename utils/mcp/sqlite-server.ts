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
  MealOrmProps,
  scanHistory
} from '@/db/schema';
import { eq, and, like, inArray } from 'drizzle-orm';
import { 
  IaIngredientType,
  IaMealType,
  IaPlanType 
} from '@/utils/validation/ia/ia.schemas';
import { GoalEnum } from '@/utils/enum/user-details.enum';
import { sql } from 'drizzle-orm';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { invalidateCache, DataType } from '@/utils/helpers/queryInvalidation';
import { QueryClient } from '@tanstack/react-query';
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
  handleGetPlanDetails,
  handleGetMealQuantityInPlan,
  handleUpdateMealQuantityInPlan,
  handleSetCurrentPlan,
  handleGetCurrentPlan,
  handleCalculateMealNutrition,
  handleGetDailyPlanNutrition,
} from './handlers/plan-handlers';
import { 
  handleGetMealsList,
  handleGetMealDetails,
  handleCreateMeal,
  handleCreateNewMeal,
  handleAddMealToDailyPlan as handleAddMealToDailyPlanMealHandler,
  handleUpdateMeal,
  handleDeleteMeal
} from './handlers/meal-handlers';
import {
  handleAddIngredient,
  handleGetIngredientsList,
  handleUpdateIngredient,
  handleDeleteIngredient
} from './handlers/ingredient-handlers';
import { 
  handleUpdateUserPreferences, 
  handleGetUserDetails, 
  handleCreateUser, 
  handleValidateUserExists,
  handleGetDefaultUser,
  handleGenerateUserContext,
  handleUpdateUserNutritionPreferences
} from './handlers/user-handlers';
import {
  handleGetDailyProgressByDate,
  handleCreateDailyProgress,
  handleUpdateDailyProgress,
  handleGetMealProgressByDate,
  handleMarkMealAsConsumed,
  handleGetMealProgressByDailyProgress,
  handleGetDailyProgressByPlan
} from './handlers/progress-handlers';

import {
  handleGetUserContext,
  handleGetUserPreferences,
  handleGetUserFavoriteMeals,
  handleGetUserActivePlans,
  handleGetUserActivityHistory,
  handleSaveNutritionAdvice,
  handleUpdateAdviceFeedback,
  handleGetNutritionAdvice,
} from './handlers/ia-handlers';

import { handleRemoveMealFromDailyPlan } from './handlers/plan-handlers-extension';

import {
  handleSaveIngredientSuggestion,
  handleGetIngredientSuggestions,
  handleUpdateIngredientSuggestion,
  handleDeleteIngredientSuggestion
} from './handlers/ingredient-suggestion-handlers';

import {
  handleCalculateNormalizedNutrition,
  handleGetMealWeight,
  handleGetMacroBreakdown
} from './handlers/nutrition-handlers';

import { handleAddScanHistory, handleGetScanHistory, handleClearScanHistory } from './handlers/scan-history-handlers';

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
  AddDailyPlanResult,
  GetMealQuantityInPlanParams,
  GetMealQuantityInPlanResult,
  UpdateMealQuantityInPlanParams,
  UpdateMealQuantityInPlanResult,
  SetCurrentPlanParams,
  SetCurrentPlanResult,
  GetCurrentPlanParams,
  GetCurrentPlanResult,
  GetDailyPlanNutritionParams,
  GetDailyPlanNutritionResult
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
  ValidateUserExistsResult,
  GetDefaultUserParams,
  GetDefaultUserResult,
  GenerateUserContextParams,
  GenerateUserContextResult,
  UpdateUserNutritionPreferencesParams
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
  GetMealProgressByDailyProgressResult,
  GetDailyProgressByPlanParams,
  GetDailyProgressByPlanResult
} from './interfaces/progress-interfaces';

import { 
  GetUserContextParams, 
  GetUserContextResult,
  GetUserPreferencesParams,
  GetUserPreferencesResult,
  GetUserFavoriteMealsParams,
  GetUserFavoriteMealsResult,
  GetUserActivePlansParams,
  GetUserActivePlansResult,
  GetUserActivityHistoryParams,
  GetUserActivityHistoryResult,
  SaveNutritionAdviceParams,
  SaveNutritionAdviceResult,
  UpdateAdviceFeedbackParams,
  UpdateAdviceFeedbackResult,
  GetNutritionAdviceParams,
  GetNutritionAdviceResult,
} from './interfaces/ia-interfaces';

import {
  SaveIngredientSuggestionParams,
  SaveIngredientSuggestionResult,
  GetIngredientSuggestionsParams,
  GetIngredientSuggestionsResult,
  UpdateIngredientSuggestionParams,
  UpdateIngredientSuggestionResult,
  DeleteIngredientSuggestionParams,
  DeleteIngredientSuggestionResult
} from './interfaces/ingredient-suggestion-interfaces';

import {
  CalculateNormalizedNutritionParams,
  NormalizedNutritionResult,
  GetMealWeightParams,
  GetMealWeightResult,
  GetMacroBreakdownParams,
  GetMacroBreakdownResult
} from './interfaces/nutrition-interfaces';

import { AddScanHistoryParams, GetScanHistoryParams } from './interfaces/scan-history-interfaces';

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
    try {
      this.db = drizzle(sqliteDb, { schema });
      logger.info(LogCategory.DATABASE, 'MCP Server database initialized successfully');
      // Vérification rapide que la connexion fonctionne
      return true;
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Failed to initialize MCP Server database: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
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
      logger.info(LogCategory.DATABASE, `Generating user context for user ${userId}`);
      
      // Mesurer le temps d'accès pour les logs de performance
      const startTime = performance.now();
      
      // Appel direct au handler pour générer le contexte
      const result = await handleGetUserContext(this.db, { userId });
      
      // Calculer le temps d'accès pour les logs
      const accessTime = performance.now() - startTime;
      logger.debug(LogCategory.DATABASE, `Database access time for generating user context: ${accessTime.toFixed(2)}ms`);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      // Retourner le contexte directement sans mise en cache
      if (result.context) {
        return result.context;
      }
      
      return "USER CONTEXT: Not available";
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error generating user context: ${error}`);
      return "USER CONTEXT: Not available";
    }
  }

  /**
   * Récupère la liste des repas via le MCP server
   * @param params Paramètres de la requête, incluant userId et les filtres
   * @returns Résultat de l'opération avec la liste des repas
   */
  public async getMealsListViaMCP(params: GetMealsListParams): Promise<GetMealsListResult> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      logger.info(LogCategory.DATABASE, 'Getting meals list via MCP Server', { userId: params.userId, filters: params });
      
      const result = await handleGetMealsList(this.db, params);
      
      if (!result.success) {
        logger.error(LogCategory.DATABASE, `Failed to get meals list: ${result.error}`);
      } else {
        logger.info(LogCategory.DATABASE, `Successfully retrieved ${result.meals?.length} meals`);
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(LogCategory.DATABASE, `Error getting meals list: ${errorMessage}`);
      return { success: false, error: errorMessage };
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
  ): Promise<CreateMealResult> {
    try {
      // Vérifier que la base de données est initialisée
      if (!this.db) {
        throw new Error("Database not initialized");
      }
      
      // Transformer le type IaMealType en type attendu par handleCreateMeal
      const mealData: Omit<MealOrmProps, 'id'> = {
        ...meal,
        creatorId,
        isFavorite: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        image: null,
      };
      
      // Extraire les ingrédients du repas
      const rawIngredients = meal.ingredients || [];
      
      // Préparer les ingrédients avec des IDs valides
      const processedIngredients = [];
      
      // Pour chaque ingrédient généré par l'IA
      for (const ingredient of rawIngredients) {
        if (!ingredient.name) {
          logger.warn(LogCategory.DATABASE, `Skipping ingredient without name`);
          continue;
        }
        
        // Rechercher l'ingrédient par son nom dans la base de données
        const existingIngredient = await this.db
          .select()
          .from(ingredientsStandard)
          .where(eq(ingredientsStandard.name, ingredient.name))
          .limit(1);
        
        if (existingIngredient.length > 0) {
          // Si l'ingrédient existe déjà, utiliser son ID
          logger.info(LogCategory.DATABASE, `Found existing ingredient: ${ingredient.name} (ID: ${existingIngredient[0].id})`);
          processedIngredients.push({
            ...ingredient,
            id: existingIngredient[0].id
          });
        } else {
          // Si l'ingrédient n'existe pas, le créer
          logger.info(LogCategory.DATABASE, `Creating new ingredient: ${ingredient.name}`);
          
          const newIngredient = {
            name: ingredient.name,
            unit: ingredient.unit || "GRAMMES",
            calories: ingredient.calories || 0,
            carbs: ingredient.carbs || 0,
            protein: ingredient.protein || 0,
            fat: ingredient.fat || 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            image: null
          };
          
          const [createdIngredient] = await this.db
            .insert(ingredientsStandard)
            .values(newIngredient)
            .returning({ id: ingredientsStandard.id });
          
          logger.info(LogCategory.DATABASE, `Created new ingredient: ${ingredient.name} (ID: ${createdIngredient.id})`);
          
          processedIngredients.push({
            ...ingredient,
            id: createdIngredient.id
          });
        }
      }
      
      // Appeler handleCreateMeal avec les données du repas et les ingrédients préparés
      logger.info(LogCategory.DATABASE, `Calling handleCreateMeal with ${processedIngredients.length} processed ingredients`);
      return handleCreateMeal(this.db, { 
        data: mealData, 
        userId: creatorId,
        ingredients: processedIngredients
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(LogCategory.DATABASE, `Error in addMealViaMCP: ${errorMessage}`);
      return { success: false, error: errorMessage };
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
   * @param queryClient Client React Query pour l'invalidation du cache (optionnel)
   * @returns Résultat de l'opération avec l'ID de l'ingrédient créé ou une erreur
   */
  public async addIngredientViaMCP(
    ingredientData: IaIngredientType,
    queryClient?: QueryClient
  ): Promise<AddIngredientResult> {
    const startTime = logger.startPerformanceLog('addIngredientViaMCP');
    
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      logger.info(LogCategory.DATABASE, `Adding ingredient "${ingredientData.name}" via MCP Server`);
      
      // Appeler le handler avec les paramètres
      const result = await handleAddIngredient(this.db, {
        ingredientData
      });
      
      // Invalider le cache si l'opération a réussi et que queryClient est fourni
      if (result.success && queryClient && result.ingredientId) {
        logger.info(LogCategory.CACHE, `Invalidating cache after adding ingredient ${result.ingredientId}`);
        await invalidateCache(queryClient, DataType.INGREDIENT, { 
          id: result.ingredientId,
          invalidateRelated: true
        });
      }
      
      logger.endPerformanceLog('addIngredientViaMCP', startTime);
      return result;
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error in addIngredientViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      logger.endPerformanceLog('addIngredientViaMCP', startTime);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
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
    const startTime = logger.startPerformanceLog('getIngredientsListViaMCP');
    
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      logger.info(LogCategory.DATABASE, 'Getting ingredients list via MCP Server', {
        search: search || 'none',
        limit
      });
      
      // Appeler le handler avec les paramètres
      const result = await handleGetIngredientsList(this.db, {
        search,
        limit
      });
      
      logger.endPerformanceLog('getIngredientsListViaMCP', startTime);
      return result;
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error in getIngredientsListViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      logger.endPerformanceLog('getIngredientsListViaMCP', startTime);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        ingredients: []
      };
    }
  }

  /**
   * Met à jour un ingrédient standard via le MCP server
   * @param ingredientId ID de l'ingrédient à mettre à jour
   * @param data Données de l'ingrédient à mettre à jour
   * @param queryClient Client React Query pour l'invalidation du cache (optionnel)
   * @returns Résultat de l'opération
   */
  public async updateIngredientViaMCP(
    ingredientId: number,
    data: Partial<typeof schema.ingredientsStandard.$inferSelect>,
    queryClient?: QueryClient
  ): Promise<UpdateIngredientResult> {
    const startTime = logger.startPerformanceLog('updateIngredientViaMCP');
    
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      logger.info(LogCategory.DATABASE, `Updating ingredient with ID ${ingredientId} via MCP Server`);
      
      // Appeler le handler avec les paramètres
      const result = await handleUpdateIngredient(this.db, {
        ingredientId,
        data
      });
      
      // Invalider le cache si l'opération a réussi et que queryClient est fourni
      if (result.success && queryClient) {
        logger.info(LogCategory.CACHE, `Invalidating cache after updating ingredient ${ingredientId}`);
        await invalidateCache(queryClient, DataType.INGREDIENT, { 
          id: ingredientId,
          invalidateRelated: true
        });
      }
      
      logger.endPerformanceLog('updateIngredientViaMCP', startTime);
      return result;
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error in updateIngredientViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      logger.endPerformanceLog('updateIngredientViaMCP', startTime);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Supprime un ingrédient standard via le MCP server
   * @param ingredientId ID de l'ingrédient à supprimer
   * @param queryClient Client React Query pour l'invalidation du cache (optionnel)
   * @returns Résultat de l'opération
   */
  public async deleteIngredientViaMCP(
    ingredientId: number,
    queryClient?: QueryClient
  ): Promise<DeleteIngredientResult> {
    const startTime = logger.startPerformanceLog('deleteIngredientViaMCP');
    
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      logger.info(LogCategory.DATABASE, `Deleting ingredient with ID ${ingredientId} via MCP Server`);
      
      // Appeler le handler avec les paramètres
      const result = await handleDeleteIngredient(this.db, {
        ingredientId
      });
      
      // Invalider le cache si l'opération a réussi et que queryClient est fourni
      if (result.success && queryClient) {
        logger.info(LogCategory.CACHE, `Invalidating cache after deleting ingredient ${ingredientId}`);
        await invalidateCache(queryClient, DataType.INGREDIENTS_LIST, { 
          invalidateRelated: true
        });
      }
      
      logger.endPerformanceLog('deleteIngredientViaMCP', startTime);
      return result;
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error in deleteIngredientViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      logger.endPerformanceLog('deleteIngredientViaMCP', startTime);
      
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
  ): Promise<UpdateUserPreferencesResult> {
    return handleUpdateUserPreferences(this.db, { userId, preferences });
  }
  
  /**
   * Met à jour les préférences nutritionnelles de l'utilisateur via le MCP server
   * (restrictions alimentaires, allergies, objectifs nutritionnels)
   * @param userId ID de l'utilisateur à mettre à jour
   * @param dietaryRestrictions Liste des restrictions alimentaires
   * @param allergies Liste des allergies
   * @param nutritionGoals Objectifs nutritionnels
   * @returns Résultat de l'opération
   */
  public async updateUserNutritionPreferencesViaMCP(
    userId: number,
    dietaryRestrictions?: string[],
    allergies?: string[],
    nutritionGoals?: {
      goal?: string;
      targetWeight?: number;
      dailyCalories?: number;
      proteinPercentage?: number;
      carbsPercentage?: number;
      fatPercentage?: number;
    }
  ) {
    return handleUpdateUserNutritionPreferences(this.db, { 
      userId, 
      dietaryRestrictions, 
      allergies, 
      nutritionGoals 
    });
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
      
      // Mesurer le temps d'accès pour les logs de performance
      const startTime = performance.now();
      
      // Appel direct au handler
      const result = await handleCreateNewMeal(this.db, { data, selectedIngredients, totalMacros, creatorId });
      
      // Calculer le temps d'accès pour les logs
      const accessTime = performance.now() - startTime;
      logger.debug(LogCategory.DATABASE, `Database access time for creating meal: ${accessTime.toFixed(2)}ms`);
      
      // L'invalidation du cache est désormais gérée par React Query au niveau des composants
      
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
   * @param mealType Type spécifique du repas pour ce plan journalier (optionnel)
   * @returns Résultat de l'opération
   */
  public async addMealToDailyPlanViaMCP(
    dailyPlanId: number,
    mealId: number,
    quantity: number = 10,
    mealType?: MealTypeEnum
  ): Promise<AddMealToDailyPlanResult> {
    const startTime = logger.startPerformanceLog('addMealToDailyPlanViaMCP');
    
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      logger.info(LogCategory.DATABASE, 'Adding meal to daily plan via MCP Server', {
        dailyPlanId, mealId, quantity, mealType
      });
      
      // Appeler le handler avec les paramètres
      const result = await handleAddMealToDailyPlanMealHandler(this.db, {
        dailyPlanId,
        mealId,
        quantity,
        mealType
      });
      
      logger.endPerformanceLog('addMealToDailyPlanViaMCP', startTime);
      return result;
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error in addMealToDailyPlanViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      logger.endPerformanceLog('addMealToDailyPlanViaMCP', startTime);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Récupère la quantité d'un repas dans un plan journalier
   * @param dailyPlanId ID du plan journalier
   * @param mealId ID du repas
   * @returns Résultat de l'opération avec la quantité
   */
  public async getMealQuantityInPlanViaMCP(
    dailyPlanId: number,
    mealId: number
  ): Promise<GetMealQuantityInPlanResult> {
    const startTime = logger.startPerformanceLog('getMealQuantityInPlanViaMCP');
    
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      logger.info(LogCategory.DATABASE, 'Getting meal quantity in plan via MCP Server', {
        dailyPlanId, mealId
      });
      
      // Appeler le handler avec les paramètres
      const result = await handleGetMealQuantityInPlan(this.db, {
        dailyPlanId,
        mealId
      });
      
      logger.endPerformanceLog('getMealQuantityInPlanViaMCP', startTime);
      return result;
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error in getMealQuantityInPlanViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      logger.endPerformanceLog('getMealQuantityInPlanViaMCP', startTime);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Met à jour la quantité d'un repas dans un plan journalier
   * @param dailyPlanId ID du plan journalier
   * @param mealId ID du repas
   * @param newQuantity Nouvelle quantité du repas
   * @returns Résultat de l'opération
   */
  public async updateMealQuantityInPlanViaMCP(
    dailyPlanId: number,
    mealId: number,
    newQuantity: number
  ): Promise<UpdateMealQuantityInPlanResult> {
    const startTime = logger.startPerformanceLog('updateMealQuantityInPlanViaMCP');
    
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      logger.info(LogCategory.DATABASE, 'Updating meal quantity in plan via MCP Server', {
        dailyPlanId, mealId, newQuantity
      });
      
      // Appeler le handler avec les paramètres
      const result = await handleUpdateMealQuantityInPlan(this.db, {
        dailyPlanId,
        mealId,
        newQuantity
      });
      
      logger.endPerformanceLog('updateMealQuantityInPlanViaMCP', startTime);
      return result;
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error in updateMealQuantityInPlanViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      logger.endPerformanceLog('updateMealQuantityInPlanViaMCP', startTime);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Définit un plan comme étant le plan actuel d'un utilisateur
   * @param planId ID du plan à définir comme actuel
   * @param userId ID de l'utilisateur
   * @returns Résultat de l'opération
   */
  public async setCurrentPlanViaMCP(
    planId: number,
    userId: number
  ): Promise<SetCurrentPlanResult> {
    const startTime = logger.startPerformanceLog('setCurrentPlanViaMCP');
    
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      logger.info(LogCategory.DATABASE, 'Setting current plan via MCP Server', {
        planId, userId
      });
      
      // Appeler le handler avec les paramètres
      const result = await handleSetCurrentPlan(this.db, {
        planId,
        userId
      });
      
      logger.endPerformanceLog('setCurrentPlanViaMCP', startTime);
      return result;
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error in setCurrentPlanViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      logger.endPerformanceLog('setCurrentPlanViaMCP', startTime);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Récupère le plan actuel d'un utilisateur
   * @param userId ID de l'utilisateur
   * @returns Résultat de l'opération avec le plan actuel
   */
  public async getCurrentPlanViaMCP(
    userId: number
  ): Promise<GetCurrentPlanResult> {
    const startTime = logger.startPerformanceLog('getCurrentPlanViaMCP');
    
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      logger.info(LogCategory.DATABASE, 'Getting current plan via MCP Server', {
        userId
      });
      
      // Appeler le handler avec les paramètres
      const result = await handleGetCurrentPlan(this.db, {
        userId
      });
      
      logger.endPerformanceLog('getCurrentPlanViaMCP', startTime);
      return result;
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error in getCurrentPlanViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      logger.endPerformanceLog('getCurrentPlanViaMCP', startTime);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
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
      
      logger.info(LogCategory.DATABASE, `Getting plans list via MCP for user ${userId}`);
      
      // Mesurer le temps d'accès pour les logs de performance
      const startTime = performance.now();
      
      // Appel direct au handler
      const result = await handleGetPlansList(this.db, { userId });
      
      // Calculer le temps d'accès pour les logs
      const accessTime = performance.now() - startTime;
      logger.debug(LogCategory.DATABASE, `Database access time for plans list: ${accessTime.toFixed(2)}ms`);
      
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
   * @param userId ID de l'utilisateur propriétaire du plan
   * @returns Résultat de l'opération
   */
  public async updatePlanViaMCP(planId: number, data: Partial<PlanOrmProps>, userId: number): Promise<BasicResult> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      logger.info(LogCategory.DATABASE, `Updating plan ${planId} via MCP Server`);
      
      // Appeler le handler avec les paramètres
      const result = await handleUpdatePlan(this.db, { planId, data, userId });
      
      return result;
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error in updatePlanViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }

  /**
   * Supprime un plan nutritionnel via le MCP server
   * @param planId ID du plan à supprimer
   * @param userId ID de l'utilisateur propriétaire du plan
   * @returns Résultat de l'opération
   */
  public async deletePlanViaMCP(planId: number, userId: number): Promise<DeletePlanResult> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      logger.info(LogCategory.DATABASE, `Deleting plan ${planId} via MCP Server`);
      
      // Appeler le handler avec les paramètres
      const result = await handleDeletePlan(this.db, { planId, userId });
      
      return result;
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error in deletePlanViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
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
   * Retourne les détails d'un repas avec ses ingrédients
   * @param mealId ID du repas
   * @param userId ID de l'utilisateur (pour sécuriser l'accès aux données)
   * @returns Détails du repas avec ses ingrédients
   */
  public async getMealByIdWithIngredientsViaMCP(mealId: number, userId?: number) {
    try {
      logger.info(LogCategory.DATABASE, `Getting meal ${mealId} with ingredients via MCP`);
      
      // Mesurer le temps d'accès pour les logs de performance
      const startTime = performance.now();
      
      // Passer userId au handler pour garantir l'isolation des données entre utilisateurs
      const result = await handleGetMealDetails(this.db, { mealId, userId });
      
      // Calculer le temps d'accès pour les logs
      const accessTime = performance.now() - startTime;
      logger.debug(LogCategory.DATABASE, `Database access time for meal details: ${accessTime.toFixed(2)}ms`);
      
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
   * @param ingredients Ingrédients du repas (optionnel)
   * @param userId ID de l'utilisateur propriétaire du repas
   * @returns Résultat de l'opération
   */
  public async updateMealViaMCP(mealId: number, data: Partial<MealOrmProps>, ingredients?: any[], userId?: number) {
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      // S'assurer que userId est fourni (si non, utiliser le creatorId des données ou lancer une erreur)
      const authenticatedUserId = userId || data.creatorId;
      if (!authenticatedUserId) {
        throw new Error("User ID is required for updating a meal");
      }
      
      logger.info(LogCategory.DATABASE, `Updating meal ${mealId} via MCP Server for user ${authenticatedUserId}`);
      
      // Appeler le handler avec les paramètres
      const result = await handleUpdateMeal(this.db, { 
        mealId, 
        data, 
        ingredients, 
        userId: authenticatedUserId 
      });
      
      return result;
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error in updateMealViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
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
      if (!this.db) throw new Error("Database not initialized");
      
      if (!userId) {
        throw new Error("User ID is required for deleting a meal");
      }
      
      logger.info(LogCategory.DATABASE, `Deleting meal ${mealId} via MCP Server for user ${userId}`);
      
      // Mesurer le temps d'accès pour les logs de performance
      const startTime = performance.now();
      
      // Appeler le handler avec les paramètres
      const result = await handleDeleteMeal(this.db, { mealId, userId });
      
      // Calculer le temps d'accès pour les logs
      const accessTime = performance.now() - startTime;
      logger.debug(LogCategory.DATABASE, `Database access time for deleting meal: ${accessTime.toFixed(2)}ms`);
      
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
      
      // Appeler le handler handleGetUserDetails avec mesure de performance
      const startTime = logger.startPerformanceLog('getUserDetailsViaMCP');
      const result = await handleGetUserDetails(this.db, { userId });
      const endTime = logger.endPerformanceLog('getUserDetailsViaMCP', startTime);
      
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
   * Trouve un utilisateur par email via le MCP server sans le créer s'il n'existe pas
   * @param email Email de l'utilisateur
   * @returns Résultat de l'opération avec l'utilisateur trouvé ou une erreur
   */
  public async findUserByEmailViaMCP(email: string): Promise<{ success: boolean; user?: any; error?: string }> {
    logger.info(LogCategory.DATABASE, `Finding user by email via MCP: ${email}`);
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      // Rechercher l'utilisateur par email
      logger.info(LogCategory.DATABASE, `Searching user by email: ${email}`);
      const existingUser = await this.db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
      
      if (existingUser.length > 0) {
        logger.info(LogCategory.DATABASE, `User found by email: ${email}`);
        return { success: true, user: existingUser[0] };
      }
      
      // Si l'utilisateur n'existe pas, retourner une erreur
      logger.info(LogCategory.DATABASE, `User not found by email: ${email}`);
      return { success: false, error: `User with email ${email} not found` };
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error in findUserByEmailViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }

  /**
   * Trouve ou crée un utilisateur via le MCP server
   * @param email Email de l'utilisateur
   * @returns Résultat de l'opération avec l'utilisateur trouvé ou créé
   */
  public async findOrCreateUserViaMCP(
    email: string,
    clerkId?: string
  ): Promise<{ success: boolean; user?: any; error?: string }> {
    logger.info(LogCategory.DATABASE, `Finding or creating user via MCP: ${email}`);
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      // Vérifier si l'utilisateur existe déjà, d'abord par clerkId si disponible, sinon par email
      let existingUser;
      
      if (clerkId) {
        // Recherche par clerkId (méthode préférée car plus fiable)
        logger.info(LogCategory.DATABASE, `Searching user by clerkId: ${clerkId}`);
        existingUser = await this.db
          .select()
          .from(users)
          .where(eq(users.clerkId, clerkId))
          .limit(1);
          
        if (existingUser.length > 0) {
          logger.info(LogCategory.DATABASE, `User found by clerkId: ${clerkId}`);
          return { success: true, user: existingUser[0] };
        }
      }
      
      // Si l'utilisateur n'a pas été trouvé par clerkId, rechercher par email
      logger.info(LogCategory.DATABASE, `Searching user by email: ${email}`);
      existingUser = await this.db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
      
      if (existingUser.length > 0) {
        logger.info(LogCategory.DATABASE, `User found by email: ${email}`);
        
        // Si l'utilisateur existe par email mais n'a pas encore de clerkId, mettre à jour avec le nouveau clerkId
        if (clerkId && !existingUser[0].clerkId) {
          logger.info(LogCategory.DATABASE, `Updating existing user with clerkId: ${clerkId}`);
          await this.db
            .update(users)
            .set({ clerkId, updatedAt: new Date().toISOString() })
            .where(eq(users.id, existingUser[0].id));
          
          // Récupérer l'utilisateur mis à jour
          const updatedUser = await this.db
            .select()
            .from(users)
            .where(eq(users.id, existingUser[0].id))
            .limit(1);
            
          if (updatedUser.length > 0) {
            return { success: true, user: updatedUser[0] };
          }
        }
        
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
        updatedAt: new Date().toISOString(),
        clerkId: clerkId || null // Inclure l'ID Clerk s'il est disponible
      };
      
      // Log pour debug
      if (clerkId) {
        logger.info(LogCategory.DATABASE, `Creating new user with clerkId: ${clerkId}`);
      } else {
        logger.info(LogCategory.DATABASE, `Creating new user without clerkId`);
      }
      
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

  /**
   * Récupère les progressions quotidiennes associées à un plan via le MCP server
   * @param userId ID de l'utilisateur
   * @param planId ID du plan
   * @returns Résultat de l'opération avec les progressions quotidiennes ou une erreur
   */
  public async getDailyProgressByPlanViaMCP(
    userId: number,
    planId: number
  ): Promise<GetDailyProgressByPlanResult> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      const result = await handleGetDailyProgressByPlan(this.db, { userId, planId });
      return result;
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error in getDailyProgressByPlanViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }

  /**
   * Get a default user or a specific user by ID if provided
   * @param userId Optional user ID to try first
   * @returns Result with the user or error
   */
  public async getDefaultUserViaMCP(userId?: number): Promise<GetDefaultUserResult> {
    const startTime = logger.startPerformanceLog('getDefaultUserViaMCP');
    
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      logger.info(LogCategory.DATABASE, 'Getting default user via MCP Server', { userId });
      
      // Construire les paramètres pour le handler
      const params: GetDefaultUserParams = {};
      if (userId) {
        params.userId = userId;
      }
      
         // Appeler le handler avec les paramètres
         const result = await handleGetDefaultUser(this.db, params);
      
         logger.endPerformanceLog('getDefaultUserViaMCP',startTime);
         return result;
       } catch (error) {
         logger.error(LogCategory.DATABASE, `Error in getDefaultUserViaMCP: ${error instanceof Error ? error.message : String(error)}`);
         logger.endPerformanceLog('getDefaultUserViaMCP',startTime );
         
         return {
           success: false,
           error: error instanceof Error ? error.message : String(error)
         };
    }
  }

  /**
   * Retire un repas d'un plan journalier sans le supprimer de la base de données
   * @param dailyPlanId ID du plan journalier
   * @param mealId ID du repas à retirer
   * @returns Résultat de l'opération
   */
  public async removeMealFromDailyPlanViaMCP(dailyPlanId: number, mealId: number) {
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      logger.info(LogCategory.DATABASE, `Removing meal ${mealId} from daily plan ${dailyPlanId} via MCP Server`);
      
      // Mesurer le temps d'accès pour les logs de performance
      const startTime = performance.now();
      
      // Appeler le handler avec les paramètres
      const result = await handleRemoveMealFromDailyPlan(this.db, { dailyPlanId, mealId });
      
      // Calculer le temps d'accès pour les logs
      const accessTime = performance.now() - startTime;
      logger.debug(LogCategory.DATABASE, `Database access time for removing meal from plan: ${accessTime.toFixed(2)}ms`);
      
      return result;
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error removing meal from plan via MCP: ${error}`);
      return { success: false, error: `Error removing meal from plan: ${error instanceof Error ? error.message : String(error)}` };
    }
  }

  /**
   * Ajoute un plan journalier à un plan nutritionnel existant
   * @param planId ID du plan nutritionnel parent
   * @param dailyPlanData Données du plan journalier à ajouter
   * @returns Résultat de l'opération avec l'ID du plan journalier créé ou une erreur
   */
  public async addDailyPlanViaMCP(
    planId: number,
    dailyPlanData: {
      day: string;
      week?: number;
      calories: number;
      carbs: number;
      protein: number;
      fat: number;
    }
  ): Promise<AddDailyPlanResult> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      logger.info(LogCategory.DATABASE, `Adding daily plan for day ${dailyPlanData.day} to plan ${planId} via MCP Server`);
      
      // Mesurer le temps d'accès pour les logs de performance
      const startTime = performance.now();
      
      // Appeler le handler avec les paramètres
      const params: AddDailyPlanParams = {
        planId,
        dailyPlanData
      };
      
      const result = await handleAddDailyPlan(this.db, params);
      
      // Calculer le temps d'accès pour les logs
      const accessTime = performance.now() - startTime;
      logger.debug(LogCategory.DATABASE, `Database access time for adding daily plan: ${accessTime.toFixed(2)}ms`);
      
      return result;
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error in addDailyPlanViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }

  /**
   * Génère un contexte utilisateur formaté pour l'IA via le MCP server
   * @param userId ID de l'utilisateur
   * @returns Résultat de l'opération avec le contexte utilisateur ou une erreur
   */
  public async generateUserContextViaMCP(userId: number): Promise<string> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      logger.info(LogCategory.DATABASE, `Generating user context for user ${userId} via MCP Server`);
      
      // Mesurer le temps d'accès pour les logs de performance
      const startTime = performance.now();
      
      // Appeler le handler avec les paramètres
      const result = await handleGenerateUserContext(this.db, { userId });
      
      // Calculer le temps d'accès pour les logs
      const accessTime = performance.now() - startTime;
      logger.debug(LogCategory.DATABASE, `Database access time for generating user context: ${accessTime.toFixed(2)}ms`);
      
      if (!result.success) {
        throw new Error(result.error || `Failed to generate context for user ${userId}`);
      }
      
      return result.context || '';
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error in generateUserContextViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      // Retourner un contexte minimal en cas d'erreur pour éviter les erreurs en cascade
      return `USER_ID: ${userId}\nNOTE: Error retrieving complete user context`;
    }
  }

  /**
   * Génère un contexte utilisateur complet pour l'IA via le MCP server
   * @param userId ID de l'utilisateur
   * @returns Résultat de l'opération avec le contexte utilisateur ou une erreur
   */
  public async getUserContextViaMCP(userId: number): Promise<GetUserContextResult> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      logger.info(LogCategory.DATABASE, `Getting user context for user ${userId} via MCP Server`);
      
      // Mesurer le temps d'accès pour les logs de performance
      const startTime = performance.now();
      
      // Appeler le handler avec les paramètres
      const result = await handleGetUserContext(this.db, { userId });
      
      // Calculer le temps d'accès pour les logs
      const accessTime = performance.now() - startTime;
      logger.debug(LogCategory.DATABASE, `Database access time for getting user context: ${accessTime.toFixed(2)}ms`);
      
      return result;
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error in getUserContextViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Récupère les préférences d'un utilisateur via le MCP server
   * @param userId ID de l'utilisateur
   * @returns Résultat de l'opération avec les préférences utilisateur ou une erreur
   */
  public async getUserPreferencesViaMCP(userId: number): Promise<GetUserPreferencesResult> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      logger.info(LogCategory.DATABASE, `Getting user preferences for user ${userId} via MCP Server`);
      
      // Mesurer le temps d'accès pour les logs de performance
      const startTime = performance.now();
      
      // Appeler le handler avec les paramètres
      const result = await handleGetUserPreferences(this.db, { userId });
      
      // Calculer le temps d'accès pour les logs
      const accessTime = performance.now() - startTime;
      logger.debug(LogCategory.DATABASE, `Database access time for getting user preferences: ${accessTime.toFixed(2)}ms`);
      
      return result;
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error in getUserPreferencesViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Retrieves the favorite meals of a user via the MCP server.
   * @param userId The ID of the user whose favorite meals are to be fetched.
   * @returns A promise that resolves to the result of the operation, containing the favorite meals or an error.
   */
  public async getUserFavoriteMealsViaMCP(userId: number): Promise<GetUserFavoriteMealsResult> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      logger.info(LogCategory.DATABASE, `Getting favorite meals for user ${userId} via MCP Server`);
      
      // Mesurer le temps d'accès pour les logs de performance
      const startTime = performance.now();
      
      // Appeler le handler avec les paramètres
      const result = await handleGetUserFavoriteMeals(this.db, { userId });
      
      // Calculer le temps d'accès pour les logs
      const accessTime = performance.now() - startTime;
      logger.debug(LogCategory.DATABASE, `Database access time for getting favorite meals: ${accessTime.toFixed(2)}ms`);
      
      return result;
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error in getUserFavoriteMealsViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Récupère les plans actifs d'un utilisateur via le MCP server
   * @param userId ID de l'utilisateur
   * @returns Résultat de l'opération avec les plans actifs ou une erreur
   */
  public async getUserActivePlansViaMCP(userId: number): Promise<GetUserActivePlansResult> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      logger.info(LogCategory.DATABASE, `Getting active plans for user ${userId} via MCP Server`);
      
      // Mesurer le temps d'accès pour les logs de performance
      const startTime = performance.now();
      
      // Appeler le handler avec les paramètres
      const result = await handleGetUserActivePlans(this.db, { userId });
      
      // Calculer le temps d'accès pour les logs
      const accessTime = performance.now() - startTime;
      logger.debug(LogCategory.DATABASE, `Database access time for getting active plans: ${accessTime.toFixed(2)}ms`);
      
      return result;
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error in getUserActivePlansViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Récupère l'historique d'activité d'un utilisateur via le MCP server
   * @param userId ID de l'utilisateur
   * @param daysLimit Nombre de jours à inclure (par défaut: 7)
   * @returns Résultat de l'opération avec l'historique d'activité ou une erreur
   */
  public async getUserActivityHistoryViaMCP(userId: number, daysLimit: number = 7): Promise<GetUserActivityHistoryResult> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      logger.info(LogCategory.DATABASE, `Getting activity history for user ${userId} via MCP Server`);
      
      // Mesurer le temps d'accès pour les logs de performance
      const startTime = performance.now();
      
      // Appeler le handler avec les paramètres
      const result = await handleGetUserActivityHistory(this.db, { userId, daysLimit });
      
      // Calculer le temps d'accès pour les logs
      const accessTime = performance.now() - startTime;
      logger.debug(LogCategory.DATABASE, `Database access time for getting activity history: ${accessTime.toFixed(2)}ms`);
      
      return result;
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error in getUserActivityHistoryViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Sauvegarde un conseil nutritionnel généré par l'IA
   * @param params Paramètres du conseil à sauvegarder
   * @returns Résultat de l'opération
   */
  public async saveNutritionAdviceViaMCP(params: SaveNutritionAdviceParams): Promise<SaveNutritionAdviceResult> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      logger.info(LogCategory.DATABASE, `Saving nutrition advice for user ${params.userId} via MCP Server`);
      
      // Mesurer le temps d'accès pour les logs de performance
      const startTime = performance.now();
      
      // Appeler le handler avec les paramètres
      const result = await handleSaveNutritionAdvice(this.db, params);
      
      // Calculer le temps d'accès pour les logs
      const accessTime = performance.now() - startTime;
      logger.debug(LogCategory.DATABASE, `Database access time for saving nutrition advice: ${accessTime.toFixed(2)}ms`);
      
      return result;
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error in saveNutritionAdviceViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Met à jour le feedback utilisateur sur un conseil nutritionnel
   * @param params Paramètres de mise à jour
   * @returns Résultat de l'opération
   */
  public async updateAdviceFeedbackViaMCP(params: UpdateAdviceFeedbackParams): Promise<UpdateAdviceFeedbackResult> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      logger.info(LogCategory.DATABASE, `Updating nutrition advice feedback for advice ${params.adviceId} via MCP Server`);
      
      // Mesurer le temps d'accès pour les logs de performance
      const startTime = performance.now();
      
      // Appeler le handler avec les paramètres
      const result = await handleUpdateAdviceFeedback(this.db, params);
      
      // Calculer le temps d'accès pour les logs
      const accessTime = performance.now() - startTime;
      logger.debug(LogCategory.DATABASE, `Database access time for updating advice feedback: ${accessTime.toFixed(2)}ms`);
      
      return result;
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error in updateAdviceFeedbackViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Récupère les conseils nutritionnels pour un utilisateur
   * @param params Paramètres de recherche
   * @returns Liste des conseils nutritionnels
   */
  public async getNutritionAdviceViaMCP(params: GetNutritionAdviceParams): Promise<GetNutritionAdviceResult> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      logger.info(LogCategory.DATABASE, `Getting nutrition advice for user ${params.userId} via MCP Server`);
      
      // Mesurer le temps d'accès pour les logs de performance
      const startTime = performance.now();
      
      // Appeler le handler avec les paramètres
      const result = await handleGetNutritionAdvice(this.db, params);
      
      // Calculer le temps d'accès pour les logs
      const accessTime = performance.now() - startTime;
      logger.debug(LogCategory.DATABASE, `Database access time for getting nutrition advice: ${accessTime.toFixed(2)}ms`);
      
      return result;
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error in getNutritionAdviceViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  async calculateMealNutritionViaMCP(
    mealId: number,
    quantity: number
  ): Promise<{
    success: boolean;
    error?: string;
    nutrition?: {
      calories: number;
      carbs: number;
      fat: number;
      protein: number;
    };
  }> {
    return await handleCalculateMealNutrition(this.db, { mealId, quantity });
  }

  /**
   * Sauvegarde une suggestion d'ingrédient dans la base de données
   * @param params Paramètres pour la sauvegarde d'une suggestion d'ingrédient
   * @returns Résultat de l'opération avec l'ID de la suggestion créée
   */
  public async saveIngredientSuggestionViaMCP(params: SaveIngredientSuggestionParams): Promise<SaveIngredientSuggestionResult> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      logger.info(LogCategory.DATABASE, `Saving ingredient suggestion for "${params.suggestion.name}" via MCP Server`);
      
      const startTime = performance.now();
      const result = await handleSaveIngredientSuggestion(this.db, params);
      const accessTime = performance.now() - startTime;
      
      logger.debug(LogCategory.DATABASE, `Database access time for saving ingredient suggestion: ${accessTime.toFixed(2)}ms`);
      
      return result;
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error in saveIngredientSuggestionViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Récupère les suggestions d'ingrédients pour un utilisateur
   * @param params Paramètres pour la récupération des suggestions d'ingrédients
   * @returns Résultat de l'opération avec la liste des suggestions
   */
  public async getIngredientSuggestionsViaMCP(params: GetIngredientSuggestionsParams): Promise<GetIngredientSuggestionsResult> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      logger.info(LogCategory.DATABASE, `Getting ingredient suggestions for user ${params.userId} via MCP Server`);
      
      const startTime = performance.now();
      const result = await handleGetIngredientSuggestions(this.db, params);
      const accessTime = performance.now() - startTime;
      
      logger.debug(LogCategory.DATABASE, `Database access time for getting ingredient suggestions: ${accessTime.toFixed(2)}ms`);
      
      return result;
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error in getIngredientSuggestionsViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Met à jour une suggestion d'ingrédient
   * @param params Paramètres pour la mise à jour d'une suggestion d'ingrédient
   * @returns Résultat de l'opération
   */
  public async updateIngredientSuggestionViaMCP(params: UpdateIngredientSuggestionParams): Promise<UpdateIngredientSuggestionResult> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      logger.info(LogCategory.DATABASE, `Updating ingredient suggestion ${params.suggestionId} via MCP Server`);
      
      const startTime = performance.now();
      const result = await handleUpdateIngredientSuggestion(this.db, params);
      const accessTime = performance.now() - startTime;
      
      logger.debug(LogCategory.DATABASE, `Database access time for updating ingredient suggestion: ${accessTime.toFixed(2)}ms`);
      
      return result;
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error in updateIngredientSuggestionViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Supprime une suggestion d'ingrédient
   * @param params Paramètres pour la suppression d'une suggestion d'ingrédient
   * @returns Résultat de l'opération
   */
  public async deleteIngredientSuggestionViaMCP(params: DeleteIngredientSuggestionParams): Promise<DeleteIngredientSuggestionResult> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      logger.info(LogCategory.DATABASE, `Deleting ingredient suggestion ${params.suggestionId} via MCP Server`);
      
      const startTime = performance.now();
      const result = await handleDeleteIngredientSuggestion(this.db, params);
      const accessTime = performance.now() - startTime;
      
      logger.debug(LogCategory.DATABASE, `Database access time for deleting ingredient suggestion: ${accessTime.toFixed(2)}ms`);
      
      return result;
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error in deleteIngredientSuggestionViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Calcule les valeurs nutritionnelles normalisées à 100g pour un repas
   * @param params Paramètres pour le calcul nutritionnel
   * @returns Résultat avec les valeurs nutritionnelles normalisées et le facteur d'ajustement
   */
  public async calculateNormalizedNutritionViaMCP(params: CalculateNormalizedNutritionParams): Promise<NormalizedNutritionResult> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      logger.info(LogCategory.NUTRITION, `Calculating normalized nutrition for meal ${params.mealId} via MCP Server`);
      
      const startTime = performance.now();
      const result = await handleCalculateNormalizedNutrition(this.db, params);
      const accessTime = performance.now() - startTime;
      
      logger.debug(LogCategory.NUTRITION, `Calculation time for normalized nutrition: ${accessTime.toFixed(2)}ms`);
      
      return result;
    } catch (error) {
      logger.error(LogCategory.NUTRITION, `Error in calculateNormalizedNutritionViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Obtient le poids total d'un repas basé sur ses ingrédients
   * @param params Paramètres pour la requête
   * @returns Résultat avec le poids total du repas
   */
  public async getMealWeightViaMCP(params: GetMealWeightParams): Promise<GetMealWeightResult> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      logger.info(LogCategory.NUTRITION, `Getting meal weight for meal ${params.mealId} via MCP Server`);
      
      const startTime = performance.now();
      const result = await handleGetMealWeight(this.db, params);
      const accessTime = performance.now() - startTime;
      
      logger.debug(LogCategory.NUTRITION, `Calculation time for meal weight: ${accessTime.toFixed(2)}ms`);
      
      return result;
    } catch (error) {
      logger.error(LogCategory.NUTRITION, `Error in getMealWeightViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Calcule la répartition des macronutriments d'un repas
   * @param params Paramètres pour le calcul
   * @returns Résultat avec la répartition des macronutriments
   */
  public async getMacroBreakdownViaMCP(params: GetMacroBreakdownParams): Promise<GetMacroBreakdownResult> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      logger.info(LogCategory.NUTRITION, `Getting macro breakdown for meal ${params.mealId} via MCP Server`);
      
      const startTime = performance.now();
      const result = await handleGetMacroBreakdown(this.db, params);
      const accessTime = performance.now() - startTime;
      
      logger.debug(LogCategory.NUTRITION, `Calculation time for macro breakdown: ${accessTime.toFixed(2)}ms`);
      
      return result;
    } catch (error) {
      logger.error(LogCategory.NUTRITION, `Error in getMacroBreakdownViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }

  /**
   * Calcule les valeurs nutritionnelles d'un plan journalier
   * @param params Paramètres contenant l'ID du plan journalier et l'ID de l'utilisateur
   * @returns Résultat avec les valeurs nutritionnelles calculées
   */
  public async getDailyPlanNutritionViaMCP(params: GetDailyPlanNutritionParams): Promise<GetDailyPlanNutritionResult> {
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      logger.info(LogCategory.NUTRITION, `Getting nutrition for daily plan ${params.dailyPlanId} for user ${params.userId} via MCP Server`);
      
      const startTime = performance.now();
      const result = await handleGetDailyPlanNutrition(this.db, params);
      const accessTime = performance.now() - startTime;
      
      logger.debug(LogCategory.NUTRITION, `Calculation time for daily plan nutrition: ${accessTime.toFixed(2)}ms`);
      
      return result;
    } catch (error) {
      logger.error(LogCategory.NUTRITION, `Error in getDailyPlanNutritionViaMCP: ${error instanceof Error ? error.message : String(error)}`);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }

  /**
   * Expose the underlying Drizzle DB instance (read/write)
   * À utiliser uniquement dans les services core via l'instance singleton.
   */
  public getDb() {
    return this.db;
  }

  /**
   * ---------- Scan History ----------
   */
  public async addScanHistoryViaMCP(params: AddScanHistoryParams) {
    return handleAddScanHistory(this.db, params);
  }

  public async getScanHistoryViaMCP(params: GetScanHistoryParams) {
    return handleGetScanHistory(this.db, params);
  }

  public async clearScanHistoryViaMCP(userId: number) {
    try {
      const result = await this.db.delete(scanHistory).where(eq(scanHistory.userId, userId));
      return { success: true };
    } catch (error) {
      logger.error(LogCategory.DATABASE, 'Failed to clear scan history', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

export default SQLiteMCPServer.getInstance();
