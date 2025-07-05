import { DataType } from '@/utils/enum/cache.enum';
import { QueryClient } from '@tanstack/react-query';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

/**
 * Configuration standardisée pour React Query
 * Ce fichier centralise les paramètres de cache pour assurer
 * une utilisation cohérente dans toute l'application
 */

// Définition des paramètres de cache par type de données
interface CacheConfig {
  staleTime: number; // Durée avant qu'une donnée soit considérée comme périmée (en ms)
  gcTime: number; // Durée avant qu'une donnée inutilisée soit supprimée du cache (garbage collection)
  retry: number; // Nombre de tentatives en cas d'échec
}

// Configuration par type de données
export const cacheConfig: Record<DataType, CacheConfig> = {
  [DataType.MEALS_LIST]: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  },
  [DataType.MEAL]: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  },
  [DataType.MEAL_DETAILS]: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  },
  [DataType.PLANS_LIST]: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  },
  [DataType.PLAN_DETAILS]: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  },
  [DataType.INGREDIENTS_LIST]: {
    staleTime: 60 * 60 * 1000, // 1 heure (données rarement modifiées)
    gcTime: 2 * 60 * 60 * 1000, // 2 heures
    retry: 2,
  },
  [DataType.USER_DETAILS]: {
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  },
  [DataType.USER_PREFERENCES]: {
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  },
  [DataType.USER_CONTEXT]: {
    staleTime: 60 * 60 * 1000, // 1 heure
    gcTime: 2 * 60 * 60 * 1000, // 2 heures
    retry: 1,
  },
};

/**
 * Récupère la configuration du cache pour un type de données spécifique
 */
export function getCacheConfig(dataType: DataType): CacheConfig {
  return (
    cacheConfig[dataType] || {
      staleTime: 5 * 60 * 1000, // Valeurs par défaut
      gcTime: 10 * 60 * 1000,
      retry: 2,
    }
  );
}

/**
 * Construction standardisée des clés de requête
 * Assure une cohérence dans la structure des clés utilisées
 */
export function buildQueryKey(dataType: DataType, ...args: any[]): any[] {
  return [dataType, ...args.filter((arg) => arg !== undefined)];
}

/**
 * Fonction centralisée pour invalider le cache
 * Évite les invalidations multiples et fournit une API cohérente
 */
export function invalidateQueries(
  queryClient: QueryClient,
  dataType: DataType,
  options?: {
    exact?: boolean;
    invalidateRelated?: boolean;
    notifyId?: string; // ID unique pour la notification toast
  },
) {
  const { exact = false, invalidateRelated = false, notifyId } = options || {};

  // Logger l'invalidation pour le débogage
  logger.info(
    LogCategory.CACHE,
    `Invalidating React Query cache for ${dataType}`,
    {
      exact,
      invalidateRelated,
      notifyId,
    },
  );

  // Invalider le type de données principal
  queryClient.invalidateQueries({
    queryKey: exact ? [dataType] : [dataType],
    exact,
    refetchType: 'active', // Ne rafraichit que les requêtes actuellement observées
  });

  // Invalider les types de données liées si nécessaire
  if (invalidateRelated) {
    const relatedTypes = getRelatedDataTypes(dataType);

    for (const relatedType of relatedTypes) {
      logger.debug(
        LogCategory.CACHE,
        `Invalidating related cache: ${relatedType}`,
      );
      queryClient.invalidateQueries({
        queryKey: [relatedType],
        exact: false,
        refetchType: 'active',
      });
    }
  }
}

/**
 * Récupère les types de données liés pour l'invalidation en cascade
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
 * Configuration par défaut du QueryClient pour l'application
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes par défaut
        gcTime: 10 * 60 * 1000, // 10 minutes par défaut
        retry: 2,
        refetchOnWindowFocus: false,
      },
    },
  });
}
