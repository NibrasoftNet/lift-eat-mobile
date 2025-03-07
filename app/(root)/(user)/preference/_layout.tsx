import { Stack } from 'expo-router';
import React from 'react';

export default function UserPreferenceLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'none',
        orientation: 'portrait',
        navigationBarHidden: true,
        statusBarHidden: true,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          animation: 'slide_from_bottom',
          animationDuration: 1000,
        }}
      />
      <Stack.Screen
        name="edit/[id]"
        options={{
          presentation: 'modal',
          headerShown: false,
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}
