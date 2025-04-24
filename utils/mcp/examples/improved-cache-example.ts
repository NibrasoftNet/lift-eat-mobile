import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { QueryClient } from '@tanstack/react-query';
import { buildQueryKey, invalidateQueries } from '@/utils/cache/react-query-config';
import { DataType } from '@/utils/enum/cache.enum';

/**
 * Exemple d'utilisation de React Query pour la gestion du cache
 * 
 * Cette fonction montre comment utiliser React Query pour la mise en cache des données
 */
async function improvedGetMealsListViaMCP(userId?: number, cuisine?: string, mealType?: string, mealName?: string) {
  try {
    // 1. Construction d'une clé de requête standardisée
    const queryKey = buildQueryKey(
      DataType.MEALS_LIST,  // Type de donnée
      userId,               // ID utilisateur (optionnel)
      { cuisine, mealType, mealName } // Filtres
    );
    
    logger.info(LogCategory.DATABASE, `Fetching meals list from database with filters`);
    
    // Simulation de la requête à la base de données (à remplacer par le code réel)
    // const result = await handleGetMealsList(this.db, { userId, cuisine, mealType, mealName });
    const result = { success: true, meals: [/* données de la requête */] };
    
    // React Query s'occupe de la mise en cache avec les bons paramètres
    // Voir cacheConfig dans react-query-config.ts
    logger.debug(LogCategory.CACHE, `React Query will handle caching automatically`);
    
    return result;
  } catch (error) {
    logger.error(LogCategory.DATABASE, `Error fetching meals list: ${error}`);
    return {
      success: false,
      error: `Failed to fetch meals list: ${error}`
    };
  }
}

/**
 * Exemple de méthode pour invalider le cache React Query lors de la modification d'un repas
 */
async function improvedUpdateMealViaMCP(queryClient: QueryClient, mealId: number, data: any, userId: number) {
  try {
    // Effectuer la mise à jour en base de données
    // const result = await handleUpdateMeal(this.db, { mealId, ...data });
    const result = { success: true };
    
    // Si la mise à jour a réussi, invalider le cache React Query
    if (result.success) {
      // 1. Invalider le cache du repas spécifique et des données liées
      invalidateQueries(queryClient, DataType.MEAL, {
        invalidateRelated: true,
        notifyId: `update-meal-${mealId}`
      });
      
      logger.info(LogCategory.CACHE, `React Query cache updated after meal modification: ${mealId}`);
    }
    
    return result;
  } catch (error) {
    logger.error(LogCategory.DATABASE, `Error updating meal: ${error}`);
    return {
      success: false,
      error: `Failed to update meal: ${error}`
    };
  }
}

/**
 * Comment utiliser les statistiques de React Query pour le monitoring
 */
function displayReactQueryStats(queryClient: QueryClient) {
  const queryCache = queryClient.getQueryCache();
  const queries = queryCache.getAll();
  
  // Statistiques de base sur les requêtes en cache
  const stats = {
    totalQueries: queries.length,
    activeQueries: queries.filter(q => q.isActive()).length,
    staleQueries: queries.filter(q => q.isStale()).length,
    fetchingQueries: queries.filter(q => q.state.fetchStatus === 'fetching').length
  };
  
  logger.info(LogCategory.CACHE, 'React Query Cache Statistics', stats);
  
  // Afficher des informations détaillées sur les requêtes en cache
  queries.forEach(query => {
    logger.debug(LogCategory.CACHE, `Query: ${JSON.stringify(query.queryKey)}`, {
      state: query.state.status,
      lastUpdated: new Date(query.state.dataUpdatedAt).toISOString(),
      stale: query.isStale()
    });
  });
}

// Exemple d'utilisation dans un endpoint de monitoring
async function handleMonitoringRequest(queryClient: QueryClient) {
  displayReactQueryStats(queryClient);
  
  return {
    success: true,
    message: 'React Query statistics logged'
  };
}
