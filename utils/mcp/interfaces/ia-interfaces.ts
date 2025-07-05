import { UserOrmPros } from '@/db/schema';
import {
  NutritionAdviceType,
  NutritionAdviceProps,
  NutritionAdviceCreateProps,
  NutritionAdviceFeedbackProps,
} from '@/types/nutrition-advice.type';

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
    // Informations de base
    gender?: string;
    age?: number;
    weight?: number;
    weightUnit?: string;
    height?: number;
    heightUnit?: string;
    physicalActivity?: string;

    // Restrictions et allergies
    dietaryRestrictions?: string[];
    allergies?: string[];

    // Objectifs nutritionnels - ancienne structure (conservée pour rétrocompatibilité)
    goal?: string;
    goalWeight?: number;
    calorieTarget?: number;
    proteinTarget?: number;
    carbsTarget?: number;
    fatTarget?: number;

    // Nouvelle structure pour les objectifs nutritionnels
    nutritionGoals?: {
      goal?: string;
      targetWeight?: number;
      dailyCalories?: number;
      macroRatios?: {
        protein?: number;
        carbs?: number;
        fat?: number;
      };
    };
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

/**
 * Interface pour les paramètres de sauvegarde d'un conseil nutritionnel
 * Utilise NutritionAdviceCreateProps défini dans le type global
 */
export interface SaveNutritionAdviceParams extends NutritionAdviceCreateProps {}

/**
 * Interface pour les résultats de sauvegarde d'un conseil nutritionnel
 */
export interface SaveNutritionAdviceResult {
  success: boolean;
  adviceId?: number;
  error?: string;
}

/**
 * Interface pour les paramètres de mise à jour du feedback sur un conseil
 * Utilise NutritionAdviceFeedbackProps défini dans le type global
 */
export interface UpdateAdviceFeedbackParams
  extends NutritionAdviceFeedbackProps {}

/**
 * Interface pour les résultats de mise à jour du feedback
 */
export interface UpdateAdviceFeedbackResult {
  success: boolean;
  error?: string;
}

/**
 * Interface pour les paramètres de récupération des conseils nutritionnels
 * Basé sur NutritionAdviceFilterProps défini dans le type global
 */
export interface GetNutritionAdviceParams {
  userId: number;
  limit?: number;
  type?: NutritionAdviceType | string;
}

/**
 * Interface pour les résultats de récupération des conseils nutritionnels
 */
export interface GetNutritionAdviceResult {
  success: boolean;
  adviceList?: NutritionAdviceProps[];
  error?: string;
}
