/**
 * Service pour la gestion des pages de repas
 * Ce service encapsule la logique métier liée aux pages de repas
 */

import { MealFilters, MealPagesServiceInterface, OperationResult } from "@/utils/interfaces/pages.interface";
import { MealOrmProps, MealWithIngredientAndStandardOrmProps } from "@/db/schema";
import sqliteMCPServer from "@/utils/mcp/sqlite-server";
import { logger } from "@/utils/services/logging.service";
import { LogCategory } from "@/utils/enum/logging.enum";
import { getCurrentUserIdSync } from "@/utils/helpers/userContext";

/**
 * Service pour les opérations liées aux pages de repas
 * Implémente l'interface MealPagesServiceInterface
 */
class MealPagesService implements MealPagesServiceInterface {
  /**
   * Récupère la liste des repas avec filtrage pour la page d'index
   * @param filters Filtres à appliquer (recherche, type, cuisine, pagination)
   * @returns Résultat de l'opération avec les repas filtrés et le nombre total
   */
  async getMealsList(filters: MealFilters): Promise<OperationResult<{
    meals: MealOrmProps[];
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
        logger.error(LogCategory.AUTH, 'Utilisateur non authentifié pour récupérer les repas');
        return {
          success: false,
          error: 'Utilisateur non authentifié'
        };
      }
      
      const userId = userIdOrNull; // Maintenant c'est un number
      
      logger.info(LogCategory.DATABASE, 'Récupération de la liste des repas avec filtres', { 
        userId, 
        filters 
      });
      
      // Définir les options de pagination
      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const offset = (page - 1) * limit;
      
      // Appel au service MCP pour récupérer les repas filtrés
      const result = await sqliteMCPServer.getMealsListViaMCP(
        userId,
        filters.cuisine ? String(filters.cuisine) : undefined,
        filters.mealType ? String(filters.mealType) : undefined,
        filters.search
      );
      
      if (!result) {
        logger.error(LogCategory.DATABASE, 'Échec de la récupération des repas: résultat null');
        return {
          success: false,
          error: 'Échec de la récupération des repas: résultat null'
        };
      }
      
      if (!result.success) {
        logger.error(LogCategory.DATABASE, 'Échec de la récupération des repas', {
          error: result.error
        });
        
        return {
          success: false,
          error: result.error || 'Échec de la récupération des repas'
        };
      }
      
      // S'assurer que nous avons un tableau de repas
      const meals = Array.isArray(result.meals) ? result.meals : [];
      const totalCount = meals.length;
      
      // Calculer le nombre total de pages
      const totalPages = Math.ceil(totalCount / limit);
      
      return {
        success: true,
        data: {
          meals: meals,
          totalCount: totalCount,
          pageInfo: {
            currentPage: page,
            totalPages
          }
        },
        message: `${meals.length} repas récupérés avec succès`
      };
    } catch (error) {
      logger.error(LogCategory.DATABASE, 'Erreur lors de la récupération des repas', {
        error: error instanceof Error ? error.message : String(error),
        filters
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue lors de la récupération des repas'
      };
    }
  }
  
  /**
   * Récupère les détails d'un repas pour la page de détail
   * @param id ID du repas
   * @returns Résultat de l'opération avec les détails du repas et ses ingrédients
   */
  async getMealDetails(id: number): Promise<OperationResult<{
    meal: MealWithIngredientAndStandardOrmProps;
    ingredients: any[];
  }>> {
    try {
      // Récupérer l'ID utilisateur et gérer le cas où il est null
      const userIdOrNull = getCurrentUserIdSync();
      if (userIdOrNull === null) {
        logger.error(LogCategory.AUTH, 'Utilisateur non authentifié pour récupérer les détails du repas');
        return {
          success: false,
          error: 'Utilisateur non authentifié'
        };
      }
      
      const userId = userIdOrNull; // Maintenant c'est un number
      
      logger.info(LogCategory.DATABASE, 'Récupération des détails du repas', { 
        userId, 
        mealId: id 
      });
      
      // Appel au service MCP pour récupérer les détails du repas avec ses ingrédients
      const result = await sqliteMCPServer.getMealByIdWithIngredientsViaMCP(id, userId);
      
      if (!result) {
        logger.error(LogCategory.DATABASE, 'Échec de la récupération des détails du repas: résultat null', {
          mealId: id
        });
        
        return {
          success: false,
          error: 'Échec de la récupération des détails du repas: résultat null'
        };
      }
      
      if (!result.success) {
        logger.error(LogCategory.DATABASE, 'Échec de la récupération des détails du repas', {
          error: result.error,
          mealId: id
        });
        
        return {
          success: false,
          error: result.error || 'Échec de la récupération des détails du repas'
        };
      }
      
      return {
        success: true,
        data: {
          meal: result.meal,
          ingredients: result.ingredients || []
        },
        message: 'Détails du repas récupérés avec succès'
      };
    } catch (error) {
      logger.error(LogCategory.DATABASE, 'Erreur lors de la récupération des détails du repas', {
        error: error instanceof Error ? error.message : String(error),
        mealId: id
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue lors de la récupération des détails du repas'
      };
    }
  }
  
  /**
   * Supprime un repas
   * @param id ID du repas à supprimer
   * @returns Résultat de l'opération
   */
  async deleteMeal(id: number): Promise<OperationResult> {
    try {
      // Récupérer l'ID utilisateur et gérer le cas où il est null
      const userIdOrNull = getCurrentUserIdSync();
      if (userIdOrNull === null) {
        logger.error(LogCategory.AUTH, 'Utilisateur non authentifié pour supprimer le repas');
        return {
          success: false,
          error: 'Utilisateur non authentifié'
        };
      }
      
      const userId = userIdOrNull; // Maintenant c'est un number
      
      logger.info(LogCategory.DATABASE, 'Suppression du repas', { 
        userId, 
        mealId: id 
      });
      
      // Appel au service MCP pour supprimer le repas
      const result = await sqliteMCPServer.deleteMealViaMCP(id, userId);
      
      if (!result) {
        logger.error(LogCategory.DATABASE, 'Échec de la suppression du repas: résultat null', {
          mealId: id
        });
        
        return {
          success: false,
          error: 'Échec de la suppression du repas: résultat null'
        };
      }
      
      if (!result.success) {
        logger.error(LogCategory.DATABASE, 'Échec de la suppression du repas', {
          error: result.error,
          mealId: id
        });
        
        return {
          success: false,
          error: result.error || 'Échec de la suppression du repas'
        };
      }
      
      return {
        success: true,
        message: 'Repas supprimé avec succès'
      };
    } catch (error) {
      logger.error(LogCategory.DATABASE, 'Erreur lors de la suppression du repas', {
        error: error instanceof Error ? error.message : String(error),
        mealId: id
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue lors de la suppression du repas'
      };
    }
  }
}

// Exporter une instance singleton du service
export const mealPagesService = new MealPagesService();
