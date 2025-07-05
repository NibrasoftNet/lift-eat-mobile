import {
  dailyPlan,
  dailyPlanMeals,
  DailyPlanMealsOrmProps,
  ingredientsStandard,
  mealIngredients,
  MealIngredientsOrmProps,
  meals,
  plan,
  users,
} from '@/db/schema';
import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { AsyncStorage } from 'expo-sqlite/kv-store';
import {
  dailyPlanSeed,
  ingredientsStandardSeed,
  mealsSeed,
  planSeed,
  usersSeed,
} from '@/db/seeds';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { eq, sql } from 'drizzle-orm';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { MealTypeEnum } from '@/utils/enum/meal.enum';
import { ingredientImages } from '@/db/ingredientImages';

// Static image paths mapped by MealTypeEnum using require()
const images: Record<MealTypeEnum, number> = {
  [MealTypeEnum.BREAKFAST]: require('../assets/images/seed/caesar_salad.jpg'),
  [MealTypeEnum.LUNCH]: require('../assets/images/seed/kouskousi.jpg'),
  [MealTypeEnum.DINNER]: require('../assets/images/seed/suchi_bowl.jpg'),
  // Default snack image
  [MealTypeEnum.SNACK]: require('../assets/images/seed/almonds.jpg'),
};

// Utility to detect already encoded base64 image strings
function isBase64Image(str: string): boolean {
  return /^data:image\/(png|jpe?g);base64,/.test(str);
}

// Function to load a static asset OR absolute/remote URI and return Base64
async function getImageBuffer(
  assetOrUri: number | string,
): Promise<any | null> {
  try {
    const startTime = performance.now();
    let asset: Asset;

    if (typeof assetOrUri === 'number') {
      asset = Asset.fromModule(assetOrUri);
    } else {
      // Accept absolute / remote URI or relative path previously resolved by metro
      asset = Asset.fromURI(assetOrUri);
    }

    await asset.downloadAsync(); // Ensure it's downloaded

    if (!asset.localUri) {
      logger.error(LogCategory.DATABASE, `Échec de chargement de l'asset`, {
        assetOrUri,
      });
      return '';
    }

    const base64Data = await FileSystem.readAsStringAsync(asset.localUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const duration = performance.now() - startTime;
    // logger.debug(LogCategory.PERFORMANCE, `Asset chargé en ${duration.toFixed(2)}ms`, { assetOrUri });
    return base64Data;
  } catch (error) {
    logger.error(
      LogCategory.DATABASE,
      `Erreur générale de chargement d'asset`,
      { assetOrUri, error },
    );
    return '';
  }
}

// Function to prepare users with images
async function prepareUserWithImages() {
  return await Promise.all(
    usersSeed.map(async (user) => {
      if (!user.profileImage) {
        const imageBuffer = await getImageBuffer(
          require('../assets/images/logo_no_bg.png'),
        );
        return {
          ...user,
          profileImage:
            `data:image/jpeg;base64,${imageBuffer}` as unknown as Buffer,
        };
      }

      // If profileImage provided as asset module number, convert once
      if (typeof user.profileImage === 'number') {
        const imageBuffer = await getImageBuffer(user.profileImage);
        return {
          ...user,
          profileImage:
            `data:image/jpeg;base64,${imageBuffer}` as unknown as Buffer,
        };
      }

      return user;
    }),
  );
}

// Function to prepare ingredient standards with images
async function prepareIngredientStandardWithImages() {
  return await Promise.all(
    ingredientsStandardSeed.map(async (ingStandard) => {
      // Skip if already base64 encoded or buffer
      if (
        ingStandard.image &&
        typeof ingStandard.image === 'string' &&
        isBase64Image(ingStandard.image as unknown as string)
      ) {
        return ingStandard;
      }

      try {
        let buffer: string | null = null;

        if (typeof ingStandard.image === 'number') {
          buffer = await getImageBuffer(ingStandard.image);
        } else if (typeof ingStandard.image === 'string' && ingStandard.image) {
          const assetId = ingredientImages[ingStandard.image as string];
          if (assetId) {
            buffer = await getImageBuffer(assetId);
          } else {
            // Absolute or remote URI
            buffer = await getImageBuffer(ingStandard.image);
          }
        }

        if (buffer) {
          return {
            ...ingStandard,
            image: `data:image/jpeg;base64,${buffer}` as unknown as Buffer,
          };
        }
      } catch (error) {
        logger.error(
          LogCategory.DATABASE,
          'Erreur de chargement image ingrédient',
          { ingStandard, error },
        );
      }

      return { ...ingStandard, image: null };
    }),
  );
}

// Function to prepare meals with images
async function prepareMealsWithImages() {
  return await Promise.all(
    mealsSeed.map(async (meal) => {
      // If already base64 encoded, leave untouched
      if (
        meal.image &&
        typeof meal.image === 'string' &&
        isBase64Image(meal.image)
      ) {
        return meal;
      }

      try {
        let buffer: string | null = null;

        if (meal.image && typeof meal.image === 'number') {
          buffer = await getImageBuffer(meal.image);
        } else if (meal.image && typeof meal.image === 'string') {
          // Handle as URI (local file path or remote URL)
          buffer = await getImageBuffer(meal.image);
        } else if (images[meal.type]) {
          buffer = await getImageBuffer(images[meal.type]);
        }

        if (buffer) {
          return {
            ...meal,
            image: `data:image/jpeg;base64,${buffer}` as unknown as Buffer,
          };
        }
      } catch (error) {
        logger.error(LogCategory.DATABASE, 'Erreur chargement image repas', {
          meal,
          error,
        });
      }

      return meal;
    }),
  );
}

// Helper to chunk inserts to avoid SQLite parameter limits
async function chunkInsert<T>(
  db: ExpoSQLiteDatabase,
  table: any,
  values: T[],
  chunkSize = 200,
): Promise<{ id: number | null }[]> {
  const ids: { id: number | null }[] = [];
  for (let i = 0; i < values.length; i += chunkSize) {
    const slice = values.slice(i, i + chunkSize);
    const inserted = await db
      .insert(table)
      .values(slice as any)
      .returning({ id: table.id });
    ids.push(...inserted);
  }
  return ids;
}

// Function to add dummy data
export const addDummyData = async (db: ExpoSQLiteDatabase) => {
  const globalStartTime = performance.now();
  logger.info(LogCategory.DATABASE, 'Début du chargement des données seed');

  // Vérifier si les données existent déjà dans la base de données
  try {
    // Vérifier si la table meals contient des données
    const existingMeals = await db
      .select({ count: sql`count(*)` })
      .from(meals)
      .get();
    const existingPlans = await db
      .select({ count: sql`count(*)` })
      .from(plan)
      .get();
    const existingIngredients = await db
      .select({ count: sql`count(*)` })
      .from(ingredientsStandard)
      .get();

    // Convertir les résultats en nombres pour comparaison
    const mealsCount = existingMeals ? Number(existingMeals.count) : 0;
    const plansCount = existingPlans ? Number(existingPlans.count) : 0;
    const ingredientsCount = existingIngredients
      ? Number(existingIngredients.count)
      : 0;

    logger.info(LogCategory.DATABASE, 'État actuel des tables', {
      mealsCount,
      plansCount,
      ingredientsCount,
    });

    // Si toutes les tables principales contiennent des données, on considère que la DB est initialisée
    if (mealsCount > 0 && plansCount > 0 && ingredientsCount > 0) {
      logger.info(LogCategory.DATABASE, 'Les données seed existent déjà');
      // Mettre à jour le flag pour la prochaine fois
      AsyncStorage.setItemSync('dbInitialized', 'true');
      return;
    }

    // Si on arrive ici, c'est que les tables sont vides ou incomplètes, alors on charge les données
    logger.info(
      LogCategory.DATABASE,
      'Les tables sont vides, chargement des données seed...',
    );

    // On s'assure que les tables sont vides avant de charger les données
    // Utilisons un try/catch pour chaque opération afin d'éviter un blocage complet
    try {
      await db.run(sql`DELETE FROM ${dailyPlanMeals}`);
      logger.debug(LogCategory.DATABASE, 'Table dailyPlanMeals vidée');
    } catch (e) {
      logger.error(
        LogCategory.DATABASE,
        'Erreur lors du vidage de dailyPlanMeals',
        e,
      );
    }

    try {
      await db.run(sql`DELETE FROM ${dailyPlan}`);
      logger.debug(LogCategory.DATABASE, 'Table dailyPlan vidée');
    } catch (e) {
      logger.error(
        LogCategory.DATABASE,
        'Erreur lors du vidage de dailyPlan',
        e,
      );
    }

    try {
      await db.run(sql`DELETE FROM ${plan}`);
      logger.debug(LogCategory.DATABASE, 'Table plan vidée');
    } catch (e) {
      logger.error(LogCategory.DATABASE, 'Erreur lors du vidage de plan', e);
    }

    try {
      await db.run(sql`DELETE FROM ${mealIngredients}`);
      logger.debug(LogCategory.DATABASE, 'Table mealIngredients vidée');
    } catch (e) {
      logger.error(
        LogCategory.DATABASE,
        'Erreur lors du vidage de mealIngredients',
        e,
      );
    }

    try {
      await db.run(sql`DELETE FROM ${meals}`);
      logger.debug(LogCategory.DATABASE, 'Table meals vidée');
    } catch (e) {
      logger.error(LogCategory.DATABASE, 'Erreur lors du vidage de meals', e);
    }

    try {
      await db.run(sql`DELETE FROM ${ingredientsStandard}`);
      logger.debug(LogCategory.DATABASE, 'Table ingredientsStandard vidée');
    } catch (e) {
      logger.error(
        LogCategory.DATABASE,
        'Erreur lors du vidage de ingredientsStandard',
        e,
      );
    }

    try {
      await db.run(sql`DELETE FROM ${users}`);
      logger.debug(LogCategory.DATABASE, 'Table users vidée');
    } catch (e) {
      logger.error(LogCategory.DATABASE, 'Erreur lors du vidage de users', e);
    }
  } catch (error) {
    logger.error(
      LogCategory.DATABASE,
      'Erreur lors de la vérification des données existantes',
      error,
    );
    // En cas d'erreur grave, on continue tout de même l'initialisation pour éviter un blocage
    // Mais on ajoute un flag pour indiquer qu'il y a eu un problème
    AsyncStorage.setItemSync(
      'dbInitializationError',
      JSON.stringify({
        timestamp: new Date().toISOString(),
        message: error instanceof Error ? error.message : String(error),
      }),
    );
  }

  logger.info(LogCategory.DATABASE, 'Insertion des nouvelles données seed...');

  let usersIds: { id: number | null }[] = [{ id: 1 }]; // Valeur par défaut en cas d'échec

  try {
    // Process users with images
    const usersWithImage = await prepareUserWithImages();
    logger.info(LogCategory.DATABASE, 'Préparation des utilisateurs terminée');

    // Insert Users
    usersIds = await db
      .insert(users)
      .values(usersWithImage)
      .returning({ id: users.id });
    logger.info(LogCategory.DATABASE, 'Insertion des utilisateurs réussie', {
      count: usersIds.length,
    });
  } catch (error) {
    logger.error(
      LogCategory.DATABASE,
      "Erreur lors de l'insertion des utilisateurs",
      error,
    );
    // On continue avec les valeurs par défaut
  }

  let ingredientStandardIds: { id: number | null }[] = [];
  try {
    // Process ingredient standard with images
    const ingredientStandardWithImages =
      await prepareIngredientStandardWithImages();

    logger.info(
      LogCategory.DATABASE,
      'Préparation des ingrédients standards terminée',
    );

    // Insert Ingredient Standards
    ingredientStandardIds = await chunkInsert(
      db,
      ingredientsStandard,
      ingredientStandardWithImages,
    );
    logger.info(
      LogCategory.DATABASE,
      'Insertion des ingrédients standards réussie',
      { count: ingredientStandardIds.length },
    );
  } catch (error) {
    logger.error(
      LogCategory.DATABASE,
      "Erreur lors de l'insertion des ingrédients standards",
      error,
    );
    // On continue avec ce qu'on a
  }

  let mealIds: { id: number | null }[] = [];
  try {
    // Process meals with images
    const mealsWithImages = await prepareMealsWithImages();

    // S'assurer que usersIds[0] existe, sinon utiliser une valeur de secours
    const creatorId = usersIds[0]?.id || 1;

    const mealsWithCreator = mealsWithImages.map((meal: any) => ({
      ...meal,
      creatorId, // Adding creatorId to each object
    }));

    logger.info(LogCategory.DATABASE, 'Préparation des repas terminée');

    // Insert Meals
    mealIds = await db
      .insert(meals)
      .values(mealsWithCreator)
      .returning({ id: meals.id });
    logger.info(LogCategory.DATABASE, 'Insertion des repas réussie', {
      count: mealIds.length,
    });
  } catch (error) {
    logger.error(
      LogCategory.DATABASE,
      "Erreur lors de l'insertion des repas",
      error,
    );
    // On continue avec ce qu'on a
  }

  try {
    // Création des associations entre ingrédients et repas
    const ingredientWithMealAndStandard: Omit<
      MealIngredientsOrmProps,
      'id' | 'createdAt' | 'updatedAt'
    >[] = [];

    // Vérifier si nous avons des données valides pour continuer
    if (ingredientStandardIds.length > 0 && mealIds.length > 0) {
      // Pour chaque ingrédient standard, créer une association avec un repas aléatoire
      for (const ingredient of ingredientsStandardSeed) {
        if (mealIds.length === 0) continue;

        // Récupérer des IDs valides (non null)
        const selectedMealId =
          mealIds[Math.floor(Math.random() * mealIds.length)]?.id;
        const selectedIngredientId = ingredientStandardIds.find(
          (ing) => ing.id !== null,
        )?.id;

        // Ne pas ajouter l'ingrédient si l'un des IDs est manquant
        if (!selectedMealId || !selectedIngredientId) continue;

        ingredientWithMealAndStandard.push({
          quantity: ingredient.quantity || 1,
          calories: ingredient.calories || 0,
          carbs: ingredient.carbs || 0,
          fat: ingredient.fat || 0,
          protein: ingredient.protein || 0,
          ingredientStandardId: selectedIngredientId,
          mealId: selectedMealId,
        });
      }
    }

    // Insérer les associations d'ingrédients seulement s'il y en a
    if (ingredientWithMealAndStandard.length > 0) {
      await db.insert(mealIngredients).values(ingredientWithMealAndStandard);
      logger.info(
        LogCategory.DATABASE,
        'Insertion des ingrédients de repas réussie',
        {
          count: ingredientWithMealAndStandard.length,
        },
      );
    } else {
      logger.warn(LogCategory.DATABASE, 'Aucun ingrédient de repas à insérer');
    }
  } catch (error) {
    logger.error(
      LogCategory.DATABASE,
      "Erreur lors de l'insertion des ingrédients de repas",
      error,
    );
  }

  let planIds: { id: number | null }[] = [{ id: 1 }]; // Valeur par défaut
  try {
    // Création des plans avec référence utilisateur
    const plansWithUser = planSeed.map((planItem: any) => ({
      ...planItem,
      userId: usersIds[0]?.id || 1, // Référence à l'utilisateur créé précédemment
    }));

    // Insert Plan
    planIds = await db
      .insert(plan)
      .values(plansWithUser)
      .returning({ id: plan.id });
    logger.info(LogCategory.DATABASE, 'Insertion des plans réussie', {
      count: planIds.length,
    });
  } catch (error) {
    logger.error(
      LogCategory.DATABASE,
      "Erreur lors de l'insertion des plans",
      error,
    );
  }

  // Création et stockage de dailyPlanIds en dehors du bloc try/catch
  let dailyPlanIds: { id: number | null }[] = [];
  try {
    // Insert Daily Plan
    const dailyPlansWithPlanId = dailyPlanSeed.map((dailyPlan: any) => ({
      ...dailyPlan,
      planId: planIds[0]?.id || 1, // Add planId to each dailyPlan
    }));

    dailyPlanIds = await db
      .insert(dailyPlan)
      .values(dailyPlansWithPlanId)
      .returning({ id: dailyPlan.id });
    logger.info(
      LogCategory.DATABASE,
      'Insertion des plans quotidiens réussie',
      { count: dailyPlanIds.length },
    );
  } catch (error) {
    logger.error(
      LogCategory.DATABASE,
      "Erreur lors de l'insertion des plans quotidiens",
      error,
    );
  }

  try {
    // S'assurer que nous avons des ID valides
    if (dailyPlanIds && dailyPlanIds.length > 0 && mealIds.length > 0) {
      // Créer les associations entre plans quotidiens et repas
      const dailyPlanMealsWithIds: Omit<
        DailyPlanMealsOrmProps,
        'id' | 'createdAt' | 'updatedAt'
      >[] = [];

      // Pour chaque plan quotidien, associer des repas
      for (const dailyPlanId of dailyPlanIds) {
        // S'assurer que l'ID est valide
        if (!dailyPlanId.id) continue;

        // Associer chaque repas disponible avec le plan quotidien
        for (const meal of mealIds) {
          if (!meal.id) continue;

          // Créer l'association avec des valeurs nutritionnelles par défaut
          dailyPlanMealsWithIds.push({
            dailyPlanId: dailyPlanId.id,
            mealId: meal.id,
            mealType: null, // Adding this back to fix the type error
            quantity: 1,
            calories: 0,
            carbs: 0,
            fat: 0,
            protein: 0,
          });
        }
      }

      // Insérer les associations seulement s'il y en a
      if (dailyPlanMealsWithIds.length > 0) {
        await db.insert(dailyPlanMeals).values(dailyPlanMealsWithIds);
        logger.info(
          LogCategory.DATABASE,
          'Insertion des repas de plans quotidiens réussie',
          {
            count: dailyPlanMealsWithIds.length,
          },
        );
      } else {
        logger.warn(
          LogCategory.DATABASE,
          'Aucun repas de plan quotidien à insérer',
        );
      }
    } else {
      logger.warn(
        LogCategory.DATABASE,
        'Skipping dailyPlanMeals insertion - missing required IDs',
      );
    }
  } catch (error) {
    logger.error(
      LogCategory.DATABASE,
      "Erreur lors de l'insertion des repas de plan quotidien",
      error,
    );
  }

  // Mark database as initialized, même si certaines étapes ont échoué
  AsyncStorage.setItemSync('dbInitialized', 'true');

  const duration = performance.now() - globalStartTime;
  logger.info(
    LogCategory.DATABASE,
    `Initialisation de la base de données terminée en ${duration.toFixed(2)}ms`,
  );

  // Retourner un rapport sur les données insérées
  return {
    users: usersIds.length,
    ingredientsStandard: ingredientStandardIds.length,
    meals: mealIds.length,
    plans: planIds.length,
    dailyPlans: dailyPlanIds.length,
  };
};
