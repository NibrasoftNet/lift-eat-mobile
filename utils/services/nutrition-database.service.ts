import { eq } from 'drizzle-orm';
import { 
  meals, 
  mealIngredients, 
  ingredientsStandard,
  plan,
  dailyPlan,
  dailyPlanMeals,
  users
} from '@/db/schema';
import { 
  MealTypeEnum, 
  CuisineTypeEnum, 
  MealUnitEnum 
} from '@/utils/enum/meal.enum';
import { 
  PlanGeneratedWithEnum,
  DayEnum
} from '@/utils/enum/general.enum';
import { GoalEnum } from '@/utils/enum/user-details.enum';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

export class NutritionDatabaseService {
  private static instance: NutritionDatabaseService;
  private db: any; // Will be set when initialized

  private constructor() {}

  public static getInstance(): NutritionDatabaseService {
    if (!NutritionDatabaseService.instance) {
      NutritionDatabaseService.instance = new NutritionDatabaseService();
    }
    return NutritionDatabaseService.instance;
  }

  public initialize(drizzleDb: any) {
    this.db = drizzleDb;
  }

  /**
   * Parse the nutrition object from AI response
   */
  public parseNutrition(nutritionString: string): {
    name: string;
    type: MealTypeEnum;
    description: string;
    cuisine: CuisineTypeEnum;
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    ingredients?: Array<{
      name: string;
      quantity?: number;
      unit?: MealUnitEnum;
      calories?: number;
      carbs?: number;
      protein?: number;
      fat?: number;
    }>;
  } | null {
    try {
      // Try to parse JSON format
      if (nutritionString.includes('{') && nutritionString.includes('}')) {
        const jsonMatch = nutritionString.match(/\{[^]*\}/);
        if (jsonMatch) {
          const nutritionData = JSON.parse(jsonMatch[0]);
          return {
            name: nutritionData.name || '',
            type: this.parseMealType(nutritionData.type),
            description: nutritionData.description || '',
            cuisine: this.parseCuisineType(nutritionData.cuisine),
            calories: parseFloat(nutritionData.calories) || 0,
            carbs: parseFloat(nutritionData.carbs) || 0,
            protein: parseFloat(nutritionData.protein) || 0,
            fat: parseFloat(nutritionData.fat) || 0,
            ingredients: nutritionData.ingredients || []
          };
        }
      }

      // Fallback to regex parsing if JSON parsing fails
      const name = this.extractValue(nutritionString, 'name', '');
      const type = this.parseMealType(this.extractValue(nutritionString, 'type', 'breakfast'));
      const description = this.extractValue(nutritionString, 'description', '');
      const cuisine = this.parseCuisineType(this.extractValue(nutritionString, 'cuisine', 'general'));
      const calories = parseFloat(this.extractValue(nutritionString, 'calories', '0')) || 0;
      const carbs = parseFloat(this.extractValue(nutritionString, 'carbs', '0')) || 0;
      const protein = parseFloat(this.extractValue(nutritionString, 'protein', '0')) || 0;
      const fat = parseFloat(this.extractValue(nutritionString, 'fat', '0')) || 0;

      // Try to extract ingredients
      const ingredients = [];
      const ingredientsMatch = nutritionString.match(/ingredients\s*:\s*\[(.*?)\]/s);
      if (ingredientsMatch && ingredientsMatch[1]) {
        const ingredientsStr = ingredientsMatch[1];
        const ingredientMatches = ingredientsStr.match(/\{(.*?)\}/gs);
        if (ingredientMatches) {
          for (const match of ingredientMatches) {
            try {
              const ingredient = JSON.parse(match);
              ingredients.push(ingredient);
            } catch (e) {
              // Ignore parsing errors for individual ingredients
            }
          }
        }
      }

      return {
        name,
        type,
        description,
        cuisine,
        calories,
        carbs,
        protein,
        fat,
        ingredients: ingredients.length > 0 ? ingredients : undefined
      };
    } catch (error) {
      console.error('Failed to parse nutrition data:', error);
      return null;
    }
  }

  /**
   * Parse ingredient data from AI response
   */
  public parseIngredient(ingredientString: string): {
    name: string;
    unit: MealUnitEnum;
    quantity: number;
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
  } | null {
    try {
      // Try to parse JSON format
      if (ingredientString.includes('{') && ingredientString.includes('}')) {
        const jsonMatch = ingredientString.match(/\{[^]*\}/);
        if (jsonMatch) {
          const ingredientData = JSON.parse(jsonMatch[0]);
          return {
            name: ingredientData.name || '',
            unit: this.parseMealUnit(ingredientData.unit),
            quantity: parseFloat(ingredientData.quantity) || 100,
            calories: parseFloat(ingredientData.calories) || 0,
            carbs: parseFloat(ingredientData.carbs) || 0,
            protein: parseFloat(ingredientData.protein) || 0,
            fat: parseFloat(ingredientData.fat) || 0
          };
        }
      }

      // Fallback to regex parsing if JSON parsing fails
      const name = this.extractValue(ingredientString, 'name', '');
      const unit = this.parseMealUnit(this.extractValue(ingredientString, 'unit', 'grammes'));
      const quantity = parseFloat(this.extractValue(ingredientString, 'quantity', '100')) || 100;
      const calories = parseFloat(this.extractValue(ingredientString, 'calories', '0')) || 0;
      const carbs = parseFloat(this.extractValue(ingredientString, 'carbs', '0')) || 0;
      const protein = parseFloat(this.extractValue(ingredientString, 'protein', '0')) || 0;
      const fat = parseFloat(this.extractValue(ingredientString, 'fat', '0')) || 0;

      return {
        name,
        unit,
        quantity,
        calories,
        carbs,
        protein,
        fat
      };
    } catch (error) {
      console.error('Failed to parse ingredient data:', error);
      return null;
    }
  }

  private extractValue(text: string, key: string, defaultValue: string): string {
    const regex = new RegExp(`${key}[\\s]*[:=][\\s]*["']?([^,"'\\n]*)["']?`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : defaultValue;
  }

  private parseMealType(type: string): MealTypeEnum {
    type = type.toLowerCase();
    if (type.includes('breakfast')) return MealTypeEnum.BREAKFAST;
    if (type.includes('lunch')) return MealTypeEnum.LUNCH;
    if (type.includes('dinner')) return MealTypeEnum.DINNER;
    if (type.includes('snack')) return MealTypeEnum.SNACK;
    return MealTypeEnum.BREAKFAST;
  }

  private parseCuisineType(cuisine: string): CuisineTypeEnum {
    cuisine = cuisine.toLowerCase();
    if (cuisine.includes('italian')) return CuisineTypeEnum.ITALIAN;
    if (cuisine.includes('american')) return CuisineTypeEnum.AMERICAN;
    if (cuisine.includes('asian')) return CuisineTypeEnum.ASIAN;
    if (cuisine.includes('french')) return CuisineTypeEnum.FRENCH;
    if (cuisine.includes('indian')) return CuisineTypeEnum.INDIAN;
    if (cuisine.includes('japanese')) return CuisineTypeEnum.JAPANESE;
    if (cuisine.includes('mexican')) return CuisineTypeEnum.MEXICAN;
    if (cuisine.includes('chinese')) return CuisineTypeEnum.CHINESE;
    if (cuisine.includes('african')) return CuisineTypeEnum.AFRICAN;
    if (cuisine.includes('european')) return CuisineTypeEnum.EUROPEAN;
    if (cuisine.includes('caribbean')) return CuisineTypeEnum.CARIBBEAN;
    if (cuisine.includes('tunisian')) return CuisineTypeEnum.TUNISIAN;
    if (cuisine.includes('qatari')) return CuisineTypeEnum.QATARI;
    
    // Default cuisine type
    return CuisineTypeEnum.GENERAL;
  }

  private parseMealUnit(unit: string): MealUnitEnum {
    unit = unit.toLowerCase();
    if (unit.includes('gramme')) return MealUnitEnum.GRAMMES;
    if (unit.includes('kilogramme')) return MealUnitEnum.KILOGRAMMES;
    if (unit.includes('millilitre')) return MealUnitEnum.MILLILITRES;
    if (unit.includes('litre')) return MealUnitEnum.LITRES;
    if (unit.includes('piece')) return MealUnitEnum.PIECES;
    if (unit.includes('portion')) return MealUnitEnum.PORTION;
    if (unit.includes('cuillere') && unit.includes('soupe')) return MealUnitEnum.CUILLERES_A_SOUPE;
    if (unit.includes('cuillere') && unit.includes('cafe')) return MealUnitEnum.CUILLERES_A_CAFE;
    if (unit.includes('tasse')) return MealUnitEnum.TASSES;
    if (unit.includes('serving')) return MealUnitEnum.SERVING;
    if (unit.includes('plate')) return MealUnitEnum.PLATE;
    if (unit.includes('bowl')) return MealUnitEnum.BOWL;
    return MealUnitEnum.GRAMMES;
  }
}

export default NutritionDatabaseService.getInstance();
