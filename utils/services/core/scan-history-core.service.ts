import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

export interface AddHistoryParams {
  barcode?: string;
  name: string;
  userId: number;
}

class ScanHistoryCoreService {
  /** Ajoute une entrée d'historique */
  async addHistory({ barcode, name, userId }: AddHistoryParams) {
    if (!barcode) {
      // Pas de code-barres, on ignore l'ajout d'historique
      return { success: false, error: 'No barcode provided' };
    }
    try {
      const result = await sqliteMCPServer.addScanHistoryViaMCP({ barcode, name, userId });
      return result;
    } catch (error) {
      logger.error(LogCategory.DATABASE, 'Failed to add scan history via MCP', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /** Récupère les n dernières entrées */
  async getHistory(userId: number, limit = 20) {
    try {
      const result = await sqliteMCPServer.getScanHistoryViaMCP({ userId, limit });
      return result;
    } catch (error) {
      logger.error(LogCategory.DATABASE, 'Failed to fetch scan history via MCP', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /** Supprime toutes les entrées d'historique */
  async clearHistory(userId: number) {
    try {
      const result = await sqliteMCPServer.clearScanHistoryViaMCP(userId);
      return result;
    } catch (error) {
      logger.error(LogCategory.DATABASE, 'Failed to clear scan history via MCP', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

export const scanHistoryCoreService = new ScanHistoryCoreService();
export default scanHistoryCoreService;
