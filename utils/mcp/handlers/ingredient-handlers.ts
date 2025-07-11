import {
  AddIngredientParams,
  AddIngredientResult,
  GetIngredientsListParams,
  GetIngredientsListResult,
  UpdateIngredientParams,
  UpdateIngredientResult,
  DeleteIngredientParams,
  DeleteIngredientResult,
} from '../interfaces/ingredient-interfaces';
import {
  ingredientsStandard,
  mealIngredients,
  IngredientStandardOrmProps,
} from '@/db/schema';
import { eq, like, desc } from 'drizzle-orm';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { Buffer } from 'buffer';

/**
 * Handler pour la méthode addIngredientViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres pour l'ajout d'un ingrédient
 * @returns Résultat de l'opération avec l'ID de l'ingrédient créé
 */
export async function handleAddIngredient(
  db: any,
  params: AddIngredientParams,
): Promise<AddIngredientResult> {
  const { ingredientData } = params;

  try {
    if (!db) throw new Error('Database not initialized');

    logger.info(
      LogCategory.DATABASE,
      `Adding ingredient "${ingredientData.name}" via MCP Server`,
    );

    // Vérifier si l'ingrédient existe déjà
    const existingIngredient = await db
      .select({ id: ingredientsStandard.id })
      .from(ingredientsStandard)
      .where(eq(ingredientsStandard.name, ingredientData.name))
      .limit(1);

    if (existingIngredient.length > 0) {
      logger.info(
        LogCategory.DATABASE,
        `Ingredient "${ingredientData.name}" already exists with ID ${existingIngredient[0].id}`,
      );
      return {
        success: true,
        ingredientId: existingIngredient[0].id,
        alreadyExists: true,
      };
    }

    // Créer un nouvel ingrédient avec les données fournies
    // ---- Log image details before DB insert ----
    try {
      const img = ingredientData.image as any;
      console.log('Type of image:', typeof img);
      console.log('Is Buffer:', img instanceof Buffer);
      console.log('Image length:', img ? img.length : 'null/undefined');
      console.log('Image preview:', img?.slice?.(0, 20));
      logger.debug(
        LogCategory.DATABASE,
        `[IMG] before-insert type=${typeof img} buffer=${
          img instanceof Buffer
        } len=${img?.length ?? 0}`,
      );
    } catch (e) {
      logger.warn(
        LogCategory.DATABASE,
        `Failed to log image info before insert: ${
          e instanceof Error ? e.message : String(e)
        }`,
      );
    }
    const result = await db
      .insert(ingredientsStandard)
      .values({
        name: ingredientData.name,
        unit: ingredientData.unit,
        quantity: ingredientData.quantity || 100,
        calories: ingredientData.calories || 0,
        carbs: ingredientData.carbs || 0,
        protein: ingredientData.protein || 0,
        fat: ingredientData.fat || 0,
        image: ingredientData.image || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning({ id: ingredientsStandard.id });

    if (!result || result.length === 0) {
      throw new Error('Failed to create ingredient');
    }

    const ingredientId = result[0].id;

    // ---- Verify stored image in DB ----
    try {
      const storedRows = await db
        .select({ image: ingredientsStandard.image })
        .from(ingredientsStandard)
        .where(eq(ingredientsStandard.id, ingredientId))
        .limit(1);

      if (storedRows.length > 0) {
        const storedImg = storedRows[0].image as any;
        console.log(
          'Stored image length in DB:',
          storedImg ? storedImg.length : 'null/undefined',
        );
        logger.debug(
          LogCategory.DATABASE,
          `[IMG] after-insert storedLen=${storedImg?.length ?? 0}`,
        );
      } else {
        logger.warn(
          LogCategory.DATABASE,
          `No rows found for ingredient ID ${ingredientId} after insert.`,
        );
      }
    } catch (e) {
      logger.warn(
        LogCategory.DATABASE,
        `Failed to fetch image after insert: ${
          e instanceof Error ? e.message : String(e)
        }`,
      );
    }
    logger.info(
      LogCategory.DATABASE,
      `Created new ingredient "${ingredientData.name}" with ID ${ingredientId}`,
    );

    return { success: true, ingredientId, alreadyExists: false };
  } catch (error) {
    logger.error(
      LogCategory.DATABASE,
      `Error in handleAddIngredient: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Handler pour la méthode getIngredientsListViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres pour la récupération des ingrédients
 * @returns Résultat de l'opération avec la liste des ingrédients
 */
export async function handleGetIngredientsList(
  db: any,
  params: GetIngredientsListParams,
): Promise<GetIngredientsListResult> {
  const { search, limit = 50 } = params;

  try {
    if (!db) throw new Error('Database not initialized');

    logger.info(
      LogCategory.DATABASE,
      `Getting ingredients list via MCP Server`,
    );

    // Créer une requête de base
    let query: any = db.select().from(ingredientsStandard);

    // Ajouter une recherche par nom si spécifiée
    if (search && search.trim().length > 0) {
      const searchPattern = `%${search.trim().toLowerCase()}%`;
      query = query.where(like(ingredientsStandard.name, searchPattern));
    }

    // Trier par date de création la plus récente afin que les nouveaux ingrédients apparaissent en premier
    query = query.orderBy(desc(ingredientsStandard.createdAt));

    // Limiter le nombre de résultats
    query = query.limit(limit);

    // Exécuter la requête
    const ingredientsResult = await query;

    logger.info(
      LogCategory.DATABASE,
      `Retrieved ${ingredientsResult.length} ingredients via MCP Server`,
    );
    return { success: true, ingredients: ingredientsResult };
  } catch (error) {
    logger.error(
      LogCategory.DATABASE,
      `Error in handleGetIngredientsList: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Handler pour la méthode updateIngredientViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres pour la mise à jour de l'ingrédient
 * @returns Résultat de l'opération
 */
export async function handleUpdateIngredient(
  db: any,
  params: UpdateIngredientParams,
): Promise<UpdateIngredientResult> {
  const { ingredientId, data } = params;

  try {
    if (!db) throw new Error('Database not initialized');

    logger.info(
      LogCategory.DATABASE,
      `Updating ingredient ${ingredientId} via MCP Server`,
    );

    // Vérifier si l'ingrédient existe
    const ingredientExists = await db
      .select({ id: ingredientsStandard.id })
      .from(ingredientsStandard)
      .where(eq(ingredientsStandard.id, ingredientId))
      .limit(1);

    if (ingredientExists.length === 0) {
      logger.warn(
        LogCategory.DATABASE,
        `Cannot update ingredient: Ingredient with ID ${ingredientId} not found`,
      );
      return {
        success: false,
        error: `Ingredient with ID ${ingredientId} not found`,
      };
    }

    // Mettre à jour l'ingrédient avec les données fournies
    await db
      .update(ingredientsStandard)
      .set({
        ...data,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(ingredientsStandard.id, ingredientId));

    logger.info(
      LogCategory.DATABASE,
      `Successfully updated ingredient ${ingredientId} via MCP Server`,
    );
    return { success: true };
  } catch (error) {
    logger.error(
      LogCategory.DATABASE,
      `Error in handleUpdateIngredient: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Handler pour la méthode deleteIngredientViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres pour la suppression de l'ingrédient
 * @returns Résultat de l'opération
 */
export async function handleDeleteIngredient(
  db: any,
  params: DeleteIngredientParams,
): Promise<DeleteIngredientResult> {
  const { ingredientId } = params;

  try {
    if (!db) throw new Error('Database not initialized');

    logger.info(
      LogCategory.DATABASE,
      `Deleting ingredient ${ingredientId} via MCP Server`,
    );

    // Vérifier si l'ingrédient existe
    const ingredientExists = await db
      .select({ id: ingredientsStandard.id })
      .from(ingredientsStandard)
      .where(eq(ingredientsStandard.id, ingredientId))
      .limit(1);

    if (ingredientExists.length === 0) {
      logger.warn(
        LogCategory.DATABASE,
        `Cannot delete ingredient: Ingredient with ID ${ingredientId} not found`,
      );
      return {
        success: false,
        error: `Ingredient with ID ${ingredientId} not found`,
      };
    }

    // Vérifier si l'ingrédient est référencé dans des repas
    const mealReferences = await db
      .select({ id: mealIngredients.id, mealId: mealIngredients.mealId })
      .from(mealIngredients)
      .where(eq(mealIngredients.ingredientStandardId, ingredientId));

    if (mealReferences.length > 0) {
      const mealIds = mealReferences
        .map((ref: { mealId: number }) => ref.mealId)
        .join(', ');
      logger.warn(
        LogCategory.DATABASE,
        `Cannot delete ingredient: Ingredient with ID ${ingredientId} is used in ${mealReferences.length} meal(s) (IDs: ${mealIds})`,
      );
      return {
        success: false,
        error: `Cannot delete ingredient: it is used in ${mealReferences.length} meal(s). Please remove it from these meals first.`,
        usedInMeals: true,
        mealIds: mealReferences.map((ref: { mealId: number }) => ref.mealId),
      };
    }

    // Utiliser une transaction pour supprimer l'ingrédient
    return await db.transaction(async (tx: typeof db) => {
      // Supprimer l'ingrédient
      await tx
        .delete(ingredientsStandard)
        .where(eq(ingredientsStandard.id, ingredientId));

      logger.info(
        LogCategory.DATABASE,
        `Successfully deleted ingredient ${ingredientId} via MCP Server`,
      );
      return { success: true };
    });
  } catch (error) {
    logger.error(
      LogCategory.DATABASE,
      `Error in handleDeleteIngredient: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
