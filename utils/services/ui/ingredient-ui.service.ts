/**
 * Service UI pour la gestion de l'affichage des ingrédients
 * Ce service encapsule uniquement la logique de formatage pour l'UI
 */

import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { IngredientStandardOrmProps } from '@/db/schema';
import { MealUnitEnum } from '@/utils/enum/meal.enum';

/**
 * Service pour le formatage des ingrédients dans l'UI
 */
export const ingredientUIService = {
  /**
   * Formate un ingrédient pour l'affichage dans l'UI
   * @param ingredientIdOrObject L'ingrédient à formater ou son ID
   */
  formatIngredientForDisplay(
    ingredientIdOrObject: number | IngredientStandardOrmProps
  ): { displayName: string; displayUnit: string } {
    try {
      let displayName = '';
      let displayUnit = 'g';
      
      // Si nous avons un objet ingrédient complet
      if (typeof ingredientIdOrObject !== 'number') {
        const ingredient = ingredientIdOrObject;
        
        // Formater le nom pour l'affichage
        displayName = ingredient.name || `Ingrédient #${ingredient.id}`;
        
        // Déterminer l'unité d'affichage en fonction de l'unité de l'ingrédient
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
      } else {
        // Si nous n'avons que l'ID
        displayName = `Ingrédient #${ingredientIdOrObject}`;
      }
      
      return { displayName, displayUnit };
    } catch (error) {
      logger.error(LogCategory.UI, `Erreur lors du formatage de l'ingrédient pour affichage`, {
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
};
