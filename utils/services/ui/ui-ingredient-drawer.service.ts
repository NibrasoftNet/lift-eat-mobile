import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { drawerService } from '@/utils/services/ui/ui-drawer.service';
import { IngredientDrawerServiceInterface, GetIngredientsParams, GetIngredientsResult, IngredientWithUniqueId } from '@/utils/interfaces/drawer.interface';
import { GetIngredientsListParams } from '@/utils/mcp/interfaces/ingredient-interfaces';
import { IngredientStandardOrmProps } from '@/db/schema';
import { MealUnitEnum } from '@/utils/enum/meal.enum';

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
      displayName: this.getIngredientDisplayInfo(ingredient).displayName,
      displayUnit: this.getIngredientDisplayInfo(ingredient).displayUnit,
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

  /**
   * Obtient les informations d'affichage pour un ingrédient
   * @param ingredientIdOrObject ID de l'ingrédient ou objet ingrédient complet
   * @returns Nom et unité formatés pour l'affichage
   */
  getIngredientDisplayInfo(
    ingredientIdOrObject: number | IngredientStandardOrmProps
  ): { displayName: string; displayUnit: string } {
    try {
      // Si l'entrée est un ID, nous n'avons pas encore l'ingrédient
      // Comme nous n'avons pas de méthode getIngredientById synchrone,
      // nous retournons des valeurs par défaut qui seront mises à jour
      // quand l'optimizeIngredientData recevra l'objet complet
      if (typeof ingredientIdOrObject === 'number') {
        return {
          displayName: `Ingrédient #${ingredientIdOrObject}`,
          displayUnit: 'g'
        };
      }
      
      // À ce stade, nous avons l'objet ingrédient complet
      const ingredient = ingredientIdOrObject;
      
      // Formater le nom pour l'affichage (première lettre en majuscule)
      const displayName = ingredient.name 
        ? ingredient.name.charAt(0).toUpperCase() + ingredient.name.slice(1).toLowerCase()
        : 'Ingrédient';
      
      // Formater l'unité selon les standards de l'application
      let displayUnit = 'g'; // Valeur par défaut
      
      if (ingredient.unit) {
        switch (ingredient.unit) {
          case MealUnitEnum.GRAMMES:
            displayUnit = 'g';
            break;
          case MealUnitEnum.KILOGRAMMES:
            displayUnit = 'kg';
            break;
          case MealUnitEnum.MILLILITRES:
            displayUnit = 'ml';
            break;
          case MealUnitEnum.LITRES:
            displayUnit = 'L';
            break;
          case MealUnitEnum.PIECES:
            displayUnit = 'pièce(s)';
            break;
          case MealUnitEnum.PORTION:
            displayUnit = 'portion(s)';
            break;
          case MealUnitEnum.TASSES:
            displayUnit = 'tasse(s)';
            break;
          case MealUnitEnum.CUILLERES_A_SOUPE:
            displayUnit = 'c. à s.';
            break;
          case MealUnitEnum.CUILLERES_A_CAFE:
            displayUnit = 'c. à c.';
            break;
          case MealUnitEnum.SERVING:
            displayUnit = 'portion';
            break;
          case MealUnitEnum.PLATE:
            displayUnit = 'assiette';
            break;
          case MealUnitEnum.BOWL:
            displayUnit = 'bol';
            break;
          default:
            displayUnit = 'g';
        }
      }
      
      return { displayName, displayUnit };
    } catch (error) {
      logger.error(LogCategory.UI, `Erreur lors de la récupération des informations d'affichage de l'ingrédient`, {
        error: error instanceof Error ? error.message : String(error),
        ingredientId: typeof ingredientIdOrObject === 'number' ? ingredientIdOrObject : ingredientIdOrObject.id
      });
      
      // Retourner des valeurs par défaut en cas d'erreur
      const defaultName = typeof ingredientIdOrObject === 'number' 
        ? `Ingrédient #${ingredientIdOrObject}` 
        : (ingredientIdOrObject.name || 'Ingrédient');
      
      return {
        displayName: defaultName,
        displayUnit: 'g'
      };
    }
  }

  getItemType(item: IngredientWithUniqueId): string {
    return 'ingredient';
  }
}

// Exporter une instance unique du service
export const ingredientDrawerService = new IngredientDrawerService();
