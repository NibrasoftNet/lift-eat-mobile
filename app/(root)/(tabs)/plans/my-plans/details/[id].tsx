// Re-export of the full Plan Details screen logic.
// The complete implementation lives in `[id] copy.tsx` (kept for historical comparison).
// This wrapper ensures the route `/plans/my-plans/details/[id]` resolves correctly
// without duplicating the large component code.

import React, { useMemo, useEffect, useCallback } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import CalorieTracker from '@/components-new/ui/organisms/calorie-tracker/CalorieTracker';
import NutrioCalendar from '@/components-new/ui/molecules/calendar/NutrioCalendar';
import { ScrollView, View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme, ThemeInterface } from '@/themeNew';
import MealSlotsList from '@/components-new/ui/molecules/meal-tracker/MealSlotsList';
import { usePlanStore } from '@/utils/store/planStore';
import { usePlanDetails } from '@/utils/hooks/queries/usePlanDetails';
import { useDailyNutrition } from '@/utils/hooks/queries/useDailyNutrition';
import { usePlanNutritionGoals } from '@/utils/hooks/queries/usePlanNutritionGoals';
import { useMealsBySlot } from '@/utils/hooks/queries/useMealsBySlot';
import { MealTypeEnum } from '@/utils/enum/meal.enum';
import { useRemoveMealFromDailyPlan } from '@/utils/hooks/mutations/useRemoveMealFromDailyPlan';
import { useToast } from '@/components-new/ui/toast';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import MultiPurposeToast from '@/components-new/MultiPurposeToast';
import { ToastTypeEnum } from '@/utils/enum/general.enum';

// Emoji images for each meal slot
const IMG_BREAKFAST = require('@/assets/emoji/Emoji=Sandwich, Component=Fluent Emojis.png');
const IMG_LUNCH = require('@/assets/emoji/Emoji=Cooked rice, Component=Fluent Emojis.png');
const IMG_DINNER = require('@/assets/emoji/Emoji=Meat on bone, Component=Fluent Emojis.png');
const IMG_SNACKS = require('@/assets/emoji/Emoji=Green salad, Component=Fluent Emojis.png');

/**
 * Lightweight Plan Details screen – UI-only version.
 * For now we simply embed the CalorieTracker organism with placeholder data.
 * No business logic / click handlers yet – they will be wired later.
 */
export default function PlanDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const selectedDate = usePlanStore((s) => s.selectedDate);
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  // ---- STORE ----
  const setSelectedDate = usePlanStore((s) => s.setSelectedDate);
  const getDayPlanByDate = usePlanStore((s) => s.getDayPlanByDate);
  const setCurrentPlan = usePlanStore((s) => s.setCurrentPlan);

  // ---- DATA FETCHING ----
  const {
    data: planDetails,
    isSuccess: isPlanLoaded,
  } = usePlanDetails(Number(id));

  // When plan loaded, hydrate store & ensure selectedDate fits the plan
  useEffect(() => {
    if (isPlanLoaded && planDetails) {
      const mergedPlan = {
        ...planDetails.plan,
        dailyPlans: planDetails.dailyPlans,
      } as any; // TODO: strong typing later

      setCurrentPlan(mergedPlan);

      // If no date selected OR date not in current plan, default to first day of plan
      const dateInPlan = mergedPlan.dailyPlans?.some((dp: any) => dp.date === selectedDate);
      if (!selectedDate || !dateInPlan) {
        if (mergedPlan.dailyPlans?.length) {
          setSelectedDate(mergedPlan.dailyPlans[0].date);
        }
      }
    }
  }, [isPlanLoaded, planDetails]);

  // Get dailyPlanId for hooks
  const dailyPlan = getDayPlanByDate(selectedDate);
  const dailyPlanId = dailyPlan?.id ?? 0;

  const { data: nutritionData } = useDailyNutrition({
    planId: Number(id),
    date: selectedDate || '',
  });

  // Fetch global nutrition goals for the plan
  const { data: goalsData } = usePlanNutritionGoals({ planId: Number(id) });

  const makeMealsHook = (slot: MealTypeEnum) =>
    selectedDate
      ? useMealsBySlot({ planId: Number(id), date: selectedDate, slot })
      : { data: undefined, isLoading: false };

  const { data: breakfastData, isLoading: loadingBreakfast } = makeMealsHook(MealTypeEnum.BREAKFAST);
  const { data: lunchData, isLoading: loadingLunch } = makeMealsHook(MealTypeEnum.LUNCH);
  const { data: dinnerData, isLoading: loadingDinner } = makeMealsHook(MealTypeEnum.DINNER);
  const { data: snacksData, isLoading: loadingSnacks } = makeMealsHook(MealTypeEnum.SNACK);

  // --- MUTATION REMOVE MEAL ---
  const toast = useToast();
  const removeMealMutation = useRemoveMealFromDailyPlan();

  const handleRemoveMeal = useCallback(
    (key: string) => {
      if (!dailyPlanId) return;
      let mealId: number | undefined;
      let slot: MealTypeEnum;
      let meals: any[] = [];
      switch (key) {
        case 'breakfast':
          meals = breakfastData?.meals || [];
          slot = MealTypeEnum.BREAKFAST;
          break;
        case 'lunch':
          meals = lunchData?.meals || [];
          slot = MealTypeEnum.LUNCH;
          break;
        case 'dinner':
          meals = dinnerData?.meals || [];
          slot = MealTypeEnum.DINNER;
          break;
        case 'snacks':
        default:
          meals = snacksData?.meals || [];
          slot = MealTypeEnum.SNACK;
      }
      if (!meals.length) return;
      mealId = meals[0].id;
      removeMealMutation.mutate(
        {
          planId: Number(id),
          date: selectedDate,
          dailyPlanId,
          mealId: mealId!,
          slot,
        },
        {
          onSuccess: () => {
            toast.show({
              placement: 'top',
              render: ({ id }) => (
                <MultiPurposeToast
                  id={id as string}
                  color={ToastTypeEnum.SUCCESS}
                  title="Succès"
                  description="Repas supprimé"
                />
              ),
            });
          },
          onError: () => {
            toast.show({
              placement: 'top',
              render: ({ id }) => (
                <MultiPurposeToast
                  id={id as string}
                  color={ToastTypeEnum.ERROR}
                  title="Erreur"
                  description="Suppression impossible"
                />
              ),
            });
          },
        },
      );
    },
    [dailyPlanId, breakfastData, lunchData, dinnerData, snacksData, selectedDate],
  );

  const slotEnumMap: Record<string, MealTypeEnum> = {
    breakfast: MealTypeEnum.BREAKFAST,
    lunch: MealTypeEnum.LUNCH,
    dinner: MealTypeEnum.DINNER,
    snacks: MealTypeEnum.SNACK,
  };

  const navigateToSlot = (
    slot: MealTypeEnum,
    extraParams: Record<string, any> = {},
  ) => {
    if (!selectedDate) {
      logger.warn(LogCategory.UI, 'Attempted navigation without selectedDate');
      return;
    }
    router.push({
      pathname: '/plans/my-plans/details/slot/[slot]',
      params: { slot, id, date: selectedDate, ...extraParams },
    });
  };

  const handleSlotPress = useCallback(
    (key: string) => {
      const slot = slotEnumMap[key];
      if (!slot) return;
      if (!selectedDate) {
        logger.warn(LogCategory.UI, 'Attempted navigation without selectedDate', { key });
        return;
      }
      logger.info(LogCategory.UI, 'Navigate to slot page', {
        planId: id,
        date: selectedDate,
        slot,
      });
      navigateToSlot(slot);
    },
    [selectedDate, id, navigateToSlot],
  );

  const handleAddMeal = useCallback(
    (key: string) => {
      const slot = slotEnumMap[key];
      if (!slot) return;
      navigateToSlot(slot, { openAdd: '1' });
    },
    [navigateToSlot],
  );

  const slotToProps = (
    key: string,
    title: string,
    hookData: any,
    icon: any,
    slot: MealTypeEnum,
    loading: boolean,
  ) => {
    const meals = hookData?.data?.meals || [];
    const consumed = meals.reduce(
      (sum: number, m: any) => sum + (m.calories || 0),
      0,
    );
    const goal = dailyPlan?.calories ?? 0; // fallback
    return {
      key,
      title,
      consumed,
      goal,
      hasMeals: meals.length > 0,
      icon,
      slot,
      isLoading: loading,
    };
  };

  // ---- CALENDAR MARKERS & RANGE ----
  const markedDates = planDetails?.dailyPlans?.reduce(
    (acc: any, dp: any) => {
      acc[dp.date] = {
        marked: true,
        selected: dp.date === selectedDate,
      };
      return acc;
    },
    {} as any,
  );

  // Compute calendar bounds (start & end of current plan)
  const planStartDate = planDetails?.dailyPlans?.[0]?.date;
  const planEndDate = planDetails?.dailyPlans?.[planDetails?.dailyPlans?.length - 1]?.date;

  const handleDayPress = useCallback((day: any) => {
    setSelectedDate(day.dateString);
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {planDetails && (
        <View style={styles.calendarWrapper}>
          <NutrioCalendar
             minDate={planStartDate}
             maxDate={planEndDate}
            initialDate={selectedDate}
            markedDates={markedDates}
            onDayPress={handleDayPress}
          />
        </View>
      )}

      <View style={styles.card}>
        <CalorieTracker
          date={selectedDate ? new Date(selectedDate) : new Date()}
          consumedCalories={(nutritionData as any)?.data?.macros?.calories || 0}
          goalCalories={(goalsData as any)?.data?.macros?.calories || 0}
          walkingCalories={0}
          activityCalories={0}
          carbs={{
            current: (nutritionData as any)?.data?.macros?.carbs || 0,
            goal: (goalsData as any)?.data?.macros?.carbs || 0,
          }}
          protein={{
            current: (nutritionData as any)?.data?.macros?.protein || 0,
            goal: (goalsData as any)?.data?.macros?.protein || 0,
          }}
          fat={{
            current: (nutritionData as any)?.data?.macros?.fat || 0,
            goal: (goalsData as any)?.data?.macros?.fat || 0,
          }}
          foodItems={[]}
        />
      </View>

      <View style={styles.spacer} />

      <MealSlotsList
        onSlotPress={handleSlotPress}
        onAdd={handleAddMeal}
        onRemove={handleRemoveMeal}
        slots={[
          slotToProps('breakfast', 'Breakfast', breakfastData, IMG_BREAKFAST, MealTypeEnum.BREAKFAST, loadingBreakfast),
          slotToProps('lunch', 'Lunch', lunchData, IMG_LUNCH, MealTypeEnum.LUNCH, loadingLunch),
          slotToProps('dinner', 'Dinner', dinnerData, IMG_DINNER, MealTypeEnum.DINNER, loadingDinner),
          slotToProps('snacks', 'Snacks', snacksData, IMG_SNACKS, MealTypeEnum.SNACK, loadingSnacks),
        ]}
      />

      <View style={styles.spacer2} />
    </ScrollView>
  );
}

const createStyles = (theme: ThemeInterface) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.color('successLighter'),
      padding: theme.space('sm'),
    },
    spacer: {
      height: theme.space('md'),
    },
    spacer2: {
      height: theme.space('xl'),
    },
    calendarWrapper: {
      marginBottom: theme.space('md'),
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: theme.space('md'),
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    } as ViewStyle,
  });
