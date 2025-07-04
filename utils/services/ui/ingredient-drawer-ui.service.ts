import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { drawerUIService } from '@/utils/services/ui/drawer-ui.service';
import { ingredientPagesService } from '@/utils/services/pages/ingredient-pages.service';
import { IngredientDrawerServiceInterface, GetIngredientsParams, GetIngredientsResult, IngredientWithUniqueId } from '@/utils/interfaces/drawer.interface';
import { IngredientStandardOrmProps } from '@/db/schema';

class IngredientDrawerUIService implements IngredientDrawerServiceInterface {
  async fetchIngredients(params: GetIngredientsParams): Promise<GetIngredientsResult> {
    try {
      // Utiliser le service ingredientPagesService (architecture MCP)
      const result = await ingredientPagesService.getIngredientsForDisplay(params);
      
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch ingredients');
      }
      
      return result.data;
    } catch (error) {
      logger.error(LogCategory.UI, 'Error fetching ingredients', {
        error: error instanceof Error ? error.message : String(error)
      });
      return { data: [], nextPage: null };
    }
  }

  // Méthode supprimée: optimizeIngredientData
  // Cette fonctionnalité est désormais gérée par ingredientPagesService.getIngredientsForDisplay
  // Suppression effectuée le 13 mai 2025 suite à l'analyse des logs confirmant qu'elle n'est plus utilisée

  debounceSearchTerm(
    searchTerm: string,
    callback: (term: string) => void,
    delay: number = 300
  ): void {
    drawerUIService.debounceSearchTerm(searchTerm, callback, delay);
  }

  /**
   * Obtient les informations d'affichage pour un ingrédient
   * @param ingredientIdOrObject ID de l'ingrédient ou objet ingrédient complet
   * @returns Nom et unité formatés pour l'affichage
   */
  getIngredientDisplayInfo(
    ingredientIdOrObject: number | IngredientStandardOrmProps
  ): { displayName: string; displayUnit: string } {
    // Déléguer au service ingredientPagesService (architecture MCP)
    return ingredientPagesService.formatIngredientForDisplay(ingredientIdOrObject);
  }

  getItemType(item: IngredientWithUniqueId): string {
    return 'ingredient';
  }
}

// Exporter une instance unique du service
export const ingredientDrawerUIService = new IngredientDrawerUIService();
