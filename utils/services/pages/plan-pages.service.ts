/**
 * Service pour la gestion des pages de plans nutritionnels
 * Ce service encapsule la logique métier liée aux pages de plans
 */

import { PlanFilters, PlanPagesServiceInterface, OperationResult } from "@/utils/interfaces/pages.interface";
import sqliteMCPServer from "@/utils/mcp/sqlite-server";
import { logger } from "@/utils/services/common/logging.service";
import { LogCategory } from "@/utils/enum/logging.enum";
import { getCurrentUserIdSync } from "@/utils/helpers/userContext";
import { MealTypeEnum } from "@/utils/enum/meal.enum";
import { nutritionPagesService } from "./nutrition-pages.service";
import { NutritionDisplayMode } from "@/utils/enum/nutrition.enum";
import { MacroNutrientsBase } from "@/types/nutrition.type";
import { planService } from "../core/plan-core.service";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Service pour les opérations liées aux pages de plans nutritionnels
 * Implémente l'interface PlanPagesServiceInterface
 */
class PlanPagesService implements PlanPagesServiceInterface {
  /**
   * Récupère la liste des plans avec filtrage pour la page d'index
   * @param filters Filtres à appliquer (recherche, pagination)
   * @returns Résultat de l'opération avec les plans filtrés et le nombre total
   */
  async getPlansList(filters: PlanFilters): Promise<OperationResult<{
    plans: any[];
    totalCount: number;
    pageInfo?: {
      currentPage: number;
      totalPages: number;
    }
  }>> {
    try {
      logger.info(LogCategory.UI, 'Récupération de la liste des plans avec filtres', { filters });
      
      // Déléguer l'opération au service core
      const result = await planService.getPlansListFiltered(filters);
      
      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Échec de la récupération des plans'
        };
      }
      
      return {
        success: true,
        data: {
          plans: result.plans || [],
          totalCount: result.totalCount || 0,
          pageInfo: result.pageInfo
        },
        message: `${result.plans?.length || 0} plans récupérés avec succès`
      };
    } catch (error) {
      logger.error(LogCategory.UI, 'Erreur lors de la récupération des plans', {
        error: error instanceof Error ? error.message : String(error),
        filters
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue lors de la récupération des plans'
      };
    }
  }
  
  /**
   * Récupère les détails d'un plan pour la page de détail
   * @param id ID du plan
   * @returns Résultat de l'opération avec les détails du plan et ses plans journaliers
   */
  async getPlanDetails(id: number): Promise<OperationResult<{
    plan: any;
    dailyPlans: any[];
  }>> {
    try {
      logger.info(LogCategory.UI, `Récupération des détails du plan ${id}`);
      
      // Déléguer l'opération au service core
      const result = await planService.getPlanDetails(id);
      
      if (!result.success) {
        return {
          success: false,
          error: result.error || `Échec de la récupération des détails du plan ${id}`
        };
      }
      
      return {
        success: true,
        data: {
          plan: result.plan!,
          dailyPlans: result.dailyPlans || []
        },
        message: 'Détails du plan récupérés avec succès'
      };
    } catch (error) {
      logger.error(LogCategory.UI, `Erreur lors de la récupération des détails du plan ${id}`, {
        error: error instanceof Error ? error.message : String(error)
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue lors de la récupération des détails du plan'
      };
    }
  }
  
  /**
   * Supprime un plan
   * @param id ID du plan à supprimer
   * @returns Résultat de l'opération
   */
  async deletePlan(id: number): Promise<OperationResult> {
    try {
      logger.info(LogCategory.UI, `Suppression du plan ${id}`);
      
      // Déléguer l'opération au service core
      const result = await planService.deletePlan(id);
      
      if (!result.success) {
        return {
          success: false,
          error: result.error || `Échec de la suppression du plan ${id}`
        };
      }
      
      return {
        success: true,
        message: 'Plan supprimé avec succès'
      };
    } catch (error) {
      logger.error(LogCategory.UI, `Erreur lors de la suppression du plan ${id}`, {
        error: error instanceof Error ? error.message : String(error)
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue lors de la suppression du plan'
      };
    }
  }
  
  /**
   * Met à jour un plan existant
   * @param id ID du plan à mettre à jour
   * @param planData Données du plan à mettre à jour
   * @returns Résultat de l'opération
   */
  async updatePlan(id: number, planData: any): Promise<OperationResult> {
    try {
      logger.info(LogCategory.UI, `Mise à jour du plan ${id}`, { planData });
      
      // Déléguer l'opération au service core
      const result = await planService.updatePlan(id, planData);
      
      if (!result.success) {
        return {
          success: false,
          error: result.error || `Échec de la mise à jour du plan ${id}`
        };
      }
      
      return {
        success: true,
        message: 'Plan mis à jour avec succès'
      };
    } catch (error) {
      logger.error(LogCategory.UI, `Erreur lors de la mise à jour du plan ${id}`, {
        error: error instanceof Error ? error.message : String(error)
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue lors de la mise à jour du plan'
      };
    }
  }
  
  /**
   * Crée un nouveau plan nutritionnel
   * @param planData Données du plan à créer
   * @returns Résultat de l'opération avec l'ID du plan créé
   */
  async createPlan(planData: any): Promise<OperationResult<{ planId: number }>> {
    try {
      logger.info(LogCategory.UI, 'Création d\'un nouveau plan', { planData });
      
      // Validation basique côté UI
      if (!planData.name || !planData.name.trim()) {
        logger.error(LogCategory.FORM, 'Nom du plan manquant ou invalide');
        return {
          success: false,
          error: 'Le nom du plan est requis'
        };
      }
      
      // Déléguer l'opération au service core
      const result = await planService.createPlan(planData);
      
      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Échec de la création du plan'
        };
      }
      
      return {
        success: true,
        data: {
          planId: result.planId!
        },
        message: 'Plan créé avec succès'
      };
    } catch (error) {
      logger.error(LogCategory.UI, 'Erreur lors de la création du plan', {
        error: error instanceof Error ? error.message : String(error),
        planData
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue lors de la création du plan'
      };
    }
  }
  
  /**
      };
    }
  }
  
  /**
   * Récupère le plan courant de l'utilisateur
   * @returns Résultat de l'opération avec le plan courant
   */
  async getCurrentPlan(): Promise<OperationResult<{ plan: any }>> {
    try {
      logger.info(LogCategory.UI, 'Récupération du plan courant');
      
      // Déléguer l'opération au service core
      const result = await planService.getCurrentPlan();
      
      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Échec de la récupération du plan courant'
        };
      }
      
      // Gérer le cas où aucun plan n'est défini comme courant
      if (!result.plan) {
        return {
          success: true,
          data: {
            plan: null
          },
          message: 'Aucun plan courant défini'
        };
      }
      
      return {
        success: true,
        data: {
          plan: result.plan
        },
        message: 'Plan courant récupéré avec succès'
      };
    } catch (error) {
      logger.error(LogCategory.UI, 'Erreur lors de la récupération du plan courant', {
        error: error instanceof Error ? error.message : String(error)
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue lors de la récupération du plan courant'
      };
    }
  }

  /**
   * Ajoute un repas à un plan journalier
   * @param dailyPlanId ID du plan journalier
   * @param mealId ID du repas à ajouter
   * @param quantity Quantité du repas (poids en grammes)
   * @param mealType Type du repas (optionnel)
   * @returns Résultat de l'opération
   */
  async addMealToDailyPlan(
    dailyPlanId: number,
    mealId: number,
    quantity: number = 100,
    mealType?: MealTypeEnum
  ): Promise<OperationResult> {
    try {
      // Valider que la quantité est positive
      if (isNaN(quantity) || quantity <= 0) {
        logger.error(LogCategory.FORM, 'La quantité du repas doit être positive');
        return {
          success: false,
          error: 'La quantité du repas doit être positive'
        };
      }
      
      logger.info(LogCategory.UI, `Ajout du repas ${mealId} au plan journalier ${dailyPlanId}`, {
        quantity,
        mealType
      });
      
      // Déléguer l'opération au service core
      const result = await planService.addMealToDailyPlan(dailyPlanId, mealId, quantity, mealType);
      
      if (!result.success) {
        return {
          success: false,
          error: result.error || `Échec de l'ajout du repas au plan journalier`
        };
      }
      
      return {
        success: true,
        message: 'Repas ajouté au plan journalier avec succès'
      };
    } catch (error) {
      logger.error(LogCategory.UI, `Erreur lors de l'ajout du repas ${mealId} au plan journalier ${dailyPlanId}`, {
        error: error instanceof Error ? error.message : String(error),
        dailyPlanId,
        mealId,
        quantity,
        mealType
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'ajout du repas au plan journalier'
      };
    }
  }
  
  /**
   * Récupère les données formatées pour une carte de repas dans un plan journalier
   * Cette méthode orchestre les données nécessaires pour le composant PlanMealCard
   * 
   * @param dailyPlanId ID du plan journalier
   * @param mealId ID du repas
   * @returns Données formatées pour l'UI avec les macros, le facteur d'ajustement et les métadonnées du repas
   */
  async getPlanMealCardData(dailyPlanId: number, mealId: number): Promise<OperationResult<{
    meal: {
      id: number;
      name: string;
      description?: string;
      imageUrl?: string;
      type?: MealTypeEnum;
    };
    quantity: number;
    macros: MacroNutrientsBase;
    displayText: string;
    adjustmentFactor?: number;
  }>> {
    try {
      logger.info(LogCategory.UI, `Préparation des données pour la carte de repas: plan ${dailyPlanId}, repas ${mealId}`);
      
      // Récupérer l'ID utilisateur pour les opérations securisées
      const userId = getCurrentUserIdSync();
      if (!userId) {
        return {
          success: false,
          error: "Utilisateur non authentifié pour accéder aux détails du repas"
        };
      }
      
      // 1. Récupérer les informations du repas depuis la base de données
      // Utiliser getMealByIdWithIngredientsViaMCP qui est disponible dans le SQLiteMCPServer
      const mealResult = await sqliteMCPServer.getMealByIdWithIngredientsViaMCP(mealId, userId);
      if (!mealResult?.success) {
        return {
          success: false,
          error: mealResult?.error || "Erreur lors de la récupération des détails du repas"
        };
      }
      
      // 2. Récupérer la quantité du repas dans le plan
      const quantityResult = await planService.getMealQuantityInPlan(dailyPlanId, mealId);
      if (!quantityResult.success || quantityResult.quantity === undefined) {
        return {
          success: false,
          error: quantityResult.error || "Erreur lors de la récupération de la quantité du repas dans le plan"
        };
      }
      
      // 3. Utiliser nutritionPagesService pour calculer les valeurs nutritionnelles
      const nutritionResult = await nutritionPagesService.getMealNutritionForDisplay(
        mealId,
        quantityResult.quantity,
        NutritionDisplayMode.AS_IS // Afficher les valeurs réelles pour l'UI
      );
      
      if (!nutritionResult.success || !nutritionResult.data) {
        return {
          success: false,
          error: nutritionResult.error || "Erreur lors du calcul des valeurs nutritionnelles"
        };
      }
      
      // Valeurs par défaut pour éviter les erreurs undefined
      const defaultMacros: MacroNutrientsBase = {
        calories: 0,
        carbs: 0,
        protein: 0,
        fat: 0,
        unit: 'g'
      };
      
      // 4. Formater les données pour le composant UI avec gestion des valeurs undefined
      return {
        success: true,
        data: {
          meal: {
            id: mealId,
            name: mealResult.meal?.name || `Repas #${mealId}`,
            description: mealResult.meal?.description || "",
            imageUrl: mealResult.meal?.image ? `data:image/jpeg;base64,${mealResult.meal.image.toString('base64')}` : "",
            type: mealResult.meal?.type || MealTypeEnum.LUNCH
          },
          quantity: quantityResult.quantity,
          macros: nutritionResult.data.macros || defaultMacros,
          displayText: nutritionResult.data.displayText || "Valeurs nutritionnelles",
          adjustmentFactor: nutritionResult.data.adjustmentFactor
        }
      };
    } catch (error) {
      logger.error(LogCategory.UI, `Erreur lors de la préparation des données pour la carte de repas`, {
        error: error instanceof Error ? error.message : String(error),
        dailyPlanId,
        mealId
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue"
      };
    }
  }
  
  /**
   * Récupère le résumé nutritionnel d'un plan journalier pour l'affichage
   * Cette méthode orchestre les données nécessaires pour la page de détails du plan
   * 
   * @param dailyPlanId ID du plan journalier
   * @returns Résumé formaté pour l'UI avec les macros totales, le nombre de repas et les métadonnées du plan
   */
  async getDailyPlanSummary(dailyPlanId: number): Promise<OperationResult<{
    planDetails: {
      id: number;
      name: string;
      description?: string;
      date?: string;
      meals?: number; // Nombre de repas dans le plan
    };
    macros: MacroNutrientsBase;
    displayText: string;
    totalWeight?: number;
  }>> {
    try {
      logger.info(LogCategory.UI, `Préparation du résumé du plan journalier: ${dailyPlanId}`);
      
      // Récupérer l'ID utilisateur pour les opérations securisées
      const userId = getCurrentUserIdSync();
      if (!userId) {
        return {
          success: false,
          error: "Utilisateur non authentifié pour accéder aux détails du plan"
        };
      }
      
      // 1. Récupérer les informations du plan depuis la base de données
      // Utiliser la méthode getPlanDetailsViaMCP qui peut également récupérer un plan journalier avec planId de type string
      const planResult = await sqliteMCPServer.getPlanDetailsViaMCP(dailyPlanId.toString(), userId);
      if (!planResult?.success) {
        return {
          success: false,
          error: planResult?.error || "Erreur lors de la récupération des détails du plan journalier"
        };
      }
      
      // 2. Utiliser nutritionPagesService pour calculer les valeurs nutritionnelles totales du plan
      const nutritionResult = await nutritionPagesService.getDailyPlanMacrosForDisplay(
        dailyPlanId,
        NutritionDisplayMode.AS_IS // Afficher les valeurs totales réelles pour le plan
      );
      
      if (!nutritionResult.success || !nutritionResult.data) {
        return {
          success: false,
          error: nutritionResult.error || "Erreur lors du calcul des valeurs nutritionnelles du plan"
        };
      }
      
      // Valeurs par défaut pour éviter les erreurs undefined
      const defaultMacros: MacroNutrientsBase = {
        calories: 0,
        carbs: 0,
        protein: 0,
        fat: 0,
        unit: 'g'
      };
      
      // 3. Compter le nombre de repas dans le plan
      const mealsCount = planResult.dailyPlans?.length || 0;
      
      // 4. Formater les données pour la page de détails
      return {
        success: true,
        data: {
          planDetails: {
            id: dailyPlanId,
            name: planResult.plan?.name || `Plan #${dailyPlanId}`,
            description: "Plan nutritionnel", // Le plan n'a pas de propriété description, utiliser une valeur par défaut
            date: planResult.plan?.createdAt?.toString(),
            meals: mealsCount
          },
          macros: nutritionResult.data.macros || defaultMacros,
          displayText: nutritionResult.data.displayText || "Valeurs nutritionnelles du plan",
          totalWeight: nutritionResult.data.totalWeight
        }
      };
    } catch (error) {
      logger.error(LogCategory.UI, `Erreur lors de la préparation du résumé du plan journalier`, {
        error: error instanceof Error ? error.message : String(error),
        dailyPlanId
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue"
      };
    }
  }
  
  /**
   * Retire un repas d'un plan journalier
   * Cette méthode orchestre les opérations d'interface pour retirer un repas
   * 
   * @param dailyPlanId ID du plan journalier
   * @param mealId ID du repas à retirer
   * @returns Résultat indiquant le succès ou l'échec de l'opération
   */
  async removeMealFromPlan(dailyPlanId: number, mealId: number): Promise<OperationResult> {
    try {
      logger.info(LogCategory.UI, `Suppression du repas ${mealId} du plan journalier ${dailyPlanId}`);

      // Déléguer l'opération CRUD au service de plan (couche Controller)
      const result = await planService.removeMealFromDailyPlan(dailyPlanId, mealId);
      
      if (!result.success) {
        return {
          success: false,
          error: result.error || "Erreur lors de la suppression du repas du plan"
        };
      }
      
      return {
        success: true,
        message: "Repas supprimé du plan avec succès"
      };
    } catch (error) {
      logger.error(LogCategory.UI, `Erreur lors de la suppression du repas du plan`, {
        error: error instanceof Error ? error.message : String(error),
        dailyPlanId,
        mealId
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue"
      };
    }
  }
  
  /**
   * Définit un plan comme plan actuel pour l'utilisateur
   * Cette méthode orchestre les opérations pour définir un plan comme plan actuel
   * 
   * @param planId ID du plan à définir comme plan actuel
   * @returns Résultat indiquant le succès ou l'échec de l'opération
   */
  async setCurrentPlan(planId: number): Promise<OperationResult> {
    try {
      logger.info(LogCategory.UI, `Définition du plan ${planId} comme plan actuel`);
      
      // Déléguer l'opération au service core
      const result = await planService.setCurrentPlan(planId);
      
      if (!result.success) {
        return {
          success: false,
          error: result.error || "Erreur lors de la définition du plan comme plan actuel"
        };
      }
      
      return {
        success: true,
        message: "Plan défini comme plan actuel avec succès"
      };
    } catch (error) {
      logger.error(LogCategory.UI, `Erreur lors de la définition du plan comme plan actuel`, {
        error: error instanceof Error ? error.message : String(error),
        planId
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue"
      };
    }
  }
  
  /**
   * Invalide le cache après une opération sur un plan
   * Cette méthode orchestre l'invalidation du cache pour mettre à jour l'UI après des modifications
   * 
   * @param queryClient Instance du queryClient pour la gestion du cache
   * @param planId ID du plan modifié
   */
  invalidatePlanCache(queryClient: ReturnType<typeof useQueryClient>, planId: number): void {
    try {
      logger.info(LogCategory.UI, `Invalidation du cache pour le plan ${planId}`);
      
      // Déléguer l'opération au service core
      planService.invalidatePlanCache(queryClient, planId);
    } catch (error) {
      logger.error(LogCategory.UI, `Erreur lors de l'invalidation du cache`, {
        error: error instanceof Error ? error.message : String(error),
        planId
      });
    }
  }
  
  /**
   * Met à jour la quantité d'un repas dans un plan journalier
   * Cette méthode orchestre les opérations pour modifier la quantité d'un repas dans un plan
   * 
   * @param dailyPlanId ID du plan journalier
   * @param mealId ID du repas
   * @param newQuantity Nouvelle quantité en grammes ou unités
   * @returns Résultat indiquant le succès ou l'échec de l'opération
   */
  async updateMealQuantityInPlan(
    dailyPlanId: number,
    mealId: number,
    newQuantity: number
  ): Promise<OperationResult> {
    try {
      logger.info(LogCategory.UI, `Mise à jour de la quantité du repas ${mealId} dans le plan ${dailyPlanId} à ${newQuantity}`);
      
      // Valider que la quantité est positive
      if (isNaN(newQuantity) || newQuantity <= 0) {
        return {
          success: false,
          error: "La quantité doit être un nombre positif"
        };
      }
      
      // Déléguer l'opération au service core
      const result = await planService.updateMealQuantityInPlan(dailyPlanId, mealId, newQuantity);
      
      if (!result.success) {
        return {
          success: false,
          error: result.error || "Erreur lors de la mise à jour de la quantité du repas"
        };
      }
      
      return {
        success: true,
        message: "Quantité du repas mise à jour avec succès"
      };
    } catch (error) {
      logger.error(LogCategory.UI, `Erreur lors de la mise à jour de la quantité du repas`, {
        error: error instanceof Error ? error.message : String(error),
        dailyPlanId,
        mealId,
        newQuantity
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue"
      };
    }
  }
  
  /**
   * Récupère les objectifs nutritionnels d'un plan
   * Cette méthode récupère les valeurs recommandées définies lors de la création du plan
   * Maintenant corrigée pour s'assurer que les objectifs ne sont pas affectés par les repas ajoutés
   * 
   * @param planId ID du plan nutritionnel
   * @returns Objectifs nutritionnels formatés pour l'affichage
   */
  /**
   * Récupère les valeurs nutritionnelles actuelles d'un plan journalier
   * @param dailyPlanId ID du plan journalier
   * @returns Les valeurs nutritionnelles actuelles
   */
  async getDailyPlanNutrition(dailyPlanId: number): Promise<OperationResult<{
    macros: MacroNutrientsBase;
  }>> {
    try {
      const userId = getCurrentUserIdSync();
      if (!userId) {
        return {
          success: false,
          error: "Utilisateur non authentifié"
        };
      }

      const result = await sqliteMCPServer.getDailyPlanNutritionViaMCP({ dailyPlanId, userId });
      
      if (!result?.success || !result.nutrition) {
        return {
          success: false,
          error: result?.error || "Erreur lors de la récupération des valeurs nutritionnelles"
        };
      }

      return {
        success: true,
        data: {
          macros: result.nutrition
        }
      };
    } catch (error) {
      logger.error(LogCategory.NUTRITION, `Erreur lors de la récupération des valeurs nutritionnelles du plan ${dailyPlanId}`, {
        error: error instanceof Error ? error.message : String(error)
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : "Une erreur est survenue"
      };
    }
  }

  async getPlanNutritionGoals(planId: number): Promise<OperationResult<{
    macros: MacroNutrientsBase;
    displayText: string;
  }>> {
    try {
      logger.info(LogCategory.NUTRITION, `Récupération des objectifs nutritionnels du plan ${planId}`);
      
      // Récupérer l'ID utilisateur pour les opérations sécurisées
      const userId = getCurrentUserIdSync();
      if (!userId) {
        logger.error(LogCategory.NUTRITION, 'Utilisateur non authentifié pour accéder aux objectifs nutritionnels');
        return {
          success: false,
          error: "Utilisateur non authentifié"
        };
      }
      
      // IMPORTANT: Pour obtenir les objectifs nutritionnels originaux, nous allons utiliser
      // la même source de données que celle utilisée par le graphique nutritionnel
      // plutôt que les valeurs potentiellement modifiées par l'ajout de repas
      
      // 1. Récupérer les données de création du plan (les valeurs fixées lors de la création)
      // Cette requête récupère directement depuis la table plan sans les modifications des dailyPlan
      const planResult = await sqliteMCPServer.getPlanDetailsViaMCP(planId.toString(), userId);
      
      if (!planResult?.success || !planResult.plan) {
        logger.error(LogCategory.NUTRITION, `Plan ${planId} non trouvé ou n'appartient pas à l'utilisateur`);
        return {
          success: false,
          error: planResult?.error || "Plan non trouvé ou n'appartient pas à l'utilisateur"
        };
      }
      
      // 2. Les objectifs nutritionnels ORIGINAUX sont stockés directement dans l'objet plan
      const plan = planResult.plan;
      
      // Vérifier que les objectifs nutritionnels existent
      if (plan.calories === undefined || plan.carbs === undefined || 
          plan.fat === undefined || plan.protein === undefined) {
        logger.error(LogCategory.NUTRITION, `Objectifs nutritionnels non définis pour le plan ${planId}`);
        return {
          success: false,
          error: "Objectifs nutritionnels non définis pour ce plan"
        };
      }
      
      // Vérifier si les valeurs stockées sont des pourcentages ou des grammes
      // Si macros < 100, ce sont probablement des pourcentages, sinon des grammes
      const areValuesInGrams = plan.carbs > 100 || plan.protein > 100;
      
      logger.debug(LogCategory.NUTRITION, `Format des valeurs nutritionnelles originales du plan ${planId}`, {
        calories: plan.calories,
        carbs: plan.carbs,
        protein: plan.protein,
        fat: plan.fat,
        goalType: plan.goal,
        areValuesInGrams
      });
      
      // Formater les objectifs nutritionnels pour l'affichage
      if (areValuesInGrams) {
        // Valeurs déjà en grammes, les utiliser directement
        return {
          success: true,
          data: {
            macros: {
              calories: plan.calories,
              carbs: plan.carbs,
              fat: plan.fat,
              protein: plan.protein,
              unit: 'g'
            },
            displayText: "Objectifs nutritionnels journaliers"
          }
        };
      } else {
        // Les valeurs sont en pourcentages, calculer les grammes
        // 1g de glucides = 4 calories
        // 1g de protéines = 4 calories
        // 1g de lipides = 9 calories
        const carbsGrams = Math.round((plan.calories * (plan.carbs / 100)) / 4);
        const proteinGrams = Math.round((plan.calories * (plan.protein / 100)) / 4);
        const fatGrams = Math.round((plan.calories * (plan.fat / 100)) / 9);
        
        return {
          success: true,
          data: {
            macros: {
              calories: plan.calories,
              carbs: carbsGrams,
              fat: fatGrams,
              protein: proteinGrams,
              unit: 'g'
            },
            displayText: "Objectifs nutritionnels journaliers"
          }
        };
      }
    } catch (error) {
      logger.error(LogCategory.NUTRITION, `Erreur lors de la récupération des objectifs nutritionnels`, {
        error: error instanceof Error ? error.message : String(error),
        planId
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue"
      };
    }
  }

}

// ... (le reste du code reste inchangé)
export const planPagesService = new PlanPagesService();
