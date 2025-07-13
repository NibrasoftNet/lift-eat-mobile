import React, { useMemo, useCallback, useState } from 'react';
import { ScrollView, View, StyleSheet, Pressable, ViewStyle, TextStyle } from 'react-native';
import { useTheme, ThemeInterface } from '@/themeNew';
import { useLocalSearchParams, router } from 'expo-router';
import { MealTypeEnum } from '@/utils/enum/meal.enum';
import { useMealsBySlot } from '@/utils/hooks/queries/useMealsBySlot';
import { useToast } from '@/components-new/ui/toast';

import MealSlotItem from '@/components-new/ui/molecules/meal-tracker/MealSlotItem';
import Text from '@/components-new/ui/atoms/base/Text';

import { useRemoveMealFromDailyPlan } from '@/utils/hooks/mutations/useRemoveMealFromDailyPlan';
import MealListDrawer from '@/components-new/ui/organisms/meal/MealListDrawer';
import { usePlanDetails } from '@/utils/hooks/queries/usePlanDetails';
import { planPagesService } from '@/utils/services/pages/plan-pages.service';
import { getCurrentUserIdSync } from '@/utils/helpers/userContext';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

/**
 * Page Liste des repas pour un créneau (breakfast, lunch, dinner, snack)
 * URL: /plans/my-plans/details/[id]/slot/[slot]
 * Params: id (planId), slot (MealTypeEnum), date (YYYY-MM-DD)
 */
export default function SlotMealsScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const toast = useToast();
  const { id: planIdParam, slot: slotParam, date, openAdd } = useLocalSearchParams<{ id: string; slot: string; date: string; openAdd?: string }>();
  const [showDrawer, setShowDrawer] = useState(openAdd === '1');

  const planId = Number(planIdParam);
  const slot = slotParam as MealTypeEnum;

  // --- QUERIES ---
  const {
    data: mealsData,
    isLoading,
    refetch,
  } = useMealsBySlot({ planId, date, slot });

  // Fetch plan details to get dailyPlanId
  const { data: planDetailsData } = usePlanDetails(planId);
  const dailyPlanId = planDetailsData?.dailyPlans?.find((dp: any) => dp.date === date)?.id;

  // --- REMOVE MEAL MUTATION ---
  const removeMealMutation = useRemoveMealFromDailyPlan();

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
                <Text key={id} style={{ color: '#fff', padding: 8 }}>Repas supprimé</Text>
              ),
            });
            refetch();
          },
          onError: () => {
            toast.show({
              placement: 'top',
              render: ({ id }) => (
                <Text key={id} style={{ color: '#fff', padding: 8 }}>Suppression impossible</Text>
              ),
            });
          },
        },
      );
    },
    [mealsData, planId, date, slot],
  );

  // --- NAVIGATION BACK ---
  const goBack = () => router.back();

  // --- TOTAL KCAL ---
  const totalCalories = mealsData?.meals?.reduce((sum: number, m: any) => sum + (m.calories || 0), 0) || 0;

  const title = slot.charAt(0).toUpperCase() + slot.slice(1).toLowerCase();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={goBack} hitSlop={8} style={styles.backBtn}>
          {/* Arrow Left icon placeholder */}
          <Text style={styles.backTxt}>{'<'}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Total bar */}
      <View style={styles.totalBar}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{totalCalories} kcal</Text>
      </View>

      {/* Meals list */}
      <ScrollView style={styles.list}>
        {mealsData?.meals?.map((meal: any) => (
          <MealSlotItem
            key={meal.id}
            title={meal.name}
            consumedCalories={meal.calories}
            goalCalories={0}
            hasMeals={true}
            slot={slot}
            onPress={() => {/* TODO: details */}}
            onRemovePress={() => handleRemoveMeal(meal.id)}
          />
        ))}
      </ScrollView>

      {/* Add button */}
      <Pressable
        style={styles.addBtn}
        onPress={() => setShowDrawer(true)}
      >
        <Text style={styles.addTxt}>+  Add</Text>
      </Pressable>

      {/* Drawer d'ajout de repas */}
      <MealListDrawer
        showMealsDrawer={showDrawer}
        setShowMealsDrawer={setShowDrawer}
        dailyPlanId={dailyPlanId ?? 0}
        planId={planId}
        onAddMealToPlan={planPagesService.addMealToDailyPlan}
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
      backgroundColor: '#F7F7F7',
    } as ViewStyle,
    header: {
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
      backgroundColor: '#fff',
      marginHorizontal: theme.space('md'),
      borderRadius: 8,
      paddingHorizontal: theme.space('md'),
      paddingVertical: theme.space('sm'),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    } as ViewStyle,
    totalLabel: {
      fontWeight: '600',
      fontSize: 16,
    } as TextStyle,
    totalValue: {
      fontWeight: '600',
      fontSize: 16,
    } as TextStyle,
    list: {
      flex: 1,
      paddingHorizontal: theme.space('md'),
      marginTop: theme.space('sm'),
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
      color: '#fff',
      fontSize: 18,
      fontWeight: '700',
    } as TextStyle,
  });
