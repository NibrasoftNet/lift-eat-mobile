import { Product } from '../api/OpenFoodFactsService';

/**
 * Service pour gérer le cache des résultats de recherche
 * Stocke les résultats avec une durée de vie limitée pour éviter de surcharger la mémoire
 * et permettre de récupérer rapidement les données en cas d'erreur réseau
 */
class SearchCacheService {
  private static cache: Map<string, { data: any, timestamp: number, expireAt: number }> = new Map();
  private static readonly DEFAULT_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes en ms
  private static readonly MAX_CACHE_ENTRIES = 100; // Nombre maximum d'entrées dans le cache
  
  /**
   * Ajoute des données au cache avec une durée de vie spécifiée
   * @param key Clé unique d'identification
   * @param data Données à mettre en cache
   * @param duration Durée de vie du cache en ms (défaut: 30 minutes)
   */
  static addToCache(key: string, data: any, duration: number = this.DEFAULT_CACHE_DURATION): void {
    const now = Date.now();
    
    this.cache.set(key, {
      data,
      timestamp: now,
      expireAt: now + duration
    });
    
    // Gérer la taille du cache
    this.maintainCacheSize();
  }
  
  /**
   * Récupère des données du cache si elles existent et ne sont pas expirées
   * @param key Clé unique d'identification
   * @returns Les données en cache ou null si non trouvées ou expirées
   */
  static getFromCache(key: string): any {
    const cached = this.cache.get(key);
    
    if (!cached) return null;
    
    // Vérifier si le cache a expiré
    const now = Date.now();
    if (now > cached.expireAt) {
      // Ne pas supprimer l'entrée, elle peut être utile pour getExpiredCache
      return null;
    }
    
    return cached.data;
  }
  
  /**
   * Récupère des données du cache même si elles sont expirées
   * Utile comme fallback en cas d'erreur réseau
   * @param key Clé unique d'identification
   * @returns Les données en cache ou null si non trouvées
   */
  static getExpiredCache(key: string): any {
    const cached = this.cache.get(key);
    
    if (!cached) return null;
    
    // Renvoyer les données même si elles sont expirées
    return cached.data;
  }
  
  /**
   * Trouve une clé similaire dans le cache basée sur un terme de recherche
   * @param searchTerm Terme de recherche à comparer
   * @returns La clé similaire trouvée ou null
   */
  static findSimilarCacheKey(searchTerm: string): string | null {
    if (!searchTerm) return null;
    
    const normalizedTerm = searchTerm.toLowerCase().trim();
    
    // Rechercher une clé similaire (contenant le terme ou inversement)
    for (const key of this.cache.keys()) {
      if (key.includes('search_') && 
          (key.includes(normalizedTerm) || normalizedTerm.includes(key.replace('search_', '')))) {
        return key;
      }
    }
    
    return null;
  }
  
  /**
   * Supprime une entrée du cache
   * @param key Clé unique d'identification
   */
  static removeFromCache(key: string): void {
    this.cache.delete(key);
  }
  
  /**
   * Vide le cache
   */
  static clearCache(): void {
    this.cache.clear();
  }
  
  /**
   * Supprime les entrées expirées du cache
   */
  static cleanExpiredEntries(): void {
    const now = Date.now();
    
    for (const [key, value] of this.cache.entries()) {
      if (now > value.expireAt) {
        this.cache.delete(key);
      }
    }
  }
  
  /**
   * Maintient la taille du cache sous la limite MAX_CACHE_ENTRIES
   * en supprimant les entrées les plus anciennes si nécessaire
   */
  private static maintainCacheSize(): void {
    if (this.cache.size <= this.MAX_CACHE_ENTRIES) return;
    
    // Trier les entrées par timestamp (plus ancien → plus récent)
    const entries = Array.from(this.cache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    // Nombre d'entrées à supprimer
    const entriesToRemove = this.cache.size - this.MAX_CACHE_ENTRIES;
    
    // Supprimer les entrées les plus anciennes
    for (let i = 0; i < entriesToRemove; i++) {
      this.cache.delete(entries[i][0]);
    }
  }
  
  /**
   * Génère une clé de cache à partir des paramètres de recherche
   * @param params Paramètres de recherche
   * @returns Clé unique pour le cache
   */
  static generateCacheKey(params: any): string {
    try {
      // Extraire les paramètres principaux pour créer une clé concise
      const { search_terms, page, page_size, sort_by, nutriments, allergens, countries } = params;
      
      // Standardiser le format des pays pour éviter les incohérences de cache
      let standardizedCountries = countries;
      if (Array.isArray(countries)) {
        standardizedCountries = countries.sort().join(',');
      }
      
      // Créer un objet avec les paramètres principaux
      const keyParams = {
        search_terms: search_terms?.trim() || '',
        page: page || 1,
        page_size: page_size || 20,
        sort_by: sort_by || '',
        nutriments: nutriments || '',
        allergens: allergens || '',
        countries: standardizedCountries || 'France'
      };
      
      // Retourner une clé basée sur la chaîne JSON
      const key = `search_${JSON.stringify(keyParams)}`;
      console.log(`🔑 [SearchCache] Clé générée: ${key}`);
      return key;
    } catch (error) {
      console.error(`❌ [SearchCache] Erreur lors de la génération de la clé de cache:`, error);
      // Fallback pour éviter une erreur
      return `search_fallback_${Date.now()}`;
    }
  }

  /**
   * Vide les entrées de cache pour un terme de recherche spécifique
   * Utile pour forcer un rafraîchissement des données
   * @param searchTerm Terme de recherche à vider du cache
   */
  static clearCacheForSearchTerm(searchTerm: string): void {
    try {
      const keys = Array.from(this.cache.keys());
      const keysToDelete = keys.filter(key => 
        key.includes(`"search_terms":"${searchTerm}"`) || 
        key.includes(`"search_terms":"${searchTerm.toLowerCase()}"`)
      );
      
      console.log(`🧹 [SearchCache] Suppression de ${keysToDelete.length} entrées de cache pour le terme "${searchTerm}"`);
      
      keysToDelete.forEach(key => {
        this.cache.delete(key);
      });
    } catch (error) {
      console.error(`❌ [SearchCache] Erreur lors du nettoyage du cache pour "${searchTerm}":`, error);
    }
  }
}

export default SearchCacheService;
