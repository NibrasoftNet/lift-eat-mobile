import { Product } from '../api/OpenFoodFactsService';

/**
 * Service pour gérer le cache des résultats de recherche
 * Stocke uniquement les 20 premiers résultats pour chaque terme de recherche
 * avec une durée de vie limitée pour éviter de surcharger la mémoire
 */
class SearchCacheService {
  private cache: Map<string, { results: Product[], timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 heures en ms
  private readonly MAX_CACHE_ENTRIES = 50; // Nombre maximum d'entrées dans le cache
  private readonly MAX_RESULTS_PER_ENTRY = 20; // Nombre maximum de résultats par entrée
  
  /**
   * Récupère les résultats en cache pour un terme de recherche
   * @param searchTerm Le terme de recherche
   * @param filters Filtres optionnels (catégorie, marque, etc.)
   * @returns Les résultats en cache ou null si non trouvés ou expirés
   */
  getCachedResults(searchTerm: string, filters?: Record<string, string>): Product[] | null {
    // Créer une clé unique basée sur le terme de recherche et les filtres
    const cacheKey = this.createCacheKey(searchTerm, filters);
    const cached = this.cache.get(cacheKey);
    
    if (!cached) return null;
    
    // Vérifier si le cache a expiré
    if (Date.now() - cached.timestamp > this.CACHE_DURATION) {
      this.cache.delete(cacheKey);
      return null;
    }
    
    return cached.results;
  }
  
  /**
   * Met en cache les résultats d'une recherche
   * @param searchTerm Le terme de recherche
   * @param results Les résultats à mettre en cache
   * @param filters Filtres optionnels (catégorie, marque, etc.)
   */
  cacheResults(searchTerm: string, results: Product[], filters?: Record<string, string>): void {
    // Créer une clé unique basée sur le terme de recherche et les filtres
    const cacheKey = this.createCacheKey(searchTerm, filters);
    
    // Limiter à MAX_RESULTS_PER_ENTRY résultats
    const limitedResults = results.slice(0, this.MAX_RESULTS_PER_ENTRY);
    
    this.cache.set(cacheKey, {
      results: limitedResults,
      timestamp: Date.now()
    });
    
    // Gérer la taille du cache
    this.maintainCacheSize();
  }
  
  /**
   * Vide le cache
   */
  clearCache(): void {
    this.cache.clear();
  }
  
  /**
   * Supprime les entrées expirées du cache
   */
  cleanExpiredEntries(): void {
    const now = Date.now();
    
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.CACHE_DURATION) {
        this.cache.delete(key);
      }
    }
  }
  
  /**
   * Crée une clé unique pour le cache basée sur le terme de recherche et les filtres
   */
  private createCacheKey(searchTerm: string, filters?: Record<string, string>): string {
    if (!filters || Object.keys(filters).length === 0) {
      return searchTerm.toLowerCase().trim();
    }
    
    // Inclure les filtres dans la clé de cache
    const filterString = Object.entries(filters)
      .sort((a, b) => a[0].localeCompare(b[0])) // Tri par nom de filtre
      .map(([key, value]) => `${key}:${value}`)
      .join('|');
    
    return `${searchTerm.toLowerCase().trim()}|${filterString}`;
  }
  
  /**
   * Maintient la taille du cache sous la limite MAX_CACHE_ENTRIES
   * en supprimant les entrées les plus anciennes si nécessaire
   */
  private maintainCacheSize(): void {
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
}

// Export comme singleton
export default new SearchCacheService();
