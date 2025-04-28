import { create } from 'zustand';
import { IngredientStandardOrmProps } from '../../db/schema';
import { IngredientWithStandardProps } from '@/types/ingredient.type';
import { TotalMacrosProps } from '@/types/meal.type';
import {
  calculateProportionalMacros,
  calculateTotalMacros,
  adjustMacrosByFinalWeight,
  isValidWeight,
} from '@/utils/helpers/nutrition.helper';

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
  const macros = calculateProportionalMacros(
    ingredient.quantity,
    {
      calories: ingredient.calories,
      carbs: ingredient.carbs,
      fat: ingredient.fat,
      protein: ingredient.protein,
    },
    ingredient.quantity,
  );

  return {
    quantity: ingredient.quantity,
    ...macros,
    ingredientStandardId: ingredient.id,
    ingredientsStandard: ingredient,
  };
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
  const rawTotals = calculateTotalMacros(ingredients);

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
        if (!isValidWeight(newQuantity)) {
          throw new Error('Quantité invalide');
        }

        const updatedIngredients = state.selectedIngredients.map((ing) => {
          if (ing.ingredientStandardId === ingredientStandardId) {
            const macros = calculateProportionalMacros(
              ing.ingredientsStandard.quantity,
              {
                calories: ing.ingredientsStandard.calories,
                carbs: ing.ingredientsStandard.carbs,
                fat: ing.ingredientsStandard.fat,
                protein: ing.ingredientsStandard.protein,
              },
              newQuantity,
            );

            return {
              ...ing,
              quantity: newQuantity,
              ...macros,
            };
          }
          return ing;
        });

        const totalWeight = calculateTotalWeight(updatedIngredients);
        return {
          selectedIngredients: updatedIngredients,
          totalWeight,
          totalMacros: recalculateTotalMacros(updatedIngredients, state.mealWeight),
        };
      } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'ingrédient:', error);
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
