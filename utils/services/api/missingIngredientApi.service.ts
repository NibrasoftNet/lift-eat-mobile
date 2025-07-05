/**
 * Service dédié aux appels API pour la gestion des ingrédients manquants
 */
import { ingredientSuggestionCoreService } from '@/utils/services/core/ingredient-suggestion-core.service';
import { ingredientCoreService } from '@/utils/services/core/ingredient-core.service';
import { IaIngredientType } from '@/utils/validation/ia/ia.schemas';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { IaError, IaErrorType } from '@/utils/services/ia/errorHandler';
import { MealUnitEnum } from '@/utils/enum/meal.enum';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';

/**
 * Type pour le statut d'une suggestion
 */
export type SuggestionStatus = 'pending' | 'accepted' | 'rejected';

/**
 * Interface pour une suggestion d'ingrédient
 */
export interface IngredientSuggestion {
  id: number;
  mealId: number;
  userId: number;
  ingredientName: string;
  similarIngredientId: number | null;
  unit: string;
  quantity: number;
  status: SuggestionStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface pour les requêtes de suggestion d'ingrédients
 */
export interface SuggestionRequest {
  mealId: number;
  userId: number;
  ingredientName: string;
  unit?: string;
  quantity?: number;
}

/**
 * Interface pour les mises à jour de statut de suggestion
 */
export interface SuggestionStatusUpdate {
  suggestionId: number;
  status: SuggestionStatus;
}

/**
 * Service API pour la gestion des ingrédients manquants
 */
export const missingIngredientApiService = {
  /**
   * Récupère les suggestions d'ingrédients pour un repas
   * @param mealId ID du repas (optionnel)
   * @param status Statut des suggestions (optionnel)
   * @returns Liste des suggestions d'ingrédients
   */
  async getSuggestions(
    mealId?: number,
    status?: SuggestionStatus,
  ): Promise<{ success: boolean; suggestions?: any[]; error?: string }> {
    try {
      logger.debug(
        LogCategory.IA,
        `Récupération des suggestions${
          mealId ? ` pour le repas ${mealId}` : ''
        }`,
        'getSuggestions',
      );

      const result = await ingredientSuggestionCoreService.getSuggestions(
        status,
      );

      // Si un mealId est spécifié, filtrer les suggestions
      if (mealId && result.success && result.suggestions) {
        result.suggestions = result.suggestions.filter(
          (s) => s.mealId === mealId,
        );
      }

      return result;
    } catch (error) {
      logger.error(
        LogCategory.IA,
        `Erreur lors de la récupération des suggestions: ${
          error instanceof Error ? error.message : String(error)
        }`,
        'getSuggestions',
      );

      return {
        success: false,
        error: `Erreur lors de la récupération des suggestions: ${
          error instanceof Error ? error.message : String(error)
        }`,
      };
    }
  },

  /**
   * Sauvegarde une suggestion d'ingrédient
   * @param request Requête de suggestion
   * @returns Résultat avec l'ID de la suggestion créée
   */
  async saveSuggestion(
    request: SuggestionRequest,
  ): Promise<{ success: boolean; suggestionId?: number; error?: string }> {
    try {
      logger.debug(
        LogCategory.IA,
        `Sauvegarde d'une suggestion pour le repas ${request.mealId}`,
        'saveSuggestion',
      );

      // Créer la suggestion directement, sans rechercher d'ingrédients similaires
      const ingredient: IaIngredientType = {
        name: request.ingredientName,
        unit: request.unit
          ? (request.unit as MealUnitEnum)
          : MealUnitEnum.GRAMMES,
        quantity: request.quantity || 0,
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      };

      const response = await ingredientSuggestionCoreService.saveSuggestion(
        ingredient,
        'pending',
      );

      return response;
    } catch (error) {
      logger.error(
        LogCategory.IA,
        `Erreur lors de la sauvegarde d'une suggestion: ${
          error instanceof Error ? error.message : String(error)
        }`,
        'saveSuggestion',
      );

      return {
        success: false,
        error: `Erreur lors de la sauvegarde d'une suggestion: ${
          error instanceof Error ? error.message : String(error)
        }`,
      };
    }
  },

  /**
   * Met à jour le statut d'une suggestion
   * @param update Mise à jour de statut
   * @returns Résultat de la mise à jour
   */
  async updateSuggestionStatus(
    update: SuggestionStatusUpdate,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      logger.debug(
        LogCategory.IA,
        `Mise à jour du statut de la suggestion ${update.suggestionId} à ${update.status}`,
        'updateSuggestionStatus',
      );

      const response = await ingredientSuggestionCoreService.updateSuggestion(
        update.suggestionId,
        update.status,
      );

      return response;
    } catch (error) {
      logger.error(
        LogCategory.IA,
        `Erreur lors de la mise à jour du statut: ${
          error instanceof Error ? error.message : String(error)
        }`,
        'updateSuggestionStatus',
      );

      return {
        success: false,
        error: `Erreur lors de la mise à jour du statut: ${
          error instanceof Error ? error.message : String(error)
        }`,
      };
    }
  },

  /**
   * Supprime une suggestion
   * @param suggestionId ID de la suggestion
   * @returns Résultat de la suppression
   */
  async deleteSuggestion(
    suggestionId: number,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      logger.debug(
        LogCategory.IA,
        `Suppression de la suggestion ${suggestionId}`,
        'deleteSuggestion',
      );

      const response = await ingredientSuggestionCoreService.deleteSuggestion(
        suggestionId,
      );

      return response;
    } catch (error) {
      logger.error(
        LogCategory.IA,
        `Erreur lors de la suppression de la suggestion: ${
          error instanceof Error ? error.message : String(error)
        }`,
        'deleteSuggestion',
      );

      return {
        success: false,
        error: `Erreur lors de la suppression de la suggestion: ${
          error instanceof Error ? error.message : String(error)
        }`,
      };
    }
  },
};
