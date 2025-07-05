import {
  UseQueryOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { OperationResult } from '@/utils/interfaces/pages.interface';
import { getCacheConfig } from '@/utils/helpers/cacheConfig';
import { DataType } from '@/utils/helpers/queryInvalidation';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

/**
 * Hook personnalisé pour standardiser les requêtes avec les services de l'application
 * Implémente une interface cohérente pour toutes les requêtes aux services MCP
 *
 * @param dataType - Type de données pour le cache et l'invalidation
 * @param queryKey - Clé de la requête pour React Query
 * @param serviceFunction - Fonction du service à appeler (doit retourner une OperationResult)
 * @param options - Options supplémentaires pour useQuery
 * @returns Résultat de la requête avec les types appropriés
 */
export function useServiceQuery<TData, TError = Error>(
  dataType: DataType,
  queryKey: readonly unknown[],
  serviceFunction: () => Promise<OperationResult<TData>>,
  options?: Omit<
    UseQueryOptions<TData, TError, TData, readonly unknown[]>,
    'queryKey' | 'queryFn'
  >,
): UseQueryResult<TData, TError> {
  // Préparer les options de cache avec le type de données
  const cacheOptions = getCacheConfig(dataType);

  return useQuery<TData, TError>({
    queryKey,
    queryFn: async () => {
      try {
        // Journaliser le début de la requête
        logger.info(
          LogCategory.QUERY,
          `Démarrage de la requête pour ${dataType}`,
          {
            queryKey: queryKey.join(','),
          },
        );

        // Appeler la fonction de service
        const result = await serviceFunction();

        // Vérifier le succès de l'opération
        if (!result.success || !result.data) {
          logger.error(
            LogCategory.QUERY,
            `Échec de la requête pour ${dataType}`,
            {
              queryKey: queryKey.join(','),
              error: result.error,
            },
          );

          throw new Error(
            result.error || `Échec de la requête pour ${dataType}`,
          );
        }

        // Journaliser le succès de la requête
        logger.info(
          LogCategory.QUERY,
          `Succès de la requête pour ${dataType}`,
          {
            queryKey: queryKey.join(','),
          },
        );

        // Retourner les données
        return result.data;
      } catch (error) {
        // Journaliser l'erreur
        logger.error(
          LogCategory.QUERY,
          `Erreur lors de la requête pour ${dataType}`,
          {
            queryKey: queryKey.join(','),
            error: error instanceof Error ? error.message : String(error),
          },
        );

        // Relancer l'erreur pour le gestionnaire de React Query
        throw error;
      }
    },
    ...cacheOptions,
    ...options,
  });
}

/**
 * Hook spécialisé pour les requêtes liées aux plans
 */
export function usePlanQuery<TData>(
  queryKey: readonly unknown[],
  serviceFunction: () => Promise<OperationResult<TData>>,
  options?: Omit<
    UseQueryOptions<TData, Error, TData, readonly unknown[]>,
    'queryKey' | 'queryFn'
  >,
) {
  return useServiceQuery<TData>(
    DataType.PLAN,
    queryKey,
    serviceFunction,
    options,
  );
}

/**
 * Hook spécialisé pour les requêtes liées aux repas
 */
export function useMealQuery<TData>(
  queryKey: readonly unknown[],
  serviceFunction: () => Promise<OperationResult<TData>>,
  options?: Omit<
    UseQueryOptions<TData, Error, TData, readonly unknown[]>,
    'queryKey' | 'queryFn'
  >,
) {
  return useServiceQuery<TData>(
    DataType.MEAL,
    queryKey,
    serviceFunction,
    options,
  );
}

/**
 * Hook spécialisé pour les requêtes liées aux utilisateurs
 */
export function useUserQuery<TData>(
  queryKey: readonly unknown[],
  serviceFunction: () => Promise<OperationResult<TData>>,
  options?: Omit<
    UseQueryOptions<TData, Error, TData, readonly unknown[]>,
    'queryKey' | 'queryFn'
  >,
) {
  return useServiceQuery<TData>(
    DataType.USER,
    queryKey,
    serviceFunction,
    options,
  );
}

/**
 * Hook spécialisé pour les requêtes liées aux progressions
 */
export function useProgressQuery<TData>(
  queryKey: readonly unknown[],
  serviceFunction: () => Promise<OperationResult<TData>>,
  options?: Omit<
    UseQueryOptions<TData, Error, TData, readonly unknown[]>,
    'queryKey' | 'queryFn'
  >,
) {
  return useServiceQuery<TData>(
    DataType.PROGRESS,
    queryKey,
    serviceFunction,
    options,
  );
}
