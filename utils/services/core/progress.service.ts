/**
 * Service pour la gestion de la progression
 * Ce service encapsule la logique métier liée à la progression des repas et des objectifs
 */

import { LogCategory } from "../enum/logging.enum";
import { logger } from "./logging.service";
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import * as schema from '@/db/schema';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { getCurrentUserIdSync } from "@/utils/helpers/userContext";
import { invalidateCache, DataType } from "@/utils/helpers/queryInvalidation";
import { useQueryClient } from "@tanstack/react-query";
import { DailyMealProgressOrmProps, DailyProgressOrmProps } from "@/db/schema";

/**
 * Service de gestion de la progression pour centraliser toutes les opérations liées aux progrès des utilisateurs
 */
export const progressService = {
  /**
   * Marque un repas comme consommé ou non dans la progression quotidienne
   * @param dailyProgressId - ID de la progression quotidienne
   * @param mealId - ID du repas
   * @param dailyPlanMealId - ID du repas dans le plan quotidien
   * @param consumed - Indique si le repas est consommé ou non
   * @param pourcentageConsomme - Pourcentage de consommation (optionnel, défaut à 100%)
   * @returns Résultat de l'opération
   */
  async markMealAsConsumed(
    dailyProgressId: number,
    mealId: number,
    dailyPlanMealId: number,
    consumed: boolean,
    pourcentageConsomme: number = 100
  ): Promise<{ success: boolean; error?: string }> {
    try {
      logger.info(LogCategory.DATABASE, 'Mise à jour du statut de consommation d\'un repas', {
        dailyProgressId,
        mealId,
        dailyPlanMealId,
        consumed,
        pourcentageConsomme
      });

      // Appeler la méthode du serveur MCP qui gère la logique SQL
      const result = await sqliteMCPServer.markMealAsConsumedViaMCP(
        dailyProgressId,
        mealId,
        dailyPlanMealId,
        consumed,
        pourcentageConsomme
      );

      if (!result.success) {
        throw new Error(result.error || 'Erreur lors de la mise à jour du repas');
      }

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(LogCategory.DATABASE, `Erreur lors de la mise à jour du statut de consommation: ${errorMessage}`, {
        dailyProgressId,
        mealId,
        consumed
      });
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Récupère la progression quotidienne pour une date spécifique
   * @param date - Date au format YYYY-MM-DD
   * @returns Progression quotidienne ou erreur
   */
  async getDailyProgressByDate(
    date: string
  ): Promise<{
    success: boolean;
    error?: string;
    dailyProgress?: DailyProgressOrmProps;
  }> {
    try {
      const userId = getCurrentUserIdSync();
      if (!userId) {
        logger.error(LogCategory.AUTH, 'Authentification requise pour récupérer la progression quotidienne');
        return { success: false, error: 'Vous devez être connecté pour récupérer votre progression' };
      }

      logger.info(LogCategory.DATABASE, `Récupération de la progression quotidienne pour ${date}`);
      
      return await sqliteMCPServer.getDailyProgressByDateViaMCP(userId, date);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(LogCategory.DATABASE, `Erreur lors de la récupération de la progression: ${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Récupère les repas associés à une progression quotidienne
   * @param dailyProgressId - ID de la progression quotidienne
   * @returns Repas associés ou erreur
   */
  async getMealsForDailyProgress(
    dailyProgressId: number
  ): Promise<{
    success: boolean;
    error?: string;
    meals?: DailyMealProgressOrmProps[];
  }> {
    try {
      logger.info(LogCategory.DATABASE, `Récupération des repas pour la progression quotidienne ${dailyProgressId}`);
      
      return await sqliteMCPServer.getMealProgressByDailyProgressViaMCP(dailyProgressId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(LogCategory.DATABASE, `Erreur lors de la récupération des repas pour la progression: ${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Récupère les progressions quotidiennes associées à un plan
   * @param planId - ID du plan nutritionnel
   * @returns Progressions quotidiennes associées ou erreur
   */
  async getProgressionsByPlan(
    planId: number
  ): Promise<{
    success: boolean;
    error?: string;
    progressions?: DailyProgressOrmProps[];
  }> {
    try {
      const userId = getCurrentUserIdSync();
      if (!userId) {
        logger.error(LogCategory.AUTH, 'Authentification requise pour récupérer les progressions');
        return { success: false, error: 'Vous devez être connecté pour récupérer vos progressions' };
      }

      logger.info(LogCategory.DATABASE, `Récupération des progressions associées au plan ${planId}`);
      
      return await sqliteMCPServer.getDailyProgressByPlanViaMCP(userId, planId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(LogCategory.DATABASE, `Erreur lors de la récupération des progressions: ${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Crée une nouvelle progression quotidienne
   * @param date - Date de la progression (format ISO)
   * @returns Progression créée ou erreur
   */
  async createDailyProgress(
    date: string
  ): Promise<{
    success: boolean;
    error?: string;
    dailyProgressId?: number;
  }> {
    try {
      const userId = getCurrentUserIdSync();
      if (!userId) {
        logger.error(LogCategory.AUTH, 'Authentification requise pour créer une progression');
        return { success: false, error: 'Vous devez être connecté pour enregistrer votre progression' };
      }

      logger.info(LogCategory.DATABASE, `Création de la progression quotidienne pour ${date}`);
      
      return await sqliteMCPServer.createDailyProgressViaMCP(userId, date);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(LogCategory.DATABASE, `Erreur lors de la création de la progression: ${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Met à jour une progression quotidienne existante
   * @param progressId - ID de la progression à mettre à jour
   * @param data - Données de mise à jour (partiel)
   * @returns Résultat de l'opération
   */
  async updateDailyProgress(
    progressId: number,
    data: Partial<typeof schema.dailyProgress.$inferSelect>
  ): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      logger.info(LogCategory.DATABASE, `Mise à jour de la progression quotidienne ${progressId}`);
      
      return await sqliteMCPServer.updateDailyProgressViaMCP(progressId, data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(LogCategory.DATABASE, `Erreur lors de la mise à jour de la progression: ${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Récupère les repas avec leur progression pour une date spécifique
   * @param date - Date au format YYYY-MM-DD
   * @returns Repas avec progression ou erreur
   */
  async getMealProgressByDate(
    date: string
  ): Promise<{
    success: boolean;
    error?: string;
    meals?: any[];
  }> {
    try {
      const userId = getCurrentUserIdSync();
      if (!userId) {
        logger.error(LogCategory.AUTH, 'Authentification requise pour récupérer la progression des repas');
        return { success: false, error: 'Vous devez être connecté pour récupérer votre progression' };
      }

      logger.info(LogCategory.DATABASE, `Récupération de la progression des repas pour ${date}`);
      
      return await sqliteMCPServer.getMealProgressByDateViaMCP(userId, date);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(LogCategory.DATABASE, `Erreur lors de la récupération de la progression des repas: ${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Invalide le cache après une opération sur une progression
   * @param queryClient - Instance du queryClient pour la gestion du cache
   * @param progressionId - Identifiant de la progression modifiée
   */
  invalidateProgressionCache(queryClient: ReturnType<typeof useQueryClient>, progressionId: number) {
    return invalidateCache(queryClient, DataType.PROGRESS, { 
      id: progressionId, 
      invalidateRelated: true 
    });
  }
};

// Pour rétrocompatibilité, on exporte aussi l'ancienne fonction
export const markMealAsConsumed = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  dailyProgressId: number,
  mealId: number,
  dailyPlanMealId: number,
  consumed: boolean,
  pourcentageConsomme: number = 100
): Promise<{ success: boolean; message: string }> => {
  logger.warn(LogCategory.DEPRECATED, 'La fonction markMealAsConsumed est dépréciée, utilisez progressService.markMealAsConsumed à la place');
  
  const result = await progressService.markMealAsConsumed(
    dailyProgressId,
    mealId,
    dailyPlanMealId,
    consumed,
    pourcentageConsomme
  );
  
  return { 
    success: result.success,
    message: result.error || 'Opération réussie'
  };
};
