// Re-export of the full Plan Details screen logic.
// The complete implementation lives in `[id] copy.tsx` (kept for historical comparison).
// This wrapper ensures the route `/plans/my-plans/details/[id]` resolves correctly
// without duplicating the large component code.

import React, { useMemo } from 'react';
import { useLocalSearchParams } from 'expo-router';
import CalorieTracker from '@/components-new/ui/organisms/calorie-tracker/CalorieTracker';
import { ScrollView, View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme, ThemeInterface } from '@/themeNew';
import MealSlotsList from '@/components-new/ui/molecules/meal-tracker/MealSlotsList';

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
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <CalorieTracker
          // static placeholders – will be replaced with real data later
          consumedCalories={0}
          goalCalories={2000}
          walkingCalories={0}
          activityCalories={0}
          carbs={{ current: 0, goal: 0 }}
          protein={{ current: 0, goal: 0 }}
          fat={{ current: 0, goal: 0 }}
          foodItems={[]}
          // omit callbacks for now (UI only)
        />
      </View>

      {/* Espace */}
      <View style={styles.spacer} />

      {/* Liste des créneaux repas */}
      <MealSlotsList
        slots={[
          {
            key: 'breakfast',
            title: 'Breakfast',
            consumed: 824,
            goal: 768,
            hasMeals: true,
            icon: IMG_BREAKFAST,
          },
          {
            key: 'lunch',
            title: 'Lunch',
            consumed: 810,
            goal: 768,
            hasMeals: true,
            icon: IMG_LUNCH,
          },
          {
            key: 'dinner',
            title: 'Dinner',
            consumed: 0,
            goal: 768,
            hasMeals: false,
            icon: IMG_DINNER,
          },
          {
            key: 'snacks',
            title: 'Snacks',
            consumed: 0,
            goal: 256,
            hasMeals: false,
            icon: IMG_SNACKS,
          },
        ]}
      />
      {/* Espace */}
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
    card: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: theme.space('md'),
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    } as ViewStyle,
  });
