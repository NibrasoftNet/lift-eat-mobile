import { CuisineTypeEnum, MealTypeEnum, MealUnitEnum } from '../enum/meal.enum';
import { ImageSourcePropType } from 'react-native';
import { Ingredients, Meal } from '../../types/plan.type';
import SearchCacheService from '../services/SearchCacheService';

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
  page?: number;
  page_size?: number;
  sort_by?: string;
  countries?: string | string[];
  _timestamp?: string;
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
  private static readonly BASE_URL = 'https://world.openfoodfacts.org';
  private static readonly USER_AGENT = 'LiftEatMobile/1.0 (mobile-app@nibrasoftnet.fr)';
  private static readonly SEARCH_FIELDS = 'code,product_name,product_name_fr,brands,categories,image_url,image_small_url,image_front_url,nutriscore_grade,nutriments';

  /**
   * Recherche de produits avec gestion avancée des erreurs et retry
   * Cette méthode utilise l'ancienne API qui est plus fiable
   */
  static async searchProducts(
    params: SearchParams
  ): Promise<{ products: Product[]; count: number }> {
    try {
      console.log('🔎 [OpenFoodFacts] Début recherche avec les paramètres:', JSON.stringify(params));
      
      // Normaliser les paramètres de recherche
      const searchTerms = params.search_terms ? params.search_terms.trim() : '';
      const page = params.page || 1;
      const pageSize = params.page_size || 20;
      const sortBy = params.sort_by || 'popularity';
      
      if (searchTerms) {
        console.log(`🔤 [OpenFoodFacts] Recherche du terme: "${searchTerms}"`);
      }
      
      console.log(`📄 [OpenFoodFacts] Page: ${page}`);
      console.log(`📏 [OpenFoodFacts] Éléments par page: ${pageSize}`);
      
      if (sortBy) {
        console.log(`🔃 [OpenFoodFacts] Tri par: ${sortBy}`);
      }

      // NOUVELLE APPROCHE: Utiliser directement l'API de recherche par terme avec une URL simple
      // Cette approche est plus directe et plus fiable
      const timestamp = Date.now();
      let url = `${this.BASE_URL}/cgi/search.pl?search_simple=1&action=process&json=1`;
      
      // Ajouter les paramètres de recherche
      if (searchTerms && searchTerms.length > 0) {
        url += `&search_terms=${encodeURIComponent(searchTerms)}`;
      }
      
      // Pagination
      url += `&page=${page}&page_size=${pageSize}`;
      
      // Champs à récupérer
      url += `&fields=${this.SEARCH_FIELDS}`;
      
      // Rendre le filtre par pays optionnel pour obtenir plus de résultats
      const countries = params.countries;
      if (countries) {
        console.log(`🌍 [OpenFoodFacts] Filtre par pays: ${countries}`);
        if (Array.isArray(countries)) {
          url += `&tagtype_0=countries&tag_contains_0=contains&tag_0=${encodeURIComponent(countries.join('|'))}`;
        } else {
          url += `&tagtype_0=countries&tag_contains_0=contains&tag_0=${encodeURIComponent(countries)}`;
        }
      } else {
        console.log(`🌍 [OpenFoodFacts] Aucun filtre de pays appliqué`);
      }
      
      // Ajouter un paramètre timestamp pour éviter tout cache
      url += `&_=${timestamp}`;
      
      console.log(`🌐 [OpenFoodFacts] URL de recherche finale: ${url}`);

      // Appliquer une stratégie de retry avec délai exponentiel
      let retries = 0;
      const maxRetries = 3;
      let lastError;
      
      while (retries < maxRetries) {
        try {
          // Ajouter des en-têtes pour désactiver le cache à tous les niveaux
          const response = await fetch(url, { 
            method: 'GET',
            headers: { 
              'User-Agent': this.USER_AGENT,
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            }
          });
          
          if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
          }
          
          const data = await response.json();
          
          // Vérification supplémentaire pour s'assurer que les données sont pertinentes
          const count = data.count || 0;
          const products = data.products || [];
          
          console.log(`✅ [OpenFoodFacts] Réponse reçue avec ${products.length} produits sur ${count} au total`);
          if (products.length > 0) {
            console.log(`📦 [OpenFoodFacts] Premier produit: ${products[0]?.product_name || 'Sans nom'}`);
          }
          
          return { products, count };
        } catch (error) {
          lastError = error;
          console.error(`❌ [OpenFoodFacts] Erreur lors de la tentative ${retries + 1}/${maxRetries}:`, error);
          
          // Attendre avant de réessayer (délai exponentiel)
          const delay = 1000 * Math.pow(2, retries);
          await new Promise(resolve => setTimeout(resolve, delay));
          
          retries++;
        }
      }
      
      // Si toutes les tentatives ont échoué
      console.error(`❌ [OpenFoodFacts] Échec après ${maxRetries} tentatives`);
      throw lastError;
    } catch (error) {
      console.error(`❌ [OpenFoodFacts] Erreur lors de la recherche de produits:`, error);
      throw error;
    }
  }

  /**
   * Get a product by barcode
   * Méthode pour obtenir un produit par son code-barres
   */
  static async getProductByBarcode(barcode: string): Promise<Product> {
    try {
      console.log(`🔍 [OpenFoodFacts] Recherche du produit avec code-barres: ${barcode}`);
      
      const url = `${this.BASE_URL}/api/v0/product/${barcode}.json?_=${Date.now()}`;
      console.log(`🌐 [OpenFoodFacts] URL de recherche du produit: ${url}`);
      
      // Appliquer une stratégie de retry avec délai exponentiel
      let retries = 0;
      const maxRetries = 3;
      let lastError;
      
      while (retries < maxRetries) {
        try {
          // Ajouter des en-têtes pour désactiver le cache à tous les niveaux
          const response = await fetch(url, { 
            method: 'GET', 
            headers: { 
              'User-Agent': this.USER_AGENT,
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            }
          });
          
          if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
          }
          
          const data = await response.json();
          
          if (data.status === 0) {
            throw new Error(`Product not found: ${data.status_verbose}`);
          }
          
          console.log(`✅ [OpenFoodFacts] Produit trouvé: ${data.product?.product_name || 'Sans nom'}`);
          
          const product = data.product || {};
          
          return product;
        } catch (error) {
          lastError = error;
          console.error(`❌ [OpenFoodFacts] Erreur lors de la tentative ${retries + 1}/${maxRetries}:`, error);
          
          // Attendre avant de réessayer (délai exponentiel)
          const delay = 1000 * Math.pow(2, retries);
          await new Promise(resolve => setTimeout(resolve, delay));
          
          retries++;
        }
      }
      
      // Si toutes les tentatives ont échoué
      console.error(`❌ [OpenFoodFacts] Échec après ${maxRetries} tentatives pour le produit: ${barcode}`);
      throw lastError;
    } catch (error) {
      console.error(`❌ [OpenFoodFacts] Erreur lors de la récupération du produit ${barcode}:`, error);
      throw error;
    }
  }

  /**
   * Get nutriments for filtering
   * Méthode de compatibilité avec l'ancienne API
   */
  static async getNutriments(): Promise<any> {
    try {
      console.log('🔍 [OpenFoodFacts] Récupération des nutriments');
      
      // En attendant que l'API soit disponible, on utilise une liste prédéfinie
      return {
        tags: [
          { id: 'proteins', name: 'Protéines' },
          { id: 'fat', name: 'Matières grasses' },
          { id: 'carbs', name: 'Glucides' },
          { id: 'sugar', name: 'Sucre' },
          { id: 'fiber', name: 'Fibres' },
          { id: 'salt', name: 'Sel' },
          { id: 'calcium', name: 'Calcium' },
          { id: 'iron', name: 'Fer' },
          { id: 'vitamin-a', name: 'Vitamine A' },
          { id: 'vitamin-c', name: 'Vitamine C' },
          { id: 'vitamin-d', name: 'Vitamine D' },
          { id: 'vitamin-e', name: 'Vitamine E' },
          { id: 'calories-high', name: 'Calories élevées' },
          { id: 'calories-medium', name: 'Calories moyennes' },
          { id: 'calories-low', name: 'Calories faibles' },
          { id: 'protein-high', name: 'Riche en protéines' },
          { id: 'carbs-high', name: 'Riche en glucides' },
          { id: 'fat-high', name: 'Riche en lipides' },
          { id: 'fiber-high', name: 'Riche en fibres' },
          { id: 'organic', name: 'Bio' }
        ]
      };
    } catch (error) {
      console.error('❌ [OpenFoodFacts] Erreur lors de la récupération des nutriments:', error);
      return {
        tags: [
          { id: 'proteins', name: 'Protéines' },
          { id: 'fat', name: 'Matières grasses' },
          { id: 'carbs', name: 'Glucides' },
          { id: 'sugar', name: 'Sucre' },
          { id: 'fiber', name: 'Fibres' }
        ]
      };
    }
  }

  /**
   * Get allergens for filtering
   * Méthode de compatibilité avec l'ancienne API
   */
  static async getAllergens(): Promise<any> {
    try {
      console.log('🔍 [OpenFoodFacts] Récupération des allergènes');
      
      return {
        tags: [
          { id: 'gluten', name: 'Gluten' },
          { id: 'milk', name: 'Lait' },
          { id: 'eggs', name: 'Œufs' },
          { id: 'nuts', name: 'Fruits à coque' },
          { id: 'peanuts', name: 'Arachides' },
          { id: 'soybeans', name: 'Soja' },
          { id: 'fish', name: 'Poisson' },
          { id: 'shellfish', name: 'Crustacés' },
          { id: 'molluscs', name: 'Mollusques' },
          { id: 'celery', name: 'Céleri' },
          { id: 'mustard', name: 'Moutarde' },
          { id: 'sesame', name: 'Sésame' },
          { id: 'sulphites', name: 'Sulfites' },
          { id: 'lupin', name: 'Lupin' },
          { id: 'lactose', name: 'Lactose' },
          { id: 'fructose', name: 'Fructose' },
          { id: 'glucose', name: 'Glucose' },
          { id: 'without-gluten', name: 'Sans gluten' },
          { id: 'without-lactose', name: 'Sans lactose' },
          { id: 'vegan', name: 'Végan' }
        ]
      };
    } catch (error) {
      console.error('❌ [OpenFoodFacts] Erreur lors de la récupération des allergènes:', error);
      return {
        tags: [
          { id: 'gluten', name: 'Gluten' },
          { id: 'milk', name: 'Lait' },
          { id: 'eggs', name: 'Œufs' },
          { id: 'nuts', name: 'Fruits à coque' },
          { id: 'peanuts', name: 'Arachides' }
        ]
      };
    }
  }
}

// Exporter la classe pour maintenir la compatibilité avec le code existant
export default OpenFoodFactsService;
