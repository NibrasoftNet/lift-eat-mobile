import { CacheDuration, CacheGroup } from './mcp-cache';

// Définir un type pour chaque groupe de configuration avec index signature
type CacheGroupConfig = {
  [subType: string]: CacheDuration;
};

// Type global pour la configuration du cache
type CacheConfigType = {
  [key in CacheGroup]: CacheGroupConfig;
};

/**
 * Configuration des durées de cache pour chaque type de données
 */
export const CACHE_CONFIG: CacheConfigType = {
  // Configuration des donnu00e9es utilisateur
  [CacheGroup.USER]: {
    preferences: CacheDuration.MEDIUM,     // Pru00e9fu00e9rences utilisateur: 15 minutes
    details: CacheDuration.MEDIUM,        // Du00e9tails utilisateur: 15 minutes
    context: CacheDuration.IA_CONTEXT,    // Contexte utilisateur pour l'IA: 1 heure
  },
  
  // Configuration des donnu00e9es de repas
  [CacheGroup.MEAL]: {
    list: CacheDuration.MEDIUM,           // Liste de repas: 15 minutes
    details: CacheDuration.MEDIUM,        // Du00e9tails d'un repas: 15 minutes
    favorites: CacheDuration.MEDIUM,      // Repas favoris: 15 minutes
  },
  
  // Configuration des donnu00e9es de plan nutritionnel
  [CacheGroup.PLAN]: {
    list: CacheDuration.MEDIUM,           // Liste de plans: 15 minutes
    details: CacheDuration.MEDIUM,        // Du00e9tails d'un plan: 15 minutes
    current: CacheDuration.MEDIUM,        // Plan actuel: 15 minutes
  },
  
  // Configuration des donnu00e9es d'ingru00e9dients
  [CacheGroup.INGREDIENT]: {
    list: CacheDuration.LONG,             // Liste d'ingru00e9dients: 24 heures (rarement modifiu00e9e)
    details: CacheDuration.LONG,          // Du00e9tails d'un ingru00e9dient: 24 heures
  },
  
  // Configuration des donnu00e9es de progression
  [CacheGroup.PROGRESS]: {
    daily: CacheDuration.SHORT,           // Progression quotidienne: 5 minutes (fru00e9quemment mise u00e0 jour)
    history: CacheDuration.MEDIUM,        // Historique de progression: 15 minutes
  },
  
  // Configuration des donnu00e9es de contexte IA
  [CacheGroup.IA_CONTEXT]: {
    userContext: CacheDuration.IA_CONTEXT, // Contexte utilisateur pour l'IA: 1 heure
  }
};

/**
 * Construit une clu00e9 de cache consistante pour une donnu00e9e spu00e9cifique
 * @param group Groupe de cache
 * @param subType Type de donnu00e9e dans le groupe
 * @param id Identifiant de la donnu00e9e
 * @param userId ID utilisateur optionnel
 * @returns Clu00e9 de cache normalistu00e9e
 */
export function buildCacheKey(group: CacheGroup, subType: string, id?: number | string, userId?: number): string {
  let key = `${group}:${subType}`;
  
  if (id !== undefined) {
    key += `:${id}`;
  }
  
  if (userId !== undefined) {
    key += `:user_${userId}`;
  }
  
  return key;
}

/**
 * Ru00e9cupu00e8re la duru00e9e de cache appropriu00e9e pour un type de donnu00e9e
 * @param group Groupe de cache
 * @param subType Type de donnu00e9e dans le groupe
 * @returns Duru00e9e de cache en millisecondes
 */
export function getCacheDuration(group: CacheGroup, subType: string): number {
  // Si la configuration existe, utiliser la duru00e9e spu00e9cifiu00e9e
  if (CACHE_CONFIG[group] && CACHE_CONFIG[group][subType]) {
    return CACHE_CONFIG[group][subType];
  }
  
  // Duru00e9e par du00e9faut selon le groupe
  switch (group) {
    case CacheGroup.INGREDIENT:
      return CacheDuration.LONG;
    case CacheGroup.IA_CONTEXT:
      return CacheDuration.IA_CONTEXT;
    case CacheGroup.PROGRESS:
      return CacheDuration.SHORT;
    default:
      return CacheDuration.MEDIUM;
  }
}
