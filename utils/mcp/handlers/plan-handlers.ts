import { 
  CreatePlanParams,
  PlanResult,
  CreateDailyPlansParams,
  DailyPlansResult,
  UpdatePlanParams,
  BasicResult,
  DeletePlanParams,
  DeletePlanResult,
  AddDailyPlanParams,
  AddDailyPlanResult,
  GetPlansListResult,
  GetPlanDetailsResult,
  GetPlanDetailsParams,
  AddMealToDailyPlanParams,
  AddMealToDailyPlanResult,
  GetMealQuantityInPlanParams,
  GetMealQuantityInPlanResult,
  UpdateMealQuantityInPlanParams,
  UpdateMealQuantityInPlanResult,
  SetCurrentPlanParams,
  SetCurrentPlanResult,
  GetCurrentPlanParams,
  GetCurrentPlanResult
} from '../interfaces/plan-interfaces';
import { 
  plan, 
  dailyPlan, 
  dailyPlanMeals, 
  users,
  meals,
  PlanOrmProps,
  DailyPlanOrmProps,
  MealOrmProps
} from '@/db/schema';
import { eq, and, inArray } from 'drizzle-orm';
import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { WeightUnitEnum, GoalEnum } from '@/utils/enum/user-details.enum';
import { MealUnitEnum } from '@/utils/enum/meal.enum';
import { PlanGeneratedWithEnum, DailyPlanGeneratedWithEnum, DayUnitArray } from '@/utils/enum/general.enum';

/**
 * Handler pour la méthode createPlanViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres de création du plan
 * @returns Résultat de l'opération
 */
export async function handleCreatePlan(db: any, params: CreatePlanParams): Promise<PlanResult> {
  try {
    if (!db) throw new Error("Database not initialized");
    
    const { data, userId } = params;
    
    logger.info(LogCategory.DATABASE, `Creating plan via MCP Server for user ${userId}`);
    
    // Vérifier que l'utilisateur existe
    // Note: cette vérification devrait être faite dans une couche supérieure
    
    // Utiliser une assertion de type pour accéder aux propriétés
    // puisque data peut contenir plus de propriétés que celles définies dans NutritionGoalSchemaFormData
    const anyData = data as any;
    
    // Créer un objet typé pour les valeurs du plan
    const planData: Partial<PlanOrmProps> = {
      userId,
      name: anyData.name || 'Plan nutritionnel', // Valeur par défaut si non fournie par l'utilisateur
      durationWeeks: data.durationWeeks,
      goal: anyData.goal || data.goalUnit || GoalEnum.MAINTAIN, // Utiliser goalUnit si fourni ou valeur par défaut
      unit: anyData.unit || WeightUnitEnum.KG, // Valeur par défaut
      initialWeight: data.initialWeight || 70,
      targetWeight: data.targetWeight || 70,
      calories: anyData.calories || 2000, // Valeur par défaut pour les calories journalières
      carbs: anyData.carbs || 45,     // Pourcentage par défaut
      protein: anyData.protein || 30,   // Pourcentage par défaut
      fat: anyData.fat || 25,       // Pourcentage par défaut
      type: anyData.type || PlanGeneratedWithEnum.MANUAL // Le type de génération du plan
    };
    
    // Ajouter les propriétés spécifiques si elles existent dans les données fournies
    if ('name' in data) planData.name = data.name as string;
    if ('goal' in data) planData.goal = data.goal as GoalEnum;
    if ('calories' in data) planData.calories = data.calories as number;
    if ('carbs' in data) planData.carbs = data.carbs as number;
    if ('protein' in data) planData.protein = data.protein as number;
    if ('fat' in data) planData.fat = data.fat as number;
    
    // Créer le plan dans la base de données avec les données typées
    const insertedPlan = await db.insert(plan).values(planData).returning({ id: plan.id });
    
    if (!insertedPlan.length) {
      throw new Error('Failed to insert plan');
    }
    
    const planId = insertedPlan[0].id;
    
    // Créer automatiquement les plans quotidiens pour chaque jour de chaque semaine
    try {
      const durationWeeks = planData.durationWeeks || 12; // Utiliser la durée spécifiée ou une valeur par défaut
      
      // Appeler le handler pour créer les plans quotidiens
      const dailyPlansResult = await handleCreateDailyPlans(db, {
        planId,
        durationWeeks
      });
      
      if (!dailyPlansResult.success) {
        logger.warn(LogCategory.DATABASE, `Warning: Daily plans creation failed for plan ${planId}: ${dailyPlansResult.error}`);
      }
    } catch (dailyPlanError) {
      // Ne pas bloquer la création du plan en cas d'erreur lors de la création des plans quotidiens
      logger.warn(LogCategory.DATABASE, `Warning: Error creating daily plans for plan ${planId}: ${dailyPlanError instanceof Error ? dailyPlanError.message : String(dailyPlanError)}`);
    }
    
    logger.info(LogCategory.DATABASE, `Successfully created plan ${planId} for user ${userId} via MCP Server`);
    return { success: true, planId };
  } catch (error) {
    logger.error(LogCategory.DATABASE, `Error in handleCreatePlan: ${error instanceof Error ? error.message : String(error)}`);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

/**
 * Handler pour la méthode createDailyPlansViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres de création des plans journaliers
 * @returns Résultat de l'opération
 */
export async function handleCreateDailyPlans(db: any, params: CreateDailyPlansParams): Promise<DailyPlansResult> {
  try {
    if (!db) throw new Error("Database not initialized");
    
    const { planId, durationWeeks, transaction } = params;
    
    logger.info(LogCategory.DATABASE, `Creating daily plans via MCP Server for plan ${planId}`);
    
    // Vérifier que le plan existe
    const existingPlan = await db.select({ id: plan.id }).from(plan).where(eq(plan.id, planId));
    
    if (!existingPlan.length) {
      throw new Error(`Plan with id ${planId} not found`);
    }
    
    // Utiliser une transaction si fournie, sinon continuer sans transaction
    const dbContext = transaction || db;
    
    // Générer les plans journaliers pour chaque jour de la semaine et pour chaque semaine
    const dailyPlansToInsert: { planId: number; day: string; week: number; generatedWith: string }[] = [];
    
    for (let week = 1; week <= durationWeeks; week++) {
      for (const day of DayUnitArray) {
        dailyPlansToInsert.push({
          planId,
          day,
          week,
          generatedWith: DailyPlanGeneratedWithEnum.COMPANY
        });
      }
    }
    
    // Insérer tous les plans journaliers
    await dbContext.insert(dailyPlan).values(dailyPlansToInsert);
    
    logger.info(LogCategory.DATABASE, `Successfully created ${dailyPlansToInsert.length} daily plans for plan ${planId} via MCP Server`);
    return { success: true };
  } catch (error) {
    logger.error(LogCategory.DATABASE, `Error in handleCreateDailyPlans: ${error instanceof Error ? error.message : String(error)}`);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

/**
 * Handler pour la méthode updatePlanViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres de mise à jour du plan
 * @returns Résultat de l'opération
 */
export async function handleUpdatePlan(db: any, params: UpdatePlanParams): Promise<BasicResult> {
  try {
    if (!db) throw new Error("Database not initialized");
    
    const { planId, data, userId } = params;
    
    if (!userId) {
      logger.error(LogCategory.DATABASE, `Attempted to update plan ${planId} without providing userId`);
      return { success: false, error: 'User ID is required for updating plans' };
    }
    
    logger.info(LogCategory.DATABASE, `Updating plan ${planId} for user ${userId} via MCP Server`);
    
    // Vérifier si le plan existe et appartient à l'utilisateur
    const planExists = await db
      .select({ id: plan.id })
      .from(plan)
      .where(
        and(
          eq(plan.id, planId),
          eq(plan.userId, userId) // Vérification de sécurité: l'utilisateur doit être propriétaire du plan
        )
      )
      .limit(1);
    
    if (!planExists.length) {
      throw new Error(`Plan with id ${planId} not found or does not belong to user ${userId}`);
    }
    
    // Mettre à jour le plan
    await db.update(plan).set(data).where(eq(plan.id, planId));
    
    logger.info(LogCategory.DATABASE, `Successfully updated plan ${planId} for user ${userId} via MCP Server`);
    return { success: true };
  } catch (error) {
    logger.error(LogCategory.DATABASE, `Error in handleUpdatePlan: ${error instanceof Error ? error.message : String(error)}`);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

/**
 * Handler pour la méthode deletePlanViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres de suppression du plan
 * @returns Résultat de l'opération
 */
export async function handleDeletePlan(db: any, params: DeletePlanParams): Promise<DeletePlanResult> {
  try {
    if (!db) throw new Error("Database not initialized");
    
    const { planId, userId } = params;
    
    if (!userId) {
      logger.error(LogCategory.DATABASE, `Attempted to delete plan ${planId} without providing userId`);
      return { success: false, error: 'User ID is required for deleting plans' };
    }
    
    logger.info(LogCategory.DATABASE, `Deleting plan ${planId} for user ${userId} via MCP Server`);
    
    // Récupérer d'abord les informations du plan pour vérifier s'il est utilisé comme plan actuel
    // et vérifier que l'utilisateur est propriétaire du plan
    const planInfo = await db
      .select({ current: plan.current, userId: plan.userId })
      .from(plan)
      .where(
        and(
          eq(plan.id, planId),
          eq(plan.userId, userId) // Vérification de sécurité: l'utilisateur doit être propriétaire du plan
        )
      )
      .limit(1);
    
    if (!planInfo.length) {
      logger.warn(LogCategory.DATABASE, `Plan with id ${planId} not found during deletion attempt`);
      return { success: false, error: `Plan with id ${planId} not found` };
    }
    
    // Exécuter toutes les opérations de suppression dans une transaction pour garantir l'intégrité
    await db.transaction(async (tx: any) => {
      // 1. Trouver tous les daily plans associés au plan
      const dailyPlansToDelete = await tx.select({ id: dailyPlan.id }).from(dailyPlan).where(eq(dailyPlan.planId, planId));
      logger.debug(LogCategory.DATABASE, `Found ${dailyPlansToDelete.length} daily plans to delete for plan ${planId}`);
      
      // 2. Si des daily plans existent, supprimer d'abord toutes les associations meal-dailyplan
      if (dailyPlansToDelete.length > 0) {
        const dailyPlanIds = dailyPlansToDelete.map((dp: { id: number }) => dp.id);
        
        // Supprimer les associations repas-plan journalier
        const deleteResult = await tx.delete(dailyPlanMeals).where(inArray(dailyPlanMeals.dailyPlanId, dailyPlanIds));
        logger.debug(LogCategory.DATABASE, `Deleted meal associations for daily plans of plan ${planId}`);
        
        // 3. Supprimer tous les daily plans
        await tx.delete(dailyPlan).where(eq(dailyPlan.planId, planId));
        logger.debug(LogCategory.DATABASE, `Deleted daily plans for plan ${planId}`);
      }
      
      // 4. Vérifier si ce plan est marqué comme courant
      const planDetails = await tx.select({ current: plan.current }).from(plan).where(eq(plan.id, planId)).limit(1);
      
      if (planDetails.length > 0 && planDetails[0].current) {
        logger.debug(LogCategory.DATABASE, `Plan ${planId} was marked as current and is being deleted`);
      }
      
      // 5. Finalement, supprimer le plan lui-même
      await tx.delete(plan).where(eq(plan.id, planId));
      logger.debug(LogCategory.DATABASE, `Deleted plan ${planId}`);
    });
    
    logger.info(LogCategory.DATABASE, `Successfully deleted plan ${planId} for user ${userId} via MCP Server`);
    return { success: true, planId };
  } catch (error) {
    logger.error(LogCategory.DATABASE, `Error in handleDeletePlan: ${error instanceof Error ? error.message : String(error)}`);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

/**
 * Handler pour la méthode getPlanDetailsViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres pour récupérer les détails d'un plan
 * @returns Résultat de l'opération avec les détails du plan
 */
export async function handleGetPlanDetails(db: any, params: { planId: number | string; userId: number }): Promise<GetPlanDetailsResult> {
  try {
    if (!db) throw new Error("Database not initialized");
    
    const { planId, userId } = params;
    
    logger.info(LogCategory.DATABASE, `Getting plan details for plan ${planId} and user ${userId} via MCP Server`);
    
    // Récupérer les détails du plan et vérifier que l'utilisateur est propriétaire du plan
    const numericPlanId = typeof planId === 'string' ? parseInt(planId, 10) : planId;
    
    const planDetails = await db
      .select()
      .from(plan)
      .where(
        and(
          eq(plan.id, numericPlanId),
          eq(plan.userId, userId) // Vérification de sécurité: l'utilisateur doit être propriétaire du plan
        )
      )
      .limit(1);
    
    if (!planDetails.length) {
      return { success: false, error: `Plan with id ${planId} not found or does not belong to user ${userId}` };
    }
    
    // Récupérer tous les plans journaliers associés
    const dailyPlans = await db.query.dailyPlan.findMany({
      where: eq(dailyPlan.planId, numericPlanId),
    });
    
    if (dailyPlans.length === 0) {
      return { success: true, plan: planDetails[0], dailyPlans: [] };
    }
    
    // Récupérer les relations repas-plan journalier (table de jointure)
    const dailyPlanIds = dailyPlans.map((dp: { id: number }) => dp.id);
    const dailyPlanMealsRelations = await db.query.dailyPlanMeals.findMany({
      where: inArray(dailyPlanMeals.dailyPlanId, dailyPlanIds),
    });
    
    if (dailyPlanMealsRelations.length === 0) {
      return {
        success: true,
        plan: planDetails[0],
        dailyPlans: dailyPlans.map((dp: DailyPlanOrmProps) => ({ ...dp, meals: [] })),
      };
    }
    
    // Récupérer tous les repas dans ces relations
    const mealIds = dailyPlanMealsRelations.map((dpm: { mealId: number }) => dpm.mealId);
    const mealRecords = await db.query.meals.findMany({
      where: inArray(meals.id, mealIds),
    });
    
    // Combiner les résultats efficacement en utilisant une Map
    const dailyPlanMap: Map<number, DailyPlanOrmProps & { meals: MealOrmProps[] }> = new Map();
    
    dailyPlans.forEach((dp: DailyPlanOrmProps) => {
      dailyPlanMap.set(dp.id, { ...dp, meals: [] });
    });
    
    // Ajouter les repas à chaque plan journalier
    dailyPlanMealsRelations.forEach((dpm: { dailyPlanId: number; mealId: number; quantity?: number; unit?: string }) => {
      const dailyPlanWithMeals: DailyPlanOrmProps & { meals: MealOrmProps[] } | undefined = dailyPlanMap.get(dpm.dailyPlanId);
      if (dailyPlanWithMeals) {
        const meal: MealOrmProps | undefined = mealRecords.find((m: MealOrmProps) => m.id === dpm.mealId);
        if (meal) {
          // Ajouter les propriétés spécifiques à cette relation repas-plan
          dailyPlanWithMeals.meals.push({
            ...meal,
            quantity: dpm.quantity ?? 1, // Valeur par défaut si undefined
            unit: (dpm.unit as MealUnitEnum) ?? MealUnitEnum.GRAMMES, // Cast explicite et valeur par défaut
          });
        }
      }
    });
    
    // Convertir la Map en tableau pour le résultat final
    const dailyPlansWithMeals = Array.from(dailyPlanMap.values());
    
    logger.info(LogCategory.DATABASE, `Retrieved plan details for plan ${planId} with ${dailyPlansWithMeals.length} daily plans via MCP Server`);
    return { success: true, plan: planDetails[0], dailyPlans: dailyPlansWithMeals };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(LogCategory.DATABASE, `Error in handleGetPlanDetails: ${errorMessage}`, {
      planId: params.planId,
      userId: params.userId,
      error: JSON.stringify(error)
    });
    return { 
      success: false, 
      error: errorMessage || 'Erreur lors de la récupération des détails du plan'
    };
  }
}

/**
 * Handler pour la méthode getPlansListViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres pour récupérer la liste des plans
 * @returns Résultat de l'opération avec la liste des plans
 */
export async function handleGetPlansList(db: any, params: { userId: number }): Promise<GetPlansListResult> {
  try {
    if (!db) throw new Error("Database not initialized");
    
    const { userId } = params;
    if (!userId) {
      logger.error(LogCategory.DATABASE, `Missing userId in handleGetPlansList`);
      return { success: false, error: 'Missing required userId parameter' };
    }
    
    logger.info(LogCategory.DATABASE, `Getting plans list for user ${userId} via MCP Server`);
    
    // Récupérer uniquement les plans de l'utilisateur spécifié
    const plansList = await db.select().from(plan).where(eq(plan.userId, userId));
    
    logger.info(LogCategory.DATABASE, `Retrieved ${plansList.length} plans for user ${userId} via MCP Server`);
    return { success: true, plans: plansList };
  } catch (error) {
    logger.error(LogCategory.DATABASE, `Error in handleGetPlansList: ${error instanceof Error ? error.message : String(error)}`);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

/**
 * Handler pour la méthode addDailyPlanViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres d'ajout du plan journalier
 * @returns Résultat de l'opération
 */
export async function handleAddDailyPlan(db: any, params: AddDailyPlanParams): Promise<AddDailyPlanResult> {
  try {
    if (!db) throw new Error("Database not initialized");
    
    const { planId, dailyPlanData } = params;
    
    logger.info(LogCategory.DATABASE, `Adding daily plan for plan ${planId} via MCP Server`);
    
    // Vérifier que le plan existe
    const existingPlan = await db.select({ id: plan.id }).from(plan).where(eq(plan.id, planId));
    
    if (!existingPlan.length) {
      throw new Error(`Plan with id ${planId} not found`);
    }
    
    // Créer le plan journalier
    const insertedDailyPlan = await db.insert(dailyPlan).values({
      planId,
      day: dailyPlanData.day,
      week: dailyPlanData.week || 1,
      calories: dailyPlanData.calories,
      carbs: dailyPlanData.carbs,
      protein: dailyPlanData.protein,
      fat: dailyPlanData.fat,
      generatedWith: DailyPlanGeneratedWithEnum.MANUAL
    }).returning({ id: dailyPlan.id });
    
    if (!insertedDailyPlan.length) {
      throw new Error('Failed to insert daily plan');
    }
    
    logger.info(LogCategory.DATABASE, `Successfully created daily plan ${insertedDailyPlan[0].id} for plan ${planId} via MCP Server`);
    return { success: true, dailyPlanId: insertedDailyPlan[0].id };
  } catch (error) {
    logger.error(LogCategory.DATABASE, `Error in handleAddDailyPlan: ${error instanceof Error ? error.message : String(error)}`);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

/**
 * Handler pour la méthode addMealToDailyPlanViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres d'ajout d'un repas au plan journalier
 * @returns Résultat de l'opération
 */
export async function handleAddMealToDailyPlan(db: any, params: AddMealToDailyPlanParams): Promise<AddMealToDailyPlanResult> {
  try {
    if (!db) throw new Error("Database not initialized");
    
    const { dailyPlanId, mealId, quantity = 10 } = params; // Valeur par défaut de 10g
    
    logger.info(LogCategory.DATABASE, `Adding meal ${mealId} to daily plan ${dailyPlanId} via MCP Server`);
    
    // Vérifier si le repas existe
    const meal = await db
      .select()
      .from(meals)
      .where(eq(meals.id, mealId))
      .limit(1);
      
    if (meal.length === 0) {
      logger.warn(LogCategory.DATABASE, `Meal with ID ${mealId} not found`);
      return { success: false, error: `Meal with ID ${mealId} not found` };
    }
    
    // Vérifier si le plan journalier existe
    const currentDailyPlan = await db
      .select()
      .from(dailyPlan)
      .where(eq(dailyPlan.id, dailyPlanId))
      .limit(1);
      
    if (currentDailyPlan.length === 0) {
      logger.warn(LogCategory.DATABASE, `Daily plan with ID ${dailyPlanId} not found`);
      return { success: false, error: `Daily plan with ID ${dailyPlanId} not found` };
    }
    
    const mealInfo = meal[0];
    const dailyPlanInfo = currentDailyPlan[0];
    
    // Calculer les valeurs nutritionnelles en fonction de la quantité
    const quantityRatio = quantity / 100; // Les valeurs nutritionnelles sont pour 100g
    const caloriesForQuantity = mealInfo.calories * quantityRatio;
    const carbsForQuantity = mealInfo.carbs * quantityRatio;
    const fatForQuantity = mealInfo.fat * quantityRatio;
    const proteinForQuantity = mealInfo.protein * quantityRatio;
    
    // Créer la relation entre le repas et le plan journalier
    await db
      .insert(dailyPlanMeals)
      .values({
        dailyPlanId,
        mealId,
        quantity,
        calories: caloriesForQuantity,
        carbs: carbsForQuantity,
        fat: fatForQuantity,
        protein: proteinForQuantity,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
    // Mettre à jour les valeurs nutritionnelles totales du plan journalier
    await db
      .update(dailyPlan)
      .set({
        calories: dailyPlanInfo.calories + caloriesForQuantity,
        carbs: dailyPlanInfo.carbs + carbsForQuantity,
        fat: dailyPlanInfo.fat + fatForQuantity,
        protein: dailyPlanInfo.protein + proteinForQuantity,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(dailyPlan.id, dailyPlanId));
      
    logger.info(LogCategory.DATABASE, `Successfully added meal ${mealId} to daily plan ${dailyPlanId} via MCP Server`);
    return { success: true };
  } catch (error) {
    logger.error(LogCategory.DATABASE, `Error in handleAddMealToDailyPlan: ${error instanceof Error ? error.message : String(error)}`);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

/**
 * Handler pour la méthode getMealQuantityInPlanViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres pour récupérer la quantité d'un repas dans un plan journalier
 * @returns Résultat de l'opération avec la quantité du repas
 */
export async function handleGetMealQuantityInPlan(db: any, params: GetMealQuantityInPlanParams): Promise<GetMealQuantityInPlanResult> {
  try {
    if (!db) throw new Error("Database not initialized");
    
    const { dailyPlanId, mealId } = params;
    
    logger.info(LogCategory.DATABASE, `Getting quantity of meal ${mealId} in daily plan ${dailyPlanId} via MCP Server`);
    
    // Récupérer la relation entre le repas et le plan journalier
    const relation = await db
      .select({ quantity: dailyPlanMeals.quantity })
      .from(dailyPlanMeals)
      .where(
        and(
          eq(dailyPlanMeals.dailyPlanId, dailyPlanId),
          eq(dailyPlanMeals.mealId, mealId)
        )
      )
      .limit(1);
      
    if (relation.length === 0) {
      logger.warn(LogCategory.DATABASE, `No relation found between meal ${mealId} and daily plan ${dailyPlanId}`);
      return { success: false, error: `Meal is not in this daily plan` };
    }
    
    logger.info(LogCategory.DATABASE, `Successfully got quantity of meal ${mealId} in daily plan ${dailyPlanId} via MCP Server`);
    return { success: true, quantity: relation[0].quantity };
  } catch (error) {
    logger.error(LogCategory.DATABASE, `Error in handleGetMealQuantityInPlan: ${error instanceof Error ? error.message : String(error)}`);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

/**
 * Handler pour la méthode updateMealQuantityInPlanViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres pour mettre à jour la quantité d'un repas dans un plan journalier
 * @returns Résultat de l'opération
 */
export async function handleUpdateMealQuantityInPlan(db: any, params: UpdateMealQuantityInPlanParams): Promise<UpdateMealQuantityInPlanResult> {
  try {
    if (!db) throw new Error("Database not initialized");
    
    const { dailyPlanId, mealId, newQuantity } = params;
    
    logger.info(LogCategory.DATABASE, `Updating quantity of meal ${mealId} in daily plan ${dailyPlanId} to ${newQuantity} via MCP Server`);
    
    // Récupérer les informations sur le repas
    const meal = await db
      .select()
      .from(meals)
      .where(eq(meals.id, mealId))
      .limit(1);
      
    if (meal.length === 0) {
      logger.warn(LogCategory.DATABASE, `Meal with ID ${mealId} not found`);
      return { success: false, error: `Meal with ID ${mealId} not found` };
    }
    
    // Récupérer la relation entre le repas et le plan journalier
    const currentRelation = await db
      .select()
      .from(dailyPlanMeals)
      .where(
        and(
          eq(dailyPlanMeals.dailyPlanId, dailyPlanId),
          eq(dailyPlanMeals.mealId, mealId)
        )
      )
      .limit(1);
      
    if (currentRelation.length === 0) {
      logger.warn(LogCategory.DATABASE, `No relation found between meal ${mealId} and daily plan ${dailyPlanId}`);
      return { success: false, error: `Meal is not in this daily plan` };
    }
    
    const mealInfo = meal[0];
    const relationInfo = currentRelation[0];
    
    // Calculer les anciennes valeurs nutritionnelles
    const oldQuantityRatio = relationInfo.quantity / 100;
    const oldCalories = mealInfo.calories * oldQuantityRatio;
    const oldCarbs = mealInfo.carbs * oldQuantityRatio;
    const oldFat = mealInfo.fat * oldQuantityRatio;
    const oldProtein = mealInfo.protein * oldQuantityRatio;
    
    // Calculer les nouvelles valeurs nutritionnelles
    const newQuantityRatio = newQuantity / 100;
    const newCalories = mealInfo.calories * newQuantityRatio;
    const newCarbs = mealInfo.carbs * newQuantityRatio;
    const newFat = mealInfo.fat * newQuantityRatio;
    const newProtein = mealInfo.protein * newQuantityRatio;
    
    // Récupérer le plan journalier actuel
    const currentDailyPlan = await db
      .select()
      .from(dailyPlan)
      .where(eq(dailyPlan.id, dailyPlanId))
      .limit(1);
      
    if (currentDailyPlan.length === 0) {
      logger.warn(LogCategory.DATABASE, `Daily plan with ID ${dailyPlanId} not found`);
      return { success: false, error: `Daily plan with ID ${dailyPlanId} not found` };
    }
    
    const dailyPlanInfo = currentDailyPlan[0];
    
    // Mettre à jour la relation avec les nouvelles valeurs nutritionnelles
    await db
      .update(dailyPlanMeals)
      .set({
        quantity: newQuantity,
        calories: newCalories,
        carbs: newCarbs,
        fat: newFat,
        protein: newProtein,
        updatedAt: new Date().toISOString(),
      })
      .where(
        and(
          eq(dailyPlanMeals.dailyPlanId, dailyPlanId),
          eq(dailyPlanMeals.mealId, mealId)
        )
      );
      
    // Mettre à jour les valeurs nutritionnelles totales du plan journalier
    await db
      .update(dailyPlan)
      .set({
        calories: dailyPlanInfo.calories - oldCalories + newCalories,
        carbs: dailyPlanInfo.carbs - oldCarbs + newCarbs,
        fat: dailyPlanInfo.fat - oldFat + newFat,
        protein: dailyPlanInfo.protein - oldProtein + newProtein,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(dailyPlan.id, dailyPlanId));
      
    logger.info(LogCategory.DATABASE, `Successfully updated quantity of meal ${mealId} in daily plan ${dailyPlanId} via MCP Server`);
    return { success: true };
  } catch (error) {
    logger.error(LogCategory.DATABASE, `Error in handleUpdateMealQuantityInPlan: ${error instanceof Error ? error.message : String(error)}`);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

/**
 * Handler pour la méthode setCurrentPlanViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres pour définir le plan actuel d'un utilisateur
 * @returns Résultat de l'opération
 */
export async function handleSetCurrentPlan(db: any, params: SetCurrentPlanParams): Promise<SetCurrentPlanResult> {
  try {
    if (!db) throw new Error("Database not initialized");
    
    const { planId, userId } = params;
    
    logger.info(LogCategory.DATABASE, `Setting plan ${planId} as current for user ${userId} via MCP Server`);
    
    // Vérifier si le plan existe et appartient à l'utilisateur
    const planQuery = await db
      .select()
      .from(plan)
      .where(
        and(
          eq(plan.id, planId),
          eq(plan.userId, userId)
        )
      )
      .limit(1);
      
    if (planQuery.length === 0) {
      logger.warn(LogCategory.DATABASE, `Plan ${planId} not found or does not belong to user ${userId}`);
      return { success: false, error: `Plan not found or does not belong to this user` };
    }
    
    // Mettre à jour tous les plans de l'utilisateur pour les définir comme non-actuel
    await db
      .update(plan)
      .set({ current: false })
      .where(eq(plan.userId, userId));
      
    // Définir le plan spécifié comme actuel
    await db
      .update(plan)
      .set({ current: true })
      .where(eq(plan.id, planId));
      
    logger.info(LogCategory.DATABASE, `Successfully set plan ${planId} as current for user ${userId} via MCP Server`);
    return { success: true };
  } catch (error) {
    logger.error(LogCategory.DATABASE, `Error in handleSetCurrentPlan: ${error instanceof Error ? error.message : String(error)}`);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

/**
 * Handler pour la méthode getCurrentPlanViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres pour récupérer le plan actuel d'un utilisateur
 * @returns Résultat de l'opération avec le plan actuel
 */
export async function handleGetCurrentPlan(db: any, params: GetCurrentPlanParams): Promise<GetCurrentPlanResult> {
  try {
    if (!db) throw new Error("Database not initialized");
    
    const { userId } = params;
    
    logger.info(LogCategory.DATABASE, `Getting current plan for user ${userId} via MCP Server`);
    
    // Récupérer le plan actuel de l'utilisateur
    const currentPlan = await db
      .select()
      .from(plan)
      .where(
        and(
          eq(plan.userId, userId),
          eq(plan.current, true)
        )
      )
      .limit(1);
      
    if (!currentPlan.length) {
      logger.warn(LogCategory.DATABASE, `No current plan found for user ${userId}`);
      return { success: true, plan: null }; 
    }
    
    logger.info(LogCategory.DATABASE, `Successfully got current plan for user ${userId} via MCP Server`);
    return { success: true, plan: currentPlan[0] };
  } catch (error) {
    logger.error(LogCategory.DATABASE, `Error in handleGetCurrentPlan: ${error instanceof Error ? error.message : String(error)}`);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}
