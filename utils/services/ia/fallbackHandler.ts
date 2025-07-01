/**
 * Gestionnaire de fallback pour les réponses incorrectes de l'IA
 * Fournit des mécanismes pour gérer les cas où l'IA ne peut pas produire une réponse valide
 */
import { IaErrorHandler, IaErrorType, IaError } from './errorHandler';
import { createIaLogger } from './loggingEnhancer';
import { 
  IaIngredientType, 
  IaMealType,
  IaPlanType 
} from '@/utils/validation/ia/ia.schemas';
import { 
  MealTypeEnum, 
  CuisineTypeEnum, 
  MealUnitEnum 
} from '@/utils/enum/meal.enum';
import { GoalEnum } from '@/utils/enum/user-details.enum';

// Création d'un logger dédié
const logger = createIaLogger('Fallback');

/**
 * Types d'éléments qui peuvent nécessiter un fallback
 */
export enum FallbackType {
  INGREDIENT = 'INGREDIENT',
  MEAL = 'MEAL',
  PLAN = 'PLAN',
  GENERAL_RESPONSE = 'GENERAL_RESPONSE'
}

/**
 * Contexte fourni pour la création d'un fallback
 */
interface FallbackContext {
  originalQuery?: string;      // Requête originale de l'utilisateur
  originalError?: any;         // Erreur qui a déclenché le fallback
  partialData?: any;           // Données partielles qui peuvent être utilisées
  userPreferences?: any;       // Préférences utilisateur à prendre en compte
  mealType?: MealTypeEnum;     // Type de repas demandé (pour le fallback de repas)
  cuisineType?: CuisineTypeEnum; // Type de cuisine demandé (pour le fallback de repas)
  goal?: GoalEnum;             // Objectif nutritionnel (pour le fallback de plan)
  ingredientName?: string;     // Nom d'ingrédient (pour le fallback d'ingrédient)
}

/**
 * Gère les fallbacks pour les réponses incorrectes de l'IA
 */
export class FallbackHandler {
  /**
   * Génère un ingrédient de fallback
   * @param context Contexte pour le fallback
   * @returns Ingrédient par défaut
   */
  static generateIngredientFallback(context: FallbackContext): IaIngredientType {
    logger.info('Génération d\'un ingrédient de fallback', 'generateIngredientFallback', { context });
    
    // Utiliser le nom fourni ou un nom par défaut
    const name = context.ingredientName || "Ingrédient par défaut";
    
    // Créer un ingrédient minimal mais valide
    const fallbackIngredient: IaIngredientType = {
      name,
      unit: MealUnitEnum.GRAMMES,
      quantity: 100,
      calories: 100,
      carbs: 10,
      protein: 5,
      fat: 5
    };
    
    logger.debug('Ingrédient de fallback généré', 'generateIngredientFallback', { ingredient: fallbackIngredient });
    
    return fallbackIngredient;
  }
  
  /**
   * Génère un repas de fallback
   * @param context Contexte pour le fallback
   * @returns Repas par défaut
   */
  static generateMealFallback(context: FallbackContext): IaMealType {
    logger.info('Génération d\'un repas de fallback', 'generateMealFallback', { context });
    
    // Utiliser le type de repas fourni ou un type par défaut
    const mealType = context.mealType || MealTypeEnum.BREAKFAST;
    
    // Déterminer un nom approprié selon le type de repas
    let name = "Repas par défaut";
    let description = "Repas généré automatiquement en l'absence de réponse valide de l'IA.";
    
    switch(mealType) {
      case MealTypeEnum.BREAKFAST:
        name = "Petit-déjeuner équilibré";
        description = "Un petit-déjeuner complet avec un bon équilibre de macronutriments.";
        break;
      case MealTypeEnum.LUNCH:
        name = "Déjeuner équilibré";
        description = "Un déjeuner complet avec un bon équilibre de macronutriments.";
        break;
      case MealTypeEnum.DINNER:
        name = "Dîner équilibré";
        description = "Un dîner léger mais nutritif avec un bon équilibre de macronutriments.";
        break;
      case MealTypeEnum.SNACK:
        name = "Collation équilibrée";
        description = "Une collation nutritive pour combler les petites faims.";
        break;
    }
    
    // Créer un repas minimal mais valide
    const fallbackMeal: IaMealType = {
      name,
      type: mealType,
      description,
      instructions: "Combinez tous les ingrédients et préparez selon vos préférences.", 
      cuisine: context.cuisineType || CuisineTypeEnum.GENERAL,
      calories: 500,
      carbs: 50,
      protein: 30,
      fat: 20,
      unit: MealUnitEnum.GRAMMES,
      quantity: 1,
      ingredients: [
        // Ajouter quelques ingrédients de base
        {
          name: "Protéine de base",
          unit: MealUnitEnum.GRAMMES,
          quantity: 150,
          calories: 250,
          carbs: 0,
          protein: 25,
          fat: 15
        },
        {
          name: "Accompagnement",
          unit: MealUnitEnum.GRAMMES,
          quantity: 200,
          calories: 200,
          carbs: 40,
          protein: 5,
          fat: 2
        },
        {
          name: "Légumes variés",
          unit: MealUnitEnum.GRAMMES,
          quantity: 150,
          calories: 50,
          carbs: 10,
          protein: 2,
          fat: 1
        }
      ]
    };
    
    logger.debug('Repas de fallback généré', 'generateMealFallback', { meal: fallbackMeal });
    
    return fallbackMeal;
  }
  
  /**
   * Génère un plan nutritionnel de fallback
   * @param context Contexte pour le fallback
   * @returns Plan nutritionnel par défaut
   */
  static generatePlanFallback(context: FallbackContext): IaPlanType {
    logger.info('Génération d\'un plan nutritionnel de fallback', 'generatePlanFallback', { context });
    
    // Utiliser l'objectif fourni ou un objectif par défaut
    const goal = context.goal || GoalEnum.MAINTAIN;
    
    // Déterminer les valeurs nutritionnelles cibles en fonction de l'objectif
    let targetCalories = 2000;
    let targetCarbs = 50;    // pourcentage
    let targetProtein = 25;   // pourcentage
    let targetFat = 25;      // pourcentage
    let planName = "Plan nutritionnel par défaut";
    
    switch(goal) {
      case GoalEnum.GAIN_MUSCLE:
        targetCalories = 2500;
        targetCarbs = 40;
        targetProtein = 40;
        targetFat = 20;
        planName = "Plan de prise de masse musculaire";
        break;
      case GoalEnum.WEIGHT_LOSS:
        targetCalories = 1800;
        targetCarbs = 40;
        targetProtein = 35;
        targetFat = 25;
        planName = "Plan de perte de poids";
        break;
      case GoalEnum.MAINTAIN:
      default:
        planName = "Plan d'équilibre nutritionnel";
        break;
    }
    
    // Créer un plan minimal mais valide avec 3 repas
    const fallbackPlan: IaPlanType = {
      name: planName,
      goal,
      calories: targetCalories,
      carbs: targetCarbs,
      protein: targetProtein,
      fat: targetFat,
      meals: [
        // Petit déjeuner
        {
          name: "Petit-déjeuner équilibré",
          type: MealTypeEnum.BREAKFAST,
          description: "Un petit-déjeuner nutritif pour bien commencer la journée.",
          instructions: "Préparez les ingrédients selon vos préférences.", 
          cuisine: CuisineTypeEnum.GENERAL,
          calories: Math.round(targetCalories * 0.25),
          carbs: targetCarbs,
          protein: targetProtein,
          fat: targetFat,
          unit: MealUnitEnum.GRAMMES,
          quantity: 1,
          ingredients: []
        },
        // Déjeuner
        {
          name: "Déjeuner équilibré",
          type: MealTypeEnum.LUNCH,
          description: "Un déjeuner complet pour tenir toute la journée.",
          instructions: "Préparez les ingrédients selon vos préférences.", 
          cuisine: CuisineTypeEnum.GENERAL,
          calories: Math.round(targetCalories * 0.40),
          carbs: targetCarbs,
          protein: targetProtein,
          fat: targetFat,
          unit: MealUnitEnum.GRAMMES,
          quantity: 1,
          ingredients: []
        },
        // Dîner
        {
          name: "Dîner équilibré",
          type: MealTypeEnum.DINNER,
          description: "Un dîner léger mais nutritif.",
          instructions: "Préparez les ingrédients selon vos préférences.", 
          cuisine: CuisineTypeEnum.GENERAL,
          calories: Math.round(targetCalories * 0.35),
          carbs: targetCarbs,
          protein: targetProtein,
          fat: targetFat,
          unit: MealUnitEnum.GRAMMES,
          quantity: 1,
          ingredients: []
        }
      ]
    };
    
    logger.debug('Plan nutritionnel de fallback généré', 'generatePlanFallback', { plan: fallbackPlan });
    
    return fallbackPlan;
  }
  
  /**
   * Génère une réponse textuelle de fallback
   * @param context Contexte pour le fallback
   * @returns Réponse textuelle par défaut
   */
  static generateTextResponseFallback(context: FallbackContext): string {
    logger.info('Génération d\'une réponse textuelle de fallback', 'generateTextResponseFallback', { context });
    
    let fallbackResponse = "Je n'ai pas pu générer une réponse complète. Voici quelques informations générales qui pourraient vous être utiles.";
    
    // Adapter la réponse en fonction du contexte si disponible
    if (context.originalQuery) {
      const query = context.originalQuery.toLowerCase();
      
      if (query.includes("repas") || query.includes("meal")) {
        fallbackResponse = "Je n'ai pas pu générer un repas complet. Pour créer un repas équilibré, essayez d'inclure une protéine, des glucides complexes et des légumes. Par exemple, du poulet grillé avec du riz complet et des légumes sautés.";
      } else if (query.includes("plan") || query.includes("régime") || query.includes("diet")) {
        fallbackResponse = "Je n'ai pas pu générer un plan nutritionnel complet. Un bon plan nutritionnel devrait inclure 3-4 repas équilibrés par jour, avec un bon équilibre de protéines, glucides et lipides.";
      } else if (query.includes("ingrédient") || query.includes("ingredient")) {
        fallbackResponse = "Je n'ai pas pu trouver les informations complètes sur cet ingrédient. Essayez de consulter une base de données nutritionnelle comme OpenFoodFacts pour des informations détaillées.";
      }
    }
    
    // Ajouter un message d'excuse et une suggestion d'action
    fallbackResponse += "\n\nJe m'excuse pour ce problème. Vous pouvez essayer de reformuler votre demande ou d'être plus spécifique pour obtenir de meilleurs résultats.";
    
    logger.debug('Réponse textuelle de fallback générée', 'generateTextResponseFallback', { response: fallbackResponse });
    
    return fallbackResponse;
  }
  
  /**
   * Détermine si un fallback est nécessaire et génère le fallback approprié
   * @param type Type d'élément nécessitant un fallback
   * @param context Contexte pour le fallback
   * @returns Données de fallback du type approprié
   */
  static getFallback(type: FallbackType, context: FallbackContext = {}): any {
    logger.beginOperation('getFallback');
    
    try {
      // Choisir le type de fallback approprié
      switch (type) {
        case FallbackType.INGREDIENT:
          const ingredientFallback = this.generateIngredientFallback(context);
          logger.endOperation('getFallback', 'getFallback', 'success', { type, fallbackProvided: true });
          return ingredientFallback;
          
        case FallbackType.MEAL:
          const mealFallback = this.generateMealFallback(context);
          logger.endOperation('getFallback', 'getFallback', 'success', { type, fallbackProvided: true });
          return mealFallback;
          
        case FallbackType.PLAN:
          const planFallback = this.generatePlanFallback(context);
          logger.endOperation('getFallback', 'getFallback', 'success', { type, fallbackProvided: true });
          return planFallback;
          
        case FallbackType.GENERAL_RESPONSE:
          const textFallback = this.generateTextResponseFallback(context);
          logger.endOperation('getFallback', 'getFallback', 'success', { type, fallbackProvided: true });
          return textFallback;
          
        default:
          logger.warn(`Type de fallback non supporté: ${type}`, 'getFallback');
          logger.endOperation('getFallback', 'getFallback', 'warning', { type, fallbackProvided: false });
          return null;
      }
    } catch (error) {
      // En cas d'erreur lors de la génération du fallback, retourner une réponse très simple
      logger.error(`Erreur lors de la génération du fallback: ${error instanceof Error ? error.message : String(error)}`, 'getFallback', error);
      logger.endOperation('getFallback', 'getFallback', 'failure', { type, fallbackProvided: false });
      
      if (type === FallbackType.GENERAL_RESPONSE) {
        return "Je ne peux pas générer une réponse pour le moment. Veuillez réessayer plus tard.";
      }
      
      throw IaErrorHandler.fromError(
        error, 
        "Échec de la génération du fallback", 
        IaErrorType.BUSINESS_LOGIC_ERROR
      );
    }
  }
}

// Exportation d'un singleton pour faciliter l'accès
export const fallbackHandler = FallbackHandler;
