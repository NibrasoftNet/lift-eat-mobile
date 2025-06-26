import { QueryClient } from '@tanstack/react-query';
import { logger } from '../services/logging.service';
import { LogCategory } from '../enum/logging.enum';

/**
 * Types de données pour lesquels on peut invalider le cache
 */
export enum DataType {
  USER = 'user',
  USER_PREFERENCES = 'user-preferences',
  PLAN = 'plan',
  PLANS_LIST = 'plans-list',
  DAILY_PLAN = 'daily-plan',
  MEAL = 'meal',
  MEALS_LIST = 'meals-list',
  PROGRESS = 'progress',
  PROGRESS_LIST = 'progress-list',
  INGREDIENT = 'ingredient',
  INGREDIENTS_LIST = 'ingredients-list',
}

/**
 * Structure des clés de cache par type de données
 * Chaque type peut avoir plusieurs patterns de clés de cache associés
 */
const CACHE_KEY_PATTERNS: Record<DataType, string[]> = {
  [DataType.USER]: ['user', 'me', 'current-user', 'default-user'],
  [DataType.USER_PREFERENCES]: ['user-preferences', 'preferences'],
  [DataType.PLAN]: ['plan-', 'current-plan'],
  [DataType.PLANS_LIST]: ['plans', 'my-plans', 'plans-list'],
  [DataType.DAILY_PLAN]: ['daily-plan-', 'day-plan-'],
  [DataType.MEAL]: ['meal-', 'meal:'],
  [DataType.MEALS_LIST]: ['meals', 'my-meals', 'meals-list', 'meal:mealsList'],
  [DataType.PROGRESS]: ['progress-', 'daily-progress-'],
  [DataType.PROGRESS_LIST]: ['progress-days', 'progressDays', 'progress-list'],
  [DataType.INGREDIENT]: ['ingredient-', 'ingredient:'],
  [DataType.INGREDIENTS_LIST]: ['ingredients', 'ingredients-list', 'ingredient:list'],
};

/**
 * Options d'invalidation du cache
 */
interface InvalidateOptions {
  /**
   * ID spécifique à invalider (pour les types qui supportent les IDs)
   * Si fourni, seules les clés de cache contenant cet ID seront invalidées
   */
  id?: number | string;
  
  /**
   * Opération exacte à invalider
   * Si fourni, seules les clés de cache correspondant exactement seront invalidées
   */
  exact?: string;
  
  /**
   * Si true, invalide également les données qui dépendent du type spécifié
   * Par exemple, si on invalide un plan, on peut aussi vouloir invalider la liste des plans
   */
  invalidateRelated?: boolean;
}

/**
 * Mappings des types de données liés pour l'invalidation en cascade
 */
const RELATED_TYPES: Partial<Record<DataType, DataType[]>> = {
  [DataType.PLAN]: [DataType.PLANS_LIST, DataType.DAILY_PLAN, DataType.PROGRESS_LIST],
  [DataType.MEAL]: [DataType.MEALS_LIST],
  [DataType.USER]: [DataType.USER_PREFERENCES],
  [DataType.PROGRESS]: [DataType.PROGRESS_LIST],
  [DataType.INGREDIENT]: [DataType.INGREDIENTS_LIST],
};

/**
 * Utilitaire pour invalider le cache React Query de manière standardisée
 * 
 * @param queryClient Client React Query
 * @param type Type de données à invalider
 * @param options Options d'invalidation
 */
export async function invalidateCache(
  queryClient: QueryClient,
  type: DataType,
  options: InvalidateOptions = {}
): Promise<void> {
  const { id, exact, invalidateRelated = false } = options;
  
  logger.info(LogCategory.CACHE, `Invalidating cache for ${type}`, { 
    type, id, exact, invalidateRelated 
  });
  
  try {
    // Cas 1: Invalidation exacte d'une clé spécifique
    if (exact) {
      await queryClient.invalidateQueries({ queryKey: [exact] });
      logger.info(LogCategory.CACHE, `Invalidated exact cache key: ${exact}`);
      return;
    }
    
    // Cas 2: Invalidation par type et ID
    if (id !== undefined) {
      const patterns = CACHE_KEY_PATTERNS[type];
      
      // Pour chaque pattern, invalider les clés qui contiennent l'ID
      for (const pattern of patterns) {
        if (pattern.endsWith('-')) {
          // Pattern avec ID à la fin (ex: 'plan-123')
          await queryClient.invalidateQueries({ 
            queryKey: [`${pattern}${id}`] 
          });
          
          // Invalider aussi les clés où l'ID est un élément distinct du tableau
          // Ex: ['plan', 123]
          await queryClient.invalidateQueries({
            predicate: (query) => {
              return query.queryKey.length > 1 && 
                     query.queryKey[0] === pattern.replace('-', '') && 
                     (query.queryKey[1] === id || query.queryKey[1]?.toString() === id.toString());
            }
          });
        } else {
          // Invalider les queryKeys où l'ID est un élément distinct du tableau 
          // Ex: ['user', 123]
          await queryClient.invalidateQueries({
            predicate: (query) => {
              return query.queryKey.length > 1 && 
                     query.queryKey[0] === pattern && 
                     (query.queryKey[1] === id || query.queryKey[1]?.toString() === id.toString());
            }
          });
        }
      }
      
      logger.info(LogCategory.CACHE, `Invalidated cache for ${type} with ID ${id}`);
    } 
    // Cas 3: Invalidation globale par type
    else {
      const patterns = CACHE_KEY_PATTERNS[type];
      
      // Invalider toutes les clés qui commencent par l'un des patterns
      await queryClient.invalidateQueries({
        predicate: (query) => {
          // Si le premier élément est une chaîne et correspond à l'un des patterns
          if (typeof query.queryKey[0] === 'string') {
            const queryKeyString = query.queryKey[0];
            return patterns.some(pattern => {
              if (pattern.endsWith('-')) {
                return queryKeyString.startsWith(pattern);
              } else {
                return queryKeyString === pattern;
              }
            });
          }
          return false;
        }
      });
      
      logger.info(LogCategory.CACHE, `Invalidated all cache for ${type}`);
    }
    
    // Invalider les types liés si demandé
    if (invalidateRelated && RELATED_TYPES[type]) {
      logger.info(LogCategory.CACHE, `Invalidating related types for ${type}`, {
        relatedTypes: RELATED_TYPES[type]
      });
      
      const relatedTypes = RELATED_TYPES[type] || [];
      for (const relatedType of relatedTypes) {
        // Appel récursif sans l'option invalidateRelated pour éviter les boucles infinies
        await invalidateCache(queryClient, relatedType, { 
          id, 
          invalidateRelated: false 
        });
      }
    }
  } catch (error) {
    logger.error(LogCategory.CACHE, `Error invalidating cache for ${type}`, {
      error: error instanceof Error ? error.message : String(error),
      type,
      id,
      exact
    });
  }
}

/**
 * Utilitaire pour construire une clé de cache standardisée
 * 
 * @param type Type de données
 * @param id ID optionnel
 * @param subKey Sous-clé optionnelle (ex: 'details', 'list', etc.)
 * @returns Clé de cache formatée
 */
export function buildCacheKey(
  type: DataType, 
  id?: number | string,
  subKey?: string
): (string | number)[] {
  // Déterminer le préfixe de la clé en fonction du type
  let prefix: string;
  switch (type) {
    case DataType.USER:
      prefix = 'user';
      break;
    case DataType.PLAN:
      prefix = 'plan';
      break;
    case DataType.MEAL:
      prefix = 'meal';
      break;
    case DataType.PROGRESS:
      prefix = 'progress';
      break;
    case DataType.INGREDIENT:
      prefix = 'ingredient';
      break;
    case DataType.PLANS_LIST:
      return ['plans-list', subKey].filter(Boolean) as string[];
    case DataType.MEALS_LIST:
      return ['meals-list', subKey].filter(Boolean) as string[];
    case DataType.PROGRESS_LIST:
      return ['progress-list', subKey].filter(Boolean) as string[];
    case DataType.INGREDIENTS_LIST:
      return ['ingredients-list', subKey].filter(Boolean) as string[];
    default:
      prefix = type;
  }
  
  // Construire le tableau de clé
  const key: (string | number)[] = [prefix];
  
  // Ajouter l'ID s'il est fourni
  if (id !== undefined) {
    key.push(id);
  }
  
  // Ajouter la sous-clé si elle est fournie
  if (subKey) {
    key.push(subKey);
  }
  
  return key;
}
