import {
  sqliteTable,
  text,
  integer,
  real,
  blob,
} from 'drizzle-orm/sqlite-core';
import { GenderEnum } from '@/utils/enum/user-gender-activity.enum';
import { HeightUnitEnum, WeightUnitEnum } from '@/utils/enum/user-details.enum';
import { MealTypeEnum, MealUnitEnum } from '@/utils/enum/meal.enum';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  gender: text('gender', { enum: ['MALE', 'FEMALE'] })
    .notNull()
    .default(GenderEnum.MALE),
  weight: real('weight').notNull().default(30),
  weightUnit: text('weight_unit', { enum: ['KG', 'LBS', 'ST'] })
    .notNull()
    .default(WeightUnitEnum.KG),
  height: real('height').notNull().default(150),
  heightUnit: text('height_unit', { enum: ['CM', 'IN', 'FT'] })
    .notNull()
    .default(HeightUnitEnum.CM),
  profileImage: blob('profile_image', { mode: 'buffer' }), // BLOB column for user profile image
});

// Ingredient Standard Table
export const ingredientsStandard = sqliteTable('ingredients_standard', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  unit: text('unit', {
    enum: ['GRAMMES', 'KILOGRAMMES', 'MILLILITRES'],
  }).default(MealUnitEnum.GRAMMES),
  quantity: real('quantity').notNull(),
  carbs: real('carbs').notNull(),
  fat: real('fat').notNull(),
  protein: real('protein').notNull(),
  image: blob('image', { mode: 'buffer' }), // BLOB column for ingredient image
});

// Ingredients Table (Each ingredient belongs to only ONE meal)
export const ingredients = sqliteTable('ingredients', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  mealId: integer('meal_id')
    .notNull()
    .references(() => meals.id, { onDelete: 'cascade' }), // Enforces One-to-Many
  quantity: real('quantity').notNull(),
});

// Junction Table (Many-to-Many)
export const ingredientsIngredientsStandard = sqliteTable(
  'ingredients_ingredients_standard',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    ingredientId: integer('ingredient_id')
      .notNull()
      .references(() => ingredients.id, { onDelete: 'cascade' }),
    ingredientStandardId: integer('ingredient_standard_id')
      .notNull()
      .references(() => ingredientsStandard.id, { onDelete: 'cascade' }),
  },
);

// Meals table (independent meal)
export const meals = sqliteTable('meals', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  type: text('type', {
    enum: ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'],
  }).default(MealTypeEnum.BREAKFAST),
  name: text('name').notNull(),
  unit: text('unit', {
    enum: ['GRAMMES', 'KILOGRAMMES', 'MILLILITRES'],
  }).default(MealUnitEnum.GRAMMES),
  quantity: real('quantity').notNull(),
  calories: real('calories').notNull(),
  carbs: real('carbs').notNull(),
  fat: real('fat').notNull(),
  protein: real('protein').notNull(),
  image: blob('image', { mode: 'buffer' }), // BLOB column for ingredient image
});

// Export types for use in your app
export type User = typeof users.$inferSelect;
export type IngredientStandard = typeof ingredientsStandard.$inferSelect;
export type Ingredient = typeof ingredients.$inferSelect;
export type Meal = typeof meals.$inferSelect;
