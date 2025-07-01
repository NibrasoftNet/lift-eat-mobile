import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { IaIngredientType } from '@/utils/validation/ia/ia.schemas';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { getCurrentUserIdSync } from '@/utils/helpers/userContext';
import { ingredientCoreService } from './ingredient-core.service';

/**
 * Service core pour la gestion des suggestions d'ingrédients (MCP)
 * Centralise les opérations liées aux suggestions d'ingrédients pour une meilleure organisation
 * Respecte l'architecture MCP en séparant la logique métier des couches de présentation
 */
export const ingredientSuggestionCoreService = {
  /**
   * Sauvegarde une suggestion d'ingrédient pour l'utilisateur actuel
   * @param suggestion - Données de l'ingrédient suggéré
   * @param status - Statut de la suggestion (pending, accepted, rejected)
   * @param source - Source de la suggestion (ia, user, etc.)
   * @returns Résultat de l'opération avec l'ID de la suggestion
   */
  async saveSuggestion(
    suggestion: IaIngredientType, 
    status: 'pending' | 'accepted' | 'rejected' = 'pending',
    source: string = 'ia'
  ): Promise<{ success: boolean; suggestionId?: number; error?: string }> {
    try {
      const userId = getCurrentUserIdSync();
      if (!userId) {
        throw new Error('User not authenticated');
      }

      logger.info(LogCategory.APP, `Saving ingredient suggestion for "${suggestion.name}"`);
      
      // Utiliser SQLiteMCPServer pour enregistrer la suggestion dans la base de données
      const result = await sqliteMCPServer.saveIngredientSuggestionViaMCP({
        suggestion,
        userId,
        status,
        source
      });

      if (result.success) {
        logger.info(LogCategory.APP, `Successfully saved suggestion for "${suggestion.name}" with ID ${result.suggestionId}`);
      } else {
        throw new Error(result.error);
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(LogCategory.APP, `Error saving ingredient suggestion: ${errorMessage}`);
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  /**
   * Récupère les suggestions d'ingrédients pour l'utilisateur actuel
   * @param status - Filtrer par statut (optionnel)
   * @param limit - Limite de résultats (optionnel, défaut 50)
   * @returns Liste des suggestions d'ingrédients
   */
  async getSuggestions(
    status?: 'pending' | 'accepted' | 'rejected',
    limit: number = 50
  ): Promise<{ success: boolean; suggestions?: any[]; error?: string }> {
    try {
      const userId = getCurrentUserIdSync();
      if (!userId) {
        throw new Error('User not authenticated');
      }

      logger.info(LogCategory.APP, `Getting ingredient suggestions for user ${userId}`);
      
      // Utiliser SQLiteMCPServer pour récupérer les suggestions de la base de données
      const result = await sqliteMCPServer.getIngredientSuggestionsViaMCP({
        userId,
        status,
        limit
      });

      if (result.success) {
        logger.info(LogCategory.APP, `Retrieved ${result.suggestions?.length || 0} ingredient suggestions`);
      } else {
        throw new Error(result.error);
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(LogCategory.APP, `Error getting ingredient suggestions: ${errorMessage}`);
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  /**
   * Met à jour le statut d'une suggestion d'ingrédient
   * @param suggestionId - ID de la suggestion à mettre à jour
   * @param status - Nouveau statut
   * @param data - Données additionnelles à mettre à jour (optionnel)
   * @returns Résultat de l'opération
   */
  async updateSuggestion(
    suggestionId: number,
    status: 'pending' | 'accepted' | 'rejected',
    data?: Partial<IaIngredientType>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const userId = getCurrentUserIdSync();
      if (!userId) {
        throw new Error('User not authenticated');
      }

      logger.info(LogCategory.APP, `Updating ingredient suggestion ${suggestionId} to status ${status}`);
      
      // Utiliser SQLiteMCPServer pour mettre à jour la suggestion dans la base de données
      const result = await sqliteMCPServer.updateIngredientSuggestionViaMCP({
        suggestionId,
        userId,
        status,
        data
      });

      if (result.success) {
        logger.info(LogCategory.APP, `Successfully updated suggestion ${suggestionId} to status ${status}`);
      } else {
        throw new Error(result.error);
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(LogCategory.APP, `Error updating ingredient suggestion: ${errorMessage}`);
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  /**
   * Supprime une suggestion d'ingrédient
   * @param suggestionId - ID de la suggestion à supprimer
   * @returns Résultat de l'opération
   */
  async deleteSuggestion(
    suggestionId: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const userId = getCurrentUserIdSync();
      if (!userId) {
        throw new Error('User not authenticated');
      }

      logger.info(LogCategory.APP, `Deleting ingredient suggestion ${suggestionId}`);
      
      // Utiliser SQLiteMCPServer pour supprimer la suggestion de la base de données
      const result = await sqliteMCPServer.deleteIngredientSuggestionViaMCP({
        suggestionId,
        userId
      });

      if (result.success) {
        logger.info(LogCategory.APP, `Successfully deleted suggestion ${suggestionId}`);
      } else {
        throw new Error(result.error);
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(LogCategory.APP, `Error deleting ingredient suggestion: ${errorMessage}`);
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  /**
   * Accepte une suggestion et crée l'ingrédient dans la base de données
   * @param suggestionId - ID de la suggestion à accepter
   * @returns Résultat de l'opération avec l'ID de l'ingrédient créé
   */
  async acceptSuggestionAndCreateIngredient(
    suggestionId: number
  ): Promise<{ success: boolean; ingredientId?: number; error?: string }> {
    try {
      const userId = getCurrentUserIdSync();
      if (!userId) {
        throw new Error('User not authenticated');
      }

      logger.info(LogCategory.APP, `Accepting suggestion ${suggestionId} and creating ingredient`);
      
      // 1. Récupérer les suggestions pour trouver celle qui correspond à l'ID
      const suggestionsResult = await this.getSuggestions();
      
      if (!suggestionsResult.success || !suggestionsResult.suggestions) {
        throw new Error('Failed to get ingredient suggestions');
      }
      
      const suggestion = suggestionsResult.suggestions.find(s => s.id === suggestionId);
      if (!suggestion) {
        throw new Error(`Suggestion with ID ${suggestionId} not found`);
      }
      
      // 2. Convertir la suggestion en format IaIngredientType
      const ingredientData: IaIngredientType = {
        name: suggestion.name,
        unit: suggestion.unit,
        quantity: suggestion.quantity || 100,
        calories: suggestion.suggested_calories || 0,
        carbs: suggestion.suggested_carbs || 0,
        protein: suggestion.suggested_protein || 0,
        fat: suggestion.suggested_fat || 0
      };
      
      // 3. Utiliser le service d'ingrédients pour créer l'ingrédient
      const result = await ingredientCoreService.createIngredient(ingredientData);
      
      if (!result || !result.id) {
        throw new Error('Failed to create ingredient from suggestion');
      }
      
      // 4. Mettre à jour le statut de la suggestion
      await this.updateSuggestion(suggestionId, 'accepted');
      
      logger.info(LogCategory.APP, `Successfully accepted suggestion ${suggestionId} and created ingredient ${result.id}`);
      
      return {
        success: true,
        ingredientId: result.id
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(LogCategory.APP, `Error accepting suggestion and creating ingredient: ${errorMessage}`);
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }
};
