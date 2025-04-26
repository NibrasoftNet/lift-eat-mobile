import { ApiVersionImpl } from '../interfaces/version';
import { ExternalApiAdapter } from './api-adapter';
import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { Product as OpenFoodFactsProduct } from '../OpenFoodFactsService';
import { ImageSourcePropType } from 'react-native';

/**
 * Interface adaptée pour les produits OpenFoodFacts
 * Compatibilité avec le reste de l'application tout en maintenant
 * une structure cohérente pour les données de l'API externe
 */
interface Product {
  name: string;
  image: ImageSourcePropType | null;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  barcode: string;
  quantity: string;
  unit: string;
}

/**
 * Interface pour les paramètres de recherche OpenFoodFacts
 */
export interface SearchProductParams {
  barcode?: string;
  searchTerm?: string;
  category?: string;
  page?: number;
  pageSize?: number;
}

/**
 * Adaptateur pour l'API OpenFoodFacts
 * Gère le versionnage et les appels à l'API OpenFoodFacts
 */
export class OpenFoodFactsApiAdapter extends ExternalApiAdapter {
  private static instance: OpenFoodFactsApiAdapter;
  private cacheTimeout: number = 30 * 60 * 1000; // 30 minutes
  private productCache: Map<string, { product: Product | null, timestamp: number }> = new Map();

  private constructor() {
    // Version actuelle de l'API OpenFoodFacts (2.0.0)
    super('OpenFoodFacts', 'https://world.openfoodfacts.org/api', new ApiVersionImpl(2, 0, 0));

    // Enregistrer les implémentations des versions précédentes
    this.registerVersionedMethod(
      'getProductByBarcode',
      new ApiVersionImpl(1, 0, 0),
      this.getProductByBarcodeV1
    );
  }

  /**
   * Obtenir l'instance unique de OpenFoodFactsApiAdapter (Singleton)
   */
  public static getInstance(): OpenFoodFactsApiAdapter {
    if (!OpenFoodFactsApiAdapter.instance) {
      OpenFoodFactsApiAdapter.instance = new OpenFoodFactsApiAdapter();
    }
    return OpenFoodFactsApiAdapter.instance;
  }

  /**
   * Récupère un produit par son code-barres
   * @param barcode Code-barres du produit
   * @returns Produit ou null si non trouvé
   */
  public async getProductByBarcode(barcode: string): Promise<Product | null> {
    try {
      // Vérifier si le produit est dans le cache et si le cache est encore valide
      const cachedProduct = this.productCache.get(barcode);
      const now = Date.now();
      
      if (cachedProduct && (now - cachedProduct.timestamp < this.cacheTimeout)) {
        logger.debug(LogCategory.INTEGRATION, `Using cached product for barcode ${barcode}`);
        return cachedProduct.product;
      }
      
      // Valider le code-barres
      if (!barcode || barcode.trim() === '') {
        throw new Error('Invalid barcode format');
      }

      logger.info(LogCategory.INTEGRATION, `Fetching product with barcode ${barcode} from OpenFoodFacts API`);
      
      const response = await fetch(`${this.apiInfo.baseUrl}/v2/product/${barcode}.json`);

      if (response.status === 404) {
        logger.warn(LogCategory.INTEGRATION, `Product with barcode ${barcode} not found`);
        this.productCache.set(barcode, { product: null, timestamp: now });
        return null;
      }

      if (!response.ok) {
        throw new Error(`OpenFoodFacts API error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.product) {
        logger.warn(LogCategory.INTEGRATION, `No product data for barcode ${barcode}`);
        this.productCache.set(barcode, { product: null, timestamp: now });
        return null;
      }

      const product = this.mapToProduct(data.product);
      
      // Mettre le produit en cache
      this.productCache.set(barcode, { product, timestamp: now });
      
      return product;
    } catch (error) {
      logger.error(LogCategory.INTEGRATION, `Error fetching product with barcode ${barcode}: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }

  /**
   * Récupère un produit par son code-barres (version 1.0.0)
   * @param barcode Code-barres du produit
   * @returns Produit ou null si non trouvé
   */
  private async getProductByBarcodeV1(barcode: string): Promise<Product | null> {
    try {
      logger.info(LogCategory.INTEGRATION, `Using v1.0.0 implementation for barcode ${barcode}`);
      
      // Valider le code-barres
      if (!barcode || barcode.trim() === '') {
        throw new Error('Invalid barcode format');
      }

      // Format de requête pour l'API OpenFoodFacts v1.0.0
      const response = await fetch(`https://world.openfoodfacts.org/api/v1/product/${barcode}.json`);

      if (response.status === 404) {
        logger.warn(LogCategory.INTEGRATION, `Product with barcode ${barcode} not found (v1.0.0)`);
        return null;
      }

      if (!response.ok) {
        throw new Error(`OpenFoodFacts API v1.0.0 error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.product) {
        logger.warn(LogCategory.INTEGRATION, `No product data for barcode ${barcode} (v1.0.0)`);
        return null;
      }

      // Convertir le format de réponse v1 en format actuel
      return this.mapToProductV1(data.product);
    } catch (error) {
      logger.error(LogCategory.INTEGRATION, `Error fetching product with barcode ${barcode} (v1.0.0): ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }

  /**
   * Recherche des produits par terme de recherche
   * @param params Paramètres de recherche
   * @returns Liste de produits
   */
  public async searchProducts(params: SearchProductParams): Promise<Product[]> {
    try {
      const { searchTerm, category, page = 1, pageSize = 10 } = params;
      
      if (!searchTerm && !category) {
        throw new Error('Search term or category is required');
      }

      let url = `${this.apiInfo.baseUrl}/v2/search?fields=product_name,nutriments,image_url,image_front_url,image_small_url&page_size=${pageSize}&page=${page}`;
      
      if (searchTerm) {
        url += `&search_terms=${encodeURIComponent(searchTerm)}`;
      }
      
      if (category) {
        url += `&categories=${encodeURIComponent(category)}`;
      }

      logger.info(LogCategory.INTEGRATION, `Searching products with term: ${searchTerm}, category: ${category}`);
      
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`OpenFoodFacts API error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.products || !Array.isArray(data.products)) {
        return [];
      }

      return data.products.map((product: any) => this.mapToProduct(product)).filter(Boolean);
    } catch (error) {
      logger.error(LogCategory.INTEGRATION, `Error searching products: ${error instanceof Error ? error.message : String(error)}`);
      return [];
    }
  }

  /**
   * Convertit les données brutes de l'API OpenFoodFacts en objet Product
   * @param product Données brutes du produit
   * @returns Produit formaté
   */
  private mapToProduct(product: any): Product {
    // Extraire les informations nutritionnelles
    const nutriments = product.nutriments || {};
    
    // Obtenir l'URL de l'image du produit
    let productImage: ImageSourcePropType | null = require('@/assets/images/image-non-disponible.jpg');
    
    // Vérifier les images du produit par ordre de priorité
    if (product.image_url) {
      productImage = { uri: product.image_url };
    } else if (product.image_front_url) {
      productImage = { uri: product.image_front_url };
    } else if (product.image_small_url) {
      productImage = { uri: product.image_small_url };
    }
    
    // Retourner un objet avec les informations du produit
    return {
      name: product.product_name || 'Produit sans nom',
      image: productImage,
      calories: nutriments['energy-kcal_100g'] || 0,
      protein: nutriments.proteins_100g || 0,
      carbs: nutriments.carbohydrates_100g || 0,
      fat: nutriments.fat_100g || 0,
      barcode: product.code || '',
      quantity: '100', // Converti en chaîne pour correspondre au type attendu
      unit: 'g',
    };
  }

  /**
   * Convertit les données brutes de l'API OpenFoodFacts v1 en objet Product
   * @param product Données brutes du produit (format v1)
   * @returns Produit formaté
   */
  private mapToProductV1(product: any): Product {
    // Extraire les informations nutritionnelles (format v1)
    const nutriments = product.nutriments || {};
    
    // Obtenir l'URL de l'image du produit
    let productImage: ImageSourcePropType | null = require('@/assets/images/image-non-disponible.jpg');
    
    // Vérifier les images du produit par ordre de priorité (format v1)
    if (product.image_url) {
      productImage = { uri: product.image_url };
    } else if (product.image_front_url) {
      productImage = { uri: product.image_front_url };
    }
    
    // Retourner un objet avec les informations du produit
    return {
      name: product.product_name || 'Produit sans nom',
      image: productImage,
      calories: nutriments.energy_value || 0,
      protein: nutriments.proteins || 0,
      carbs: nutriments.carbohydrates || 0,
      fat: nutriments.fat || 0,
      barcode: product.code || '',
      quantity: '100', // Converti en chaîne pour correspondre au type attendu
      unit: 'g',
    };
  }

  /**
   * Vérifie la version actuelle de l'API OpenFoodFacts
   * @returns Version actuelle de l'API
   */
  public async checkApiVersion(): Promise<ApiVersionImpl> {
    try {
      // Appel à un endpoint pour vérifier la version
      logger.info(LogCategory.INTEGRATION, 'Checking OpenFoodFacts API version');
      
      const response = await fetch(`${this.apiInfo.baseUrl}/info`);
      
      if (!response.ok) {
        throw new Error(`OpenFoodFacts API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Extraire la version de la réponse (si disponible)
      if (data.version) {
        const versionString = String(data.version); // Assurer que c'est une chaîne
        const versionParts = versionString.split('.').map(Number);
        return new ApiVersionImpl(
          versionParts[0] || 2,
          versionParts[1] || 0,
          versionParts[2] || 0
        );
      }
      
      // Si la version n'est pas disponible, retourner la version par défaut
      return new ApiVersionImpl(2, 0, 0);
    } catch (error) {
      logger.error(LogCategory.INTEGRATION, `Error checking OpenFoodFacts API version: ${error instanceof Error ? error.message : String(error)}`);
      // En cas d'erreur, on retourne la dernière version connue
      return this.apiInfo.currentVersion as ApiVersionImpl;
    }
  }

  /**
   * Méthode pour récupérer un produit avec une version spécifique de l'API
   * @param barcode Code-barres du produit
   * @param requiredVersion Version requise de l'API
   * @returns Produit ou null si non trouvé
   */
  public async getProductByBarcodeWithVersion(
    barcode: string,
    requiredVersion: ApiVersionImpl
  ): Promise<Product | null> {
    return this.adaptApiCall<Product | null>('getProductByBarcode', requiredVersion, barcode);
  }

  /**
   * Vide le cache de produits
   */
  public clearCache(): void {
    logger.info(LogCategory.INTEGRATION, 'Clearing OpenFoodFacts product cache');
    this.productCache.clear();
  }
}
