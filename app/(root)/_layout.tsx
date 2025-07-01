import { Stack } from 'expo-router';
import 'react-native-reanimated';
import { ClerkProvider } from '@clerk/clerk-expo';
import { ConvexProvider } from 'convex/react';
import { ConvexReactClient } from 'convex/react';
import Constants from 'expo-constants';

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL as string);

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string}>
      <ConvexProvider client={convex}>
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
          <Stack.Screen name="(user)" options={{ headerShown: false }} />
        </Stack>
      </ConvexProvider>
    </ClerkProvider>
  );
}
