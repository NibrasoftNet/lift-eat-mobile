/**
 * Layout pour la section Onboarding
 * Gère la navigation entre les écrans d'onboarding
 */

import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      <Stack.Screen name="splash" />
      <Stack.Screen name="walkthrough1" />
      <Stack.Screen name="walkthrough2" />
      <Stack.Screen name="walkthrough3" />
    </Stack>
  );
}
