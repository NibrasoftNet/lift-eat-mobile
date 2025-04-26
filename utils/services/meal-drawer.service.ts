/**
 * Service de gestion des drawers de repas
 * Fournit des fonctionnalitu00e9s pour les composants drawer liu00e9s aux repas
 */

import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { MealOrmProps } from '@/db/schema';
import { MealTypeEnum, CuisineTypeEnum } from '@/utils/enum/meal.enum';
import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { getCurrentUserIdSync } from '@/utils/helpers/userContext';
import { invalidateCache, DataType } from '@/utils/helpers/queryInvalidation';
import { MealDrawerServiceInterface, MealTypeColor, MealWithQuantity } from '../interfaces/drawer.interface';
import { QueryClient } from '@tanstack/react-query';

// Singleton pour le queryClient
let queryClient: QueryClient | null = null;

/**
 * Implu00e9mentation du service pour les composants drawer de repas
 */
class MealDrawerService implements MealDrawerServiceInterface {
  /**
   * Du00e9finit le queryClient pour l'invalidation du cache
   * @param client - Instance de QueryClient
   */
  setQueryClient(client: QueryClient): void {
    queryClient = client;
  }

  /**
   * Obtient le nom complet d'un type de repas
   * @param type - Le type de repas u00e0 convertir
   * @returns Le nom du type de repas en franu00e7ais
   */
  getMealTypeName(type: MealTypeEnum): string {
    logger.debug(LogCategory.UI, `Getting meal type name for: ${type}`);
    
    switch (type) {
      case MealTypeEnum.BREAKFAST: return 'Petit-du00e9jeuner';
      case MealTypeEnum.LUNCH: return 'Du00e9jeuner';
      case MealTypeEnum.DINNER: return 'Du00eener';
      case MealTypeEnum.SNACK: return 'Snack';
      default: return 'Repas';
    }
  }
  
  /**
   * Obtient les couleurs associu00e9es u00e0 un type de repas
   * @param type - Le type de repas
   * @returns Les classes de couleur pour l'arriu00e8re-plan et le texte
   */
  getMealTypeColor(type: MealTypeEnum): MealTypeColor {
    logger.debug(LogCategory.UI, `Getting meal type color for: ${type}`);
    
    switch (type) {
      case MealTypeEnum.BREAKFAST: return { bgColor: 'bg-blue-100', textColor: 'text-blue-700' };
      case MealTypeEnum.LUNCH: return { bgColor: 'bg-green-100', textColor: 'text-green-700' };
      case MealTypeEnum.DINNER: return { bgColor: 'bg-purple-100', textColor: 'text-purple-700' };
      case MealTypeEnum.SNACK: return { bgColor: 'bg-orange-100', textColor: 'text-orange-700' };
      default: return { bgColor: 'bg-gray-100', textColor: 'text-gray-700' };
    }
  }
  
  /**
   * Filtre les repas par type
   * @param meals - La liste des repas u00e0 filtrer
   * @param type - Le type de repas u00e0 filtrer (optionnel)
   * @returns La liste des repas filtru00e9s
   */
  filterMealsByType(meals: MealOrmProps[], type?: MealTypeEnum): MealOrmProps[] {
    if (!type) {
      return meals; // Retourner tous les repas si aucun type n'est spu00e9cifiu00e9
    }
    
    logger.debug(LogCategory.APP, `Filtering meals by type: ${type}`);
    return meals.filter(meal => meal.type === type);
  }
  
  /**
   * Filtre les repas par type de cuisine
   * @param meals - La liste des repas u00e0 filtrer
   * @param cuisine - Le type de cuisine u00e0 filtrer (optionnel)
   * @returns La liste des repas filtru00e9s
   */
  filterMealsByCuisine(meals: MealOrmProps[], cuisine?: CuisineTypeEnum): MealOrmProps[] {
    if (!cuisine) {
      return meals; // Retourner tous les repas si aucun type de cuisine n'est spu00e9cifiu00e9
    }
    
    logger.debug(LogCategory.APP, `Filtering meals by cuisine: ${cuisine}`);
    return meals.filter(meal => meal.cuisine === cuisine);
  }
  
  /**
   * Ajoute des repas u00e0 un plan journalier
   * @param dailyPlanId - L'ID du plan journalier
   * @param planId - L'ID du plan parent
   * @param meals - La liste des repas u00e0 ajouter avec leur quantitu00e9
   * @returns Une promesse contenant le ru00e9sultat de l'opu00e9ration
   */
  async addMealsToPlan(
    dailyPlanId: number,
    planId: number,
    meals: MealWithQuantity[]
  ): Promise<{ success: boolean; errors?: string[] }> {
    // Vu00e9rification de l'utilisateur
    const userId = getCurrentUserIdSync();
    if (!userId) {
      logger.error(LogCategory.AUTH, "Cannot add meals to plan: User not authenticated");
      return { success: false, errors: ["Utilisateur non authentifiu00e9"] };
    }
    
    try {
      logger.info(LogCategory.APP, `Adding ${meals.length} meals to daily plan ${dailyPlanId}`);
      
      const errors: string[] = [];
      
      // Ajouter chaque repas su00e9quentiellement pour une meilleure gestion des erreurs
      for (const meal of meals) {
        try {
          // Utiliser la fonction appropriu00e9e du MCP Server pour ajouter un repas au plan
          // La signature de la mu00e9thode prend des paramu00e8tres individuels, pas un objet
          const result = await sqliteMCPServer.addMealToDailyPlanViaMCP(
            dailyPlanId,
            meal.id,
            meal.quantity,
            meal.mealType
          );
          
          if (!result.success) {
            // Vu00e9rifier si l'erreur indique que le repas existe du00e9ju00e0
            if (result.error && result.error.includes('existe du00e9ju00e0')) {
              errors.push(`Le repas ${meal.id} existe du00e9ju00e0 dans ce plan journalier`);
            } else {
              errors.push(result.error || `Erreur lors de l'ajout du repas ${meal.id}`);
            }
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          errors.push(errorMessage);
          logger.error(LogCategory.APP, `Error adding meal ${meal.id} to plan: ${errorMessage}`);
        }
      }
      
      // Invalider le cache pour mettre u00e0 jour les donnu00e9es
      if (queryClient) {
        // Invalider le cache pour le plan journalier
        await invalidateCache(queryClient, DataType.DAILY_PLAN, { 
          id: dailyPlanId.toString() 
        });
        
        // Invalider le cache pour le plan
        await invalidateCache(queryClient, DataType.PLAN, { 
          id: planId.toString() 
        });
      }
      
      return { 
        success: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(LogCategory.APP, `General error adding meals to plan: ${errorMessage}`);
      return { success: false, errors: [errorMessage] };
    }
  }
}

// Exporter une instance unique du service
export const mealDrawerService = new MealDrawerService();
