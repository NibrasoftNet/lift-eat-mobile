import { UserOrmPros } from '@/db/schema';

/**
 * Interface pour les paramètres de requête de contexte utilisateur
 */
export interface GetUserContextParams {
  userId: number;
}

/**
 * Interface pour les résultats de requête de contexte utilisateur
 */
export interface GetUserContextResult {
  success: boolean;
  context?: string;
  error?: string;
}

/**
 * Interface pour les paramètres de requête de préférences utilisateur
 */
export interface GetUserPreferencesParams {
  userId: number;
}

/**
 * Interface pour les résultats de requête de préférences utilisateur
 */
export interface GetUserPreferencesResult {
  success: boolean;
  preferences?: {
    gender?: string;
    age?: number;
    weight?: number;
    weightUnit?: string;
    height?: number;
    heightUnit?: string;
    physicalActivity?: string;
    goal?: string;
    goalWeight?: number;
    dietaryRestrictions?: string[];
    calorieTarget?: number;
    proteinTarget?: number;
    carbsTarget?: number;
    fatTarget?: number;
  };
  error?: string;
}

/**
 * Interface pour les paramètres de requête de repas favoris
 */
export interface GetUserFavoriteMealsParams {
  userId: number;
}

/**
 * Interface pour les résultats de requête de repas favoris
 */
export interface GetUserFavoriteMealsResult {
  success: boolean;
  favoriteMeals?: Array<{
    id: number;
    name: string;
    type: string;
    cuisine: string;
  }>;
  error?: string;
}

/**
 * Interface pour les paramètres de requête de plans actifs
 */
export interface GetUserActivePlansParams {
  userId: number;
}

/**
 * Interface pour les résultats de requête de plans actifs
 */
export interface GetUserActivePlansResult {
  success: boolean;
  activePlans?: Array<{
    id: number;
    name: string;
    description: string;
    isCurrent: boolean;
  }>;
  error?: string;
}

/**
 * Interface pour les paramètres de requête d'historique d'activité
 */
export interface GetUserActivityHistoryParams {
  userId: number;
  daysLimit?: number;
}

/**
 * Interface pour les résultats de requête d'historique d'activité
 */
export interface GetUserActivityHistoryResult {
  success: boolean;
  activityHistory?: Array<{
    date: string;
    consumedMeals: number;
    totalCalories: number;
    calorieTarget: number;
  }>;
  error?: string;
}
