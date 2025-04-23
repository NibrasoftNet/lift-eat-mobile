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
import sqliteMCPServer from '@/utils/mcp/sqlite-server';

/**
 * Récupérer la progression quotidienne pour une date spécifique (uniquement pour le plan courant)
 * @deprecated Utilisez directement sqliteMCPServer.getDailyProgressByDateViaMCP pour une meilleure centralisation
 * @param drizzleDb - Instance de la base de données Drizzle
 * @param userId - ID de l'utilisateur
 * @param date - Date au format YYYY-MM-DD
 * @returns La progression quotidienne ou null si aucune progression n'est trouvée
 */
export const getDailyProgressByDate = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  userId: number,
  date: string,
): Promise<DailyProgressOrmProps | null> => {
  const startTime = logger.startPerformanceLog('getDailyProgressByDate');
  try {
    logger.info(LogCategory.DATABASE, `Récupération de la progression pour la date ${date} via MCP Server`);
    
    // Utiliser le serveur MCP au lieu d'accéder directement à la base de données
    const result = await sqliteMCPServer.getDailyProgressByDateViaMCP(userId, date);

    if (!result.success && result.error) {
      throw new Error(result.error || `Erreur lors de la récupération de la progression pour ${date}`);
    }

    logger.debug(LogCategory.DATABASE, `Progression pour la date ${date} récupérée via MCP Server`);
    return result.progress || null;
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Erreur lors de la récupération de la progression quotidienne', error);
    throw error;
  } finally {
    logger.endPerformanceLog('getDailyProgressByDate', startTime);
  }
};

/**
 * Créer une nouvelle progression quotidienne
 * @deprecated Utilisez directement sqliteMCPServer.createDailyProgressViaMCP pour une meilleure centralisation
 * @param drizzleDb - Instance de la base de données Drizzle
 * @param userId - ID de l'utilisateur
 * @param date - Date au format YYYY-MM-DD
 * @returns La progression quotidienne créée
 */
export const createDailyProgress = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  userId: number,
  date: string,
): Promise<DailyProgressOrmProps> => {
  const startTime = logger.startPerformanceLog('createDailyProgress');
  try {
    logger.info(LogCategory.DATABASE, `Création d'une nouvelle progression pour la date ${date} via MCP Server`);
    
    // Utiliser le serveur MCP au lieu d'accéder directement à la base de données
    const result = await sqliteMCPServer.createDailyProgressViaMCP(userId, date);

    if (!result.success) {
      throw new Error(result.error || `Erreur lors de la création de la progression pour ${date}`);
    }

    if (!result.progress) {
      throw new Error(`Progression créée mais non retournée par le serveur MCP pour la date ${date}`);
    }

    logger.debug(LogCategory.DATABASE, `Nouvelle progression créée pour la date ${date} via MCP Server`);
    return result.progress;
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Erreur lors de la création de la progression quotidienne', error);
    throw error;
  } finally {
    logger.endPerformanceLog('createDailyProgress', startTime);
  }
};

/**
 * Mettre à jour une progression quotidienne existante
 * @deprecated Utilisez directement sqliteMCPServer.updateDailyProgressViaMCP pour une meilleure centralisation
 * @param drizzleDb - Instance de la base de données Drizzle
 * @param progressId - ID de la progression à mettre à jour
 * @param data - Données à mettre à jour
 * @returns La progression quotidienne mise à jour
 */
export const updateDailyProgress = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  progressId: number,
  data: Partial<DailyProgressOrmProps>,
): Promise<DailyProgressOrmProps> => {
  const startTime = logger.startPerformanceLog('updateDailyProgress');
  try {
    logger.info(LogCategory.DATABASE, `Mise à jour de la progression ${progressId} via MCP Server`);
    
    // Utiliser le serveur MCP au lieu d'accéder directement à la base de données
    const result = await sqliteMCPServer.updateDailyProgressViaMCP(progressId, data);

    if (!result.success) {
      throw new Error(result.error || `Erreur lors de la mise à jour de la progression ${progressId}`);
    }

    if (!result.progress) {
      throw new Error(`Progression mise à jour mais non retournée par le serveur MCP pour l'ID ${progressId}`);
    }

    logger.debug(LogCategory.DATABASE, `Progression ${progressId} mise à jour via MCP Server`);
    return result.progress;
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Erreur lors de la mise à jour de la progression quotidienne', error);
    throw error;
  } finally {
    logger.endPerformanceLog('updateDailyProgress', startTime);
  }
};

/**
 * Récupérer les repas avec leur état de progression pour une date spécifique
 * @deprecated Utilisez directement sqliteMCPServer.getMealProgressByDateViaMCP pour une meilleure centralisation
 * @param drizzleDb - Instance de la base de données Drizzle
 * @param userId - ID de l'utilisateur
 * @param date - Date au format YYYY-MM-DD
 * @returns La progression quotidienne et les repas associés avec leur état de progression
 */
export const getMealProgressByDate = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  userId: number,
  date: string,
): Promise<{
  progress: DailyProgressOrmProps | null;
  meals: (MealOrmProps & { progress: DailyMealProgressOrmProps | null; dailyPlanMealId: number | null })[];
}> => {
  const startTime = logger.startPerformanceLog('getMealProgressByDate');
  try {
    logger.info(LogCategory.DATABASE, `Récupération des repas avec progression pour la date ${date} via MCP Server`);
    
    // Utiliser le serveur MCP au lieu d'accéder directement à la base de données
    const result = await sqliteMCPServer.getMealProgressByDateViaMCP(userId, date);

    if (!result.success) {
      throw new Error(result.error || `Erreur lors de la récupération des repas pour la date ${date}`);
    }

    // Si aucun résultat n'est retourné, créer un objet vide
    const mealsResult = {
      progress: result.progress || null,
      meals: result.meals || [],
    };

    logger.debug(LogCategory.DATABASE, `Récupération de ${mealsResult.meals.length} repas pour la date ${date} via MCP Server`);
    return mealsResult;
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Erreur lors de la récupération des repas avec progression', error);
    throw error;
  } finally {
    logger.endPerformanceLog('getMealProgressByDate', startTime);
  }
};

/**
 * Marquer un repas comme consommé ou non
 * @deprecated Utilisez directement sqliteMCPServer.markMealAsConsumedViaMCP pour une meilleure centralisation
 * @param drizzleDb - Instance de la base de données Drizzle
 * @param dailyProgressId - ID de la progression quotidienne
 * @param mealId - ID du repas
 * @param dailyPlanMealId - ID du repas dans le plan quotidien
 * @param consumed - Indique si le repas a été consommé
 * @param pourcentageConsomme - Pourcentage du repas consommé (par défaut: 100)
 * @returns La progression du repas mise à jour
 */
export const markMealAsConsumed = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  dailyProgressId: number,
  mealId: number,
  dailyPlanMealId: number,
  consumed: boolean,
  pourcentageConsomme: number = 100,
): Promise<DailyMealProgressOrmProps> => {
  const startTime = logger.startPerformanceLog('markMealAsConsumed');
  try {
    logger.info(
      LogCategory.DATABASE, 
      `Marquage du repas ${mealId} comme ${consumed ? 'consommé' : 'non consommé'} à ${pourcentageConsomme}% via MCP Server`
    );
    
    // Utiliser le serveur MCP au lieu d'accéder directement à la base de données
    const result = await sqliteMCPServer.markMealAsConsumedViaMCP(
      dailyProgressId, 
      mealId, 
      dailyPlanMealId, 
      consumed, 
      pourcentageConsomme
    );

    if (!result.success) {
      throw new Error(result.error || `Erreur lors du marquage du repas ${mealId} comme ${consumed ? 'consommé' : 'non consommé'}`);
    }

    if (!result.mealProgress) {
      throw new Error(`Progression du repas mise à jour mais non retournée par le serveur MCP pour le repas ${mealId}`);
    }

    logger.debug(LogCategory.DATABASE, `Repas ${mealId} marqué comme ${consumed ? 'consommé' : 'non consommé'} via MCP Server`);
    return result.mealProgress;
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Erreur lors du marquage du repas comme consommé', error);
    throw error;
  } finally {
    logger.endPerformanceLog('markMealAsConsumed', startTime);
  }
};

/**
 * Récupérer les progrès pour un repas spécifique
 * @deprecated Utilisez directement sqliteMCPServer.getMealProgressByDailyProgressViaMCP pour une meilleure centralisation
 * @param drizzleDb - Instance de la base de données Drizzle
 * @param dailyProgressId - ID de la progression quotidienne
 * @returns Les progrès des repas pour cette progression quotidienne
 */
export const getMealProgressByDailyProgress = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  dailyProgressId: number,
): Promise<DailyMealProgressOrmProps[]> => {
  const startTime = logger.startPerformanceLog('getMealProgressByDailyProgress');
  try {
    logger.info(LogCategory.DATABASE, `Récupération des progrès pour la progression ${dailyProgressId} via MCP Server`);
    
    // Utiliser le serveur MCP au lieu d'accéder directement à la base de données
    const result = await sqliteMCPServer.getMealProgressByDailyProgressViaMCP(dailyProgressId);

    if (!result.success) {
      throw new Error(result.error || `Erreur lors de la récupération des progrès pour la progression ${dailyProgressId}`);
    }

    logger.debug(LogCategory.DATABASE, `Progrès des repas récupérés pour la progression ${dailyProgressId} via MCP Server`);
    return result.mealProgresses || [];
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Erreur lors de la récupération des progrès par repas', error);
    throw error;
  } finally {
    logger.endPerformanceLog('getMealProgressByDailyProgress', startTime);
  }
};
