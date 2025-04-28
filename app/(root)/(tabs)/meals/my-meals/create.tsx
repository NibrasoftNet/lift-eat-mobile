import React, { useState, useEffect } from 'react';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import { MealDefaultValuesProps } from '@/utils/validation/meal/meal.validation';
import MealForm from '@/components/froms/MealForm';
import {
  CuisineTypeEnum,
  MealTypeEnum,
  MealUnitEnum,
} from '@/utils/enum/meal.enum';
import { getCurrentUserId } from '@/utils/helpers/userContext';

export default function CreateNewMealScreen() {
  // État pour stocker l'ID utilisateur
  const [userId, setUserId] = useState<number>(0);
  const drizzleDb = useDrizzleDb();
  
  // Charger l'ID utilisateur au montage du composant
  useEffect(() => {
    const loadUserId = async () => {
      const id = await getCurrentUserId();
      setUserId(id || 0);
    };
    
    loadUserId();
  }, []);

  const defaultMealValues: MealDefaultValuesProps = {
    type: MealTypeEnum.BREAKFAST,
    name: '',
    description: '',
    cuisine: CuisineTypeEnum.GENERAL,
    unit: MealUnitEnum.GRAMMES,
    quantity: 1,
    calories: 0,
    carbs: 0,
    fat: 0,
    protein: 0,
    creatorId: userId,
    ingredients: null,
  };

  return <MealForm defaultValues={defaultMealValues} operation="create" />;
}
