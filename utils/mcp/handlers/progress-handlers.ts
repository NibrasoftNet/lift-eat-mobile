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
} from '../interfaces/progress-interfaces';
import {
  dailyProgress,
  dailyMealProgress,
  dailyPlanMeals,
  plan,
  meals,
  DailyProgressOrmProps,
  DailyMealProgressOrmProps
} from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

/**
 * Handler pour la méthode getDailyProgressByDateViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres pour la récupération de la progression quotidienne
 * @returns Résultat de l'opération avec la progression quotidienne
 */
export async function handleGetDailyProgressByDate(db: any, params: GetDailyProgressByDateParams): Promise<GetDailyProgressByDateResult> {
  const { userId, date } = params;
  
  try {
    if (!db) throw new Error("Database not initialized");
    
    logger.info(LogCategory.DATABASE, `Getting daily progress for date ${date} via MCP Server`);
    
    // 1. Trouver le plan courant de l'utilisateur
    const currentPlan = await db.query.plan.findFirst({
      where: and(
        eq(plan.userId, userId),
        eq(plan.current, true)
      ),
    });

    if (!currentPlan) {
      logger.warn(LogCategory.DATABASE, `No current plan found for user ${userId}`);
      return { success: true, progress: undefined }; // Pas d'erreur, juste pas de plan courant
    }

    // 2. Rechercher la progression pour cette date et ce plan
    const progress = await db.query.dailyProgress.findFirst({
      where: and(
        eq(dailyProgress.userId, userId),
        eq(dailyProgress.planId, currentPlan.id),
        eq(dailyProgress.date, date)
      ),
    });

    logger.debug(LogCategory.DATABASE, `Daily progress retrieved for date ${date}`);
    return { success: true, progress: progress || undefined };
  } catch (error) {
    logger.error(LogCategory.DATABASE, `Error in handleGetDailyProgressByDate: ${error instanceof Error ? error.message : String(error)}`);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

/**
 * Handler pour la méthode createDailyProgressViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres pour la création de la progression quotidienne
 * @returns Résultat de l'opération avec la progression quotidienne créée
 */
export async function handleCreateDailyProgress(db: any, params: CreateDailyProgressParams): Promise<CreateDailyProgressResult> {
  const { userId, date } = params;
  
  try {
    if (!db) throw new Error("Database not initialized");
    
    logger.info(LogCategory.DATABASE, `Creating daily progress for date ${date} via MCP Server`);
    
    // 1. Trouver le plan courant de l'utilisateur
    const currentPlan = await db.query.plan.findFirst({
      where: and(
        eq(plan.userId, userId),
        eq(plan.current, true)
      ),
    });

    if (!currentPlan) {
      logger.warn(LogCategory.DATABASE, `No current plan found for user ${userId}`);
      return { success: false, error: 'No current plan found for this user' };
    }

    // 2. Vérifier si une progression existe déjà pour cette date
    const existingProgress = await db.query.dailyProgress.findFirst({
      where: and(
        eq(dailyProgress.userId, userId),
        eq(dailyProgress.planId, currentPlan.id),
        eq(dailyProgress.date, date)
      ),
    });

    if (existingProgress) {
      logger.info(LogCategory.DATABASE, `Progress already exists for date ${date}`);
      return { success: true, progress: existingProgress };
    }

    // 3. Créer la nouvelle progression
    const [newProgress] = await db
      .insert(dailyProgress)
      .values({
        userId,
        planId: currentPlan.id,
        date,
        pourcentageCompletion: 0,
        calories: 0,
        carbs: 0,
        fat: 0,
        protein: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .returning();

    logger.debug(LogCategory.DATABASE, `Created new daily progress for date ${date}`);
    return { success: true, progress: newProgress };
  } catch (error) {
    logger.error(LogCategory.DATABASE, `Error in handleCreateDailyProgress: ${error instanceof Error ? error.message : String(error)}`);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

/**
 * Handler pour la méthode updateDailyProgressViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres pour la mise à jour de la progression quotidienne
 * @returns Résultat de l'opération avec la progression quotidienne mise à jour
 */
export async function handleUpdateDailyProgress(db: any, params: UpdateDailyProgressParams): Promise<UpdateDailyProgressResult> {
  const { progressId, data } = params;
  
  try {
    if (!db) throw new Error("Database not initialized");
    
    logger.info(LogCategory.DATABASE, `Updating daily progress ${progressId} via MCP Server`);
    
    // Vérifier si la progression existe
    const existingProgress = await db.query.dailyProgress.findFirst({
      where: eq(dailyProgress.id, progressId),
    });

    if (!existingProgress) {
      logger.warn(LogCategory.DATABASE, `Daily progress ${progressId} not found`);
      return { success: false, error: `Daily progress with ID ${progressId} not found` };
    }
    
    // Mettre à jour la progression
    const [updatedProgress] = await db
      .update(dailyProgress)
      .set({
        ...data,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(dailyProgress.id, progressId))
      .returning();

    logger.debug(LogCategory.DATABASE, `Updated daily progress ${progressId}`);
    return { success: true, progress: updatedProgress };
  } catch (error) {
    logger.error(LogCategory.DATABASE, `Error in handleUpdateDailyProgress: ${error instanceof Error ? error.message : String(error)}`);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

/**
 * Handler pour la méthode getMealProgressByDateViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres pour la récupération des repas avec leur progression
 * @returns Résultat de l'opération avec les repas et leur progression
 */
export async function handleGetMealProgressByDate(db: any, params: GetMealProgressByDateParams): Promise<GetMealProgressByDateResult> {
  const { userId, date } = params;
  
  try {
    if (!db) throw new Error("Database not initialized");
    
    logger.info(LogCategory.DATABASE, `Getting meal progress for date ${date} via MCP Server`);

    // Cette fonction est complexe et peut nécessiter plusieurs requêtes SQL
    // Nous allons implémenter une version simplifiée ici
    // Le code complet pourrait être ajouté plus tard si nécessaire

    // 1. Trouver le plan courant de l'utilisateur
    const currentPlan = await db.query.plan.findFirst({
      where: and(
        eq(plan.userId, userId),
        eq(plan.current, true)
      ),
    });

    if (!currentPlan) {
      logger.warn(LogCategory.DATABASE, `No current plan found for user ${userId}`);
      return { success: true, meals: [] };
    }

    // 2. Récupérer la progression quotidienne
    const progress = await db.query.dailyProgress.findFirst({
      where: and(
        eq(dailyProgress.userId, userId),
        eq(dailyProgress.planId, currentPlan.id),
        eq(dailyProgress.date, date)
      ),
    });

    // Si aucune progression n'est trouvée, retourner un tableau vide
    if (!progress) {
      logger.warn(LogCategory.DATABASE, `No progress found for date ${date}`);
      return { success: true, progress: undefined, meals: [] };
    }

    // 3. Récupérer les repas du plan quotidien pour cette date
    // Note: Cette partie est simplifiée et pourrait nécessiter plus de logique
    const result = await db.execute(`
      SELECT 
        m.*, 
        dpm.id as dailyPlanMealId,
        dpm.mealType as mealType,
        dmp.id as progressId,
        dmp.consomme,
        dmp.pourcentageConsomme
      FROM meals m
      JOIN dailyPlanMeals dpm ON m.id = dpm.mealId
      JOIN dailyPlan dp ON dpm.dailyPlanId = dp.id
      LEFT JOIN dailyMealProgress dmp ON dmp.mealId = m.id AND dmp.dailyProgressId = ${progress.id}
      WHERE dp.planId = ${currentPlan.id} AND dp.day = (SELECT SUBSTR('${date}', -2) as day)
    `);

    // Transformer les résultats en format attendu
    const meals = result.map((row: any) => ({
      ...row,
      progress: row.progressId ? {
        id: row.progressId,
        consomme: row.consomme,
        pourcentageConsomme: row.pourcentageConsomme
      } : null,
      dailyPlanMealId: row.dailyPlanMealId,
      // Inclure le type de repas spécifique au plan journalier
      mealType: row.mealType
    }));

    logger.debug(LogCategory.DATABASE, `Retrieved ${meals.length} meals with progress for date ${date}`);
    logger.debug(LogCategory.DATABASE, `Meal types included: ${meals.map((m: any) => ({ id: m.id, name: m.name, type: m.type, mealType: m.mealType }))}`);
    return { success: true, progress, meals };
  } catch (error) {
    logger.error(LogCategory.DATABASE, `Error in handleGetMealProgressByDate: ${error instanceof Error ? error.message : String(error)}`);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

/**
 * Handler pour la méthode markMealAsConsumedViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres pour marquer un repas comme consommé
 * @returns Résultat de l'opération avec la progression du repas
 */
export async function handleMarkMealAsConsumed(db: any, params: MarkMealAsConsumedParams): Promise<MarkMealAsConsumedResult> {
  const { dailyProgressId, mealId, dailyPlanMealId, consumed, pourcentageConsomme = 100 } = params;
  
  try {
    if (!db) throw new Error("Database not initialized");
    
    logger.info(LogCategory.DATABASE, `Marking meal ${mealId} as ${consumed ? 'consumed' : 'not consumed'} via MCP Server`);
    
    let mealProgress: DailyMealProgressOrmProps | undefined;
    
    // Utiliser une transaction pour s'assurer que toutes les mises à jour sont atomiques
    await db.transaction(async (tx: any) => {
      // 1. Vérifier si la progression quotidienne existe
      const progress = await tx.query.dailyProgress.findFirst({
        where: eq(dailyProgress.id, dailyProgressId),
      });

      if (!progress) {
        throw new Error(`Daily progress with ID ${dailyProgressId} not found`);
      }

      // 2. Récupérer les informations du repas
      const meal = await tx.query.meals.findFirst({
        where: eq(meals.id, mealId),
      });

      if (!meal) {
        throw new Error(`Meal with ID ${mealId} not found`);
      }

      // 3. Vérifier si une progression pour ce repas existe déjà
      const existingMealProgress = await tx.query.dailyMealProgress.findFirst({
        where: and(
          eq(dailyMealProgress.dailyProgressId, dailyProgressId),
          eq(dailyMealProgress.mealId, mealId)
        ),
      });

      // Calculer les valeurs nutritionnelles effectives
      const caloriesEffectives = (meal.calories * pourcentageConsomme) / 100;
      const carbsEffectives = (meal.carbs * pourcentageConsomme) / 100;
      const fatEffectives = (meal.fat * pourcentageConsomme) / 100;
      const proteinEffectives = (meal.protein * pourcentageConsomme) / 100;

      // 4. Mettre à jour ou créer la progression du repas
      if (existingMealProgress) {
        // Mise à jour
        [mealProgress] = await tx
          .update(dailyMealProgress)
          .set({
            consomme: consumed,
            pourcentageConsomme,
            caloriesEffectives,
            carbsEffectives,
            fatEffectives,
            proteinEffectives,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(dailyMealProgress.id, existingMealProgress.id))
          .returning();
      } else {
        // Création
        [mealProgress] = await tx
          .insert(dailyMealProgress)
          .values({
            dailyProgressId,
            mealId,
            dailyPlanMealId,
            consomme: consumed,
            pourcentageConsomme,
            caloriesEffectives,
            carbsEffectives,
            fatEffectives,
            proteinEffectives,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })
          .returning();
      }

      // 5. Recalculer les totaux pour la progression quotidienne
      const allMealProgresses = await tx.query.dailyMealProgress.findMany({
        where: eq(dailyMealProgress.dailyProgressId, dailyProgressId),
      });

      const totalCalories = allMealProgresses
        .filter((mp: any) => mp.consomme)
        .reduce((sum: number, mp: any) => sum + mp.caloriesEffectives, 0);
      
      const totalCarbs = allMealProgresses
        .filter((mp: any) => mp.consomme)
        .reduce((sum: number, mp: any) => sum + mp.carbsEffectives, 0);
      
      const totalFat = allMealProgresses
        .filter((mp: any) => mp.consomme)
        .reduce((sum: number, mp: any) => sum + mp.fatEffectives, 0);
      
      const totalProtein = allMealProgresses
        .filter((mp: any) => mp.consomme)
        .reduce((sum: number, mp: any) => sum + mp.proteinEffectives, 0);

      // 6. Trouver le nombre total de repas pour cette journée
      const allDailyPlanMeals = await tx.query.dailyPlanMeals.findMany({
        where: eq(dailyPlanMeals.dailyPlanId, dailyPlanMealId),
      });

      const totalMeals = allDailyPlanMeals.length;
      const consumedMeals = allMealProgresses.filter((mp: any) => mp.consomme).length;
      
      const pourc = totalMeals > 0 
        ? (consumedMeals / totalMeals) * 100 
        : 0;

      // 7. Mettre à jour la progression quotidienne
      await tx
        .update(dailyProgress)
        .set({
          calories: totalCalories,
          carbs: totalCarbs,
          fat: totalFat,
          protein: totalProtein,
          pourcentageCompletion: pourc,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(dailyProgress.id, dailyProgressId));
    });

    logger.debug(LogCategory.DATABASE, `Meal ${mealId} marked as ${consumed ? 'consumed' : 'not consumed'}`);
    return { success: true, mealProgress };
  } catch (error) {
    logger.error(LogCategory.DATABASE, `Error in handleMarkMealAsConsumed: ${error instanceof Error ? error.message : String(error)}`);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

/**
 * Handler pour la méthode getMealProgressByDailyProgressViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres pour la récupération des progrès des repas
 * @returns Résultat de l'opération avec les progrès des repas
 */
export async function handleGetMealProgressByDailyProgress(db: any, params: GetMealProgressByDailyProgressParams): Promise<GetMealProgressByDailyProgressResult> {
  const { dailyProgressId } = params;
  
  try {
    if (!db) throw new Error("Database not initialized");
    
    logger.info(LogCategory.DATABASE, `Getting meal progress for daily progress ${dailyProgressId} via MCP Server`);
    
    // Vérifier si la progression quotidienne existe
    const progress = await db.query.dailyProgress.findFirst({
      where: eq(dailyProgress.id, dailyProgressId),
    });

    if (!progress) {
      logger.warn(LogCategory.DATABASE, `Daily progress ${dailyProgressId} not found`);
      return { success: false, error: `Daily progress with ID ${dailyProgressId} not found` };
    }
    
    // Récupérer les progrès des repas
    const mealProgresses = await db.query.dailyMealProgress.findMany({
      where: eq(dailyMealProgress.dailyProgressId, dailyProgressId),
    });

    logger.debug(LogCategory.DATABASE, `Retrieved ${mealProgresses.length} meal progresses for daily progress ${dailyProgressId}`);
    return { success: true, mealProgresses };
  } catch (error) {
    logger.error(LogCategory.DATABASE, `Error in handleGetMealProgressByDailyProgress: ${error instanceof Error ? error.message : String(error)}`);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

/**
 * Handler pour la méthode getDailyProgressByPlanViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres pour la récupération des progressions quotidiennes d'un plan
 * @returns Résultat de l'opération avec les progressions quotidiennes
 */
export async function handleGetDailyProgressByPlan(db: any, params: GetDailyProgressByPlanParams): Promise<GetDailyProgressByPlanResult> {
  const { userId, planId } = params;
  
  try {
    if (!db) throw new Error("Database not initialized");
    
    logger.info(LogCategory.DATABASE, `Getting daily progress for plan ${planId} and user ${userId} via MCP Server`);
    
    // Vérifier si le plan existe et appartient à l'utilisateur
    const planExists = await db.select({ id: plan.id })
      .from(plan)
      .where(
        and(
          eq(plan.id, planId),
          eq(plan.userId, userId)
        )
      )
      .limit(1);
      
    if (planExists.length === 0) {
      logger.warn(LogCategory.DATABASE, `Plan with ID ${planId} not found or does not belong to user ${userId}`);
      return { 
        success: false, 
        error: `Plan with ID ${planId} not found or does not belong to user ${userId}` 
      };
    }
    
    // Récupérer toutes les progressions quotidiennes associées au plan
    const dailyProgressions = await db
      .select()
      .from(dailyProgress)
      .where(
        and(
          eq(dailyProgress.userId, userId),
          eq(dailyProgress.planId, planId)
        )
      );
    
    logger.debug(LogCategory.DATABASE, `Found ${dailyProgressions.length} daily progressions for plan ${planId}`);
    
    return {
      success: true,
      dailyProgressions
    };
  } catch (error) {
    logger.error(LogCategory.DATABASE, `Error in handleGetDailyProgressByPlan: ${error instanceof Error ? error.message : String(error)}`);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}
