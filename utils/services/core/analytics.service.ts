/**
 * Service métier pour les analyses nutritionnelles
 * Respecte l'architecture MCP en centralisant la logique des analytics
 */
import sqliteMCPServer from "@/utils/mcp/sqlite-server";
import { OperationResult } from "@/utils/interfaces/pages.interface";
import { logger } from "@/utils/services/common/logging.service";
import { LogCategory } from "@/utils/enum/logging.enum";
import { MealOrmProps } from "@/db/schema";

export interface NutritionStatistics {
  caloriesAverageDaily: number;
  proteinsAverageDaily: number;
  carbsAverageDaily: number;
  fatsAverageDaily: number;
  mealsCount: number;
  plansCount: number;
}

class AnalyticsService {
  /**
   * Récupère les statistiques nutritionnelles pour un utilisateur
   * @param userId ID de l'utilisateur
   * @returns Résultat d'opération contenant les statistiques
   */
  async getUserNutritionStatistics(userId: number): Promise<OperationResult<NutritionStatistics>> {
    try {
      logger.info(LogCategory.USER, 'Récupération des statistiques pour l\'utilisateur', { userId });
      
      // Récupération des repas de l'utilisateur via MCP
      const mealsResult = await sqliteMCPServer.getMealsListViaMCP(userId);
      
      // Récupération des plans de l'utilisateur via MCP
      const plansResult = await sqliteMCPServer.getPlansListViaMCP(userId);
      
      // Si les résultats sont undefined ou ne contiennent pas les bons champs
      if (!mealsResult || !plansResult) {
        return {
          success: false,
          error: 'Erreur lors de la récupération des données'
        };
      }
      
      // Extraction et sécurisation des données
      const meals = Array.isArray(mealsResult.meals) ? mealsResult.meals : [];
      const plans = Array.isArray(plansResult.plans) ? plansResult.plans : [];
      
      // Calcul des statistiques de base
      let totalCalories = 0;
      let totalProteins = 0;
      let totalCarbs = 0;
      let totalFats = 0;
      
      // Agrégation des données nutritionnelles des repas
      for (const meal of meals) {
        if (meal) {
          totalCalories += Number(meal.calories || 0);
          totalProteins += Number(meal.protein || 0);
          totalCarbs += Number(meal.carbs || 0);
          totalFats += Number(meal.fat || 0);
        }
      }
      
      // Calcul des moyennes journalières (divisé par 7 pour obtenir une moyenne hebdomadaire)
      // Note: Cette logique peut être affinée en fonction des besoins spécifiques
      const dailyDivisor = meals.length > 0 ? Math.ceil(meals.length / 7) : 1;
      
      const statistics: NutritionStatistics = {
        caloriesAverageDaily: Math.round(totalCalories / dailyDivisor),
        proteinsAverageDaily: Math.round(totalProteins / dailyDivisor),
        carbsAverageDaily: Math.round(totalCarbs / dailyDivisor),
        fatsAverageDaily: Math.round(totalFats / dailyDivisor),
        mealsCount: meals.length,
        plansCount: plans.length
      };
      
      return {
        success: true,
        data: statistics
      };
    } catch (error) {
      logger.error(LogCategory.USER, 'Erreur lors de la récupération des statistiques', { error, userId });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }
}

export const analyticsService = new AnalyticsService();
