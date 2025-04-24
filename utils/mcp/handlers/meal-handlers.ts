import {
  GetMealsListParams,
  GetMealsListResult,
  GetMealDetailsParams,
  GetMealDetailsResult,
  CreateMealParams,
  CreateMealResult,
  UpdateMealParams,
  UpdateMealResult,
  DeleteMealParams,
  DeleteMealResult,
  AddMealToDailyPlanParams,
  AddMealToDailyPlanResult,
  UpdateMealQuantityInPlanParams,
  UpdateMealQuantityInPlanResult,
  CreateNewMealParams,
  CreateNewMealResult
} from '../interfaces/meal-interfaces';
import {
  meals,
  mealIngredients,
  ingredientsStandard,
  dailyPlan,
  dailyPlanMeals,
  users,
  plan,
  MealOrmProps,
  DailyPlanMealsOrmProps
} from '@/db/schema';
import { eq, and, like, inArray, or } from 'drizzle-orm';
import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { MealTypeEnum } from '@/utils/enum/meal.enum';

/**
 * Handler pour la méthode getMealsListViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres pour la récupération des repas
 * @returns Résultat de l'opération avec la liste des repas
 */
export async function handleGetMealsList(db: any, params: GetMealsListParams): Promise<GetMealsListResult> {
  const { userId, type, search, limit = 20 } = params;
  
  try {
    if (!db) throw new Error("Database not initialized");
    
    logger.info(LogCategory.DATABASE, `Getting meals list for user ${userId} via MCP Server`);
    
    // Créer une requête de base
    // Utiliser une annotation de type explicite pour query
    let query: any = db
      .select()
      .from(meals)
      .where(eq(meals.creatorId, userId));
    
    // Ajouter un filtre par type si spécifié
    if (type) {
      query = query.where(eq(meals.type, type));
    }
    
    // Ajouter une recherche par nom si spécifiée
    if (search && search.trim().length > 0) {
      const searchPattern = `%${search.trim().toLowerCase()}%`;
      query = query.where(like(meals.name, searchPattern));
    }
    
    // Limiter le nombre de résultats
    query = query.limit(limit);
    
    // Exécuter la requête et utiliser un nom de variable différent
    const mealsResult = await query;
    
    logger.info(LogCategory.DATABASE, `Retrieved ${mealsResult.length} meals for user ${userId} via MCP Server`);
    return { success: true, meals: mealsResult };
  } catch (error) {
    logger.error(LogCategory.DATABASE, `Error in handleGetMealsList: ${error instanceof Error ? error.message : String(error)}`);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

/**
 * Handler pour la méthode getMealDetailsViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres pour la récupération des détails d'un repas
 * @returns Résultat de l'opération avec les détails du repas et ses ingrédients
 */
export async function handleGetMealDetails(db: any, params: GetMealDetailsParams & { userId?: number }): Promise<GetMealDetailsResult> {
  const { mealId } = params;
  
  try {
    if (!db) throw new Error("Database not initialized");
    
    const { userId } = params;
    
    // Si un userId est fourni, l'utiliser pour filtrer les résultats (sécurité)
    logger.info(LogCategory.DATABASE, `Getting meal details for meal ${mealId}${userId ? ` and user ${userId}` : ''} via MCP Server`);
    
    // Récupérer les détails du repas
    let query = db
      .select()
      .from(meals)
      .where(eq(meals.id, mealId));
    
    // Si userId est fourni, filtrer par utilisateur pour garantir l'isolation des données
    if (userId) {
      query = query.where(eq(meals.creatorId, userId));
    }
    
    const mealDetails = await query.limit(1);
    
    if (mealDetails.length === 0) {
      logger.warn(LogCategory.DATABASE, `Meal with ID ${mealId} not found`);
      return { success: false, error: `Meal with ID ${mealId} not found` };
    }
    
    // Récupérer les ingrédients du repas avec leurs détails
    const mealIngredientsWithDetails = await db
      .select({
        id: mealIngredients.id,
        mealId: mealIngredients.mealId,
        ingredientStandardId: mealIngredients.ingredientStandardId,
        quantity: mealIngredients.quantity,
        ingredient: ingredientsStandard
      })
      .from(mealIngredients)
      .leftJoin(ingredientsStandard, eq(mealIngredients.ingredientStandardId, ingredientsStandard.id))
      .where(eq(mealIngredients.mealId, mealId));
    
    logger.info(LogCategory.DATABASE, `Retrieved meal details and ${mealIngredientsWithDetails.length} ingredients for meal ${mealId} via MCP Server`);
    return { 
      success: true, 
      meal: mealDetails[0], 
      ingredients: mealIngredientsWithDetails 
    };
  } catch (error) {
    logger.error(LogCategory.DATABASE, `Error in handleGetMealDetails: ${error instanceof Error ? error.message : String(error)}`);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

/**
 * Handler pour la méthode createMealViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres pour la création du repas
 * @returns Résultat de l'opération avec l'ID du repas créé
 */
export async function handleCreateMeal(db: any, params: CreateMealParams): Promise<CreateMealResult> {
  const { data, userId } = params;
  
  try {
    if (!db) throw new Error("Database not initialized");
    
    logger.info(LogCategory.DATABASE, `Creating meal for user ${userId} via MCP Server`);
    
    // Vérifier que l'utilisateur existe
    const userExists = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
      
    if (userExists.length === 0) {
      logger.warn(LogCategory.DATABASE, `Cannot create meal: User with ID ${userId} not found`);
      return { success: false, error: `User with ID ${userId} not found` };
    }
    
    // Insérer le repas
    const [insertedMeal] = await db
      .insert(meals)
      .values(data)
      .returning({ id: meals.id });
    
    logger.info(LogCategory.DATABASE, `Successfully created meal ${insertedMeal.id} for user ${userId} via MCP Server`);
    return { success: true, mealId: insertedMeal.id };
  } catch (error) {
    logger.error(LogCategory.DATABASE, `Error in handleCreateMeal: ${error instanceof Error ? error.message : String(error)}`);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

/**
 * Handler pour la méthode addMealToDailyPlanViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres pour l'ajout d'un repas à un plan journalier
 * @returns Résultat de l'opération avec l'ID de la relation créée
 */
export async function handleAddMealToDailyPlan(db: any, params: AddMealToDailyPlanParams): Promise<AddMealToDailyPlanResult> {
  const { dailyPlanId, mealId, quantity } = params;
  
  try {
    if (!db) throw new Error("Database not initialized");
    
    logger.info(LogCategory.DATABASE, `Adding meal ${mealId} to daily plan ${dailyPlanId} (quantity: ${quantity}) via MCP Server`);
    
    // 1. Vérification que le repas existe
    const meal = await db.query.meals.findFirst({
      where: eq(meals.id, mealId),
    });

    if (!meal) {
      logger.warn(LogCategory.DATABASE, `Cannot add meal: Meal with ID ${mealId} not found`);
      return { success: false, error: `Meal with ID ${mealId} not found` };
    }

    // 2. Vérification que le plan journalier existe
    const currentDailyPlan = await db.query.dailyPlan.findFirst({
      where: eq(dailyPlan.id, dailyPlanId),
    });

    if (!currentDailyPlan) {
      logger.warn(LogCategory.DATABASE, `Cannot add meal: Daily plan with ID ${dailyPlanId} not found`);
      return { success: false, error: `Daily plan with ID ${dailyPlanId} not found` };
    }

    // 3. Vérification que la relation repas-plan n'existe pas déjà
    const existingRelation = await db.query.dailyPlanMeals.findFirst({
      where: (fields: any) => 
        eq(dailyPlanMeals.dailyPlanId, dailyPlanId) && 
        eq(dailyPlanMeals.mealId, mealId)
    });

    if (existingRelation) {
      logger.warn(LogCategory.DATABASE, `Meal ${mealId} is already in daily plan ${dailyPlanId}`);
      return { success: false, error: `This meal is already in this daily plan` };
    }

    // Utiliser une transaction pour assurer l'intégrité des données
    return await db.transaction(async (tx: typeof db) => {
      // Calculer le ratio pour la nouvelle quantité basée sur le repas original
      const ratio = quantity / meal.quantity;

      // Calculer les valeurs nutritionnelles ajustées en fonction du ratio
      const adjustedCalories = meal.calories * ratio;
      const adjustedCarbs = meal.carbs * ratio;
      const adjustedFat = meal.fat * ratio;
      const adjustedProtein = meal.protein * ratio;

      // 4. Insérer la relation repas-plan avec les valeurs ajustées
      const [insertedRelation] = await tx
        .insert(dailyPlanMeals)
        .values({
          dailyPlanId,
          mealId,
          quantity,
          calories: adjustedCalories,
          carbs: adjustedCarbs,
          fat: adjustedFat,
          protein: adjustedProtein,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .returning({ id: dailyPlanMeals.id });

      // 5. Mettre à jour les valeurs nutritionnelles du plan journalier
      await tx
        .update(dailyPlan)
        .set({
          calories: currentDailyPlan.calories + adjustedCalories,
          carbs: currentDailyPlan.carbs + adjustedCarbs,
          fat: currentDailyPlan.fat + adjustedFat,
          protein: currentDailyPlan.protein + adjustedProtein,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(dailyPlan.id, dailyPlanId));

      // 6. Mettre à jour les statistiques totales du plan principal
      const planId = currentDailyPlan.planId;

      // Récupérer tous les plans journaliers du plan principal
      const allDailyPlans = await tx.query.dailyPlan.findMany({
        where: eq(dailyPlan.planId, planId),
      });

      // Calculer les valeurs nutritionnelles totales pour le plan
      const totalCalories = allDailyPlans.reduce(
        (sum: number, dp: { calories: number }) => sum + dp.calories,
        0,
      );
      const totalCarbs = allDailyPlans.reduce((sum: number, dp: { carbs: number }) => sum + dp.carbs, 0);
      const totalFat = allDailyPlans.reduce((sum: number, dp: { fat: number }) => sum + dp.fat, 0);
      const totalProtein = allDailyPlans.reduce(
        (sum: number, dp: { protein: number }) => sum + dp.protein,
        0,
      );

      // Mettre à jour le plan avec les nouveaux totaux
      await tx
        .update(plan)
        .set({
          calories: totalCalories,
          carbs: totalCarbs,
          fat: totalFat,
          protein: totalProtein,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(plan.id, planId));

      logger.info(LogCategory.DATABASE, `Successfully added meal ${mealId} to daily plan ${dailyPlanId} via MCP Server`);
      return { success: true, relationId: insertedRelation.id };
    });
  } catch (error) {
    logger.error(LogCategory.DATABASE, `Error in handleAddMealToDailyPlan: ${error instanceof Error ? error.message : String(error)}`);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

/**
 * Handler pour la méthode createNewMealViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres pour la création d'un nouveau repas avec ses ingrédients
 * @returns Résultat de l'opération avec l'ID du repas créé
 */
export async function handleCreateNewMeal(db: any, params: CreateNewMealParams): Promise<CreateNewMealResult> {
  const { data, selectedIngredients, totalMacros, creatorId } = params;
  
  try {
    if (!db) throw new Error("Database not initialized");
    
    // Utiliser une transaction pour assurer l'intégrité des données
    return await db.transaction(async (tx: typeof db) => {
      logger.info(LogCategory.DATABASE, `Creating new meal "${data.name}" via MCP Server`);
      
      // 1. Créer le repas
      const newMeal = {
        ...data,
        calories: totalMacros.totalCalories,
        carbs: totalMacros.totalCarbs,
        fat: totalMacros.totalFats,
        protein: totalMacros.totalProtein,
        creatorId,
        image: data.image ?? null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const insertedMeal = await tx
        .insert(meals)
        .values(newMeal)
        .returning({ id: meals.id });
      
      if (!insertedMeal || insertedMeal.length === 0) {
        throw new Error('Failed to insert meal');
      }
      
      const mealId = insertedMeal[0].id;
      logger.info(LogCategory.DATABASE, `Created meal with ID ${mealId}`);
      
      // 2. Ajouter les ingrédients si fournis
      if (selectedIngredients && selectedIngredients.length > 0) {
        logger.info(LogCategory.DATABASE, `Adding ${selectedIngredients.length} ingredients to meal ${mealId}`);
        
        const mealIngredientsData = selectedIngredients.map((ingredient) => ({
          mealId: mealId,
          ingredientStandardId: ingredient.ingredientStandardId,
          quantity: ingredient.quantity,
          calories: ingredient.calories,
          carbs: ingredient.carbs,
          fat: ingredient.fat,
          protein: ingredient.protein,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));
        
        await tx.insert(mealIngredients).values(mealIngredientsData);
        logger.info(LogCategory.DATABASE, `Added ${selectedIngredients.length} ingredients to meal ${mealId}`);
      }

      return { success: true, mealId };
    });
  } catch (error) {
    logger.error(LogCategory.DATABASE, `Error in handleCreateNewMeal: ${error instanceof Error ? error.message : String(error)}`);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

/**
 * Handler pour la méthode updateMealViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres pour la mise à jour du repas
 * @returns Résultat de l'opération
 */
export async function handleUpdateMeal(db: any, params: UpdateMealParams): Promise<UpdateMealResult> {
  try {
    if (!db) throw new Error("Database not initialized");
    
    const { mealId, data, ingredients, userId } = params;
    
    if (!userId) {
      logger.error(LogCategory.DATABASE, `Attempted to update meal ${mealId} without providing userId`);
      return { success: false, error: 'User ID is required for updating meals' };
    }
    
    logger.info(LogCategory.DATABASE, `Updating meal ${mealId} for user ${userId} via MCP Server`);
    
    // Vérifier si le repas existe et appartient à l'utilisateur
    const mealExists = await db
      .select({ id: meals.id, creatorId: meals.creatorId })
      .from(meals)
      .where(
        and(
          eq(meals.id, mealId),
          eq(meals.creatorId, userId) // Vérification de sécurité: l'utilisateur doit être créateur du repas
        )
      )
      .limit(1);
    
    if (!mealExists.length) {
      logger.warn(LogCategory.DATABASE, `Meal with ID ${mealId} not found or does not belong to user ${userId}`);
      return { 
        success: false, 
        error: `Meal with ID ${mealId} not found or does not belong to you` 
      };
    }
    
    // Utiliser une transaction pour mettre à jour le repas et éventuellement ses ingrédients
    await db.transaction(async (tx: any) => {
      // Mettre à jour le repas
      await tx
        .update(meals)
        .set({
          ...data,
          updatedAt: new Date().toISOString()
        })
        .where(eq(meals.id, mealId));
      
      logger.info(LogCategory.DATABASE, `Updated meal ${mealId}`);
      
      // Si des ingrédients sont fournis, les mettre à jour
      if (ingredients && ingredients.length > 0) {
        // D'abord, supprimer les ingrédients existants
        await tx
          .delete(mealIngredients)
          .where(eq(mealIngredients.mealId, mealId));
        
        logger.info(LogCategory.DATABASE, `Deleted existing ingredients for meal ${mealId}`);
        
        // Ensuite, ajouter les nouveaux ingrédients
        const mealIngredientsData = ingredients.map(ingredient => ({
          mealId,
          ingredientId: ingredient.ingredientId,
          quantity: ingredient.quantity || 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));
        
        await tx.insert(mealIngredients).values(mealIngredientsData);
        logger.info(LogCategory.DATABASE, `Added ${ingredients.length} new ingredients to meal ${mealId}`);
      }
    });
    
    return { success: true };
  } catch (error) {
    logger.error(LogCategory.DATABASE, `Error in handleUpdateMeal: ${error instanceof Error ? error.message : String(error)}`);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

/**
 * Handler pour la méthode deleteMealViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres pour la suppression du repas
 * @returns Résultat de l'opération
 */
export async function handleDeleteMeal(db: any, params: DeleteMealParams): Promise<DeleteMealResult> {
  const { mealId, userId } = params;
  
  try {
    if (!db) throw new Error("Database not initialized");
    
    if (!userId) {
      logger.error(LogCategory.DATABASE, `Attempted to delete meal ${mealId} without providing userId`);
      return { success: false, error: 'User ID is required for deleting meals' };
    }
    
    logger.info(LogCategory.DATABASE, `Deleting meal ${mealId} for user ${userId} via MCP Server`);
    
    // Vérifier que le repas existe et appartient à l'utilisateur
    const mealExists = await db
      .select({ id: meals.id, creatorId: meals.creatorId })
      .from(meals)
      .where(
        and(
          eq(meals.id, mealId),
          eq(meals.creatorId, userId) // Vérification de sécurité: l'utilisateur doit être créateur du repas
        )
      )
      .get();
    
    if (!mealExists) {
      logger.warn(LogCategory.DATABASE, `Meal ${mealId} not found for deletion`);
      return { 
        success: false, 
        error: `Meal with ID ${mealId} not found` 
      };
    }
    
    // Utiliser une transaction pour assurer l'intégrité des données
    await db.transaction(async (tx: any) => {
      // Supprimer les relations avec les ingrédients
      await tx
        .delete(mealIngredients)
        .where(eq(mealIngredients.mealId, mealId));
      
      logger.info(LogCategory.DATABASE, `Deleted ingredients for meal ${mealId}`);
      
      // Vérifier si ce repas est utilisé dans un plan journalier
      const mealInPlans = await tx
        .select({ id: dailyPlanMeals.id })
        .from(dailyPlanMeals)
        .where(eq(dailyPlanMeals.mealId, mealId))
        .all();
      
      if (mealInPlans.length > 0) {
        // Supprimer les relations avec les plans journaliers
        await tx
          .delete(dailyPlanMeals)
          .where(eq(dailyPlanMeals.mealId, mealId));
        
        logger.info(LogCategory.DATABASE, `Deleted ${mealInPlans.length} plan relations for meal ${mealId}`);
      }
      
      // Supprimer le repas
      await tx
        .delete(meals)
        .where(eq(meals.id, mealId));
      
      logger.info(LogCategory.DATABASE, `Successfully deleted meal ${mealId}`);
    });
    
    return { success: true };
  } catch (error) {
    logger.error(LogCategory.DATABASE, `Error in handleDeleteMeal: ${error instanceof Error ? error.message : String(error)}`);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}
