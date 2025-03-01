import { MeasurementUnit, FoodCategory } from '../utils/enum/food.enum';

export interface Food {
    id: string;
    name: string;
    description?: string;
    category: FoodCategory;
    
    // Informations nutritionnelles (pour 100g/ml)
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    
    // Informations de mesure
    servingSize: number;
    portion: number;      // Taille de la portion standard
    unit: MeasurementUnit;
    
    // Métadonnées
    brand?: string;
    barcode?: string;
    imageUrl?: string;
    image?: any;  // Pour l'image uploadée
    
    // Informations additionnelles
    ingredients?: string[];
    allergens?: string[];
    
    // Valeurs nutritionnelles détaillées (optionnelles)
    fiber?: number;
    sugar?: number;
    saturatedFats?: number;
    unsaturatedFats?: number;
    sodium?: number;
    
    // Traçabilité
    createdAt: Date;
    updatedAt: Date;
    verified: boolean;
}

export interface CreateFoodDTO {
    name: string;
    description?: string;
    category: FoodCategory;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    servingSize: number;
    portion: number;
    unit: MeasurementUnit;
    brand?: string;
    barcode?: string;
    imageUrl?: string;
    image?: any;
    ingredients?: string[];
    allergens?: string[];
}

export interface UpdateFoodDTO extends Partial<CreateFoodDTO> {
    id: string;
}

export interface FoodSearchParams {
    query?: string;
    category?: FoodCategory;
    barcode?: string;
    brand?: string;
    maxCalories?: number;
    verified?: boolean;
    page?: number;
    limit?: number;
    sortBy?: 'name' | 'calories' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}
