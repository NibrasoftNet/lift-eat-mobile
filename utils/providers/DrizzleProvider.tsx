import React, { createContext, ReactNode, useContext, useEffect, useMemo } from 'react';
import { drizzle, ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';
import * as schema from '@/db/schema';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import { sql } from 'drizzle-orm';
import { usersSeed, ingredientsStandardSeed, mealsSeed, dailyPlanSeed, planSeed } from '@/db/seeds';

// ✅ Use the correct type for Drizzle database
type DrizzleDbType = ExpoSQLiteDatabase<typeof schema> | null;

const DrizzleContext = createContext<DrizzleDbType>(null);

export const DrizzleProvider = ({ children }: { children: ReactNode }) => {
  const db = useSQLiteContext();

  // ✅ Ensure drizzleDb has the correct inferred type
  const drizzleDb = useMemo(() => drizzle<typeof schema>(db, { schema }), [db]);

  // Créer ou recréer toutes les tables à partir du schéma
  useEffect(() => {
    const createTablesAndSeedData = async () => {
      try {
        console.log('Création des tables à partir du schéma...');
        
        // Supprimer les tables existantes pour éviter les problèmes de structure
        await db.execAsync(`
          DROP TABLE IF EXISTS daily_plan_meals;
          DROP TABLE IF EXISTS meal_ingredients;
          DROP TABLE IF EXISTS meals;
          DROP TABLE IF EXISTS daily_plans;
          DROP TABLE IF EXISTS plans;
          DROP TABLE IF EXISTS ingredients_standard;
        `);
        console.log('Tables existantes supprimées');
        
        // Créer les tables dans le bon ordre (respecter les dépendances de clés étrangères)
        
        // 1. Table users (déjà existante, donc nous ne la recréons pas)
        
        // 2. Table ingredients_standard (indépendante)
        await db.execAsync(`
          CREATE TABLE ingredients_standard (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            calories REAL NOT NULL DEFAULT 0,
            carbs REAL NOT NULL DEFAULT 0,
            fat REAL NOT NULL DEFAULT 0,
            protein REAL NOT NULL DEFAULT 0,
            unit TEXT NOT NULL,
            quantity REAL NOT NULL DEFAULT 1,
            image BLOB
          );
        `);
        
        // 3. Table meals (dépend de users)
        await db.execAsync(`
          CREATE TABLE meals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
            name TEXT NOT NULL,
            description TEXT NOT NULL DEFAULT 'no description',
            cuisine TEXT NOT NULL,
            unit TEXT NOT NULL,
            quantity REAL NOT NULL DEFAULT 1,
            calories REAL NOT NULL DEFAULT 0,
            carbs REAL NOT NULL DEFAULT 0,
            fat REAL NOT NULL DEFAULT 0,
            protein REAL NOT NULL DEFAULT 0,
            image BLOB,
            creator_id INTEGER NOT NULL
          );
        `);
        
        // 4. Table meal_ingredients (dépend de meals et ingredients_standard)
        await db.execAsync(`
          CREATE TABLE meal_ingredients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            quantity REAL NOT NULL DEFAULT 1,
            calories REAL NOT NULL DEFAULT 0,
            carbs REAL NOT NULL DEFAULT 0,
            fat REAL NOT NULL DEFAULT 0,
            protein REAL NOT NULL DEFAULT 0,
            ingredient_standard_id INTEGER NOT NULL,
            meal_id INTEGER NOT NULL,
            FOREIGN KEY (ingredient_standard_id) REFERENCES ingredients_standard(id),
            FOREIGN KEY (meal_id) REFERENCES meals(id)
          );
        `);
        
        // 5. Table plans (dépend de users)
        await db.execAsync(`
          CREATE TABLE plans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT NOT NULL DEFAULT 'no description',
            generated_with TEXT NOT NULL,
            start_date TEXT NOT NULL,
            end_date TEXT NOT NULL,
            creator_id INTEGER NOT NULL,
            FOREIGN KEY (creator_id) REFERENCES users(id)
          );
        `);
        
        // 6. Table daily_plans (dépend de plans)
        await db.execAsync(`
          CREATE TABLE daily_plans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            day TEXT NOT NULL,
            generated_with TEXT NOT NULL,
            plan_id INTEGER NOT NULL,
            FOREIGN KEY (plan_id) REFERENCES plans(id)
          );
        `);
        
        // 7. Table daily_plan_meals (dépend de daily_plans et meals)
        await db.execAsync(`
          CREATE TABLE daily_plan_meals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            daily_plan_id INTEGER NOT NULL,
            meal_id INTEGER NOT NULL,
            FOREIGN KEY (daily_plan_id) REFERENCES daily_plans(id),
            FOREIGN KEY (meal_id) REFERENCES meals(id)
          );
        `);
        
        console.log('✅ Toutes les tables ont été créées avec succès!');

        // Seed de la base de données avec des données de départ
        console.log('Chargement des données initiales (seeds)...');

        // 1. Insérer les ingrédients standards
        for (const ingredient of ingredientsStandardSeed) {
          await drizzleDb.insert(schema.ingredientsStandard).values({
            name: ingredient.name,
            calories: ingredient.calories,
            carbs: ingredient.carbs,
            fat: ingredient.fat,
            protein: ingredient.protein,
            unit: ingredient.unit,
            quantity: ingredient.quantity,
            image: ingredient.image,
          });
        }
        console.log(`✅ ${ingredientsStandardSeed.length} ingrédients ajoutés`);

        // 2. Insérer les repas (pour l'utilisateur avec ID 1)
        for (const meal of mealsSeed) {
          await drizzleDb.insert(schema.meals).values({
            type: meal.type,
            name: meal.name,
            description: meal.description,
            cuisine: meal.cuisine,
            unit: meal.unit,
            quantity: meal.quantity,
            calories: meal.calories,
            carbs: meal.carbs,
            fat: meal.fat,
            protein: meal.protein,
            image: meal.image,
            creatorId: 1, // Assumé que l'utilisateur avec ID 1 existe
          });
        }
        console.log(`✅ ${mealsSeed.length} repas ajoutés`);

        console.log('✅ Base de données initialisée avec les données de départ!');
      } catch (error) {
        console.error('❌ Erreur lors de la création des tables ou du chargement des données:', error);
      }
    };

    createTablesAndSeedData();
  }, [db, drizzleDb]);

  useDrizzleStudio(db);

  return (
    <DrizzleContext.Provider value={drizzleDb}>
      {children}
    </DrizzleContext.Provider>
  );
};

// ✅ Use the correct type in the hook
export const useDrizzleDb = (): ExpoSQLiteDatabase<typeof schema> => {
  const context = useContext(DrizzleContext);
  if (!context) {
    throw new Error('useDrizzleDb must be used within a DrizzleProvider');
  }
  return context;
};
