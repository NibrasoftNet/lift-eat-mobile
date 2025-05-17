import React from 'react';
import { MealDefaultValuesProps } from '@/utils/validation/meal/meal.validation';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { MealWithIngredientAndStandardOrmProps } from '@/db/schema';
import { getMealByIdWithIngredients } from '@/utils/services/meal.service';
import { QueryStateHandler } from '@/utils/providers/QueryWrapper';
import { useIngredientStore } from '@/utils/store/ingredientStore';
import { IngredientWithStandardProps } from '@/types/ingredient.type';
import MealForm from '@/components/forms/MealForm';

export default function EditMealScreen() {
  const { id } = useLocalSearchParams();
  const drizzleDb = useDrizzleDb();
  const { setTotalMacros, setSelectedIngredients } = useIngredientStore();

  const {
    data: mealToEdit,
    isLoading,
    isFetching,
    isRefetching,
    isPending,
    isFetchedAfterMount,
  } = useQuery({
    queryKey: [`meal-${id}`],
    queryFn: async () => {
      const result = await getMealByIdWithIngredients(drizzleDb, Number(id));
      if (result) {
        setTotalMacros({
          totalCalories: result?.calories!,
          totalCarbs: result?.carbs!,
          totalFats: result?.fat!,
          totalProtein: result?.protein!,
        });
        setSelectedIngredients(
          result?.mealIngredients! as unknown as IngredientWithStandardProps[],
        );
      }
      return result;
    },
  });

  const defaultMealValues: MealDefaultValuesProps = {
    id: Number(id),
    name: mealToEdit?.name!,
    description: mealToEdit?.description!,
    type: mealToEdit?.type!,
    cuisine: mealToEdit?.cuisine!,
    unit: mealToEdit?.unit!,
    quantity: mealToEdit?.quantity!,
    calories: mealToEdit?.calories!,
    carbs: mealToEdit?.carbs!,
    fat: mealToEdit?.fat!,
    protein: mealToEdit?.protein!,
    creatorId: mealToEdit?.creatorId!,
    image: mealToEdit?.image! ?? null,
    ingredients: null,
  };

  return (
    <QueryStateHandler<MealWithIngredientAndStandardOrmProps>
      data={mealToEdit}
      isLoading={isLoading}
      isFetching={isFetching}
      isRefetching={isRefetching}
      isPending={isPending}
      isFetchedAfterMount={isFetchedAfterMount}
    >
      <MealForm defaultValues={defaultMealValues} operation="update" />
    </QueryStateHandler>
  );
}
