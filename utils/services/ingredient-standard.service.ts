import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import * as schema from '../../db/schema';
import { ingredientsStandard } from '../../db/schema';
import { like } from 'drizzle-orm';
import { defaultPageSize } from '@/utils/constants/constant';
import { withPagination } from './common.service';
import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';

/**
 * Récupère une liste d'ingrédients standards avec pagination et filtrage optionnel
 * @deprecated Utilisez directement sqliteMCPServer.getIngredientsListViaMCP pour une meilleure centralisation
 */
export const getIngredientStandardList = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  page: number = 1,
  pageSize: number = defaultPageSize,
  ingredientName?: string,
) => {
  const startTime = logger.startPerformanceLog('getIngredientStandardList');
  try {
    logger.info(LogCategory.DATABASE, 'Fetching ingredients list via MCP Server', {
      page,
      pageSize,
      search: ingredientName
    });

    // Utiliser le serveur MCP au lieu d'accéder directement à la base de données
    const result = await sqliteMCPServer.getIngredientsListViaMCP(
      ingredientName,
      page * pageSize // Simuler la pagination en récupérant plus d'éléments
    );

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch ingredients list via MCP Server');
    }

    const data = result.ingredients || [];
    logger.debug(LogCategory.DATABASE, 'Ingredients list fetched via MCP Server', {
      count: data.length,
    });
    
    // Maintenir la compatibilité avec l'API actuelle
    return { 
      data, 
      nextPage: data.length === pageSize ? page + 1 : null 
    };
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Failed to fetch ingredients list', { error });
    throw error;
  } finally {
    logger.endPerformanceLog('getIngredientStandardList', startTime);
  }
};

/**
 * Ajoute un nouvel ingrédient standard
 * @param drizzleDb Instance de la base de données
 * @param ingredientData Données de l'ingrédient à ajouter
 * @returns Résultat de l'opération avec l'ID de l'ingrédient créé
 */
export const addIngredientStandard = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  ingredientData: any
) => {
  const startTime = logger.startPerformanceLog('addIngredientStandard');
  try {
    logger.info(LogCategory.DATABASE, 'Adding ingredient via MCP Server', { 
      name: ingredientData.name 
    });

    // Utiliser le serveur MCP au lieu d'accéder directement à la base de données
    const result = await sqliteMCPServer.addIngredientViaMCP(ingredientData);

    if (!result.success) {
      throw new Error(result.error || 'Failed to add ingredient via MCP Server');
    }

    logger.debug(LogCategory.DATABASE, 'Ingredient added via MCP Server', {
      id: result.ingredientId,
      alreadyExists: result.alreadyExists
    });
    
    return { id: result.ingredientId, alreadyExists: result.alreadyExists };
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Failed to add ingredient', { error });
    throw error;
  } finally {
    logger.endPerformanceLog('addIngredientStandard', startTime);
  }
};
