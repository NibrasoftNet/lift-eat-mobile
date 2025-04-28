import OpenFoodFactsService, { 
  ScanResult, 
  ProductResult, 
  SearchParams 
} from '@/utils/api/OpenFoodFactsService';
import { CuisineTypeEnum, CountryTypeEnum, CountryConfig } from '@/utils/enum/meal.enum';

/**
 * Service responsable de la gestion des fonctionnalités de scan et de recherche 
 * via l'API OpenFoodFacts.
 */
class ScannerService {
  private cachedProducts: Map<string, ProductResult> = new Map();
  private lastSearchParams: SearchParams | null = null;
  private lastSearchResults: ProductResult[] | null = null;

  /**
   * Initialise le service Scanner.
   */
  constructor() {
    console.log('Scanner service initialized');
  }

  /**
   * Scanne un code-barres et récupère les informations du produit.
   * @param barcodeData Le code-barres scanné
   * @returns Résultat du scan avec les informations du produit ou un message d'erreur
   */
  async scanBarcode(barcodeData: string): Promise<ScanResult> {
    try {
      console.log(`Scanner service: Scanning barcode ${barcodeData}`);
      
      // Vérifier si le produit est déjà dans le cache
      if (this.cachedProducts.has(barcodeData)) {
        console.log(`Scanner service: Product found in cache for barcode ${barcodeData}`);
        const cachedProduct = this.cachedProducts.get(barcodeData);
        
        return {
          isValid: true,
          message: "Produit trouvé dans le cache",
          productResult: cachedProduct!
        };
      }
      
      // Sinon, appeler l'API
      const result = await OpenFoodFactsService.scanBarcode(barcodeData);
      
      // Si le produit est valide, l'ajouter au cache
      if (result.isValid && result.productResult) {
        this.cachedProducts.set(barcodeData, result.productResult);
      }
      
      return result;
    } catch (error) {
      console.error('Scanner service: Error scanning barcode:', error);
      return {
        isValid: false,
        message: error instanceof Error ? error.message : "Une erreur s'est produite lors du scan",
        productResult: null
      };
    }
  }

  /**
   * Recherche des produits selon des termes de recherche et des filtres optionnels.
   * Limite le cache aux 20 premiers résultats pour optimiser la mémoire.
   * @param searchTerms Termes de recherche
   * @param cuisine Type de cuisine optionnel pour filtrer les résultats
   * @param country Pays pour la recherche (défaut: France)
   * @param pageSize Nombre de résultats à retourner (défaut: 30, maximum: 30)
   * @returns Liste des produits correspondant aux critères ou null en cas d'erreur
   */
  async searchProducts(
    searchTerms: string,
    cuisine?: CuisineTypeEnum,
    country: CountryTypeEnum = CountryTypeEnum.FRANCE,
    pageSize: number = 30
  ): Promise<ProductResult[] | null> {
    try {
      if (!searchTerms.trim()) {
        return null;
      }
      
      // S'assurer que pageSize ne dépasse pas 30 pour des performances optimales
      const limitedPageSize = Math.min(pageSize, 30);
      
      // Construire les paramètres de base
      const searchParams = new URLSearchParams({
        search_terms: searchTerms.trim(),
        fields: 'product_name,brands,nutriments,image_front_url,categories,nutrition_grade_fr',
        page_size: limitedPageSize.toString(),
        json: '1',
        lc: CountryConfig[country].code
      });

      // Ajouter les paramètres de cuisine si spécifié
      if (cuisine) {
        switch (cuisine.toLowerCase()) {
          case 'african':
            searchParams.append('tagtype_0', 'origins');
            searchParams.append('tag_contains_0', 'contains');
            searchParams.append('tag_0', 'africa');
            break;
          case 'asian':
            searchParams.append('tagtype_0', 'origins');
            searchParams.append('tag_contains_0', 'contains');
            searchParams.append('tag_0', 'asia');
            break;
          case 'european':
            searchParams.append('tagtype_0', 'origins');
            searchParams.append('tag_contains_0', 'contains');
            searchParams.append('tag_0', 'europe');
            break;
          case 'caribbean':
            searchParams.append('tagtype_0', 'origins');
            searchParams.append('tag_contains_0', 'contains');
            searchParams.append('tag_0', 'caribbean');
            break;
        }
      }

      // Ajouter le filtre de pays
      searchParams.append('tagtype_1', 'countries');
      searchParams.append('tag_contains_1', 'contains');
      searchParams.append('tag_1', country);
      
      // Constructeur de cache key pour vérifier si on a déjà cette recherche en cache
      const cacheKey = `${searchTerms.trim()}_${cuisine || ''}_${country}_${limitedPageSize}`;
      
      // Vérifier si les mêmes paramètres ont déjà été recherchés récemment
      if (this.lastSearchParams && 
          this.lastSearchResults && 
          this.lastSearchParams.search_terms === searchTerms.trim() &&
          this.lastSearchParams.tag === cuisine?.toLowerCase() &&
          this.lastSearchParams.country === country) {
        console.log('Scanner service: Returning cached search results');
        return this.lastSearchResults;
      }
      
      // Ajout d'un timeout pour limiter le temps d'attente
      console.log('Scanner service: Searching products with direct fetch');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 secondes max
      
      // Construction de l'URL directe avec l'URL du pays
      const url = `${CountryConfig[country].url}/cgi/search.pl?${searchParams.toString()}`;
      console.log('URL de recherche:', url);
      
      try {
        // Appel direct à l'API
        const response = await fetch(url, {
          signal: controller.signal
        });
        
        // N'oubliez pas d'annuler le timeout
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data.products || !Array.isArray(data.products)) {
          console.error('Scanner service: Invalid response format');
          return null;
        }
        
        // Formater les résultats
        const formattedResults = data.products.map((product: any) => ({
          name: product.product_name || 'Produit inconnu',
          brands: product.brands || 'Marque inconnue',
          nutriscore_grade: product.nutrition_grade_fr || 'unknown',
          calories: product.nutriments?.energy_value || product.nutriments?.energy_100g || 0,
          protein: product.nutriments?.proteins_100g || 0,
          carbs: product.nutriments?.carbohydrates_100g || 0,
          fats: product.nutriments?.fat_100g || 0,
          image: product.image_front_url ? { uri: product.image_front_url } : require('@/assets/images/image-non-disponible.jpg'),
          categories: product.categories
        }));
        
        console.log(`Scanner service: Got ${formattedResults.length} results`);
        
        // Limiter le cache aux 20 premiers résultats pour optimiser la mémoire
        const cachedResults = formattedResults.length > 20 ? formattedResults.slice(0, 20) : formattedResults;
        
        // Mettre en cache les résultats et paramètres
        this.lastSearchParams = {
          search_terms: searchTerms.trim(),
          page_size: limitedPageSize,
          tag: cuisine ? cuisine.toLowerCase() : undefined,
          country: country
        };
        this.lastSearchResults = cachedResults;
        
        // Retourner tous les résultats
        return formattedResults;
      } catch (error) {
        // N'oubliez pas d'annuler le timeout en cas d'erreur
        clearTimeout(timeoutId);
        
        if (error instanceof DOMException && error.name === 'AbortError') {
          console.error('Scanner service: Search timed out after 5 seconds');
          throw new Error('La recherche a pris trop de temps et a été interrompue');
        }
        
        throw error;
      }
    } catch (error) {
      console.error('Scanner service: Error searching products:', error);
      return null;
    }
  }
  
  /**
   * Efface le cache de produits.
   */
  clearCache(): void {
    this.cachedProducts.clear();
    this.lastSearchParams = null;
    this.lastSearchResults = null;
    console.log('Scanner service: Cache cleared');
  }
  
  /**
   * Compare deux ensembles de paramètres de recherche.
   * @private
   */
  private areSearchParamsEqual(params1: SearchParams, params2: SearchParams): boolean {
    return (
      params1.search_terms === params2.search_terms &&
      params1.page_size === params2.page_size &&
      params1.tag === params2.tag &&
      params1.country === params2.country
    );
  }
}

// Exporter une instance unique du service
const scannerService = new ScannerService();
export default scannerService;
