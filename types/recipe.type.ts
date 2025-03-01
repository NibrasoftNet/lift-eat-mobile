import { Food } from './food.type';
import { CuisineType, DifficultyLevel, MeasurementUnit } from '../utils/enum/food.enum';
import { ImageSourcePropType } from 'react-native';

export interface Recipe {
    id: string;
    name: string;
    description?: string;
    prepTime: number;      // en minutes
    cookTime: number;      // en minutes
    servings: number;
    difficulty: DifficultyLevel;
    cuisineType: CuisineType;
    
    // Informations nutritionnelles (par portion)
    calories: number;
    protein: number;
    carbs: number;
    fats: number;

    // Ingrédients avec leurs quantités
    ingredients: RecipeIngredient[];
    
    // Instructions étape par étape
    instructions: string[];
    
    // Métadonnées
    tags?: string[];
    imageUrl?: ImageSourcePropType;
    rating?: number;       // Note moyenne sur 5
    reviews?: RecipeReview[];
    
    // Informations sur la création/modification
    createdAt: Date;
    updatedAt: Date;
    authorId: string;
}

export interface RecipeIngredient {
    id: string;
    food: Food;
    quantity: number;
    unit: MeasurementUnit;
    optional?: boolean;
    notes?: string;
}

export interface RecipeReview {
    id: string;
    userId: string;
    rating: number;        // Note sur 5
    comment?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Types pour la création/modification de recettes
export interface CreateRecipeDTO {
    name: string;
    description?: string;
    prepTime: number;
    cookTime: number;
    servings: number;
    difficulty: DifficultyLevel;
    cuisineType: CuisineType;
    ingredients: {
        foodId: string;
        quantity: number;
        unit: MeasurementUnit;
        optional?: boolean;
        notes?: string;
    }[];
    instructions: string[];
    tags?: string[];
    imageUrl?: ImageSourcePropType;
}

export interface UpdateRecipeDTO extends Partial<CreateRecipeDTO> {
    id: string;
}

// Types pour les filtres et la recherche
export interface RecipeFilters {
    cuisineType?: CuisineType;
    difficulty?: DifficultyLevel;
    maxPrepTime?: number;
    maxCalories?: number;
    tags?: string[];
    ingredients?: string[]; // IDs des ingrédients requis
}

export interface RecipeSearchParams extends RecipeFilters {
    query?: string;
    page?: number;
    limit?: number;
    sortBy?: 'rating' | 'prepTime' | 'calories' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}
