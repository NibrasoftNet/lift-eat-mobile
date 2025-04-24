import { DailyProgressOrmProps, DailyMealProgressOrmProps, MealOrmProps } from '@/db/schema';

// Interface pour getDailyProgressByDateViaMCP
export interface GetDailyProgressByDateParams {
  userId: number;
  date: string;
}

export interface GetDailyProgressByDateResult {
  success: boolean;
  progress?: DailyProgressOrmProps;
  error?: string;
}

// Interface pour createDailyProgressViaMCP
export interface CreateDailyProgressParams {
  userId: number;
  date: string;
}

export interface CreateDailyProgressResult {
  success: boolean;
  progress?: DailyProgressOrmProps;
  error?: string;
}

// Interface pour updateDailyProgressViaMCP
export interface UpdateDailyProgressParams {
  progressId: number;
  data: Partial<DailyProgressOrmProps>;
}

export interface UpdateDailyProgressResult {
  success: boolean;
  progress?: DailyProgressOrmProps;
  error?: string;
}

// Interface pour getMealProgressByDateViaMCP
export interface GetMealProgressByDateParams {
  userId: number;
  date: string;
}

export interface GetMealProgressByDateResult {
  success: boolean;
  progress?: DailyProgressOrmProps;
  meals?: (MealOrmProps & { progress: DailyMealProgressOrmProps | null; dailyPlanMealId: number | null })[];
  error?: string;
}

// Interface pour markMealAsConsumedViaMCP
export interface MarkMealAsConsumedParams {
  dailyProgressId: number;
  mealId: number;
  dailyPlanMealId: number;
  consumed: boolean;
  pourcentageConsomme?: number;
}

export interface MarkMealAsConsumedResult {
  success: boolean;
  mealProgress?: DailyMealProgressOrmProps;
  error?: string;
}

// Interface pour getMealProgressByDailyProgressViaMCP
export interface GetMealProgressByDailyProgressParams {
  dailyProgressId: number;
}

export interface GetMealProgressByDailyProgressResult {
  success: boolean;
  mealProgresses?: DailyMealProgressOrmProps[];
  error?: string;
}

/**
 * Paramètres pour la récupération des progressions quotidiennes d'un plan
 */
export interface GetDailyProgressByPlanParams {
  userId: number;
  planId: number;
}

/**
 * Résultat de la récupération des progressions quotidiennes d'un plan
 */
export interface GetDailyProgressByPlanResult {
  success: boolean;
  dailyProgressions?: DailyProgressOrmProps[];
  error?: string;
}
