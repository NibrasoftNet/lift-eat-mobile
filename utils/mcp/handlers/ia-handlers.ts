import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';
import { and, eq, inArray, like } from 'drizzle-orm';
import { users, meals, plan, dailyMealProgress, MealOrmProps } from '@/db/schema';
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
  GetUserActivityHistoryResult
} from '../interfaces/ia-interfaces';
import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

/**
 * Handler pour récupérer le contexte complet d'un utilisateur pour l'IA
 */
export async function handleGetUserContext(
  db: ExpoSQLiteDatabase<typeof schema>,
  params: GetUserContextParams
): Promise<GetUserContextResult> {
  const startTime = logger.startPerformanceLog('handleGetUserContext');
  try {
    logger.info(LogCategory.DATABASE, 'Generating user context via MCP Handler', { userId: params.userId });
    
    // Récupérer les informations utilisateur
    const user = await db.select().from(users).where(eq(users.id, params.userId)).get();
    if (!user) {
      logger.warn(LogCategory.DATABASE, 'User not found for context generation', { userId: params.userId });
      return { success: false, error: 'User not found' };
    }
    
    // Récupérer les repas favoris - note: comme isFavorite n'existe pas, nous prenons simplement les repas créés par l'utilisateur
    const userMeals = await db
      .select()
      .from(meals)
      .where(eq(meals.creatorId, params.userId))
      .all();
    
    // Récupérer le plan actif
    const userPlans = await db
      .select()
      .from(plan)
      .where(eq(plan.userId, params.userId))
      .all();
    
    const currentPlan = userPlans.find(p => p.current === true);
    
    // Construire le contexte
    let context = "USER CONTEXT:\n\n";
    
    // Informations de base
    context += "Basic Information:\n";
    context += `- Email: ${user.email}\n`;
    context += `- Gender: ${user.gender || 'Unknown'}\n`;
    context += `- Age: ${user.age || 'Unknown'}\n`;
    context += `- Weight: ${user.weight || 'Unknown'} ${user.weightUnit || ''}\n`;
    context += `- Height: ${user.height || 'Unknown'} ${user.heightUnit || ''}\n`;
    context += `- Physical Activity Level: ${user.physicalActivity || 'Unknown'}\n`;
    
    // Objectifs nutritionnels - À adapter selon le schéma réel
    context += "\nNutritional Targets:\n";
    context += `- Score: ${user.score || 'Not set'}\n`;
    
    // Repas de l'utilisateur
    if (userMeals.length > 0) {
      context += "\nUser Meals:\n";
      userMeals.slice(0, 5).forEach(meal => {
        context += `- ${meal.name} (${meal.type})\n`;
      });
      if (userMeals.length > 5) {
        context += `... and ${userMeals.length - 5} more meals\n`;
      }
    } else {
      context += "\nNo meals found\n";
    }
    
    // Plans nutritionnels
    if (userPlans.length > 0) {
      context += "\nNutrition Plans:\n";
      userPlans.forEach(p => {
        const isCurrent = p.id === (currentPlan?.id || null);
        context += `- ${p.name}${isCurrent ? ' (Current)' : ''}\n`;
      });
    } else {
      context += "\nNo nutrition plans found\n";
    }
    
    logger.info(LogCategory.DATABASE, 'User context generated successfully', { userId: params.userId });
    return { success: true, context };
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Error generating user context', { 
      userId: params.userId, 
      error: error instanceof Error ? error.message : String(error) 
    });
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error generating user context' 
    };
  } finally {
    logger.endPerformanceLog('handleGetUserContext', startTime);
  }
}

/**
 * Handler pour récupérer les préférences d'un utilisateur
 */
export async function handleGetUserPreferences(
  db: ExpoSQLiteDatabase<typeof schema>,
  params: GetUserPreferencesParams
): Promise<GetUserPreferencesResult> {
  const startTime = logger.startPerformanceLog('handleGetUserPreferences');
  try {
    logger.info(LogCategory.DATABASE, 'Fetching user preferences via MCP Handler', { userId: params.userId });
    
    const user = await db.select().from(users).where(eq(users.id, params.userId)).get();
    
    if (!user) {
      logger.warn(LogCategory.DATABASE, 'No preferences found for user', { userId: params.userId });
      return { success: false, error: 'User preferences not found' };
    }
    
    return { 
      success: true, 
      preferences: {
        gender: user.gender,
        age: user.age,
        weight: user.weight,
        weightUnit: user.weightUnit,
        height: user.height,
        heightUnit: user.heightUnit,
        physicalActivity: user.physicalActivity,
        // Les autres champs n'existent pas dans le schéma actuel
        // À adapter en fonction des besoins réels
      }
    };
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Error fetching user preferences', { 
      userId: params.userId, 
      error: error instanceof Error ? error.message : String(error) 
    });
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error fetching user preferences' 
    };
  } finally {
    logger.endPerformanceLog('handleGetUserPreferences', startTime);
  }
}

/**
 * Handler pour récupérer les repas favoris d'un utilisateur
 */
export async function handleGetUserFavoriteMeals(
  db: ExpoSQLiteDatabase<typeof schema>,
  params: GetUserFavoriteMealsParams
): Promise<GetUserFavoriteMealsResult> {
  const startTime = logger.startPerformanceLog('handleGetUserFavoriteMeals');
  try {
    logger.info(LogCategory.DATABASE, 'Fetching user meals via MCP Handler', { userId: params.userId });
    
    const userMeals = await db
      .select()
      .from(meals)
      .where(eq(meals.creatorId, params.userId))
      .all();
    
    return { 
      success: true, 
      favoriteMeals: userMeals.map(meal => ({
        id: meal.id,
        name: meal.name,
        type: meal.type,
        cuisine: meal.cuisine
      }))
    };
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Error fetching user meals', { 
      userId: params.userId, 
      error: error instanceof Error ? error.message : String(error) 
    });
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error fetching meals' 
    };
  } finally {
    logger.endPerformanceLog('handleGetUserFavoriteMeals', startTime);
  }
}

/**
 * Handler pour récupérer les plans actifs d'un utilisateur
 */
export async function handleGetUserActivePlans(
  db: ExpoSQLiteDatabase<typeof schema>,
  params: GetUserActivePlansParams
): Promise<GetUserActivePlansResult> {
  const startTime = logger.startPerformanceLog('handleGetUserActivePlans');
  try {
    logger.info(LogCategory.DATABASE, 'Fetching user active plans via MCP Handler', { userId: params.userId });
    
    const userPlans = await db
      .select()
      .from(plan)
      .where(eq(plan.userId, params.userId))
      .all();
    
    if (userPlans.length === 0) {
      logger.info(LogCategory.DATABASE, 'No plans found for user', { userId: params.userId });
      return { success: true, activePlans: [] };
    }
    
    const currentPlan = userPlans.find(p => p.current === true);
    
    return { 
      success: true, 
      activePlans: userPlans.map(p => ({
        id: p.id,
        name: p.name,
        description: p.goal || '',  // Utiliser goal au lieu de description qui n'existe pas
        isCurrent: p.current === true
      }))
    };
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Error fetching user active plans', { 
      userId: params.userId, 
      error: error instanceof Error ? error.message : String(error) 
    });
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error fetching active plans' 
    };
  } finally {
    logger.endPerformanceLog('handleGetUserActivePlans', startTime);
  }
}

/**
 * Handler pour récupérer l'historique d'activité d'un utilisateur
 */
export async function handleGetUserActivityHistory(
  db: ExpoSQLiteDatabase<typeof schema>,
  params: GetUserActivityHistoryParams
): Promise<GetUserActivityHistoryResult> {
  const startTime = logger.startPerformanceLog('handleGetUserActivityHistory');
  try {
    logger.info(LogCategory.DATABASE, 'Fetching user activity history via MCP Handler', { 
      userId: params.userId,
      daysLimit: params.daysLimit || 7
    });
    
    // Calculer la date limite (par défaut 7 jours)
    const daysLimit = params.daysLimit || 7;
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - daysLimit);
    const dateLimitStr = dateLimit.toISOString().split('T')[0];
    
    // Récupérer les progrès de repas dans la période
    // Note: Cette section devrait être adaptée pour utiliser la table correcte
    // qui stocke les repas consommés
    const activityHistory = Array.from({ length: daysLimit }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      return {
        date: dateStr,
        consumedMeals: 0,
        totalCalories: 0,
        calorieTarget: 0  // À adapter selon les données disponibles
      };
    }).sort((a, b) => b.date.localeCompare(a.date));
    
    return { 
      success: true, 
      activityHistory
    };
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Error fetching user activity history', { 
      userId: params.userId, 
      error: error instanceof Error ? error.message : String(error) 
    });
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error fetching activity history' 
    };
  } finally {
    logger.endPerformanceLog('handleGetUserActivityHistory', startTime);
  }
}
