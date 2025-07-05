import { create } from 'zustand';
import { produce } from 'immer';
import { IngredientStandardOrmProps } from '../../db/schema';
import { IngredientWithStandardProps } from '@/types/ingredient.type';
import { TotalMacrosProps } from '@/types/meal.type';
import {
  adjustMacrosByFinalWeight,
  isValidWeight,
} from '@/utils/helpers/nutrition.helper';

// Configuration des logs (active seulement en développement)
const IS_DEV = process.env.NODE_ENV === 'development';
const ENABLE_DETAILED_LOGS = false; // Mettre à true uniquement pour le débogage

// Utilitaire pour les logs conditionnels
const conditionalLog = (message: string, data?: any) => {
  if (IS_DEV && ENABLE_DETAILED_LOGS) {
    if (data) {
      console.log(message, data);
    } else {
      console.log(message);
    }
  }
};

// Cache pour les résultats de calcul
type MacroCache = {
  key: string;
  result: { calories: number; carbs: number; fat: number; protein: number };
};
let macroCalculationCache: MacroCache | null = null;

// Fonction utilitaire pour calculer les macros totaux pour les ingrédients
const calculateIngredientsTotalMacros = (
  ingredients: IngredientWithStandardProps[],
) => {
  try {
    // Vérifier si nous avons des ingrédients à traiter
    if (!ingredients || ingredients.length === 0) {
      return { calories: 0, carbs: 0, fat: 0, protein: 0 };
    }

    // Générer une clé de cache basée sur les ingrédients et leurs propriétés
    const cacheKey = ingredients
      .map(
        (ing) =>
          `${ing.ingredientStandardId}-${ing.quantity}-${ing.calories}-${ing.carbs}-${ing.fat}-${ing.protein}`,
      )
      .join('|');

    // Vérifier si le résultat est déjà en cache
    if (macroCalculationCache && macroCalculationCache.key === cacheKey) {
      conditionalLog('Utilisation du cache pour les macros');
      return macroCalculationCache.result;
    }

    // Journaliser les données d'ingrédients pour débogage
    conditionalLog(
      'Calcul des macros pour ingrédients:',
      ingredients.map((ing) => ({
        name: ing.ingredientsStandard?.name,
        quantity: ing.quantity,
        unit: ing.ingredientsStandard?.unit,
        calories: ing.calories,
        carbs: ing.carbs,
        fat: ing.fat,
        protein: ing.protein,
      })),
    );

    // Calculer les totaux en validant chaque valeur
    const totals = ingredients.reduce(
      (acc, ingredient) => {
        // S'assurer que toutes les valeurs sont des nombres valides
        const calories = isNaN(ingredient.calories)
          ? 0
          : ingredient.calories || 0;
        const carbs = isNaN(ingredient.carbs) ? 0 : ingredient.carbs || 0;
        const fat = isNaN(ingredient.fat) ? 0 : ingredient.fat || 0;
        const protein = isNaN(ingredient.protein) ? 0 : ingredient.protein || 0;

        return {
          calories: acc.calories + calories,
          carbs: acc.carbs + carbs,
          fat: acc.fat + fat,
          protein: acc.protein + protein,
        };
      },
      { calories: 0, carbs: 0, fat: 0, protein: 0 },
    );

    // Recalculer les calories à partir des macros pour assurer la cohérence
    // 1g de glucides = 4kcal, 1g de lipides = 9kcal, 1g de protéines = 4kcal
    const calculatedCalories =
      totals.carbs * 4 + totals.fat * 9 + totals.protein * 4;

    // Utiliser les calories calculées si elles sont significativement différentes des calories sommées
    // Pour tenir compte des arrêtes d'arrondi et des erreurs de saisie
    const finalCalories =
      Math.abs(calculatedCalories - totals.calories) > 50
        ? calculatedCalories
        : totals.calories;

    const result = {
      calories: Math.round(finalCalories),
      carbs: Math.round(totals.carbs),
      fat: Math.round(totals.fat),
      protein: Math.round(totals.protein),
    };

    // Stocker le résultat dans le cache
    if (ingredients.length > 0) {
      const cacheKey = ingredients
        .map(
          (ing) =>
            `${ing.ingredientStandardId}-${ing.quantity}-${ing.calories}-${ing.carbs}-${ing.fat}-${ing.protein}`,
        )
        .join('|');
      macroCalculationCache = { key: cacheKey, result };
    }

    conditionalLog('Résultat du calcul des macros:', result);
    return result;
  } catch (error) {
    console.error('Erreur dans calculateIngredientsTotalMacros:', error);
    return { calories: 0, carbs: 0, fat: 0, protein: 0 };
  }
};

// Interface du store d'ingrédients
interface IngredientStore {
  selectedIngredients: IngredientWithStandardProps[];
  totalMacros: TotalMacrosProps;
  totalWeight: number;
  mealWeight: number;
  setSelectedIngredients: (ingredients: IngredientWithStandardProps[]) => void;
  setTotalMacros: (macros: TotalMacrosProps) => void;
  setMealWeight: (weight: number) => void;
  addIngredient: (ingredient: IngredientStandardOrmProps) => void;
  removeIngredient: (id: number) => void;
  toggleIngredient: (ingredient: IngredientStandardOrmProps) => void;
  updateIngredient: (id: number, newQuantity: number) => void;
  resetIngredients: () => void;
}

// Transforme un IngredientStandardOrmProps en IngredientWithStandardProps
const mapToIngredientWithStandard = (
  ingredient: IngredientStandardOrmProps,
): IngredientWithStandardProps => {
  // Créer l'objet avec la bonne structure avant de calculer les macros
  const ingredientWithStandard: IngredientWithStandardProps = {
    quantity: ingredient.quantity || 1,
    calories: ingredient.calories || 0,
    carbs: ingredient.carbs || 0,
    fat: ingredient.fat || 0,
    protein: ingredient.protein || 0,
    ingredientStandardId: ingredient.id,
    ingredientsStandard: ingredient,
  };

  return ingredientWithStandard;
};

// Calcule le poids total des ingrédients
const calculateTotalWeight = (
  ingredients: IngredientWithStandardProps[],
): number => {
  return ingredients.reduce(
    (total, ingredient) => total + ingredient.quantity,
    0,
  );
};

// Cache pour les résultats d'ajustement
type AdjustmentCache = {
  ingredientsHash: string;
  mealWeight: number;
  result: TotalMacrosProps;
};
let macroAdjustmentCache: AdjustmentCache | null = null;

// Utiliser un hash simple pour identifier rapidement si les ingrédients ont changé
const getIngredientsHash = (
  ingredients: IngredientWithStandardProps[],
): string => {
  return ingredients
    .map((ing) => `${ing.ingredientStandardId}-${ing.quantity}`)
    .join('|');
};

// Recalcule les macros totaux avec ajustement du poids
const recalculateTotalMacros = (
  ingredients: IngredientWithStandardProps[],
  mealWeight?: number,
): TotalMacrosProps => {
  conditionalLog('[STORE] === CALCUL TOTAL MACROS ===');

  // Vérifier si nous pouvons réutiliser le cache
  const ingredientsHash = getIngredientsHash(ingredients);
  if (
    macroAdjustmentCache &&
    macroAdjustmentCache.ingredientsHash === ingredientsHash &&
    macroAdjustmentCache.mealWeight === mealWeight
  ) {
    conditionalLog('[STORE] Réutilisation du cache pour les macros ajustées');
    return macroAdjustmentCache.result;
  }

  conditionalLog(`[STORE] Nombre d'ingrédients: ${ingredients.length}`);
  conditionalLog(
    `[STORE] Poids d'affichage demandé: ${mealWeight || 'non spécifié'}g`,
  );
  // Si pas d'ingrédients, retourner des valeurs à 0
  if (ingredients.length === 0) {
    const emptyResult = {
      totalCalories: 0,
      totalFats: 0,
      totalCarbs: 0,
      totalProtein: 0,
    };
    // Mettre à jour le cache avec le résultat vide
    macroAdjustmentCache = {
      ingredientsHash,
      mealWeight: mealWeight || 0,
      result: emptyResult,
    };
    return emptyResult;
  }

  // Calculer le poids total des ingrédients
  const totalIngredientsWeight = calculateTotalWeight(ingredients);
  // Calculer les macros brutes
  const rawMacros = calculateIngredientsTotalMacros(ingredients);

  conditionalLog('[STORE] Macros brutes totales:', rawMacros);
  conditionalLog(
    `[STORE] Poids total des ingrédients: ${totalIngredientsWeight}g`,
  );

  // 1. Si mealWeight est spécifié et valide: ajuster pour ce poids
  // 2. Si mealWeight = 100g: normaliser à 100g pour standardisation
  // 3. Sinon: juste retourner les totaux bruts (cas par défaut)

  // Si pas de poids de repas ou invalide, retourner les totaux bruts
  if (!mealWeight || !isValidWeight(mealWeight)) {
    return {
      totalCalories: rawMacros.calories,
      totalFats: rawMacros.fat,
      totalCarbs: rawMacros.carbs,
      totalProtein: rawMacros.protein,
    };
  }

  // Ajuster les macros selon le poids final/d'affichage
  const adjustedMacros = adjustMacrosByFinalWeight(
    rawMacros,
    totalIngredientsWeight,
    mealWeight,
  );

  const result = {
    totalCalories: adjustedMacros.calories,
    totalFats: adjustedMacros.fat,
    totalCarbs: adjustedMacros.carbs,
    totalProtein: adjustedMacros.protein,
  };

  // Stocker dans le cache
  macroAdjustmentCache = {
    ingredientsHash,
    mealWeight: mealWeight || 0,
    result,
  };

  conditionalLog('[STORE] Macros finales ajustées:', result);
  conditionalLog('[STORE] === FIN CALCUL TOTAL MACROS ===');

  return {
    totalCalories: adjustedMacros.calories,
    totalFats: adjustedMacros.fat,
    totalCarbs: adjustedMacros.carbs,
    totalProtein: adjustedMacros.protein,
  };
};

export const useIngredientStore = create<IngredientStore>((set) => ({
  selectedIngredients: [],
  totalMacros: {
    totalCalories: 0,
    totalFats: 0,
    totalCarbs: 0,
    totalProtein: 0,
  },
  totalWeight: 0,
  mealWeight: 0,

  setSelectedIngredients: (ingredients) =>
    set((state) => {
      try {
        const totalWeight = calculateTotalWeight(ingredients);
        return {
          selectedIngredients: ingredients,
          totalWeight,
          totalMacros: recalculateTotalMacros(ingredients, state.mealWeight),
        };
      } catch (error) {
        console.error('Erreur lors de la mise à jour des ingrédients:', error);
        return state;
      }
    }),

  setTotalMacros: (macros) =>
    set({
      totalMacros: macros,
    }),

  setMealWeight: (weight) =>
    set((state) => {
      try {
        console.log(`[STORE] === CHANGEMENT POIDS REPAS: ${weight}g ===`);

        // Si le poids n'est pas valide (trop faible ou nul), utiliser 0 comme poids
        // sans lancer d'erreur, pour la création de nouveaux repas
        if (!isValidWeight(weight)) {
          console.log(
            '[STORE] Poids spécifié trop faible, utilisation de valeurs par défaut',
          );
          return {
            mealWeight: weight,
            totalMacros: {
              totalCalories: 0,
              totalFats: 0,
              totalCarbs: 0,
              totalProtein: 0,
            },
          };
        }

        // Sinon, calculer normalement les macros pour le poids spécifié
        return {
          mealWeight: weight,
          totalMacros: recalculateTotalMacros(
            state.selectedIngredients,
            weight,
          ),
        };
      } catch (error) {
        console.error('Erreur lors du calcul des macros:', error);
        return state;
      }
    }),

  addIngredient: (ingredient) =>
    set((state) => {
      try {
        // Vérifier si l'ingrédient existe déjà
        const existingIndex = state.selectedIngredients.findIndex(
          (ing) => ing.ingredientStandardId === ingredient.id,
        );

        if (existingIndex !== -1) {
          return state; // Ingrédient déjà présent, ne rien faire
        }

        // Transformer l'ingrédient et l'ajouter à la liste
        const newIngredient = mapToIngredientWithStandard(ingredient);
        const updatedIngredients = [
          ...state.selectedIngredients,
          newIngredient,
        ];
        const totalWeight = calculateTotalWeight(updatedIngredients);

        // Ajuster le poids du repas si nécessaire
        const mealWeight =
          state.mealWeight === 0 ? totalWeight : state.mealWeight;

        return {
          selectedIngredients: updatedIngredients,
          totalWeight,
          mealWeight,
          totalMacros: recalculateTotalMacros(updatedIngredients, mealWeight),
        };
      } catch (error) {
        console.error("Erreur lors de l'ajout de l'ingrédient:", error);
        return state;
      }
    }),

  removeIngredient: (id) =>
    set((state) => {
      try {
        const updatedIngredients = state.selectedIngredients.filter(
          (ing) => ing.ingredientStandardId !== id,
        );
        const totalWeight = calculateTotalWeight(updatedIngredients);
        const mealWeight =
          updatedIngredients.length === 0 ? 0 : state.mealWeight;
        return {
          selectedIngredients: updatedIngredients,
          totalWeight: totalWeight,
          mealWeight: mealWeight,
          totalMacros: recalculateTotalMacros(updatedIngredients, mealWeight),
        };
      } catch (error) {
        console.error("Erreur lors de la suppression de l'ingrédient:", error);
        return state;
      }
    }),

  toggleIngredient: (ingredient) =>
    set(
      produce((state: IngredientStore) => {
        try {
          const existingIndex = state.selectedIngredients.findIndex(
            (ing) => ing.ingredientStandardId === ingredient.id,
          );

          // Vérifier si nous retirons ou ajoutons un ingrédient
          if (existingIndex !== -1) {
            // Retirer l'ingrédient du tableau (plus efficace avec immer)
            state.selectedIngredients.splice(existingIndex, 1);
          } else {
            // Ajouter le nouvel ingrédient à la fin du tableau
            state.selectedIngredients.push(
              mapToIngredientWithStandard(ingredient),
            );
          }

          // Calculer le poids total une seule fois
          state.totalWeight = calculateTotalWeight(state.selectedIngredients);

          // Mettre à jour le poids du repas si nécessaire
          if (state.mealWeight === 0) {
            state.mealWeight = state.totalWeight;
          }

          // Calculer les macros totales une seule fois à la fin
          state.totalMacros = recalculateTotalMacros(
            state.selectedIngredients,
            state.mealWeight,
          );
        } catch (error) {
          console.error("Erreur lors du basculement de l'ingrédient:", error);
          // Ne pas modifier l'état en cas d'erreur
        }
      }),
    ),

  updateIngredient: (ingredientStandardId: number, newQuantity: number) =>
    set((state) => {
      try {
        // Si l'ingrédient n'existe pas, ne rien faire
        if (
          !state.selectedIngredients.some(
            (ing) => ing.ingredientStandardId === ingredientStandardId,
          )
        ) {
          return state;
        }

        const updatedIngredients = state.selectedIngredients.map((ing) => {
          if (ing.ingredientStandardId === ingredientStandardId) {
            // Vérifier si ingredientsStandard existe avant d'accéder à ses propriétés
            if (!ing.ingredientsStandard) {
              console.error(
                'ingredientsStandard is undefined for ingredient:',
                ing,
              );
              return ing; // retourner l'ingrédient inchangé
            }

            // Créer un nouvel objet pour l'ingrédient avec la quantité mise à jour
            // mais en conservant toutes les autres propriétés

            // Déterminer si les valeurs nutritionnelles de l'ingrédient standard sont pour 100g ou pour la quantité totale
            const standardMacros =
              ing.ingredientsStandard.carbs +
              ing.ingredientsStandard.protein +
              ing.ingredientsStandard.fat;
            // Si les valeurs nutritionnelles sont incohérentes avec la quantité, elles sont probablement pour 100g
            const valuesPerHundredGrams =
              standardMacros > ing.ingredientsStandard.quantity * 1.3;

            let updatedCalories, updatedCarbs, updatedFat, updatedProtein;

            if (valuesPerHundredGrams) {
              // Si les valeurs sont pour 100g, appliquer la règle de trois
              updatedCalories =
                (ing.ingredientsStandard.calories * newQuantity) / 100;
              updatedCarbs =
                (ing.ingredientsStandard.carbs * newQuantity) / 100;
              updatedFat = (ing.ingredientsStandard.fat * newQuantity) / 100;
              updatedProtein =
                (ing.ingredientsStandard.protein * newQuantity) / 100;
            } else {
              // Si les valeurs sont déjà pour la quantité spécifiée, calculer proportionnellement
              const ratio = newQuantity / ing.ingredientsStandard.quantity;
              updatedCalories = ing.ingredientsStandard.calories * ratio;
              updatedCarbs = ing.ingredientsStandard.carbs * ratio;
              updatedFat = ing.ingredientsStandard.fat * ratio;
              updatedProtein = ing.ingredientsStandard.protein * ratio;
            }

            // Arrondir les valeurs pour une meilleure lisibilité
            return {
              ...ing,
              quantity: newQuantity,
              calories: Math.round(updatedCalories),
              carbs: Math.round(updatedCarbs),
              fat: Math.round(updatedFat),
              protein: Math.round(updatedProtein),
            };
          }
          return ing;
        });

        // Calculer les nouvelles valeurs totales
        const totalWeight = calculateTotalWeight(updatedIngredients);
        const totalMacros = recalculateTotalMacros(
          updatedIngredients,
          state.mealWeight,
        );

        return {
          selectedIngredients: updatedIngredients,
          totalWeight,
          totalMacros,
        };
      } catch (error) {
        console.error('Erreur dans updateIngredient:', error);
        return state;
      }
    }),

  resetIngredients: () =>
    set({
      selectedIngredients: [],
      totalMacros: {
        totalCalories: 0,
        totalFats: 0,
        totalCarbs: 0,
        totalProtein: 0,
      },
      totalWeight: 0,
      mealWeight: 0,
    }),
}));
