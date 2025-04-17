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
import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

// Static image paths using require()
const images = {
  BREAKFAST: require('../assets/images/seed/caesar_salad.jpg'),
  LUNCH: require('../assets/images/seed/kouskousi.jpg'),
  DINNER: require('../assets/images/seed/suchi_bowl.jpg'),
};

// Function to load a static asset and return Base64
async function getImageBuffer(assetModule: number): Promise<any | null> {
  try {
    const startTime = performance.now();
    logger.debug(LogCategory.DATABASE, `Chargement de l'asset`, { assetModule });
    
    const asset = Asset.fromModule(assetModule);
    await asset.downloadAsync(); // Ensure it's downloaded

    if (!asset.localUri) {
      logger.error(LogCategory.DATABASE, `Échec de chargement de l'asset`, { assetModule });
      // Retourner une chaîne vide au lieu de null pour éviter les erreurs
      return "";
    }

    // Read file as binary data
    const fileUri = asset.localUri;
    try {
      const base64Data = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      const duration = performance.now() - startTime;
      logger.debug(LogCategory.PERFORMANCE, `Asset chargé en ${duration.toFixed(2)}ms`, { assetModule });
      return base64Data;
    } catch (readError) {
      logger.error(LogCategory.DATABASE, `Erreur de lecture du fichier`, { fileUri, error: readError });
      // Retourner une chaîne vide au lieu de null pour éviter les erreurs
      return "";
    }
  } catch (error) {
    logger.error(LogCategory.DATABASE, `Erreur générale de chargement d'asset`, { assetModule, error });
    // Retourner une chaîne vide au lieu de null pour éviter les erreurs
    return "";
  }
}

// Function to prepare meals with images
async function prepareUserWithImages() {
  return await Promise.all(
    usersSeed.map(async (user) => {
      // @ts-ignore
      if (!user.profileImage) {
        // @ts-ignore
        const imageBuffer = await getImageBuffer(
          require('../assets/images/logo_no_bg.png'),
        );
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

async function prepareIngredientStandardWithImages() {
  return await Promise.all(
    ingredientsStandardSeed.map(async (ingStandard) => {
      // @ts-ignore
      if (!ingStandard.image) {
        // @ts-ignore
        const imageBuffer = await getImageBuffer(
          require('../assets/images/seed/salmon.jpg'),
        );
        return {
          ...ingStandard,
          image:
            `data:image/jpeg;base64,${imageBuffer}` as unknown as Buffer,
        };
      }
      return ingStandard;
    }),
  );
}

// Function to prepare meals with images
async function prepareMealsWithImages() {
  return await Promise.all(
    mealsSeed.map(async (meal) => {
      // @ts-ignore
      if (!meal.image && images[meal.type]) {
        // @ts-ignore
        const imageBuffer = await getImageBuffer(images[meal.type]);
        return {
          ...meal,
          image:
            `data:image/jpeg;base64,${imageBuffer}` as unknown as Buffer,
        };
      }
      return meal;
    }),
  );
}

// Function to add dummy data
export const addDummyData = async (db: ExpoSQLiteDatabase) => {
  const globalStartTime = performance.now();
  logger.info(LogCategory.DATABASE, 'Début du chargement des données seed');
  
  // Vérifier si les données existent déjà dans la base de données
  try {
    // Vérifier si la table meals contient des données
    const existingMeals = await db.select({ count: sql`count(*)` }).from(meals).get();
    const existingPlans = await db.select({ count: sql`count(*)` }).from(plan).get();
    const existingIngredients = await db.select({ count: sql`count(*)` }).from(ingredientsStandard).get();
    
    // Convertir les résultats en nombres pour comparaison
    const mealsCount = existingMeals ? Number(existingMeals.count) : 0;
    const plansCount = existingPlans ? Number(existingPlans.count) : 0; 
    const ingredientsCount = existingIngredients ? Number(existingIngredients.count) : 0;
    
    logger.info(LogCategory.DATABASE, 'État actuel des tables', {
      mealsCount,
      plansCount,
      ingredientsCount
    });
    
    // Si toutes les tables principales contiennent des données, on considère que la DB est initialisée
    if (mealsCount > 0 && plansCount > 0 && ingredientsCount > 0) {
      logger.info(LogCategory.DATABASE, 'Les données seed existent déjà');
      // Mettre à jour le flag pour la prochaine fois
      AsyncStorage.setItemSync('dbInitialized', 'true');
      return;
    }
    
    // Si on arrive ici, c'est que les tables sont vides ou incomplètes, alors on charge les données
    logger.info(LogCategory.DATABASE, 'Les tables sont vides, chargement des données seed...');
    
    // On s'assure que les tables sont vides avant de charger les données
    // Utilisons un try/catch pour chaque opération afin d'éviter un blocage complet
    try {
      await db.run(sql`DELETE FROM ${dailyPlanMeals}`);
      logger.debug(LogCategory.DATABASE, 'Table dailyPlanMeals vidée');
    } catch (e) {
      logger.error(LogCategory.DATABASE, 'Erreur lors du vidage de dailyPlanMeals', e);
    }
    
    try {
      await db.run(sql`DELETE FROM ${dailyPlan}`);
      logger.debug(LogCategory.DATABASE, 'Table dailyPlan vidée');
    } catch (e) {
      logger.error(LogCategory.DATABASE, 'Erreur lors du vidage de dailyPlan', e);
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
      logger.error(LogCategory.DATABASE, 'Erreur lors du vidage de mealIngredients', e);
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
      logger.error(LogCategory.DATABASE, 'Erreur lors du vidage de ingredientsStandard', e);
    }
    
    try {
      await db.run(sql`DELETE FROM ${users}`);
      logger.debug(LogCategory.DATABASE, 'Table users vidée');
    } catch (e) {
      logger.error(LogCategory.DATABASE, 'Erreur lors du vidage de users', e);
    }
    
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Erreur lors de la vérification des données existantes', error);
    // En cas d'erreur grave, on continue tout de même l'initialisation pour éviter un blocage
    // Mais on ajoute un flag pour indiquer qu'il y a eu un problème
    AsyncStorage.setItemSync('dbInitializationError', JSON.stringify({
      timestamp: new Date().toISOString(),
      message: error instanceof Error ? error.message : String(error)
    }));
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
    logger.info(LogCategory.DATABASE, 'Insertion des utilisateurs réussie', { count: usersIds.length });
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Erreur lors de l\'insertion des utilisateurs', error);
    // On continue avec les valeurs par défaut
  }

  let ingredientStandardIds: { id: number | null }[] = [];
  try {
    // Process ingredient standard with images
    const ingredientStandardWithImages =
      await prepareIngredientStandardWithImages();

    logger.info(LogCategory.DATABASE, 'Préparation des ingrédients standards terminée');

    // Insert Ingredient Standards
    ingredientStandardIds = await db
      .insert(ingredientsStandard)
      .values(ingredientStandardWithImages)
      .returning({ id: ingredientsStandard.id });
    logger.info(LogCategory.DATABASE, 'Insertion des ingrédients standards réussie', { count: ingredientStandardIds.length });
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Erreur lors de l\'insertion des ingrédients standards', error);
    // On continue avec ce qu'on a
  }

  let mealIds: { id: number | null }[] = [];
  try {
    // Process meals with images
    const mealsWithImages = await prepareMealsWithImages();
    
    // S'assurer que usersIds[0] existe, sinon utiliser une valeur de secours
    const creatorId = usersIds[0]?.id || 1;
    
    const mealsWithCreator = mealsWithImages.map((meal) => ({
      ...meal,
      creatorId, // Adding creatorId to each object
    }));
    
    logger.info(LogCategory.DATABASE, 'Préparation des repas terminée');

    // Insert Meals
    mealIds = await db
      .insert(meals)
      .values(mealsWithCreator)
      .returning({ id: meals.id });
    logger.info(LogCategory.DATABASE, 'Insertion des repas réussie', { count: mealIds.length });
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Erreur lors de l\'insertion des repas', error);
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
        const selectedMealId = mealIds[Math.floor(Math.random() * mealIds.length)]?.id;
        const selectedIngredientId = ingredientStandardIds.find(ing => ing.id !== null)?.id;
        
        // Ne pas ajouter l'ingrédient si l'un des IDs est manquant
        if (!selectedMealId || !selectedIngredientId) continue;
        
        ingredientWithMealAndStandard.push({
          quantity: ingredient.quantity || 1,
          calories: ingredient.calories || 0,
          carbs: ingredient.carbs || 0,
          fat: ingredient.fat || 0,
          protein: ingredient.protein || 0,
          ingredientStandardId: selectedIngredientId,
          mealId: selectedMealId
        });
      }
    }

    // Insérer les associations d'ingrédients seulement s'il y en a
    if (ingredientWithMealAndStandard.length > 0) {
      await db.insert(mealIngredients).values(ingredientWithMealAndStandard);
      logger.info(LogCategory.DATABASE, 'Insertion des ingrédients de repas réussie', {
        count: ingredientWithMealAndStandard.length
      });
    } else {
      logger.warn(LogCategory.DATABASE, 'Aucun ingrédient de repas à insérer');
    }
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Erreur lors de l\'insertion des ingrédients de repas', error);
  }

  let planIds: { id: number | null }[] = [{ id: 1 }]; // Valeur par défaut
  try {
    // Création des plans avec référence utilisateur
    const plansWithUser = planSeed.map(planItem => ({
      ...planItem,
      userId: usersIds[0]?.id || 1 // Référence à l'utilisateur créé précédemment
    }));
    
    // Insert Plan
    planIds = await db
      .insert(plan)
      .values(plansWithUser)
      .returning({ id: plan.id });
    logger.info(LogCategory.DATABASE, 'Insertion des plans réussie', { count: planIds.length });
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Erreur lors de l\'insertion des plans', error);
  }

  // Création et stockage de dailyPlanIds en dehors du bloc try/catch
  let dailyPlanIds: { id: number | null }[] = [];
  try {
    // Insert Daily Plan
    const dailyPlansWithPlanId = dailyPlanSeed.map((dailyPlan) => ({
      ...dailyPlan,
      planId: planIds[0]?.id || 1, // Add planId to each dailyPlan
    }));

    dailyPlanIds = await db
      .insert(dailyPlan)
      .values(dailyPlansWithPlanId)
      .returning({ id: dailyPlan.id });
    logger.info(LogCategory.DATABASE, 'Insertion des plans quotidiens réussie', { count: dailyPlanIds.length });
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Erreur lors de l\'insertion des plans quotidiens', error);
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
            quantity: 1,
            calories: 0,
            carbs: 0,
            fat: 0,
            protein: 0
          });
        }
      }

      // Insérer les associations seulement s'il y en a
      if (dailyPlanMealsWithIds.length > 0) {
        await db.insert(dailyPlanMeals).values(dailyPlanMealsWithIds);
        logger.info(LogCategory.DATABASE, 'Insertion des repas de plans quotidiens réussie', { 
          count: dailyPlanMealsWithIds.length 
        });
      } else {
        logger.warn(LogCategory.DATABASE, 'Aucun repas de plan quotidien à insérer');
      }
    } else {
      logger.warn(LogCategory.DATABASE, 'Skipping dailyPlanMeals insertion - missing required IDs');
    }
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Erreur lors de l\'insertion des repas de plan quotidien', error);
  }

  // Mark database as initialized, même si certaines étapes ont échoué
  AsyncStorage.setItemSync('dbInitialized', 'true');
  
  const duration = performance.now() - globalStartTime;
  logger.info(LogCategory.DATABASE, `Initialisation de la base de données terminée en ${duration.toFixed(2)}ms`);

  // Retourner un rapport sur les données insérées
  return {
    users: usersIds.length,
    ingredientsStandard: ingredientStandardIds.length,
    meals: mealIds.length,
    plans: planIds.length,
    dailyPlans: dailyPlanIds.length,
  };
};
