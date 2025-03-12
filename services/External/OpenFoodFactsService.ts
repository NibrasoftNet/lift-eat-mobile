import { Meal, Ingredients } from '@/types/plan.type';
import { CuisineTypeEnum, MealTypeEnum, MealUnitEnum } from '@/utils/enum/meal.enum';
import { ImageSourcePropType } from 'react-native';

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
  meal: Meal | null;
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
      
      const data = await response.json() as OpenFoodFactsResponse;
      
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
          message: "Code-barres invalide ou vide",
          product: null,
          meal: null
        };
      }
      
      const product = await this.getProductByBarcode(barcode);
      
      if (!product) {
        return {
          isValid: false,
          message: `Le produit avec le code-barres "${barcode}" n'a pas été trouvé dans la base de données Open Food Facts. Essayez un autre produit ou vérifiez que le code-barres est correct.`,
          product: null,
          meal: null
        };
      }
      
      // Convert product to meal format
      const meal = this.convertProductToMeal(product);
      
      return {
        isValid: true,
        message: "Produit trouvé avec succès",
        product,
        meal
      };
    } catch (error) {
      console.error('Error during barcode scan:', error);
      
      // Provide more informative error message based on error type
      let errorMessage = "Erreur lors de la recherche du produit";
      
      if (error instanceof Error) {
        if (error.message.includes('404')) {
          errorMessage = "Produit non trouvé dans la base de données";
        } else if (error.message.includes('network')) {
          errorMessage = "Erreur de connexion réseau. Vérifiez votre connexion internet.";
        }
      }
      
      return {
        isValid: false,
        message: errorMessage,
        product: null,
        meal: null
      };
    }
  }
  
  /**
   * Converts an Open Food Facts product to the app's meal format
   * @param product The product from Open Food Facts
   * @returns A meal object compatible with the app
   */
  convertProductToMeal(product: Product): Meal {
    // Calculate nutrition values, defaulting to 0 if not available
    const calories = Math.round(product.nutriments?.energy_100g || 0);
    const proteins = Math.round(product.nutriments?.proteins_100g || 0);
    const carbs = Math.round(product.nutriments?.carbohydrates_100g || 0);
    const fats = Math.round(product.nutriments?.fat_100g || 0);
    
    // Get product image URL
    let productImage: ImageSourcePropType | null = null;
    
    // Default image as fallback
    const defaultImage: ImageSourcePropType = require('@/assets/images/Meals/téléchargement.jpg');
    
    // Check for product images in priority order
    if (product.image_url) {
      productImage = { uri: product.image_url };
    } else if (product.image_front_url) {
      productImage = { uri: product.image_front_url };
    } else if (product.image_small_url) {
      productImage = { uri: product.image_small_url };
    } else {
      productImage = defaultImage;
    }
    
    // Create ingredient from product
    const ingredient: Ingredients = {
      id: parseInt(product.code) || Math.floor(Math.random() * 100000),
      name: product.product_name || "Produit sans nom",
      calories: calories,
      protein: proteins,
      carbs: carbs,
      fats: fats,
      quantity: 1,
      unit: "portion"
    };
    
    // Generate a meal object compatible with the app's structure
    const meal: Meal = {
      id: parseInt(product.code) || Math.floor(Math.random() * 100000),
      name: product.product_name || "Produit sans nom",
      image: productImage, // Use product image URL or default
      type: MealTypeEnum.SNACK, // Default type, can be changed by user
      calories: calories,
      protein: proteins,
      carbs: carbs,
      fats: fats,
      cuisineType: CuisineTypeEnum.GENERAL,
      unit: MealUnitEnum.SERVING,
      quantity: 1,
      ingredients: [ingredient]
    };
    
    return meal;
  }
  
  /**
   * Search products based on various criteria
   * @param params Search parameters
   * @returns Promise with search results
   */
  async searchProducts(params: SearchParams): Promise<OpenFoodFactsResponse | null> {
    try {
      // Construct URL with query parameters
      const url = new URL(`${this.baseUrl}/search`);
      
      // Add fields parameter
      url.searchParams.append('fields', 'code,product_name,product_name_fr,brands,categories,image_url,image_small_url,image_front_url,nutriscore_grade,nutriments');
      
      // Add all other parameters
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, value.toString());
        }
      });
      
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json() as OpenFoodFactsResponse;
      return data;
    } catch (error) {
      console.error('Error searching products:', error);
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
      const response = await fetch(`${this.baseUrl}/suggest/${encodeURIComponent(term)}`);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json() as { suggestions: string[] };
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
