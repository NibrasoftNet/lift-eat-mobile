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
import { eq, inArray, and } from 'drizzle-orm';
import { NutritionGoalSchemaFormData } from '../validation/plan/nutrition-goal.validation';
import {
  DayUnitArray,
  DailyPlanGeneratedWithEnum,
  PlanGeneratedWithEnum,
} from '../enum/general.enum';
import { WeightUnitEnum } from '../enum/user-details.enum';
import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import useSessionStore from '@/utils/store/sessionStore'; 

/**
 * Ru00e9cupu00e8re une liste de plans nutritionnels
 * @deprecated Utilisez directement sqliteMCPServer.getPlansListViaMCP pour une meilleure centralisation
 */
export const getPlansList = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  userId?: number,
) => {
  const startTime = logger.startPerformanceLog('getPlansList');
  try {
    logger.info(LogCategory.DATABASE, 'Fetching plans list via MCP Server');

    // Utiliser l'ID utilisateur fourni ou celui de la session
    let authenticatedUserId = userId;
    
    // Si aucun ID n'est fourni, essayer de ru00e9cupu00e9rer l'ID de l'utilisateur authentifiu00e9
    if (!authenticatedUserId) {
      const { user } = useSessionStore.getState();
      authenticatedUserId = user?.id;
      
      // Fallback u00e0 l'ancienne mu00e9thode si aucun utilisateur n'est trouvu00e9 dans la session
      if (!authenticatedUserId) {
        logger.warn(LogCategory.DATABASE, 'No user found in session, falling back to first user in DB');
        const users = await drizzleDb.select({ id: schema.users.id }).from(schema.users).limit(1);
        if (users.length === 0) {
          throw new Error('No users found in the database');
        }
        authenticatedUserId = users[0].id;
      }
    }

    // Utiliser le serveur MCP au lieu d'accu00e9der directement u00e0 la base de donnu00e9es
    const result = await sqliteMCPServer.getPlansListViaMCP(authenticatedUserId);

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch plans list via MCP Server');
    }

    if (!result.plans) {
      logger.warn(LogCategory.DATABASE, 'No plans returned from MCP Server');
      return [];
    }

    logger.debug(LogCategory.DATABASE, 'Plans list fetched via MCP Server', {
      count: result.plans.length,
    });
    
    return result.plans;
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Failed to fetch plans list', { error });
    throw error;
  } finally {
    logger.endPerformanceLog('getPlansList', startTime);
  }
};

/**
 * Ru00e9cupu00e8re les du00e9tails d'un plan nutritionnel avec ses plans journaliers
 * @deprecated Utilisez directement sqliteMCPServer.getPlanDetailsViaMCP pour une meilleure centralisation
 */
export const getPlanDetails = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  planId: string,
  userId?: number,
) => {
  const startTime = logger.startPerformanceLog('getPlanDetails');
  try {
    logger.info(LogCategory.DATABASE, `Fetching plan details for plan ${planId} via MCP Server`);

    // Utiliser l'ID utilisateur fourni ou celui de la session
    let authenticatedUserId = userId;
    
    // Si aucun ID n'est fourni, essayer de ru00e9cupu00e9rer l'ID de l'utilisateur authentifiu00e9
    if (!authenticatedUserId) {
      const { user } = useSessionStore.getState();
      authenticatedUserId = user?.id;
      
      // Fallback u00e0 l'ancienne mu00e9thode si aucun utilisateur n'est trouvu00e9 dans la session
      if (!authenticatedUserId) {
        logger.warn(LogCategory.DATABASE, 'No user found in session, falling back to first user in DB');
        const users = await drizzleDb.select({ id: schema.users.id }).from(schema.users).limit(1);
        if (users.length === 0) {
          throw new Error('No users found in the database');
        }
        authenticatedUserId = users[0].id;
      }
    }

    // Utiliser le serveur MCP au lieu d'accu00e9der directement u00e0 la base de donnu00e9es
    const result = await sqliteMCPServer.getPlanDetailsViaMCP(planId, authenticatedUserId);

    if (!result.success) {
      throw new Error(result.error || `Failed to fetch plan details for plan ${planId} via MCP Server`);
    }
    
    if (!result.plan) {
      logger.warn(LogCategory.DATABASE, 'No plan found with the given ID', { planId });
      return null;
    }

    logger.debug(LogCategory.DATABASE, 'Plan details fetched via MCP Server', {
      planId,
      dailyPlansCount: result.dailyPlans?.length || 0,
    });
    
    return {
      ...result.plan,
      dailyPlans: result.dailyPlans || []
    };
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Failed to fetch plan details', { planId, error });
    throw error;
  } finally {
    logger.endPerformanceLog('getPlanDetails', startTime);
  }
};

/**
 * Ru00e9cupu00e8re un plan nutritionnel avec ses plans journaliers (sans les repas)
 * @deprecated Utilisez directement sqliteMCPServer.getPlanWithDailyPlansViaMCP pour une meilleure centralisation
 */
export const getPlanWithDailyPlans = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  planId: number,
) => {
  const startTime = logger.startPerformanceLog('getPlanWithDailyPlans');
  try {
    logger.info(LogCategory.DATABASE, 'Fetching plan with daily plans via MCP Server', { planId });

    // Utiliser le serveur MCP au lieu d'accu00e9der directement u00e0 la base de donnu00e9es
    const result = await sqliteMCPServer.getPlanWithDailyPlansViaMCP(planId);

    if (!result.success) {
      throw new Error(result.error || `Failed to fetch plan with daily plans for plan ${planId} via MCP Server`);
    }
    
    if (!result.plan) {
      logger.warn(LogCategory.DATABASE, 'No plan found with the given ID', { planId });
      return { plan: null, dailyPlans: [] };
    }

    logger.debug(LogCategory.DATABASE, 'Plan with daily plans fetched via MCP Server', {
      planId,
      dailyPlansCount: result.dailyPlans?.length || 0,
    });
    
    return {
      plan: result.plan,
      dailyPlans: result.dailyPlans || []
    };
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Failed to fetch plan with daily plans', { planId, error });
    throw error;
  } finally {
    logger.endPerformanceLog('getPlanWithDailyPlans', startTime);
  }
};

/**
 * Cru00e9e un nouveau plan nutritionnel avec ses plans journaliers
 * @deprecated Utilisez directement sqliteMCPServer.createPlanViaMCP pour une meilleure centralisation
 */
export const createPlan = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  data: NutritionGoalSchemaFormData,
  userId: number,
): Promise<number> => {
  const startTime = logger.startPerformanceLog('createPlan');
  try {
    logger.info(LogCategory.DATABASE, 'Creating plan via MCP Server', { userId });

    // Utiliser le serveur MCP au lieu d'accu00e9der directement u00e0 la base de donnu00e9es
    const result = await sqliteMCPServer.createPlanViaMCP(data, userId);

    if (!result.success) {
      throw new Error(result.error || `Failed to create plan via MCP Server`);
    }

    if (!result.planId) {
      throw new Error('No plan ID returned from the server');
    }

    logger.debug(LogCategory.DATABASE, 'Plan created via MCP Server', {
      planId: result.planId,
    });
    
    return result.planId;
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Failed to create plan', { error });
    throw error;
  } finally {
    logger.endPerformanceLog('createPlan', startTime);
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
    console.log('Creating daily plans for plan:', { planId, durationWeeks });
    
    // Generate daily plans for each day of each week
    for (let week = 1; week <= durationWeeks; week++) {
      for (const day of DayUnitArray) {
        await drizzleDb.insert(dailyPlan).values({
          planId,
          day,
          week,
          calories: 0,
          carbs: 0,
          fat: 0,
          protein: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }
    
    console.log(`Created ${7 * durationWeeks} daily plans for plan ${planId}`);
  } catch (error) {
    console.error('Error creating daily plans:', error);
    throw new Error('Failed to create daily plans');
  }
};

/**
 * Met u00e0 jour un plan nutritionnel existant
 * @deprecated Utilisez directement sqliteMCPServer.updatePlanViaMCP pour une meilleure centralisation
 */
export const updatePlan = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  planId: number,
  data: Partial<PlanOrmProps>,
): Promise<void> => {
  const startTime = logger.startPerformanceLog('updatePlan');
  try {
    logger.info(LogCategory.DATABASE, 'Updating plan via MCP Server', { planId });

    // Utiliser le serveur MCP au lieu d'accu00e9der directement u00e0 la base de donnu00e9es
    const result = await sqliteMCPServer.updatePlanViaMCP(planId, data);

    if (!result.success) {
      throw new Error(result.error || `Failed to update plan ${planId} via MCP Server`);
    }

    logger.debug(LogCategory.DATABASE, 'Plan updated via MCP Server', { planId });
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Failed to update plan', { planId, error });
    throw error;
  } finally {
    logger.endPerformanceLog('updatePlan', startTime);
  }
};

/**
 * Supprime un plan nutritionnel et toutes les donnu00e9es associu00e9es
 * @deprecated Utilisez directement sqliteMCPServer.deletePlanViaMCP pour une meilleure centralisation
 */
export const deletePlan = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  planId: number,
): Promise<void> => {
  const startTime = logger.startPerformanceLog('deletePlan');
  try {
    logger.info(LogCategory.DATABASE, 'Deleting plan via MCP Server', { planId });

    // Utiliser le serveur MCP au lieu d'accu00e9der directement u00e0 la base de donnu00e9es
    const result = await sqliteMCPServer.deletePlanViaMCP(planId);

    if (!result.success) {
      throw new Error(result.error || `Failed to delete plan ${planId} via MCP Server`);
    }

    logger.debug(LogCategory.DATABASE, 'Plan deleted via MCP Server', { planId });
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Failed to delete plan', { planId, error });
    throw error;
  } finally {
    logger.endPerformanceLog('deletePlan', startTime);
  }
};

/**
 * Add a meal to a daily plan
 * @deprecated Utilisez directement sqliteMCPServer.addMealToDailyPlanViaMCP pour une meilleure centralisation
 * @returns Object with success flag and error message if applicable
 */
export const addMealToDailyPlan = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  dailyPlanId: number,
  mealId: number,
  quantity: number = 10, // Default to 10 grams
): Promise<{ success: boolean; error?: string }> => {
  const startTime = logger.startPerformanceLog('addMealToDailyPlan');
  try {
    logger.info(LogCategory.DATABASE, 'Adding meal to daily plan via MCP Server', {
      dailyPlanId, mealId, quantity
    });

    // Utiliser le serveur MCP pour ajouter le repas au plan journalier
    const result = await sqliteMCPServer.addMealToDailyPlanViaMCP(dailyPlanId, mealId, quantity);
    
    logger.endPerformanceLog('addMealToDailyPlan', startTime);
    return result; // Renvoyer directement le résultat du MCP server
    
  } catch (error) {
    logger.error(LogCategory.DATABASE, `Error in addMealToDailyPlan: ${error instanceof Error ? error.message : String(error)}`);
    logger.endPerformanceLog('addMealToDailyPlan', startTime);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
};

/**
 * Get the current quantity of a meal in a daily plan
 * @deprecated Utilisez directement sqliteMCPServer.getMealQuantityInPlanViaMCP pour une meilleure centralisation
 */
export const getMealQuantityInPlan = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  dailyPlanId: number,
  mealId: number,
): Promise<number> => {
  const startTime = logger.startPerformanceLog('getMealQuantityInPlan');
  try {
    logger.info(LogCategory.DATABASE, 'Getting meal quantity in plan via MCP Server', {
      dailyPlanId, mealId
    });

    // Utiliser le serveur MCP pour ru00e9cupu00e9rer la quantitu00e9 du repas dans le plan
    const result = await sqliteMCPServer.getMealQuantityInPlanViaMCP(dailyPlanId, mealId);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to get meal quantity in plan');
    }
    
    if (result.quantity === undefined) {
      throw new Error('Meal is not in this daily plan');
    }
    
    logger.endPerformanceLog('getMealQuantityInPlan', startTime);
    return result.quantity;
  } catch (error) {
    logger.error(LogCategory.DATABASE, `Error in getMealQuantityInPlan: ${error instanceof Error ? error.message : String(error)}`);
    logger.endPerformanceLog('getMealQuantityInPlan', startTime);
    throw error;
  }
};

/**
 * Update the quantity of a meal in a daily plan
 * @deprecated Utilisez directement sqliteMCPServer.updateMealQuantityInPlanViaMCP pour une meilleure centralisation
 */
export const updateMealQuantityInPlan = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  dailyPlanId: number,
  mealId: number,
  newQuantity: number,
): Promise<void> => {
  const startTime = logger.startPerformanceLog('updateMealQuantityInPlan');
  try {
    logger.info(LogCategory.DATABASE, 'Updating meal quantity in plan via MCP Server', {
      dailyPlanId, mealId, newQuantity
    });

    // Utiliser le serveur MCP pour mettre u00e0 jour la quantitu00e9 du repas dans le plan
    const result = await sqliteMCPServer.updateMealQuantityInPlanViaMCP(dailyPlanId, mealId, newQuantity);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to update meal quantity in plan');
    }
    
    logger.endPerformanceLog('updateMealQuantityInPlan', startTime);
  } catch (error) {
    logger.error(LogCategory.DATABASE, `Error in updateMealQuantityInPlan: ${error instanceof Error ? error.message : String(error)}`);
    logger.endPerformanceLog('updateMealQuantityInPlan', startTime);
    throw error;
  }
};

/**
 * Du00e9finit un plan comme u00e9tant le plan actuel d'un utilisateur
 * Cette action du00e9finit tous les autres plans de cet utilisateur comme non-actuel (current=false)
 * @deprecated Utilisez directement sqliteMCPServer.setCurrentPlanViaMCP pour une meilleure centralisation
 */
export const setCurrentPlan = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  planId: number,
  userId: number,
): Promise<void> => {
  const startTime = logger.startPerformanceLog('setCurrentPlan');
  try {
    logger.info(LogCategory.DATABASE, 'Setting current plan via MCP Server', { planId, userId });

    // Utiliser le serveur MCP au lieu d'accu00e9der directement u00e0 la base de donnu00e9es
    const result = await sqliteMCPServer.setCurrentPlanViaMCP(planId, userId);

    if (!result.success) {
      throw new Error(result.error || `Failed to set plan ${planId} as current via MCP Server`);
    }

    logger.debug(LogCategory.DATABASE, 'Plan set as current via MCP Server', { planId, userId });
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Failed to set current plan', { planId, userId, error });
    throw error;
  } finally {
    logger.endPerformanceLog('setCurrentPlan', startTime);
  }
};

/**
 * Ru00e9cupu00e8re le plan actuel d'un utilisateur
 * @deprecated Utilisez directement sqliteMCPServer.getCurrentPlanViaMCP pour une meilleure centralisation
 */
export const getCurrentPlan = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  userId: number,
) => {
  const startTime = logger.startPerformanceLog('getCurrentPlan');
  try {
    logger.info(LogCategory.DATABASE, 'Getting current plan via MCP Server', { userId });

    // Utiliser le serveur MCP au lieu d'accu00e9der directement u00e0 la base de donnu00e9es
    const result = await sqliteMCPServer.getCurrentPlanViaMCP(userId);

    if (!result.success) {
      throw new Error(result.error || `Failed to get current plan for user ${userId} via MCP Server`);
    }

    logger.debug(LogCategory.DATABASE, 'Current plan fetched via MCP Server', { 
      userId, 
      hasPlan: !!result.plan 
    });
    
    return result.plan;
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Failed to get current plan', { userId, error });
    throw error;
  } finally {
    logger.endPerformanceLog('getCurrentPlan', startTime);
  }
};
