import { DataType } from "./queryInvalidation";

/**
 * Configuration de cache pour différents types de données
 * Définit les temps optimaux pour chaque type de données en fonction de leur fréquence de mise à jour
 * et de leur importance pour l'expérience utilisateur
 */
export interface CacheConfig {
  /** Durée pendant laquelle les données sont considérées fraîches (en ms) */
  staleTime: number;
  /** Durée pendant laquelle les données restent en cache après être devenues inactives (en ms) */
  gcTime: number;
  /** Nombre de tentatives en cas d'échec de requête */
  retry: number;
  /** Si true, les données seront récupérées à nouveau au focus de l'application */
  refetchOnWindowFocus: boolean;
  /** Si true, les données seront récupérées à nouveau lorsque l'application revient au premier plan */
  refetchOnReconnect: boolean;
  /** Si true, les requêtes seront relancées lorsqu'un utilisateur revient à l'application après une période d'inactivité */
  refetchOnMount: boolean;
}

/**
 * Durées standards pour différents niveaux de fraîcheur des données
 */
export const CACHE_DURATIONS = {
  BRIEF: 1000 * 60 * 1, // 1 minute
  SHORT: 1000 * 60 * 5, // 5 minutes
  MEDIUM: 1000 * 60 * 15, // 15 minutes
  LONG: 1000 * 60 * 60, // 1 heure
  VERY_LONG: 1000 * 60 * 60 * 6, // 6 heures
  PERSISTENT: 1000 * 60 * 60 * 24, // 24 heures
};

/**
 * Configurations de cache par défaut pour chaque type de données
 */
export const DEFAULT_CACHE_CONFIGS: Record<DataType, CacheConfig> = {
  [DataType.USER]: {
    staleTime: CACHE_DURATIONS.MEDIUM,  // Les données utilisateur changent occasionnellement
    gcTime: CACHE_DURATIONS.VERY_LONG,  // Mais on garde les données en cache longtemps
    retry: 2,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
  },
  [DataType.USER_PREFERENCES]: {
    staleTime: CACHE_DURATIONS.MEDIUM,  // Les préférences utilisateur changent occasionnellement
    gcTime: CACHE_DURATIONS.LONG,       // Cache de durée moyenne
    retry: 2,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
  },
  [DataType.MEAL]: {
    staleTime: CACHE_DURATIONS.MEDIUM,  // Les repas peuvent être modifiés régulièrement
    gcTime: CACHE_DURATIONS.VERY_LONG,  // Garde en cache pour le mode hors ligne
    retry: 2,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
  },
  [DataType.MEALS_LIST]: {
    staleTime: CACHE_DURATIONS.SHORT,   // Les listes de repas sont mises à jour plus fréquemment
    gcTime: CACHE_DURATIONS.LONG,       // Cache de durée moyenne
    retry: 2,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
  },
  [DataType.PLAN]: {
    staleTime: CACHE_DURATIONS.MEDIUM,  // Les plans nutritionnels changent occasionnellement
    gcTime: CACHE_DURATIONS.VERY_LONG,  // Longue durée de cache pour mode hors ligne
    retry: 2,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
  },
  [DataType.PLANS_LIST]: {
    staleTime: CACHE_DURATIONS.SHORT,   // Les listes de plans sont mises à jour plus fréquemment
    gcTime: CACHE_DURATIONS.LONG,       // Cache de durée moyenne
    retry: 2,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
  },
  [DataType.DAILY_PLAN]: {
    staleTime: CACHE_DURATIONS.SHORT,   // Mis à jour plus fréquemment que les plans généraux
    gcTime: CACHE_DURATIONS.LONG,       // Durée de cache moyenne
    retry: 2,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
  },
  [DataType.PROGRESS]: {
    staleTime: CACHE_DURATIONS.BRIEF,   // Les données de progression sont mises à jour fréquemment
    gcTime: CACHE_DURATIONS.MEDIUM,     // Durée de cache courte
    retry: 2,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
  },
  [DataType.PROGRESS_LIST]: {
    staleTime: CACHE_DURATIONS.BRIEF,   // Les listes de progression sont très dynamiques
    gcTime: CACHE_DURATIONS.MEDIUM,     // Durée de cache courte
    retry: 2,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
  },
  [DataType.INGREDIENT]: {
    staleTime: CACHE_DURATIONS.LONG,    // Les ingrédients changent rarement
    gcTime: CACHE_DURATIONS.PERSISTENT, // Très longue durée de cache
    retry: 2,
    refetchOnWindowFocus: false,        // Pas besoin de rafraîchir au focus
    refetchOnReconnect: true,
    refetchOnMount: false,              // Pas besoin de rafraîchir au montage
  },
  [DataType.INGREDIENTS_LIST]: {
    staleTime: CACHE_DURATIONS.LONG,    // Les listes d'ingrédients changent rarement
    gcTime: CACHE_DURATIONS.PERSISTENT, // Très longue durée de cache
    retry: 2,
    refetchOnWindowFocus: false,        // Pas besoin de rafraîchir au focus
    refetchOnReconnect: true,
    refetchOnMount: false,              // Pas besoin de rafraîchir au montage
  },
};

/**
 * Récupère la configuration de cache pour un type de données spécifique
 * Utilisez cette fonction dans les hooks useQuery pour optimiser le cache
 * @param type Type de données pour lequel récupérer la configuration
 * @param overrides Surcharges optionnelles pour la configuration par défaut
 */
export function getCacheConfig(type: DataType, overrides?: Partial<CacheConfig>): CacheConfig {
  const defaultConfig = DEFAULT_CACHE_CONFIGS[type];
  return {
    ...defaultConfig,
    ...overrides,
  };
}

/**
 * Exemple d'utilisation:
 * 
 * ```typescript
 * const { data: user } = useQuery({
 *   queryKey: [DataType.USER, userId],
 *   queryFn: () => fetchUser(userId),
 *   ...getCacheConfig(DataType.USER)
 * });
 * ```
 */
