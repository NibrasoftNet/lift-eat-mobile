import { GoalEnum } from "@/utils/enum/user-details.enum";

export interface Ingredient {
    id: string;
    name: string;
    calories: number;
    carbs: number;
    fats: number;
    protein: number;
    unit: string;
    quantity: number;
}

export interface Meal {
    id: string;
    name: string;
    calories: number;
    carbs: number;
    fats: number;
    protein: number;
    cuisineType: string;
    unit: string;
    quantity: number;
    ingredients: Ingredient[];
}

export interface DailyPlan {
    date: string;
    calories: number;
    carbs: number;
    fats: number;
    protein: number;
    meals: Meal[];
}

export interface NutritionPlan {
    id: string;
    name: string;
    goal: GoalEnum;
    unit: 'kg' | 'lbs';
    initialWeight: number;
    targetWeight: number;
    isPublic: boolean;
    durationWeeks: number;
    calories: number;
    carbs: number;
    fats: number;
    protein: number;
    dailyPlans: DailyPlan[];
}

export interface DailyIntake {
    date: string;
    actualCalories: number;
    actualCarbs: number;
    actualFats: number;
    actualProtein: number;
    meals: Meal[];
}