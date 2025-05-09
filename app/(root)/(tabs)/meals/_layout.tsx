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

      {/* Community Tab */}
      <Tabs.Screen
        name="community"
        options={{
          tabBarLabel: ({ focused, color }) => (
            <Text style={{ color, fontWeight: focused ? 'bold' : 'normal' }}>
              Community
            </Text>
          ),
        }}
      />

      {/* Company Tab */}
      <Tabs.Screen
        name="company"
        options={{
          tabBarLabel: ({ focused, color }) => (
            <Text style={{ color, fontWeight: focused ? 'bold' : 'normal' }}>
              Company
            </Text>
          ),
        }}
      />
    </Tabs>
  );
}
