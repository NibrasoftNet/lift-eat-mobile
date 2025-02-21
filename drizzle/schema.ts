/*
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// Users table
export const usersTable = sqliteTable("users", {
    id: integer("id").primaryKey().autoincrement(),
    name: text("name").notNull(),
    email: text("email").unique().notNull(),
    password: text("password").notNull(),
    weight: real("weight").notNull(),
    weightUnit: text("weight_unit", { enum: ["KG", "LBS"] }).notNull(),
    height: real("height").notNull(),
    heightUnit: text("height_unit", { enum: ["METER", "INCHES"] }).notNull(),
    target: text("target", { enum: ["GAIN MASS", "WEIGHT LOSS", "MAINTAIN"] }).notNull(),
});

// Plans table (independent plans)
export const plansTable = sqliteTable("plans", {
    id: integer("id").primaryKey().autoincrement(),
    type: text("type", { enum: ["ai", "user", "company"] }).notNull(),
    day: text("day", { enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] }).notNull(),
});

// Junction table for Users ↔ Plans (Many-to-Many)
export const userPlansTable = sqliteTable("user_plans", {
    userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    planId: integer("plan_id").notNull().references(() => plansTable.id, { onDelete: "cascade" }),
    primaryKey: ["userId", "planId"], // Composite primary key for uniqueness
});

// Meals table (independent meals)
export const mealsTable = sqliteTable("meals", {
    id: integer("id").primaryKey().autoincrement(),
    type: text("type", { enum: ["snack", "breakfast", "lunch", "dinner"] }).notNull(),
    name: text("name").notNull(),
    unit: text("unit").notNull(),
    quantity: real("quantity").notNull(),
    calories: real("calories").notNull(),
    carbs: real("carbs").notNull(),
    fat: real("fat").notNull(),
    protein: real("protein").notNull(),
});

// Junction table for Plans ↔ Meals (Many-to-Many)
export const planMealsTable = sqliteTable("plan_meals", {
    planId: integer("plan_id").notNull().references(() => plansTable.id, { onDelete: "cascade" }),
    mealId: integer("meal_id").notNull().references(() => mealsTable.id, { onDelete: "cascade" }),
    primaryKey: ["planId", "mealId"],
});

// Ingredient Standard Table (One-to-Many with Ingredients)
export const ingredientStandardTable = sqliteTable("ingredient_standard", {
    id: integer("id").primaryKey().autoincrement(),
    name: text("name").notNull(),
    unit: text("unit").notNull(),
    quantity: real("quantity").notNull(),
    carbs: real("carbs").notNull(),
    fat: real("fat").notNull(),
    protein: real("protein").notNull(),
});

// Ingredients table (Only stores quantity & reference to standard ingredient)
export const ingredientsTable = sqliteTable("ingredients", {
    id: integer("id").primaryKey().autoincrement(),
    ingredientStandardId: integer("ingredient_standard_id")
        .notNull()
        .references(() => ingredientStandardTable.id, { onDelete: "cascade" }),
    quantity: real("quantity").notNull(),
});

// Junction table for Meals ↔ Ingredients (Many-to-Many)
export const mealIngredientsTable = sqliteTable("meal_ingredients", {
    mealId: integer("meal_id").notNull().references(() => mealsTable.id, { onDelete: "cascade" }),
    ingredientId: integer("ingredient_id").notNull().references(() => ingredientsTable.id, { onDelete: "cascade" }),
    primaryKey: ["mealId", "ingredientId"],
});
*/
