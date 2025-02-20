import { Stack, Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {

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
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false , animation : "slide_from_left" }} />
    </Stack>
  );
}
