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
import { logger } from '@/utils/services/common/logging.service';
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
    unit: MealUnitEnum;
    ingredients: string[];
  } | null {
    try {
      // Remove any backticks if the string is a code block
      nutritionString = nutritionString.replace(/```json/g, '').replace(/```/g, '');
      
      // Parse the JSON string
      const parsed = JSON.parse(nutritionString);
      
      // Map MealTypeEnum and CuisineTypeEnum using string values
      if (parsed.type && typeof parsed.type === 'string') {
        parsed.type = this.mapStringToMealType(parsed.type);
      }
      
      if (parsed.cuisine && typeof parsed.cuisine === 'string') {
        parsed.cuisine = this.mapStringToCuisineType(parsed.cuisine);
      }
      
      // Ensure unit is set correctly
      if (!parsed.unit || typeof parsed.unit !== 'string') {
        parsed.unit = MealUnitEnum.GRAMMES;
      } else {
        parsed.unit = this.mapStringToMealUnit(parsed.unit);
      }
      
      // Validate and convert numeric values
      parsed.calories = this.parseNumericValue(parsed.calories);
      parsed.carbs = this.parseNumericValue(parsed.carbs);
      parsed.protein = this.parseNumericValue(parsed.protein);
      parsed.fat = this.parseNumericValue(parsed.fat);
      
      // Ensure ingredients is an array
      if (!Array.isArray(parsed.ingredients)) {
        parsed.ingredients = [];
      }
      
      return parsed;
    } catch (error) {
      logger.error(LogCategory.IA, 'Failed to parse nutrition from AI response', { error, nutritionString });
      return null;
    }
  }
  
  /**
   * Parse a value to ensure it's a positive number
   */
  private parseNumericValue(value: any): number {
    const parsed = parseFloat(value);
    return !isNaN(parsed) && parsed >= 0 ? parsed : 0;
  }
  
  /**
   * Map a string to MealTypeEnum
   */
  private mapStringToMealType(type: string): MealTypeEnum {
    type = type.toLowerCase();
    
    if (type.includes('breakfast')) return MealTypeEnum.BREAKFAST;
    if (type.includes('lunch')) return MealTypeEnum.LUNCH;
    if (type.includes('dinner')) return MealTypeEnum.DINNER;
    if (type.includes('snack')) return MealTypeEnum.SNACK;
    
    // Par défaut, retourner SNACK au lieu de OTHER qui n'existe pas
    return MealTypeEnum.SNACK;
  }
  
  /**
   * Map a string to CuisineTypeEnum
   */
  private mapStringToCuisineType(cuisine: string): CuisineTypeEnum {
    cuisine = cuisine.toLowerCase();
    
    if (cuisine.includes('italian')) return CuisineTypeEnum.ITALIAN;
    if (cuisine.includes('french')) return CuisineTypeEnum.FRENCH;
    if (cuisine.includes('mexican')) return CuisineTypeEnum.MEXICAN;
    if (cuisine.includes('chinese')) return CuisineTypeEnum.CHINESE;
    if (cuisine.includes('indian')) return CuisineTypeEnum.INDIAN;
    if (cuisine.includes('japanese')) return CuisineTypeEnum.JAPANESE;
    if (cuisine.includes('american')) return CuisineTypeEnum.AMERICAN;
    
    // Par défaut, retourner GENERAL au lieu de OTHER qui n'existe pas
    return CuisineTypeEnum.GENERAL;
  }
  
  /**
   * Map a string to MealUnitEnum
   */
  private mapStringToMealUnit(unit: string): MealUnitEnum {
    unit = unit.toLowerCase();
    
    if (unit.includes('gram') || unit.includes('g')) return MealUnitEnum.GRAMMES;
    if (unit.includes('milliliter') || unit.includes('ml')) return MealUnitEnum.MILLILITRES;
    if (unit.includes('piece') || unit.includes('pc')) return MealUnitEnum.PIECES;
    if (unit.includes('serving') || unit.includes('serv')) return MealUnitEnum.SERVING;
    
    return MealUnitEnum.GRAMMES; // Default to gram
  }
  
  /**
   * Get standard ingredients from the database
   */
  public async getIngredients(search: string = '', limit: number = 20): Promise<any[] | null> {
    try {
      if (!this.db) return null;
      
      let results: any[] = [];
      
      // Simplification pour éviter les problèmes de typage avec la requête drizzle
      if (search && search.trim().length > 0) {
        const searchTerm = `%${search.toLowerCase()}%`;
        // Utiliser l'API MCP server pour la recherche
        const response = await sqliteMCPServer.getIngredientsListViaMCP(searchTerm, limit);
        if (response && response.success) {
          // On traite response comme un objet générique pour éviter les erreurs de typage
          results = (response as any).ingredients || [];
        }
      } else {
        // Utiliser l'API MCP server pour la liste complète
        const response = await sqliteMCPServer.getIngredientsListViaMCP('', limit);
        if (response && response.success) {
          // On traite response comme un objet générique pour éviter les erreurs de typage
          results = (response as any).ingredients || [];
        }
      }
      
      return results;
    } catch (error) {
      logger.error(LogCategory.DATABASE, 'Failed to get ingredients', { error, search, limit });
      return null;
    }
  }
  
  /**
   * Add a standard ingredient to the database
   */
  public async addIngredient(ingredientData: any): Promise<number | null> {
    try {
      if (!this.db) return null;
      
      const result = await sqliteMCPServer.addIngredientViaMCP(ingredientData);
      
      // Vérification simplifiée du résultat sans accéder à des propriétés spécifiques
      if (result && result.success && typeof result === 'object') {
        const responseData = result as any;
        // Essayer plusieurs chemins possibles pour l'ID
        if (responseData.id) return responseData.id;
        if (responseData.data && responseData.data.id) return responseData.data.id;
        if (responseData.ingredientId) return responseData.ingredientId;
      }
      
      return null;
    } catch (error) {
      logger.error(LogCategory.DATABASE, 'Failed to add ingredient', { error, ingredientData });
      return null;
    }
  }
}

export default NutritionDatabaseService.getInstance();
