import React, { useEffect, useState, useCallback } from 'react';
import { View, ActivityIndicator, Text, RefreshControl, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter, useLocalSearchParams, Link } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Buffer } from 'buffer';

import MealFormNew from '@/components-new/ui/organisms/meal/MealFormNew';

import { mealPagesService } from '@/utils/services/pages/meal-pages.service';
import { useIngredientStore } from '@/utils/store/ingredientStore';
import { IngredientWithStandardProps } from '@/types/ingredient.type';
import { MealDefaultValuesProps } from '@/utils/validation/meal/meal.validation';
import { CuisineTypeEnum, MealTypeEnum, MealUnitEnum } from '@/utils/enum/meal.enum';

export default function EditMealV2Screen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const mealId = Array.isArray(id) ? Number(id[0]) : Number(id);

  const {
    setSelectedIngredients,
    setTotalMacros,
    resetIngredients,
  } = useIngredientStore();

  // Fetch existing meal details
  const {
    data: mealData,
    isLoading,
    error,
  refetch,
  } = useQuery({
    queryKey: ['meal-details', mealId],
    queryFn: () => mealPagesService.getMealDetails(mealId),
    enabled: !isNaN(mealId),
  });

  // When data arrives, prepare default values & ingredient store
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  let defaults: MealDefaultValuesProps | undefined = undefined;
  useEffect(() => {
    if (!mealData?.success) return;
    const { meal, ingredients } = mealData.data as any;

    // Adapt ingredients for store
    const adaptedIngredients = (ingredients || []).map((ing: any) => ({
      id: ing.id,
      ingredientStandardId: ing.ingredientStandardId,
      mealId: ing.mealId,
      quantity: ing.quantity,
      unit: ing.unit || 'g',
      ingredient: ing.ingredient,
      ingredientsStandard: ing.ingredient,
      calories: ing.ingredient?.calories ?? 0,
      carbs: ing.ingredient?.carbs ?? 0,
      fat: ing.ingredient?.fat ?? 0,
      protein: ing.ingredient?.protein ?? 0,
    })) as IngredientWithStandardProps[];

    setSelectedIngredients(adaptedIngredients);

    // macros totals
    setTotalMacros({
      totalCalories: meal.calories || 0,
      totalCarbs: meal.carbs || 0,
      totalFats: meal.fat || 0,
      totalProtein: meal.protein || 0,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mealData]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#A4C73B" />
      </View>
    );
  }

  if (error || !mealData?.success) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
        <Link href="/meals/my-meals" asChild>
          <View style={{ padding: 12, backgroundColor: '#A4C73B', borderRadius: 8 }}>
            <Text style={{ color: '#fff' }}>{t('meal.error.loading')}</Text>
          </View>
        </Link>
      </View>
    );
  }

  // At this point we've already returned when mealData is undefined or `success` is false,
  // so we can safely assert that `mealData` (and its `data`) are defined.
  const meal = mealData!.data!.meal;

  // Prepare image string (supports Buffer or string)
  let imageStr: string | undefined = undefined;
  if (meal.image) {
    if (typeof meal.image === 'string') {
      imageStr = meal.image;
    } else if (typeof meal.image === 'object') {
      try {
        // Attempt direct toString on buffer-like object
        // @ts-ignore
        imageStr = `data:image/jpeg;base64,${(meal.image as any).toString('base64')}`;
      } catch (e) {
        // Ignore conversion errors
      }
    }
  }

  defaults = {
    id: meal.id,
    name: meal.name || '',
    description: meal.description || '',
    cuisine: meal.cuisine as CuisineTypeEnum,
    type: meal.type as MealTypeEnum,
    unit: (meal.unit as MealUnitEnum) || MealUnitEnum.GRAMMES,
    quantity: meal.quantity || 0,
    calories: meal.calories || 0,
    carbs: meal.carbs || 0,
    fat: meal.fat || 0,
    protein: meal.protein || 0,
    creatorId: meal.creatorId,
    image: imageStr,
    ingredients: null,
  } as MealDefaultValuesProps;

  return (
    <MealFormNew
      mode="update"
      mealId={mealId}
      defaultValues={defaults}
      refreshing={refreshing}
      onRefresh={handleRefresh}
    />
  );
}