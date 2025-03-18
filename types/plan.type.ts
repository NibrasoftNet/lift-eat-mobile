import { GoalEnum } from '@/utils/enum/user-details.enum';
import { DayEnum } from '@/utils/enum/general.enum';
import {
  CuisineTypeEnum,
  MealTypeEnum,
  MealUnitEnum,
} from '@/utils/enum/meal.enum';
import { ImageSourcePropType } from 'react-native';

export interface Ingredients {
  id: number;
  name: string;
  calories: number;
  carbs: number;
  fat: number;
  protein: number;
  unit: string;
  quantity: number;
}

export interface Meal {
  id: number;
  name: string;
  image: ImageSourcePropType | null;
  type: MealTypeEnum;
  calories: number;
  carbs: number;
  fat: number;
  protein: number;
  cuisineType: CuisineTypeEnum;
  unit: MealUnitEnum;
  quantity: number;
  ingredients: Ingredients[];
}

export interface DailyPlan {
  id: number;
  day: DayEnum;
  week: number;
  calories: number;
  carbs: number;
  fat: number;
  protein: number;
  meals: Meal[];
}

export interface NutritionPlan {
  id: number;
  name: string;
  goal: GoalEnum;
  unit: 'kg' | 'lbs';
  initialWeight: number;
  targetWeight: number;
  isPublic: boolean;
  durationWeeks: number;
  calories: number;
  carbs: number;
  fat: number;
  protein: number;
  dailyPlans: DailyPlan[];
}

export interface DailyIntake {
  id: number;
  week: number;
  date: string;
  actualCalories: number;
  actualCarbs: number;
  actualFats: number;
  actualProtein: number;
  meals: Meal[];
}
