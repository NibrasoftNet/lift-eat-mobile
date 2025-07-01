/**
 * Interfaces standardisées pour les services Pages (Presenter)
 * Ce fichier centralise les interfaces pour les différents services de présentation
 * suivant l'architecture MCP (Model-Controller-Presenter)
 */

import { OperationResult } from '@/utils/interfaces/pages.interface';
import { IngredientStandardOrmProps } from '@/db/schema';
import { GetIngredientsParams, GetIngredientsResult } from './drawer.interface';
import { MacroNutrientsBase } from '@/types/nutrition.type';
import { IaMealType, IaPlanType } from '@/utils/validation/ia/ia.schemas';

/**
 * Interface de base pour les services pages
 */
export interface PagesServiceInterface {
  // Propriétés et méthodes communes à tous les services pages
}

/**
 * Interface pour le service de présentation des assistants IA
 */
export interface AssistantPagesServiceInterface extends PagesServiceInterface {
  generateMeal(criteria: IaMealType, userId: number): Promise<OperationResult<any>>;
  generatePlan(criteria: IaPlanType, userId: number): Promise<OperationResult<any>>;
  analyzeProgress(startDate: string, endDate: string, userId: number): Promise<OperationResult<any>>;
  analyzeNutritionHabits(userId: number): Promise<OperationResult<any>>;
}

/**
 * Interface pour le service de présentation des ingrédients
 */
/**
 * Interface du service Presenter pour les ingrédients
 */
export interface IngredientPagesServiceInterface extends PagesServiceInterface {
  /**
   * Récupère une liste d'ingrédients
   * @param searchTerm Terme de recherche optionnel
   * @param pageSize Taille de la page
   */
  getIngredientsList(searchTerm?: string, pageSize?: number): Promise<OperationResult<IngredientStandardOrmProps[]>>;
  
  /**
   * Récupère une liste d'ingrédients formatée pour l'UI
   * @param params Paramètres de recherche et pagination
   */
  getIngredientsForDisplay(params: GetIngredientsParams): Promise<OperationResult<GetIngredientsResult>>;

  /**
   * Formate un ingrédient pour l'affichage dans l'UI
   * @param ingredient L'ingrédient à formater ou son ID
   */
  formatIngredientForDisplay(
    ingredientIdOrObject: number | IngredientStandardOrmProps
  ): { displayName: string; displayUnit: string };
  
  /**
   * Ajoute un nouvel ingrédient
   * @param ingredientData Données de l'ingrédient à ajouter
   */
  addIngredient(ingredientData: any): Promise<OperationResult<IngredientStandardOrmProps>>;
  
  /**
   * Récupère la quantité actuelle d'un ingrédient
   * @param ingredientId ID de l'ingrédient standard
   * @returns La quantité actuelle ou 0 si l'ingrédient n'est pas sélectionné
   */
  getIngredientQuantity(ingredientId: number): number;
}

/**
 * Interface pour le service de présentation des plans nutritionnels
 */
export interface PlanPagesServiceInterface extends PagesServiceInterface {
  getPlansList(filters: any): Promise<OperationResult<any>>;
  getPlanDetails(planId: number): Promise<OperationResult<any>>;
  createPlan(planData: any): Promise<OperationResult<any>>;
  updatePlan(planId: number, planData: any): Promise<OperationResult<any>>;
  deletePlan(planId: number): Promise<OperationResult<any>>;
  setCurrentPlan(planId: number): Promise<OperationResult<any>>;
  getCurrentPlan(): Promise<OperationResult<any>>;
}

/**
 * Interface pour le service de présentation du suivi de progression
 */
export interface ProgressPagesServiceInterface extends PagesServiceInterface {
  getProgressHistory(days?: number): Promise<OperationResult<any[]>>;
  updateProgress(date: string, data: any): Promise<OperationResult<any>>;
  markMealAsConsumed(mealId: number, date: string, quantity?: number): Promise<OperationResult<any>>;
}

/**
 * Interface pour le service de présentation des valeurs nutritionnelles
 */
export interface NutritionPagesServiceInterface extends PagesServiceInterface {
  calculateDailyCalorieIntake(userDetails: any): number;
  formatMealNutritionForDisplay(macros: MacroNutrientsBase, weight: number): any;
  getNutritionForQuantity(macros: MacroNutrientsBase, totalWeight: number, quantity: number): MacroNutrientsBase;
  adjustNutritionByCookingMethod(macros: MacroNutrientsBase, method: string): MacroNutrientsBase;
}
