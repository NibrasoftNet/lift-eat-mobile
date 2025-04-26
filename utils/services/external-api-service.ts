import { GeminiApiAdapter } from '../api/adapters/gemini-adapter';
import { OpenFoodFactsApiAdapter } from '../api/adapters/openfoodfacts-adapter';
import { ApiVersionImpl } from '../api/interfaces/version';
import { logger } from '@/utils/services/logging.service';
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
        logger.error(
          LogCategory.INTEGRATION, 
          `Error checking API versions: ${error instanceof Error ? error.message : String(error)}`
        );
      });
    } catch (error) {
      logger.error(
        LogCategory.INTEGRATION, 
        `Error initiating API version check: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Génère du texte via l'API Gemini
   * @param prompt Le texte de prompt
   * @param temperature Température pour la génération (optionnel)
   * @param maxTokens Nombre maximum de tokens (optionnel)
   * @returns Le texte généré
   */
  public async generateTextWithGemini(
    prompt: string,
    temperature?: number,
    maxTokens?: number
  ): Promise<string> {
    return this.geminiAdapter.generateText({
      prompt,
      temperature,
      maxTokens
    });
  }

  /**
   * Génère du texte via l'API Gemini avec une version spécifique
   * @param prompt Le texte de prompt
   * @param version Version spécifique de l'API à utiliser
   * @param temperature Température pour la génération (optionnel)
   * @param maxTokens Nombre maximum de tokens (optionnel)
   * @returns Le texte généré
   */
  public async generateTextWithGeminiVersion(
    prompt: string,
    version: { major: number, minor: number, patch: number },
    temperature?: number,
    maxTokens?: number
  ): Promise<string> {
    const apiVersion = new ApiVersionImpl(version.major, version.minor, version.patch);
    return this.geminiAdapter.generateTextWithVersion(
      {
        prompt,
        temperature,
        maxTokens
      },
      apiVersion
    );
  }

  /**
   * Récupère un produit par son code-barres via OpenFoodFacts
   * @param barcode Code-barres du produit
   * @returns Produit ou null si non trouvé
   */
  public async getProductByBarcode(barcode: string): Promise<any | null> {
    return this.openFoodFactsAdapter.getProductByBarcode(barcode);
  }

  /**
   * Récupère un produit par son code-barres via OpenFoodFacts avec une version spécifique
   * @param barcode Code-barres du produit
   * @param version Version spécifique de l'API à utiliser
   * @returns Produit ou null si non trouvé
   */
  public async getProductByBarcodeWithVersion(
    barcode: string,
    version: { major: number, minor: number, patch: number }
  ): Promise<any | null> {
    const apiVersion = new ApiVersionImpl(version.major, version.minor, version.patch);
    return this.openFoodFactsAdapter.getProductByBarcodeWithVersion(barcode, apiVersion);
  }

  /**
   * Recherche des produits via OpenFoodFacts
   * @param searchTerm Terme de recherche
   * @param category Catégorie (optionnel)
   * @param page Numéro de page (optionnel)
   * @param pageSize Taille de la page (optionnel)
   * @returns Liste de produits
   */
  public async searchProducts(
    searchTerm?: string,
    category?: string,
    page?: number,
    pageSize?: number
  ): Promise<any[]> {
    return this.openFoodFactsAdapter.searchProducts({
      searchTerm,
      category,
      page,
      pageSize
    });
  }

  /**
   * Vide le cache de produits OpenFoodFacts
   */
  public clearOpenFoodFactsCache(): void {
    this.openFoodFactsAdapter.clearCache();
  }
}

export default ExternalApiService.getInstance();
