/**
 * Service pour la gestion des pages d'assistant IA
 * Ce service orchestre les opérations liées aux fonctionnalités d'IA pour les UI
 */

import { AssistantPagesServiceInterface, OperationResult } from "@/utils/interfaces/pages.interface";
import { IaMealType, IaPlanType } from "@/utils/validation/ia/ia.schemas";
import { logger } from "@/utils/services/common/logging.service";
import { LogCategory } from "@/utils/enum/logging.enum";
import { getCurrentUserIdSync } from "@/utils/helpers/userContext";
import { assistantCoreService } from "@/utils/services/core/assistant-core.service";

/**
 * Service pour les opérations liées aux pages d'assistant IA
 * Délègue la logique métier au service core et gère les aspects UI
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
    message?: string;
    missingIngredients?: any[];
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
      
      // Déléguer au service core pour la génération du repas
      logger.info(LogCategory.IA, 'Délégation de la génération du repas au service core', { 
        criteria 
      });
      
      const result = await assistantCoreService.generateMeal(criteria, userId);
      
      // Si erreur, la propager avec un message contextualisé pour l'UI
      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Échec de la génération du repas',
          message: 'Impossible de générer le repas. Veuillez vérifier vos critères et réessayer.'
        };
      }
      
      // Ajouter un message UI convivial en cas de succès
      return {
        ...result,
        message: result.message || 'Repas généré avec succès',
      };
    } catch (error) {
      // Journalisation pour débogage dans le service pages
      logger.error(LogCategory.IA, 'Exception non gérée lors de l\'appel à generateMeal', {
        error: error instanceof Error ? error.message : String(error)
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur inattendue est survenue',
        message: 'Une erreur s\'est produite lors de la génération du repas. Veuillez réessayer.'      
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
      
      // Déléguer au service core pour la génération du plan
      logger.info(LogCategory.IA, 'Délégation de la génération du plan au service core', { 
        criteria 
      });
      
      const result = await assistantCoreService.generatePlan(criteria, userId);
      
      // Si erreur, la propager avec un message contextualisé pour l'UI
      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Échec de la génération du plan',
          message: 'Impossible de générer le plan. Veuillez vérifier vos critères et réessayer.'
        };
      }
      
      // Ajouter un message UI convivial en cas de succès
      return {
        ...result,
        message: result.message || 'Plan nutritionnel généré avec succès',
      };
    } catch (error) {
      // Journalisation pour débogage dans le service pages
      logger.error(LogCategory.IA, 'Exception non gérée lors de l\'appel à generatePlan', {
        error: error instanceof Error ? error.message : String(error)
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur inattendue est survenue',
        message: 'Une erreur s\'est produite lors de la génération du plan. Veuillez réessayer.'      
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
      
      // Déléguer au service core pour la génération de la liste de courses
      logger.info(LogCategory.IA, 'Délégation de la génération de la liste de courses au service core', { 
        planId 
      });
      
      const result = await assistantCoreService.generateShoppingList(planId, userId);
      
      // Si erreur, la propager avec un message contextualisé pour l'UI
      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Échec de la génération de la liste de courses',
          message: 'Impossible de générer la liste de courses. Veuillez réessayer plus tard.'
        };
      }
      
      // Ajouter un message UI convivial en cas de succès
      return {
        ...result,
        message: result.message || 'Liste de courses générée avec succès',
      };
    } catch (error) {
      // Journalisation pour débogage dans le service pages
      logger.error(LogCategory.IA, 'Exception non gérée lors de l\'appel à generateShoppingList', {
        error: error instanceof Error ? error.message : String(error),
        planId
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur inattendue est survenue',
        message: 'Une erreur s\'est produite lors de la génération de la liste de courses. Veuillez réessayer.'      
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
      
      // Déléguer au service core pour l'analyse des progrès
      logger.info(LogCategory.IA, 'Délégation de l\'analyse des progrès au service core', { 
        startDate,
        endDate
      });
      
      const result = await assistantCoreService.analyzeProgress(startDate, endDate, userId);
      
      // Si erreur, la propager avec un message contextualisé pour l'UI
      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Échec de l\'analyse des progrès',
          message: 'Impossible d\'analyser vos progrès. Veuillez réessayer avec une période différente.'
        };
      }
      
      // Ajouter un message UI convivial en cas de succès
      return {
        ...result,
        message: result.message || 'Analyse des progrès générée avec succès',
      };
    } catch (error) {
      // Journalisation pour débogage dans le service pages
      logger.error(LogCategory.IA, 'Exception non gérée lors de l\'appel à analyzeProgress', {
        error: error instanceof Error ? error.message : String(error),
        startDate,
        endDate
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur inattendue est survenue',
        message: 'Une erreur s\'est produite lors de l\'analyse des progrès. Veuillez réessayer.'      
      };
    }
  }
  
  /**
   * Analyse les habitudes nutritionnelles de l'utilisateur
   * @returns Résultat de l'opération avec l'analyse nutritionnelle
   */
  async analyzeNutritionHabits(): Promise<OperationResult<{
    analysis: {
      text: string;
      recommendations: string[];
      strengths: string[];
      improvements: string[];
    }
  }>> {
    try {
      // Récupérer l'ID utilisateur et gérer le cas où il est null
      const userIdOrNull = getCurrentUserIdSync();
      if (userIdOrNull === null) {
        logger.error(LogCategory.AUTH, 'Utilisateur non authentifié pour analyser les habitudes nutritionnelles');
        return {
          success: false,
          error: 'Utilisateur non authentifié'
        };
      }
      
      const userId = userIdOrNull;
      
      // Déléguer au service core pour l'analyse des habitudes nutritionnelles
      logger.info(LogCategory.IA, 'Délégation de l\'analyse des habitudes nutritionnelles au service core', { 
        userId
      });
      
      const result = await assistantCoreService.analyzeNutritionHabits(userId);
      
      // Si erreur, la propager avec un message contextualisé pour l'UI
      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Échec de l\'analyse des habitudes nutritionnelles',
          message: 'Impossible d\'analyser vos habitudes nutritionnelles. Veuillez réessayer plus tard.'
        };
      }
      
      // Ajouter un message UI convivial en cas de succès
      return {
        ...result,
        message: result.message || 'Analyse des habitudes nutritionnelles générée avec succès',
      };
    } catch (error) {
      // Journalisation pour débogage dans le service pages
      logger.error(LogCategory.IA, 'Exception non gérée lors de l\'appel à analyzeNutritionHabits', {
        error: error instanceof Error ? error.message : String(error)
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur inattendue est survenue',
        message: 'Une erreur s\'est produite lors de l\'analyse des habitudes nutritionnelles. Veuillez réessayer.'      
      };
    }
  }
}

// Exporter une instance singleton du service
export const assistantPagesService = new AssistantPagesService();
