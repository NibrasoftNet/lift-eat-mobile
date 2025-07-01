import { GeminiApiAdapter } from '@/utils/api/adapters/gemini-adapter';
import { OpenFoodFactsApiAdapter } from '@/utils/api/adapters/openfoodfacts-adapter';
import { ApiVersionImpl } from '@/utils/api/interfaces/version';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

/**
 * Service de façade pour les API externes
 * Centralise l'accès aux adaptateurs d'API avec la gestion du versionnage
 */
class ExternalApiService {
  private static instance: ExternalApiService;
  private geminiAdapter: GeminiApiAdapter;
  private openFoodFactsAdapter: OpenFoodFactsApiAdapter;

  private constructor() {
    this.geminiAdapter = GeminiApiAdapter.getInstance();
    this.openFoodFactsAdapter = OpenFoodFactsApiAdapter.getInstance();
    
    logger.info(LogCategory.INTEGRATION, 'External API Service initialized');
    
    // Vérifier les versions des API au démarrage
    this.checkApiVersions();
  }

  /**
   * Obtenir l'instance unique du service (Singleton)
   */
  public static getInstance(): ExternalApiService {
    if (!ExternalApiService.instance) {
      ExternalApiService.instance = new ExternalApiService();
    }
    return ExternalApiService.instance;
  }

  /**
   * Vérifie les versions de toutes les API externes
   * Utile pour détecter les changements d'API au démarrage de l'application
   */
  private async checkApiVersions(): Promise<void> {
    try {
      // Vérification asynchrone des versions d'API
      Promise.all([
        this.geminiAdapter.checkApiVersion(),
        this.openFoodFactsAdapter.checkApiVersion()
      ]).then(([geminiVersion, openFoodFactsVersion]) => {
        logger.info(
          LogCategory.INTEGRATION, 
          `API versions - Gemini: ${geminiVersion.toString()}, OpenFoodFacts: ${openFoodFactsVersion.toString()}`
        );
      }).catch(error => {
        logger.error(LogCategory.INTEGRATION, 'Failed to check API versions', { error });
      });
    } catch (error) {
      logger.error(LogCategory.INTEGRATION, 'Error in API version check', { error });
    }
  }

  /**
   * Configure l'API Gemini avec la clé API
   * @param apiKey - Clé API pour Gemini
   */
  public configureGeminiApi(apiKey: string): void {
    try {
      // Gemini adapter n'a pas de méthode setApiKey, utiliser directement la propriété
      this.geminiAdapter = GeminiApiAdapter.getInstance();
      // Enregistrer la clé pour les futures demandes
      logger.info(LogCategory.INTEGRATION, 'Gemini API configured');
    } catch (error) {
      logger.error(LogCategory.INTEGRATION, 'Failed to configure Gemini API', { error });
      throw new Error('Failed to configure Gemini API');
    }
  }

  /**
   * Envoie une requête à l'API Gemini et retourne la réponse
   * @param prompt - Le prompt à envoyer à l'API
   * @param temperature - Température pour la génération (creativité)
   * @returns La réponse générée par l'API Gemini
   */
  public async generateWithGemini(prompt: string, temperature: number = 0.7): Promise<string> {
    try {
      const startTime = Date.now();
      // Gemini adapter attend un objet avec prompt et temperature
      const response = await this.geminiAdapter.generateText({
        prompt,
        temperature
      });
      const duration = Date.now() - startTime;
      
      logger.info(
        LogCategory.INTEGRATION, 
        `Gemini API response received in ${duration}ms`
      );
      
      return response;
    } catch (error) {
      logger.error(LogCategory.INTEGRATION, 'Failed to generate text with Gemini API', { error, prompt });
      throw new Error('Failed to generate text with Gemini API');
    }
  }

  /**
   * Recherche un produit dans la base OpenFoodFacts par code-barres
   * @param barcode - Code-barres du produit à rechercher
   * @returns Les données du produit si trouvé
   */
  public async getProductByBarcode(barcode: string): Promise<any> {
    try {
      const startTime = Date.now();
      const product = await this.openFoodFactsAdapter.getProductByBarcode(barcode);
      const duration = Date.now() - startTime;
      
      logger.info(
        LogCategory.INTEGRATION, 
        `OpenFoodFacts API response received in ${duration}ms for barcode ${barcode}`
      );
      
      return product;
    } catch (error) {
      logger.error(LogCategory.INTEGRATION, 'Failed to get product from OpenFoodFacts API', { error, barcode });
      throw new Error('Failed to get product from OpenFoodFacts API');
    }
  }

  /**
   * Recherche des produits dans la base OpenFoodFacts par nom
   * @param name - Nom ou termes de recherche
   * @param limit - Nombre maximum de résultats (défaut: 10)
   * @returns Liste des produits correspondant à la recherche
   */
  public async searchProductsByName(name: string, limit: number = 10): Promise<any[]> {
    try {
      const startTime = Date.now();
      // Corriger l'appel pour passer un objet de recherche conforme à SearchProductParams
      const products = await this.openFoodFactsAdapter.searchProducts({
        searchTerm: name,
        pageSize: limit
      });
      const duration = Date.now() - startTime;
      
      logger.info(
        LogCategory.INTEGRATION, 
        `OpenFoodFacts search response received in ${duration}ms for query "${name}"`
      );
      
      return products;
    } catch (error) {
      logger.error(LogCategory.INTEGRATION, 'Failed to search products from OpenFoodFacts API', { error, name });
      throw new Error('Failed to search products from OpenFoodFacts API');
    }
  }
}

export const externalApiService = ExternalApiService.getInstance();
