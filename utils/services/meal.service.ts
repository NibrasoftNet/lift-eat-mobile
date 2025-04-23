import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import * as schema from '../../db/schema';
import { CuisineTypeEnum, MealTypeEnum } from '../enum/meal.enum';
import {
  ingredientsStandard,
  mealIngredients,
  MealIngredientsOrmProps,
  MealOrmProps,
  meals,
  MealWithIngredientAndStandardOrmProps,
} from '../../db/schema';
import { and, eq, inArray, like } from 'drizzle-orm';
import { MealFormData } from '../validation/meal/meal.validation';
import { IngredientWithStandardProps } from '@/types/ingredient.type';
import { TotalMacrosProps } from '@/types/meal.type';
import { logger } from './logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';

/**
 * Crée un nouveau repas avec ses ingrédients associés
 * @deprecated Utilisez directement sqliteMCPServer.createNewMealViaMCP pour une meilleure centralisation
 */
export const createNewMeal = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  data: MealFormData,
  selectedIngredients: IngredientWithStandardProps[],
  totalMacros: TotalMacrosProps,
  creatorId: number,
) => {
  const startTime = logger.startPerformanceLog('createNewMeal');
  try {
    logger.info(LogCategory.DATABASE, 'Creating new meal via MCP Server', { mealName: data.name });

    // Utiliser le serveur MCP au lieu d'accéder directement à la base de données
    const result = await sqliteMCPServer.createNewMealViaMCP(
      data,
      selectedIngredients,
      {
        totalCalories: totalMacros.totalCalories,
        totalCarbs: totalMacros.totalCarbs,
        totalFats: totalMacros.totalFats,
        totalProtein: totalMacros.totalProtein
      },
      creatorId
    );

    if (!result.success) {
      throw new Error(result.error || 'Failed to create meal via MCP Server');
    }

    // Maintenir la compatibilité avec l'API actuelle
    return { id: result.mealId };
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Failed to create meal', { error });
    throw error;
  } finally {
    logger.endPerformanceLog('createNewMeal', startTime);
  }
};

/**
 * Récupère une liste de repas avec filtrage optionnel
 * @deprecated Utilisez directement sqliteMCPServer.getMealsListViaMCP pour une meilleure centralisation
 */
export const getMealsList = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  cuisine?: CuisineTypeEnum,
  mealType?: MealTypeEnum,
  mealName?: string,
) => {
  const startTime = logger.startPerformanceLog('getMealsList');
  try {
    logger.info(LogCategory.DATABASE, 'Fetching meals list via MCP Server', {
      filters: { cuisine, mealType, mealName },
    });

    // Récupérer l'ID utilisateur depuis le premier utilisateur dans la base de données
    // Note: Ceci est une solution temporaire, idéalement l'ID utilisateur devrait être passé en paramètre
    const users = await drizzleDb.select({ id: schema.users.id }).from(schema.users).limit(1);
    if (users.length === 0) {
      throw new Error('No users found in the database');
    }
    const userId = users[0].id;

    // Utiliser le serveur MCP au lieu d'accéder directement à la base de données
    // Conversion des énumérations en strings pour correspondre à la signature de la méthode MCP
    const cuisineStr = cuisine ? String(cuisine) : undefined;
    const mealTypeStr = mealType ? String(mealType) : undefined;
    const result = await sqliteMCPServer.getMealsListViaMCP(userId, cuisineStr, mealTypeStr, mealName);

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch meals list via MCP Server');
    }

    logger.debug(LogCategory.DATABASE, 'Meals list fetched via MCP Server', {
      count: result.meals.length,
    });
    
    return result.meals;
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Failed to fetch meals list', { error });
    throw error;
  } finally {
    logger.endPerformanceLog('getMealsList', startTime);
  }
};

/**
 * Récupère un repas spécifique avec tous ses ingrédients
 * @deprecated Utilisez directement sqliteMCPServer.getMealByIdWithIngredientsViaMCP pour une meilleure centralisation
 */
export const getMealByIdWithIngredients = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  mealId: number,
) => {
  const startTime = logger.startPerformanceLog('getMealByIdWithIngredients');
  try {
    logger.info(LogCategory.DATABASE, 'Fetching meal with ingredients via MCP Server', { mealId });

    // Récupérer l'ID utilisateur depuis le premier utilisateur dans la base de données
    // Note: Ceci est une solution temporaire, idéalement l'ID utilisateur devrait être passé en paramètre
    const users = await drizzleDb.select({ id: schema.users.id }).from(schema.users).limit(1);
    if (users.length === 0) {
      throw new Error('No users found in the database');
    }
    const userId = users[0].id;

    // Utiliser le serveur MCP au lieu d'accéder directement à la base de données
    const result = await sqliteMCPServer.getMealByIdWithIngredientsViaMCP(mealId, userId);

    if (!result.success) {
      throw new Error(result.error || `Failed to fetch meal with ID ${mealId} via MCP Server`);
    }

    logger.debug(LogCategory.DATABASE, 'Meal with ingredients fetched via MCP Server', {
      mealId,
      ingredientsCount: result.ingredients?.length || 0,
    });

    return { 
      meal: result.meal,
      ingredients: result.ingredients || [] 
    };
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Failed to fetch meal with ingredients', {
      mealId,
      error,
    });
    throw error;
  } finally {
    logger.endPerformanceLog('getMealByIdWithIngredients', startTime);
  }
};

/**
 * Met à jour un repas existant avec ses ingrédients
 * @deprecated Utilisez directement sqliteMCPServer.updateMealViaMCP pour une meilleure centralisation
 */
export const updateMeal = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  data: MealFormData,
  selectedIngredients: IngredientWithStandardProps[],
  totalMacros: TotalMacrosProps,
) => {
  const startTime = logger.startPerformanceLog('updateMeal');
  try {
    logger.info(LogCategory.DATABASE, 'Updating meal via MCP Server', {
      mealId: data.id,
      mealName: data.name,
    });

    // Utiliser le serveur MCP au lieu d'accéder directement à la base de données
    // Inclure les totalMacros dans l'objet data pour la mise à jour
    // Extrait l'ID pour s'assurer qu'il est du bon type et le réinsérer si c'est un nombre valide
    const { id, ...dataWithoutId } = data;
    const dataWithMacros = {
      ...dataWithoutId,
      // Réinsérer l'id seulement s'il s'agit d'un nombre valide
      ...(typeof id === 'number' ? { id } : {}),
      calories: totalMacros.totalCalories,
      carbs: totalMacros.totalCarbs,
      fat: totalMacros.totalFats,
      protein: totalMacros.totalProtein
    };

    const result = await sqliteMCPServer.updateMealViaMCP(
      data.id as number, // mealId en premier argument
      dataWithMacros,    // data en second argument
      selectedIngredients // ingredients en troisième argument (optionnel)
    );

    if (!result.success) {
      throw new Error(result.error || `Failed to update meal ${data.id} via MCP Server`);
    }

    logger.debug(LogCategory.DATABASE, 'Meal updated successfully via MCP Server', {
      mealId: data.id,
      newIngredientCount: selectedIngredients.length,
    });

    // Maintenir la compatibilité avec l'API actuelle
    return { id: data.id };
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Failed to update meal', {
      mealId: data.id,
      error,
    });
    throw error;
  } finally {
    logger.endPerformanceLog('updateMeal', startTime);
  }
};

/**
 * Supprime un repas et ses ingrédients associés
 * @deprecated Utilisez directement sqliteMCPServer.deleteMealViaMCP pour une meilleure centralisation
 */
export const deleteMeal = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  mealId: number,
) => {
  const startTime = logger.startPerformanceLog('deleteMeal');
  try {
    logger.info(LogCategory.DATABASE, 'Deleting meal via MCP Server', { mealId });

    // Utiliser le serveur MCP au lieu d'accéder directement à la base de données
    // L'ID utilisateur est nécessaire pour la gestion du cache dans MCP
  // Utiliser un ID par défaut de 1 si non disponible (doit être amélioré ultérieurement)
  const userId = 1; // à remplacer par la récupération du vrai ID utilisateur quand disponible
  const result = await sqliteMCPServer.deleteMealViaMCP(mealId, userId);

    if (!result.success) {
      throw new Error(result.error || `Failed to delete meal ${mealId} via MCP Server`);
    }

    logger.debug(LogCategory.DATABASE, 'Meal deleted successfully via MCP Server', { mealId });
    
    // Maintenir la compatibilité avec l'API actuelle
    return { id: mealId };
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Failed to delete meal', { mealId, error });
    throw error;
  } finally {
    logger.endPerformanceLog('deleteMeal', startTime);
  }
};
