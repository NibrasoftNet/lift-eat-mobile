import React from 'react';
import useSessionStore from '@/utils/store/sessionStore';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import { MealDefaultValuesProps } from '@/utils/validation/meal/meal.validation';
import MealForm from '@/components/froms/MealForm';
import { CuisineTypeEnum, MealTypeEnum, MealUnitEnum } from '@/utils/enum/meal.enum';

export default function CreateNewMealScreen() {
  const { user } = useSessionStore()
  const drizzleDb = useDrizzleDb();

  const defaultMealValues: MealDefaultValuesProps =
    {
      type: MealTypeEnum.BREAKFAST,
      name: '',
      description: '',
      cuisine: CuisineTypeEnum.GENERAL,
      unit: MealUnitEnum.GRAMMES,
      quantity: 0,
      calories: 0,
      carbs: 0,
      fat: 0,
      protein: 0,
      creatorId: user?.id ?? 0,
      ingredients: null
    };
  return (
      <MealForm
        defaultValues={defaultMealValues}
        operation='create'
      />
  );
}
