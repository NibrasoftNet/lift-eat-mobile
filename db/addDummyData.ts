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
            `data:image/jpeg;base64,${imageBuffer}` as unknown as Buffer<ArrayBufferLike>,
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
            `data:image/jpeg;base64,${imageBuffer}` as unknown as Buffer<ArrayBufferLike>,
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
            `data:image/jpeg;base64,${imageBuffer}` as unknown as Buffer<ArrayBufferLike>,
        };
      }
      return meal;
    }),
  );
}

// Function to add dummy data
export const addDummyData = async (db: ExpoSQLiteDatabase) => {
  console.log('Adding seed data...');
  const value = AsyncStorage.getItemSync('dbInitialized');

  if (value) {
    console.log('Seed data already exists ...');
    return;
    /*db.run(sql`DELETE FROM ${users}`);
    db.run(sql`DELETE FROM ${ingredientsStandard}`);
    db.run(sql`DELETE FROM ${mealIngredients}`);
    db.run(sql`DELETE FROM ${meals}`);
    db.run(sql`DELETE FROM ${dailyPlan}`);
    db.run(sql`DELETE FROM ${dailyPlanMeals}`);
    db.run(sql`DELETE FROM ${plan}`);*/
  }

  console.log('Inserting new list...');

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

  const ingredientWithMealAndStandard: Omit<MealIngredientsOrmProps, 'id'>[] =
    ingredientsStandardSeed.map((ingredient) => {
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
  const dailyPlanMealsData: Omit<DailyPlanMealsOrmProps, 'id'>[] =
    dailyPlanIds.map((dailyPlan) => {
      const selectedMealId =
        mealIds[Math.floor(Math.random() * mealIds.length)].id;

      return {
        dailyPlanId: dailyPlan.id,
        mealId: selectedMealId,
      };
    });

  await db.insert(dailyPlanMeals).values(dailyPlanMealsData);
  console.log('Inserting Daily Plan Meals completed: success...');

  AsyncStorage.setItemSync('dbInitialized', 'true');
  console.log('Seed data inserted successfully!');
};
