import { MealOrmProps, PlanOrmProps } from '../db/schema';

/**
 * Types pour les conseils nutritionnels générés par l'IA
 */

/**
 * Type de conseil nutritionnel
 */
export enum NutritionAdviceType {
  GENERAL = 'GENERAL', // Conseil général (non spécifique)
  MEAL_SPECIFIC = 'MEAL', // Conseil spécifique à un repas
  PLAN_SPECIFIC = 'PLAN', // Conseil spécifique à un plan
  ALLERGEN = 'ALLERGEN', // Alerte sur les allergènes
  MACRONUTRIENT = 'MACRO', // Conseil sur l'équilibre des macronutriments
  MICRONUTRIENT = 'MICRO', // Conseil sur les micronutriments
}

/**
 * Interface pour les conseils nutritionnels en base de données
 */
export interface NutritionAdviceProps {
  id: number;
  title: string;
  content: string;
  type: NutritionAdviceType | string;
  context?: string;
  liked?: boolean;
  applied: boolean;
  createdAt: string;
  updatedAt?: string;
  userId: number;
  mealId?: number;
  planId?: number;
}

/**
 * Interface pour les conseils nutritionnels avec relations
 */
export interface NutritionAdviceWithRelationsProps
  extends NutritionAdviceProps {
  meal?: MealOrmProps;
  plan?: PlanOrmProps;
}

/**
 * Interface pour les filtres de recherche de conseils nutritionnels
 */
export interface NutritionAdviceFilterProps {
  type?: NutritionAdviceType | string;
  mealId?: number;
  planId?: number;
  liked?: boolean;
  applied?: boolean;
  fromDate?: string;
  toDate?: string;
  limit?: number;
}

/**
 * Interface pour l'enregistrement d'un nouveau conseil nutritionnel
 */
export interface NutritionAdviceCreateProps {
  title: string;
  content: string;
  type: NutritionAdviceType | string;
  context?: string;
  userId: number;
  mealId?: number;
  planId?: number;
}

/**
 * Interface pour la mise à jour du feedback sur un conseil nutritionnel
 */
export interface NutritionAdviceFeedbackProps {
  adviceId: number;
  userId: number;
  liked?: boolean;
  applied?: boolean;
}
