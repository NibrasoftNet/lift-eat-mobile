import {
  ingredients,
  ingredientsIngredientsStandard,
  ingredientsStandard,
  meals,
  users,
} from '@/db/schema';
import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { AsyncStorage } from 'expo-sqlite/kv-store';
import { ingredientsStandardSeed, mealsSeed, usersSeed } from '@/db/seeds';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { sql } from 'drizzle-orm';

// Static image paths using require()
const images = {
  BREAKFAST: require('../assets/images/Meals/SaladeCésar.jpg'),
  LUNCH: require('../assets/images/Meals/téléchargement.jpg'),
  DINNER: require('../assets/images/Meals/SushiBowlauSaumon.jpj.jpg'),
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
          require('../assets/images/backgrounds/chinese-bg.jpg'),
        );
        return { ...user, profileImage: imageBuffer };
      }
      return user;
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
        return { ...meal, image: imageBuffer };
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
    console.log(' CLEAR existing tables ...');
    //return;
    db.run(sql`DELETE FROM ${users}`);
    db.run(sql`DELETE FROM ${meals}`);
    db.run(sql`DELETE FROM ${ingredientsStandard}`);
    db.run(sql`DELETE FROM ${ingredients}`);
    db.run(sql`DELETE FROM ${ingredientsIngredientsStandard}`);
  }

  console.log('Inserting new list...');

  // Process users with images
  const mealsWithUsers = await prepareUserWithImages();

  // Insert Users
  await db.insert(users).values(mealsWithUsers);

  // Insert Ingredient Standards
  const ingredientStandardIds = await db
    .insert(ingredientsStandard)
    .values(ingredientsStandardSeed)
    .returning({ id: ingredientsStandard.id });

  // Process meals with images
  const mealsWithImages = await prepareMealsWithImages();

  // Insert Meals
  const mealIds = await db
    .insert(meals)
    .values(mealsWithImages)
    .returning({ id: meals.id });

  // Insert Ingredients (Linking to Meals)
  const ingredientIds = await db
    .insert(ingredients)
    .values([
      { mealId: mealIds[0].id, quantity: 100 },
      { mealId: mealIds[0].id, quantity: 100 },
      { mealId: mealIds[1].id, quantity: 150 },
      { mealId: mealIds[2].id, quantity: 200 },
      { mealId: mealIds[2].id, quantity: 150 },
    ])
    .returning({ id: ingredients.id });

  // Link Ingredients to Ingredient Standards
  await db.insert(ingredientsIngredientsStandard).values([
    {
      ingredientId: ingredientIds[0].id,
      ingredientStandardId: ingredientStandardIds[0].id,
    },
    {
      ingredientId: ingredientIds[1].id,
      ingredientStandardId: ingredientStandardIds[1].id,
    },
    {
      ingredientId: ingredientIds[2].id,
      ingredientStandardId: ingredientStandardIds[2].id,
    },
    {
      ingredientId: ingredientIds[3].id,
      ingredientStandardId: ingredientStandardIds[3].id,
    },
    {
      ingredientId: ingredientIds[4].id,
      ingredientStandardId: ingredientStandardIds[4].id,
    },
  ]);

  AsyncStorage.setItemSync('dbInitialized', 'true');
  console.log('Seed data inserted successfully!');
};
