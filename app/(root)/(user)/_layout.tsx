import { Stack } from "expo-router";
import React from "react";

export default function UserPreferenceLayout() {

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "none",
        orientation: "portrait",
        navigationBarHidden: true,
        statusBarHidden: true,
      }}
    >
      <Stack.Screen name="preference" options={{ headerShown: false }} />
      <Stack.Screen name="details" options={{ headerShown: false , animation : "slide_from_left" }} />
    </Stack>
  );
}
