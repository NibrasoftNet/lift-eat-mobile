import { GoalEnum } from '@/utils/enum/user-details.enum';
import { DayEnum } from '@/utils/enum/general.enum';


import { MealOrmProps } from '@/db/schema';




export interface DailyPlan {
  id: number;
  day: DayEnum;
  week: number;
  calories: number;
  carbs: number;
  fats: number;
  protein: number;
  meals: MealOrmProps[];
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
  fats: number;
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
  meals: MealOrmProps[];
}
