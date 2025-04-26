/**
 * Service pour la gestion des pages d'assistant IA
 * Ce service encapsule la logique métier liée aux fonctionnalités d'IA
 */

import { AssistantPagesServiceInterface, OperationResult } from "@/utils/interfaces/pages.interface";
import { IaMealType, IaPlanType } from "@/utils/validation/ia/ia.schemas";
import sqliteMCPServer from "@/utils/mcp/sqlite-server";
import { logger } from "@/utils/services/logging.service";
import { LogCategory } from "@/utils/enum/logging.enum";
import { getCurrentUserIdSync } from "@/utils/helpers/userContext";

/**
 * Service pour les opérations liées aux pages d'assistant IA
 * Implémente l'interface AssistantPagesServiceInterface
 */
class AssistantPagesService implements AssistantPagesServiceInterface {
  /**
   * Génère un repas basé sur des critères donnés
   * @param criteria Critères pour la génération de repas
   * @returns Résultat de l'opération avec le repas généré
   */
  async generateMeal(criteria: IaMealType): Promise<OperationResult<{
    meal: any;
    ingredients: any[];
  }>> {
    try {
      // Récupérer l'ID utilisateur et gérer le cas où il est null
      const userIdOrNull = getCurrentUserIdSync();
      if (userIdOrNull === null) {
        logger.error(LogCategory.AUTH, 'Utilisateur non authentifié pour générer un repas');
        return {
          success: false,
          error: 'Utilisateur non authentifié'
        };
      }
      
      const userId = userIdOrNull;
      
      logger.info(LogCategory.IA, 'Génération d\'un repas via l\'IA', { 
        userId, 
        criteria 
      });
      
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
        
        return {
          success: true,
          data: {
            meal: { id: result.mealId },
            ingredients: []
          },
          message: 'Repas généré avec succès, mais détails incomplets'
        };
      }
      
      return {
        success: true,
        data: {
          meal: mealDetailsResult.meal,
          ingredients: mealDetailsResult.ingredients || []
        },
        message: 'Repas généré avec succès'
      };
    } catch (error) {
      logger.error(LogCategory.IA, 'Erreur lors de la génération du repas', {
        error: error instanceof Error ? error.message : String(error),
        criteria
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue lors de la génération du repas'
      };
    }
  }
  
  /**
   * Génère un plan nutritionnel basé sur des critères donnés
   * @param criteria Critères pour la génération de plan
   * @returns Résultat de l'opération avec le plan généré
   */
  async generatePlan(criteria: IaPlanType): Promise<OperationResult<{
    plan: any;
    dailyPlans: any[];
  }>> {
    try {
      // Récupérer l'ID utilisateur et gérer le cas où il est null
      const userIdOrNull = getCurrentUserIdSync();
      if (userIdOrNull === null) {
        logger.error(LogCategory.AUTH, 'Utilisateur non authentifié pour générer un plan');
        return {
          success: false,
          error: 'Utilisateur non authentifié'
        };
      }
      
      const userId = userIdOrNull;
      
      logger.info(LogCategory.IA, 'Génération d\'un plan nutritionnel via l\'IA', { 
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
      
      // Récupérer les détails complets du plan généré avec ses plans journaliers
      const planDetailsResult = await sqliteMCPServer.getPlanDetailsViaMCP(result.planId, userId);
      
      if (!planDetailsResult || !planDetailsResult.success) {
        logger.warn(LogCategory.IA, 'Plan généré mais échec de la récupération des détails', {
          planId: result.planId,
          error: planDetailsResult?.error
        });
        
        return {
          success: true,
          data: {
            plan: { id: result.planId },
            dailyPlans: []
          },
          message: 'Plan généré avec succès, mais détails incomplets'
        };
      }
      
      return {
        success: true,
        data: {
          plan: planDetailsResult.plan,
          dailyPlans: planDetailsResult.dailyPlans || []
        },
        message: 'Plan nutritionnel généré avec succès'
      };
    } catch (error) {
      logger.error(LogCategory.IA, 'Erreur lors de la génération du plan', {
        error: error instanceof Error ? error.message : String(error),
        criteria
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue lors de la génération du plan'
      };
    }
  }
  
  /**
   * Génère une liste de courses pour un plan donné
   * @param planId ID du plan
   * @returns Résultat de l'opération avec la liste de courses
   */
  async generateShoppingList(planId: number): Promise<OperationResult<{
    shoppingList: any[];
  }>> {
    try {
      // Récupérer l'ID utilisateur et gérer le cas où il est null
      const userIdOrNull = getCurrentUserIdSync();
      if (userIdOrNull === null) {
        logger.error(LogCategory.AUTH, 'Utilisateur non authentifié pour générer une liste de courses');
        return {
          success: false,
          error: 'Utilisateur non authentifié'
        };
      }
      
      const userId = userIdOrNull;
      
      logger.info(LogCategory.IA, 'Génération d\'une liste de courses', { 
        userId, 
        planId 
      });
      
      // Vérifier si le plan existe
      const planResult = await sqliteMCPServer.getPlanDetailsViaMCP(planId, userId);
      
      if (!planResult || !planResult.success) {
        logger.error(LogCategory.IA, 'Plan non trouvé pour la génération de liste de courses', {
          planId,
          error: planResult?.error
        });
        
        return {
          success: false,
          error: 'Plan non trouvé'
        };
      }
      
      // Pour l'instant, nous allons créer une logique simplifiée de génération de liste de courses
      // basée sur les ingrédients des repas inclus dans le plan
      
      const shoppingItems: any[] = [];
      const uniqueIngredients = new Map();
      
      // Si la structure du plan le permet, parcourir les plans journaliers et leurs repas
      if (planResult.dailyPlans && planResult.dailyPlans.length > 0) {
        for (const dailyPlan of planResult.dailyPlans) {
          // Si il existe une méthode pour récupérer les repas d'un plan journalier
          if (dailyPlan.id) {
            try {
              // Récupérer les repas du plan journalier (méthode hypothétique)
              const dailyPlanMeals = await sqliteMCPServer.getMealsListViaMCP(userId);
              
              if (dailyPlanMeals && Array.isArray(dailyPlanMeals)) {
                for (const meal of dailyPlanMeals) {
                  if (meal.id) {
                    // Récupérer les ingrédients du repas
                    const mealDetails = await sqliteMCPServer.getMealByIdWithIngredientsViaMCP(meal.id, userId);
                    
                    if (mealDetails && mealDetails.success && mealDetails.ingredients) {
                      for (const ingredient of mealDetails.ingredients) {
                        // Agréger les ingrédients similaires
                        if (uniqueIngredients.has(ingredient.id)) {
                          const existingIngredient = uniqueIngredients.get(ingredient.id);
                          existingIngredient.quantity += ingredient.quantity;
                        } else {
                          uniqueIngredients.set(ingredient.id, { ...ingredient });
                        }
                      }
                    }
                  }
                }
              }
            } catch (e) {
              logger.warn(LogCategory.IA, 'Erreur lors de la récupération des repas d\'un plan journalier', {
                dailyPlanId: dailyPlan.id,
                error: e instanceof Error ? e.message : String(e)
              });
            }
          }
        }
      }
      
      // Convertir la Map en tableau pour le résultat
      uniqueIngredients.forEach(ingredient => {
        shoppingItems.push(ingredient);
      });
      
      return {
        success: true,
        data: {
          shoppingList: shoppingItems
        },
        message: 'Liste de courses générée avec succès'
      };
    } catch (error) {
      logger.error(LogCategory.IA, 'Erreur lors de la génération de la liste de courses', {
        error: error instanceof Error ? error.message : String(error),
        planId
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue lors de la génération de la liste de courses'
      };
    }
  }
  
  /**
   * Analyse les progrès nutritionnels d'un utilisateur et fournit des recommandations
   * @param startDate Date de début de l'analyse au format YYYY-MM-DD
   * @param endDate Date de fin de l'analyse au format YYYY-MM-DD
   * @returns Résultat de l'opération avec l'analyse et les recommandations
   */
  async analyzeProgress(startDate: string, endDate: string): Promise<OperationResult<{
    analysis: {
      summary: string;
      data: any;
      recommendations: string[];
    }
  }>> {
    try {
      // Récupérer l'ID utilisateur et gérer le cas où il est null
      const userIdOrNull = getCurrentUserIdSync();
      if (userIdOrNull === null) {
        logger.error(LogCategory.AUTH, 'Utilisateur non authentifié pour analyser les progrès');
        return {
          success: false,
          error: 'Utilisateur non authentifié'
        };
      }
      
      const userId = userIdOrNull;
      
      logger.info(LogCategory.IA, 'Analyse des progrès nutritionnels', { 
        userId, 
        startDate,
        endDate
      });
      
      // Récupérer les préférences et objectifs de l'utilisateur
      const userContext = await sqliteMCPServer.getUserContextViaMCP(userId);
      
      if (!userContext || !userContext.success) {
        logger.error(LogCategory.IA, 'Échec de la récupération du contexte utilisateur', {
          userId,
          error: userContext?.error
        });
        
        return {
          success: false,
          error: 'Contexte utilisateur manquant pour l\'analyse'
        };
      }
      
      // Récupérer l'historique d'activité
      const activityHistory = await sqliteMCPServer.getUserActivityHistoryViaMCP(userId, 30); // Derniers 30 jours
      
      if (!activityHistory || !activityHistory.success) {
        logger.warn(LogCategory.IA, 'Échec de la récupération de l\'historique d\'activité', {
          userId,
          error: activityHistory?.error
        });
      }
      
      // Récupérer les progressions quotidiennes pour la période
      // Calcul du nombre de jours entre startDate et endDate
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      
      if (days <= 0) {
        logger.error(LogCategory.IA, 'Plage de dates invalide pour l\'analyse');
        return {
          success: false,
          error: 'La date de début doit être antérieure ou égale à la date de fin'
        };
      }
      
      // Limiter à 31 jours maximum
      const maxDays = Math.min(days, 31);
      const dailyProgressData: any[] = [];
      
      // Pour chaque jour dans la plage, récupérer la progression
      const currentDate = new Date(start);
      for (let i = 0; i < maxDays; i++) {
        const dateStr = currentDate.toISOString().split('T')[0]; // Format YYYY-MM-DD
        
        // Récupérer la progression pour cette date
        // eslint-disable-next-line no-await-in-loop
        const result = await sqliteMCPServer.getDailyProgressByDateViaMCP(userId, dateStr);
        
        if (result && result.success && result.progress) {
          dailyProgressData.push({
            date: dateStr,
            progress: result.progress
          });
        }
        
        // Passer au jour suivant
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      // Analyser les données et générer des recommandations
      // Ceci est une logique simplifiée d'analyse, à étendre selon les besoins
      
      const caloriesAverage = dailyProgressData.reduce((sum, day) => sum + (day.progress.calories || 0), 0) / Math.max(dailyProgressData.length, 1);
      const carbsAverage = dailyProgressData.reduce((sum, day) => sum + (day.progress.carbs || 0), 0) / Math.max(dailyProgressData.length, 1);
      const proteinAverage = dailyProgressData.reduce((sum, day) => sum + (day.progress.protein || 0), 0) / Math.max(dailyProgressData.length, 1);
      const fatAverage = dailyProgressData.reduce((sum, day) => sum + (day.progress.fat || 0), 0) / Math.max(dailyProgressData.length, 1);
      
      const recommendations: string[] = [];
      
      // Exemple de recommandation basée sur objectifs et moyennes
      // Utiliser le contexte utilisateur pour les recommandations
      // Note: Dans la vraie implémentation, il faudrait adapter le code pour accéder aux bonnes propriétés
      // Supposons que le contexte utilisateur contient les valeurs dans le contexte général
      const userCalories = userContext?.context ? parseFloat(userContext.context.match(/[Cc]alories:\s*(\d+)/)?.[1] || '0') : 0;
      const userProtein = userContext?.context ? parseFloat(userContext.context.match(/[Pp]rotein:\s*(\d+)/)?.[1] || '0') : 0;
      
      if (userCalories > 0 && caloriesAverage < userCalories * 0.8) {
        recommendations.push('Votre apport calorique est significativement en dessous de votre objectif. Essayez d\'augmenter vos portions ou d\'ajouter des collations nutritives.');
      } else if (userCalories > 0 && caloriesAverage > userCalories * 1.2) {
        recommendations.push('Votre apport calorique dépasse votre objectif. Considérez de réduire légèrement vos portions.');
      }
      
      if (userProtein > 0 && proteinAverage < userProtein * 0.8) {
        recommendations.push('Votre apport en protéines est insuffisant. Intégrez davantage de sources de protéines comme les œufs, le poulet ou les légumineuses.');
      }
      
      // Ajouter d'autres recommandations selon les besoins...
      
      if (recommendations.length === 0) {
        recommendations.push('Vos habitudes alimentaires correspondent bien à vos objectifs. Continuez sur cette voie !');
      }
      
      return {
        success: true,
        data: {
          analysis: {
            summary: `Analyse des progrès nutritionnels du ${startDate} au ${endDate}`,
            data: {
              averages: {
                calories: caloriesAverage,
                carbs: carbsAverage,
                protein: proteinAverage,
                fat: fatAverage
              },
              daysTracked: dailyProgressData.length,
              totalDays: days
            },
            recommendations
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
  }
}

// Exporter une instance singleton du service
export const assistantPagesService = new AssistantPagesService();
