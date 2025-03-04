import {
  users,
  meals,
  ingredientsStandard,
  ingredients,
  ingredientsIngredientsStandard,
} from '@/db/schema';
import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { AsyncStorage } from 'expo-sqlite/kv-store';
import { sql } from 'drizzle-orm';
import { ingredientsStandardSeed, mealsSeed, usersSeed } from '@/db/seeds';

export const addDummyData = async (db: ExpoSQLiteDatabase) => {
  console.log('Adding seed data...');
  const value = AsyncStorage.getItemSync('dbInitialized');

  if (value) {
    console.log(' CLEAR existing tables ...');
    db.run(sql`DELETE
               FROM ${users}`);
    db.run(sql`DELETE
               FROM ${meals}`);
    db.run(sql`DELETE
               FROM ${ingredientsStandard}`);
    db.run(sql`DELETE
               FROM ${ingredients}`);
    db.run(sql`DELETE
               FROM ${ingredientsIngredientsStandard}`);
  }
  console.log('Inserting new list...');

  // Insert Users
  await db.insert(users).values(usersSeed);
  // Insert Ingredient Standards
  const ingredientStandardIds = await db
    .insert(ingredientsStandard)
    .values(ingredientsStandardSeed)
    .returning({ id: ingredientsStandard.id }); // Return inserted IDs;;

  // Insert Meals
  const mealIds = await db
    .insert(meals)
    .values(mealsSeed)
    .returning({ id: meals.id }); // Return inserted IDs;

  // Insert Ingredients (Linking to Meals)
  const ingredientIds = await db
    .insert(ingredients)
    .values([
      {
        mealId: mealIds[0].id, // Oatmeal with Fruits
        quantity: 100,
      },
      {
        mealId: mealIds[0].id, // Oatmeal with Fruits
        quantity: 100,
      },
      {
        mealId: mealIds[1].id, // Grilled Chicken Salad
        quantity: 150,
      },
      {
        mealId: mealIds[2].id, // Salmon with Rice
        quantity: 200,
      },
      {
        mealId: mealIds[2].id, // Salmon with Rice
        quantity: 150,
      },
    ])
    .returning({ id: ingredients.id }); // Return inserted IDs;

  // Link Ingredients to Ingredient Standards
  await db.insert(ingredientsIngredientsStandard).values([
    {
      ingredientId: ingredientIds[0].id, // First ingredient (Oatmeal with Fruits)
      ingredientStandardId: ingredientStandardIds[0].id, // Oats
    },
    {
      ingredientId: ingredientIds[1].id, // Second ingredient (Oatmeal with Fruits)
      ingredientStandardId: ingredientStandardIds[1].id, // Banana
    },
    {
      ingredientId: ingredientIds[2].id, // Third ingredient (Grilled Chicken Salad)
      ingredientStandardId: ingredientStandardIds[2].id, // Grilled Chicken
    },
    {
      ingredientId: ingredientIds[3].id, // Fourth ingredient (Salmon with Rice)
      ingredientStandardId: ingredientStandardIds[3].id, // Rice
    },
    {
      ingredientId: ingredientIds[4].id, // Fifth ingredient (Salmon with Rice)
      ingredientStandardId: ingredientStandardIds[4].id, // Salmon
    },
  ]);

  AsyncStorage.setItemSync('dbInitialized', 'true');
  console.log('Seed data inserted successfully!');
};
