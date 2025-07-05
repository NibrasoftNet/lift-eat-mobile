import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { ingredientCoreService } from '../core/ingredient-core.service';
import { scanHistoryCoreService } from '../core/scan-history-core.service';
import { IaIngredientType } from '@/utils/validation/ia/ia.schemas';
import { OperationResult } from '@/utils/interfaces/pages.interface';
import { getCurrentUserIdSync } from '@/utils/helpers/userContext';

/**
 * Service Presenter dédié au module Scanner.
 * Il encapsule les appels Core nécessaires pour l'UI de scan.
 * Conforme à l'architecture MCP.
 */
class ScanPagesService {
  /**
   * Ajoute ou met à jour un produit scanné dans la table ingredients_standard.
   * @param ingredientData Données normalisées (pour 100 g) provenant du scan OCR / API externe.
   */
  async addScannedIngredient(
    ingredientData: IaIngredientType,
  ): Promise<OperationResult<{ id: number; alreadyExists: boolean }>> {
    try {
      logger.info(LogCategory.DATABASE, '[SCAN] addScannedIngredient', {
        ingredientData,
      });

      // Récupérer l'ID utilisateur courant
      const userId = getCurrentUserIdSync();
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const result = await ingredientCoreService.createIngredient(
        ingredientData,
      );

      // Enregistrer l'historique avec l'ID utilisateur
      await this.addScanHistory(
        ingredientData.barcode,
        ingredientData.name,
        userId,
      );

      return {
        success: true,
        data: {
          id: result.id,
          alreadyExists: !!result.alreadyExists,
        },
        message: result.alreadyExists
          ? 'Produit déjà présent dans le catalogue'
          : 'Produit ajouté au catalogue',
      };
    } catch (error) {
      logger.error(LogCategory.DATABASE, '[SCAN] Failed addScannedIngredient', {
        error: error instanceof Error ? error.message : String(error),
        ingredientData,
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      };
    }
  }

  /**
   * Enregistre une entrée d'historique de scan
   */
  async addScanHistory(
    barcode: string | undefined,
    name: string,
    userIdParam?: number,
  ) {
    const userId = userIdParam ?? getCurrentUserIdSync();
    if (!userId) {
      return { success: false, error: 'User not authenticated' } as any;
    }
    return scanHistoryCoreService.addHistory({ barcode, name, userId });
  }

  async getScanHistory(limit = 20) {
    const userId = getCurrentUserIdSync();
    if (!userId) {
      return { success: false, error: 'User not authenticated' } as any;
    }
    return scanHistoryCoreService.getHistory(userId, limit);
  }

  async clearScanHistory() {
    const userId = getCurrentUserIdSync();
    if (!userId) {
      return { success: false, error: 'User not authenticated' } as any;
    }
    return scanHistoryCoreService.clearHistory(userId);
  }
}

export const scanPagesService = new ScanPagesService();
export default scanPagesService;
