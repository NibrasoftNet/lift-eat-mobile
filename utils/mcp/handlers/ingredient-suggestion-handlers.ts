import {
  SaveIngredientSuggestionParams,
  SaveIngredientSuggestionResult,
  GetIngredientSuggestionsParams,
  GetIngredientSuggestionsResult,
  UpdateIngredientSuggestionParams,
  UpdateIngredientSuggestionResult,
  DeleteIngredientSuggestionParams,
  DeleteIngredientSuggestionResult,
} from '../interfaces/ingredient-suggestion-interfaces';
import { ingredientSuggestions } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

/**
 * Handler pour la méthode saveIngredientSuggestionViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres pour la sauvegarde d'une suggestion d'ingrédient
 * @returns Résultat de l'opération avec l'ID de la suggestion créée
 */
export async function handleSaveIngredientSuggestion(
  db: any,
  params: SaveIngredientSuggestionParams,
): Promise<SaveIngredientSuggestionResult> {
  const { suggestion, userId, status = 'pending', source = 'ia' } = params;

  try {
    if (!db) throw new Error('Database not initialized');

    logger.info(
      LogCategory.DATABASE,
      `Saving ingredient suggestion "${suggestion.name}" for user ${userId}`,
    );

    // Vérifier si la suggestion existe déjà pour cet utilisateur
    const existingSuggestion = await db
      .select({ id: ingredientSuggestions.id })
      .from(ingredientSuggestions)
      .where(
        and(
          eq(ingredientSuggestions.name, suggestion.name),
          eq(ingredientSuggestions.userId, userId),
        ),
      )
      .limit(1);

    if (existingSuggestion.length > 0) {
      logger.info(
        LogCategory.DATABASE,
        `Suggestion for "${suggestion.name}" already exists with ID ${existingSuggestion[0].id}`,
      );
      return { success: true, suggestionId: existingSuggestion[0].id };
    }

    // Créer une nouvelle suggestion avec les données fournies
    const result = await db
      .insert(ingredientSuggestions)
      .values({
        name: suggestion.name,
        unit: suggestion.unit,
        quantity: suggestion.quantity || 100,
        suggested_calories: suggestion.calories || 0,
        suggested_carbs: suggestion.carbs || 0,
        suggested_protein: suggestion.protein || 0,
        suggested_fat: suggestion.fat || 0,
        suggestion_source: source,
        status: status,
        userId: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning({ id: ingredientSuggestions.id });

    if (!result || result.length === 0) {
      throw new Error('Failed to save ingredient suggestion');
    }

    const suggestionId = result[0].id;
    logger.info(
      LogCategory.DATABASE,
      `Created ingredient suggestion "${suggestion.name}" with ID ${suggestionId}`,
    );

    return { success: true, suggestionId };
  } catch (error) {
    logger.error(
      LogCategory.DATABASE,
      `Error in handleSaveIngredientSuggestion: ${
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
 * Handler pour la méthode getIngredientSuggestionsViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres pour la récupération des suggestions d'ingrédients
 * @returns Résultat de l'opération avec la liste des suggestions
 */
export async function handleGetIngredientSuggestions(
  db: any,
  params: GetIngredientSuggestionsParams,
): Promise<GetIngredientSuggestionsResult> {
  const { userId, status, limit = 50 } = params;

  try {
    if (!db) throw new Error('Database not initialized');

    logger.info(
      LogCategory.DATABASE,
      `Getting ingredient suggestions for user ${userId}`,
    );

    // Construire la requête de base
    let query = db
      .select()
      .from(ingredientSuggestions)
      .where(eq(ingredientSuggestions.userId, userId));

    // Ajouter un filtre sur le statut si spécifié
    if (status) {
      query = query.where(eq(ingredientSuggestions.status, status));
    }

    // Limiter le nombre de résultats
    query = query.limit(limit);

    // Exécuter la requête
    const suggestions = await query;

    logger.info(
      LogCategory.DATABASE,
      `Found ${suggestions.length} ingredient suggestions for user ${userId}`,
    );

    return { success: true, suggestions };
  } catch (error) {
    logger.error(
      LogCategory.DATABASE,
      `Error in handleGetIngredientSuggestions: ${
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
 * Handler pour la méthode updateIngredientSuggestionViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres pour la mise à jour d'une suggestion d'ingrédient
 * @returns Résultat de l'opération
 */
export async function handleUpdateIngredientSuggestion(
  db: any,
  params: UpdateIngredientSuggestionParams,
): Promise<UpdateIngredientSuggestionResult> {
  const { suggestionId, userId, status, data } = params;

  try {
    if (!db) throw new Error('Database not initialized');

    logger.info(
      LogCategory.DATABASE,
      `Updating ingredient suggestion ${suggestionId} for user ${userId}`,
    );

    // Vérifier si la suggestion existe et appartient à l'utilisateur
    const existingSuggestion = await db
      .select({ id: ingredientSuggestions.id })
      .from(ingredientSuggestions)
      .where(
        and(
          eq(ingredientSuggestions.id, suggestionId),
          eq(ingredientSuggestions.userId, userId),
        ),
      )
      .limit(1);

    if (existingSuggestion.length === 0) {
      return {
        success: false,
        error: `Suggestion ${suggestionId} not found or does not belong to user ${userId}`,
      };
    }

    // Préparer les données à mettre à jour
    const updateData: any = {
      status,
      updatedAt: new Date().toISOString(),
    };

    // Ajouter d'autres champs si fournis
    if (data) {
      if (data.name) updateData.name = data.name;
      if (data.unit) updateData.unit = data.unit;
      if (data.quantity) updateData.quantity = data.quantity;
      if (data.calories !== undefined)
        updateData.suggested_calories = data.calories;
      if (data.carbs !== undefined) updateData.suggested_carbs = data.carbs;
      if (data.protein !== undefined)
        updateData.suggested_protein = data.protein;
      if (data.fat !== undefined) updateData.suggested_fat = data.fat;
    }

    // Mettre à jour la suggestion
    await db
      .update(ingredientSuggestions)
      .set(updateData)
      .where(
        and(
          eq(ingredientSuggestions.id, suggestionId),
          eq(ingredientSuggestions.userId, userId),
        ),
      );

    logger.info(
      LogCategory.DATABASE,
      `Updated ingredient suggestion ${suggestionId} status to ${status}`,
    );

    return { success: true };
  } catch (error) {
    logger.error(
      LogCategory.DATABASE,
      `Error in handleUpdateIngredientSuggestion: ${
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
 * Handler pour la méthode deleteIngredientSuggestionViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres pour la suppression d'une suggestion d'ingrédient
 * @returns Résultat de l'opération
 */
export async function handleDeleteIngredientSuggestion(
  db: any,
  params: DeleteIngredientSuggestionParams,
): Promise<DeleteIngredientSuggestionResult> {
  const { suggestionId, userId } = params;

  try {
    if (!db) throw new Error('Database not initialized');

    logger.info(
      LogCategory.DATABASE,
      `Deleting ingredient suggestion ${suggestionId} for user ${userId}`,
    );

    // Vérifier si la suggestion existe et appartient à l'utilisateur
    const existingSuggestion = await db
      .select({ id: ingredientSuggestions.id })
      .from(ingredientSuggestions)
      .where(
        and(
          eq(ingredientSuggestions.id, suggestionId),
          eq(ingredientSuggestions.userId, userId),
        ),
      )
      .limit(1);

    if (existingSuggestion.length === 0) {
      return {
        success: false,
        error: `Suggestion ${suggestionId} not found or does not belong to user ${userId}`,
      };
    }

    // Supprimer la suggestion
    await db
      .delete(ingredientSuggestions)
      .where(
        and(
          eq(ingredientSuggestions.id, suggestionId),
          eq(ingredientSuggestions.userId, userId),
        ),
      );

    logger.info(
      LogCategory.DATABASE,
      `Deleted ingredient suggestion ${suggestionId}`,
    );

    return { success: true };
  } catch (error) {
    logger.error(
      LogCategory.DATABASE,
      `Error in handleDeleteIngredientSuggestion: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
