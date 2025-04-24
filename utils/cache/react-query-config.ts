import { DataType } from '@/utils/enum/cache.enum';
import { QueryClient } from '@tanstack/react-query';
import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

/**
 * Configuration standardisu00e9e pour React Query
 * Ce fichier centralise les paramu00e8tres de cache pour assurer
 * une utilisation cohu00e9rente dans toute l'application
 */

// Du00e9finition des paramu00e8tres de cache par type de donnu00e9es
interface CacheConfig {
  staleTime: number;  // Du00e9lai avant qu'une donnu00e9e soit considu00e9ru00e9e pu00e9rimu00e9e (en ms)
  gcTime: number;     // Du00e9lai avant qu'une donnu00e9e inutilisu00e9e soit supprimiu00e9e du cache (garbage collection)
  retry: number;      // Nombre de tentatives en cas d'u00e9chec
}

// Configuration par type de donnu00e9es
export const cacheConfig: Record<DataType, CacheConfig> = {
  [DataType.MEALS_LIST]: {
    staleTime: 5 * 60 * 1000,  // 5 minutes
    gcTime: 10 * 60 * 1000,    // 10 minutes
    retry: 2
  },
  [DataType.MEAL]: {
    staleTime: 5 * 60 * 1000,  // 5 minutes
    gcTime: 10 * 60 * 1000,    // 10 minutes
    retry: 2
  },
  [DataType.MEAL_DETAILS]: {
    staleTime: 5 * 60 * 1000,  // 5 minutes
    gcTime: 10 * 60 * 1000,    // 10 minutes
    retry: 2
  },
  [DataType.PLANS_LIST]: {
    staleTime: 5 * 60 * 1000,  // 5 minutes
    gcTime: 10 * 60 * 1000,    // 10 minutes
    retry: 2
  },
  [DataType.PLAN_DETAILS]: {
    staleTime: 5 * 60 * 1000,  // 5 minutes
    gcTime: 10 * 60 * 1000,    // 10 minutes
    retry: 2
  },
  [DataType.INGREDIENTS_LIST]: {
    staleTime: 60 * 60 * 1000, // 1 heure (donnu00e9es rarement modifiu00e9es)
    gcTime: 2 * 60 * 60 * 1000, // 2 heures
    retry: 2
  },
  [DataType.USER_DETAILS]: {
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000,   // 30 minutes
    retry: 2
  },
  [DataType.USER_PREFERENCES]: {
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000,   // 30 minutes
    retry: 2
  },
  [DataType.USER_CONTEXT]: {
    staleTime: 60 * 60 * 1000, // 1 heure
    gcTime: 2 * 60 * 60 * 1000, // 2 heures
    retry: 1
  }
};

/**
 * Ru00e9cupu00e8re la configuration du cache pour un type de donnu00e9es spu00e9cifique
 */
export function getCacheConfig(dataType: DataType): CacheConfig {
  return cacheConfig[dataType] || {
    staleTime: 5 * 60 * 1000, // Valeurs par du00e9faut
    gcTime: 10 * 60 * 1000,
    retry: 2
  };
}

/**
 * Construction standardisu00e9e des clu00e9s de requu00eate
 * Assure une cohu00e9rence dans la structure des clu00e9s utilisu00e9es
 */
export function buildQueryKey(dataType: DataType, ...args: any[]): any[] {
  return [dataType, ...args.filter(arg => arg !== undefined)];
}

/**
 * Fonction centralisu00e9e pour invalider le cache
 * u00c9vite les invalidations multiples et fournit une API cohu00e9rente
 */
export function invalidateQueries(queryClient: QueryClient, dataType: DataType, options?: {
  exact?: boolean;
  invalidateRelated?: boolean;
  notifyId?: string; // ID unique pour la notification toast
}) {
  const { exact = false, invalidateRelated = false, notifyId } = options || {};
  
  // Logger l'invalidation pour le du00e9bogage
  logger.info(LogCategory.CACHE, `Invalidating React Query cache for ${dataType}`, { 
    exact, 
    invalidateRelated,
    notifyId 
  });
  
  // Invalider le type de donnu00e9es principal
  queryClient.invalidateQueries({ 
    queryKey: exact ? [dataType] : [dataType],
    exact,
    refetchType: 'active' // Ne rafrau00eechit que les requu00eates actuellement observu00e9es
  });
  
  // Invalider les types de donnu00e9es liu00e9s si nu00e9cessaire
  if (invalidateRelated) {
    const relatedTypes = getRelatedDataTypes(dataType);
    
    for (const relatedType of relatedTypes) {
      logger.debug(LogCategory.CACHE, `Invalidating related cache: ${relatedType}`);
      queryClient.invalidateQueries({ 
        queryKey: [relatedType],
        exact: false,
        refetchType: 'active'
      });
    }
  }
}

/**
 * Ru00e9cupu00e8re les types de donnu00e9es liu00e9s pour l'invalidation en cascade
 */
function getRelatedDataTypes(dataType: DataType): DataType[] {
  switch (dataType) {
    case DataType.MEALS_LIST:
      return [DataType.MEAL_DETAILS, DataType.PLANS_LIST];
    case DataType.MEAL_DETAILS:
      return [DataType.MEALS_LIST];
    case DataType.PLANS_LIST:
      return [DataType.PLAN_DETAILS];
    case DataType.PLAN_DETAILS:
      return [DataType.PLANS_LIST, DataType.MEALS_LIST];
    case DataType.USER_DETAILS:
      return [DataType.USER_PREFERENCES, DataType.USER_CONTEXT];
    default:
      return [];
  }
}

/**
 * Configuration par du00e9faut du QueryClient pour l'application
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes par du00e9faut
        gcTime: 10 * 60 * 1000,   // 10 minutes par du00e9faut
        retry: 2,
        refetchOnWindowFocus: false,
      },
    },
  });
}
