import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { scannerCoreService } from '../core/scanner-core.service';
import { scanHistoryCoreService } from '../core/scan-history-core.service';
import {
  ScanResult,
  SearchParams,
  ProductResult,
} from '@/utils/api/OpenFoodFactsService';
import { OperationResult } from '@/utils/interfaces/pages.interface';
import { GetScanHistoryResult } from '@/utils/mcp/interfaces/scan-history-interfaces';

/**
 * Service Presenter pour le module Scanner.
 * Orchestration entre core services et UI.
 */
class ScannerPagesService {
  async scanBarcode(barcode: string, userId: number): Promise<ScanResult> {
    // Log incoming params to trace userId early in the flow
    logger.info(
      LogCategory.INTEGRATION,
      '[SCANNER] scanBarcode (pages) params',
      { barcode, userId },
    );
    const result = await scannerCoreService.scanBarcode(barcode);
    logger.info(
      LogCategory.INTEGRATION,
      '[SCANNER] scanBarcode (pages) core result',
      {
        barcode,
        userId,
        isValid: result.isValid,
        hasProduct: !!result.productResult,
      },
    );
    if (result.isValid && result.productResult) {
      logger.info(
        LogCategory.INTEGRATION,
        '[SCANNER] scanBarcode (pages) calling addHistory',
        {
          barcode,
          name: result.productResult.name || '',
          userId,
        },
      );
      await scanHistoryCoreService.addHistory({
        barcode,
        name: result.productResult.name || '',
        userId,
      });
    }
    return result;
  }

  async searchProducts(
    params: SearchParams,
    userId: number,
  ): Promise<OperationResult<{ results: any[] }>> {
    try {
      const results = await scannerCoreService.searchProducts(params);
      return { success: true, data: { results } };
    } catch (error) {
      logger.error(
        LogCategory.INTEGRATION,
        '[SCANNER] searchProducts presenter error',
        {
          error: error instanceof Error ? error.message : String(error),
          params,
          userId,
        },
      );
      return { success: false, error: 'Erreur lors de la recherche' };
    }
  }

  async getHistory(
    userId: number,
    limit = 20,
  ): Promise<OperationResult<GetScanHistoryResult>> {
    try {
      const results = await scanHistoryCoreService.getHistory(userId, limit);
      return { success: true, data: results };
    } catch (error) {
      logger.error(
        LogCategory.INTEGRATION,
        '[SCANNER] getHistory presenter error',
        {
          error: error instanceof Error ? error.message : String(error),
          userId,
          limit,
        },
      );
      return {
        success: false,
        error: "Erreur lors de la récupération de l'historique",
      };
    }
  }

  /**
   * Récupère les détails d'un produit sans modifier l'historique
   * @param barcode Code-barres du produit
   */
  async getProductDetails(
    barcode: string,
  ): Promise<{
    success: boolean;
    productResult?: ProductResult;
    error?: string;
  }> {
    try {
      const result = await scannerCoreService.scanBarcode(barcode);
      if (result.isValid && result.productResult) {
        return { success: true, productResult: result.productResult };
      }
      return { success: false, error: result.message || 'Produit non trouvé' };
    } catch (error) {
      logger.error(
        LogCategory.INTEGRATION,
        '[SCANNER] getProductDetails presenter error',
        {
          error: error instanceof Error ? error.message : String(error),
          barcode,
        },
      );
      return {
        success: false,
        error: 'Erreur lors de la récupération du produit',
      };
    }
  }

  async clearScanHistory(userId: number): Promise<OperationResult> {
    try {
      await scanHistoryCoreService.clearHistory(userId);
      return { success: true };
    } catch (error) {
      logger.error(
        LogCategory.INTEGRATION,
        '[SCANNER] clearScanHistory presenter error',
        {
          error: error instanceof Error ? error.message : String(error),
          userId,
        },
      );
      return {
        success: false,
        error: "Erreur lors de la suppression de l'historique",
      };
    }
  }
}

export const scannerPagesService = new ScannerPagesService();
export default scannerPagesService;
