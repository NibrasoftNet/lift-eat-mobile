import { and, eq } from 'drizzle-orm';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { dailyPlanMeals } from '@/db/schema';

/**
 * Handler pour supprimer un repas d'un plan journalier sans supprimer le repas lui-même
 * @param db Instance de la base de données
 * @param params Paramètres pour la suppression de la relation
 * @returns Résultat de l'opération
 */
export async function handleRemoveMealFromDailyPlan(db: any, params: { dailyPlanId: number; mealId: number }) {
  const { dailyPlanId, mealId } = params;
  
  try {
    if (!db) throw new Error("Database not initialized");
    
    logger.info(LogCategory.DATABASE, `Removing meal ${mealId} from daily plan ${dailyPlanId} via MCP Server`);
    
    // Vérifier si la relation existe
    const existingRelation = await db
      .select()
      .from(dailyPlanMeals)
      .where(
        and(
          eq(dailyPlanMeals.dailyPlanId, dailyPlanId),
          eq(dailyPlanMeals.mealId, mealId)
        )
      )
      .limit(1);
      
    if (!existingRelation || existingRelation.length === 0) {
      logger.warn(LogCategory.DATABASE, `No relation found between meal ${mealId} and daily plan ${dailyPlanId}`);
      return { success: false, error: `Meal is not in this daily plan` };
    }
    
    // Supprimer uniquement la relation, pas le repas lui-même
    await db
      .delete(dailyPlanMeals)
      .where(
        and(
          eq(dailyPlanMeals.dailyPlanId, dailyPlanId),
          eq(dailyPlanMeals.mealId, mealId)
        )
      );
    
    logger.info(LogCategory.DATABASE, `Successfully removed meal ${mealId} from daily plan ${dailyPlanId}`);
    
    return { success: true };
  } catch (error) {
    logger.error(LogCategory.DATABASE, `Error in handleRemoveMealFromDailyPlan: ${error instanceof Error ? error.message : String(error)}`);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}
