import nutritionDatabaseService from '../nutrition-database.service';
import { DetectedAction } from './responseParser';

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
      console.error(`Action non valide: ${action.validationMessage}`);
      return;
    }
    
    // Utiliser les données typées et validées par Zod
    if (action.type === 'ADD_MEAL' && action.parsedData) {
      await processMealAction(action.parsedData, userId);
    } else if (action.type === 'ADD_PLAN' && action.parsedData) {
      await processPlanAction(action.parsedData, userId);
    } else if (action.type === 'ADD_INGREDIENT' && action.parsedData) {
      await processIngredientAction(action.parsedData, userId);
    }
  } catch (error) {
    console.error('Error processing database action:', error);
    throw error;
  }
}

/**
 * Traite l'action d'ajout de repas
 * @param mealData Données du repas validées
 * @param userId ID de l'utilisateur
 */
async function processMealAction(mealData: any, userId: number): Promise<void> {
  try {
    await nutritionDatabaseService.addMeal({
      ...mealData,
      creatorId: userId
    });
    console.log('Meal added to database:', mealData.name);
  } catch (error) {
    console.error('Error processing meal action:', error);
    throw error;
  }
}

/**
 * Traite l'action d'ajout de plan
 * @param planData Données du plan validées
 * @param userId ID de l'utilisateur
 */
async function processPlanAction(planData: any, userId: number): Promise<void> {
  try {
    await nutritionDatabaseService.addPlan({
      ...planData,
      creatorId: userId
    });
    console.log('Plan added to database:', planData.name);
  } catch (error) {
    console.error('Error processing plan action:', error);
    throw error;
  }
}

/**
 * Traite l'action d'ajout d'ingrédient
 * @param ingredientData Données de l'ingrédient validées
 * @param userId ID de l'utilisateur (non utilisé pour les ingrédients)
 */
async function processIngredientAction(ingredientData: any, userId: number): Promise<void> {
  try {
    await nutritionDatabaseService.addIngredient({
      ...ingredientData
    });
    console.log('Ingredient added to database:', ingredientData.name);
  } catch (error) {
    console.error('Error processing ingredient action:', error);
    throw error;
  }
}
