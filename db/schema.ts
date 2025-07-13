import {
  sqliteTable,
  text,
  integer,
  real,
  blob,
} from 'drizzle-orm/sqlite-core';
import {
  GenderEnum,
  GenderTypeArray,
  PhysicalActivityEnum,
  PhysicalActivityTypeArray,
} from '../utils/enum/user-gender-activity.enum';
import {
  GoalEnum,
  GoalTypeArray,
  HeightUnitEnum,
  WeightUnitEnum,
  WeightUnitTypeArray,
  DietaryRestrictionEnum,
  DietaryRestrictionTypeArray,
  AllergyEnum,
  AllergyTypeArray,
} from '../utils/enum/user-details.enum';
import {
  CuisineTypeArray,
  CuisineTypeEnum,
  MealTypeArray,
  MealTypeEnum,
  MealUnitArray,
  MealUnitEnum,
} from '../utils/enum/meal.enum';
import {
  DailyPlanGeneratedWithEnum,
  DailyPlanGeneratedWithUnitArray,
  DayEnum,
  DayUnitArray,
  PlanGeneratedWithArray,
  PlanGeneratedWithEnum,
  ProviderEnum,
  RoleEnum,
} from '../utils/enum/general.enum';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().default('John'),
  email: text('email').notNull().unique(),
  provider: text('provider', {
    enum: [ProviderEnum.email, ProviderEnum.oauth_google],
  })
    .notNull()
    .default(ProviderEnum.email),
  role: text('role', { enum: [RoleEnum.USER, RoleEnum.USER] })
    .notNull()
    .default(RoleEnum.USER),
  age: integer('age').notNull().default(20),
  gender: text('gender', { enum: GenderTypeArray })
    .notNull()
    .default(GenderEnum.MALE),
  weight: real('weight').notNull().default(60),
  weightUnit: text('weight_unit', {
    enum: WeightUnitTypeArray,
  })
    .notNull()
    .default(WeightUnitEnum.KG),
  height: real('height').notNull().default(150),
  heightUnit: text('height_unit', {
    enum: [HeightUnitEnum.CM, HeightUnitEnum.IN, HeightUnitEnum.FT],
  })
    .notNull()
    .default(HeightUnitEnum.CM),
  profileImage: blob('profile_image', { mode: 'buffer' }), // BLOB column for user profile image
  clerkId: text('clerk_id'), // ID externe Clerk pour l'authentification
  physicalActivity: text('physical_activity', {
    enum: PhysicalActivityTypeArray,
  })
    .notNull()
    .default(PhysicalActivityEnum.MODERATE),
  score: integer('weight').notNull().default(0),
});

// Ingredient Standard Table
export const ingredientsStandard = sqliteTable('ingredients_standard', {
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().default('felfel'),
  unit: text('unit', {
    enum: MealUnitArray,
  }).default(MealUnitEnum.GRAMMES),
  quantity: real('quantity').notNull().default(1),
  calories: real('calories').notNull().default(1),
  carbs: real('carbs').notNull().default(1),
  fat: real('fat').notNull().default(1),
  protein: real('protein').notNull().default(1),
  image: blob('image', { mode: 'buffer' }), // Binary image data
});

// Ingredient Suggestions Table for storing missing ingredient suggestions
export const ingredientSuggestions = sqliteTable('ingredient_suggestions', {
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  unit: text('unit', {
    enum: MealUnitArray,
  }).default(MealUnitEnum.GRAMMES),
  quantity: real('quantity').notNull().default(100),
  suggested_calories: real('suggested_calories').default(0),
  suggested_carbs: real('suggested_carbs').default(0),
  suggested_fat: real('suggested_fat').default(0),
  suggested_protein: real('suggested_protein').default(0),
  suggestion_source: text('suggestion_source').default('ia'),
  status: text('status', {
    enum: ['pending', 'accepted', 'rejected'],
  }).default('pending'),
  // Foreign key to users table
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
});

// Ingredients Table (Each ingredient belongs to only ONE meal)
// NOTE: Toutes les valeurs nutritionnelles (calories, carbs, fat, protein) sont standardisées à 100g
// de l'ingrédient pour permettre des calculs proportionnels cohérents.
export const mealIngredients = sqliteTable('meal_ingredients', {
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  id: integer('id').primaryKey({ autoIncrement: true }),
  quantity: real('quantity').notNull().default(1),
  // Valeurs nutritionnelles standardisées à 100g
  calories: real('calories').notNull().default(1),
  carbs: real('carbs').notNull().default(1),
  fat: real('fat').notNull().default(1),
  protein: real('protein').notNull().default(1),
  // Foreign key to ingredientsStandard table
  ingredientStandardId: integer('ingredient_standard_id')
    .references(() => ingredientsStandard.id) // References the id column in ingredientsStandard
    .notNull(),
  // Foreign key to meals table
  mealId: integer('meal_id')
    .references(() => meals.id) // References the id column in meals
    .notNull(),
});

// Meals table (independent meal)
// NOTE: Toutes les valeurs nutritionnelles des repas sont standardisées à 100g
// pour permettre des comparaisons cohérentes et des calculs proportionnels.
export const meals = sqliteTable('meals', {
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  id: integer('id').primaryKey({ autoIncrement: true }),
  type: text('type', {
    enum: MealTypeArray,
  })
    .notNull()
    .default(MealTypeEnum.BREAKFAST),
  name: text('name').notNull().default('kosksi'),
  description: text('description').notNull().default('no description'),
  cuisine: text('cuisine', {
    enum: CuisineTypeArray,
  })
    .notNull()
    .default(CuisineTypeEnum.GENERAL),
  unit: text('unit', {
    enum: MealUnitArray,
  })
    .notNull()
    .default(MealUnitEnum.GRAMMES),
  quantity: real('quantity').notNull().default(1),
  // Valeurs nutritionnelles standardisées pour 100g
  calories: real('calories').notNull().default(1),
  carbs: real('carbs').notNull().default(1),
  fat: real('fat').notNull().default(1),
  protein: real('protein').notNull().default(1),
  image: blob('image', { mode: 'buffer' }), // Binary image data
  isFavorite: integer('is_favorite', { mode: 'boolean' }).default(false),
  // Foreign key to users table
  creatorId: integer('creator_id')
    .references(() => users.id) // References the id column in users
    .notNull(),
});

// Daily Plans table (independent plans)
// Ajout du champ `date` (YYYY-MM-DD) pour piloter la sélection directe par date.
// NOTE: Les valeurs nutritionnelles représentent le total journalier du plan, pas une valeur à 100g
// La normalisation à 100g n'est pas pertinente pour des plans journaliers complets
export const dailyPlan = sqliteTable('daily_plan', {
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  id: integer('id').primaryKey({ autoIncrement: true }),
  date: text('date').notNull(),
  // Valeurs nutritionnelles totales pour la journée (pas standardisées)
  calories: real('calories').notNull().default(1),
  carbs: real('carbs').notNull().default(1),
  fat: real('fat').notNull().default(1),
  protein: real('protein').notNull().default(1),
  type: text('type', {
    enum: DailyPlanGeneratedWithUnitArray,
  })
    .notNull()
    .default(DailyPlanGeneratedWithEnum.MANUAL),
  day: text('day', {
    enum: DayUnitArray,
  })
    .notNull()
    .default(DayEnum.MONDAY),
  // Foreign key to plan table (one-to-many relationship)
  planId: integer('plan_id')
    .references(() => plan.id) // References the id column in plan
    .notNull(),
});

// Junction Table for Many-to-Many Relationship between dailyPlan and meals
// Cette table stocke les instances spécifiques de repas dans un plan journalier,
// avec leurs quantités et valeurs nutritionnelles calculées proportionnellement
export const dailyPlanMeals = sqliteTable('daily_plan_meals', {
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  id: integer('id').primaryKey({ autoIncrement: true }),
  // Foreign key to dailyPlan table
  dailyPlanId: integer('daily_plan_id')
    .references(() => dailyPlan.id) // References the id column in dailyPlan
    .notNull(),
  // Foreign key to meals table
  mealId: integer('meal_id')
    .references(() => meals.id) // References the id column in meals
    .notNull(),
  // Type de repas spécifique à cette relation (peut être différent du type par défaut du repas)
  mealType: text('meal_type', {
    enum: MealTypeArray,
  }),
  // Quantity in grams
  quantity: real('quantity').notNull().default(10),
  // Valeurs nutritionnelles calculées pour la quantité spécifique de ce repas
  // Ces valeurs sont dérivées des valeurs standardisées à 100g du repas associé
  // multipliées par le facteur de proportion (quantity/100)
  calories: real('calories'),
  carbs: real('carbs'),
  fat: real('fat'),
  protein: real('protein'),
});

// Plan Table
export const plan = sqliteTable('plan', {
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  id: integer('id').primaryKey({ autoIncrement: true }), // Custom ID like 'plan-001'
  name: text('name').notNull().default('PlanB'),
  goal: text('goal', {
    enum: GoalTypeArray,
  })
    .notNull()
    .default(GoalEnum.MAINTAIN),
  unit: text('unit', {
    enum: WeightUnitTypeArray,
  })
    .notNull()
    .default(WeightUnitEnum.KG),
  initialWeight: real('initial_weight').notNull().default(60),
  targetWeight: real('target_weight').notNull().default(60),
  public: integer({ mode: 'boolean' }).notNull().default(true),
  current: integer({ mode: 'boolean' }).notNull().default(false),
  completed: integer({ mode: 'boolean' }).notNull().default(false),
  durationWeeks: integer('duration_weeks').notNull().default(1),
  startDate: text('start_date').notNull(),
  calories: real('calories').notNull().default(1),
  carbs: real('carbs').notNull().default(1),
  fat: real('fat').notNull().default(1),
  protein: real('protein').notNull().default(1),
  type: text('type', {
    enum: PlanGeneratedWithArray,
  })
    .notNull()
    .default(PlanGeneratedWithEnum.MANUAL),

  // Foreign key to users table (many-to-one relationship)
  userId: integer('user_id')
    .references(() => users.id) // References the id column in users
    .notNull(),
});

// Export types for use in your app
export type UserOrmPros = typeof users.$inferSelect;
export type IngredientStandardOrmProps =
  typeof ingredientsStandard.$inferSelect;
export type MealIngredientsOrmProps = typeof mealIngredients.$inferSelect;
export type MealOrmProps = typeof meals.$inferSelect;
export type DailyPlanOrmProps = typeof dailyPlan.$inferSelect;
export type DailyPlanMealsOrmProps = typeof dailyPlanMeals.$inferSelect;
export type PlanOrmProps = typeof plan.$inferSelect;

// Custom type for Plan with nested DailyPlans and Meals
export type PlanWithDailyPlansAndMealsOrmProps = PlanOrmProps & {
  dailyPlans: (DailyPlanOrmProps & { meals: MealOrmProps[] })[];
};

export type IngredientWithStandardOrmProps = MealIngredientsOrmProps & {
  ingredientsStandard: IngredientStandardOrmProps;
};

// Custom type for Meal with nested MealIngredients and IngredientStandard
export type MealWithIngredientAndStandardOrmProps = MealOrmProps & {
  mealIngredients: IngredientWithStandardOrmProps[];
};

// Table pour suivre la progression quotidienne globale
export const dailyProgress = sqliteTable('daily_progress', {
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  id: integer('id').primaryKey({ autoIncrement: true }),
  date: text('date').notNull(), // Format ISO
  pourcentageCompletion: real('pourcentage_completion').notNull().default(0),
  calories: real('calories').notNull().default(1),
  carbs: real('carbs').notNull().default(0),
  fat: real('fat').notNull().default(0),
  protein: real('protein').notNull().default(0),
  // Foreign key to users table
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  // Foreign key to plan table (référence au plan courant uniquement)
  planId: integer('plan_id')
    .references(() => plan.id)
    .notNull(),
});

// Table pour suivre l'état de chaque repas
export const dailyMealProgress = sqliteTable('daily_meal_progress', {
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  id: integer('id').primaryKey({ autoIncrement: true }),
  consomme: integer({ mode: 'boolean' }).notNull().default(false),
  pourcentageConsomme: real('pourcentage_consomme').notNull().default(100),
  caloriesEffectives: real('calories_effectives').notNull().default(0),
  proteinEffectives: real('protein_effectives').notNull().default(0),
  carbsEffectives: real('carbs_effectives').notNull().default(0),
  fatEffectives: real('fat_effectives').notNull().default(0),
  // Foreign key to dailyProgress table
  dailyProgressId: integer('daily_progress_id')
    .references(() => dailyProgress.id)
    .notNull(),
  // Foreign key to dailyPlanMeals table
  dailyPlanMealId: integer('daily_plan_meal_id')
    .references(() => dailyPlanMeals.id)
    .notNull(),
  // Foreign key to meals table
  mealId: integer('meal_id')
    .references(() => meals.id)
    .notNull(),
});

// Table pour stocker les conseils nutritionnels générés par l'IA
export const nutritionAdvice = sqliteTable('nutrition_advice', {
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  type: text('type').notNull().default('GENERAL'), // GENERAL, MEAL_SPECIFIC, PLAN_SPECIFIC
  context: text('context'), // Contexte associé (ex: macros ciblées, repas référencé)
  liked: integer({ mode: 'boolean' }), // Notation utilisateur (null si pas de feedback)
  applied: integer({ mode: 'boolean' }).default(false), // Si l'utilisateur a appliqué le conseil
  // Références (optionnelles)
  planId: integer('plan_id').references(() => plan.id),
  mealId: integer('meal_id').references(() => meals.id),
  // Foreign key to users table
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
});

// Scan History Table to store recent scanned products
export const scanHistory = sqliteTable('scan_history', {
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  id: integer('id').primaryKey({ autoIncrement: true }),
  barcode: text('barcode').notNull(),
  name: text('name').notNull(),
  scannedAt: text('scanned_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
});

// Types pour les nouvelles tables
export type DailyProgressOrmProps = typeof dailyProgress.$inferSelect;
export type ScanHistoryOrmProps = typeof scanHistory.$inferSelect;
export type DailyMealProgressOrmProps = typeof dailyMealProgress.$inferSelect;
export type NutritionAdviceOrmProps = typeof nutritionAdvice.$inferSelect;

// Type pour les suggestions d'ingrédients
export type IngredientSuggestionsOrmProps =
  typeof ingredientSuggestions.$inferSelect;

// Table des restrictions alimentaires des utilisateurs
export const userDietaryRestrictions = sqliteTable(
  'user_dietary_restrictions',
  {
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    restriction: text('restriction', {
      enum: DietaryRestrictionTypeArray,
    }).notNull(),
  },
);

// Table des allergies des utilisateurs
export const userAllergies = sqliteTable('user_allergies', {
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  allergy: text('allergy', { enum: AllergyTypeArray }).notNull(),
});

// Table des objectifs nutritionnels détaillés des utilisateurs
export const userNutritionGoals = sqliteTable('user_nutrition_goals', {
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  goal: text('goal', { enum: GoalTypeArray })
    .notNull()
    .default(GoalEnum.MAINTAIN),
  targetWeight: real('target_weight'),
  dailyCalories: integer('daily_calories'),
  proteinPercentage: integer('protein_percentage'),
  carbsPercentage: integer('carbs_percentage'),
  fatPercentage: integer('fat_percentage'),
});

// Types pour les nouvelles tables
export type UserDietaryRestrictionsOrmProps =
  typeof userDietaryRestrictions.$inferSelect;
export type UserAllergiesOrmProps = typeof userAllergies.$inferSelect;
export type UserNutritionGoalsOrmProps = typeof userNutritionGoals.$inferSelect;
