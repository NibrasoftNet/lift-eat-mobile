import scannerService from '@/utils/services/common/scanner.service';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { ScanResult, SearchParams, ProductResult } from '@/utils/api/OpenFoodFactsService';
import { ScanResultWithCode } from '@/types/scanner.types';

/**
 * Core service qui encapsule la logique de scan et de recherche de produits
 * via OpenFoodFacts. Aucune logique UI ou base de données ici.
 * Conforme à l'architecture MCP (couche Controller).
 */
class ScannerCoreService {
  /**
   * Scanne un code-barres et renvoie le résultat.
   */
  async scanBarcode(barcode: string): Promise<ScanResult> {
    try {
      logger.info(LogCategory.INTEGRATION, '[SCANNER] scanBarcode (core)', { barcode });
      const result = await scannerService.scanBarcode(barcode);
      if (result.isValid && result.productResult) {
        // Ajouter le code-barres au résultat
        const productResult = result.productResult as ProductResult & { code: string };
        productResult.code = barcode;
      }
      return result as ScanResultWithCode;
    } catch (error) {
      logger.error(LogCategory.INTEGRATION, '[SCANNER] Failed scanBarcode (core)', {
        error: error instanceof Error ? error.message : String(error),
        barcode,
      });
      return {
        isValid: false,
        message: 'Erreur lors du scan',
        productResult: null,
      };
    }
  }

  /**
   * Recherche des produits par mots-clés.
   */
  async searchProducts(params: SearchParams): Promise<ProductResult[]> {
    try {
      logger.info(LogCategory.INTEGRATION, '[SCANNER] searchProducts (core)', { params });
      const results = await scannerService.searchProducts(params);
      return results;
    } catch (error) {
      logger.error(LogCategory.INTEGRATION, '[SCANNER] Failed searchProducts (core)', {
        error: error instanceof Error ? error.message : String(error),
        params,
      });
      return [];
    }
  }
}

export const scannerCoreService = new ScannerCoreService();
export default scannerCoreService;
