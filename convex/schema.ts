import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export const User = {
  email: v.string(),
  clerkId: v.string(),
  username: v.optional(v.string()),
  gender: v.optional(v.string()),
  weight: v.optional(v.number()),
  weightUnit: v.optional(v.string()),
  height: v.optional(v.number()),
  heightUnit: v.optional(v.string()),
  profileImage: v.optional(v.string()),
  physicalActivity: v.optional(v.string()),
  score: v.optional(v.number()),
};

export default defineSchema({
  users: defineTable(User)
    .index('byClerkId', ['clerkId'])
    .index('by_email', ['email']),

  ingredientsStandard: defineTable({
    name: v.string(),
    unit: v.string(),
    quantity: v.number(),
    calories: v.number(),
    carbs: v.number(),
    fat: v.number(),
    protein: v.number(),
    image: v.optional(v.string()),
  }),

  mealIngredients: defineTable({
    quantity: v.number(),
    calories: v.number(),
    carbs: v.number(),
    fat: v.number(),
    protein: v.number(),
    ingredientStandardId: v.id('ingredientsStandard'),
    mealId: v.id('meals'),
  }),

  meals: defineTable({
    type: v.string(),
    name: v.string(),
    description: v.string(),
    cuisine: v.string(),
    unit: v.string(),
    quantity: v.number(),
    calories: v.number(),
    carbs: v.number(),
    fat: v.number(),
    protein: v.number(),
    image: v.optional(v.string()),
    creatorId: v.id('users'),
  }),

  dailyPlan: defineTable({
    week: v.number(),
    calories: v.number(),
    carbs: v.number(),
    fat: v.number(),
    protein: v.number(),
    type: v.string(),
    day: v.string(),
    planId: v.id('plan'),
  }),

  dailyPlanMeals: defineTable({
    order: v.number(),
    dailyPlanId: v.id('dailyPlan'),
    mealId: v.id('meals'),
  }),

  plan: defineTable({
    name: v.string(),
    goal: v.string(),
    unit: v.string(),
    initialWeight: v.number(),
    targetWeight: v.number(),
    public: v.boolean(),
    current: v.boolean(),
    completed: v.boolean(),
    durationWeeks: v.number(),
    calories: v.number(),
    carbs: v.number(),
    fat: v.number(),
    protein: v.number(),
    type: v.string(),
    userId: v.id('users'),
  }),
});
