/**
 * Service générique de gestion des drawers
 * Fournit des fonctionnalités communes pour tous les composants drawer
 */

import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { DrawerServiceInterface } from '@/utils/interfaces/drawer.interface';
import { 
  DEFAULT_DEBOUNCE_DELAY,
  DEFAULT_PAGINATION_THRESHOLD,
  DEFAULT_ESTIMATED_ITEM_SIZE 
} from '@/utils/constants/ui-constants';

/**
 * Implémentation du service générique pour les drawers
 * Contient des fonctionnalités réutilisables pour tous les types de drawers
 */
class DrawerUIService implements DrawerServiceInterface {
  // Stockage des timers pour le debounce
  private debounceTimers: Map<string, NodeJS.Timeout> = new Map();
  
  /**
   * Debounce un terme de recherche pour éviter trop d'appels à l'API
   * @param searchTerm - Le terme de recherche à debouncer
   * @param callback - La fonction à appeler avec le terme debouncé
   * @param delay - Le délai de debounce en ms (par défaut: 300ms)
   */
  debounceSearchTerm(
    searchTerm: string,
    callback: (term: string) => void,
    delay: number = DEFAULT_DEBOUNCE_DELAY
  ): void {
    // Identifiant unique pour ce callback
    const callbackId = `search-${Date.now()}`;
    
    // Annuler le timer existant s'il existe
    if (this.debounceTimers.has(callbackId)) {
      clearTimeout(this.debounceTimers.get(callbackId));
    }
    
    // Définir un nouveau timer
    const timer = setTimeout(() => {
      callback(searchTerm);
      this.debounceTimers.delete(callbackId);
    }, delay);
    
    // Stocker le timer
    this.debounceTimers.set(callbackId, timer);
  }
  
  /**
   * Génère un identifiant unique pour un élément de liste
   * @param prefix - Le préfixe pour l'identifiant (ex: 'ing' pour ingrédients)
   * @param id - L'ID numérique de l'élément
   * @param pageParam - Indice de la page courante
   * @param index - Indice de l'élément dans la page
   * @returns Un identifiant unique au format 'prefix-id-pX-iY'
   */
  generateUniqueId(
    prefix: string,
    id: number,
    pageParam: number,
    index: number
  ): string {
    return `${prefix}-${id}-p${pageParam}-i${index}`;
  }

  /**
   * Création d'un gestionnaire optimisé pour la fin de liste
   * @param hasNextPage - Indique s'il existe une page suivante
   * @param fetchNextPage - Fonction à appeler pour récupérer la page suivante
   * @returns Une fonction à utiliser comme gestionnaire d'événement
   */
  createEndReachedHandler(
    hasNextPage: boolean | undefined,
    fetchNextPage: () => Promise<any>
  ): () => void {
    return () => {
      if (hasNextPage) {
        logger.debug(LogCategory.UI, `End of list reached, loading next page`);
        fetchNextPage();
      }
    };
  }

  /**
   * Obtenir la configuration optimisée pour FlashList
   * @returns Des paramètres optimisés pour les performances de FlashList
   */
  getFlashListConfig() {
    return {
      estimatedItemSize: DEFAULT_ESTIMATED_ITEM_SIZE,
      onEndReachedThreshold: DEFAULT_PAGINATION_THRESHOLD,
      estimatedListSize: {height: 500, width: 400},
      initialNumToRender: 10,
      maxToRenderPerBatch: 5,
      windowSize: 5
    };
  }

  /**
   * Transforme un tableau d'éléments pour l'affichage optimal
   * @param items - Les éléments à transformer
   * @param limit - Limite maximum d'éléments à inclure
   * @returns Un tableau d'éléments optimisé pour l'affichage
   */
  optimizeItemsForDisplay<T>(items: T[], limit: number = 60): T[] {
    if (!items || items.length === 0) return [];
    return items.slice(0, limit);
  }
}

// Exporter une instance unique du service
export const drawerUIService = new DrawerUIService();
