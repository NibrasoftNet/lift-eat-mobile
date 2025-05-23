import { Stack } from 'expo-router';
import 'react-native-reanimated';

export default function MyPlansLayout() {
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
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="create"
        options={{ animation: 'fade_from_bottom', animationDuration: 600 }}
      />
      <Stack.Screen
        name="details/[id]"
        options={{
          presentation: 'modal',
          headerShown: false,
          headerShadowVisible: false,
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
