import { Stack } from 'expo-router';
import 'react-native-reanimated';

export default function ScannerLayout() {
  return (
      <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            orientation: 'portrait',
            navigationBarHidden: true,
            statusBarHidden: true,
          }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="Foods" options={{ headerShown: false }} />
      </Stack>
  );
}
