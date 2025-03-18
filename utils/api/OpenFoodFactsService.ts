import { CuisineTypeEnum, MealTypeEnum, MealUnitEnum } from '../enum/meal.enum';
import { ImageSourcePropType } from 'react-native';
import { Ingredients, Meal } from '../../types/plan.type';

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
  countries?: string;
  page?: number;
  page_size?: number;
  sort_by?: string;
}

/**
 * Result of a barcode scan validation
 */
export interface ScanResult {
  isValid: boolean;
  message: string;
  product: Product | null;
  ingredient: Ingredients | null;
}

/**
 * Service to interact with Open Food Facts API
 */
class OpenFoodFactsService {
  private baseUrl: string = 'https://world.openfoodfacts.org/api/v2';

  /**
   * Get product by barcode
   * @param barcode The product barcode
   * @returns Promise with product data
   */
  async getProductByBarcode(barcode: string): Promise<Product | null> {
    try {
      // Validate barcode format (basic validation)
      if (!barcode || barcode.trim() === '') {
        throw new Error('Invalid barcode format');
      }

      const response = await fetch(`${this.baseUrl}/product/${barcode}.json`);

      if (response.status === 404) {
        console.log(`Product with barcode ${barcode} not found`);
        return null; // Return null for 404 instead of throwing error
      }

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = (await response.json()) as OpenFoodFactsResponse;

      if (data.status === 1 && data.product) {
        return data.product;
      }

      return null;
    } catch (error) {
      console.error('Error fetching product by barcode:', error);
      throw error;
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
          message: 'Code-barres invalide ou vide',
          product: null,
          ingredient: null,
        };
      }

      const product = await this.getProductByBarcode(barcode);

      if (!product) {
        return {
          isValid: false,
          message: `Le produit avec le code-barres "${barcode}" n'a pas été trouvé dans la base de données Open Food Facts. Essayez un autre produit ou vérifiez que le code-barres est correct.`,
          product: null,
          ingredient: null,
        };
      }

      // Convert product to ingredient format
      const ingredient = this.convertProductToIngredient(product);

      return {
        isValid: true,
        message: 'Produit trouvé avec succès',
        product,
        ingredient,
      };
    } catch (error) {
      console.error('Error during barcode scan:', error);

      // Provide more informative error message based on error type
      let errorMessage = 'Erreur lors de la recherche du produit';

      if (error instanceof Error) {
        if (error.message.includes('404')) {
          errorMessage = 'Produit non trouvé dans la base de données';
        } else if (error.message.includes('network')) {
          errorMessage =
            'Erreur de connexion réseau. Vérifiez votre connexion internet.';
        }
      }

      return {
        isValid: false,
        message: errorMessage,
        product: null,
        ingredient: null,
      };
    }
  }

  /**
   * Converts an Open Food Facts product to an ingredient format for the app
   * @param product The product from Open Food Facts
   * @returns An ingredient object compatible with the app
   */
  convertProductToIngredient(product: Product): Ingredients {
    // Calculate nutrition values, defaulting to 0 if not available
    const calories = Math.round(product.nutriments?.energy_100g || 0);
    const proteins = Math.round(product.nutriments?.proteins_100g || 0);
    const carbs = Math.round(product.nutriments?.carbohydrates_100g || 0);
    const fats = Math.round(product.nutriments?.fat_100g || 0);

    // Create ingredient from product
    const ingredient: Ingredients = {
      id: parseInt(product.code) || Math.floor(Math.random() * 100000),
      name: product.product_name || 'Produit sans nom',
      calories: calories,
      protein: proteins,
      carbs: carbs,
      fat: fats,
      quantity: 1,
      unit: product.serving_size ? 'portion' : 'grammes',
    };

    return ingredient;
  }

  /**
   * Search products based on various criteria
   * @param params Search parameters
   * @returns Promise with search results
   */
  async searchProducts(
    params: SearchParams,
  ): Promise<OpenFoodFactsResponse | null> {
    try {
      console.log('🔎 [OpenFoodFacts] Début recherche avec les paramètres:', JSON.stringify(params));
      
      // Nouvelle approche: utiliser l'API v0 d'OpenFoodFacts qui est la plus stable
      const url = new URL(`https://world.openfoodfacts.org/cgi/search.pl`);

      // Paramètres pour le format JSON
      url.searchParams.append('json', '1');
      url.searchParams.append('action', 'process');
      
      // Ajouter tous les champs dont nous avons besoin
      url.searchParams.append(
        'fields',
        'code,product_name,product_name_fr,brands,categories,image_url,image_small_url,image_front_url,nutriscore_grade,nutriments',
      );

      // Configurer la recherche pour OpenFoodFacts avec une approche plus directe
      if (params.search_terms) {
        const searchTerm = params.search_terms.trim();
        
        // Utiliser search_terms directement (meilleure compatibilité)
        url.searchParams.append('search_terms', searchTerm);
        
        console.log(`🔤 [OpenFoodFacts] Recherche du terme: "${searchTerm}"`);
      } else {
        console.log('⚠️ [OpenFoodFacts] Aucun terme de recherche spécifié');
      }

      // Ajouter les filtres si nécessaire
      if (params.brands) {
        url.searchParams.append('tagtype_0', 'brands');
        url.searchParams.append('tag_contains_0', 'contains');
        url.searchParams.append('tag_0', params.brands);
        console.log(`🏷️ [OpenFoodFacts] Filtrage par marque: "${params.brands}"`);
      }
      
      if (params.categories) {
        const tagIndex = params.brands ? 1 : 0;
        url.searchParams.append(`tagtype_${tagIndex}`, 'categories');
        url.searchParams.append(`tag_contains_${tagIndex}`, 'contains');
        url.searchParams.append(`tag_${tagIndex}`, params.categories);
        console.log(`🏷️ [OpenFoodFacts] Filtrage par catégorie: "${params.categories}"`);
      }

      // Pagination
      if (params.page) {
        url.searchParams.append('page', params.page.toString());
        console.log(`📄 [OpenFoodFacts] Page: ${params.page}`);
      }
      
      if (params.page_size) {
        url.searchParams.append('page_size', params.page_size.toString());
        console.log(`📏 [OpenFoodFacts] Éléments par page: ${params.page_size}`);
      }
      
      // Tri
      if (params.sort_by) {
        url.searchParams.append('sort_by', params.sort_by);
        console.log(`🔃 [OpenFoodFacts] Tri par: ${params.sort_by}`);
      }

      console.log('🌐 [OpenFoodFacts] URL de recherche finale:', url.toString());

      const response = await fetch(url.toString());

      if (!response.ok) {
        console.error(`❌ [OpenFoodFacts] Erreur HTTP: ${response.status} ${response.statusText}`);
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = (await response.json()) as OpenFoodFactsResponse;
      console.log(`✅ [OpenFoodFacts] Réponse reçue avec ${data.products?.length || 0} produits sur ${data.count || 0} au total`);
      
      // Filtrer les résultats côté client pour garantir la pertinence
      if (data.products && params.search_terms) {
        const searchTermLower = params.search_terms.toLowerCase();
        console.log(`🔍 [OpenFoodFacts] Vérification de la pertinence des résultats pour: "${searchTermLower}"`);
        
        const filteredProducts = data.products.filter(product => {
          const productName = (product.product_name || '').toLowerCase();
          const productNameFr = (product.product_name_fr || '').toLowerCase();
          const brands = (product.brands || '').toLowerCase();
          
          const isRelevant = 
            productName.includes(searchTermLower) || 
            productNameFr.includes(searchTermLower) || 
            brands.includes(searchTermLower);
            
          if (isRelevant) {
            console.log(`✓ [OpenFoodFacts] Produit pertinent trouvé: ${product.product_name || 'Sans nom'}`);
          }
          
          return isRelevant;
        });
        
        console.log(`📊 [OpenFoodFacts] Produits avant filtrage: ${data.products.length}, après: ${filteredProducts.length}`);
        
        // Si nous avons des résultats pertinents, utilisons-les
        if (filteredProducts.length > 0) {
          data.products = filteredProducts;
          // Mettre à jour le nombre total également
          if (data.count) data.count = filteredProducts.length;
        } else {
          console.log(`⚠️ [OpenFoodFacts] Aucun produit pertinent trouvé, conservation des résultats d'origine`);
          
          // Afficher les détails des produits pour déboguer
          data.products.forEach((product, index) => {
            console.log(`📦 [OpenFoodFacts] Produit original ${index+1}:`);
            console.log(`  Nom: ${product.product_name || 'N/A'}`);
            console.log(`  Nom FR: ${product.product_name_fr || 'N/A'}`);
            console.log(`  Marque: ${product.brands || 'N/A'}`);
            console.log(`  Catégories: ${product.categories || 'N/A'}`);
          });
        }
      }
      
      return data;
    } catch (error) {
      console.error('❌ [OpenFoodFacts] Erreur lors de la recherche:', error);
      throw error;
    }
  }

  /**
   * Get suggestions for autocomplete
   * @param term Search term to get suggestions for
   * @returns Promise with suggestions
   */
  async getAutocompleteSuggestions(term: string): Promise<string[]> {
    try {
      console.log(`🔎 [OpenFoodFacts] Recherche de suggestions pour: "${term}"`);
      
      // Si le terme est trop court, retourner un tableau vide au lieu de faire un appel API
      if (!term || term.length < 2) {
        console.log('⚠️ [OpenFoodFacts] Terme de recherche trop court pour l\'autocomplétion');
        return [];
      }
      
      // Essayer avec l'ancienne API de suggestions
      try {
        console.log(`🌐 [OpenFoodFacts] Appel API suggestions: ${this.baseUrl}/suggest/${encodeURIComponent(term)}`);
        const response = await fetch(
          `${this.baseUrl}/suggest/${encodeURIComponent(term)}`,
        );

        if (!response.ok) {
          console.error(`❌ [OpenFoodFacts] Erreur API suggestions: ${response.status} ${response.statusText}`);
          throw new Error(`Suggestion API request failed with status ${response.status}`);
        }

        const data = (await response.json()) as { suggestions: string[] };
        console.log(`✅ [OpenFoodFacts] ${data.suggestions?.length || 0} suggestions reçues`);
        return data.suggestions || [];
      } catch (error) {
        console.log('⚠️ [OpenFoodFacts] Repli sur l\'API de recherche pour les suggestions');
        // En cas d'échec, faire une recherche simple et extraire les noms de produits
        const searchParams: SearchParams = {
          search_terms: term,
          page: 1,
          page_size: 5
        };
        
        console.log(`🔄 [OpenFoodFacts] Utilisation de searchProducts comme fallback`);
        const searchResults = await this.searchProducts(searchParams);
        
        if (searchResults && searchResults.products && searchResults.products.length > 0) {
          // Extraire les noms de produits uniques
          const suggestions = searchResults.products
            .map(product => product.product_name || '')
            .filter(name => name.length > 0)
            .slice(0, 5); // Limiter à 5 suggestions
            
          const uniqueSuggestions = [...new Set(suggestions)]; // Éliminer les doublons
          console.log(`✅ [OpenFoodFacts] ${uniqueSuggestions.length} suggestions générées via recherche`);
          return uniqueSuggestions;
        }
        
        console.log('⚠️ [OpenFoodFacts] Aucune suggestion trouvée via la recherche');
        return [];
      }
    } catch (error) {
      console.error('❌ [OpenFoodFacts] Erreur récupération suggestions:', error);
      return [];
    }
  }

  /**
   * Get product categories
   * @returns Promise with categories
   */
  async getCategories(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/categories.json`);

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
      const response = await fetch(`${this.baseUrl}/brands.json`);

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
