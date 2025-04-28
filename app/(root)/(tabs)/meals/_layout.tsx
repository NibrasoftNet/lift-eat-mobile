import React from 'react';
import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function MealsLayout() {
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
          height: '100%',
          padding: 0,
          margin: 10,
        },
        tabBarActiveTintColor: 'orange',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      {/* Mine Tab */}
      <Tabs.Screen
        name="my-meals"
        options={{
          tabBarLabel: ({ focused, color }) => (
            <Text style={{ color, fontWeight: focused ? 'bold' : 'normal' }}>
              Mine
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
              Scanner
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
              Recherche
            </Text>
          ),
        }}
      />

      {/* Test Recherche Tab - pour diagnostic */}
      <Tabs.Screen
        name="test-search"
        options={{
          tabBarLabel: ({ focused, color }) => (
            <Text style={{ color, fontWeight: focused ? 'bold' : 'normal' }}>
              Test-API
            </Text>
          ),
        }}
      />
    </Tabs>
  );
}
