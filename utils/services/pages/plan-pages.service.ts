/**
 * Service pour la gestion des pages de plans nutritionnels
 * Ce service encapsule la logique métier liée aux pages de plans
 */

import { PlanFilters, PlanPagesServiceInterface, OperationResult } from "@/utils/interfaces/pages.interface";
import sqliteMCPServer from "@/utils/mcp/sqlite-server";
import { logger } from "@/utils/services/logging.service";
import { LogCategory } from "@/utils/enum/logging.enum";
import { getCurrentUserIdSync } from "@/utils/helpers/userContext";

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
      // Récupérer l'ID utilisateur et gérer le cas où il est null
      const userIdOrNull = getCurrentUserIdSync();
      if (userIdOrNull === null) {
        logger.error(LogCategory.AUTH, 'Utilisateur non authentifié pour récupérer les plans');
        return {
          success: false,
          error: 'Utilisateur non authentifié'
        };
      }
      
      const userId = userIdOrNull;
      
      logger.info(LogCategory.DATABASE, 'Récupération de la liste des plans avec filtres', { 
        userId, 
        filters 
      });
      
      // Définir les options de pagination
      const page = filters.page || 1;
      const limit = filters.limit || 10;
      
      // Appel au service MCP pour récupérer les plans
      const result = await sqliteMCPServer.getPlansListViaMCP(userId);
      
      if (!result) {
        logger.error(LogCategory.DATABASE, 'Échec de la récupération des plans: résultat null');
        return {
          success: false,
          error: 'Échec de la récupération des plans: résultat null'
        };
      }
      
      if (!result.success) {
        logger.error(LogCategory.DATABASE, 'Échec de la récupération des plans', {
          error: result.error
        });
        
        return {
          success: false,
          error: result.error || 'Échec de la récupération des plans'
        };
      }
      
      // S'assurer que nous avons un tableau de plans
      const plans = Array.isArray(result.plans) ? result.plans : [];
      
      // Appliquer le filtre de recherche si spécifié
      let filteredPlans = plans;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredPlans = plans.filter(plan => 
          // Note: Dans le cas où le plan n'a pas de propriété description, nous cherchons uniquement dans le nom
          plan.name?.toLowerCase().includes(searchLower)
        );
      }
      
      // Appliquer la pagination
      const totalCount = filteredPlans.length;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedPlans = filteredPlans.slice(startIndex, endIndex);
      
      // Calculer le nombre total de pages
      const totalPages = Math.ceil(totalCount / limit);
      
      return {
        success: true,
        data: {
          plans: paginatedPlans,
          totalCount,
          pageInfo: {
            currentPage: page,
            totalPages
          }
        },
        message: `${paginatedPlans.length} plans récupérés avec succès`
      };
    } catch (error) {
      logger.error(LogCategory.DATABASE, 'Erreur lors de la récupération des plans', {
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
      // Récupérer l'ID utilisateur et gérer le cas où il est null
      const userIdOrNull = getCurrentUserIdSync();
      if (userIdOrNull === null) {
        logger.error(LogCategory.AUTH, 'Utilisateur non authentifié pour récupérer les détails du plan');
        return {
          success: false,
          error: 'Utilisateur non authentifié'
        };
      }
      
      const userId = userIdOrNull;
      
      logger.info(LogCategory.DATABASE, 'Récupération des détails du plan', { 
        userId, 
        planId: id 
      });
      
      // Appel au service MCP pour récupérer les détails du plan
      const result = await sqliteMCPServer.getPlanDetailsViaMCP(id, userId);
      
      if (!result) {
        logger.error(LogCategory.DATABASE, 'Échec de la récupération des détails du plan: résultat null', {
          planId: id
        });
        
        return {
          success: false,
          error: 'Échec de la récupération des détails du plan: résultat null'
        };
      }
      
      if (!result.success) {
        logger.error(LogCategory.DATABASE, 'Échec de la récupération des détails du plan', {
          error: result.error,
          planId: id
        });
        
        return {
          success: false,
          error: result.error || 'Échec de la récupération des détails du plan'
        };
      }
      
      return {
        success: true,
        data: {
          plan: result.plan,
          dailyPlans: result.dailyPlans || []
        },
        message: 'Détails du plan récupérés avec succès'
      };
    } catch (error) {
      logger.error(LogCategory.DATABASE, 'Erreur lors de la récupération des détails du plan', {
        error: error instanceof Error ? error.message : String(error),
        planId: id
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
      // Récupérer l'ID utilisateur et gérer le cas où il est null
      const userIdOrNull = getCurrentUserIdSync();
      if (userIdOrNull === null) {
        logger.error(LogCategory.AUTH, 'Utilisateur non authentifié pour supprimer le plan');
        return {
          success: false,
          error: 'Utilisateur non authentifié'
        };
      }
      
      const userId = userIdOrNull;
      
      logger.info(LogCategory.DATABASE, 'Suppression du plan', { 
        userId, 
        planId: id 
      });
      
      // Appel au service MCP pour supprimer le plan
      const result = await sqliteMCPServer.deletePlanViaMCP(id, userId);
      
      if (!result) {
        logger.error(LogCategory.DATABASE, 'Échec de la suppression du plan: résultat null', {
          planId: id
        });
        
        return {
          success: false,
          error: 'Échec de la suppression du plan: résultat null'
        };
      }
      
      if (!result.success) {
        logger.error(LogCategory.DATABASE, 'Échec de la suppression du plan', {
          error: result.error,
          planId: id
        });
        
        return {
          success: false,
          error: result.error || 'Échec de la suppression du plan'
        };
      }
      
      return {
        success: true,
        message: 'Plan supprimé avec succès'
      };
    } catch (error) {
      logger.error(LogCategory.DATABASE, 'Erreur lors de la suppression du plan', {
        error: error instanceof Error ? error.message : String(error),
        planId: id
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
      // Récupérer l'ID utilisateur et gérer le cas où il est null
      const userIdOrNull = getCurrentUserIdSync();
      if (userIdOrNull === null) {
        logger.error(LogCategory.AUTH, 'Utilisateur non authentifié pour mettre à jour le plan');
        return {
          success: false,
          error: 'Utilisateur non authentifié'
        };
      }
      
      const userId = userIdOrNull;
      
      logger.info(LogCategory.DATABASE, 'Mise à jour du plan', { 
        userId, 
        planId: id,
        planData
      });
      
      // Appel au service MCP pour mettre à jour le plan
      const result = await sqliteMCPServer.updatePlanViaMCP(id, planData, userId);
      
      if (!result) {
        logger.error(LogCategory.DATABASE, 'Échec de la mise à jour du plan: résultat null', {
          planId: id
        });
        
        return {
          success: false,
          error: 'Échec de la mise à jour du plan: résultat null'
        };
      }
      
      if (!result.success) {
        logger.error(LogCategory.DATABASE, 'Échec de la mise à jour du plan', {
          error: result.error,
          planId: id
        });
        
        return {
          success: false,
          error: result.error || 'Échec de la mise à jour du plan'
        };
      }
      
      return {
        success: true,
        message: 'Plan mis à jour avec succès'
      };
    } catch (error) {
      logger.error(LogCategory.DATABASE, 'Erreur lors de la mise à jour du plan', {
        error: error instanceof Error ? error.message : String(error),
        planId: id
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
      // Récupérer l'ID utilisateur et gérer le cas où il est null
      const userIdOrNull = getCurrentUserIdSync();
      if (userIdOrNull === null) {
        logger.error(LogCategory.AUTH, 'Utilisateur non authentifié pour créer un plan');
        return {
          success: false,
          error: 'Utilisateur non authentifié'
        };
      }
      
      const userId = userIdOrNull;
      
      logger.info(LogCategory.DATABASE, 'Création d\'un nouveau plan', { 
        userId,
        planData
      });
      
      // Appel au service MCP pour créer le plan
      const result = await sqliteMCPServer.createPlanViaMCP({
        ...planData,
        userId: userId
      }, userId);
      
      if (!result) {
        logger.error(LogCategory.DATABASE, 'Échec de la création du plan: résultat null');
        
        return {
          success: false,
          error: 'Échec de la création du plan: résultat null'
        };
      }
      
      if (!result.success) {
        logger.error(LogCategory.DATABASE, 'Échec de la création du plan', {
          error: result.error
        });
        
        return {
          success: false,
          error: result.error || 'Échec de la création du plan'
        };
      }
      
      // Vérifier que l'ID du plan existe
      if (!result.planId) {
        logger.error(LogCategory.DATABASE, 'ID du plan manquant dans le résultat de création');
        return {
          success: false,
          error: 'ID du plan manquant dans le résultat de création'
        };
      }
      
      return {
        success: true,
        data: {
          planId: result.planId
        },
        message: 'Plan créé avec succès'
      };
    } catch (error) {
      logger.error(LogCategory.DATABASE, 'Erreur lors de la création du plan', {
        error: error instanceof Error ? error.message : String(error)
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue lors de la création du plan'
      };
    }
  }
  
  /**
   * Récupère le plan courant de l'utilisateur
   * @returns Résultat de l'opération avec le plan courant
   */
  async getCurrentPlan(): Promise<OperationResult<{ plan: any }>> {
    try {
      // Récupérer l'ID utilisateur et gérer le cas où il est null
      const userIdOrNull = getCurrentUserIdSync();
      if (userIdOrNull === null) {
        logger.error(LogCategory.AUTH, 'Utilisateur non authentifié pour récupérer le plan courant');
        return {
          success: false,
          error: 'Utilisateur non authentifié'
        };
      }
      
      const userId = userIdOrNull;
      
      logger.info(LogCategory.DATABASE, 'Récupération du plan courant', { userId });
      
      // Appel au service MCP pour récupérer le plan courant
      const result = await sqliteMCPServer.getCurrentPlanViaMCP(userId);
      
      if (!result) {
        logger.error(LogCategory.DATABASE, 'Échec de la récupération du plan courant: résultat null');
        return {
          success: false,
          error: 'Échec de la récupération du plan courant: résultat null'
        };
      }
      
      if (!result.success) {
        logger.error(LogCategory.DATABASE, 'Échec de la récupération du plan courant', {
          error: result.error
        });
        
        return {
          success: false,
          error: result.error || 'Échec de la récupération du plan courant'
        };
      }
      
      return {
        success: true,
        data: {
          plan: result.plan || null
        },
        message: result.plan ? 'Plan courant récupéré avec succès' : 'Aucun plan courant défini'
      };
    } catch (error) {
      logger.error(LogCategory.DATABASE, 'Erreur lors de la récupération du plan courant', {
        error: error instanceof Error ? error.message : String(error)
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue lors de la récupération du plan courant'
      };
    }
  }
}

// Exporter une instance singleton du service
export const planPagesService = new PlanPagesService();
