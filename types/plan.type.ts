import { GoalEnum } from "@/utils/enum/user-details.enum";
import { DayEnum } from "@/utils/enum/general.enum";
import { CuisineTypeEnum, MealTypeEnum, MealUnitEnum } from "@/utils/enum/meal.enum";
import { ImageSourcePropType } from "react-native";

export interface Food {
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
    image: ImageSourcePropType;
    type: MealTypeEnum;
    calories: number;
    carbs: number;
    fats: number;
    protein: number;
    cuisineType: CuisineTypeEnum;
    unit: MealUnitEnum;
    quantity: number;
    foods: Food[];
}

export interface DailyPlan {
    id: number,
    day: DayEnum;
    week: number,
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