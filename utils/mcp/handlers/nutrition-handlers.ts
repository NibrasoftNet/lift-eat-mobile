import {
  CalculateNormalizedNutritionParams,
  NormalizedNutritionResult,
  GetMealWeightParams,
  GetMealWeightResult,
  GetMacroBreakdownParams,
  GetMacroBreakdownResult,
  MacroBreakdown,
  CalculateDailyPlanNutritionParams,
  DailyPlanNutritionResult
} from '../interfaces/nutrition-interfaces';
import { NutritionDisplayMode } from '@/utils/enum/nutrition.enum';
import {
  meals,
  mealIngredients,
  ingredientsStandard,
  dailyPlan,
  dailyPlanMeals,
  plan,
  MealOrmProps,
  MealIngredientsOrmProps,
  IngredientStandardOrmProps,
  DailyPlanOrmProps,
  DailyPlanMealsOrmProps,
  PlanOrmProps
} from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

// Constantes nutritionnelles
const STANDARD_WEIGHT = 100; // Poids standard pour la normalisation (en grammes)
const PROTEIN_CALORIES_PER_GRAM = 4;
const CARBS_CALORIES_PER_GRAM = 4;
const FATS_CALORIES_PER_GRAM = 9;

/**
 * Handler pour calculer les valeurs nutritionnelles normalisées selon le mode d'affichage spécifié
 * 
 * Version standardisée prenant en charge tous les modes d'affichage définis dans NutritionDisplayMode.
 * Les valeurs nutritionnelles en base de données sont toujours standardisées à 100g, cette fonction
 * applique les facteurs de normalisation appropriés selon le mode d'affichage.
 * 
 * @param db Instance de la base de données
 * @param params Paramètres pour le calcul incluant mode d'affichage et quantité
 * @returns Résultat avec les valeurs nutritionnelles normalisées et le facteur d'ajustement
 */
export async function handleCalculateNormalizedNutrition(
  db: any,
  params: CalculateNormalizedNutritionParams
): Promise<NormalizedNutritionResult> {
  const { mealId, userId, quantity, displayMode } = params;
  
  try {
    if (!db) throw new Error("Database not initialized");
    
    logger.info(LogCategory.NUTRITION, `Calculating normalized nutrition for meal ${mealId}`);
    
    // 1. Récupérer les détails du repas
    let query = db
      .select()
      .from(meals)
      .where(eq(meals.id, mealId));
    
    // Sécurité: vérifier si le repas appartient à l'utilisateur si userId est fourni
    if (userId) {
      query = query.where(eq(meals.creatorId, userId));
    }
    
    const mealDetails = await query.get();
    
    if (!mealDetails) {
      logger.warn(LogCategory.NUTRITION, `Meal with ID ${mealId} not found`);
      return { success: false, error: `Meal with ID ${mealId} not found` };
    }
    
    // 2. Récupérer les ingrédients du repas avec leurs détails nutritionnels
    const ingredientsWithDetails = await db
      .select({
        mealIngredient: mealIngredients,
        ingredient: ingredientsStandard
      })
      .from(mealIngredients)
      .where(eq(mealIngredients.mealId, mealId))
      .leftJoin(ingredientsStandard, 
        eq(mealIngredients.ingredientStandardId, ingredientsStandard.id)
      );
    
    if (!ingredientsWithDetails || ingredientsWithDetails.length === 0) {
      logger.warn(LogCategory.NUTRITION, `No ingredients found for meal ${mealId}`);
      return { 
        success: false, 
        error: `No ingredients found for meal ${mealId}` 
      };
    }
    
    // 3. Utiliser le poids stocké dans le repas au lieu de recalculer
    // Cela garantit que nous utilisons le même poids que celui utilisé lors de la création du repas
    let totalWeight = mealDetails.quantity || 0;
    
    // Si le poids stocké est invalide, recalculer à partir des ingrédients (fallback)
    if (totalWeight <= 0) {
      logger.info(LogCategory.NUTRITION, `Meal weight not found in database (${totalWeight}g), calculating from ingredients`);
      
      for (const item of ingredientsWithDetails) {
        if (item.mealIngredient && item.mealIngredient.quantity) {
          totalWeight += item.mealIngredient.quantity;
        }
      }
    }
    
    logger.debug(LogCategory.NUTRITION, `Using meal weight: ${totalWeight}g for meal ${mealId}`);
    
    if (totalWeight <= 0) {
      logger.warn(LogCategory.NUTRITION, `Invalid total weight (${totalWeight}g) for meal ${mealId}`);
      return { 
        success: false, 
        error: `Invalid total weight (${totalWeight}g) for meal ${mealId}` 
      };
    }
    
    // 4. Déterminer le facteur de normalisation selon le mode d'affichage
    let adjustmentFactor = STANDARD_WEIGHT / totalWeight; // Par défaut, normaliser à 100g
    let displayText = "Pour 100g"; // Texte d'affichage par défaut
    
    // Si une quantité spécifique est fournie, l'utiliser pour le calcul
    const targetQuantity = quantity || mealDetails.quantity || STANDARD_WEIGHT;
    
    // Appliquer les règles de normalisation selon le mode d'affichage
    if (displayMode === NutritionDisplayMode.PER_SERVING) {
      // Normaliser pour une portion (quantité spécifiée)
      adjustmentFactor = targetQuantity / totalWeight;
      displayText = `Par portion (${targetQuantity}g)`;
    } else if (displayMode === NutritionDisplayMode.FULL) {
      // Valeurs pour le repas complet
      adjustmentFactor = 1;
      displayText = `Repas complet (${totalWeight}g)`;
    } else if (displayMode === NutritionDisplayMode.AS_IS) {
      // Valeurs telles quelles sans normalisation
      adjustmentFactor = 1;
      displayText = `Valeurs brutes (${totalWeight}g)`;
    }
    
    logger.info(LogCategory.NUTRITION, `Utilisation du mode d'affichage: ${displayMode}, facteur: ${adjustmentFactor.toFixed(2)}, texte: ${displayText}`);
    
    // 5. Calculer les valeurs nutritionnelles totales
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;
    
    for (const item of ingredientsWithDetails) {
      if (!item.ingredient || !item.mealIngredient) continue;
      
      const ingredientQuantity = item.mealIngredient.quantity || 0;
      const ingredient = item.ingredient;
      
      // Les valeurs nutritionnelles en DB sont pour 100g, donc on divise par 100
      if (ingredient.calories) totalCalories += (ingredient.calories * ingredientQuantity) / 100;
      if (ingredient.protein) totalProtein += (ingredient.protein * ingredientQuantity) / 100;
      if (ingredient.carbs) totalCarbs += (ingredient.carbs * ingredientQuantity) / 100;
      if (ingredient.fat) totalFats += (ingredient.fat * ingredientQuantity) / 100;
    }
    
    // 6. Appliquer le facteur de normalisation selon le mode d'affichage
    const normalizedNutrition = {
      calories: Math.round(totalCalories * adjustmentFactor),
      protein: Math.round(totalProtein * adjustmentFactor * 10) / 10,
      carbs: Math.round(totalCarbs * adjustmentFactor * 10) / 10,
      fat: Math.round(totalFats * adjustmentFactor * 10) / 10,
      unit: 'g'
    };
    
    logger.info(
      LogCategory.NUTRITION,
      `Normalized nutrition calculated for meal ${mealId}: ` +
      `Cal=${normalizedNutrition.calories}, P=${normalizedNutrition.protein}, ` +
      `C=${normalizedNutrition.carbs}, F=${normalizedNutrition.fat}, ` +
      `Mode=${displayMode}, Adjustment=${adjustmentFactor.toFixed(2)}x`
    );
    
    return { 
      success: true,
      normalizedNutrition,
      normalizationFactor: adjustmentFactor,
      totalWeight: totalWeight,
      displayText: displayText
    };
  } catch (error) {
    logger.error(LogCategory.NUTRITION, `Error in handleCalculateNormalizedNutrition: ${error instanceof Error ? error.message : String(error)}`);
    return { 
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Handler pour obtenir le poids total d'un repas
 * @param db Instance de la base de données
 * @param params Paramètres pour la requête
 * @returns Résultat avec le poids total du repas
 */
export async function handleGetMealWeight(
  db: any,
  params: GetMealWeightParams
): Promise<GetMealWeightResult> {
  const { mealId, userId } = params;
  
  try {
    if (!db) throw new Error("Database not initialized");
    
    logger.info(LogCategory.NUTRITION, `Getting meal weight for meal ${mealId}`);
    
    // Sécurité: vérifier si le repas existe et appartient à l'utilisateur si userId est fourni
    if (userId) {
      const mealExists = await db
        .select({ id: meals.id })
        .from(meals)
        .where(and(eq(meals.id, mealId), eq(meals.creatorId, userId)))
        .get();
      
      if (!mealExists) {
        logger.warn(LogCategory.NUTRITION, `Meal with ID ${mealId} not found or access denied`);
        return { 
          success: false, 
          error: `Meal with ID ${mealId} not found or access denied` 
        };
      }
    }
    
    // Récupérer tous les ingrédients du repas
    const ingredients = await db
      .select({
        quantity: mealIngredients.quantity,
      })
      .from(mealIngredients)
      .where(eq(mealIngredients.mealId, mealId));
    
    if (!ingredients || ingredients.length === 0) {
      logger.warn(LogCategory.NUTRITION, `No ingredients found for meal ${mealId}`);
      return { 
        success: true, 
        totalWeight: 0,
        ingredientCount: 0
      };
    }
    
    // Calculer le poids total
    let totalWeight = 0;
    for (const ingredient of ingredients) {
      totalWeight += ingredient.quantity || 0;
    }
    
    logger.info(LogCategory.NUTRITION, `Total weight for meal ${mealId}: ${totalWeight}g from ${ingredients.length} ingredients`);
    
    return { 
      success: true,
      totalWeight,
      ingredientCount: ingredients.length
    };
  } catch (error) {
    logger.error(LogCategory.NUTRITION, `Error in handleGetMealWeight: ${error instanceof Error ? error.message : String(error)}`);
    return { 
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Handler pour calculer la répartition des macronutriments d'un repas
 * @param db Instance de la base de données
 * @param params Paramètres pour le calcul
 * @returns Résultat avec la répartition des macronutriments
 */
/**
 * Handler pour calculer les valeurs nutritionnelles d'un plan journalier
 * Calcule la somme des valeurs nutritionnelles de tous les repas d'un plan journalier
 * en tenant compte des quantités spécifiques de chaque repas.
 * 
 * @param db Instance de la base de données
 * @param params Paramètres pour le calcul (planId, userId, displayMode)
 * @returns Résultat avec les valeurs nutritionnelles totales du plan journalier
 */
export async function handleGetDailyPlanNutrition(
  db: any,
  params: CalculateDailyPlanNutritionParams
): Promise<DailyPlanNutritionResult> {
  const { planId, userId, displayMode } = params;
  
  try {
    if (!db) throw new Error("Database not initialized");
    
    logger.info(LogCategory.NUTRITION, `Calculating daily plan nutrition for plan ${planId} (user: ${userId})`);
    
    // 1. Vérifier que le plan existe et appartient à l'utilisateur via la relation avec plan
    const planDetails = await db
      .select({
        dailyPlan: dailyPlan,
        parentPlan: plan
      })
      .from(dailyPlan)
      .where(eq(dailyPlan.id, planId))
      .leftJoin(plan, eq(dailyPlan.planId, plan.id))
      .get();
    
    if (!planDetails || !planDetails.parentPlan || planDetails.parentPlan.userId !== userId) {
      logger.warn(LogCategory.NUTRITION, `Daily plan with ID ${planId} not found or access denied for user ${userId}`);
      return { success: false, error: `Daily plan with ID ${planId} not found or access denied` };
    }
    
    // 2. Récupérer tous les repas du plan avec leurs quantités
    const planMeals = await db
      .select({
        dailyPlanMeal: dailyPlanMeals,
        meal: meals
      })
      .from(dailyPlanMeals)
      .where(eq(dailyPlanMeals.dailyPlanId, planId))
      .leftJoin(meals, eq(dailyPlanMeals.mealId, meals.id));
    
    if (!planMeals || planMeals.length === 0) {
      logger.warn(LogCategory.NUTRITION, `No meals found for daily plan ${planId}`);
      return { 
        success: true, 
        nutrition: {
          calories: 0,
          carbs: 0,
          protein: 0,
          fat: 0,
          totalWeight: 0,
          displayText: "Plan sans repas"
        }
      };
    }
    
    // 3. Calculer les valeurs nutritionnelles totales du plan
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalWeight = 0;
    
    for (const item of planMeals) {
      if (!item.meal || !item.dailyPlanMeal) continue;
      
      // Quantité spécifique du repas dans ce plan journalier
      const mealQuantity = item.dailyPlanMeal.quantity || 0;
      totalWeight += mealQuantity;
      
      // Les valeurs nutritionnelles en DB sont standardisées à 100g
      // On applique la proportion selon la quantité du repas dans le plan
      const mealCalories = item.meal.calories * (mealQuantity / 100);
      const mealProtein = item.meal.protein * (mealQuantity / 100);
      const mealCarbs = item.meal.carbs * (mealQuantity / 100);
      const mealFat = item.meal.fat * (mealQuantity / 100);
      
      totalCalories += mealCalories;
      totalProtein += mealProtein;
      totalCarbs += mealCarbs;
      totalFat += mealFat;
    }
    
    // 4. Définir le texte d'affichage et le facteur de normalisation selon le mode
    let displayText = "Plan journalier complet";
    let normalizationFactor = 1; // Par défaut, on affiche les valeurs totales pour un plan
    
    // Dans le cas particulier où le mode est PER_100G ou PER_SERVING, appliquer une normalisation
    if (displayMode === NutritionDisplayMode.PER_100G && totalWeight > 0) {
      normalizationFactor = 100 / totalWeight;
      displayText = "Pour 100g du plan";
    } else if (displayMode === NutritionDisplayMode.PER_SERVING && totalWeight > 0) {
      // Pour un plan journalier, on considère la totalité comme une portion 
      // Si un paramètre de portion spécifique est nécessaire, il faudrait l'ajouter
      normalizationFactor = 1;
      displayText = `Par portion (${totalWeight}g)`;
    }
    
    // 5. Normaliser les valeurs selon le mode si nécessaire
    const nutrition = {
      calories: Math.round(totalCalories * normalizationFactor),
      protein: Math.round(totalProtein * normalizationFactor * 10) / 10,
      carbs: Math.round(totalCarbs * normalizationFactor * 10) / 10,
      fat: Math.round(totalFat * normalizationFactor * 10) / 10,
      totalWeight,
      normalizationFactor,
      displayText
    };
    
    logger.info(
      LogCategory.NUTRITION,
      `Daily plan nutrition calculated for plan ${planId}: ` +
      `Cal=${nutrition.calories}, P=${nutrition.protein}, ` +
      `C=${nutrition.carbs}, F=${nutrition.fat}, ` +
      `Total weight=${totalWeight}g, Mode=${displayMode || 'DEFAULT'}`
    );
    
    return { success: true, nutrition };
  } catch (error) {
    logger.error(LogCategory.NUTRITION, `Error in handleGetDailyPlanNutrition: ${error instanceof Error ? error.message : String(error)}`);
    return { 
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

export async function handleGetMacroBreakdown(
  db: any,
  params: GetMacroBreakdownParams
): Promise<GetMacroBreakdownResult> {
  const { mealId, userId, displayMode, quantity } = params;
  
  try {
    if (!db) throw new Error("Database not initialized");
    
    // Déterminer si on doit normaliser les valeurs en fonction du mode d'affichage
    const shouldNormalize = displayMode && displayMode !== NutritionDisplayMode.AS_IS;
    
    logger.info(LogCategory.NUTRITION, `Getting macro breakdown for meal ${mealId}, mode=${displayMode || 'AS_IS'}`);
    
    // Si un mode d'affichage spécifique est demandé, utiliser handleCalculateNormalizedNutrition
    if (shouldNormalize) {
      const normalizedResult = await handleCalculateNormalizedNutrition(db, { 
        mealId, 
        userId, 
        displayMode, 
        quantity 
      });
      
      if (!normalizedResult.success || !normalizedResult.normalizedNutrition) {
        return { 
          success: false, 
          error: normalizedResult.error || 'Failed to calculate normalized nutrition'
        };
      }
      
      const nutrition = normalizedResult.normalizedNutrition;
      
      // Calculer les pourcentages de calories
      const proteinCalories = nutrition.protein * PROTEIN_CALORIES_PER_GRAM;
      const carbsCalories = nutrition.carbs * CARBS_CALORIES_PER_GRAM;
      const fatsCalories = nutrition.fat * FATS_CALORIES_PER_GRAM;
      const totalCalories = nutrition.calories > 0 ? nutrition.calories : 
                           (proteinCalories + carbsCalories + fatsCalories);
      
      // Éviter la division par zéro
      if (totalCalories <= 0) {
        return { 
          success: false, 
          error: 'Invalid calorie values for calculating percentages'
        };
      }
      
      const macroBreakdown: MacroBreakdown = {
        calories: nutrition.calories,
        protein: nutrition.protein,
        carbs: nutrition.carbs,
        fat: nutrition.fat,
        proteinPercentage: Math.round((proteinCalories / totalCalories) * 100),
        carbsPercentage: Math.round((carbsCalories / totalCalories) * 100),
        fatPercentage: Math.round((fatsCalories / totalCalories) * 100)
      };
      
      return { success: true, macroBreakdown };
    }
    
    // Pour les valeurs non normalisées, calculer directement
    // Récupérer les ingrédients du repas avec leurs détails nutritionnels
    const ingredientsWithDetails = await db
      .select({
        mealIngredient: mealIngredients,
        ingredient: ingredientsStandard
      })
      .from(mealIngredients)
      .where(eq(mealIngredients.mealId, mealId))
      .leftJoin(ingredientsStandard, 
        eq(mealIngredients.ingredientStandardId, ingredientsStandard.id)
      );
    
    if (!ingredientsWithDetails || ingredientsWithDetails.length === 0) {
      logger.warn(LogCategory.NUTRITION, `No ingredients found for meal ${mealId}`);
      return { 
        success: false, 
        error: `No ingredients found for meal ${mealId}` 
      };
    }
    
    // Calculer les valeurs nutritionnelles totales
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;
    
    for (const item of ingredientsWithDetails) {
      if (!item.ingredient || !item.mealIngredient) continue;
      
      const quantity = item.mealIngredient.quantity || 0;
      const ingredient = item.ingredient;
      
      if (ingredient.calories) totalCalories += (ingredient.calories * quantity) / 100;
      if (ingredient.protein) totalProtein += (ingredient.protein * quantity) / 100;
      if (ingredient.carbs) totalCarbs += (ingredient.carbs * quantity) / 100;
      if (ingredient.fat) totalFats += (ingredient.fat * quantity) / 100;
    }
    
    // Calculer les pourcentages de calories
    const proteinCalories = totalProtein * PROTEIN_CALORIES_PER_GRAM;
    const carbsCalories = totalCarbs * CARBS_CALORIES_PER_GRAM;
    const fatsCalories = totalFats * FATS_CALORIES_PER_GRAM;
    const calculatedTotalCalories = proteinCalories + carbsCalories + fatsCalories;
    
    // Utiliser la valeur calculée si totalCalories est proche de zéro
    if (Math.abs(totalCalories) < 1) {
      totalCalories = calculatedTotalCalories;
    }
    
    // Éviter la division par zéro
    if (totalCalories <= 0) {
      return { 
        success: false, 
        error: 'Invalid calorie values for calculating percentages'
      };
    }
    
    const macroBreakdown: MacroBreakdown = {
      calories: Math.round(totalCalories * 10) / 10,
      protein: Math.round(totalProtein * 10) / 10,
      carbs: Math.round(totalCarbs * 10) / 10,
      fat: Math.round(totalFats * 10) / 10,
      proteinPercentage: Math.round((proteinCalories / totalCalories) * 100),
      carbsPercentage: Math.round((carbsCalories / totalCalories) * 100),
      fatPercentage: Math.round((fatsCalories / totalCalories) * 100)
    };
    
    logger.info(
      LogCategory.NUTRITION, 
      `Macro breakdown for meal ${mealId}: ` +
      `Cal=${macroBreakdown.calories}, P=${macroBreakdown.protein}g (${macroBreakdown.proteinPercentage}%), ` +
      `C=${macroBreakdown.carbs}g (${macroBreakdown.carbsPercentage}%), ` +
      `F=${macroBreakdown.fat}g (${macroBreakdown.fatPercentage}%)`
    );
    
    return { success: true, macroBreakdown };
  } catch (error) {
    logger.error(LogCategory.NUTRITION, `Error in handleGetMacroBreakdown: ${error instanceof Error ? error.message : String(error)}`);
    return { 
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}
