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
  GetCurrentPlanResult,
  GetDailyPlanNutritionParams,
  GetDailyPlanNutritionResult,
} from '../interfaces/plan-interfaces';
import {
  plan,
  dailyPlan,
  dailyPlanMeals,
  users,
  meals,
  PlanOrmProps,
  DailyPlanOrmProps,
  MealOrmProps,
} from '@/db/schema';
import { eq, and, inArray } from 'drizzle-orm';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { WeightUnitEnum, GoalEnum } from '@/utils/enum/user-details.enum';
import { MealUnitEnum } from '@/utils/enum/meal.enum';
import {
  PlanGeneratedWithEnum,
  DailyPlanGeneratedWithEnum,
  DayUnitArray,
  DayEnum,
} from '@/utils/enum/general.enum';
import {
  GenderEnum,
  PhysicalActivityEnum,
} from '@/utils/enum/user-gender-activity.enum';
import { nutritionCoreService } from '@/utils/services/core/nutrition-core.service';

/**
 * Handler pour la méthode createPlanViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres de création du plan
 * @returns Résultat de l'opération
 */
export async function handleCreatePlan(
  db: any,
  params: CreatePlanParams,
): Promise<PlanResult> {
  try {
    if (!db) throw new Error('Database not initialized');

    const { data, userId } = params;

    logger.info(
      LogCategory.DATABASE,
      `Creating plan via MCP Server for user ${userId}`,
    );

    // Vérifier que l'utilisateur existe
    const userDetails = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!userDetails.length) {
      logger.error(LogCategory.DATABASE, `User with ID ${userId} not found`);
      return {
        success: false,
        error: `User with ID ${userId} not found`,
      };
    }

    // Utiliser une assertion de type pour accéder aux propriétés
    // puisque data peut contenir plus de propriétés que celles définies dans NutritionGoalSchemaFormData
    const anyData = data as any;

    // Calculer les besoins caloriques réels à partir des données utilisateur
    let calculatedCalories = 3000; // Valeur maximale par défaut

    // Récupérer les données de profil utilisateur et les données du formulaire
    const user = userDetails[0];
    const weight = data.initialWeight || user.weight || 70;
    const height = anyData.height || user.height || 175;
    const age = anyData.age || user.age || 30;
    const gender = anyData.gender || user.gender || GenderEnum.MALE;
    const physicalActivity =
      anyData.physicalActivity ||
      user.physicalActivity ||
      PhysicalActivityEnum.MODERATE;

    // Calculer les besoins caloriques avec la formule Mifflin-St Jeor
    try {
      // BMR = Métabolisme de base
      let bmr = 0;

      if (gender === GenderEnum.MALE) {
        // BMR pour les hommes: (10 × poids en kg) + (6.25 × taille en cm) - (5 × âge en années) + 5
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
      } else {
        // BMR pour les femmes: (10 × poids en kg) + (6.25 × taille en cm) - (5 × âge en années) - 161
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
      }

      // Appliquer le multiplicateur selon le niveau d'activité physique
      const activityMultiplier: { [key: string]: number } = {
        [PhysicalActivityEnum.SEDENTARY]: 1.2, // Sédentaire (peu ou pas d'exercice)
        [PhysicalActivityEnum.LOW]: 1.375, // Légèrement actif (exercice léger 1-3 jours/semaine)
        [PhysicalActivityEnum.MODERATE]: 1.55, // Modérément actif (exercice modéré 3-5 jours/semaine)
        [PhysicalActivityEnum.HIGH]: 1.725, // Très actif (exercice intense 6-7 jours/semaine)
      };

      const multiplier = activityMultiplier[physicalActivity] || 1.55;
      let maintenanceCalories = Math.round(bmr * multiplier);

      // Récupérer l'objectif pour ajuster les calories
      const goal = anyData.goal || data.goalUnit || GoalEnum.MAINTAIN;

      // Appliquer le déficit/surplus en fonction de l'objectif
      if (goal === GoalEnum.WEIGHT_LOSS) {
        // Appliquer un déficit de 15% pour la perte de poids
        calculatedCalories = Math.round(maintenanceCalories * 0.85);
      } else if (goal === GoalEnum.GAIN_MUSCLE) {
        // Appliquer un surplus de 15% pour la prise de muscle
        calculatedCalories = Math.round(maintenanceCalories * 1.15);
      } else {
        // Pour le maintien, utiliser les calories de maintenance
        calculatedCalories = maintenanceCalories;
      }

      // Limiter à la valeur maximale pour éviter des valeurs excessives
      calculatedCalories = Math.min(calculatedCalories, 3000);

      logger.info(
        LogCategory.NUTRITION,
        `Calculated ${calculatedCalories} daily calories for user ${userId} with goal ${goal}`,
        {
          goal,
          maintenanceCalories,
          finalCalories: calculatedCalories,
          weight,
          height,
          age,
          gender,
          physicalActivity,
          bmr,
          multiplier,
        },
      );
    } catch (calcError) {
      logger.error(
        LogCategory.NUTRITION,
        `Error calculating calories: ${
          calcError instanceof Error ? calcError.message : String(calcError)
        }`,
      );
      // Continuer avec la valeur par défaut en cas d'erreur
    }

    // Déterminer les pourcentages des macronutriments en fonction de l'objectif nutritionnel
    let carbsPercentage, proteinPercentage, fatPercentage;

    // Récupérer l'objectif nutritionnel
    const goal = anyData.goal || data.goalUnit || GoalEnum.MAINTAIN;

    // Adapter les pourcentages selon l'objectif
    if (goal === GoalEnum.WEIGHT_LOSS) {
      // Pour la perte de poids: protéines plus élevées, glucides réduits
      carbsPercentage = anyData.carbs || 40;
      proteinPercentage = anyData.protein || 35;
      fatPercentage = anyData.fat || 25;
    } else if (goal === GoalEnum.GAIN_MUSCLE) {
      // Pour la prise de muscle: protéines élevées, glucides élevés
      carbsPercentage = anyData.carbs || 45;
      proteinPercentage = anyData.protein || 30;
      fatPercentage = anyData.fat || 25;
    } else {
      // Pour le maintien: répartition équilibrée
      carbsPercentage = anyData.carbs || 50;
      proteinPercentage = anyData.protein || 25;
      fatPercentage = anyData.fat || 25;
    }

    // Calculer les grammes de chaque macronutriment à partir des calories
    // 1g de glucides = 4 calories
    // 1g de protéines = 4 calories
    // 1g de lipides = 9 calories
    const totalCalories = anyData.calories || calculatedCalories;
    const carbsGrams = Math.round(
      (totalCalories * (carbsPercentage / 100)) / 4,
    );
    const proteinGrams = Math.round(
      (totalCalories * (proteinPercentage / 100)) / 4,
    );
    const fatGrams = Math.round((totalCalories * (fatPercentage / 100)) / 9);

    logger.debug(
      LogCategory.NUTRITION,
      `Calculated macronutrients for user ${userId}`,
      {
        calories: totalCalories,
        carbsPercentage,
        carbsGrams,
        proteinPercentage,
        proteinGrams,
        fatPercentage,
        fatGrams,
      },
    );

    // Créer un objet typé pour les valeurs du plan
    const planData: Partial<PlanOrmProps> = {
      userId,
      name: anyData.name || 'Plan nutritionnel', // Valeur par défaut si non fournie par l'utilisateur
      durationWeeks: data.durationWeeks,
      goal: anyData.goal || data.goalUnit || GoalEnum.MAINTAIN, // Utiliser goalUnit si fourni ou valeur par défaut
      unit: anyData.unit || WeightUnitEnum.KG, // Valeur par défaut
      initialWeight: data.initialWeight || 70,
      targetWeight: data.targetWeight || 70,
      calories: totalCalories, // Utiliser les calories calculées
      carbs: carbsGrams, // Grammes calculés
      protein: proteinGrams, // Grammes calculés
      fat: fatGrams, // Grammes calculés
      type: anyData.type || PlanGeneratedWithEnum.MANUAL, // Le type de génération du plan
      startDate: anyData.startDate || new Date().toISOString().split('T')[0],
    };

    // Ajouter les propriétés spécifiques si elles existent dans les données fournies
    if ('name' in data) planData.name = data.name as string;
    if ('goal' in data) planData.goal = data.goal as GoalEnum;
    if ('calories' in data) planData.calories = data.calories as number;
    if ('carbs' in data) planData.carbs = data.carbs as number;
    if ('protein' in data) planData.protein = data.protein as number;
    if ('fat' in data) planData.fat = data.fat as number;

    // Créer le plan dans la base de données avec les données typées
    const insertedPlan = await db
      .insert(plan)
      .values(planData)
      .returning({ id: plan.id });

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
        durationWeeks,
      });

      if (!dailyPlansResult.success) {
        logger.warn(
          LogCategory.DATABASE,
          `Warning: Daily plans creation failed for plan ${planId}: ${dailyPlansResult.error}`,
        );
      }
    } catch (dailyPlanError) {
      // Ne pas bloquer la création du plan en cas d'erreur lors de la création des plans quotidiens
      logger.warn(
        LogCategory.DATABASE,
        `Warning: Error creating daily plans for plan ${planId}: ${
          dailyPlanError instanceof Error
            ? dailyPlanError.message
            : String(dailyPlanError)
        }`,
      );
    }

    logger.info(
      LogCategory.DATABASE,
      `Successfully created plan ${planId} for user ${userId} via MCP Server`,
    );
    return { success: true, planId };
  } catch (error) {
    logger.error(
      LogCategory.DATABASE,
      `Error in handleCreatePlan: ${
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
 * Handler pour la méthode createDailyPlansViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres de création des plans journaliers
 * @returns Résultat de l'opération
 */
export async function handleCreateDailyPlans(
  db: any,
  params: CreateDailyPlansParams,
): Promise<DailyPlansResult> {
  try {
    if (!db) throw new Error('Database not initialized');

    const { planId, durationWeeks, transaction } = params;

    logger.info(
      LogCategory.DATABASE,
      `Creating daily plans via MCP Server for plan ${planId}`,
    );

    // Vérifier que le plan existe
    const existingPlan = await db
      .select({ id: plan.id, startDate: plan.startDate })
      .from(plan)
      .where(eq(plan.id, planId));

    if (!existingPlan.length) {
      throw new Error(`Plan with id ${planId} not found`);
    }

    // Utiliser une transaction si fournie, sinon continuer sans transaction
    const dbContext = transaction || db;

    // Générer un dailyPlan par date pour toute la durée
    const dailyPlansToInsert: {
      planId: number;
      day: string;
      date: string;
      generatedWith: string;
    }[] = [];

    const baseDate = new Date(existingPlan[0].startDate);
    const totalDays = durationWeeks * DayUnitArray.length;

    function addDays(d: Date, n: number) {
      const copy = new Date(d);
      copy.setDate(copy.getDate() + n);
      return copy;
    }

    for (let i = 0; i < totalDays; i++) {
      const current = addDays(baseDate, i);
      const dateIso = current.toISOString().split('T')[0];
            // getDay() renvoie 0 (dimanche) à 6 (samedi). On mappe manuellement :
      const mappedDay =
        current.getDay() === 0 ? DayEnum.SUNDAY : DayUnitArray[current.getDay() - 1];

      dailyPlansToInsert.push({
        planId,
        day: mappedDay,
        date: dateIso,
        generatedWith: DailyPlanGeneratedWithEnum.COMPANY,
      });
    }

    // Insérer tous les plans journaliers
    await dbContext.insert(dailyPlan).values(dailyPlansToInsert);

    logger.info(
      LogCategory.DATABASE,
      `Successfully created ${dailyPlansToInsert.length} daily plans for plan ${planId} via MCP Server`,
    );
    return { success: true };
  } catch (error) {
    logger.error(
      LogCategory.DATABASE,
      `Error in handleCreateDailyPlans: ${
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
 * Handler pour la méthode updatePlanViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres de mise à jour du plan
 * @returns Résultat de l'opération
 */
export async function handleUpdatePlan(
  db: any,
  params: UpdatePlanParams,
): Promise<BasicResult> {
  try {
    if (!db) throw new Error('Database not initialized');

    const { planId, data, userId } = params;

    if (!userId) {
      logger.error(
        LogCategory.DATABASE,
        `Attempted to update plan ${planId} without providing userId`,
      );
      return {
        success: false,
        error: 'User ID is required for updating plans',
      };
    }

    logger.info(
      LogCategory.DATABASE,
      `Updating plan ${planId} for user ${userId} via MCP Server`,
    );

    // Exécuter toutes les opérations dans une transaction pour garantir la cohérence
    return await db.transaction(async (tx: typeof db) => {
      // Vérifier si le plan existe et appartient à l'utilisateur
      const planExists = await tx
        .select({ id: plan.id })
        .from(plan)
        .where(
          and(
            eq(plan.id, planId),
            eq(plan.userId, userId), // Vérification de sécurité: l'utilisateur doit être propriétaire du plan
          ),
        )
        .limit(1);

      if (!planExists.length) {
        throw new Error(
          `Plan with id ${planId} not found or does not belong to user ${userId}`,
        );
      }

      // Mettre à jour le plan principal
      await tx.update(plan).set(data).where(eq(plan.id, planId));

      // Propager les changements nutritionnels aux plans journaliers si ces données ont été modifiées
      const nutritionUpdates: Partial<DailyPlanOrmProps> = {};

      // Vérifier quelles données nutritionnelles ont été modifiées et doivent être propagées
      if (data.calories !== undefined)
        nutritionUpdates.calories = data.calories;
      if (data.carbs !== undefined) nutritionUpdates.carbs = data.carbs;
      if (data.protein !== undefined) nutritionUpdates.protein = data.protein;
      if (data.fat !== undefined) nutritionUpdates.fat = data.fat;

      // Ne propager les changements que s'il y a des mises à jour nutritionnelles
      if (Object.keys(nutritionUpdates).length > 0) {
        logger.info(
          LogCategory.DATABASE,
          `Propagating nutrition changes to daily plans for plan ${planId}`,
          nutritionUpdates,
        );

        // Trouver tous les plans journaliers associés à ce plan
        const dailyPlansResult = await tx
          .select({ id: dailyPlan.id })
          .from(dailyPlan)
          .where(eq(dailyPlan.planId, planId));

        if (dailyPlansResult.length > 0) {
          // Mettre à jour tous les plans journaliers avec les nouvelles valeurs nutritionnelles
          await tx
            .update(dailyPlan)
            .set(nutritionUpdates)
            .where(eq(dailyPlan.planId, planId));

          logger.info(
            LogCategory.DATABASE,
            `Successfully updated ${dailyPlansResult.length} daily plans for plan ${planId}`,
          );
        } else {
          logger.info(
            LogCategory.DATABASE,
            `No daily plans found to update for plan ${planId}`,
          );
        }
      }

      logger.info(
        LogCategory.DATABASE,
        `Successfully updated plan ${planId} for user ${userId} via MCP Server`,
      );
      return { success: true };
    });
  } catch (error) {
    logger.error(
      LogCategory.DATABASE,
      `Error in handleUpdatePlan: ${
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
 * Handler pour la méthode deletePlanViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres de suppression du plan
 * @returns Résultat de l'opération
 */
export async function handleDeletePlan(
  db: any,
  params: DeletePlanParams,
): Promise<DeletePlanResult> {
  try {
    if (!db) throw new Error('Database not initialized');

    const { planId, userId } = params;

    if (!userId) {
      logger.error(
        LogCategory.DATABASE,
        `Attempted to delete plan ${planId} without providing userId`,
      );
      return {
        success: false,
        error: 'User ID is required for deleting plans',
      };
    }

    logger.info(
      LogCategory.DATABASE,
      `Deleting plan ${planId} for user ${userId} via MCP Server`,
    );

    // Récupérer d'abord les informations du plan pour vérifier s'il est utilisé comme plan actuel
    // et vérifier que l'utilisateur est propriétaire du plan
    const planInfo = await db
      .select({ current: plan.current, userId: plan.userId })
      .from(plan)
      .where(
        and(
          eq(plan.id, planId),
          eq(plan.userId, userId), // Vérification de sécurité: l'utilisateur doit être propriétaire du plan
        ),
      )
      .limit(1);

    if (!planInfo.length) {
      logger.warn(
        LogCategory.DATABASE,
        `Plan with id ${planId} not found during deletion attempt`,
      );
      return { success: false, error: `Plan with id ${planId} not found` };
    }

    // Exécuter toutes les opérations de suppression dans une transaction pour garantir l'intégrité
    await db.transaction(async (tx: any) => {
      // 1. Trouver tous les daily plans associés au plan
      const dailyPlansToDelete = await tx
        .select({ id: dailyPlan.id })
        .from(dailyPlan)
        .where(eq(dailyPlan.planId, planId));
      logger.debug(
        LogCategory.DATABASE,
        `Found ${dailyPlansToDelete.length} daily plans to delete for plan ${planId}`,
      );

      // 2. Si des daily plans existent, supprimer d'abord toutes les associations meal-dailyplan
      if (dailyPlansToDelete.length > 0) {
        const dailyPlanIds = dailyPlansToDelete.map(
          (dp: { id: number }) => dp.id,
        );

        // Supprimer les associations repas-plan journalier
        const deleteResult = await tx
          .delete(dailyPlanMeals)
          .where(inArray(dailyPlanMeals.dailyPlanId, dailyPlanIds));
        logger.debug(
          LogCategory.DATABASE,
          `Deleted meal associations for daily plans of plan ${planId}`,
        );

        // 3. Supprimer tous les daily plans
        await tx.delete(dailyPlan).where(eq(dailyPlan.planId, planId));
        logger.debug(
          LogCategory.DATABASE,
          `Deleted daily plans for plan ${planId}`,
        );
      }

      // 4. Vérifier si ce plan est marqué comme courant
      const planDetails = await tx
        .select({ current: plan.current })
        .from(plan)
        .where(eq(plan.id, planId))
        .limit(1);

      if (planDetails.length > 0 && planDetails[0].current) {
        logger.debug(
          LogCategory.DATABASE,
          `Plan ${planId} was marked as current and is being deleted`,
        );
      }

      // 5. Finalement, supprimer le plan lui-même
      await tx.delete(plan).where(eq(plan.id, planId));
      logger.debug(LogCategory.DATABASE, `Deleted plan ${planId}`);
    });

    logger.info(
      LogCategory.DATABASE,
      `Successfully deleted plan ${planId} for user ${userId} via MCP Server`,
    );
    return { success: true, planId };
  } catch (error) {
    logger.error(
      LogCategory.DATABASE,
      `Error in handleDeletePlan: ${
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
 * Handler pour la méthode getPlanDetailsViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres pour récupérer les détails d'un plan
 * @returns Résultat de l'opération avec les détails du plan
 */
export async function handleGetPlanDetails(
  db: any,
  params: { planId: number | string; userId: number },
): Promise<GetPlanDetailsResult> {
  try {
    if (!db) throw new Error('Database not initialized');

    const { planId, userId } = params;

    logger.info(
      LogCategory.DATABASE,
      `Getting plan details for plan ${planId} and user ${userId} via MCP Server`,
    );

    // Récupérer les détails du plan et vérifier que l'utilisateur est propriétaire du plan
    const numericPlanId =
      typeof planId === 'string' ? parseInt(planId, 10) : planId;

    const planDetails = await db
      .select()
      .from(plan)
      .where(
        and(
          eq(plan.id, numericPlanId),
          eq(plan.userId, userId), // Vérification de sécurité: l'utilisateur doit être propriétaire du plan
        ),
      )
      .limit(1);

    if (!planDetails.length) {
      return {
        success: false,
        error: `Plan with id ${planId} not found or does not belong to user ${userId}`,
      };
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
        dailyPlans: dailyPlans.map((dp: DailyPlanOrmProps) => ({
          ...dp,
          meals: [],
        })),
      };
    }

    // Récupérer tous les repas dans ces relations
    const mealIds = dailyPlanMealsRelations.map(
      (dpm: { mealId: number }) => dpm.mealId,
    );
    const mealRecords = await db.query.meals.findMany({
      where: inArray(meals.id, mealIds),
    });

    // Combiner les résultats efficacement en utilisant une Map
    const dailyPlanMap: Map<
      number,
      DailyPlanOrmProps & { meals: MealOrmProps[] }
    > = new Map();

    dailyPlans.forEach((dp: DailyPlanOrmProps) => {
      dailyPlanMap.set(dp.id, { ...dp, meals: [] });
    });

    // Ajouter les repas à chaque plan journalier
    dailyPlanMealsRelations.forEach(
      (dpm: {
        dailyPlanId: number;
        mealId: number;
        quantity?: number;
        unit?: string;
      }) => {
        const dailyPlanWithMeals:
          | (DailyPlanOrmProps & { meals: MealOrmProps[] })
          | undefined = dailyPlanMap.get(dpm.dailyPlanId);
        if (dailyPlanWithMeals) {
          const meal: MealOrmProps | undefined = mealRecords.find(
            (m: MealOrmProps) => m.id === dpm.mealId,
          );
          if (meal) {
            // Ajouter les propriétés spécifiques à cette relation repas-plan
            dailyPlanWithMeals.meals.push({
              ...meal,
              quantity: dpm.quantity ?? 1, // Valeur par défaut si undefined
              unit: (dpm.unit as MealUnitEnum) ?? MealUnitEnum.GRAMMES, // Cast explicite et valeur par défaut
            });
          }
        }
      },
    );

    // Convertir la Map en tableau pour le résultat final
    const dailyPlansWithMeals = Array.from(dailyPlanMap.values());

    logger.info(
      LogCategory.DATABASE,
      `Retrieved plan details for plan ${planId} with ${dailyPlansWithMeals.length} daily plans via MCP Server`,
    );
    return {
      success: true,
      plan: planDetails[0],
      dailyPlans: dailyPlansWithMeals,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(
      LogCategory.DATABASE,
      `Error in handleGetPlanDetails: ${errorMessage}`,
      {
        planId: params.planId,
        userId: params.userId,
        error: JSON.stringify(error),
      },
    );
    return {
      success: false,
      error:
        errorMessage || 'Erreur lors de la récupération des détails du plan',
    };
  }
}

/**
 * Handler pour la méthode getPlansListViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres pour récupérer la liste des plans
 * @returns Résultat de l'opération avec la liste des plans
 */
export async function handleGetPlansList(
  db: any,
  params: { userId: number },
): Promise<GetPlansListResult> {
  try {
    if (!db) throw new Error('Database not initialized');

    const { userId } = params;
    if (!userId) {
      logger.error(
        LogCategory.DATABASE,
        `Missing userId in handleGetPlansList`,
      );
      return { success: false, error: 'Missing required userId parameter' };
    }

    logger.info(
      LogCategory.DATABASE,
      `Getting plans list for user ${userId} via MCP Server`,
    );

    // Récupérer uniquement les plans de l'utilisateur spécifié
    const plansList = await db
      .select()
      .from(plan)
      .where(eq(plan.userId, userId));

    logger.info(
      LogCategory.DATABASE,
      `Retrieved ${plansList.length} plans for user ${userId} via MCP Server`,
    );
    return { success: true, plans: plansList };
  } catch (error) {
    logger.error(
      LogCategory.DATABASE,
      `Error in handleGetPlansList: ${
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
 * Handler pour la méthode addDailyPlanViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres d'ajout du plan journalier
 * @returns Résultat de l'opération
 */
export async function handleAddDailyPlan(
  db: any,
  params: AddDailyPlanParams,
): Promise<AddDailyPlanResult> {
  try {
    if (!db) throw new Error('Database not initialized');

    const { planId, dailyPlanData } = params;

    logger.info(
      LogCategory.DATABASE,
      `Adding daily plan for plan ${planId} via MCP Server`,
    );

    // Vérifier que le plan existe
    const existingPlan = await db
      .select({ id: plan.id })
      .from(plan)
      .where(eq(plan.id, planId));

    if (!existingPlan.length) {
      throw new Error(`Plan with id ${planId} not found`);
    }

    // Créer le plan journalier
    const insertedDailyPlan = await db
      .insert(dailyPlan)
      .values({
        planId,
        date: dailyPlanData.date,
        day: dailyPlanData.day ?? DayUnitArray[new Date(dailyPlanData.date).getDay()],
        calories: dailyPlanData.calories,
        carbs: dailyPlanData.carbs,
        protein: dailyPlanData.protein,
        fat: dailyPlanData.fat,
        generatedWith: DailyPlanGeneratedWithEnum.MANUAL,
      })
      .returning({ id: dailyPlan.id });

    if (!insertedDailyPlan.length) {
      throw new Error('Failed to insert daily plan');
    }

    logger.info(
      LogCategory.DATABASE,
      `Successfully created daily plan ${insertedDailyPlan[0].id} for plan ${planId} via MCP Server`,
    );
    return { success: true, dailyPlanId: insertedDailyPlan[0].id };
  } catch (error) {
    logger.error(
      LogCategory.DATABASE,
      `Error in handleAddDailyPlan: ${
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
 * Handler pour la méthode addMealToDailyPlanViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres d'ajout d'un repas au plan journalier
 * @returns Résultat de l'opération
 */
export async function handleAddMealToDailyPlan(
  db: any,
  params: AddMealToDailyPlanParams,
): Promise<AddMealToDailyPlanResult> {
  try {
    if (!db) throw new Error('Database not initialized');

    const { dailyPlanId, mealId, quantity = 100, mealType } = params; // Valeur par défaut de 100g

    logger.info(
      LogCategory.DATABASE,
      `Adding meal ${mealId} to daily plan ${dailyPlanId} via MCP Server${
        mealType ? ` as ${mealType}` : ''
      }`,
    );

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
      logger.warn(
        LogCategory.DATABASE,
        `Daily plan with ID ${dailyPlanId} not found`,
      );
      return {
        success: false,
        error: `Daily plan with ID ${dailyPlanId} not found`,
      };
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
    await db.insert(dailyPlanMeals).values({
      dailyPlanId,
      mealId,
      quantity,
      // Utiliser le type spécifique s'il est fourni, sinon utiliser le type par défaut du repas
      mealType: mealType || mealInfo.type,
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

    logger.info(
      LogCategory.DATABASE,
      `Successfully added meal ${mealId} to daily plan ${dailyPlanId} via MCP Server`,
    );
    return { success: true };
  } catch (error) {
    logger.error(
      LogCategory.DATABASE,
      `Error in handleAddMealToDailyPlan: ${
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
 * Handler pour la méthode getMealQuantityInPlanViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres pour récupérer la quantité d'un repas dans un plan journalier
 * @returns Résultat de l'opération avec la quantité du repas
 */
export async function handleGetMealQuantityInPlan(
  db: any,
  params: GetMealQuantityInPlanParams,
): Promise<GetMealQuantityInPlanResult> {
  try {
    if (!db) throw new Error('Database not initialized');

    const { dailyPlanId, mealId } = params;

    logger.info(
      LogCategory.DATABASE,
      `Getting quantity of meal ${mealId} in daily plan ${dailyPlanId} via MCP Server`,
    );

    // Récupérer la relation entre le repas et le plan journalier
    const relation = await db
      .select({ quantity: dailyPlanMeals.quantity })
      .from(dailyPlanMeals)
      .where(
        and(
          eq(dailyPlanMeals.dailyPlanId, dailyPlanId),
          eq(dailyPlanMeals.mealId, mealId),
        ),
      )
      .limit(1);

    if (relation.length === 0) {
      logger.warn(
        LogCategory.DATABASE,
        `No relation found between meal ${mealId} and daily plan ${dailyPlanId}`,
      );
      return { success: false, error: `Meal is not in this daily plan` };
    }

    logger.info(
      LogCategory.DATABASE,
      `Successfully got quantity of meal ${mealId} in daily plan ${dailyPlanId} via MCP Server`,
    );
    return { success: true, quantity: relation[0].quantity };
  } catch (error) {
    logger.error(
      LogCategory.DATABASE,
      `Error in handleGetMealQuantityInPlan: ${
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
 * Handler pour la méthode updateMealQuantityInPlanViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres pour mettre à jour la quantité d'un repas dans un plan journalier
 * @returns Résultat de l'opération
 */
export async function handleUpdateMealQuantityInPlan(
  db: any,
  params: UpdateMealQuantityInPlanParams,
): Promise<UpdateMealQuantityInPlanResult> {
  try {
    if (!db) throw new Error('Database not initialized');

    const { dailyPlanId, mealId, newQuantity } = params;

    logger.info(
      LogCategory.DATABASE,
      `Updating quantity of meal ${mealId} in daily plan ${dailyPlanId} to ${newQuantity} via MCP Server`,
    );

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
          eq(dailyPlanMeals.mealId, mealId),
        ),
      )
      .limit(1);

    if (currentRelation.length === 0) {
      logger.warn(
        LogCategory.DATABASE,
        `No relation found between meal ${mealId} and daily plan ${dailyPlanId}`,
      );
      return { success: false, error: `Meal is not in this daily plan` };
    }

    const mealInfo = meal[0];
    const relationInfo = currentRelation[0];

    // Calculer les valeurs nutritionnelles avec plus de précision
    // Utiliser directement la fonction de calcul du helper pour cohérence
    const baseQuantity = mealInfo.quantity || 100;
    const baseMacros = {
      calories: mealInfo.calories || 0,
      carbs: mealInfo.carbs || 0,
      fat: mealInfo.fat || 0,
      protein: mealInfo.protein || 0,
    };

    // Anciennes valeurs précisément calculées selon la quantité actuelle
    const oldMacros = {
      calories: Math.round((relationInfo.calories || 0) * 100) / 100,
      carbs: Math.round((relationInfo.carbs || 0) * 100) / 100,
      fat: Math.round((relationInfo.fat || 0) * 100) / 100,
      protein: Math.round((relationInfo.protein || 0) * 100) / 100,
    };

    // Nouvelles valeurs précisément calculées proportionnellement
    const newMacros = {
      calories:
        Math.round(((baseMacros.calories * newQuantity) / baseQuantity) * 100) /
        100,
      carbs:
        Math.round(((baseMacros.carbs * newQuantity) / baseQuantity) * 100) /
        100,
      fat:
        Math.round(((baseMacros.fat * newQuantity) / baseQuantity) * 100) / 100,
      protein:
        Math.round(((baseMacros.protein * newQuantity) / baseQuantity) * 100) /
        100,
    };

    // Récupérer le plan journalier actuel
    const currentDailyPlan = await db
      .select()
      .from(dailyPlan)
      .where(eq(dailyPlan.id, dailyPlanId))
      .limit(1);

    if (currentDailyPlan.length === 0) {
      logger.warn(
        LogCategory.DATABASE,
        `Daily plan with ID ${dailyPlanId} not found`,
      );
      return {
        success: false,
        error: `Daily plan with ID ${dailyPlanId} not found`,
      };
    }

    const dailyPlanInfo = currentDailyPlan[0];

    // Calculer les nouveaux totaux avec précision
    const newDailyTotals = {
      calories:
        Math.round(
          (dailyPlanInfo.calories - oldMacros.calories + newMacros.calories) *
            100,
        ) / 100,
      carbs:
        Math.round(
          (dailyPlanInfo.carbs - oldMacros.carbs + newMacros.carbs) * 100,
        ) / 100,
      fat:
        Math.round((dailyPlanInfo.fat - oldMacros.fat + newMacros.fat) * 100) /
        100,
      protein:
        Math.round(
          (dailyPlanInfo.protein - oldMacros.protein + newMacros.protein) * 100,
        ) / 100,
    };

    logger.debug(LogCategory.DATABASE, 'Nutrition values calculation', {
      mealBase: baseMacros,
      oldValues: oldMacros,
      newValues: newMacros,
      dailyPlanOld: {
        calories: dailyPlanInfo.calories,
        carbs: dailyPlanInfo.carbs,
        fat: dailyPlanInfo.fat,
        protein: dailyPlanInfo.protein,
      },
      dailyPlanNew: newDailyTotals,
    });

    // Mettre à jour la relation avec les nouvelles valeurs nutritionnelles
    await db
      .update(dailyPlanMeals)
      .set({
        quantity: newQuantity,
        calories: newMacros.calories,
        carbs: newMacros.carbs,
        fat: newMacros.fat,
        protein: newMacros.protein,
        updatedAt: new Date().toISOString(),
      })
      .where(
        and(
          eq(dailyPlanMeals.dailyPlanId, dailyPlanId),
          eq(dailyPlanMeals.mealId, mealId),
        ),
      );

    // Mettre à jour les valeurs nutritionnelles totales du plan journalier
    await db
      .update(dailyPlan)
      .set({
        calories: newDailyTotals.calories,
        carbs: newDailyTotals.carbs,
        fat: newDailyTotals.fat,
        protein: newDailyTotals.protein,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(dailyPlan.id, dailyPlanId));

    logger.info(
      LogCategory.DATABASE,
      `Successfully updated quantity of meal ${mealId} in daily plan ${dailyPlanId} via MCP Server`,
    );
    return { success: true };
  } catch (error) {
    logger.error(
      LogCategory.DATABASE,
      `Error in handleUpdateMealQuantityInPlan: ${
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
 * Handler pour la méthode setCurrentPlanViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres pour définir le plan actuel d'un utilisateur
 * @returns Résultat de l'opération
 */
export async function handleSetCurrentPlan(
  db: any,
  params: SetCurrentPlanParams,
): Promise<SetCurrentPlanResult> {
  try {
    if (!db) throw new Error('Database not initialized');

    const { planId, userId } = params;

    logger.info(
      LogCategory.DATABASE,
      `Setting plan ${planId} as current for user ${userId} via MCP Server`,
    );

    // Vérifier si le plan existe et appartient à l'utilisateur
    const planQuery = await db
      .select()
      .from(plan)
      .where(and(eq(plan.id, planId), eq(plan.userId, userId)))
      .limit(1);

    if (planQuery.length === 0) {
      logger.warn(
        LogCategory.DATABASE,
        `Plan ${planId} not found or does not belong to user ${userId}`,
      );
      return {
        success: false,
        error: `Plan not found or does not belong to this user`,
      };
    }

    // Mettre à jour tous les plans de l'utilisateur pour les définir comme non-actuel
    await db
      .update(plan)
      .set({ current: false })
      .where(eq(plan.userId, userId));

    // Définir le plan spécifié comme actuel
    await db.update(plan).set({ current: true }).where(eq(plan.id, planId));

    logger.info(
      LogCategory.DATABASE,
      `Successfully set plan ${planId} as current for user ${userId} via MCP Server`,
    );
    return { success: true };
  } catch (error) {
    logger.error(
      LogCategory.DATABASE,
      `Error in handleSetCurrentPlan: ${
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
 * Handler pour la méthode getCurrentPlanViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres pour récupérer le plan actuel d'un utilisateur
 * @returns Résultat de l'opération avec le plan actuel
 */
export async function handleGetCurrentPlan(
  db: any,
  params: GetCurrentPlanParams,
): Promise<GetCurrentPlanResult> {
  try {
    if (!db) throw new Error('Database not initialized');

    const { userId } = params;

    logger.info(
      LogCategory.DATABASE,
      `Getting current plan for user ${userId} via MCP Server`,
    );

    // Récupérer le plan actuel de l'utilisateur
    const currentPlan = await db
      .select()
      .from(plan)
      .where(and(eq(plan.userId, userId), eq(plan.current, true)))
      .limit(1);

    if (!currentPlan.length) {
      logger.warn(
        LogCategory.DATABASE,
        `No current plan found for user ${userId}`,
      );
      return { success: true, plan: null };
    }

    logger.info(
      LogCategory.DATABASE,
      `Successfully got current plan for user ${userId} via MCP Server`,
    );
    return { success: true, plan: currentPlan[0] };
  } catch (error) {
    logger.error(
      LogCategory.DATABASE,
      `Error in handleGetCurrentPlan: ${
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
 * Handler pour calculer les valeurs nutritionnelles en fonction d'une quantité
 * @param db Instance de la base de données
 * @param params Paramètres pour le calcul
 * @returns Les valeurs nutritionnelles calculées
 */
export async function handleCalculateMealNutrition(
  db: any,
  params: {
    mealId: number;
    quantity: number;
  },
): Promise<{
  success: boolean;
  error?: string;
  nutrition?: {
    calories: number;
    carbs: number;
    fat: number;
    protein: number;
  };
}> {
  try {
    if (!db) throw new Error('Database not initialized');

    const { mealId, quantity } = params;

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

    const mealInfo = meal[0];

    // Calculer les valeurs nutritionnelles pour la quantité donnée
    // Les valeurs nutritionnelles dans la base de données sont pour 100g (standard)
    // donc nous devons les ajuster pour la quantité demandée
    const quantityRatio = quantity / 100; // Division par 100 car les valeurs nutritionnelles sont par 100g

    logger.debug(
      LogCategory.NUTRITION,
      `Calcul nutritionnel: q=${quantity}g, facteur=${quantityRatio.toFixed(
        2,
      )}, ` +
        `Cal=${mealInfo.calories} -> ${Math.round(
          mealInfo.calories * quantityRatio,
        )}`,
    );

    const calculatedNutrition = {
      calories: Math.round(mealInfo.calories * quantityRatio),
      carbs: Math.round(mealInfo.carbs * quantityRatio),
      fat: Math.round(mealInfo.fat * quantityRatio),
      protein: Math.round(mealInfo.protein * quantityRatio),
    };

    return {
      success: true,
      nutrition: calculatedNutrition,
    };
  } catch (error) {
    logger.error(
      LogCategory.DATABASE,
      `Error in handleCalculateMealNutrition: ${
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
 * Handler pour calculer les valeurs nutritionnelles d'un plan journalier
 * @param db Instance de la base de données
 * @param params Paramètres pour le calcul
 * @returns Les valeurs nutritionnelles calculées et le poids total
 */
export async function handleGetDailyPlanNutrition(
  db: any,
  params: GetDailyPlanNutritionParams,
): Promise<GetDailyPlanNutritionResult> {
  try {
    if (!db) throw new Error('Database not initialized');

    const { dailyPlanId, userId } = params;

    logger.info(
      LogCategory.DATABASE,
      `Calculating nutrition for daily plan ${dailyPlanId} for user ${userId}`,
    );

    // Vérifier que l'utilisateur est autorisé à accéder à ce plan journalier
    const dailyPlanInfo = await db
      .select()
      .from(dailyPlan)
      .leftJoin(plan, eq(dailyPlan.planId, plan.id))
      .where(and(eq(dailyPlan.id, dailyPlanId), eq(plan.userId, userId)))
      .limit(1);

    if (dailyPlanInfo.length === 0) {
      logger.warn(
        LogCategory.DATABASE,
        `Daily plan with ID ${dailyPlanId} not found or user not authorized`,
      );
      return {
        success: false,
        error: `Daily plan with ID ${dailyPlanId} not found or user not authorized`,
      };
    }

    // Récupérer tous les repas associés à ce plan journalier avec leurs quantités
    const mealEntries = await db
      .select({
        meal: meals, // meals est la table, pas une variable locale
        quantity: dailyPlanMeals.quantity,
      })
      .from(dailyPlanMeals)
      .leftJoin(meals, eq(dailyPlanMeals.mealId, meals.id))
      .where(eq(dailyPlanMeals.dailyPlanId, dailyPlanId));

    // Calculer les totaux nutritionnels
    let totalCalories = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalProtein = 0;
    let totalWeight = 0;

    for (const mealData of mealEntries) {
      const meal = mealData.meal;
      const quantity = mealData.quantity || 0;

      // Les valeurs nutritionnelles sont déjà normalisées pour 100g dans la base de données
      // donc nous multiplions simplement par quantity/100 pour obtenir les valeurs correctes
      totalCalories += ((meal.calories || 0) * quantity) / 100;
      totalCarbs += ((meal.carbs || 0) * quantity) / 100;
      totalFat += ((meal.fat || 0) * quantity) / 100;
      totalProtein += ((meal.protein || 0) * quantity) / 100;
      totalWeight += quantity;
    }

    // Arrondir les valeurs pour plus de cohérence
    const nutritionResult = {
      calories: Math.round(totalCalories),
      carbs: Math.round(totalCarbs),
      fat: Math.round(totalFat),
      protein: Math.round(totalProtein),
      totalWeight,
    };

    logger.info(
      LogCategory.DATABASE,
      `Calculated nutrition for daily plan ${dailyPlanId}: ` +
        `Cal=${nutritionResult.calories}, C=${nutritionResult.carbs}, ` +
        `F=${nutritionResult.fat}, P=${nutritionResult.protein}, ` +
        `Weight=${totalWeight}g`,
    );

    return {
      success: true,
      nutrition: nutritionResult,
    };
  } catch (error) {
    logger.error(
      LogCategory.DATABASE,
      `Error in handleGetDailyPlanNutrition: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
