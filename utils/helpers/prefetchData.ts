import { QueryClient } from '@tanstack/react-query';
import { DataType } from './queryInvalidation';
import { getCacheConfig } from './cacheConfig';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { getCurrentUserId } from './userContext';

/**
 * Interface pour les options de préchargement
 */
interface PrefetchOptions {
  /** Si true, les erreurs ne feront pas échouer tout le préchargement */
  silentErrors?: boolean;
  /** Fonction de callback pour suivre la progression */
  onProgress?: (progress: number, total: number) => void;
  /** Si true, affiche des informations détaillées sur le préchargement dans les logs */
  verbose?: boolean;
}

/**
 * Précharge les données essentielles pour l'application
 * Utilisé principalement au démarrage de l'application pour préparer les données
 * importantes avant que l'utilisateur n'en ait besoin
 *
 * @param queryClient Client React Query
 * @param options Options de préchargement
 */
export async function prefetchEssentialData(
  queryClient: QueryClient,
  options: PrefetchOptions = {},
): Promise<boolean> {
  const { silentErrors = true, onProgress, verbose = false } = options;

  // Définir quelles données précharger en priorité
  const prefetchTasks = [
    {
      name: 'Utilisateur courant',
      task: prefetchCurrentUser,
      priority: 'high',
    },
    {
      name: 'Plan actuel',
      task: prefetchCurrentPlan,
      priority: 'high',
    },
    {
      name: 'Repas récents',
      task: prefetchRecentMeals,
      priority: 'medium',
    },
    {
      name: 'Ingrédients standards',
      task: prefetchStandardIngredients,
      priority: 'low',
    },
  ];

  const totalTasks = prefetchTasks.length;
  let completedTasks = 0;
  let allSuccessful = true;

  logger.info(
    LogCategory.CACHE,
    `Démarrage du préchargement des données (${totalTasks} tâches)`,
    {
      totalTasks,
      silentErrors,
      verbose,
    },
  );

  // Exécuter les tâches prioritaires en premier
  for (const { name, task, priority } of prefetchTasks) {
    try {
      if (verbose) {
        logger.info(
          LogCategory.CACHE,
          `Préchargement de: ${name} (priorité: ${priority})`,
        );
      }

      const startTime = Date.now();

      // N'exécuter la tâche que s'il y a un utilisateur en session
      const { hasUserInSession } = await Promise.resolve(
        require('./userContext'),
      );
      const hasUser = hasUserInSession();
      if (!hasUser) {
        if (verbose) {
          logger.debug(
            LogCategory.CACHE,
            `Tâche ignorée (pas d'utilisateur): ${name}`,
          );
        }
        completedTasks++;
        onProgress?.(completedTasks, totalTasks);
        continue;
      }

      await task(queryClient);

      const duration = Date.now() - startTime;

      completedTasks++;

      if (verbose) {
        logger.info(LogCategory.CACHE, `Préchargement terminé: ${name}`, {
          durationMs: duration,
        });
      }

      if (onProgress) {
        onProgress(completedTasks, totalTasks);
      }
    } catch (error) {
      logger.error(LogCategory.CACHE, `Erreur lors du préchargement: ${name}`, {
        error,
      });

      if (!silentErrors) {
        allSuccessful = false;
        break;
      }

      completedTasks++;
      if (onProgress) {
        onProgress(completedTasks, totalTasks);
      }
    }
  }

  logger.info(
    LogCategory.CACHE,
    `Préchargement terminé: ${completedTasks}/${totalTasks} tâches complétées`,
    {
      success: allSuccessful,
    },
  );

  return allSuccessful;
}

/**
 * Précharge les données de l'utilisateur courant
 */
async function prefetchCurrentUser(queryClient: QueryClient): Promise<void> {
  const userId = await getCurrentUserId();

  if (!userId) {
    logger.warn(
      LogCategory.CACHE,
      "Impossible de précharger l'utilisateur: Aucun ID trouvé",
    );
    return;
  }

  // Précharger les données utilisateur
  await queryClient.prefetchQuery({
    queryKey: [DataType.USER, userId],
    queryFn: async () => {
      const result = await sqliteMCPServer.getDefaultUserViaMCP(userId);
      if (!result.success) {
        throw new Error(
          result.error || "Échec de la récupération de l'utilisateur",
        );
      }
      return result.user;
    },
    ...getCacheConfig(DataType.USER),
  });
}

/**
 * Précharge le plan nutritionnel actuel
 */
async function prefetchCurrentPlan(queryClient: QueryClient): Promise<void> {
  const userId = await getCurrentUserId();

  if (!userId) {
    logger.warn(
      LogCategory.CACHE,
      'Impossible de précharger le plan actuel: Aucun utilisateur trouvé',
    );
    return;
  }

  // Précharger le plan actuel
  await queryClient.prefetchQuery({
    queryKey: [DataType.PLAN, 'current', userId],
    queryFn: async () => {
      const result = await sqliteMCPServer.getCurrentPlanViaMCP(userId);
      if (!result.success) {
        throw new Error(
          result.error || 'Échec de la récupération du plan actuel',
        );
      }
      return result.plan;
    },
    ...getCacheConfig(DataType.PLAN),
  });
}

/**
 * Précharge les repas récemment utilisés
 */
async function prefetchRecentMeals(queryClient: QueryClient): Promise<void> {
  const userId = await getCurrentUserId();

  if (!userId) {
    logger.warn(
      LogCategory.CACHE,
      'Impossible de précharger les repas récents: Aucun utilisateur trouvé',
    );
    return;
  }

  // Précharger les repas récents
  await queryClient.prefetchQuery({
    queryKey: [DataType.MEALS_LIST, 'recent', userId],
    queryFn: async () => {
      const result = await sqliteMCPServer.getMealsListViaMCP({ userId });
      if (!result.success) {
        throw new Error(
          result.error || 'Échec de la récupération des repas récents',
        );
      }
      return result.meals;
    },
    ...getCacheConfig(DataType.MEALS_LIST),
  });
}

/**
 * Précharge les ingrédients standards
 */
async function prefetchStandardIngredients(
  queryClient: QueryClient,
): Promise<void> {
  // Précharger les ingrédients standards
  await queryClient.prefetchQuery({
    queryKey: [DataType.INGREDIENTS_LIST, 'standard'],
    queryFn: async () => {
      const result = await sqliteMCPServer.getIngredientsListViaMCP();
      if (!result.success) {
        throw new Error(
          result.error || 'Échec de la récupération des ingrédients standards',
        );
      }
      return result.ingredients;
    },
    ...getCacheConfig(DataType.INGREDIENTS_LIST),
  });
}
