/**
 * Service d'orchestration pour les pages d'analyse (UI)
 * Toute la logique métier doit passer par analyticsService.
 */
import { OperationResult } from "@/utils/interfaces/pages.interface";
import { analyticsService, NutritionStatistics } from "@/utils/services/core/analytics.service";
import { logger } from "@/utils/services/common/logging.service";
import { LogCategory } from "@/utils/enum/logging.enum";

class AnalyticsPagesService {
  /**
   * Récupère les statistiques nutritionnelles pour un utilisateur
   * @param userId ID de l'utilisateur
   * @returns Résultat d'opération contenant les statistiques
   */
  async getUserNutritionStatistics(userId: number): Promise<OperationResult<NutritionStatistics>> {
    try {
      logger.info(LogCategory.USER, 'Page Analytics - Récupération des statistiques utilisateur', { userId });
      
      // Délégation au service métier
      return await analyticsService.getUserNutritionStatistics(userId);
    } catch (error) {
      logger.error(LogCategory.USER, 'Page Analytics - Erreur lors de la récupération des statistiques', { error, userId });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue lors de la récupération des statistiques'
      };
    }
  }
}

export const analyticsPagesService = new AnalyticsPagesService();
