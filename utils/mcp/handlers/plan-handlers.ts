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
  GetPlanDetailsParams
} from '../interfaces/plan-interfaces';
import { 
  plan, 
  dailyPlan, 
  dailyPlanMeals,
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
    
    // Créer un objet typé pour les valeurs du plan
    const planData: Partial<PlanOrmProps> = {
      userId,
      name: 'Plan nutritionnel', // Valeur par défaut si non fournie par l'utilisateur
      durationWeeks: data.durationWeeks,
      goal: GoalEnum.MAINTAIN, // Valeur par défaut
      unit: WeightUnitEnum.KG, // Valeur par défaut
      initialWeight: data.initialWeight || 70,
      targetWeight: data.targetWeight || 70,
      calories: 2000, // Valeur par défaut pour les calories journalières
      carbs: 45,     // Pourcentage par défaut
      protein: 30,   // Pourcentage par défaut
      fat: 25,       // Pourcentage par défaut
      type: PlanGeneratedWithEnum.MANUAL // Le type de génération du plan
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
    
    const { planId, data } = params;
    
    logger.info(LogCategory.DATABASE, `Updating plan ${planId} via MCP Server`);
    
    // Vérifier que le plan existe
    const existingPlan = await db.select({ id: plan.id }).from(plan).where(eq(plan.id, planId));
    
    if (!existingPlan.length) {
      throw new Error(`Plan with id ${planId} not found`);
    }
    
    // Mettre à jour le plan
    await db.update(plan).set(data).where(eq(plan.id, planId));
    
    logger.info(LogCategory.DATABASE, `Successfully updated plan ${planId} via MCP Server`);
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
    
    const { planId } = params;
    
    logger.info(LogCategory.DATABASE, `Deleting plan ${planId} via MCP Server`);
    
    // Vérifier que le plan existe
    const existingPlan = await db.select({ id: plan.id }).from(plan).where(eq(plan.id, planId));
    
    if (!existingPlan.length) {
      throw new Error(`Plan with id ${planId} not found`);
    }
    
    // Trouver tous les daily plans associés au plan
    const dailyPlansToDelete = await db.select({ id: dailyPlan.id }).from(dailyPlan).where(eq(dailyPlan.planId, planId));
    
    // Si des daily plans existent, supprimer toutes les associations meal-dailyplan
    if (dailyPlansToDelete.length > 0) {
      const dailyPlanIds = dailyPlansToDelete.map((dp: { id: number }) => dp.id);
      await db.delete(dailyPlanMeals).where(inArray(dailyPlanMeals.dailyPlanId, dailyPlanIds));
      
      // Supprimer tous les daily plans
      await db.delete(dailyPlan).where(eq(dailyPlan.planId, planId));
    }
    
    // Supprimer le plan
    await db.delete(plan).where(eq(plan.id, planId));
    
    logger.info(LogCategory.DATABASE, `Successfully deleted plan ${planId} via MCP Server`);
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
 * Handler pour la méthode getPlansListViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres contenant l'ID de l'utilisateur
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
 * Handler pour la méthode getPlanDetailsViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres pour récupérer les détails d'un plan
 * @returns Résultat de l'opération avec les détails du plan
 */
export async function handleGetPlanDetails(db: any, params: { planId: number | string; userId: number }): Promise<GetPlanDetailsResult> {
  try {
    if (!db) throw new Error("Database not initialized");
    
    const { planId, userId } = params;
    if (!userId) {
      logger.error(LogCategory.DATABASE, `Missing userId in handleGetPlanDetails`);
      return { success: false, error: 'Missing required userId parameter' };
    }
    
    const numericPlanId = typeof planId === 'string' ? parseInt(planId, 10) : planId;
    
    if (isNaN(numericPlanId)) {
      throw new Error(`Invalid plan ID: ${planId}`);
    }
    
    logger.info(LogCategory.DATABASE, `Getting plan details for plan ${numericPlanId} via MCP Server`);
    
    // Récupérer le plan en vérifiant qu'il appartient à l'utilisateur spécifié
    const foundPlan = await db.query.plan.findFirst({
      where: and(
        eq(plan.id, numericPlanId),
        eq(plan.userId, userId)
      ),
    });
    
    if (!foundPlan) {
      return { success: false, error: `Plan with id ${numericPlanId} not found` };
    }
    
    // Récupérer tous les plans journaliers associés
    const dailyPlans = await db.query.dailyPlan.findMany({
      where: eq(dailyPlan.planId, numericPlanId),
    });
    
    if (dailyPlans.length === 0) {
      return { success: true, plan: foundPlan, dailyPlans: [] };
    }
    
    // Récupérer les relations repas-plan journalier (table de jointure)
    const dailyPlanIds = dailyPlans.map((dp: DailyPlanOrmProps) => dp.id);
    const dailyPlanMealsRelations = await db.query.dailyPlanMeals.findMany({
      where: inArray(dailyPlanMeals.dailyPlanId, dailyPlanIds),
    });
    
    if (dailyPlanMealsRelations.length === 0) {
      return {
        success: true,
        plan: foundPlan,
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
    
    logger.info(LogCategory.DATABASE, `Retrieved plan details for plan ${numericPlanId} with ${dailyPlansWithMeals.length} daily plans via MCP Server`);
    return { success: true, plan: foundPlan, dailyPlans: dailyPlansWithMeals };
  } catch (error) {
    logger.error(LogCategory.DATABASE, `Error in handleGetPlanDetails: ${error instanceof Error ? error.message : String(error)}`);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}
