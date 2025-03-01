import { GoalEnum } from "../utils/enum/user-details.enum";
import { DayEnum } from "../utils/enum/general.enum";
import { CuisineType, MeasurementUnit } from "../utils/enum/food.enum";
import { Food } from "./food.type";

export interface MealIngredient {
    id: string;
    food: Food;           // Référence à l'aliment
    quantity: number;
    unit: MeasurementUnit;
    notes?: string;
    name: string;         // Nom de l'aliment (copié de food.name)
    calories: number;     // Calories calculées pour la quantité
    protein: number;      // Protéines calculées pour la quantité
    carbs: number;        // Glucides calculés pour la quantité
    fats: number;         // Lipides calculés pour la quantité
}

export interface Meal {
    id: string;
    name: string;
    description?: string;
    
    // Informations nutritionnelles (par portion)
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    
    // Détails du repas
    cuisineType: CuisineType;
    servings: number;
    prepTime?: number;      // en minutes
    ingredients: MealIngredient[];
    
    // Métadonnées
    imageUrl?: string;
    tags?: string[];
    notes?: string;
    
    // Traçabilité
    createdAt: Date;
    updatedAt: Date;
    authorId: string;
}

export interface PlanMeal extends Meal {
    quantity: number;
    unit: string;
}

export interface DailyPlan {
    id: string;
    day: DayEnum;
    week: number;
    
    // Repas planifiés
    meals: PlanMeal[];
    
    // Valeurs cibles quotidiennes
    targetCalories: number;
    targetProtein: number;
    targetCarbs: number;
    targetFats: number;
    
    // Progression réelle
    actualCalories?: number;
    actualProtein?: number;
    actualCarbs?: number;
    actualFats?: number;
    
    // Métadonnées
    notes?: string;
    completed: boolean;
    
    // Traçabilité
    createdAt: Date;
    updatedAt: Date;
}

export interface NutritionPlan {
    id: string;
    name: string;
    description?: string;
    
    // Objectifs
    goal: GoalEnum;
    initialWeight: number;
    targetWeight: number;
    durationWeeks: number;
    
    // Objectifs nutritionnels quotidiens
    targetCalories: number;
    targetProtein: number;
    targetCarbs: number;
    targetFats: number;
    
    // Configuration
    unit: 'kg' | 'lbs';
    isPublic: boolean;
    
    // Planning
    dailyPlans: DailyPlan[];
    
    // Métadonnées
    tags?: string[];
    notes?: string;
    
    // Traçabilité
    createdAt: Date;
    updatedAt: Date;
    authorId: string;
    
    // Propriétés calculées basées sur les repas du plan
    calories?: number;
    protein?: number;
    carbs?: number;
    fats?: number;
}

export interface DailyIntake {
    id: string;
    date: Date;
    
    // Consommation réelle
    actualCalories: number;
    actualProtein: number;
    actualCarbs: number;
    actualFats: number;
    
    // Repas consommés
    meals: Meal[];
    
    // Métadonnées
    notes?: string;
    
    // Traçabilité
    createdAt: Date;
    updatedAt: Date;
    userId: string;
}

// DTOs pour la création et la mise à jour
export interface CreateMealDTO {
    name: string;
    description?: string;
    cuisineType: CuisineType;
    servings: number;
    prepTime?: number;
    ingredients: {
        foodId: string;
        quantity: number;
        unit: MeasurementUnit;
        notes?: string;
    }[];
    imageUrl?: string;
    tags?: string[];
    notes?: string;
}

export interface UpdateMealDTO extends Partial<CreateMealDTO> {
    id: string;
}

export interface CreateDailyPlanDTO {
    day: DayEnum;
    week: number;
    targetCalories: number;
    targetProtein: number;
    targetCarbs: number;
    targetFats: number;
    mealIds: string[];
    notes?: string;
}

export interface UpdateDailyPlanDTO extends Partial<CreateDailyPlanDTO> {
    id: string;
}

export interface CreateNutritionPlanDTO {
    name: string;
    description?: string;
    goal: GoalEnum;
    initialWeight: number;
    targetWeight: number;
    durationWeeks: number;
    targetCalories: number;
    targetProtein: number;
    targetCarbs: number;
    targetFats: number;
    unit: 'kg' | 'lbs';
    isPublic: boolean;
    tags?: string[];
    notes?: string;
}

export interface UpdateNutritionPlanDTO extends Partial<CreateNutritionPlanDTO> {
    id: string;
}