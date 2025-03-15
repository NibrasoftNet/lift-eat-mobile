import { create } from 'zustand';
import { IngredientStandardOrmProps } from '../../db/schema';
import { IngredientWithStandardProps } from '@/types/ingredient.type';
import { TotalMacrosProps } from '@/types/meal.type';

interface IngredientStore {
  selectedIngredients: IngredientWithStandardProps[];
  totalMacros: TotalMacrosProps;
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

// Function to recalculate total macros
const calculateTotalMacros = (
  ingredients: IngredientWithStandardProps[],
): TotalMacrosProps => {
  return ingredients.reduce(
    (totals, ingredient) => ({
      totalCalories: totals.totalCalories + ingredient.calories,
      totalFats: totals.totalFats + ingredient.fat,
      totalCarbs: totals.totalCarbs + ingredient.carbs,
      totalProtein: totals.totalProtein + ingredient.protein,
    }),
    { totalCalories: 0, totalFats: 0, totalCarbs: 0, totalProtein: 0 },
  );
};

export const useIngredientStore = create<IngredientStore>((set) => ({
  selectedIngredients: [],
  totalMacros: {
    totalCalories: 0,
    totalFats: 0,
    totalCarbs: 0,
    totalProtein: 0,
  },

  addIngredient: (ingredient) =>
    set((state) => {
      const updatedIngredients = [
        ...state.selectedIngredients,
        mapToIngredientWithStandard(ingredient),
      ];
      return {
        selectedIngredients: updatedIngredients,
        totalMacros: calculateTotalMacros(updatedIngredients),
      } as Partial<IngredientStore>; // ✅ Explicitly casting to Partial<IngredientStore>
    }),

  removeIngredient: (id) =>
    set((state) => {
      const updatedIngredients = state.selectedIngredients.filter(
        (ing) => ing.ingredientStandardId !== id,
      );
      return {
        selectedIngredients: updatedIngredients,
        totalMacros: calculateTotalMacros(updatedIngredients),
      } as Partial<IngredientStore>; // ✅ Ensure Zustand recognizes the partial update
    }),

  toggleIngredient: (ingredient) =>
    set((state) => {
      const isPresent = state.selectedIngredients.some(
        (ing) => ing.ingredientStandardId === ingredient.id,
      );

      const updatedIngredients = isPresent
        ? state.selectedIngredients.filter(
            (ing) => ing.ingredientStandardId !== ingredient.id,
          )
        : [
            ...state.selectedIngredients,
            mapToIngredientWithStandard(ingredient),
          ];

      return {
        selectedIngredients: updatedIngredients,
        totalMacros: calculateTotalMacros(updatedIngredients),
      } as Partial<IngredientStore>; // ✅ Ensure Zustand recognizes the update
    }),

  updateIngredient: (ingredientStandardId: number, newQuantity: number) =>
    set((state) => {
      const updatedIngredients = state.selectedIngredients.map((ing) =>
        ing.ingredientStandardId === ingredientStandardId
          ? {
              ...ing,
              quantity: newQuantity,
              calories:
                (newQuantity / ing.ingredientsStandard.quantity) *
                ing.ingredientsStandard.calories,
              carbs:
                (newQuantity / ing.ingredientsStandard.quantity) *
                ing.ingredientsStandard.carbs,
              fat:
                (newQuantity / ing.ingredientsStandard.quantity) *
                ing.ingredientsStandard.fat,
              protein:
                (newQuantity / ing.ingredientsStandard.quantity) *
                ing.ingredientsStandard.protein,
            }
          : ing,
      );

      return {
        selectedIngredients: updatedIngredients,
        totalMacros: calculateTotalMacros(updatedIngredients),
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
    } as Partial<IngredientStore>), // ✅ Ensure Zustand correctly processes the update,
}));
