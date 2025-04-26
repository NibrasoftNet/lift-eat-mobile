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
} from '@/utils/enum/user-gender-activity.enum';
import {
  GoalEnum,
  GoalTypeArray,
  HeightUnitEnum,
  WeightUnitEnum,
  WeightUnitTypeArray,
} from '@/utils/enum/user-details.enum';
import {
  CuisineTypeArray,
  CuisineTypeEnum,
  MealTypeArray,
  MealTypeEnum,
  MealUnitArray,
  MealUnitEnum,
} from '@/utils/enum/meal.enum';
import {
  DailyPlanGeneratedWithEnum,
  DailyPlanGeneratedWithUnitArray,
  DayEnum,
  DayUnitArray,
  PlanGeneratedWithArray,
  PlanGeneratedWithEnum,
  ProviderEnum,
  RoleEnum,
} from '@/utils/enum/general.enum';
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
  calories: real('calories').notNull().default(17),
  carbs: real('carbs').notNull().default(1),
  fat: real('fat').notNull().default(1),
  protein: real('protein').notNull().default(1),
  image: blob('image', { mode: 'buffer' }), // BLOB column for ingredient image
});

// Ingredients Table (Each ingredient belongs to only ONE meal)
export const mealIngredients = sqliteTable('meal_ingredients', {
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  id: integer('id').primaryKey({ autoIncrement: true }),
  quantity: real('quantity').notNull().default(1),
  calories: real('calories').notNull().default(17),
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
  calories: real('calories').notNull().default(17),
  carbs: real('carbs').notNull().default(1),
  fat: real('fat').notNull().default(1),
  protein: real('protein').notNull().default(1),
  image: blob('image', { mode: 'buffer' }), // BLOB column for ingredient image
  // Foreign key to users table
  creatorId: integer('creator_id')
    .references(() => users.id) // References the id column in users
    .notNull(),
});

// Daily Plans table (independent plans)
export const dailyPlan = sqliteTable('daily_plan', {
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  id: integer('id').primaryKey({ autoIncrement: true }),
  week: integer('week').notNull().default(1),
  calories: real('calories').notNull().default(17),
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
  // Calculated nutritional values for this specific meal-plan relation
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
  calories: real('calories').notNull().default(17),
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
  calories: real('calories').notNull().default(0),
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

// Types pour les nouvelles tables
export type DailyProgressOrmProps = typeof dailyProgress.$inferSelect;
export type DailyMealProgressOrmProps = typeof dailyMealProgress.$inferSelect;
