import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { DetectedAction } from './responseParser';
import { 
  IaMealType, 
  IaPlanType, 
  IaIngredientType 
} from '@/utils/validation/ia/ia.schemas';

/**
 * Exécute les actions détectées dans la réponse de l'IA
 * @param action Action détectée
 * @param userId ID de l'utilisateur
 * @returns Promesse résolue quand l'action est terminée
 */
export async function processDatabaseAction(action: DetectedAction, userId: number): Promise<void> {
  try {
    // Vérifier si l'action est valide avant de l'exécuter
    if (!action.isValid) {
      logger.error(LogCategory.IA, `Action non valide: ${action.validationMessage}`);
      return;
    }
    
    // Utiliser les données typées et validées par Zod
    if (action.type === 'ADD_MEAL' && action.parsedData) {
      await processMealAction(action.parsedData as IaMealType, userId);
    } else if (action.type === 'ADD_PLAN' && action.parsedData) {
      await processPlanAction(action.parsedData as IaPlanType, userId);
    } else if (action.type === 'ADD_INGREDIENT' && action.parsedData) {
      await processIngredientAction(action.parsedData as IaIngredientType, userId);
    }
  } catch (error) {
    logger.error(LogCategory.IA, `Error processing database action: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}

/**
 * Traite l'action d'ajout de repas
 * @param mealData Données du repas validées
 * @param userId ID de l'utilisateur
 */
async function processMealAction(mealData: IaMealType, userId: number): Promise<void> {
  try {
    logger.info(LogCategory.IA, `Processing meal action: ${mealData.name}`);
    
    // MODIFICATION: Utiliser le MCP Server au lieu de nutritionDatabaseService
    const result = await sqliteMCPServer.addMealViaMCP(mealData, userId);
    
    if (!result.success) {
      throw new Error(result.error);
    }
    
    logger.info(LogCategory.IA, `Meal added to database via MCP: ${mealData.name} (ID: ${result.mealId})`);
  } catch (error) {
    logger.error(LogCategory.IA, `Error processing meal action: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}

/**
 * Traite l'action d'ajout de plan
 * @param planData Données du plan validées
 * @param userId ID de l'utilisateur
 */
async function processPlanAction(planData: IaPlanType, userId: number): Promise<void> {
  try {
    logger.info(LogCategory.IA, `Processing plan action: ${planData.name}`);
    
    // MODIFICATION: Utiliser le MCP Server au lieu de nutritionDatabaseService
    const result = await sqliteMCPServer.addPlanViaMCP(planData, userId);
    
    if (!result.success) {
      throw new Error(result.error);
    }
    
    logger.info(LogCategory.IA, `Plan added to database via MCP: ${planData.name} (ID: ${result.planId})`);
  } catch (error) {
    logger.error(LogCategory.IA, `Error processing plan action: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}

/**
 * Traite l'action d'ajout d'ingrédient
 * @param ingredientData Données de l'ingrédient validées
 * @param userId ID de l'utilisateur (non utilisé pour les ingrédients)
 */
async function processIngredientAction(ingredientData: IaIngredientType, userId: number): Promise<void> {
  try {
    logger.info(LogCategory.IA, `Processing ingredient action: ${ingredientData.name}`);
    
    // MODIFICATION: Utiliser le MCP Server au lieu de nutritionDatabaseService
    const result = await sqliteMCPServer.addIngredientViaMCP(ingredientData);
    
    if (!result.success) {
      throw new Error(result.error);
    }
    
    const status = result.alreadyExists 
      ? `Ingredient already exists: ${ingredientData.name} (ID: ${result.ingredientId})`
      : `Ingredient added to database via MCP: ${ingredientData.name} (ID: ${result.ingredientId})`;
    
    logger.info(LogCategory.IA, status);
  } catch (error) {
    logger.error(LogCategory.IA, `Error processing ingredient action: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}
