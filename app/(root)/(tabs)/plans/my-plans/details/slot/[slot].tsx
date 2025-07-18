import React, { useMemo, useCallback, useState } from 'react';
import {
  ScrollView,
  RefreshControl,
  View,
  StyleSheet,
  Pressable,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme, ThemeInterface } from '@/themeNew';
import { useLocalSearchParams, router } from 'expo-router';
import { MealTypeEnum } from '@/utils/enum/meal.enum';
import { useMealsBySlot } from '@/utils/hooks/queries/useMealsBySlot';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components-new/ui/toast';

import MealCard from '@/components-new/ui/molecules/food-selection/MealCard';
import HeroHeader from '@/components-new/ui/molecules/header/HeroHeader';
import Text from '@/components-new/ui/atoms/base/Text';

import { useRemoveMealFromDailyPlan } from '@/utils/hooks/mutations/useRemoveMealFromDailyPlan';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { useAddMealToDailyPlan } from '@/utils/hooks/mutations/useAddMealToDailyPlan';
import MealListDrawer from '@/components-new/ui/organisms/meal/MealListDrawer';
import { usePlanDetails } from '@/utils/hooks/queries/usePlanDetails';
import { planPagesService } from '@/utils/services/pages/plan-pages.service';
import { getCurrentUserIdSync } from '@/utils/helpers/userContext';

/**
 * Page Liste des repas pour un créneau (breakfast, lunch, dinner, snack)
 * URL: /plans/my-plans/details/[id]/slot/[slot]
 * Params: id (planId), slot (MealTypeEnum), date (YYYY-MM-DD)
 */
export default function SlotMealsScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const toast = useToast();
  const {
    id: planIdParam,
    slot: slotParam,
    date,
    openAdd,
  } = useLocalSearchParams<{
    id: string;
    slot: string;
    date: string;
    openAdd?: string;
  }>();
  const [showDrawer, setShowDrawer] = useState(openAdd === '1');
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);


  const planId = Number(planIdParam);
  const slot = slotParam as MealTypeEnum;

  // --- QUERIES ---
  const {
    data: mealsData,
    isLoading,
    refetch,
  } = useMealsBySlot({ planId, date, slot });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['mealsBySlot', planId, date, slot] }),
        queryClient.invalidateQueries({ queryKey: ['dailyNutrition', planId, date] }),
        queryClient.invalidateQueries({ queryKey: ['plan', planId] }),
      ]);
      await refetch();
    } catch (error) {
      logger.error(LogCategory.UI, 'Pull-to-refresh error', error as any);
    } finally {
      setRefreshing(false);
    }
  }, [queryClient, planId, date, slot, refetch]);

  // Fetch plan details to get dailyPlanId
  const { data: planDetailsData } = usePlanDetails(planId);
  const dailyPlanId = planDetailsData?.dailyPlans?.find(
    (dp: any) => dp.date === date,
  )?.id;

  // --- REMOVE MEAL MUTATION ---
  const removeMealMutation = useRemoveMealFromDailyPlan();
  const addMealMutation = useAddMealToDailyPlan();

  const handleAddMealToPlan = useCallback(
    async (
      dailyPlanIdParam: number,
      mealId: number,
      quantity: number = 100,
      mealType?: MealTypeEnum,
    ) => {
      if (!planId || !date) {
        return { success: false, error: 'Plan or date missing' };
      }
      logger.info(LogCategory.UI, 'SlotMealsScreen: handleAddMealToPlan called', { dailyPlanId: dailyPlanIdParam, mealId, quantity, slot });
      return addMealMutation.mutateAsync({
        planId,
        date,
        dailyPlanId: dailyPlanIdParam,
        mealId,
        quantity,
        slot,
      });
    },
    [addMealMutation, planId, date, slot],
  );

  const handleRemoveMeal = useCallback(
    (mealId: number) => {
      if (!dailyPlanId) return;
      removeMealMutation.mutate(
        {
          planId,
          date,
          dailyPlanId,
          mealId,
          slot,
        },
        {
          onSuccess: () => {
            toast.show({
              placement: 'top',
              render: ({ id }) => (
                <Text key={id} style={{ color: '#fff', padding: 8 }}>
                  Repas supprimé
                </Text>
              ),
            });
            refetch();
          },
          onError: () => {
            toast.show({
              placement: 'top',
              render: ({ id }) => (
                <Text key={id} style={{ color: '#fff', padding: 8 }}>
                  Suppression impossible
                </Text>
              ),
            });
          },
        },
      );
    },
    [mealsData, planId, date, slot],
  );

  // --- NAVIGATION ---
  const goBack = () => router.back();
  const goToDetails = () => {
    if (planIdParam) {
      router.push(`/plans/my-plans/details/${planIdParam}?date=${date ?? ''}`);
    } else {
      router.back();
    }
  };

  // --- TOTAL KCAL ---
  const totalCalories =
    mealsData?.meals?.reduce(
      (sum: number, m: any) => sum + (m.calories || 0),
      0,
    ) || 0;

  const title = slot.charAt(0).toUpperCase() + slot.slice(1).toLowerCase();

  return (
    <View style={styles.container}>
      {/* Header */}
      <HeroHeader
        title={title}
        showBack
        showClose
        onBack={goBack}
        onClose={goToDetails}
      />

      {/* Total bar */}
      <View style={styles.totalBar}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{totalCalories} kcal</Text>
      </View>

      {/* Meals list */}
      <ScrollView
        style={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {mealsData?.meals?.map((meal: any, idx: number) => (
          <MealCard
            key={`${(meal as any).meals?.id ?? meal.id}-${idx}`}
            meal={meal}
            onDelete={handleRemoveMeal}
            onPress={() => {
              /* TODO: meal details */
            }}
          />
        ))}
      </ScrollView>

      {/* Add button */}
      <Pressable style={styles.addBtn} onPress={() => setShowDrawer(true)}>
        <Text style={styles.addTxt}>+ Add</Text>
      </Pressable>

      {/* Drawer d'ajout de repas */}
      <MealListDrawer
        showDrawer={showDrawer}
        setShowDrawer={setShowDrawer}
        dailyPlanId={dailyPlanId ?? 0}
        planId={planId}
        onAddMealToPlan={handleAddMealToPlan}
        onMealsAdded={async () => {
          await refetch();
        }}
      />
    </View>
  );
}

const createStyles = (theme: ThemeInterface) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F7FBF1',
    } as ViewStyle,
    header: {
      backgroundColor: theme.color('background'),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.space('md'),
      paddingVertical: theme.space('sm'),
    } as ViewStyle,
    backBtn: {
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
    } as ViewStyle,
    backTxt: {
      fontSize: 20,
    } as TextStyle,
    headerTitle: {
      fontSize: 20,
      fontWeight: '700',
    } as TextStyle,
    totalBar: {
      backgroundColor: '#F7FBF1',
      marginHorizontal: theme.space('md'),
      borderRadius: 8,
      paddingHorizontal: theme.space('md'),
      paddingVertical: theme.space('sm'),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    } as ViewStyle,
    totalLabel: {
      fontWeight: '700',
      fontSize: 22,
      color: theme.color('successLighter'),
    } as TextStyle,
    totalValue: {
      fontWeight: '700',
      fontSize: 22,
      color: theme.color('successLighter'),
    } as TextStyle,
    list: {
      flex: 1,
      paddingHorizontal: theme.space('md'),
      marginTop: 0,
    } as ViewStyle,
    addBtn: {
      margin: theme.space('md'),
      backgroundColor: '#A1CE50',
      borderRadius: 999,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.space('md'),
    } as ViewStyle,
    addTxt: {
      textTransform: 'uppercase',
      color: '#fff',
      fontSize: 18,
      fontWeight: '700',
    } as TextStyle,
  });
