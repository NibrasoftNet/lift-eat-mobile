import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { drawerService } from '@/utils/services/ui/ui-drawer.service';
import { IngredientDrawerServiceInterface, GetIngredientsParams, GetIngredientsResult, IngredientWithUniqueId } from '@/utils/interfaces/drawer.interface';
import { GetIngredientsListParams } from '@/utils/mcp/interfaces/ingredient-interfaces';
import { IngredientStandardOrmProps } from '@/db/schema';

class IngredientDrawerService implements IngredientDrawerServiceInterface {
  async fetchIngredients(params: GetIngredientsParams): Promise<GetIngredientsResult> {
    try {
      const { userId, searchTerm, pageParam = 1, pageSize = 10, maxItems = 60 } = params;
      
      logger.info(LogCategory.DATABASE, 'Fetching ingredients', { searchTerm, pageParam });
      
      // Appel à getIngredientsListViaMCP avec les paramètres individuels
      const result = await sqliteMCPServer.getIngredientsListViaMCP(searchTerm, pageSize);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch ingredients');
      }
      
      // Optimiser les données pour l'affichage
      const optimizedIngredients = this.optimizeIngredientData(result.ingredients || [], pageParam);
      
      // Déterminer s'il y a une page suivante
      const hasNextPage = optimizedIngredients.length === pageSize;
      const nextPage = hasNextPage ? pageParam + 1 : null;
      
      return {
        data: optimizedIngredients,
        nextPage
      };
    } catch (error) {
      logger.error(LogCategory.DATABASE, 'Error fetching ingredients', {
        error: error instanceof Error ? error.message : String(error)
      });
      return { data: [], nextPage: null };
    }
  }

  optimizeIngredientData(ingredients: IngredientStandardOrmProps[], pageParam: number): IngredientWithUniqueId[] {
    return ingredients.map((ingredient, index) => ({
      ...ingredient,
      uniqueId: drawerService.generateUniqueId('ing', ingredient.id, pageParam, index),
      displayName: this.getIngredientDisplayInfo(ingredient.id).displayName,
      displayUnit: this.getIngredientDisplayInfo(ingredient.id).displayUnit,
      hasImage: !!ingredient.image,
      createdAt: ingredient.createdAt || new Date().toISOString(),
      updatedAt: ingredient.updatedAt || new Date().toISOString()
    }));
  }

  debounceSearchTerm(
    searchTerm: string,
    callback: (term: string) => void,
    delay: number = 300
  ): void {
    drawerService.debounceSearchTerm(searchTerm, callback, delay);
  }

  getIngredientDisplayInfo(ingredientId: number): { displayName: string; displayUnit: string } {
    // TODO: Implémenter la logique pour obtenir les informations d'affichage
    return {
      displayName: 'Ingredient',
      displayUnit: 'g'
    };
  }

  getItemType(item: IngredientWithUniqueId): string {
    return 'ingredient';
  }
}

// Exporter une instance unique du service
export const ingredientDrawerService = new IngredientDrawerService();
