import { ImageSourcePropType } from 'react-native';
import { CountryTypeEnum, CountryConfig } from '@/utils/enum/meal.enum';
import { formatNutritionalValue } from '../helpers/format.helper';

/**
 * Types for Open Food Facts API responses
 */
export interface Product {
  _id: string;
  code: string;
  product_name: string;
  product_name_fr?: string;
  brands?: string;
  categories?: string;
  image_url?: string;
  image_small_url?: string;
  image_front_url?: string;
  image_ingredients_url?: string;
  image_nutrition_url?: string;
  quantity?: string;
  serving_size?: string;
  nutriments?: {
    energy_100g?: number;
    energy_unit?: string;
    fat_100g?: number;
    saturated_fat_100g?: number;
    carbohydrates_100g?: number;
    sugars_100g?: number;
    fiber_100g?: number;
    proteins_100g?: number;
    salt_100g?: number;
    sodium_100g?: number;
  };
  nutriscore_grade?: string;
  ingredients_text?: string;
  allergens?: string;
  labels?: string;
  stores?: string;
}

export interface OpenFoodFactsResponse {
  status: number;
  status_verbose: string;
  product?: Product;
  products?: Product[];
  count?: number;
  page?: number;
  page_count?: number;
  page_size?: number;
  image_small_url?: string;
}

/**
 * Search parameters for Open Food Facts API
 */
export interface SearchParams {
  search_terms?: string;
  brands?: string;
  categories?: string;
  page?: number;
  page_size?: number;
  sort_by?: string;
  tag?: string;
  country?: CountryTypeEnum;
}

/**
 * Information about a product necessary for display in the scanner
 */
export interface ProductResult {
  code: string;
  name: string;
  image: ImageSourcePropType | null;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  sugars: number;
  allergens?: string;
  brands?: string;
  categories?: string;
  nutriscore_grade?: string;
}

/**
 * Result of a barcode scan validation
 */
export interface ScanResult {
  isValid: boolean;
  message: string;
  productResult: ProductResult | null;
}

/**
 * Service to interact with Open Food Facts API
 */
class OpenFoodFactsService {
  private defaultCountry: CountryTypeEnum = CountryTypeEnum.FRANCE;

  /**
   * Get product by barcode
   * @param barcode The product barcode
   * @param country Country for the search (default: France)
   * @returns Promise with product data
   */
  async getProductByBarcode(
    barcode: string,
    country: CountryTypeEnum = this.defaultCountry,
  ): Promise<Product | null> {
    try {
      const response = await fetch(
        `${CountryConfig[country].url}/api/v0/product/${barcode}.json`,
      );

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data: OpenFoodFactsResponse = await response.json();

      if (data.status === 0 || !data.product) {
        return null;
      }

      return data.product;
    } catch (error) {
      console.error('Error fetching product by barcode:', error);
      return null;
    }
  }

  /**
   * Scans a barcode and returns validation results with product information
   * @param barcode The barcode to scan
   * @returns Promise with scan validation results
   */
  async scanBarcode(barcode: string): Promise<ScanResult> {
    try {
      // Validate barcode format (basic validation)
      if (!barcode || barcode.trim() === '') {
        return {
          isValid: false,
          message: 'Invalid or empty barcode',
          productResult: null,
        };
      }

      const product = await this.getProductByBarcode(barcode);

      if (!product) {
        return {
          isValid: false,
          message: `Product with barcode "${barcode}" not found. Try another product or check that the barcode is correct.`,
          productResult: null,
        };
      }

      // Convert product to productResult format
      const productResult = this.convertProductToProductResult(product);

      // Check if productResult is null (this happens when all nutritional values are 0)
      if (!productResult) {
        return {
          isValid: false,
          message: `Product "${
            product.product_name || 'no name'
          }" (barcode: ${barcode}) found but all nutritional values are zero. Try another product.`,
          productResult: null,
        };
      }

      return {
        isValid: true,
        message: 'Product found successfully',
        productResult,
      };
    } catch (error) {
      console.error('Error during barcode scan:', error);

      // Provide more informative error message based on error type
      let errorMessage = 'Error searching for product';

      if (error instanceof Error) {
        if (error.message.includes('404')) {
          errorMessage = 'Product not found in database';
        } else if (error.message.includes('network')) {
          errorMessage =
            'Network connection error. Check your internet connection.';
        }
      }

      return {
        isValid: false,
        message: errorMessage,
        productResult: null,
      };
    }
  }

  /**
   * Converts an Open Food Facts product to a simplified object with product information
   * @param product The product from Open Food Facts
   * @returns A simplified object with product information or null if product is invalid
   */
  convertProductToProductResult(product: Product): ProductResult | null {
    // Return null if product is null
    if (!product) {
      return null;
    }

    // Constants for energy unit conversion
    const KJ_TO_KCAL = 4.184; // 1 kcal = 4.184 kJ
    const DEFAULT_ENERGY_UNIT = 'kJ'; // Default unit from OpenFoodFacts

    // Get nutritional values with fallback to 0
    const rawCalories = product.nutriments?.energy_100g || 0;
    const rawProtein = product.nutriments?.proteins_100g || 0;
    const rawCarbs = product.nutriments?.carbohydrates_100g || 0;
    const rawFats = product.nutriments?.fat_100g || 0;

    // Convert calories from kJ to kcal (assuming values are always in kJ)
    let finalCalories = rawCalories;
    if (rawCalories > 0) {
      finalCalories = Math.round(rawCalories / KJ_TO_KCAL);
    }

    // Format nutritional values
    const formattedCalories = formatNutritionalValue(finalCalories);
    const formattedProtein = formatNutritionalValue(rawProtein);
    const formattedCarbs = formatNutritionalValue(rawCarbs);
    const rawSugars = product.nutriments?.sugars_100g ?? 0;
    const formattedSugars = formatNutritionalValue(rawSugars);
    const formattedCategories = product.categories
      ? product.categories
          .split(',')
          .map((tag) => tag.trim().split(':').pop())
          .filter((s): s is string => Boolean(s))
          .map((c) => c.replace(/_/g, ' '))
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(', ')
      : undefined;
    const formattedFats = formatNutritionalValue(rawFats);

    // Return a simplified object with product information
    return {
      code: product.code,
      name:
        product.product_name || product.product_name_fr || 'Unknown Product',
      image: product.image_front_url ? { uri: product.image_front_url } : null,
      calories: formattedCalories,
      protein: formattedProtein,
      carbs: formattedCarbs,
      fats: formattedFats,
      sugars: formattedSugars,
      allergens: product.allergens
        ? product.allergens
            .split(',')
            .map((tag) => tag.trim().split(':').pop())
            .filter((s): s is string => Boolean(s))
            .map((a) => a.replace(/_/g, ' '))
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(', ')
        : undefined,
      brands: product.brands,
      categories: product.categories,
      nutriscore_grade: product.nutriscore_grade,
    };
  }

  /**
   * Search products based on various criteria
   * @param params Search parameters
   * @returns Promise with search results
   */
  async searchProducts(params: SearchParams): Promise<Product[]> {
    try {
      const country = params.country || this.defaultCountry;
      const searchParams = new URLSearchParams();

      // Paramètres de base
      if (params.search_terms) {
        searchParams.append('search_terms', params.search_terms);
      }
      if (params.brands) {
        searchParams.append('brands', params.brands);
      }
      if (params.categories) {
        searchParams.append('categories', params.categories);
      }
      if (params.page) {
        searchParams.append('page', params.page.toString());
      }
      if (params.page_size) {
        searchParams.append('page_size', params.page_size.toString());
      }
      if (params.sort_by) {
        searchParams.append('sort_by', params.sort_by);
      }

      // Langue par défaut selon le pays
      searchParams.append('lc', CountryConfig[country].code);
      searchParams.append('json', '1');

      // Construction de l'URL avec le bon domaine selon le pays
      const url = `${
        CountryConfig[country].url
      }/cgi/search.pl?${searchParams.toString()}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data: OpenFoodFactsResponse = await response.json();

      if (!data.products || !Array.isArray(data.products)) {
        return [];
      }

      return data.products;
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }

  /**
   * Search products and convert results to ProductResult format
   * @param params Search parameters
   * @returns Promise with array of ProductResult objects
   */
  async searchProductsWithResults(
    params: SearchParams,
  ): Promise<ProductResult[]> {
    console.log(
      '[DEBUG] Paramètres de recherche reçus:',
      JSON.stringify(params, null, 2),
    );

    try {
      let searchTerm = params.search_terms ? params.search_terms.trim() : '';
      let cuisineFilter = params.tag ? params.tag.toLowerCase() : '';

      console.log('[DEBUG] Terme recherché:', searchTerm);
      console.log('[DEBUG] Filtre cuisine:', cuisineFilter);

      // Modification de l'approche pour imiter l'application mobile OpenFoodFacts

      // 1. Déterminer le code pays selon la cuisine sélectionnée
      let countryCode = '';
      switch (cuisineFilter) {
        case 'tunisian':
          countryCode = 'tn'; // Code pour Tunisie
          break;
        case 'american':
          countryCode = 'us'; // Code pour États-Unis
          break;
        case 'chinese':
          countryCode = 'cn'; // Code pour Chine
          break;
        case 'qatari':
          countryCode = 'qa'; // Code pour Qatar
          break;
        case 'caribbean':
          countryCode = 'jm'; // Utiliser Jamaïque comme exemple des Caraïbes
          break;
        // Autres cas selon besoin
      }

      // 2. Construire l'URL comme le fait l'application mobile
      let url;

      if (countryCode && cuisineFilter) {
        // Si un pays est spécifié, utiliser l'URL spécifique au pays
        // Format: https://[pays].openfoodfacts.org/cgi/search.pl?search_terms=...
        url = new URL(`https://${countryCode}.openfoodfacts.org/cgi/search.pl`);
      } else {
        // Sinon utiliser l'URL globale
        url = new URL('https://world.openfoodfacts.org/cgi/search.pl');
      }

      // 3. Ajouter les paramètres de base (similaires à l'application mobile)
      url.searchParams.append('action', 'process');
      url.searchParams.append('json', '1');
      url.searchParams.append('page_size', '50');

      // 4. Ajouter le terme de recherche
      if (searchTerm) {
        url.searchParams.append('search_terms', searchTerm);
      }

      // 5. Paramètres anti-cache pour éviter les problèmes de mise en cache
      url.searchParams.append('nocache', Date.now().toString());

      // 6. Ajoutez des paramètres supplémentaires pour améliorer les résultats
      // Rechercher dans les noms de produits, les marques et les catégories
      url.searchParams.append('search_simple', '1');
      url.searchParams.append('sort_by', 'popularity'); // Trier par popularité

      console.log('[DEBUG] URL complète:', url.toString());

      // Faire la requête avec en-têtes anti-cache
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
          'User-Agent':
            'Lift Eat Mobile/1.0 (recherche de produits alimentaires)',
        },
      });

      console.log('[DEBUG] Statut de la réponse:', response.status);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      // Afficher les 200 premiers caractères pour le débogage
      const responseClone = response.clone();
      const textData = await responseClone.text();
      console.log(
        '[DEBUG] Début de la réponse brute:',
        textData.substring(0, 200) + '...',
      );

      // Conversion en JSON
      const data = await response.json();

      // Si pas de produits, essayer une recherche alternative
      if (!data.products || data.products.length === 0) {
        console.log(
          '[DEBUG] Aucun produit trouvé dans le pays, essai avec recherche mondiale...',
        );

        // Si la recherche par pays n'a rien donné, essayer une recherche mondiale
        if (countryCode) {
          const worldUrl = new URL(
            'https://world.openfoodfacts.org/cgi/search.pl',
          );
          worldUrl.searchParams.append('action', 'process');
          worldUrl.searchParams.append('json', '1');
          worldUrl.searchParams.append('page_size', '50');
          worldUrl.searchParams.append('search_terms', searchTerm);
          worldUrl.searchParams.append('nocache', Date.now().toString());
          worldUrl.searchParams.append('search_simple', '1');
          worldUrl.searchParams.append('sort_by', 'popularity');

          console.log('[DEBUG] URL recherche mondiale:', worldUrl.toString());

          const worldResponse = await fetch(worldUrl.toString(), {
            method: 'GET',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              Pragma: 'no-cache',
              Expires: '0',
            },
          });

          if (worldResponse.ok) {
            const worldData = await worldResponse.json();
            if (worldData.products && worldData.products.length > 0) {
              data.products = worldData.products;
              console.log(
                '[DEBUG] Trouvé',
                worldData.products.length,
                'produits en recherche mondiale',
              );
            }
          }
        }

        // Si toujours aucun résultat
        if (!data.products || data.products.length === 0) {
          console.log('[DEBUG] Aucun produit trouvé après recherche mondiale');
          return [];
        }
      }

      console.log('[DEBUG] Nombre de produits reçus:', data.products.length);

      // Filtrer pour avoir uniquement des produits avec nom
      const validProducts = data.products.filter((product: any) => {
        return product && (product.product_name || product.product_name_fr);
      });

      console.log(
        '[DEBUG] Après filtrage basique:',
        validProducts.length,
        'produits valides',
      );

      // Convertir en ProductResult
      const results = validProducts.map((product: any) => {
        // Image
        let image = null;
        if (product.image_url) {
          image = { uri: product.image_url };
        } else if (product.image_front_url) {
          image = { uri: product.image_front_url };
        } else if (product.image_small_url) {
          image = { uri: product.image_small_url };
        } else {
          image = require('../../assets/images/image-non-disponible.jpg');
        }

        // Nom du produit (préférer français si disponible)
        const name =
          product.product_name_fr || product.product_name || 'Produit sans nom';

        // Valeurs nutritionnelles (avec fallback à 0)
        const calories = formatNutritionalValue(
          product.nutriments?.energy_value ||
            product.nutriments?.energy_100g ||
            0,
        );
        const protein = formatNutritionalValue(
          product.nutriments?.proteins_100g || 0,
        );
        const carbs = formatNutritionalValue(
          product.nutriments?.carbohydrates_100g || 0,
        );
        const fats = formatNutritionalValue(product.nutriments?.fat_100g || 0);

        const formattedCategories = product.categories
          ? product.categories
              .split(',')
              .map((tag: string) => tag.trim().split(':').pop())
              .filter((s: string | undefined): s is string => Boolean(s))
              .map((c: string) => c.replace(/_/g, ' '))
              .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(', ')
          : undefined;

        return {
          code: product.code,
          name,
          image,
          calories,
          protein,
          carbs,
          fats,
          brands: product.brands,
          categories: formattedCategories,
          nutriscore_grade: product.nutrition_grade_fr || 'unknown',
        };
      });

      console.log('[DEBUG] Retourne', results.length, 'résultats finaux');
      return results;
    } catch (error) {
      console.error('[ERROR] Erreur recherche produits:', error);
      return [];
    }
  }

  /**
   * Get suggestions for autocomplete
   * @param term Search term to get suggestions for
   * @returns Promise with suggestions
   */
  async getAutocompleteSuggestions(term: string): Promise<string[]> {
    try {
      const response = await fetch(
        `${CountryConfig[this.defaultCountry].url}/suggest/${encodeURIComponent(
          term,
        )}`,
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = (await response.json()) as { suggestions: string[] };
      return data.suggestions || [];
    } catch (error) {
      console.error('Error getting autocomplete suggestions:', error);
      return [];
    }
  }

  /**
   * Get product categories
   * @returns Promise with categories
   */
  async getCategories(): Promise<any> {
    try {
      const response = await fetch(
        `${CountryConfig[this.defaultCountry].url}/categories.json`,
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  /**
   * Get product brands
   * @returns Promise with brands
   */
  async getBrands(): Promise<any> {
    try {
      const response = await fetch(
        `${CountryConfig[this.defaultCountry].url}/brands.json`,
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching brands:', error);
      throw error;
    }
  }
}

export default new OpenFoodFactsService();
