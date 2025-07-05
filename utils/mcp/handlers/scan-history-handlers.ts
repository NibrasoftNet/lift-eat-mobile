import { scanHistory } from '@/db/schema';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import {
  AddScanHistoryParams,
  AddScanHistoryResult,
  GetScanHistoryParams,
  GetScanHistoryResult,
} from '../interfaces/scan-history-interfaces';
import { desc, eq } from 'drizzle-orm';

/** Ajoute une entrée d'historique de scan */
export async function handleAddScanHistory(
  db: any,
  params: AddScanHistoryParams,
): Promise<AddScanHistoryResult> {
  try {
    if (!db) throw new Error('Database not initialized');
    const { barcode, name, userId } = params;
    logger.info(
      LogCategory.DATABASE,
      `[handleAddScanHistory] Params received`,
      { barcode, name, userId },
    );
    const [result] = await db
      .insert(scanHistory)
      .values({ barcode, name, userId })
      .returning({ id: scanHistory.id });
    logger.info(LogCategory.DATABASE, `[handleAddScanHistory] Insert result`, {
      result,
    });
    return { success: true, id: result.id };
  } catch (error) {
    logger.error(
      LogCategory.DATABASE,
      `Error in handleAddScanHistory: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/** Récupère les dernières entrées */
export async function handleGetScanHistory(
  db: any,
  params: GetScanHistoryParams,
): Promise<GetScanHistoryResult> {
  try {
    if (!db) throw new Error('Database not initialized');
    const { userId, limit = 20 } = params;
    const rows = await db
      .select()
      .from(scanHistory)
      .where(eq(scanHistory.userId, userId))
      .orderBy(desc(scanHistory.scannedAt))
      .limit(limit);
    return { success: true, data: rows };
  } catch (error) {
    logger.error(
      LogCategory.DATABASE,
      `Error in handleGetScanHistory: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/** Vide l'historique */
export async function handleClearScanHistory(
  db: any,
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!db) throw new Error('Database not initialized');
    await db.delete(scanHistory);
    return { success: true };
  } catch (error) {
    logger.error(
      LogCategory.DATABASE,
      `Error in handleClearScanHistory: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
