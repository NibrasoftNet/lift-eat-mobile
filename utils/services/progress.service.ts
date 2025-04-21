import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import * as schema from '../../db/schema';
import {
  dailyProgress,
  dailyMealProgress,
  dailyPlanMeals,
  plan,
  meals,
  DailyProgressOrmProps,
  DailyMealProgressOrmProps,
  MealOrmProps,
  DailyPlanMealsOrmProps,
} from '../../db/schema';
import { and, eq, inArray } from 'drizzle-orm';
import { logger } from './logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { DayEnum } from '@/utils/enum/general.enum'; // Importer depuis general.enum.ts

/**
 * Récupérer la progression quotidienne pour une date spécifique (uniquement pour le plan courant)
 */
export const getDailyProgressByDate = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  userId: number,
  date: string,
): Promise<DailyProgressOrmProps | null> => {
  try {
    logger.info(LogCategory.DATABASE, `Récupération de la progression pour la date ${date}`);
    
    // 1. Trouver le plan courant de l'utilisateur
    const currentPlan = await drizzleDb.query.plan.findFirst({
      where: and(
        eq(plan.userId, userId),
        eq(plan.current, true)
      ),
    });

    if (!currentPlan) {
      logger.warn(LogCategory.DATABASE, 'Aucun plan courant trouvé pour cet utilisateur');
      return null;
    }

    // 2. Rechercher la progression pour cette date et ce plan
    const progress = await drizzleDb.query.dailyProgress.findFirst({
      where: and(
        eq(dailyProgress.userId, userId),
        eq(dailyProgress.planId, currentPlan.id),
        eq(dailyProgress.date, date)
      ),
    });

    return progress || null;
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Erreur lors de la récupération de la progression quotidienne', error);
    throw error;
  }
};

/**
 * Créer une nouvelle progression quotidienne
 */
export const createDailyProgress = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  userId: number,
  date: string,
): Promise<DailyProgressOrmProps> => {
  try {
    logger.info(LogCategory.DATABASE, `Création d'une nouvelle progression pour la date ${date}`);
    
    // 1. Trouver le plan courant de l'utilisateur
    const currentPlan = await drizzleDb.query.plan.findFirst({
      where: and(
        eq(plan.userId, userId),
        eq(plan.current, true)
      ),
    });

    if (!currentPlan) {
      throw new Error('Aucun plan courant trouvé pour cet utilisateur');
    }

    // 2. Vérifier si une progression existe déjà pour cette date
    const existingProgress = await drizzleDb.query.dailyProgress.findFirst({
      where: and(
        eq(dailyProgress.userId, userId),
        eq(dailyProgress.planId, currentPlan.id),
        eq(dailyProgress.date, date)
      ),
    });

    if (existingProgress) {
      logger.info(LogCategory.DATABASE, 'Progression déjà existante pour cette date');
      return existingProgress;
    }

    // 3. Créer la nouvelle progression
    const [newProgress] = await drizzleDb
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
      })
      .returning();

    return newProgress;
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Erreur lors de la création de la progression quotidienne', error);
    throw error;
  }
};

/**
 * Mettre à jour une progression quotidienne existante
 */
export const updateDailyProgress = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  progressId: number,
  data: Partial<DailyProgressOrmProps>,
): Promise<DailyProgressOrmProps> => {
  try {
    logger.info(LogCategory.DATABASE, `Mise à jour de la progression ${progressId}`);
    
    // Mettre à jour la progression
    const [updatedProgress] = await drizzleDb
      .update(dailyProgress)
      .set({
        ...data,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(dailyProgress.id, progressId))
      .returning();

    return updatedProgress;
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Erreur lors de la mise à jour de la progression quotidienne', error);
    throw error;
  }
};

/**
 * Récupérer les repas avec leur état de progression pour une date spécifique
 */
export const getMealProgressByDate = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  userId: number,
  date: string,
): Promise<{
  progress: DailyProgressOrmProps | null;
  meals: (MealOrmProps & { progress: DailyMealProgressOrmProps | null; dailyPlanMealId: number | null })[];
}> => {
  try {
    logger.info(LogCategory.DATABASE, `Récupération des repas avec progression pour la date ${date}`);
    
    // 1. Récupérer ou créer la progression pour cette date
    let progress = await getDailyProgressByDate(drizzleDb, userId, date);
    if (!progress) {
      progress = await createDailyProgress(drizzleDb, userId, date);
    }

    // 2. Trouver le plan courant
    const currentPlan = await drizzleDb.query.plan.findFirst({
      where: and(
        eq(plan.userId, userId),
        eq(plan.current, true)
      ),
    });

    if (!currentPlan) {
      throw new Error('Aucun plan courant trouvé');
    }

    // 3. Récupérer les repas du plan pour cette date
    // Convertir la date en jour de la semaine
    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getDay(); // 0 = dimanche, 1 = lundi, etc.
    
    // Convertir le numéro du jour en valeur de l'enum DayEnum avec un typage correct
    const dayMap: Record<number, DayEnum> = {
      0: DayEnum.SUNDAY,
      1: DayEnum.MONDAY,
      2: DayEnum.TUESDAY, 
      3: DayEnum.WEDNESDAY,
      4: DayEnum.THURSDAY,
      5: DayEnum.FRIDAY,
      6: DayEnum.SATURDAY
    };
    
    const dayEnum = dayMap[dayOfWeek];
    
    // Pour simplifier, on récupère TOUS les repas pour ce jour de la semaine
    // quelle que soit la semaine du plan
    const dailyPlansForDate = await drizzleDb.query.dailyPlan.findMany({
      where: and(
        eq(schema.dailyPlan.planId, currentPlan.id),
        eq(schema.dailyPlan.day, dayEnum)
      ),
    });

    logger.info(LogCategory.DATABASE, `Nombre de dailyPlans trouvés pour ${dayEnum}: ${dailyPlansForDate.length}`);

    if (dailyPlansForDate.length === 0) {
      logger.info(LogCategory.DATABASE, `Aucun dailyPlan trouvé pour le jour ${dayEnum}`);
      // Retourner un résultat vide plutôt que de lancer une erreur
      return {
        progress,
        meals: [],
      };
    }

    const dailyPlanIds = dailyPlansForDate.map(dp => dp.id);
    
    // 4. Récupérer les relations dailyPlan-meals
    const dailyPlanMealsRelations = await drizzleDb.query.dailyPlanMeals.findMany({
      where: inArray(dailyPlanMeals.dailyPlanId, dailyPlanIds),
    });

    logger.info(LogCategory.DATABASE, `Nombre de relations dailyPlan-meals trouvées: ${dailyPlanMealsRelations.length}`);
    
    if (dailyPlanMealsRelations.length === 0) {
      logger.info(LogCategory.DATABASE, "Aucun repas trouvé pour ces daily plans");
      return {
        progress,
        meals: [],
      };
    }

    const mealIds = dailyPlanMealsRelations.map(dpm => dpm.mealId);
    
    // 5. Récupérer les repas
    const mealsData = await drizzleDb.query.meals.findMany({
      where: inArray(meals.id, mealIds),
    });

    logger.info(LogCategory.DATABASE, `Nombre de repas trouvés: ${mealsData.length}`);
    
    if (mealsData.length === 0) {
      logger.info(LogCategory.DATABASE, "Aucun repas trouvé avec les IDs fournis");
      return {
        progress,
        meals: [],
      };
    }

    // 6. Récupérer les progressions pour ces repas
    // Si progress n'existe pas, nous n'aurons aucune progression de repas
    const mealProgresses = progress 
      ? await drizzleDb.query.dailyMealProgress.findMany({
          where: eq(dailyMealProgress.dailyProgressId, progress.id),
        })
      : [];

    logger.info(LogCategory.DATABASE, `Nombre de progressions de repas trouvées: ${mealProgresses.length}`);

    // 7. Combiner les résultats
    const mealsWithProgress = mealsData.map(meal => {
      // Trouver la progression pour ce repas si elle existe
      const mealProgress = mealProgresses.find(mp => mp.mealId === meal.id) || null;
      
      // Trouver la relation dailyPlanMeal correspondante pour avoir l'ID
      const dailyPlanMealRelation = dailyPlanMealsRelations.find(dpm => dpm.mealId === meal.id) || null;
      const dailyPlanMealId = dailyPlanMealRelation ? dailyPlanMealRelation.id : null;
      
      return {
        ...meal,
        progress: mealProgress,
        dailyPlanMealId, // Ajouter l'ID de la relation pour pouvoir marquer le repas comme consommé
      };
    });

    return {
      progress,
      meals: mealsWithProgress,
    };
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Erreur lors de la récupération des repas avec progression', error);
    throw error;
  }
};

/**
 * Marquer un repas comme consommé ou non
 */
export const markMealAsConsumed = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  dailyProgressId: number,
  mealId: number,
  dailyPlanMealId: number,
  consumed: boolean,
  pourcentageConsomme: number = 100,
): Promise<DailyMealProgressOrmProps> => {
  try {
    logger.info(
      LogCategory.DATABASE, 
      `Marquage du repas ${mealId} comme ${consumed ? 'consommé' : 'non consommé'} à ${pourcentageConsomme}%`
    );
    
    // 1. Récupérer les informations du repas et du dailyPlanMeal
    const meal = await drizzleDb.query.meals.findFirst({
      where: eq(meals.id, mealId),
    });

    if (!meal) {
      throw new Error('Repas non trouvé');
    }

    const dailyPlanMealRelation = await drizzleDb.query.dailyPlanMeals.findFirst({
      where: eq(dailyPlanMeals.id, dailyPlanMealId),
    });

    if (!dailyPlanMealRelation) {
      throw new Error('Relation dailyPlanMeal non trouvée');
    }

    // 2. Vérifier si une progression existe déjà pour ce repas
    const existingMealProgress = await drizzleDb.query.dailyMealProgress.findFirst({
      where: and(
        eq(dailyMealProgress.dailyProgressId, dailyProgressId),
        eq(dailyMealProgress.mealId, mealId)
      ),
    });

    // 3. Calculer les valeurs nutritionnelles effectives (basées sur le pourcentage consommé)
    const ratio = pourcentageConsomme / 100;
    const caloriesEffectives = dailyPlanMealRelation.calories ? dailyPlanMealRelation.calories * ratio : 0;
    const carbsEffectives = dailyPlanMealRelation.carbs ? dailyPlanMealRelation.carbs * ratio : 0;
    const fatEffectives = dailyPlanMealRelation.fat ? dailyPlanMealRelation.fat * ratio : 0;
    const proteinEffectives = dailyPlanMealRelation.protein ? dailyPlanMealRelation.protein * ratio : 0;

    let mealProgress;

    // Transaction pour assurer la cohérence des données
    await drizzleDb.transaction(async (tx) => {
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
          })
          .returning();
      }

      // 5. Recalculer les totaux pour la progression quotidienne
      const allMealProgresses = await tx.query.dailyMealProgress.findMany({
        where: eq(dailyMealProgress.dailyProgressId, dailyProgressId),
      });

      const totalCalories = allMealProgresses
        .filter(mp => mp.consomme)
        .reduce((sum, mp) => sum + mp.caloriesEffectives, 0);
      
      const totalCarbs = allMealProgresses
        .filter(mp => mp.consomme)
        .reduce((sum, mp) => sum + mp.carbsEffectives, 0);
      
      const totalFat = allMealProgresses
        .filter(mp => mp.consomme)
        .reduce((sum, mp) => sum + mp.fatEffectives, 0);
      
      const totalProtein = allMealProgresses
        .filter(mp => mp.consomme)
        .reduce((sum, mp) => sum + mp.proteinEffectives, 0);

      // 6. Calculer le pourcentage de complétion (repas consommés / total des repas)
      const progress = await tx.query.dailyProgress.findFirst({
        where: eq(dailyProgress.id, dailyProgressId),
      });

      if (!progress) {
        throw new Error('Progression quotidienne non trouvée');
      }

      // Trouver le nombre total de repas pour cette journée
      const dailyPlan = await tx.query.dailyPlan.findFirst({
        where: eq(schema.dailyPlan.id, dailyPlanMealRelation.dailyPlanId),
      });

      if (!dailyPlan) {
        throw new Error('Plan quotidien non trouvé');
      }

      const allDailyPlanMeals = await tx.query.dailyPlanMeals.findMany({
        where: eq(dailyPlanMeals.dailyPlanId, dailyPlan.id),
      });

      const totalMeals = allDailyPlanMeals.length;
      const consumedMeals = allMealProgresses.filter(mp => mp.consomme).length;
      
      const pourcentageCompletion = totalMeals > 0 
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
          pourcentageCompletion,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(dailyProgress.id, dailyProgressId));
    });

    return mealProgress!;
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Erreur lors du marquage du repas comme consommé', error);
    throw error;
  }
};

/**
 * Récupérer les progrès pour un repas spécifique
 */
export const getMealProgressByDailyProgress = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  dailyProgressId: number,
): Promise<DailyMealProgressOrmProps[]> => {
  try {
    logger.info(LogCategory.DATABASE, `Récupération des progrès pour la progression ${dailyProgressId}`);
    
    const mealProgresses = await drizzleDb.query.dailyMealProgress.findMany({
      where: eq(dailyMealProgress.dailyProgressId, dailyProgressId),
    });

    return mealProgresses;
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Erreur lors de la récupération des progrès par repas', error);
    throw error;
  }
};
