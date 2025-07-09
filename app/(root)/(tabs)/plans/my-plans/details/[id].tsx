// Re-export of the full Plan Details screen logic.
// The complete implementation lives in `[id] copy.tsx` (kept for historical comparison).
// This wrapper ensures the route `/plans/my-plans/details/[id]` resolves correctly
// without duplicating the large component code.

import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import CalorieTracker from '@/components-new/ui/organisms/calorie-tracker/CalorieTracker';
import { ScrollView } from 'react-native';
import MealSlotsList from '@/components-new/ui/molecules/meal-tracker/MealSlotsList';

/**
 * Lightweight Plan Details screen – UI-only version.
 * For now we simply embed the CalorieTracker organism with placeholder data.
 * No business logic / click handlers yet – they will be wired later.
 */
export default function PlanDetailsScreen() {
  // We keep the id from the route for future use.
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ScrollView className="flex-1 bg-background-50 p-4" showsVerticalScrollIndicator={false}>
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

      {/* Liste des créneaux repas */}
      <MealSlotsList
        slots={[
          { key: 'breakfast', title: 'Breakfast', consumed: 824, goal: 768, hasMeals: true },
          { key: 'lunch', title: 'Lunch', consumed: 810, goal: 768, hasMeals: true },
          { key: 'dinner', title: 'Dinner', consumed: 0, goal: 768, hasMeals: false },
          { key: 'snacks', title: 'Snacks', consumed: 0, goal: 256, hasMeals: false },
        ]}
      />
    </ScrollView>

  );
}