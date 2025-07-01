import { OperationResult } from "@/utils/interfaces/pages.interface";
import { nutritionEngine } from "@/utils/engines/nutrition-engine";
import { nutritionCoreService } from "../core/nutrition-core.service";
import { logger } from "@/utils/services/common/logging.service";
import { LogCategory } from "@/utils/enum/logging.enum";
import { NutritionDisplayMode } from "@/utils/enum/nutrition.enum";
import { MacroNutrientsBase } from "@/types/nutrition.type";

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
      const dailyCalories = nutritionCoreService.calculateCaloriesIntake(userProfile);
      
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
      const result = await nutritionCoreService.updateUserNutritionPreferences(userId, preferences);
      
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
      
      return nutritionCoreService.createPlan(planData, userId);
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
  /**
   * Récupère les valeurs nutritionnelles d'un repas formatées pour l'affichage
   * Cette méthode orchestre les données pour les composants UI
   * 
   * @param mealId ID du repas
   * @param quantity Quantité spécifique (ou null pour utiliser la quantité standard)
   * @param displayMode Mode d'affichage (PER_100G par défaut pour standardisation)
   * @returns Opération avec les valeurs nutritionnelles formatées pour l'UI
   */
  async getMealNutritionForDisplay(mealId: number, quantity?: number, displayMode: NutritionDisplayMode = NutritionDisplayMode.PER_100G): Promise<OperationResult<{
    macros: MacroNutrientsBase,
    displayText: string,
    adjustmentFactor?: number
  }>> {
    try {
      logger.info(LogCategory.NUTRITION, `[MEALCARD-NUTRITION] Chargement des données nutritionnelles pour le repas ${mealId}`);
      
      // Utiliser la quantité fournie ou obtenir le poids standard
      const finalQuantity = quantity || await this.getDefaultMealWeight(mealId);
      
      // Déléguer directement à nutritionEngine (qui loggera ses propres actions)
      const result = await nutritionEngine.getMealNutrition(mealId, finalQuantity, displayMode);
      
      if (!result.success) {
        return {
          success: false,
          error: result.error || "Erreur lors de la récupération des données nutritionnelles",
          data: {
            macros: {
              calories: 0,
              carbs: 0,
              protein: 0,
              fat: 0
            },
            displayText: "Données indisponibles"
          }
        };
      }
      
      // Log du succès 
      logger.debug(LogCategory.NUTRITION, `[MEALCARD-NUTRITION] Données reçues avec succès pour le repas ${mealId}`);
      
      return {
        success: true,
        data: {
          macros: result.macros || {
            calories: 0,
            carbs: 0,
            protein: 0,
            fat: 0
          },
          displayText: result.displayText || `Valeurs nutritionnelles`,
          adjustmentFactor: result.normalizationFactor
        }
      };
    } catch (error) {
      // En cas d'erreur, log uniquement au niveau service pages (pas en cascade)
      logger.error(LogCategory.NUTRITION, `[MEALCARD-NUTRITION] Erreur pour le repas ${mealId}`, {
        error: error instanceof Error ? error.message : String(error)
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
        data: {
          macros: {
            calories: 0,
            carbs: 0,
            protein: 0,
            fat: 0
          },
          displayText: "Erreur de récupération"
        }
      };
    }
  }
  
  /**
   * Récupère le poids par défaut d'un repas
   * @param mealId ID du repas
   * @returns Poids par défaut en grammes
   */
  private async getDefaultMealWeight(mealId: number): Promise<number> {
    try {
      // On utilise la valeur fixe de 100g - les ajustements se feront via la normalisation
      // Cette approche évite une requête supplémentaire pour obtenir le poids
      const weight = 100;
      logger.info(LogCategory.NUTRITION, `[MEALCARD-CALORIES] Poids: ${weight}g`);
      return weight;
    } catch (error) {
      logger.warn(LogCategory.NUTRITION, `Erreur lors de la récupération du poids, utilisation de 100g`, {
        mealId
      });
      return 100; // Valeur par défaut en cas d'erreur
    }
  }

  /**
   * Récupère les valeurs nutritionnelles d'un plan journalier formatées pour l'affichage
   * Cette méthode orchestre les données pour les composants UI des plans journaliers
   * 
   * @param dailyPlanId ID du plan journalier
   * @param displayMode Mode d'affichage (AS_IS par défaut pour les plans journaliers)
   * @returns Données nutritionnelles formatées pour l'UI
   */
  async getDailyPlanMacrosForDisplay(dailyPlanId: number, displayMode: NutritionDisplayMode = NutritionDisplayMode.AS_IS): Promise<OperationResult<{
    macros: MacroNutrientsBase,
    displayText: string,
    totalWeight?: number
  }>> {
    try {
      logger.info(LogCategory.NUTRITION, `Préparation des données nutritionnelles pour affichage: plan ${dailyPlanId}`);
      
      // Utiliser la façade pour récupérer les données
      const result = await nutritionEngine.getPlanNutrition(dailyPlanId, displayMode);
      
      if (!result.success) {
        return {
          success: false,
          error: result.error || "Erreur lors de la récupération des données nutritionnelles du plan",
          data: {
            macros: {
              calories: 0,
              carbs: 0,
              protein: 0,
              fat: 0,
              unit: 'g'
            },
            displayText: "Données indisponibles"
          }
        };
      }
      
      // Préparer les données pour l'UI
      const defaultMacros: MacroNutrientsBase = {
        calories: 0,
        carbs: 0,
        protein: 0,
        fat: 0,
        unit: 'g'
      };
      
      return {
        success: true,
        data: {
          macros: result.macros || defaultMacros,
          displayText: result.displayText || "Plan journalier",
          totalWeight: result.totalWeight
        }
      };
    } catch (error) {
      logger.error(LogCategory.NUTRITION, `Erreur lors de la préparation des données nutritionnelles du plan pour affichage`, {
        error: error instanceof Error ? error.message : String(error),
        dailyPlanId,
        displayMode
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
        data: {
          macros: {
            calories: 0,
            carbs: 0,
            protein: 0,
            fat: 0,
            unit: 'g'
          },
          displayText: "Erreur de calcul"
        }
      };
    }
  }
  
  /**
   * Récupère la répartition des macronutriments d'un repas pour l'affichage
   * Particulièrement utile pour les graphiques nutritionnels et analyses
   * 
   * @param mealId ID du repas
   * @param quantity Quantité spécifique (ou null pour utiliser la quantité standard)
   * @param displayMode Mode d'affichage (PER_100G par défaut pour standardisation)
   * @returns Répartition des macronutriments avec pourcentages formatés pour l'UI
   */
  async getMacroBreakdownForDisplay(mealId: number, quantity?: number, displayMode: NutritionDisplayMode = NutritionDisplayMode.PER_100G): Promise<OperationResult<{
    macros: MacroNutrientsBase,
    percentages: {
      protein: number,
      carbs: number,
      fat: number
    },
    displayText: string
  }>> {
    try {
      logger.info(LogCategory.NUTRITION, `Préparation de la répartition des macros pour affichage: repas ${mealId}`);
      
      // Utiliser la façade pour récupérer les données
      const result = await nutritionEngine.getMacroBreakdown(mealId, quantity, displayMode);
      
      if (!result.success) {
        return {
          success: false,
          error: result.error || "Erreur lors de la récupération de la répartition des macros",
          data: {
            macros: {
              calories: 0,
              carbs: 0,
              protein: 0,
              fat: 0,
              unit: 'g'
            },
            percentages: {
              protein: 0,
              carbs: 0,
              fat: 0
            },
            displayText: "Données indisponibles"
          }
        };
      }
      
      // Préparer les données pour l'UI (graphiques, etc.)
      const defaultMacros: MacroNutrientsBase = {
        calories: 0,
        carbs: 0,
        protein: 0,
        fat: 0,
        unit: 'g'
      };
      
      const defaultPercentages = {
        protein: 0,
        carbs: 0,
        fat: 0
      };
      
      return {
        success: true,
        data: {
          macros: result.macros || defaultMacros,
          percentages: result.percentages || defaultPercentages,
          displayText: result.displayText || "Répartition des macros"
        }
      };
    } catch (error) {
      logger.error(LogCategory.NUTRITION, `Erreur lors de la préparation de la répartition des macros pour affichage`, {
        error: error instanceof Error ? error.message : String(error),
        mealId,
        quantity,
        displayMode
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
        data: {
          macros: {
            calories: 0,
            carbs: 0,
            protein: 0,
            fat: 0,
            unit: 'g'
          },
          percentages: {
            protein: 0,
            carbs: 0,
            fat: 0
          },
          displayText: "Erreur de calcul"
        }
      };
    }
  }
  
  /**
   * Méthode formatForUI supprimée le 13 mai 2025
   * 
   * Cette méthode permettait de formater une valeur nutritionnelle pour l'affichage dans l'UI.
   * Elle a été supprimée dans le cadre de la refactorisation du module de nutrition.
   * 
   * Alternative recommandée :
   * - nutritionEngine.formatForUI(value, type) // type peut être 'calories', 'carbs', 'protein' ou 'fat'
   */

  /**
   * Méthode normalizeMacrosForDisplay supprimée le 13 mai 2025
   * 
   * Cette méthode permettait de normaliser les macronutriments pour l'affichage dans l'UI.
   * Elle a été supprimée dans le cadre de la refactorisation du module de nutrition
   * pour centraliser la logique nutritionnelle dans le nutritionEngine et éviter les cycles de dépendances.
   * 
   * Alternatives recommandées :
   * - nutritionEngine.normalizeForDisplay(rawMacros, totalWeight, displayMode)
   */
}

export const nutritionPagesService = new NutritionPagesService();
