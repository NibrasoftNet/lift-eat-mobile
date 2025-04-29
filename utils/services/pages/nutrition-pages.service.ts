import { OperationResult } from "@/utils/interfaces/pages.interface";
import { nutritionService } from "@/utils/services/nutritionService";
import { logger } from "@/utils/services/logging.service";
import { LogCategory } from "@/utils/enum/logging.enum";

/**
 * Service d'orchestration pour les pages de nutrition (UI)
 * Toute la logique métier doit passer par nutritionService.
 */
class NutritionPagesService {
  
  /**
   * Récupère ou calcule les besoins caloriques d'un utilisateur
   * @param userProfile Profil de l'utilisateur avec ses caractéristiques
   * @returns Opération avec les besoins caloriques calculés
   */
  async calculateCaloriesIntake(userProfile: {
    age: number;
    gender: string;
    weight: number;
    height: number;
    physicalActivity: string;
  }): Promise<OperationResult<{ dailyCalories: number }>> {
    try {
      const dailyCalories = nutritionService.calculateCaloriesIntake(userProfile);
      
      return {
        success: true,
        data: { dailyCalories }
      };
    } catch (error) {
      logger.error(LogCategory.DATABASE, "Erreur lors du calcul des besoins caloriques", { 
        error: error instanceof Error ? error.message : String(error),
        userProfile 
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
        data: { dailyCalories: 0 }
      };
    }
  }

  /**
   * Met à jour les préférences nutritionnelles d'un utilisateur
   * @param userId ID de l'utilisateur
   * @param preferences Préférences nutritionnelles à mettre à jour
   * @returns Résultat de l'opération
   */
  async updateUserNutritionPreferences(userId: number, preferences: any): Promise<OperationResult<any>> {
    try {
      // Déléguer à userService via sqliteMCPServer
      const result = await nutritionService.updateUserNutritionPreferences(userId, preferences);
      
      return {
        success: true,
        data: result
      };
    } catch (error) {
      logger.error(LogCategory.DATABASE, "Erreur lors de la mise à jour des préférences nutritionnelles", { 
        error: error instanceof Error ? error.message : String(error),
        userId,
        preferences 
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
        data: null
      };
    }
  }

  /**
   * Crée un nouveau plan nutritionnel
   * @param planData Les données du plan à créer
   * @param userId L'ID de l'utilisateur
   * @returns Promise avec le résultat de l'opération contenant l'ID du plan créé
   */
  async createPlan(planData: any, userId: number): Promise<OperationResult<{planId?: number}>> {
    try {
      logger.info(LogCategory.DATABASE, 'Demande de création d\'un plan nutritionnel', { userId });
      
      return nutritionService.createPlan(planData, userId);
    } catch (error) {
      logger.error(LogCategory.DATABASE, 'Erreur lors de la demande de création de plan', { 
        userId, 
        error: error instanceof Error ? error.message : String(error) 
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur lors de la création du plan nutritionnel',
        data: { planId: undefined }
      };
    }
  }
}

export const nutritionPagesService = new NutritionPagesService();
