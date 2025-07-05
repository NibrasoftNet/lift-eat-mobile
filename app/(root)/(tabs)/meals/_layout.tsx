import React from 'react';
import { Colors } from '@/utils/constants/Colors';
import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function MealsLayout() {
  const { t } = useTranslation();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarIconStyle: { display: 'none' },
        tabBarPosition: 'top',
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: 'bold',
          textTransform: 'capitalize',
        },
        tabBarStyle: {
          paddingVertical: 0,
        },
        tabBarItemStyle: {
          // height supprimé car non supporté par Animated et provoque une erreur
          padding: 0,
          margin: 10,
        },
        tabBarActiveTintColor: Colors.primary.tabIconSelected,
        tabBarInactiveTintColor: Colors.grey,
      }}
    >
      {/* Mine Tab */}
      <Tabs.Screen
        name="my-meals"
        options={{
          tabBarLabel: ({ focused, color }) => (
            <Text style={{ color, fontWeight: focused ? 'bold' : 'normal' }}>
              {t('meal.tabs.myMeals')}
            </Text>
          ),
        }}
      />

      {/* Scanner Tab */}
      <Tabs.Screen
        name="scanner"
        options={{
          tabBarLabel: ({ focused, color }) => (
            <Text style={{ color, fontWeight: focused ? 'bold' : 'normal' }}>
              {t('meal.tabs.scanner')}
            </Text>
          ),
        }}
      />

      {/* Recherche Tab */}
      <Tabs.Screen
        name="search"
        options={{
          tabBarLabel: ({ focused, color }) => (
            <Text style={{ color, fontWeight: focused ? 'bold' : 'normal' }}>
              {t('meal.tabs.search')}
            </Text>
          ),
        }}
      />
    </Tabs>
  );
}
