import { Stack } from 'expo-router';
import 'react-native-reanimated';

export default function NewPlanLayout() {
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
        options={{ animation: 'fade_from_bottom', animationDuration: 600 }}
      />
      <Stack.Screen
        name="target/index"
        options={{ animation: 'fade_from_bottom', animationDuration: 600 }}
      />

      <Stack.Screen
        name="target/edit/[id]"
        options={{ animation: 'fade_from_bottom', animationDuration: 600 }}
      />
    </Stack>
  );
}
