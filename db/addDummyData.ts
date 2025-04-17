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

// Static image paths using require()
const images = {
  BREAKFAST: require('../assets/images/seed/caesar_salad.jpg'),
  LUNCH: require('../assets/images/seed/kouskousi.jpg'),
  DINNER: require('../assets/images/seed/suchi_bowl.jpg'),
};

// Function to load a static asset and return Base64
async function getImageBuffer(assetModule: number): Promise<any | null> {
  try {
    const asset = Asset.fromModule(assetModule);
    await asset.downloadAsync(); // Ensure it's downloaded

    if (!asset.localUri) {
      console.error(`Failed to load asset: ${assetModule}`);
      return null;
    }

    // Read file as binary data
    const fileUri = asset.localUri;
    // Convert Base64 string to Uint8Array (Binary Blob)
    //return Uint8Array.from(atob(binaryString), (c) => c.charCodeAt(0));
    return await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64, // Read as Base64 (temporary)
    });
  } catch (error) {
    console.error(`Error reading asset:`, error);
    return null;
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
  console.log('Adding seed data...');
  
  // Vérifier si les données existent déjà dans la base de données
  // au lieu de se fier uniquement au flag dans AsyncStorage
  try {
    // Vérifier si la table meals contient des données
    const existingMeals = await db.select({ count: sql`count(*)` }).from(meals).get();
    const existingPlans = await db.select({ count: sql`count(*)` }).from(plan).get();
    const existingIngredients = await db.select({ count: sql`count(*)` }).from(ingredientsStandard).get();
    
    // Convertir les résultats en nombres pour comparaison
    const mealsCount = existingMeals ? Number(existingMeals.count) : 0;
    const plansCount = existingPlans ? Number(existingPlans.count) : 0; 
    const ingredientsCount = existingIngredients ? Number(existingIngredients.count) : 0;
    
    // Si toutes les tables principales contiennent des données, on considère que la DB est initialisée
    if (mealsCount > 0 && plansCount > 0 && ingredientsCount > 0) {
      console.log('Les données seed existent déjà dans la base de données...');
      // Mettre à jour le flag pour la prochaine fois
      AsyncStorage.setItemSync('dbInitialized', 'true');
      return;
    }
    
    // Si on arrive ici, c'est que les tables sont vides ou incomplètes, alors on charge les données
    console.log('Les tables sont vides, chargement des données seed...');
    
    // On s'assure que les tables sont vides avant de charger les données
    db.run(sql`DELETE FROM ${dailyPlanMeals}`);
    db.run(sql`DELETE FROM ${dailyPlan}`);
    db.run(sql`DELETE FROM ${plan}`);
    db.run(sql`DELETE FROM ${mealIngredients}`);
    db.run(sql`DELETE FROM ${meals}`);
    db.run(sql`DELETE FROM ${ingredientsStandard}`);
    db.run(sql`DELETE FROM ${users}`);
    
  } catch (error) {
    console.error('Erreur lors de la vérification des données existantes:', error);
    // En cas d'erreur, on suppose que les tables n'existent pas et on continue l'initialisation
  }

  console.log('Insertion des nouvelles données seed...');
  
  // Process users with images
  const usersWithImage = await prepareUserWithImages();
  console.log('Preparation Users completed: success...');

  // Insert Users
  const usersIds = await db
    .insert(users)
    .values(usersWithImage)
    .returning({ id: users.id });
  console.log('Inserting Users completed: success...');

  // Process ingredient standard with images
  const ingredientStandardWithImages =
    await prepareIngredientStandardWithImages();

  console.log('Preparation ingredient Standard completed: success...');

  // Insert Ingredient Standards
  const ingredientStandardIds = await db
    .insert(ingredientsStandard)
    .values(ingredientStandardWithImages)
    .returning({ id: ingredientsStandard.id });
  console.log('Inserting Ingredient standards completed: success...');

  // Process meals with images
  const mealsWithImages = await prepareMealsWithImages();
  const mealsWithCreator = mealsWithImages.map((meal) => ({
    ...meal,
    creatorId: usersIds[0].id, // Adding creatorId to each object
  }));

  // Insert Meals
  const mealIds = await db
    .insert(meals)
    .values(mealsWithCreator)
    .returning({ id: meals.id });
  console.log('Inserting meals completed: success...');

  const ingredientWithMealAndStandard: Omit<
    MealIngredientsOrmProps,
    'id' | 'createdAt' | 'updatedAt'
  >[] = ingredientsStandardSeed.map((ingredient) => {
    const selectedIngredientStandardId =
      ingredientStandardIds[
        Math.floor(Math.random() * ingredientStandardIds.length)
      ].id;

    const selectedMealId =
      mealIds[Math.floor(Math.random() * mealIds.length)].id;

    return {
      ...ingredient,
      ingredientStandardId: selectedIngredientStandardId,
      mealId: selectedMealId,
    };
  });

  // Insert Ingredients (Linking to Meals)
  await db.insert(mealIngredients).values(ingredientWithMealAndStandard);
  console.log('Inserting mealIngredients completed: success...');

  // Insert Plans
  const plansWithUser = planSeed.map((plan) => ({
    ...plan,
    userId: usersIds[0].id, // Adding userId to each plan
  }));

  const planIds = await db
    .insert(plan)
    .values(plansWithUser)
    .returning({ id: plan.id });
  console.log('Inserting Plans completed: success...');

  // Insert Daily Plans
  const dailyPlansWithPlan = dailyPlanSeed.map((dailyPlan) => ({
    ...dailyPlan,
    planId: planIds[Math.floor(Math.random() * planIds.length)].id, // Adding planId to each dailyPlan
  }));

  const dailyPlanIds = await db
    .insert(dailyPlan)
    .values(dailyPlansWithPlan)
    .returning({ id: dailyPlan.id });
  console.log('Inserting Daily Plans completed: success...');

  // Insert Daily Plan Meals
  const dailyPlanMealsData: Omit<
    DailyPlanMealsOrmProps,
    'id' | 'createdAt' | 'updatedAt'
  >[] = await Promise.all(dailyPlanIds.map(async (dailyPlan) => {
    const selectedMealId = mealIds[Math.floor(Math.random() * mealIds.length)].id;
    
    // Récupérer les informations nutritionnelles du repas sélectionné
    try {
      const selectedMeal = await db.select().from(meals).where(eq(meals.id, selectedMealId)).get();
      
      // Utiliser les valeurs du repas sélectionné
      return {
        dailyPlanId: dailyPlan.id,
        mealId: selectedMealId,
        quantity: 1, // Quantité par défaut (100% de la portion originale)
        calories: selectedMeal?.calories || 0,
        carbs: selectedMeal?.carbs || 0,
        fat: selectedMeal?.fat || 0,
        protein: selectedMeal?.protein || 0
      };
    } catch (error) {
      console.error('Error retrieving meal data for seeding:', error);
      
      // En cas d'erreur, utiliser des valeurs par défaut
      return {
        dailyPlanId: dailyPlan.id,
        mealId: selectedMealId,
        quantity: 1,
        calories: 0,
        carbs: 0,
        fat: 0,
        protein: 0
      };
    }
  }));

  await db.insert(dailyPlanMeals).values(dailyPlanMealsData);
  console.log('Inserting Daily Plan Meals completed: success...');

  AsyncStorage.setItemSync('dbInitialized', 'true');
  console.log('Seed data inserted successfully!');
};
