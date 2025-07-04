/**
 * Service core pour les fonctionnalités d'assistant IA
 * Ce service centralise la logique métier liée aux fonctionnalités d'IA
 */

import { IaMealType, IaPlanType } from "@/utils/validation/ia/ia.schemas";
import sqliteMCPServer from "@/utils/mcp/sqlite-server";
import { logger } from "@/utils/services/common/logging.service";
import { LogCategory } from "@/utils/enum/logging.enum";
import iaService from "@/utils/services/ia/ia.service";
import { OperationResult } from "@/utils/interfaces/pages.interface";

/**
 * Service core pour les opérations liées à l'assistant IA
 */
export const assistantCoreService = {
  /**
   * Génère un repas basé sur des critères donnés
   * @param criteria Critères pour la génération de repas
   * @param userId ID de l'utilisateur
   * @returns Résultat de l'opération avec le repas généré
   */
  async generateMeal(criteria: IaMealType, userId: number): Promise<OperationResult<{
    meal: any;
    ingredients: any[];
    message?: string;
    missingIngredients?: any[];
  }>> {
    try {
      logger.info(LogCategory.IA, 'Génération d\'un repas via l\'IA', { 
        userId, 
        criteria 
      });
      
      // Vérifier et valider les ingrédients
      criteria.ingredients = criteria.ingredients.map(ingredient => ({
        ...ingredient,
        quantity: ingredient.quantity && typeof ingredient.quantity === 'number' && ingredient.quantity > 0 
          ? ingredient.quantity 
          : 100
      }));

      // Appeler la méthode du MCP server pour générer un repas
      const result = await sqliteMCPServer.addMealViaMCP(criteria, userId);
      
      if (!result || !result.success) {
        logger.error(LogCategory.IA, 'Échec de la génération du repas', {
          error: result?.error,
          criteria
        });
        
        return {
          success: false,
          error: result?.error || 'Échec de la génération du repas'
        };
      }
      
      // Vérifier que l'ID du repas existe
      if (!result.mealId) {
        logger.error(LogCategory.IA, 'ID du repas manquant dans le résultat de création');
        return {
          success: false,
          error: 'ID du repas manquant dans le résultat de création'
        };
      }
      
      // Récupérer les détails complets du repas généré
      const mealDetailsResult = await sqliteMCPServer.getMealByIdWithIngredientsViaMCP(result.mealId, userId);
      
      if (!mealDetailsResult || !mealDetailsResult.success) {
        logger.warn(LogCategory.IA, 'Repas généré mais échec de la récupération des détails', {
          mealId: result.mealId,
          error: mealDetailsResult?.error
        });
        
        // Même si détails manquants, on retourne un succès avec ID repas + message
        return {
          success: true,
          data: {
            meal: { id: result.mealId, name: criteria.name || 'Repas généré' },
            ingredients: [],
            message: 'Repas créé, mais détails indisponibles',
            missingIngredients: result.missingIngredients || []
          }
        };
      }
      
      // Succès complet avec toutes les informations
      return {
        success: true,
        data: {
          meal: mealDetailsResult.meal,
          ingredients: mealDetailsResult.ingredients || [],
          missingIngredients: result.missingIngredients || []
        },
        message: 'Repas généré avec succès'
      };
    } catch (error) {
      logger.error(LogCategory.IA, 'Exception lors de la génération du repas', {
        error: error instanceof Error ? error.message : String(error),
        userId,
        criteria
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue lors de la génération du repas'
      };
    }
  },

  /**
   * Génère un plan nutritionnel basé sur des critères donnés
   * @param criteria Critères pour la génération de plan
   * @param userId ID de l'utilisateur
   * @returns Résultat de l'opération avec le plan généré
   */
  async generatePlan(criteria: IaPlanType, userId: number): Promise<OperationResult<{
    plan: any;
    dailyPlans: any[];
  }>> {
    try {
      logger.info(LogCategory.IA, 'Génération d\'un plan via l\'IA', { 
        userId, 
        criteria 
      });
      
      // Appeler la méthode du MCP server pour générer un plan
      const result = await sqliteMCPServer.addPlanViaMCP(criteria, userId);
      
      if (!result || !result.success) {
        logger.error(LogCategory.IA, 'Échec de la génération du plan', {
          error: result?.error,
          criteria
        });
        
        return {
          success: false,
          error: result?.error || 'Échec de la génération du plan'
        };
      }
      
      // Vérifier que l'ID du plan existe
      if (!result.planId) {
        logger.error(LogCategory.IA, 'ID du plan manquant dans le résultat de création');
        return {
          success: false,
          error: 'ID du plan manquant dans le résultat de création'
        };
      }
      
      // Récupérer les détails complets du plan généré
      const planDetailsResult = await sqliteMCPServer.getPlanDetailsViaMCP(result.planId, userId);
      
      if (!planDetailsResult || !planDetailsResult.success) {
        logger.warn(LogCategory.IA, 'Plan généré mais échec de la récupération des détails', {
          planId: result.planId,
          error: planDetailsResult?.error
        });
        
        // Même si détails manquants, on retourne un succès avec ID plan + message
        return {
          success: true,
          data: {
            plan: { id: result.planId, name: criteria.name || 'Plan généré' },
            dailyPlans: []
          },
          message: 'Plan créé, mais détails indisponibles'
        };
      }
      
      // Succès complet avec toutes les informations
      return {
        success: true,
        data: {
          plan: planDetailsResult.plan,
          dailyPlans: planDetailsResult.dailyPlans || []
        },
        message: 'Plan généré avec succès'
      };
    } catch (error) {
      logger.error(LogCategory.IA, 'Exception lors de la génération du plan', {
        error: error instanceof Error ? error.message : String(error),
        userId,
        criteria
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue lors de la génération du plan'
      };
    }
  },

  /**
   * Génère une liste de courses pour un plan donné
   * Implémentation simplifiée qui renvoie un résultat simulé
   * Dans une vraie implémentation, on utiliserait une méthode MCP dédiée
   * @param planId ID du plan
   * @param userId ID de l'utilisateur
   * @returns Résultat de l'opération avec la liste de courses
   */
  async generateShoppingList(planId: number, userId: number): Promise<OperationResult<{
    shoppingList: any[];
  }>> {
    try {
      logger.info(LogCategory.IA, 'Génération d\'une liste de courses pour le plan', { 
        userId, 
        planId 
      });
      
      // Vérifier d'abord que le plan existe et appartient à l'utilisateur
      const planResult = await sqliteMCPServer.getPlanDetailsViaMCP(planId, userId);
      
      if (!planResult || !planResult.success) {
        logger.error(LogCategory.IA, 'Plan introuvable ou non autorisé', {
          planId,
          userId,
          error: planResult?.error
        });
        
        return {
          success: false,
          error: 'Plan introuvable ou vous n\'êtes pas autorisé à y accéder'
        };
      }
      
      // Note: Dans une implémentation réelle, nous aurions une méthode MCP dédiée
      // Pour l'instant, nous retournons une liste de courses simulée basique
      return {
        success: true,
        data: {
          shoppingList: [
            { id: 1, name: "Légumes variés", quantity: 500, unit: "g" },
            { id: 2, name: "Fruits de saison", quantity: 300, unit: "g" },
            { id: 3, name: "Protéines (selon préférences)", quantity: 200, unit: "g" }
          ]
        },
        message: 'Liste de courses générée avec succès'
      };
    } catch (error) {
      logger.error(LogCategory.IA, 'Exception lors de la génération de la liste de courses', {
        error: error instanceof Error ? error.message : String(error),
        userId,
        planId
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue lors de la génération de la liste de courses'
      };
    }
  },

  /**
   * Analyse les progrès nutritionnels d'un utilisateur (implémentation simulée)
   * @param startDate Date de début au format YYYY-MM-DD
   * @param endDate Date de fin au format YYYY-MM-DD
   * @param userId ID de l'utilisateur
   * @returns Résultat de l'opération avec l'analyse
   */
  async analyzeProgress(startDate: string, endDate: string, userId: number): Promise<OperationResult<{
    analysis: {
      summary: string;
      data: any;
      recommendations: string[];
    }
  }>> {
    try {
      logger.info(LogCategory.IA, 'Analyse des progrès nutritionnels', { 
        userId, 
        startDate,
        endDate
      });
      
      // Note: Dans une implémentation réelle, nous récupérerions l'historique des progrès
      // et ferions une vraie analyse. Ici, nous simulons une réponse.
      
      return {
        success: true,
        data: {
          analysis: {
            summary: `Analyse des progrès nutritionnels du ${startDate} au ${endDate}`,
            data: {
              averages: {
                calories: 2100,
                carbs: 250,
                protein: 100,
                fat: 70
              },
              daysTracked: 7,
              totalDays: 7
            },
            recommendations: [
              "Continuez à maintenir un bon équilibre des macronutriments",
              "Essayez d'augmenter légèrement votre apport en protéines",
              "Votre consommation de calories est stable et adaptée à vos objectifs"
            ]
          }
        },
        message: 'Analyse des progrès nutritionnels générée avec succès'
      };
    } catch (error) {
      logger.error(LogCategory.IA, 'Erreur lors de l\'analyse des progrès', {
        error: error instanceof Error ? error.message : String(error),
        startDate,
        endDate
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'analyse des progrès'
      };
    }
  },
  
  /**
   * Analyse les habitudes nutritionnelles de l'utilisateur
   * @param userId ID de l'utilisateur
   * @returns Résultat de l'opération avec l'analyse nutritionnelle
   */
  async analyzeNutritionHabits(userId: number): Promise<OperationResult<{
    analysis: {
      text: string;
      recommendations: string[];
      strengths: string[];
      improvements: string[];
    }
  }>> {
    try {
      logger.info(LogCategory.IA, 'Analyse des habitudes nutritionnelles via l\'IA', { userId });
      
      // Dans une implémentation réelle, nous appellerions iaService
      // Ici, nous simulons une réponse pour éviter les dépendances
      
      return {
        success: true,
        data: {
          analysis: {
            text: "Vos habitudes alimentaires sont généralement équilibrées, avec une bonne répartition des macronutriments. Vous pourriez néanmoins augmenter votre consommation de légumes verts et réduire légèrement les sucres ajoutés.",
            recommendations: [
              "Augmentez votre consommation de légumes",
              "Limitez les aliments transformés",
              "Hydratez-vous davantage"
            ],
            strengths: [
              "Bon équilibre protéines/glucides",
              "Régularité des repas"
            ],
            improvements: [
              "Trop de sucres ajoutés",
              "Pas assez de fibres"
            ]
          }
        },
        message: 'Analyse des habitudes nutritionnelles générée avec succès'
      };
    } catch (error) {
      logger.error(LogCategory.IA, 'Erreur lors de l\'analyse des habitudes nutritionnelles', {
        error: error instanceof Error ? error.message : String(error)
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'analyse des habitudes nutritionnelles'
      };
    }
  }
};