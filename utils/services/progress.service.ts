/**
 * Service pour la gestion de la progression
 * Ce service encapsule la logique métier liée à la progression des repas et des objectifs
 */

import { LogCategory } from "../enum/logging.enum";
import { logger } from "./logging.service";
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import * as schema from '@/db/schema';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';

/**
 * Marque un repas comme consommé ou non dans la progression quotidienne
 * @param drizzleDb - Instance de la base de données Drizzle
 * @param dailyProgressId - ID de la progression quotidienne
 * @param mealId - ID du repas
 * @param dailyPlanMealId - ID du repas dans le plan quotidien
 * @param consumed - Indique si le repas est consommé ou non
 * @param pourcentageConsomme - Pourcentage de consommation (optionnel, défaut à 100%)
 * @returns Résultat de l'opération
 */
export const markMealAsConsumed = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  dailyProgressId: number,
  mealId: number,
  dailyPlanMealId: number,
  consumed: boolean,
  pourcentageConsomme: number = 100
): Promise<{ success: boolean; message: string }> => {
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

    return {
      success: true,
      message: consumed 
        ? 'Repas marqué comme consommé !' 
        : 'Repas remis dans la liste "à consommer"'
    };
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Erreur lors de la mise à jour du statut de consommation', {
      error: error instanceof Error ? error.message : String(error),
      dailyProgressId,
      mealId
    });

    throw error;
  }
};
