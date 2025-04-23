import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

/**
 * Du00e9finit les diffu00e9rentes duru00e9es de cache selon le type de donnu00e9es
 */
export enum CacheDuration {
  // Courte duru00e9e pour les donnu00e9es fru00e9quemment modifiu00e9es
  SHORT = 5 * 60 * 1000, // 5 minutes
  
  // Duru00e9e moyenne pour les donnu00e9es utilisateur
  MEDIUM = 15 * 60 * 1000, // 15 minutes
  
  // Duru00e9e intermu00e9diaire pour le contexte IA
  IA_CONTEXT = 60 * 60 * 1000, // 1 heure
  
  // Longue duru00e9e pour les donnu00e9es de ru00e9fu00e9rence rarement modifiu00e9es
  LONG = 24 * 60 * 60 * 1000 // 24 heures
}

/**
 * Du00e9finit les groupes de cache pour une invalidation plus granulaire
 */
export enum CacheGroup {
  MEAL = 'meal',
  PLAN = 'plan',
  INGREDIENT = 'ingredient',
  USER = 'user',
  PROGRESS = 'progress',
  IA_CONTEXT = 'ia_context'
}

/**
 * Repru00e9sente une entru00e9e dans le cache avec ses mu00e9tadonnu00e9es
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresIn: number; // duru00e9e de validitu00e9 en millisecondes
  group: CacheGroup; // groupe de cache pour l'invalidation
}

/**
 * Repru00e9sente les statistiques de performance du cache
 */
/**
 * Représente les statistiques de performance du cache
 */
interface CacheStats {
  hits: number;
  misses: number;
  invalidations: number;
  totalEntries: number;
  
  // Temps d'accès moyens (en ms)
  averageAccessTimeWithCache: number;   // Temps moyen quand on trouve dans le cache (hit)
  averageAccessTimeWithoutCache: number; // Temps moyen quand on doit récupérer les données (miss)
  
  // Cumuls pour calculer les moyennes
  accessTimeWithCacheSum: number;
  accessTimeWithoutCacheSum: number;
  
  // Taille du cache en octets (estimation)
  totalSizeBytes: number;
}

/**
 * Systu00e8me de cache amu00e9lioru00e9 pour le MCP Server
 * Offre des stratu00e9gies d'invalidation avancu00e9es et des mu00e9triques de performance
 */
export class MCPCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    invalidations: 0,
    totalEntries: 0,
    averageAccessTimeWithCache: 0,
    averageAccessTimeWithoutCache: 0,
    accessTimeWithCacheSum: 0,
    accessTimeWithoutCacheSum: 0,
    totalSizeBytes: 0
  };
  
  /**
   * Récupère une entrée du cache
   * @param key Clé du cache
   * @returns Données mises en cache ou undefined si pas présentes ou expirées
   */
  get<T>(key: string): T | undefined {
    const startTime = performance.now();
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      return undefined;
    }
    
    // Vérifier si l'entrée a expiré
    const now = Date.now();
    if (now - entry.timestamp > entry.expiresIn) {
      this.cache.delete(key); // Supprimer l'entrée expirée
      this.stats.misses++;
      this.stats.totalEntries--;
      logger.debug(LogCategory.CACHE, `Cache miss (expired): ${key}`);
      return undefined;
    }
    
    // Mesurer le temps d'accès avec cache
    const accessTime = performance.now() - startTime;
    this.stats.accessTimeWithCacheSum += accessTime;
    this.stats.averageAccessTimeWithCache = this.stats.accessTimeWithCacheSum / this.stats.hits;
    
    this.stats.hits++;
    logger.debug(LogCategory.CACHE, `Cache hit: ${key} (${accessTime.toFixed(2)}ms)`);
    return entry.data;
  }
  
  /**
   * Enregistre le temps d'accès sans cache pour une clé spécifique
   * Cette méthode doit être appelée après une récupération de données (après un cache miss)
   * @param accessTimeMs Temps d'accès en millisecondes
   */
  recordAccessTimeWithoutCache(accessTimeMs: number): void {
    this.stats.accessTimeWithoutCacheSum += accessTimeMs;
    this.stats.averageAccessTimeWithoutCache = 
      this.stats.accessTimeWithoutCacheSum / this.stats.misses;
  }

  /**
   * Estime approximativement la taille en octets d'un objet en mémoire
   * Cette méthode est une estimation simplifiée qui peut varier selon l'implémentation de la VM
   * @param object Objet à mesurer
   * @returns Taille estimée en octets
   */
  private estimateObjectSize(object: any): number {
    const objectStr = JSON.stringify(object);
    // Estimation très approximative : 2 octets par caractère (Unicode)
    return objectStr.length * 2;
  }

  /**
   * Ajoute ou met à jour une entrée dans le cache
   * @param key Clé du cache
   * @param data Données à mettre en cache
   * @param group Groupe de cache pour l'invalidation ciblée
   * @param expiresIn Durée de validité en millisecondes
   */
  set<T>(key: string, data: T, group: CacheGroup, expiresIn: number = CacheDuration.MEDIUM): void {
    const newEntry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresIn,
      group
    };
    
    // Si c'est une nouvelle entrée, incrémenter le compteur
    if (!this.cache.has(key)) {
      this.stats.totalEntries++;

      // Estimer et ajouter la taille de l'objet au total
      const estimatedSize = this.estimateObjectSize(data);
      this.stats.totalSizeBytes += estimatedSize;

      logger.debug(LogCategory.CACHE, 
        `Cache set: ${key} (group: ${group}, expires in: ${expiresIn / 1000}s, size: ${(estimatedSize/1024).toFixed(2)}KB)`);
    } else {
      // Pour les mises à jour, ajuster la taille totale en soustrayant l'ancienne taille et en ajoutant la nouvelle
      const oldEntry = this.cache.get(key);
      if (oldEntry) {
        const oldSize = this.estimateObjectSize(oldEntry.data);
        const newSize = this.estimateObjectSize(data);
        this.stats.totalSizeBytes = this.stats.totalSizeBytes - oldSize + newSize;
      }

      logger.debug(LogCategory.CACHE, `Cache updated: ${key}`);
    }
    
    this.cache.set(key, newEntry);
  }
  
  /**
   * Vérifie si une clé existe dans le cache et n'a pas expiré
   * @param key Clé à vérifier
   * @returns Vrai si la clé existe et n'a pas expiré
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }
    
    // Vérifier si l'entrée a expiré
    const now = Date.now();
    if (now - entry.timestamp > entry.expiresIn) {
      this.cache.delete(key); // Supprimer l'entrée expirée
      this.stats.totalEntries--;
      return false;
    }
    
    return true;
  }
  
  /**
   * Supprime une entrée du cache
   * @param key Clé à supprimer
   */
  delete(key: string): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
      this.stats.totalEntries--;
      this.stats.invalidations++;
    }
  }
  
  /**
   * Vide le cache complet
   */
  clear(): void {
    const previousSize = this.stats.totalEntries;
    this.cache.clear();
    this.stats.invalidations += previousSize;
    this.stats.totalEntries = 0;
    logger.info(LogCategory.CACHE, `Cache cleared: ${previousSize} entries removed`);
  }
  
  /**
   * Invalide toutes les entrées qui contiennent un certain préfixe de clé
   * @param keyPrefix Préfixe de clé pour l'invalidation
   */
  invalidateByPrefix(keyPrefix: string): void {
    let count = 0;
    
    for (const key of this.cache.keys()) {
      if (key.startsWith(keyPrefix)) {
        this.cache.delete(key);
        count++;
      }
    }
    
    if (count > 0) {
      this.stats.invalidations += count;
      this.stats.totalEntries -= count;
      logger.info(LogCategory.CACHE, `Cache invalidation by prefix: ${keyPrefix} - ${count} entries removed`);
    }
  }
  
  /**
   * Invalide toutes les entrées appartenant à un groupe spécifique
   * @param group Groupe de cache à invalider
   */
  invalidateByGroup(group: CacheGroup): void {
    let count = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.group === group) {
        this.cache.delete(key);
        count++;
      }
    }
    
    if (count > 0) {
      this.stats.invalidations += count;
      this.stats.totalEntries -= count;
      logger.info(LogCategory.CACHE, `Cache invalidation by group: ${group} - ${count} entries removed`);
    }
  }
  
  /**
   * Invalide les entrées du cache liées à une entité spécifique dans un groupe
   * @param group Groupe de cache
   * @param entityId ID de l'entité à invalider
   */
  invalidateEntity(group: CacheGroup, entityId: number): void {
    let count = 0;
    const entityPattern = new RegExp(`[:_]${entityId}[:_]`);
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.group === group && (key.includes(`:${entityId}:`) || key.includes(`_${entityId}_`))) {
        this.cache.delete(key);
        count++;
      }
    }
    
    if (count > 0) {
      this.stats.invalidations += count;
      this.stats.totalEntries -= count;
      logger.info(LogCategory.CACHE, `Cache invalidation for entity: ${group}/${entityId} - ${count} entries removed`);
    }
  }
  
  /**
   * Définit les relations entre différents groupes d'entités
   * Ces relations sont utilisées pour l'invalidation en cascade
   */
  private readonly entityRelations: Record<CacheGroup, CacheGroup[]> = {
    [CacheGroup.MEAL]: [CacheGroup.PLAN], // Les repas affectent les plans
    [CacheGroup.INGREDIENT]: [CacheGroup.MEAL], // Les ingrédients affectent les repas
    [CacheGroup.PLAN]: [CacheGroup.PROGRESS], // Les plans affectent le suivi des progrès
    [CacheGroup.USER]: [CacheGroup.PLAN, CacheGroup.PROGRESS, CacheGroup.IA_CONTEXT], // Les utilisateurs affectent beaucoup d'entités
    [CacheGroup.PROGRESS]: [], // Le suivi n'affecte pas d'autres entités
    [CacheGroup.IA_CONTEXT]: [] // Le contexte IA n'affecte pas d'autres entités
  };
  
  /**
   * Invalide une entité spécifique et toutes les entités qui en dépendent (invalidation en cascade)
   * @param group Groupe de l'entité à invalider
   * @param entityId ID de l'entité à invalider
   * @param cascadeDepth Profondeur maximale de la cascade (par défaut: 2)
   */
  invalidateEntityCascade(group: CacheGroup, entityId: number, cascadeDepth: number = 2): void {
    // D'abord invalider l'entité elle-même
    this.invalidateEntity(group, entityId);
    
    // Si nous avons atteint la profondeur maximale, arrêter la cascade
    if (cascadeDepth <= 0) {
      return;
    }
    
    // Récupérer les groupes affectés par cette entité
    const affectedGroups = this.entityRelations[group] || [];
    
    // Invalider les listes qui pourraient contenir cette entité
    this.invalidateRelatedLists(group);
    
    // Pour chaque groupe affecté, invalider les entités liées
    // Note: Dans une implémentation complète, on devrait identifier précisément quelles entités sont affectées
    // Ici nous utilisons une approche simplifiée en invalidant les groupes entiers
    for (const affectedGroup of affectedGroups) {
      // Invalider le groupe avec une profondeur réduite
      this.invalidateGroupWithLists(affectedGroup, cascadeDepth - 1);
    }
    
    logger.info(LogCategory.CACHE, `Cascade invalidation completed for ${group}/${entityId}`);
  }
  
  /**
   * Invalide les listes associées à un groupe spécifique
   * @param group Groupe dont les listes doivent être invalidées
   */
  private invalidateRelatedLists(group: CacheGroup): void {
    const listKey = `${group}:list`;
    this.invalidateByPrefix(listKey);
  }
  
  /**
   * Invalide un groupe entier et ses listes associées
   * @param group Groupe à invalider
   * @param cascadeDepth Profondeur restante pour la cascade
   */
  private invalidateGroupWithLists(group: CacheGroup, cascadeDepth: number): void {
    // Invalider toutes les entrées du groupe
    this.invalidateByGroup(group);
    
    // Invalider les listes associées
    this.invalidateRelatedLists(group);
    
    // Continuer la cascade si nécessaire
    if (cascadeDepth > 0) {
      const affectedGroups = this.entityRelations[group] || [];
      for (const affectedGroup of affectedGroups) {
        this.invalidateGroupWithLists(affectedGroup, cascadeDepth - 1);
      }
    }
  }
  
  /**
   * Récupère des statistiques sur l'utilisation du cache
   * @returns Statistiques du cache avec métriques formatées
   */
  getStats(): CacheStats & { 
    hitRate: string; 
    totalSizeMB: string;
    performanceGain: string;
  } {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? (this.stats.hits / total * 100).toFixed(2) + '%' : '0%';
    const totalSizeMB = (this.stats.totalSizeBytes / (1024 * 1024)).toFixed(2) + ' MB';
    
    // Calculer le gain de performance (combien de fois plus rapide avec le cache)
    let performanceGain = 'N/A';
    if (this.stats.averageAccessTimeWithCache > 0 && this.stats.averageAccessTimeWithoutCache > 0) {
      const gainFactor = this.stats.averageAccessTimeWithoutCache / this.stats.averageAccessTimeWithCache;
      performanceGain = gainFactor.toFixed(1) + 'x';
    }
    
    return {
      ...this.stats,
      hitRate,
      totalSizeMB,
      performanceGain
    };
  }
  
  /**
   * Réinitialise les statistiques du cache
   */
  resetStats(): void {
    this.stats = {
      hits: 0,
      misses: 0,
      invalidations: 0,
      totalEntries: this.stats.totalEntries,
      averageAccessTimeWithCache: 0,
      averageAccessTimeWithoutCache: 0,
      accessTimeWithCacheSum: 0,
      accessTimeWithoutCacheSum: 0,
      totalSizeBytes: this.stats.totalSizeBytes // Garde la taille actuelle du cache
    };
  }
}

// Créer une instance de cache pour le serveur MCP
const mcpCache = new MCPCache();
export default mcpCache;
