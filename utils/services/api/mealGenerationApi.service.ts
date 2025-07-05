/**
 * Service dédié aux appels API pour la génération et la gestion des repas
 */
import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { IaError, IaErrorType } from '@/utils/services/ia/errorHandler';
import { IaMealType } from '@/utils/validation/ia/ia.schemas';
import { getQueryClient } from '@/utils/helpers/queryClient';
import { mealService } from '@/utils/services/core/meal-core.service';
import { MealTypeEnum, CuisineTypeEnum } from '@/utils/enum/meal.enum';

/**
 * Interface pour la réponse de création de repas
 */
export interface CreateMealResponse {
  success: boolean;
  mealId?: number;
  error?: string;
}

/**
 * Interface pour les paramètres de recherche de repas
 */
export interface SearchMealParams {
  userId: number;
  mealType?: MealTypeEnum;
  cuisineType?: CuisineTypeEnum;
  searchTerm?: string;
  limit?: number;
}

/**
 * Service API pour la génération et la gestion des repas
 */
export const mealGenerationApiService = {
  /**
   * Crée un repas dans la base de données
   * @param meal Données du repas à créer
   * @param userId ID de l'utilisateur
   * @returns Réponse de création
   */
  async createMeal(
    meal: IaMealType,
    userId: number,
  ): Promise<CreateMealResponse> {
    try {
      logger.debug(
        LogCategory.IA,
        `Création du repas ${meal.name} pour l'utilisateur ${userId}`,
        'createMeal',
      );

      // Utiliser le MCP Server pour ajouter le repas
      const result = await sqliteMCPServer.addMealViaMCP(meal, userId);

      if (!result.success) {
        logger.error(
          LogCategory.IA,
          `Erreur lors de la création du repas: ${result.error}`,
          'createMeal',
        );
        return {
          success: false,
          error: result.error,
        };
      }

      // Invalider le cache pour actualiser la liste des repas
      const queryClient = getQueryClient();
      if (queryClient) {
        logger.debug(
          LogCategory.IA,
          `Invalidation du cache des repas pour l'utilisateur ${userId}`,
          'createMeal',
        );
        await queryClient.invalidateQueries({
          predicate: (query) => {
            const queryKey = query.queryKey[0];
            return (
              typeof queryKey === 'string' && queryKey.startsWith('my-meals')
            );
          },
        });
      }

      logger.info(
        LogCategory.IA,
        `Repas ${meal.name} créé avec succès (ID: ${result.mealId})`,
        'createMeal',
      );

      return {
        success: true,
        mealId: result.mealId,
      };
    } catch (error) {
      logger.error(
        LogCategory.IA,
        `Erreur lors de la création du repas: ${
          error instanceof Error ? error.message : String(error)
        }`,
        'createMeal',
      );

      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  },

  /**
   * Récupère un repas par son ID
   * @param mealId ID du repas
   * @param userId ID de l'utilisateur
   * @returns Données du repas
   */
  async getMealById(mealId: number, userId: number): Promise<any> {
    try {
      logger.debug(
        LogCategory.IA,
        `Récupération du repas ${mealId} pour l'utilisateur ${userId}`,
        'getMealById',
      );

      const result = await mealService.getMealDetails(mealId);

      // Vérifier que le repas appartient à l'utilisateur
      if (result.success && result.meal && result.meal.creatorId !== userId) {
        throw new IaError(
          `Repas ${mealId} n'appartient pas à l'utilisateur ${userId}`,
          IaErrorType.UNAUTHORIZED_ERROR,
        );
      }

      return result;
    } catch (error) {
      logger.error(
        LogCategory.IA,
        `Erreur lors de la récupération du repas: ${
          error instanceof Error ? error.message : String(error)
        }`,
        'getMealById',
      );

      throw new IaError(
        `Erreur lors de la récupération du repas: ${
          error instanceof Error ? error.message : String(error)
        }`,
        IaErrorType.API_ERROR,
        error,
      );
    }
  },

  /**
   * Recherche des repas selon des critères
   * @param params Paramètres de recherche
   * @returns Liste des repas correspondants
   */
  async searchMeals(params: SearchMealParams): Promise<any[]> {
    try {
      logger.debug(
        LogCategory.IA,
        `Recherche de repas pour l'utilisateur ${params.userId}`,
        'searchMeals',
      );

      // Convertir les paramètres au format attendu par getMealsList
      const filters = {
        userId: params.userId,
        mealType: params.mealType,
        cuisineType: params.cuisineType,
        searchTerm: params.searchTerm,
        limit: params.limit || 20,
      };

      const result = await mealService.getMealsList(filters);

      if (!result.success) {
        throw new Error(result.error || 'Erreur lors de la recherche de repas');
      }

      return result.meals || [];
    } catch (error) {
      logger.error(
        LogCategory.IA,
        `Erreur lors de la recherche de repas: ${
          error instanceof Error ? error.message : String(error)
        }`,
        'searchMeals',
      );

      throw new IaError(
        `Erreur lors de la recherche de repas: ${
          error instanceof Error ? error.message : String(error)
        }`,
        IaErrorType.API_ERROR,
        error,
      );
    }
  },

  /**
   * Supprime un repas
   * @param mealId ID du repas
   * @param userId ID de l'utilisateur
   * @returns true si la suppression a réussi
   */
  async deleteMeal(mealId: number, userId: number): Promise<boolean> {
    try {
      logger.debug(
        LogCategory.IA,
        `Suppression du repas ${mealId} pour l'utilisateur ${userId}`,
        'deleteMeal',
      );

      // Vérifier que le repas appartient à l'utilisateur
      const mealResult = await mealService.getMealDetails(mealId);
      if (
        mealResult.success &&
        mealResult.meal &&
        mealResult.meal.creatorId !== userId
      ) {
        throw new IaError(
          `Repas ${mealId} n'appartient pas à l'utilisateur ${userId}`,
          IaErrorType.UNAUTHORIZED_ERROR,
        );
      }

      // Supprimer le repas
      await mealService.deleteMeal(mealId);

      // Invalider le cache
      const queryClient = getQueryClient();
      if (queryClient) {
        logger.debug(
          LogCategory.IA,
          `Invalidation du cache des repas pour l'utilisateur ${userId}`,
          'deleteMeal',
        );
        await queryClient.invalidateQueries({
          predicate: (query) => {
            const queryKey = query.queryKey[0];
            return (
              typeof queryKey === 'string' && queryKey.startsWith('my-meals')
            );
          },
        });
      }

      logger.info(
        LogCategory.IA,
        `Repas ${mealId} supprimé avec succès`,
        'deleteMeal',
      );

      return true;
    } catch (error) {
      logger.error(
        LogCategory.IA,
        `Erreur lors de la suppression du repas: ${
          error instanceof Error ? error.message : String(error)
        }`,
        'deleteMeal',
      );

      throw new IaError(
        `Erreur lors de la suppression du repas: ${
          error instanceof Error ? error.message : String(error)
        }`,
        IaErrorType.API_ERROR,
        error,
      );
    }
  },
};
