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
  lang?: string; // Ajout du paramètre de langue
  tag?: string; // Ajout du paramètre de tag pour filtrer par cuisine
}

/**
 * Information about a product necessary for display in the scanner
 */
export interface ProductResult {
  name: string;
  image: ImageSourcePropType | null;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
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
          productResult: null,
        };
      }

      const product = await this.getProductByBarcode(barcode);

      if (!product) {
        return {
          isValid: false,
          message: `Le produit avec le code-barres "${barcode}" n'a pas été trouvé . Essayez un autre produit ou vérifiez que le code-barres est correct.`,
          productResult: null,
        };
      }

      // Convert product to productResult format
      const productResult = this.convertProductToProductResult(product);

      // Check if productResult is null (this happens when all nutritional values are 0)
      if (!productResult) {
        return {
          isValid: false,
          message: `Le produit "${product.product_name || 'sans nom'}" (code-barres: ${barcode}) a été trouvé mais toutes les valeurs nutritionnelles sont à zéro. Essayez un autre produit.`,
          productResult: null,
        };
      }

      return {
        isValid: true,
        message: 'Produit trouvé avec succès',
        productResult,
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

    // Calculate nutrition values, defaulting to 0 if not available
    const calories = Math.round(product.nutriments?.energy_100g || 0);
    const proteins = Math.round(product.nutriments?.proteins_100g || 0);
    const carbs = Math.round(product.nutriments?.carbohydrates_100g || 0);
    const fats = Math.round(product.nutriments?.fat_100g || 0);

    // Return null if ALL nutrition values are 0
    if (calories === 0 && proteins === 0 && carbs === 0 && fats === 0) {
      console.log('All nutrition values are 0 for product:', product.code);
      return null;
    }

    // Get product image URL
    let productImage: ImageSourcePropType | null = require('../../assets/images/image-non-disponible.jpg');

    // Check for product images in priority order
    if (product.image_url) {
      productImage = { uri: product.image_url };
    } else if (product.image_front_url) {
      productImage = { uri: product.image_front_url };
    } else if (product.image_small_url) {
      productImage = { uri: product.image_small_url };
    }

    // Return a simplified object with product information
    return {
      name: product.product_name || 'Produit sans nom',
      image: productImage,
      calories: calories,
      protein: proteins,
      carbs: carbs,
      fats: fats,
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
  async searchProducts(
    params: SearchParams,
  ): Promise<OpenFoodFactsResponse | null> {
    try {
      // Construct URL with query parameters
      const url = new URL(`${this.baseUrl}/search`);

      // Add fields parameter with all needed fields
      url.searchParams.append(
        'fields',
        'code,product_name,product_name_fr,brands,categories,image_url,image_small_url,image_front_url,nutriscore_grade,nutriments,serving_size,ingredients_text,allergens,labels,stores',
      );

      // Créer une nouvelle copie des paramètres pour éviter de modifier l'original
      let searchParams = { ...params };

      // Set default language to french if not specified
      if (!searchParams.lang) {
        searchParams.lang = 'fr';
      }

      // Ajout d'un paramètre pour obtenir plus de résultats
      if (!searchParams.page_size) {
        searchParams.page_size = 50;
      }

      // Gérer le tag de cuisine plus directement
      let tagAdded = false;
      if (searchParams.tag) {
        console.log(`Filtrage par cuisine: ${searchParams.tag}`);

        // Ajouter des termes spécifiques à la recherche selon la cuisine
        switch (searchParams.tag.toLowerCase()) {
          case 'african':
            if (searchParams.search_terms) {
              searchParams.search_terms += ' african';
            } else {
              searchParams.search_terms = 'african food';
            }
            url.searchParams.append('tagtype_0', 'origins');
            url.searchParams.append('tag_contains_0', 'contains');
            url.searchParams.append('tag_0', 'africa');
            tagAdded = true;
            break;
          case 'asian':
            if (searchParams.search_terms) {
              searchParams.search_terms += ' asian';
            } else {
              searchParams.search_terms = 'asian food';
            }
            url.searchParams.append('tagtype_0', 'origins');
            url.searchParams.append('tag_contains_0', 'contains');
            url.searchParams.append('tag_0', 'asia');
            tagAdded = true;
            break;
          case 'european':
            if (searchParams.search_terms) {
              searchParams.search_terms += ' european';
            } else {
              searchParams.search_terms = 'european food';
            }
            url.searchParams.append('tagtype_0', 'origins');
            url.searchParams.append('tag_contains_0', 'contains');
            url.searchParams.append('tag_0', 'europe');
            tagAdded = true;
            break;
          case 'caribbean':
            if (searchParams.search_terms) {
              searchParams.search_terms += ' caribbean';
            } else {
              searchParams.search_terms = 'caribbean food';
            }
            url.searchParams.append('tagtype_0', 'origins');
            url.searchParams.append('tag_contains_0', 'contains');
            url.searchParams.append('tag_0', 'caribbean');
            tagAdded = true;
            break;
          case 'tunisian':
            if (searchParams.search_terms) {
              searchParams.search_terms += ' tunisian';
            } else {
              searchParams.search_terms = 'tunisian food';
            }
            url.searchParams.append('tagtype_0', 'origins');
            url.searchParams.append('tag_contains_0', 'contains');
            url.searchParams.append('tag_0', 'tunisia');
            tagAdded = true;
            break;
          case 'qatari':
            if (searchParams.search_terms) {
              searchParams.search_terms += ' qatar';
            } else {
              searchParams.search_terms = 'qatar food';
            }
            url.searchParams.append('tagtype_0', 'origins');
            url.searchParams.append('tag_contains_0', 'contains');
            url.searchParams.append('tag_0', 'middle-east');
            tagAdded = true;
            break;
          case 'american':
            if (searchParams.search_terms) {
              searchParams.search_terms += ' american';
            } else {
              searchParams.search_terms = 'american food';
            }
            url.searchParams.append('tagtype_0', 'origins');
            url.searchParams.append('tag_contains_0', 'contains');
            url.searchParams.append('tag_0', 'united-states');
            tagAdded = true;
            break;
          case 'chinese':
            if (searchParams.search_terms) {
              searchParams.search_terms += ' chinese';
            } else {
              searchParams.search_terms = 'chinese food';
            }
            url.searchParams.append('tagtype_0', 'origins');
            url.searchParams.append('tag_contains_0', 'contains');
            url.searchParams.append('tag_0', 'china');
            tagAdded = true;
            break;
          case 'french':
            if (searchParams.search_terms) {
              searchParams.search_terms += ' french';
            } else {
              searchParams.search_terms = 'french food';
            }
            url.searchParams.append('tagtype_0', 'origins');
            url.searchParams.append('tag_contains_0', 'contains');
            url.searchParams.append('tag_0', 'france');
            tagAdded = true;
            break;
          case 'indian':
            if (searchParams.search_terms) {
              searchParams.search_terms += ' indian';
            } else {
              searchParams.search_terms = 'indian food';
            }
            url.searchParams.append('tagtype_0', 'origins');
            url.searchParams.append('tag_contains_0', 'contains');
            url.searchParams.append('tag_0', 'india');
            tagAdded = true;
            break;
          case 'italian':
            if (searchParams.search_terms) {
              searchParams.search_terms += ' italian';
            } else {
              searchParams.search_terms = 'italian food';
            }
            url.searchParams.append('tagtype_0', 'origins');
            url.searchParams.append('tag_contains_0', 'contains');
            url.searchParams.append('tag_0', 'italy');
            tagAdded = true;
            break;
          case 'japanese':
            if (searchParams.search_terms) {
              searchParams.search_terms += ' japanese';
            } else {
              searchParams.search_terms = 'japanese food';
            }
            url.searchParams.append('tagtype_0', 'origins');
            url.searchParams.append('tag_contains_0', 'contains');
            url.searchParams.append('tag_0', 'japan');
            tagAdded = true;
            break;
          case 'mexican':
            if (searchParams.search_terms) {
              searchParams.search_terms += ' mexican';
            } else {
              searchParams.search_terms = 'mexican food';
            }
            url.searchParams.append('tagtype_0', 'origins');
            url.searchParams.append('tag_contains_0', 'contains');
            url.searchParams.append('tag_0', 'mexico');
            tagAdded = true;
            break;
        }

        // Supprimer le tag des paramètres pour éviter duplication
        const { tag, ...otherParams } = searchParams;
        searchParams = otherParams as SearchParams;
      }

      // Si aucun tag n'a été ajouté et que nous avons un terme de recherche, utiliser categories comme fallback
      if (!tagAdded && searchParams.search_terms) {
        // Utiliser categories comme fallback
        url.searchParams.append('tagtype_0', 'categories');
        url.searchParams.append('tag_contains_0', 'contains');
        url.searchParams.append('tag_0', searchParams.search_terms);
      }

      // Add all other parameters
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, value.toString());
        }
      });

      console.log('Recherche de produits avec URL:', url.toString());

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = (await response.json()) as OpenFoodFactsResponse;

      // Log search results count
      if (data && data.products) {
        console.log(
          `Trouvé ${data.products.length} produits pour la recherche: ${searchParams.search_terms} ${params.tag ? `avec cuisine ${params.tag}` : ''}`,
        );
      }

      return data;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
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
        throw new Error(`Erreur API: ${response.status}`);
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
        const calories = Math.round(product.nutriments?.energy_100g || 0);
        const protein = Math.round(product.nutriments?.proteins_100g || 0);
        const carbs = Math.round(product.nutriments?.carbohydrates_100g || 0);
        const fats = Math.round(product.nutriments?.fat_100g || 0);

        return {
          name,
          image,
          calories,
          protein,
          carbs,
          fats,
          brands: product.brands,
          categories: product.categories,
          nutriscore_grade: product.nutriscore_grade,
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
        `${this.baseUrl}/suggest/${encodeURIComponent(term)}`,
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
