import {Slot, Stack, useRouter} from 'expo-router';
import 'react-native-reanimated';


export default function RootLayout() {
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
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
  );
}