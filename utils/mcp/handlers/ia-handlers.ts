import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';
import { and, eq, inArray, like, gte, desc, sql } from 'drizzle-orm';
import {
  users,
  meals,
  plan,
  dailyMealProgress,
  dailyProgress,
  nutritionAdvice,
  MealOrmProps,
  userDietaryRestrictions,
  userAllergies,
  userNutritionGoals,
} from '@/db/schema';
import { NutritionAdviceType, NutritionAdviceProps } from '@/types/nutrition-advice.type';
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
  GetNutritionAdviceResult
} from '../interfaces/ia-interfaces';
import { logger } from '@/utils/services/common/logging.service';
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
    
    // Récupérer les restrictions alimentaires de l'utilisateur
    const dietaryRestrictions = await db
      .select()
      .from(userDietaryRestrictions)
      .where(eq(userDietaryRestrictions.userId, params.userId))
      .all();
      
    // Récupérer les allergies de l'utilisateur
    const allergies = await db
      .select()
      .from(userAllergies)
      .where(eq(userAllergies.userId, params.userId))
      .all();
      
    // Récupérer les objectifs nutritionnels détaillés de l'utilisateur
    const nutritionGoals = await db
      .select()
      .from(userNutritionGoals)
      .where(eq(userNutritionGoals.userId, params.userId))
      .get();
    
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
    
    // Objectifs nutritionnels - Maintenant on utilise les données complètes
    context += "\nNutritional Goals:\n";
    if (nutritionGoals) {
      context += `- Goal: ${nutritionGoals.goal || 'Not set'}\n`;
      context += `- Target Weight: ${nutritionGoals.targetWeight ? `${nutritionGoals.targetWeight} ${user.weightUnit || ''}` : 'Not set'}\n`;
      context += `- Daily Calories: ${nutritionGoals.dailyCalories || 'Not set'}\n`;
      context += `- Macronutrient Ratios: ${nutritionGoals.proteinPercentage || 'Not set'}% protein, ${nutritionGoals.carbsPercentage || 'Not set'}% carbs, ${nutritionGoals.fatPercentage || 'Not set'}% fat\n`;
    } else {
      context += `- Basic Score: ${user.score || 'Not set'}\n`;
      context += `- No detailed nutrition goals set\n`;
    }
    
    // Restrictions alimentaires
    context += "\nDietary Restrictions:\n";
    if (dietaryRestrictions.length > 0) {
      dietaryRestrictions.forEach(restriction => {
        context += `- ${restriction.restriction}\n`;
      });
    } else {
      context += "- No dietary restrictions\n";
    }
    
    // Allergies
    context += "\nAllergies:\n";
    if (allergies.length > 0) {
      allergies.forEach(allergy => {
        context += `- ${allergy.allergy}\n`;
      });
    } else {
      context += "- No allergies\n";
    }
    
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
    
    logger.info(LogCategory.DATABASE, 'Enhanced user context generated successfully', { userId: params.userId });
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
    
    // Récupérer les restrictions alimentaires
    const dietaryRestrictions = await db
      .select()
      .from(userDietaryRestrictions)
      .where(eq(userDietaryRestrictions.userId, params.userId))
      .all();
    
    // Récupérer les allergies
    const allergies = await db
      .select()
      .from(userAllergies)
      .where(eq(userAllergies.userId, params.userId))
      .all();
    
    // Récupérer les objectifs nutritionnels détaillés
    const nutritionGoals = await db
      .select()
      .from(userNutritionGoals)
      .where(eq(userNutritionGoals.userId, params.userId))
      .get();
    
    // Construire la réponse complète avec toutes les préférences
    return { 
      success: true, 
      preferences: {
        // Informations de base
        gender: user.gender,
        age: user.age,
        weight: user.weight,
        weightUnit: user.weightUnit,
        height: user.height,
        heightUnit: user.heightUnit,
        physicalActivity: user.physicalActivity,
        
        // Restrictions alimentaires
        dietaryRestrictions: dietaryRestrictions.map(r => r.restriction),
        
        // Allergies
        allergies: allergies.map(a => a.allergy),
        
        // Objectifs nutritionnels
        nutritionGoals: nutritionGoals ? {
          goal: nutritionGoals.goal,
          targetWeight: nutritionGoals.targetWeight ?? undefined,
          dailyCalories: nutritionGoals.dailyCalories ?? undefined,
          macroRatios: {
            protein: nutritionGoals.proteinPercentage ?? undefined,
            carbs: nutritionGoals.carbsPercentage ?? undefined,
            fat: nutritionGoals.fatPercentage ?? undefined
          }
        } : undefined
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
/**
 * Handler pour sauvegarder un conseil nutritionnel généré par l'IA
 * @param db Instance de la base de données
 * @param params Paramètres du conseil à sauvegarder
 * @returns Résultat de l'opération avec l'ID du conseil sauvegardé
 */
export async function handleSaveNutritionAdvice(
  db: ExpoSQLiteDatabase<typeof schema>,
  params: SaveNutritionAdviceParams
): Promise<SaveNutritionAdviceResult> {
  const startTime = logger.startPerformanceLog('handleSaveNutritionAdvice');
  try {
    if (!db) throw new Error("Database not initialized");
    
    // Nettoyer et valider les données d'entrée
    logger.info(LogCategory.DATABASE, 'Saving nutrition advice via MCP Handler', { 
      userId: params.userId, 
      type: params.type
    });
    
    // S'assurer que le type est valide (utiliser l'enum si possible)
    let adviceType = params.type;
    if (typeof params.type === 'string' && !Object.values(NutritionAdviceType).includes(params.type as NutritionAdviceType)) {
      // Si le type n'est pas une valeur valide de l'enum, utiliser GENERAL par défaut
      adviceType = NutritionAdviceType.GENERAL;
      logger.warn(LogCategory.DATABASE, `Invalid advice type: ${params.type}, defaulting to GENERAL`);
    }
    
    // Insérer le conseil dans la base de données
    const result = await db.insert(nutritionAdvice).values({
      title: params.title,
      content: params.content,
      type: adviceType,
      context: params.context,
      userId: params.userId,
      planId: params.planId,
      mealId: params.mealId
    }).returning({ id: nutritionAdvice.id });
    
    logger.info(LogCategory.DATABASE, `Successfully saved nutrition advice for user ${params.userId}`);
    return { 
      success: true,
      adviceId: result[0].id
    };
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Error saving nutrition advice', { 
      userId: params.userId, 
      error: error instanceof Error ? error.message : String(error) 
    });
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error saving nutrition advice' 
    };
  } finally {
    logger.endPerformanceLog('handleSaveNutritionAdvice', startTime);
  }
}

/**
 * Handler pour récupérer les conseils nutritionnels d'un utilisateur
 * @param db Instance de la base de données
 * @param params Paramètres de recherche
 * @returns Liste des conseils nutritionnels
 */
export async function handleGetNutritionAdvice(
  db: ExpoSQLiteDatabase<typeof schema>,
  params: GetNutritionAdviceParams
): Promise<GetNutritionAdviceResult> {
  const startTime = logger.startPerformanceLog('handleGetNutritionAdvice');
  try {
    if (!db) throw new Error("Database not initialized");
    
    logger.info(LogCategory.DATABASE, 'Fetching nutrition advice via MCP Handler', { 
      userId: params.userId,
      limit: params.limit || 20,
      type: params.type
    });
    
    // Récupérer les conseils de l'utilisateur
    const whereConditions = [
      eq(nutritionAdvice.userId, params.userId)
    ];
    
    // Filtrage optionnel par type de conseil (avec support de l'enum)
    if (params.type) {
      // Utiliser directement la valeur du type
      whereConditions.push(eq(nutritionAdvice.type, params.type));
    }
    
    // Exécuter la requête avec tous les filtres
    const adviceList = await db
      .select()
      .from(nutritionAdvice)
      .where(and(...whereConditions))
      .orderBy(desc(nutritionAdvice.createdAt))
      .limit(params.limit || 20);
    
    logger.info(LogCategory.DATABASE, `Successfully retrieved ${adviceList.length} nutrition advice items for user ${params.userId}`);
    
    // Convertir les résultats en NutritionAdviceProps
    const typedAdviceList: NutritionAdviceProps[] = adviceList.map(advice => ({
      id: advice.id,
      title: advice.title,
      content: advice.content,
      type: advice.type as NutritionAdviceType,
      context: advice.context || undefined,  // Convertir null en undefined
      liked: advice.liked ? Boolean(advice.liked) : undefined,  // Convertir null/0/1 en boolean ou undefined
      applied: Boolean(advice.applied),  // Convertir 0/1 en boolean
      createdAt: advice.createdAt || new Date().toISOString(),
      updatedAt: advice.updatedAt || undefined,  // Convertir null en undefined
      userId: advice.userId,
      mealId: advice.mealId || undefined,  // Convertir null en undefined
      planId: advice.planId || undefined   // Convertir null en undefined
    }));
    
    return {
      success: true,
      adviceList: typedAdviceList
    };
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Error fetching nutrition advice', { 
      userId: params.userId, 
      error: error instanceof Error ? error.message : String(error) 
    });
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error fetching nutrition advice' 
    };
  } finally {
    logger.endPerformanceLog('handleGetNutritionAdvice', startTime);
  }
}

export async function handleUpdateAdviceFeedback(
  db: ExpoSQLiteDatabase<typeof schema>,
  params: UpdateAdviceFeedbackParams
): Promise<UpdateAdviceFeedbackResult> {
  const startTime = logger.startPerformanceLog('handleUpdateAdviceFeedback');
  try {
    logger.info(LogCategory.DATABASE, 'Updating nutrition advice feedback via MCP Handler', { 
      adviceId: params.adviceId
    });
    
    // Vérifier si le conseil existe
    const advice = await db
      .select()
      .from(nutritionAdvice)
      .where(eq(nutritionAdvice.id, params.adviceId))
      .get();
    
    if (!advice) {
      logger.warn(LogCategory.DATABASE, 'Advice not found for feedback update', { adviceId: params.adviceId });
      return { success: false, error: 'Nutrition advice not found' };
    }
    
    // Mettre à jour le feedback
    await db
      .update(nutritionAdvice)
      .set({
        liked: params.liked,
        applied: params.applied,
        updatedAt: new Date().toISOString()
      })
      .where(eq(nutritionAdvice.id, params.adviceId));
    
    logger.info(LogCategory.DATABASE, 'Nutrition advice feedback updated successfully', { adviceId: params.adviceId });
    return { success: true };
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Error updating nutrition advice feedback', { 
      adviceId: params.adviceId, 
      error: error instanceof Error ? error.message : String(error) 
    });
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error updating advice feedback' 
    };
  } finally {
    logger.endPerformanceLog('handleUpdateAdviceFeedback', startTime);
  }
}

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
    
    // Récupérer le plan actuel de l'utilisateur pour obtenir ses objectifs
    const userCurrentPlanQuery = await db
      .select()
      .from(plan)
      .where(
        and(
          eq(plan.userId, params.userId),
          eq(plan.current, true)
        )
      )
      .limit(1);
    
    let calorieTarget = 0;
    if (userCurrentPlanQuery.length > 0) {
      calorieTarget = userCurrentPlanQuery[0].calories;
    }
    
    // Récupérer l'historique des progrès quotidiens
    const dailyProgressRecords = await db
      .select()
      .from(dailyProgress)
      .where(
        and(
          eq(dailyProgress.userId, params.userId),
          gte(dailyProgress.date, dateLimitStr)
        )
      )
      .orderBy(desc(dailyProgress.date));
    
    // Construire un dictionnaire des progrès par date
    const progressByDate = new Map();
    dailyProgressRecords.forEach(record => {
      progressByDate.set(record.date, {
        date: record.date,
        totalCalories: record.calories,
        calorieTarget: calorieTarget || record.calories, // Utiliser la cible si disponible, sinon les calories réelles
        pourcentageCompletion: record.pourcentageCompletion,
        macros: {
          carbs: record.carbs,
          protein: record.protein,
          fat: record.fat
        }
      });
    });
    
    // Récupérer le nombre de repas consommés par jour
    const mealProgressRecords = await db
      .select({
        date: dailyProgress.date,
        mealCount: sql<number>`count(${dailyMealProgress.id})`
      })
      .from(dailyMealProgress)
      .innerJoin(dailyProgress, eq(dailyMealProgress.dailyProgressId, dailyProgress.id))
      .where(and(
        eq(dailyProgress.userId, params.userId),
        gte(dailyProgress.date, dateLimitStr),
        eq(dailyMealProgress.consomme, true)
      ))
      .groupBy(dailyProgress.date);
    
    // Ajouter le nombre de repas consommés au dictionnaire
    mealProgressRecords.forEach(record => {
      if (progressByDate.has(record.date)) {
        const dayData = progressByDate.get(record.date);
        dayData.consumedMeals = record.mealCount;
        progressByDate.set(record.date, dayData);
      }
    });
    
    // Construire l'historique d'activité complète en incluant les jours sans enregistrements
    const activityHistory = Array.from({ length: daysLimit }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      // Utiliser les données réelles si disponibles, sinon des valeurs par défaut
      if (progressByDate.has(dateStr)) {
        return progressByDate.get(dateStr);
      }
      
      return {
        date: dateStr,
        consumedMeals: 0,
        totalCalories: 0,
        calorieTarget: calorieTarget,
        pourcentageCompletion: 0,
        macros: {
          carbs: 0,
          protein: 0,
          fat: 0
        }
      };
    }).sort((a, b) => b.date.localeCompare(a.date)); // Tri par date décroissante
    
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
