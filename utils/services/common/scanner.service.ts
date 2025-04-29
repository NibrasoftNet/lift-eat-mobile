import OpenFoodFactsService, { 
  ScanResult, 
  ProductResult, 
  SearchParams,
  Product
} from '@/utils/api/OpenFoodFactsService';
import { CuisineTypeEnum, CountryTypeEnum, CountryConfig } from '@/utils/enum/meal.enum';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

/**
 * Interface étendue pour les produits avec des propriétés additionnelles nécessaires
 * pour les fonctionnalités du scannerService
 */
interface ExtendedProductResult extends ProductResult {
  origins_tags?: string[];
  categories_tags?: string[];
  nutriments?: {
    'energy-kcal_100g'?: number;
    'energy-kj_100g'?: number;
    proteins_100g?: number;
    fat_100g?: number;
    carbohydrates_100g?: number;
  };
}

/**
 * Service responsable de la gestion des fonctionnalités de scan et de recherche 
 * via l'API OpenFoodFacts.
 */
class ScannerService {
  private cachedProducts: Map<string, ExtendedProductResult> = new Map();
  private lastSearchParams: SearchParams | null = null;
  private lastSearchResults: ExtendedProductResult[] | null = null;

  /**
   * Initialise le service Scanner.
   */
  constructor() {
    logger.info(LogCategory.INTEGRATION, 'Scanner service initialized');
  }

  /**
   * Scanne un code-barres et récupère les informations du produit.
   * @param barcodeData Le code-barres scanné
   * @returns Résultat du scan avec les informations du produit ou un message d'erreur
   */
  async scanBarcode(barcodeData: string): Promise<ScanResult> {
    try {
      logger.info(LogCategory.INTEGRATION, 'Scanning barcode', { barcodeData });
      
      // Utiliser le service OpenFoodFacts pour scanner le code-barres
      const scanResult = await OpenFoodFactsService.scanBarcode(barcodeData);
      
      // Mettre en cache le produit s'il est valide
      if (scanResult.isValid && scanResult.productResult) {
        this.cachedProducts.set(barcodeData, scanResult.productResult as ExtendedProductResult);
      }
      
      return scanResult;
    } catch (error) {
      logger.error(LogCategory.INTEGRATION, 'Error scanning barcode', { error, barcodeData });
      return {
        isValid: false,
        message: `Erreur lors du scan: ${error instanceof Error ? error.message : String(error)}`,
        productResult: null
      };
    }
  }
  
  /**
   * Recherche des produits dans l'API OpenFoodFacts.
   * @param searchParams Paramètres de recherche
   * @returns Liste des produits correspondants
   */
  async searchProducts(searchParams: SearchParams): Promise<ExtendedProductResult[]> {
    try {
      
      logger.info(LogCategory.INTEGRATION, 'Searching products', { searchParams });
      
      // Obtenir les produits de l'API et faire un cast vers ExtendedProductResult
      const apiProducts = await OpenFoodFactsService.searchProducts(searchParams);
      
      // Convertir les produits en ExtendedProductResult
      const results: ExtendedProductResult[] = apiProducts.map(product => {
        return {
          name: product.product_name || '',
          image: product.image_url ? { uri: product.image_url } : null,
          calories: this.extractCalories(product),
          protein: this.extractNutrient(product, 'proteins_100g'),
          carbs: this.extractNutrient(product, 'carbohydrates_100g'),
          fats: this.extractNutrient(product, 'fat_100g'),
          brands: product.brands,
          categories: product.categories,
          nutriscore_grade: product.nutriscore_grade,
          // Ajouter les propriétés supplémentaires nécessaires
          origins_tags: product.labels?.split(',') || [],
          categories_tags: product.categories?.split(',') || [],
          nutriments: product.nutriments
        };
      });
      
      // Mettre en cache les résultats de la recherche
      this.lastSearchParams = searchParams;
      this.lastSearchResults = results;
      
      return results;
    } catch (error) {
      logger.error(LogCategory.INTEGRATION, 'Error searching products', { error, searchParams });
      throw new Error(`Erreur lors de la recherche: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Extrait les calories d'un produit
   * @param product Le produit OpenFoodFacts
   * @returns Valeur des calories
   */
  private extractCalories(product: Product): number {
    if (!product.nutriments) return 0;
    return product.nutriments.energy_100g ? product.nutriments.energy_100g / 4.184 : 0;
  }

  /**
   * Extrait un nutriment spécifique d'un produit
   * @param product Le produit OpenFoodFacts
   * @param nutrientKey Clé du nutriment à extraire
   * @returns Valeur du nutriment
   */
  private extractNutrient(product: Product, nutrientKey: string): number {
    if (!product.nutriments) return 0;
    return product.nutriments[nutrientKey as keyof typeof product.nutriments] as number || 0;
  }

  /**
   * Obtient des suggestions de cuisine basées sur un produit.
   * @param product Le produit pour lequel obtenir des suggestions
   * @returns Le type de cuisine suggéré
   */
  getCuisineSuggestion(product: ExtendedProductResult): CuisineTypeEnum {
    try {
      if (!product || !product.origins_tags || product.origins_tags.length === 0) {
        return CuisineTypeEnum.GENERAL;
      }
      
      // Déterminer le pays d'origine
      const origins = product.origins_tags.join(' ').toLowerCase();
      
      if (origins.includes('italie') || origins.includes('italy') || origins.includes('italian')) {
        return CuisineTypeEnum.ITALIAN;
      } else if (origins.includes('france') || origins.includes('french')) {
        return CuisineTypeEnum.FRENCH;
      } else if (origins.includes('mexique') || origins.includes('mexico') || origins.includes('mexican')) {
        return CuisineTypeEnum.MEXICAN;
      } else if (origins.includes('japan') || origins.includes('japon') || origins.includes('japanese')) {
        return CuisineTypeEnum.JAPANESE;
      } else if (origins.includes('inde') || origins.includes('india') || origins.includes('indian')) {
        return CuisineTypeEnum.INDIAN;
      } else if (origins.includes('chine') || origins.includes('china') || origins.includes('chinese')) {
        return CuisineTypeEnum.CHINESE;
      } else if (origins.includes('united states') || origins.includes('usa') || origins.includes('american')) {
        return CuisineTypeEnum.AMERICAN;
      }
      
      // Utiliser les catégories si les origines ne donnent pas de résultat
      if (product.categories_tags) {
        const categories = product.categories_tags.join(' ').toLowerCase();
        
        if (categories.includes('pizza') || categories.includes('pasta') || categories.includes('italian')) {
          return CuisineTypeEnum.ITALIAN;
        } else if (categories.includes('french') || categories.includes('france')) {
          return CuisineTypeEnum.FRENCH;
        } else if (categories.includes('mexican') || categories.includes('taco') || categories.includes('burrito')) {
          return CuisineTypeEnum.MEXICAN;
        } else if (categories.includes('sushi') || categories.includes('japanese')) {
          return CuisineTypeEnum.JAPANESE;
        } else if (categories.includes('curry') || categories.includes('indian')) {
          return CuisineTypeEnum.INDIAN;
        }
      }
      
      return CuisineTypeEnum.GENERAL;
    } catch (error) {
      logger.error(LogCategory.APP, 'Error getting cuisine suggestion', { error, product });
      return CuisineTypeEnum.GENERAL;
    }
  }

  /**
   * Formate les nutriments du produit pour l'affichage.
   * @param product Le produit dont on veut formater les nutriments
   * @returns Objet contenant les nutriments formatés
   */
  formatNutrients(product: ExtendedProductResult): {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  } {
    try {
      if (!product || !product.nutriments) {
        return { calories: 0, protein: 0, fat: 0, carbs: 0 };
      }
      
      const nutriments = product.nutriments;
      
      // Valeurs par 100g/ml
      const calories = nutriments['energy-kcal_100g'] ?? (nutriments['energy-kj_100g'] ? nutriments['energy-kj_100g'] / 4.184 : 0);
      const protein = nutriments.proteins_100g ?? 0;
      const fat = nutriments.fat_100g ?? 0;
      const carbs = nutriments.carbohydrates_100g ?? 0;
      
      return {
        calories: Math.round(calories),
        protein: Math.round(protein),
        fat: Math.round(fat),
        carbs: Math.round(carbs)
      };
    } catch (error) {
      logger.error(LogCategory.APP, 'Error formatting nutrients', { error, product });
      return { calories: 0, protein: 0, fat: 0, carbs: 0 };
    }
  }
}

// Exporter une instance unique du service
const scannerService = new ScannerService();
export default scannerService;
