/**
 * Service de gestion des drawers d'ingru00e9dients
 * Fournit des fonctionnalitu00e9s pour les composants drawer liu00e9s aux ingru00e9dients
 */

import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { MealUnitEnum } from '@/utils/enum/meal.enum';
import { IngredientDrawerServiceInterface, GetIngredientsParams, GetIngredientsResult, IngredientWithUniqueId } from '../interfaces/drawer.interface';
import { getCurrentUserIdSync } from '@/utils/helpers/userContext';

// Constantes pour l'optimisation des performances
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_MAX_ITEMS = 60;
const DEFAULT_DEBOUNCE_DELAY = 300;

/**
 * Implu00e9mentation du service pour les drawers d'ingru00e9dients
 */
class IngredientDrawerService implements IngredientDrawerServiceInterface {
  // Stockage des timers pour le debounce
  private debounceTimers: Map<string, NodeJS.Timeout> = new Map();
  
  /**
   * Ru00e9cupu00e8re une liste d'ingru00e9dients optimisu00e9e pour l'affichage
   * @param params - Paramu00e8tres de recherche et pagination
   * @returns Une promesse contenant les ingru00e9dients et les informations de pagination
   */
  async fetchIngredients(params: GetIngredientsParams): Promise<GetIngredientsResult> {
    const { searchTerm = '', userId, pageParam = 1, pageSize = DEFAULT_PAGE_SIZE, maxItems = DEFAULT_MAX_ITEMS } = params;
    
    // Vu00e9rification de l'authentification
    if (!userId) {
      logger.error(LogCategory.AUTH, "Cannot fetch ingredients: User not authenticated");
      return { data: [], nextPage: null };
    }
    
    // Vu00e9rifier si nous avons du00e9ju00e0 atteint la limite d'u00e9lu00e9ments
    if (pageParam > Math.ceil(maxItems / pageSize)) {
      return { data: [], nextPage: null };
    }
    
    try {
      logger.info(LogCategory.APP, `Fetching ingredients for user ${userId} (page ${pageParam}, search: '${searchTerm}')`);
      
      // Utilisé le MCP Server pour récupérer les ingrédients
      const result = await sqliteMCPServer.getIngredientsListViaMCP(searchTerm, pageSize);
      
      if (!result.success || !result.ingredients) {
        logger.error(LogCategory.APP, `Failed to get ingredients: ${result.error || 'Unknown error'}`);
        return { data: [], nextPage: null };
      }
      
      // Limiter le nombre d'ingrédients à la taille de la page
      const ingredients = result.ingredients.slice(0, pageSize);
      
      // Optimiser les données pour l'affichage
      const processedIngredients = this.optimizeIngredientData(ingredients, pageParam);
      
      // Déterminer s'il y a une page suivante
      const hasNextPage = ingredients.length === pageSize && pageParam < Math.ceil(maxItems / pageSize);
      
      return {
        data: processedIngredients,
        nextPage: hasNextPage ? pageParam + 1 : null,
        totalCount: result.ingredients.length
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(LogCategory.APP, `Error fetching ingredients: ${errorMessage}`);
      return { data: [], nextPage: null };
    }
  }
  
  /**
   * Optimise les donnu00e9es d'ingru00e9dients pour l'affichage dans une liste
   * @param ingredients - Les ingru00e9dients bruts u00e0 optimiser
   * @param pageParam - Indice de la page courante (pour la gu00e9nu00e9ration d'ID uniques)
   * @returns Les ingru00e9dients optimisu00e9s avec des identifiants uniques
   */
  optimizeIngredientData(ingredients: any[], pageParam: number): IngredientWithUniqueId[] {
    return ingredients.map((ingredient, index) => {
      // Générer un ID unique avec le format ing-[id]-p[page]-i[index]
      const uniqueId = `ing-${ingredient.id}-p${pageParam}-i${index}`;
      
      // Déterminer si l'ingrédient a une image
      const hasImage = !!ingredient.image;
      
      // Créer l'unité d'affichage formatée
      const displayUnit = ingredient.unit || 'g';
      
      // Formater le nom pour l'affichage
      const displayName = ingredient.name?.charAt(0).toUpperCase() + ingredient.name?.slice(1) || 'Ingrédient';
      
      // Retourner l'objet optimisé
      return {
        id: ingredient.id,
        name: ingredient.name || '',
        uniqueId,
        image: ingredient.image,
        quantity: ingredient.quantity || 0,
        unit: ingredient.unit || null,
        displayName,
        displayUnit,
        hasImage,
        calories: ingredient.calories || 0,
        carbs: ingredient.carbs || 0,
        fat: ingredient.fat || 0,
        protein: ingredient.protein || 0,
        createdAt: ingredient.createdAt || new Date(),
        updatedAt: ingredient.updatedAt || new Date(),
        // Copier les autres propriétés
        ...ingredient
      };
    });
  }
  
  /**
   * Debounce un terme de recherche pour u00e9viter trop d'appels u00e0 l'API
   * @param searchTerm - Le terme de recherche u00e0 debouncer
   * @param callback - La fonction u00e0 appeler avec le terme debouncu00e9
   * @param delay - Le du00e9lai de debounce en ms (par du00e9faut: 300ms)
   */
  debounceSearchTerm(
    searchTerm: string,
    callback: (term: string) => void,
    delay: number = DEFAULT_DEBOUNCE_DELAY
  ): void {
    // Identifiant unique pour ce callback (utiliser un timestamp pour différencier les instances)
    const callbackId = `search-${Date.now()}`;
    
    // Annuler le timer existant s'il existe
    if (this.debounceTimers.has(callbackId)) {
      clearTimeout(this.debounceTimers.get(callbackId));
    }
    
    // Définir un nouveau timer
    const timer = setTimeout(() => {
      callback(searchTerm);
      this.debounceTimers.delete(callbackId);
    }, delay);
    
    // Stocker le timer
    this.debounceTimers.set(callbackId, timer);
  }

  /**
   * Obtient les informations d'affichage d'un ingru00e9dient par son ID
   * @param ingredientId - L'ID de l'ingru00e9dient
   * @returns Les informations d'affichage ou une valeur par du00e9faut si non trouvuu00e9
   */
  getIngredientDisplayInfo(ingredientId: number): { displayName: string; displayUnit: string } {
    try {
      // Cette méthode pourrait être étendue pour récupérer les informations à partir d'un cache ou de la base de données
      // Pour l'instant, nous retournons des valeurs par défaut
      return {
        displayName: `Ingrédient ${ingredientId}`,
        displayUnit: 'g'
      };
    } catch (error) {
      logger.error(LogCategory.APP, `Error getting ingredient display info: ${error}`);
      return {
        displayName: 'Ingrédient inconnu',
        displayUnit: 'g'
      };
    }
  }
  
  /**
   * Détermine le type d'élément pour les filtres et l'affichage
   * @param item - L'ingrédient dont on veut obtenir le type
   * @returns Une chaîne de caractères indiquant le type ('ingredient')
   */
  getItemType(item: IngredientWithUniqueId): string {
    // Pour l'instant, nous retournons simplement 'ingredient' pour tous les éléments
    // Cette fonction pourrait être étendue pour traiter différents types d'ingrédients
    return 'ingredient';
  }
}

// Exporter une instance unique du service
export const ingredientDrawerService = new IngredientDrawerService();
