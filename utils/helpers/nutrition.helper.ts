/**
 * Valide et ajuste les valeurs nutritionnelles
 */

const MAX_CALORIES = 10000; // Maximum de calories par repas
const MAX_MACROS = 1000; // Maximum de grammes par macro
const MIN_WEIGHT = 0.01; // Poids minimum en grammes

/**
 * Vérifie si une valeur nutritionnelle est valide
 */
export const isValidNutritionalValue = (value: number): boolean => {
  return typeof value === 'number' && value >= 0 && !isNaN(value) && isFinite(value);
};

/**
 * Vérifie si un poids est valide
 */
export const isValidWeight = (weight: number): boolean => {
  return isValidNutritionalValue(weight) && weight >= MIN_WEIGHT;
};

/**
 * Vérifie si les calories sont dans une plage valide
 */
export const isValidCalories = (calories: number): boolean => {
  return isValidNutritionalValue(calories) && calories <= MAX_CALORIES;
};

/**
 * Vérifie si une valeur de macronutriment est valide
 */
export const isValidMacro = (value: number): boolean => {
  return isValidNutritionalValue(value) && value <= MAX_MACROS;
};

import { MealOrmProps } from '../../db/schema';

/**
 * Calcule les macros totaux d'une liste de repas
 */
export const calculateTotalMacros = (meals: MealOrmProps[]) => {
  try {
    const totals = meals.reduce(
      (acc, meal) => ({
        calories: acc.calories + (meal.calories || 0),
        carbs: acc.carbs + (meal.carbs || 0),
        fat: acc.fat + (meal.fat || 0),
        protein: acc.protein + (meal.protein || 0),
      }),
      { calories: 0, carbs: 0, fat: 0, protein: 0 },
    );

    // Recalculer les calories à partir des macros pour assurer la cohérence
    const calculatedCalories =
      totals.carbs * 4 + totals.fat * 9 + totals.protein * 4;

    return {
      calories: Math.round(calculatedCalories), // Utiliser les calories calculées
      carbs: Math.round(totals.carbs),
      fat: Math.round(totals.fat),
      protein: Math.round(totals.protein),
    };
  } catch (error) {
    console.error('Erreur dans calculateTotalMacros:', error);
    return { calories: 0, carbs: 0, fat: 0, protein: 0 };
  }
};

/**
 * Valide les valeurs nutritionnelles
 */
export const validateNutritionalValues = (
  calories: number,
  carbs: number,
  fat: number,
  protein: number,
) => {
  // Vérifier que les valeurs sont positives
  if (calories < 0 || carbs < 0 || fat < 0 || protein < 0) {
    return false;
  }

  // Calculer les calories à partir des macros
  const calculatedCalories = carbs * 4 + fat * 9 + protein * 4;
  
  // Permettre une marge d'erreur de 5% pour les arrondis
  const margin = calories * 0.05;
  return Math.abs(calculatedCalories - calories) <= margin;
};

/**
 * Calcule les macros à partir d'un poids
 */
export const calculateMacrosFromWeight = (
  baseWeight: number,
  newWeight: number,
  baseMacros: { calories: number; carbs: number; fat: number; protein: number },
) => {
  if (baseWeight <= 0 || newWeight <= 0) {
    throw new Error('Les poids doivent être positifs');
  }

  const ratio = newWeight / baseWeight;
  return {
    calories: Math.round(baseMacros.calories * ratio),
    carbs: Math.round(baseMacros.carbs * ratio),
    fat: Math.round(baseMacros.fat * ratio),
    protein: Math.round(baseMacros.protein * ratio),
  };
};

/**
 * Calcule les macros proportionnellement à une quantité
 */
export const calculateProportionalMacros = (
  standardQuantity: number,
  standardMacros: { calories: number; carbs: number; fat: number; protein: number },
  newQuantity: number,
) => {
  // Vérification des entrées
  if (!isValidWeight(standardQuantity) || !isValidWeight(newQuantity)) {
    throw new Error('Quantités invalides');
  }

  // Calcul du facteur de proportion
  const factor = newQuantity / standardQuantity;

  // Calcul et validation des nouvelles valeurs
  const newCalories = Math.round(standardMacros.calories * factor);
  const newCarbs = Math.round(standardMacros.carbs * factor);
  const newFat = Math.round(standardMacros.fat * factor);
  const newProtein = Math.round(standardMacros.protein * factor);

  // Vérification des résultats
  if (!isValidCalories(newCalories)) {
    throw new Error('Calories calculées invalides');
  }
  if (!isValidMacro(newCarbs) || !isValidMacro(newFat) || !isValidMacro(newProtein)) {
    throw new Error('Macronutriments calculés invalides');
  }

  return {
    calories: newCalories,
    carbs: newCarbs,
    fat: newFat,
    protein: newProtein,
  };
};

// Utilisation d'un cache pour éviter les calculs redondants
type AdjustmentKey = string;
type AdjustmentValue = { calories: number; carbs: number; fat: number; protein: number };
const macroAdjustmentCache = new Map<AdjustmentKey, AdjustmentValue>();

// Configuration des logs
const IS_DEV = process.env.NODE_ENV === 'development';
const ENABLE_DETAILED_LOGS = false; // Mettre à true uniquement pour le débogage

// Utilitaire pour les logs conditionnels
const logNutrition = (message: string, data?: any) => {
  if (IS_DEV && ENABLE_DETAILED_LOGS) {
    if (data) {
      console.log(message, data);
    } else {
      console.log(message);
    }
  }
};

/**
 * Ajuste les macros en fonction du poids final du repas
 */
export const adjustMacrosByFinalWeight = (
  macros: { calories: number; carbs: number; fat: number; protein: number },
  totalIngredientsWeight: number,
  finalMealWeight: number,
) => {
  logNutrition('[NUTRITION] === AJUSTEMENT MACROS ===');
  logNutrition(`[NUTRITION] Poids total des ingrédients: ${totalIngredientsWeight}g`);
  logNutrition(`[NUTRITION] Poids final demandé: ${finalMealWeight}g`);
  logNutrition('[NUTRITION] Macros originales:', macros);
  
  // Vérifier si le résultat est déjà en cache
  const cacheKey = `${macros.calories}-${macros.carbs}-${macros.fat}-${macros.protein}-${totalIngredientsWeight}-${finalMealWeight}`;
  if (macroAdjustmentCache.has(cacheKey)) {
    logNutrition('[NUTRITION] Utilisation du cache pour l\'ajustement');
    return macroAdjustmentCache.get(cacheKey)!;
  }
  // Cas spécial: si l'un des poids est nul ou trop faible, retourner des macros à zéro
  // Cela évite l'erreur "Poids invalide" lors de la création d'un nouveau repas sans ingrédients
  if (totalIngredientsWeight < MIN_WEIGHT || finalMealWeight < MIN_WEIGHT) {
    return {
      calories: 0,
      carbs: 0,
      fat: 0,
      protein: 0
    };
  }

  try {
    // Calcul du facteur de proportion pour ajuster à finalMealWeight
    // Si totalIngredientsWeight = 300g et finalMealWeight = 100g,
    // le facteur = 0.33 (ce qui signifie qu'on prend 1/3 des macros originales)
    const adjustmentFactor = finalMealWeight / totalIngredientsWeight;
    logNutrition(`[NUTRITION] Facteur d'ajustement: ${adjustmentFactor.toFixed(3)}`);

    // Ajustement et arrondissement des valeurs
    const adjustedMacros = {
      calories: Math.round(macros.calories * adjustmentFactor),
      carbs: Math.round(macros.carbs * adjustmentFactor),
      fat: Math.round(macros.fat * adjustmentFactor),
      protein: Math.round(macros.protein * adjustmentFactor),
    };
    logNutrition('[NUTRITION] Macros ajustées:', adjustedMacros);
    
    // Stocker dans le cache pour éviter les calculs futurs
    const cacheKey = `${macros.calories}-${macros.carbs}-${macros.fat}-${macros.protein}-${totalIngredientsWeight}-${finalMealWeight}`;
    macroAdjustmentCache.set(cacheKey, adjustedMacros);

    // Vérification des résultats
    if (!isValidCalories(adjustedMacros.calories)) {
      return macros; // Retourner les macros originales si les calories ajustées sont invalides
    }
    if (!isValidMacro(adjustedMacros.carbs) || !isValidMacro(adjustedMacros.fat) || !isValidMacro(adjustedMacros.protein)) {
      return macros; // Retourner les macros originales si les macros ajustées sont invalides
    }

    logNutrition('[NUTRITION] === FIN AJUSTEMENT ===');
    return adjustedMacros;
  } catch (error) {
    console.error("Erreur lors de l'ajustement des macros:", error);
    logNutrition('[NUTRITION] Retour aux macros originales suite à erreur');
    return macros; // En cas d'erreur, retourner les macros originales
  }
};
