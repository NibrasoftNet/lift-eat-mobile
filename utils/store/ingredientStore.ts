import { create } from 'zustand';
import { IngredientStandardOrmProps } from '../../db/schema';
import { IngredientWithStandardProps } from '@/types/ingredient.type';
import { TotalMacrosProps } from '@/types/meal.type';
import {
  adjustMacrosByFinalWeight,
  isValidWeight,
} from '@/utils/helpers/nutrition.helper';

// Fonction utilitaire pour calculer les macros totaux pour les ingrédients
const calculateIngredientsTotalMacros = (ingredients: IngredientWithStandardProps[]) => {
  try {
    const totals = ingredients.reduce(
      (acc, ingredient) => {
        return {
          calories: acc.calories + (ingredient.calories || 0),
          carbs: acc.carbs + (ingredient.carbs || 0),
          fat: acc.fat + (ingredient.fat || 0),
          protein: acc.protein + (ingredient.protein || 0),
        };
      },
      { calories: 0, carbs: 0, fat: 0, protein: 0 }
    );

    // Recalculer les calories à partir des macros pour assurer la cohérence
    const calculatedCalories =
      totals.carbs * 4 + totals.fat * 9 + totals.protein * 4;

    return {
      calories: Math.round(calculatedCalories),
      carbs: Math.round(totals.carbs),
      fat: Math.round(totals.fat),
      protein: Math.round(totals.protein),
    };
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
const calculateTotalWeight = (ingredients: IngredientWithStandardProps[]): number => {
  return ingredients.reduce((total, ingredient) => total + ingredient.quantity, 0);
};

// Recalcule les macros totaux avec ajustement du poids
const recalculateTotalMacros = (
  ingredients: IngredientWithStandardProps[],
  mealWeight?: number,
): TotalMacrosProps => {
  // Si pas d'ingrédients, retourner des valeurs à 0
  if (ingredients.length === 0) {
    return {
      totalCalories: 0,
      totalFats: 0,
      totalCarbs: 0,
      totalProtein: 0,
    };
  }

  // Calculer les totaux bruts
  const rawTotals = calculateIngredientsTotalMacros(ingredients);

  // Si pas de poids final spécifié, retourner les totaux bruts
  if (!mealWeight || !isValidWeight(mealWeight)) {
    return {
      totalCalories: rawTotals.calories,
      totalFats: rawTotals.fat,
      totalCarbs: rawTotals.carbs,
      totalProtein: rawTotals.protein,
    };
  }

  // Ajuster les macros selon le poids final
  const totalWeight = calculateTotalWeight(ingredients);
  const adjustedMacros = adjustMacrosByFinalWeight(rawTotals, totalWeight, mealWeight);

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
        const mealWeight = state.mealWeight === 0 ? totalWeight : state.mealWeight;
        return {
          selectedIngredients: ingredients,
          totalWeight: totalWeight,
          mealWeight: mealWeight,
          totalMacros: recalculateTotalMacros(ingredients, mealWeight),
        };
      } catch (error) {
        console.error('Erreur lors du calcul des macros:', error);
        return state;
      }
    }),

  setTotalMacros: (macros) =>
    set(() => ({
      totalMacros: macros,
    })),

  setMealWeight: (weight) =>
    set((state) => {
      try {
        if (!isValidWeight(weight)) {
          throw new Error('Poids invalide');
        }
        return {
          mealWeight: weight,
          totalMacros: recalculateTotalMacros(state.selectedIngredients, weight),
        };
      } catch (error) {
        console.error('Erreur lors du calcul des macros:', error);
        return state;
      }
    }),

  addIngredient: (ingredient) =>
    set((state) => {
      try {
        const updatedIngredients = [
          ...state.selectedIngredients,
          mapToIngredientWithStandard(ingredient),
        ];
        const totalWeight = calculateTotalWeight(updatedIngredients);
        const mealWeight = state.mealWeight === 0 ? totalWeight : state.mealWeight;
        return {
          selectedIngredients: updatedIngredients,
          totalWeight: totalWeight,
          mealWeight: mealWeight,
          totalMacros: recalculateTotalMacros(updatedIngredients, mealWeight),
        };
      } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'ingrédient:', error);
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
        const mealWeight = updatedIngredients.length === 0 ? 0 : state.mealWeight;
        return {
          selectedIngredients: updatedIngredients,
          totalWeight: totalWeight,
          mealWeight: mealWeight,
          totalMacros: recalculateTotalMacros(updatedIngredients, mealWeight),
        };
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'ingrédient:', error);
        return state;
      }
    }),

  toggleIngredient: (ingredient) =>
    set((state) => {
      try {
        const existingIndex = state.selectedIngredients.findIndex(
          (ing) => ing.ingredientStandardId === ingredient.id
        );

        let updatedIngredients;
        if (existingIndex !== -1) {
          updatedIngredients = [
            ...state.selectedIngredients.slice(0, existingIndex),
            ...state.selectedIngredients.slice(existingIndex + 1)
          ];
        } else {
          updatedIngredients = [
            ...state.selectedIngredients,
            mapToIngredientWithStandard(ingredient),
          ];
        }

        const totalWeight = calculateTotalWeight(updatedIngredients);
        const mealWeight = state.mealWeight === 0 ? totalWeight : state.mealWeight;

        return {
          selectedIngredients: updatedIngredients,
          totalWeight,
          mealWeight,
          totalMacros: recalculateTotalMacros(updatedIngredients, mealWeight),
        };
      } catch (error) {
        console.error('Erreur lors du basculement de l\'ingrédient:', error);
        return state;
      }
    }),

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
            // Créer un nouvel objet pour l'ingrédient avec la quantité mise à jour
            // mais en conservant toutes les autres propriétés
            return {
              ...ing,
              quantity: newQuantity,
              // Mettre à jour les valeurs nutritionnelles proportionnellement
              calories: (ing.ingredientsStandard.calories * newQuantity) / ing.ingredientsStandard.quantity,
              carbs: (ing.ingredientsStandard.carbs * newQuantity) / ing.ingredientsStandard.quantity,
              fat: (ing.ingredientsStandard.fat * newQuantity) / ing.ingredientsStandard.quantity,
              protein: (ing.ingredientsStandard.protein * newQuantity) / ing.ingredientsStandard.quantity,
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
