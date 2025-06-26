import React from 'react';
import { Stack } from 'expo-router';

// Ce layout permet de masquer toutes les routes IA de la navigation principale
export default function IALayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        // Cette option masque ces écrans de la navigation par onglets
        presentation: 'transparentModal',
      }}
    >
    </Stack>
  );
}
