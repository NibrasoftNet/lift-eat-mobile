/**
 * Interfaces pour les services de pages
 * Ces interfaces définissent les contrats pour les services gérant la logique des pages
 */

import { LoginFormData, RegisterFormData, ResetPasswordData, UpdatePasswordData, AuthenticationResult } from "./auth.interface";
import { MealOrmProps, MealWithIngredientAndStandardOrmProps, DailyProgressOrmProps } from "@/db/schema";
import { MealTypeEnum, CuisineTypeEnum } from "@/utils/enum/meal.enum";
import { MealListFilter } from "@/utils/mcp/interfaces/meal-interfaces";
import { IaMealType, IaPlanType } from "@/utils/validation/ia/ia.schemas";

// Interface générique pour les résultats d'opération
export interface OperationResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  warning?: string; // Pour signaler des avertissements (ex: synchronisation partielle)
}

/**
 * Interfaces pour le service de pages d'authentification
 */
export interface AuthPagesServiceInterface {
  /**
   * Trouve ou crée un utilisateur par email (implémentation actuelle simplifiée)
   * @param email Email de l'utilisateur
   */
  findOrCreateUser(email: string): Promise<OperationResult<any>>;

  /**
   * Authentifie un utilisateur
   * @param data Données de formulaire de connexion
   */
  login(data: LoginFormData): Promise<OperationResult<AuthenticationResult>>;
  
  /**
   * Enregistre un nouvel utilisateur
   * @param data Données de formulaire d'inscription
   */
  register(data: RegisterFormData): Promise<OperationResult<AuthenticationResult>>;
  
  /**
   * Envoie un email de réinitialisation de mot de passe
   * @param data Données de formulaire de réinitialisation
   */
  resetPassword(data: ResetPasswordData): Promise<OperationResult>;
  
  /**
   * Met à jour le mot de passe d'un utilisateur
   * @param data Données de formulaire de nouveau mot de passe
   * @param token Token de réinitialisation
   */
  updatePassword(data: UpdatePasswordData, token: string): Promise<OperationResult>;
}

/**
 * Interface pour les filtres de repas
 */
export interface MealFilters {
  search?: string;
  mealType?: MealTypeEnum;
  cuisine?: CuisineTypeEnum;
  page?: number;
  limit?: number;
  filter?: MealListFilter;
}

/**
 * Interface pour le service de pages de repas
 */
export interface MealPagesServiceInterface {
  /**
   * Récupère la liste des repas avec filtrage
   * @param filters Filtres à appliquer
   */
  getMealsList(filters: MealFilters): Promise<OperationResult<{
    meals: MealOrmProps[];
    totalCount: number;
    pageInfo?: {
      currentPage: number;
      totalPages: number;
    }
  }>>;
  
  /**
   * Récupère les détails d'un repas
   * @param id ID du repas
   */
  getMealDetails(id: number): Promise<OperationResult<{
    meal: MealWithIngredientAndStandardOrmProps;
    ingredients: any[];
  }>>;
  
  /**
   * Supprime un repas
   * @param id ID du repas à supprimer
   */
  deleteMeal(id: number): Promise<OperationResult>;

  /**
   * Met à jour le statut favori d'un repas
   * @param id ID du repas
   * @param isFavorite Statut favori (true/false)
   */
  toggleMealFavorite(id: number, isFavorite: boolean): Promise<OperationResult>;
}

/**
 * Interface pour les filtres de plans
 */
export interface PlanFilters {
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * Interface pour le service de pages de plans
 */
export interface PlanPagesServiceInterface {
  /**
   * Récupère la liste des plans avec filtrage
   * @param filters Filtres à appliquer
   */
  getPlansList(filters: PlanFilters): Promise<OperationResult<{
    plans: any[];
    totalCount: number;
    pageInfo?: {
      currentPage: number;
      totalPages: number;
    }
  }>>;
  
  /**
   * Récupère les détails d'un plan
   * @param id ID du plan
   */
  getPlanDetails(id: number): Promise<OperationResult<{
    plan: any;
    dailyPlans: any[];
  }>>;
  
  /**
   * Supprime un plan
   * @param id ID du plan à supprimer
   */
  deletePlan(id: number): Promise<OperationResult>;
}

/**
 * Interface pour le service de pages de progression
 */
export interface ProgressPagesServiceInterface {
  /**
   * Récupère la progression quotidienne pour une date
   * @param date Date de la progression
   */
  getDailyProgress(date: string): Promise<OperationResult<{
    dailyProgress: DailyProgressOrmProps;
    mealsWithProgress: any[];
  }>>;
  
  /**
   * Récupère l'historique de progression
   * @param startDate Date de début
   * @param endDate Date de fin
   */
  getProgressHistory(startDate: string, endDate: string): Promise<OperationResult<{
    progressData: any[];
  }>>;
}

/**
 * Interface pour le service de pages d'utilisateur
 */
export interface UserPagesServiceInterface {
  /**
   * Récupère le profil d'un utilisateur
   * @param id ID de l'utilisateur
   */
  getUserProfile(id: number): Promise<OperationResult<{
    user: any;
    details: any;
    preferences: any;
  }>>;
  
  /**
   * Met à jour le profil d'un utilisateur
   * @param id ID de l'utilisateur
   * @param data Données à mettre à jour
   */
  updateUserProfile(id: number, data: any): Promise<OperationResult>;
  
  /**
   * Met à jour les préférences d'un utilisateur
   * @param id ID de l'utilisateur
   * @param data Préférences à mettre à jour
   */
  updateUserPreferences(id: number, data: any): Promise<OperationResult>;
}

/**
 * Interface pour le service de pages d'assistant
 */
export interface AssistantPagesServiceInterface {
  /**
   * Génère un repas basé sur des critères donnés
   * @param criteria Critères pour la génération de repas
   */
  generateMeal(criteria: IaMealType): Promise<OperationResult<{
    meal: any;
    ingredients: any[];
  }>>;
  
  /**
   * Génère un plan basé sur des critères donnés
   * @param criteria Critères pour la génération de plan
   */
  generatePlan(criteria: IaPlanType): Promise<OperationResult<{
    plan: any;
    dailyPlans: any[];
  }>>;
  
  /**
   * Génère une liste de courses pour un plan donné
   * @param planId ID du plan
   */
  generateShoppingList(planId: number): Promise<OperationResult<{
    shoppingList: any[];
  }>>;
}
