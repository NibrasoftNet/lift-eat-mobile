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
import { eq, and, like, inArray, or, desc, SQL } from 'drizzle-orm';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { MealTypeEnum } from '@/utils/enum/meal.enum';
import { CuisineTypeEnum } from '@/utils/enum/meal.enum';
import { nutritionCoreService } from '@/utils/services/core/nutrition-core.service';
import { STANDARD_WEIGHT } from '@/utils/constants/CookingConstants';

/**
 * Handler pour la méthode getMealsListViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres pour la récupération des repas
 * @returns Résultat de l'opération avec la liste des repas
 */
export async function handleGetMealsList(db: any, params: GetMealsListParams): Promise<GetMealsListResult> {
  const { userId, type, search, limit = 20, filter, cuisine } = params;
  
  try {
    if (!db) throw new Error("Database not initialized");
    
    logger.info(LogCategory.DATABASE, `Getting meals list for user ${userId} with filter ${filter} via MCP Server`);
    
    // Par défaut, nous voulons que les repas soient classés par la date de dernière mise à jour (updatedAt)
    // afin que les modifications récentes soient reflétées dans l'onglet "Recent".
    // Nous utilisons updatedAt pour l'ordre décroissant. Si updatedAt n'est pas défini
    // (cas peu probable car la colonne possède une valeur par défaut), Drizzle renverra NULL
    // et les repas ne seront pas pris en compte comme récents, ce qui est acceptable.
    let query: any = db.select().from(meals).orderBy(desc(meals.updatedAt));

    const conditions: SQL[] = [];

    if (filter === 'favorites') {
      conditions.push(eq(meals.isFavorite, true));
    } else if (filter === 'personal') {
      conditions.push(eq(meals.creatorId, userId));
    } else {
      // Par défaut (recent), on ne filtre que par l'utilisateur, ce qui est déjà implicite
      // ou peut être ajouté si nécessaire en fonction de la logique globale.
      // Pour l'instant, on considère que 'recent' ne nécessite pas de filtre créateur spécifique
      // si tous les repas sont liés à un utilisateur.
    }

    if (type) {
      conditions.push(eq(meals.type, type));
    }

    if (cuisine) {
      conditions.push(eq(meals.cuisine, cuisine));
    }

    if (search && search.trim().length > 0) {
      const searchPattern = `%${search.trim().toLowerCase()}%`;
      conditions.push(like(meals.name, searchPattern));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    query = query.limit(limit);

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
    
    // Récupérer les détails du repas avec la bonne combinaison de filtres
    const mealDetails = await db
      .select()
      .from(meals)
      .where(
        userId 
          ? and(eq(meals.id, mealId), eq(meals.creatorId, userId))
          : eq(meals.id, mealId)
      )
      .limit(1);
    
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
  const { data, userId, ingredients } = params;
  
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
    
    // Utiliser une transaction pour garantir l'atomicité
    return await db.transaction(async (tx: any) => {
      // Calculer le poids total des ingrédients si disponibles
      let totalWeight = 0; // Commencer à 0 au lieu de 100
      
      if (ingredients && ingredients.length > 0) {
        // Calculer la somme des quantités des ingrédients
        totalWeight = ingredients.reduce((sum, ingredient) => sum + (ingredient.quantity || 0), 0);
        logger.info(LogCategory.NUTRITION, `Calculated total weight for meal: ${totalWeight}g from ${ingredients.length} ingredients`);
      }
      
      // Si le poids total est trop faible, utiliser une valeur minimale
      const MIN_WEIGHT = 0.01; // Valeur minimale de poids (cohérente avec nutrition.helper.ts)
      if (totalWeight < MIN_WEIGHT) {
        logger.warn(LogCategory.NUTRITION, `Invalid total weight (${totalWeight}g), using minimum value of ${MIN_WEIGHT}g`);
        totalWeight = MIN_WEIGHT;
      }
      
      // Normaliser les macros pour 100g si nécessaire
      type MacroValues = { calories: number; carbs: number; protein: number; fat: number; };
      let normalizedMacros: Partial<MacroValues> = {};
      
      if (data.calories !== undefined || data.carbs !== undefined || 
          data.protein !== undefined || data.fat !== undefined) {
        const originalMacros: MacroValues = {
          calories: data.calories || 0,
          carbs: data.carbs || 0,
          protein: data.protein || 0,
          fat: data.fat || 0
        };
        
        // Si le poids total n'est pas 100g, normaliser les macros
        if (Math.abs(totalWeight - STANDARD_WEIGHT) > 0.01) {
          logger.info(LogCategory.NUTRITION, `Normalizing meal macros from ${totalWeight}g to ${STANDARD_WEIGHT}g`);
          const normalizationFactor = STANDARD_WEIGHT / totalWeight;
          
          normalizedMacros = {
            calories: Math.round(originalMacros.calories * normalizationFactor),
            carbs: +(originalMacros.carbs * normalizationFactor).toFixed(2),
            protein: +(originalMacros.protein * normalizationFactor).toFixed(2),
            fat: +(originalMacros.fat * normalizationFactor).toFixed(2)
          };
          
          logger.info(LogCategory.NUTRITION, 
            `Normalized macros: calories ${originalMacros.calories} => ${normalizedMacros.calories}, ` +
            `carbs ${originalMacros.carbs} => ${normalizedMacros.carbs}, ` +
            `protein ${originalMacros.protein} => ${normalizedMacros.protein}, ` +
            `fat ${originalMacros.fat} => ${normalizedMacros.fat}`);
        } else {
          normalizedMacros = originalMacros;
        }
      }
      
      // Mettre à jour les données du repas avec quantité standardisée à 100g
      const mealData = {
        ...data,
        ...normalizedMacros,
        quantity: STANDARD_WEIGHT // Toujours standardiser à 100g
      };
      
      // Normaliser les ingrédients si nécessaire
      // Initialement, utiliser les ingrédients d'origine ou un tableau vide si undefined
      let normalizedIngredients = ingredients || [];
      
      if (ingredients && ingredients.length > 0 && Math.abs(totalWeight - STANDARD_WEIGHT) > 0.01) {
        logger.info(LogCategory.NUTRITION, `Normalizing ingredients from ${totalWeight}g to ${STANDARD_WEIGHT}g`);
        // Utiliser la fonction de normalisation que nous avons créée
        const result = nutritionCoreService.normalizeIngredientsTo100g(ingredients, totalWeight);
        // S'assurer que normalizedIngredients n'est jamais undefined
        normalizedIngredients = result.normalizedIngredients || ingredients || [];
        
        logger.info(LogCategory.NUTRITION, 
          `Applied normalization factor of ${result.normalizationFactor.toFixed(4)}x to ingredients. ` +
          `New total weight: ${result.totalWeightAfter.toFixed(2)}g`);
      }
      
      // 1. Insérer le repas avec le poids total mis à jour
      const [insertedMeal] = await tx
        .insert(meals)
        .values(mealData)
        .returning({ id: meals.id });
      
      const mealId = insertedMeal.id;
      logger.info(LogCategory.DATABASE, `Successfully created meal ${mealId} for user ${userId} with total weight ${totalWeight}g via MCP Server`);
      
      // Déclarer missingIngredients au niveau de la transaction
      let missingIngredients: any[] = [];
      
      // 2. Ajouter les ingrédients si fournis
      if (ingredients && ingredients.length > 0) {
        logger.info(LogCategory.DATABASE, `Verifying and adding ${ingredients.length} ingredients to meal ${mealId}`);
        
        // Récupérer les IDs des ingrédients fournis
        const ingredientIds = ingredients.map(ingredient => ingredient.id);
        
        // Vérifier que tous les ingrédients existent dans la base de données
        const existingIngredients = await tx
          .select({ id: ingredientsStandard.id })
          .from(ingredientsStandard)
          .where(inArray(ingredientsStandard.id, ingredientIds));
        
        const existingIngredientIds = existingIngredients.map((ing: { id: number }) => ing.id);
        const missingIngredientIds = ingredientIds.filter(id => !existingIngredientIds.includes(id));
        
        // Identifier les ingrédients manquants pour les suggestions
        missingIngredients = ingredients.filter(ingredient => 
          !existingIngredientIds.includes(ingredient.id)
        );

        if (missingIngredientIds.length > 0) {
          logger.warn(LogCategory.DATABASE, `Some ingredients don't exist in the database: ${missingIngredientIds.join(', ')}`);
          
          // L'identification des ingrédients manquants est déjà faite au-dessus
          
          // Filtrer les ingrédients pour ne garder que ceux qui existent
          const validIngredients = ingredients.filter(ingredient => 
            existingIngredientIds.includes(ingredient.id)
          );
          
          if (validIngredients.length === 0) {
            logger.error(LogCategory.DATABASE, `No valid ingredients found for meal ${mealId}`);
            // Retourner les ingrédients manquants même en cas d'échec
            return { 
              success: false, 
              error: 'No valid ingredients provided',
              missingIngredients: missingIngredients
            };
          }
          
          logger.info(LogCategory.DATABASE, `Proceeding with ${validIngredients.length} valid ingredients out of ${ingredients.length}`);
          
          // Mettre à jour la liste d'ingrédients avec uniquement ceux qui sont valides
          // Trouver l'ingrédient normalisé correspondant à chaque ingrédient valide
          const mealIngredientsData = validIngredients.map((ingredient) => {
            // Chercher l'ingrédient normalisé correspondant
            const normalizedVersion = normalizedIngredients.find(ni => ni.id === ingredient.id);
            
            return {
              mealId: mealId,
              ingredientStandardId: ingredient.id,
              // Utiliser la quantité normalisée si disponible
              quantity: (normalizedVersion?.quantity !== undefined) ? normalizedVersion.quantity : (ingredient.quantity || 0),
              // Utiliser les valeurs nutritionnelles normalisées si disponibles
              calories: (normalizedVersion?.calories !== undefined) ? normalizedVersion.calories : (ingredient.calories || 0),
              carbs: (normalizedVersion?.carbs !== undefined) ? normalizedVersion.carbs : (ingredient.carbs || 0),
              fat: (normalizedVersion?.fat !== undefined) ? normalizedVersion.fat : (ingredient.fat || 0),
              protein: (normalizedVersion?.protein !== undefined) ? normalizedVersion.protein : (ingredient.protein || 0),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
          });
          
          await tx.insert(mealIngredients).values(mealIngredientsData);
          logger.info(LogCategory.DATABASE, `Added ${validIngredients.length} valid ingredients to meal ${mealId}`);
        } else {
          // Tous les ingrédients existent, continuer normalement
          // Utiliser les ingrédients normalisés directement
          const mealIngredientsData = normalizedIngredients.map((ingredient) => ({
            mealId: mealId,
            ingredientStandardId: ingredient.id,
            quantity: ingredient.quantity || 0,
            calories: ingredient.calories || 0,
            carbs: ingredient.carbs || 0,
            fat: ingredient.fat || 0,
            protein: ingredient.protein || 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }));
          
          await tx.insert(mealIngredients).values(mealIngredientsData);
          logger.info(LogCategory.DATABASE, `Added ${ingredients.length} ingredients to meal ${mealId}`);
        }
      } else {
        logger.info(LogCategory.DATABASE, `No ingredients provided for meal ${mealId}`);
      }
      
      // Retourner les ingrédients manquants avec le résultat réussi
      return { 
        success: true, 
        mealId,
        missingIngredients: missingIngredients || []
      };
    });
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

    // Note: Nous permettons d'ajouter plusieurs fois le même repas dans un plan journalier
    // Ce comportement est désiré pour permettre d'ajouter le même repas à différents moments de la journée
    // ou pour différentes portions

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

      // 6. **Suppression** de la mise à jour du plan principal pour préserver les objectifs nutritionnels originaux
      //     (Les totaux peuvent désormais être calculés à la volée via des requêtes si nécessaire.)
      // const planId = currentDailyPlan.planId;

      // Récupérer tous les plans journaliers du plan principal
      // const allDailyPlans = await tx.query.dailyPlan.findMany({
      //   where: eq(dailyPlan.planId, planId),
      // });

      // Calculer les valeurs nutritionnelles totales pour le plan
      // const totalCalories = allDailyPlans.reduce(
      //   (sum: number, dp: { calories: number }) => sum + dp.calories,
      //   0,
      // );
      // const totalCarbs = allDailyPlans.reduce((sum: number, dp: { carbs: number }) => sum + dp.carbs, 0);
      // const totalFat = allDailyPlans.reduce((sum: number, dp: { fat: number }) => sum + dp.fat, 0);
      // const totalProtein = allDailyPlans.reduce(
      //   (sum: number, dp: { protein: number }) => sum + dp.protein,
      //   0,
      // );

      // Mettre à jour le plan avec les nouveaux totaux
      // await tx
      //   .update(plan)
      //   .set({
      //     calories: totalCalories,
      //     carbs: totalCarbs,
      //     fat: totalFat,
      //     protein: totalProtein,
      //     updatedAt: new Date().toISOString(),
      //   })
      //   .where(eq(plan.id, planId));

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
      
      // Calculer le poids total des ingrédients
      let totalWeight = 0;
      if (selectedIngredients && selectedIngredients.length > 0) {
        totalWeight = selectedIngredients.reduce(
          (sum, ingredient) => sum + (ingredient.quantity || 0), 
          0
        );
        logger.info(LogCategory.NUTRITION, `Calculated total weight for new meal: ${totalWeight}g from ${selectedIngredients.length} ingredients`);
      }
      
      // Si le poids total est trop faible, utiliser une valeur minimale
      const MIN_WEIGHT = 0.01;
      if (totalWeight < MIN_WEIGHT) {
        logger.warn(LogCategory.NUTRITION, `Invalid total weight (${totalWeight}g), using minimum value of ${MIN_WEIGHT}g`);
        totalWeight = MIN_WEIGHT;
      }
      
      // Les macros reçues depuis le formulaire sont déjà exprimées pour 100 g.
      // Nous évitons une nouvelle normalisation ici afin de ne pas appliquer deux fois le facteur.
      type MacroValues = { totalCalories: number; totalCarbs: number; totalFats: number; totalProtein: number; };
      let normalizedMacros: MacroValues = { ...totalMacros };
      
      // 1. Créer le repas avec quantité standardisée à 100g
      const newMeal = {
        ...data,
        calories: normalizedMacros.totalCalories,
        carbs: normalizedMacros.totalCarbs,
        fat: normalizedMacros.totalFats,
        protein: normalizedMacros.totalProtein,
        quantity: STANDARD_WEIGHT, // Fixer la quantité à 100g
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
      
      // 2. Normaliser et ajouter les ingrédients si fournis
      if (selectedIngredients && selectedIngredients.length > 0) {
        logger.info(LogCategory.DATABASE, `Adding ${selectedIngredients.length} ingredients to meal ${mealId}`);
        
        // Normaliser les ingrédients si nécessaire
        let normalizedIngredients = selectedIngredients;
        if (Math.abs(totalWeight - STANDARD_WEIGHT) > 0.01) {
          logger.info(LogCategory.NUTRITION, `Normalizing ingredients from ${totalWeight}g to ${STANDARD_WEIGHT}g`);
          // Utiliser la fonction de normalisation du nutritionCoreService
          const result = nutritionCoreService.normalizeIngredientsTo100g(selectedIngredients, totalWeight);
          normalizedIngredients = result.normalizedIngredients || selectedIngredients;
          
          logger.info(LogCategory.NUTRITION, 
            `Applied normalization factor of ${result.normalizationFactor.toFixed(4)}x to ingredients. ` +
            `New total weight: ${result.totalWeightAfter.toFixed(2)}g`);
        }
        
        const mealIngredientsData = normalizedIngredients.map((ingredient) => ({
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
      // Vérifier si l'image est présente dans les données (URI ou format direct)
      const hasImageUri = 'imageUri' in data;
      const hasDirectImage = 'image' in data && !!data.image;
      
      // Logs améliorés pour une meilleure compréhension de l'état
      logger.info(LogCategory.DATABASE, `Updating meal ${mealId} with data`, { 
        hasDirectImage: hasDirectImage,
        hasImageUri: hasImageUri,
        imageSource: hasImageUri ? 'imageUri' : (hasDirectImage ? 'image' : 'none'),
        dataKeys: Object.keys(data)
      });
      
      // --- Recalcul nutrition & normalisation si des ingrédients sont fournis ---
      let normalizedIngredients = ingredients || [];
      let normalizedMacros = {
        totalCalories: data.calories || 0,
        totalCarbs: data.carbs || 0,
        totalFats: data.fat || 0,
        totalProtein: data.protein || 0,
      };

      if (ingredients && ingredients.length > 0) {
        const totalWeight = ingredients.reduce((sum, ing) => sum + (ing.quantity || 0), 0);
        logger.info(LogCategory.NUTRITION, `Total weight before update normalisation: ${totalWeight}g`);

        // Appliquer normalisation à 100g si nécessaire
        if (Math.abs(totalWeight - STANDARD_WEIGHT) > 0.01) {
          const { normalizedIngredients: nIngs, normalizationFactor } =
            nutritionCoreService.normalizeIngredientsTo100g(ingredients, totalWeight);

          normalizedIngredients = nIngs || ingredients;
          logger.info(
            LogCategory.NUTRITION,
            `Applied normalization factor of ${normalizationFactor.toFixed(4)}x to ingredients for update.`
          );
        }

        // Recalculer les macros du repas sur la base des ingrédients normalisés
        // Les macros stockés sur chaque ingrédient correspondent à 100 g de cet ingrédient.
        // Il faut donc les ramener à la quantité réelle de l'ingrédient avant somme.
        normalizedMacros = normalizedIngredients.reduce(
          (acc, ing) => {
            const qty = ing.quantity || 0; // quantité réelle en grammes
            const factor = qty / STANDARD_WEIGHT; // proportion du référentiel 100 g
            acc.totalCalories += (ing.calories || 0) * factor;
            acc.totalCarbs    += (ing.carbs    || 0) * factor;
            acc.totalFats     += (ing.fat      || 0) * factor;
            acc.totalProtein  += (ing.protein  || 0) * factor;

            return acc;
          },
          { totalCalories: 0, totalCarbs: 0, totalFats: 0, totalProtein: 0 }
        );
        // Arrondir proprement pour le stockage
        normalizedMacros.totalCalories = Math.round(normalizedMacros.totalCalories);
        normalizedMacros.totalCarbs    = +normalizedMacros.totalCarbs.toFixed(2);
        normalizedMacros.totalFats     = +normalizedMacros.totalFats.toFixed(2);
        normalizedMacros.totalProtein  = +normalizedMacros.totalProtein.toFixed(2);
      }

      // Préparer les données pour la mise à jour
      // Ne pas écraser les macros nutritionnelles existantes si elles ne sont pas
      // fournies ou recalculées. Cela évite de remettre les valeurs à 0 lors
      // d'une simple mise à jour (ex. changement de favori).
      const updateData: any = {
        ...data,
        updatedAt: new Date().toISOString(),
      };

      // Si des ingrédients sont fournis, nous recalculons et remplaçons toujours
      // les valeurs nutritionnelles ainsi que la quantité de référence.
      if (ingredients && ingredients.length > 0) {
        updateData.calories = normalizedMacros.totalCalories;
        updateData.carbs    = normalizedMacros.totalCarbs;
        updateData.fat      = normalizedMacros.totalFats;
        updateData.protein  = normalizedMacros.totalProtein;
        updateData.quantity = STANDARD_WEIGHT;
      }
      // Si aucune liste d'ingrédients n'est transmise, nous ne modifions les
      // macros que si elles sont explicitement présentes dans les données.
      // Sinon, elles restent inchangées dans la base de données.

      
      // Si nous avons reçu une imageUri (string), la convertir et l'assigner au champ image (blob)
      if (hasImageUri) {
        // Utiliser l'URI comme chaîne pour le champ image (sera interprété correctement par SQLite)
        updateData.image = (data as any).imageUri;
        // Supprimer le champ imageUri car il n'existe pas dans le schéma
        delete (updateData as any).imageUri;
        logger.info(LogCategory.DATABASE, `Converted imageUri to image field for meal ${mealId}`);
      }
      
      // Mettre à jour le repas
      await tx
        .update(meals)
        .set(updateData)
        .where(eq(meals.id, mealId));
      
      logger.info(LogCategory.DATABASE, `Updated meal ${mealId}`);
      
      // Si des ingrédients sont fournis, les mettre à jour
      if (normalizedIngredients && normalizedIngredients.length > 0) {
        // D'abord, supprimer les ingrédients existants
        await tx
          .delete(mealIngredients)
          .where(eq(mealIngredients.mealId, mealId));
        
        logger.info(LogCategory.DATABASE, `Deleted existing ingredients for meal ${mealId}`);
        
        // Ensuite, ajouter les nouveaux ingrédients, déjà normalisés
        const mealIngredientsData = normalizedIngredients.map(ingredient => ({
          mealId,
          ingredientStandardId: ingredient.ingredientStandardId,
          quantity: ingredient.quantity || 1,
          calories: ingredient.calories,
          carbs: ingredient.carbs,
          fat: ingredient.fat,
          protein: ingredient.protein,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));
        
        await tx.insert(mealIngredients).values(mealIngredientsData);
        logger.info(LogCategory.DATABASE, `Added ${normalizedIngredients.length} new ingredients to meal ${mealId}`);
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
