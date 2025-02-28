import { Ingredient } from './plan.type';
import { AllergenType, CookingMethod, CuisineType, MeasurementUnit, RecipeDifficulty, SpiceLevel } from '@/utils/enum/food.enum';

export type FoodCategory = 'PROTEIN' | 'CARBS' | 'FATS';

export interface Food extends Omit<Ingredient, 'quantity'> {
    category: FoodCategory;
    portion: number;
    image?: any;
    cuisineType?: CuisineType;
    allergens?: AllergenType[];
    cookingMethod?: CookingMethod;
    measurementUnit: MeasurementUnit;
    difficulty?: RecipeDifficulty;
    spiceLevel?: SpiceLevel;
}
