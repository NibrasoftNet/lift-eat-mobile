import { create } from 'zustand';
import { IngredientStandardOrmProps } from '../../db/schema';
import { IngredientWithStandardProps } from '@/types/ingredient.type';
import { TotalMacrosProps } from '@/types/meal.type';

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

// Utility function to transform IngredientStandardOrmProps to IngredientWithStandardProps
const mapToIngredientWithStandard = (
  ingredient: IngredientStandardOrmProps,
): IngredientWithStandardProps => ({
  quantity: ingredient.quantity,
  calories: ingredient.calories,
  carbs: ingredient.carbs,
  fat: ingredient.fat,
  protein: ingredient.protein,
  ingredientStandardId: ingredient.id,
  ingredientsStandard: ingredient,
});

// Calculate total weight of all ingredients
const calculateTotalWeight = (ingredients: IngredientWithStandardProps[]): number => {
  return ingredients.reduce((total, ingredient) => total + ingredient.quantity, 0);
};

// Function to recalculate total macros with weight adjustment
const calculateTotalMacros = (
  ingredients: IngredientWithStandardProps[],
  mealWeight?: number
): TotalMacrosProps => {
  // Calculate raw totals first
  const rawTotals = ingredients.reduce(
    (totals, ingredient) => ({
      totalCalories: totals.totalCalories + ingredient.calories,
      totalFats: totals.totalFats + ingredient.fat,
      totalCarbs: totals.totalCarbs + ingredient.carbs,
      totalProtein: totals.totalProtein + ingredient.protein,
    }),
    { totalCalories: 0, totalFats: 0, totalCarbs: 0, totalProtein: 0 },
  );
  
  // If no meal weight specified or no ingredients, return raw totals
  if (!mealWeight || ingredients.length === 0) {
    return rawTotals;
  }
  
  // Calculate the ratio between meal weight and total ingredients weight
  const totalIngredientsWeight = calculateTotalWeight(ingredients);
  // Si le repas fait 100g et les ingrédients 300g, on doit diviser par 3
  const adjustmentFactor = totalIngredientsWeight / mealWeight;
  
  // Appliquer le facteur pour ajuster les macros en fonction du poids final du repas
  return {
    totalCalories: Math.round(rawTotals.totalCalories / adjustmentFactor),
    totalFats: Math.round(rawTotals.totalFats / adjustmentFactor),
    totalCarbs: Math.round(rawTotals.totalCarbs / adjustmentFactor),
    totalProtein: Math.round(rawTotals.totalProtein / adjustmentFactor),
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
      const totalWeight = calculateTotalWeight(ingredients);
      // If meal weight was previously 0, set it to match the total ingredients weight
      const mealWeight = state.mealWeight === 0 ? totalWeight : state.mealWeight;
      return {
        selectedIngredients: ingredients,
        totalWeight: totalWeight,
        mealWeight: mealWeight,
        totalMacros: calculateTotalMacros(ingredients, mealWeight),
      };
    }),

  setTotalMacros: (macros) =>
    set(() => ({
      totalMacros: macros,
    })),
    
  setMealWeight: (weight) =>
    set((state) => ({
      mealWeight: weight,
      totalMacros: calculateTotalMacros(state.selectedIngredients, weight),
    })),

  addIngredient: (ingredient) =>
    set((state) => {
      const updatedIngredients = [
        ...state.selectedIngredients,
        mapToIngredientWithStandard(ingredient),
      ];
      const totalWeight = calculateTotalWeight(updatedIngredients);
      // If meal weight was previously 0, set it to match the total ingredients weight
      const mealWeight = state.mealWeight === 0 ? totalWeight : state.mealWeight;
      return {
        selectedIngredients: updatedIngredients,
        totalWeight: totalWeight,
        mealWeight: mealWeight,
        totalMacros: calculateTotalMacros(updatedIngredients, mealWeight),
      } as Partial<IngredientStore>; // ✅ Explicitly casting to Partial<IngredientStore>
    }),

  removeIngredient: (id) =>
    set((state) => {
      const updatedIngredients = state.selectedIngredients.filter(
        (ing) => ing.ingredientStandardId !== id,
      );
      const totalWeight = calculateTotalWeight(updatedIngredients);
      // If all ingredients are removed, reset meal weight to 0
      const mealWeight = updatedIngredients.length === 0 ? 0 : state.mealWeight;
      return {
        selectedIngredients: updatedIngredients,
        totalWeight: totalWeight,
        mealWeight: mealWeight,
        totalMacros: calculateTotalMacros(updatedIngredients, mealWeight),
      } as Partial<IngredientStore>; // ✅ Ensure Zustand recognizes the partial update
    }),

  toggleIngredient: (ingredient) =>
    set((state) => {
      // Optimisation: trouver l'index en une seule passe du tableau
      const existingIndex = state.selectedIngredients.findIndex(
        (ing) => ing.ingredientStandardId === ingredient.id
      );
      const isPresent = existingIndex !== -1;

      let updatedIngredients;
      if (isPresent) {
        // Optimisation: Utilisation de slice pour éviter la reconstruction complète
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

      // Optimisation: calcul rapide du nouveau poids total
      let totalWeight;
      if (isPresent) {
        // Si on supprime un ingrédient, soustraire son poids du total
        totalWeight = state.totalWeight - state.selectedIngredients[existingIndex].quantity;
      } else {
        // Si on ajoute un ingrédient, ajouter son poids au total
        totalWeight = state.totalWeight + ingredient.quantity;
      }
      
      // Si meal weight était 0, on le définit au poids total
      const mealWeight = state.mealWeight === 0 ? totalWeight : state.mealWeight;
      
      return {
        selectedIngredients: updatedIngredients,
        totalWeight,
        mealWeight,
        totalMacros: calculateTotalMacros(updatedIngredients, mealWeight),
      } as Partial<IngredientStore>; // Ensure Zustand recognizes the update
    }),

  updateIngredient: (ingredientStandardId: number, newQuantity: number) =>
    set((state) => {
      const updatedIngredients = state.selectedIngredients.map((ing) =>
        ing.ingredientStandardId === ingredientStandardId
          ? {
              ...ing,
              quantity: newQuantity,
              calories: Math.round(
                (newQuantity / ing.ingredientsStandard.quantity) *
                  ing.ingredientsStandard.calories,
              ),
              carbs: Math.round(
                (newQuantity / ing.ingredientsStandard.quantity) *
                  ing.ingredientsStandard.carbs,
              ),
              fat: Math.round(
                (newQuantity / ing.ingredientsStandard.quantity) *
                  ing.ingredientsStandard.fat,
              ),
              protein: Math.round(
                (newQuantity / ing.ingredientsStandard.quantity) *
                  ing.ingredientsStandard.protein,
              ),
            }
          : ing,
      );

      const totalWeight = calculateTotalWeight(updatedIngredients);
      
      return {
        selectedIngredients: updatedIngredients,
        totalWeight: totalWeight,
        totalMacros: calculateTotalMacros(updatedIngredients, state.mealWeight),
      } as Partial<IngredientStore>;
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
    } as Partial<IngredientStore>), // ✅ Ensure Zustand correctly processes the update,
}));
