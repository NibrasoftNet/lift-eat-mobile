import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import '@/global.css';
import { useFonts } from 'expo-font';
import ErrorBoundary from 'react-native-error-boundary';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { Suspense, useEffect } from 'react';
import 'react-native-reanimated';
import { useOnlineManager } from '@/hooks/useOnlineManager';
import { useAppState } from '@/hooks/useAppState';

import { useColorScheme } from '@/hooks/useColorScheme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useReactQueryDevTools } from '@dev-plugins/react-query';
import { ActivityIndicator, GestureResponderEvent } from 'react-native';
import { openDatabaseSync, SQLiteProvider } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '@/drizzle/migrations';
import { addDummyData } from '@/db/addDummyData';
import { DrizzleProvider } from '@/utils/providers/DrizzleProvider';
import useSessionStore from '@/utils/store/sessionStore';
import '@/i18n';
import { VStack } from '@/components/ui/vstack';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { CloudAlert } from 'lucide-react-native';
import { tokenCache } from '@/cache';
import { ConvexReactClient } from 'convex/react';
import { ClerkLoaded, ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { Colors } from '@/utils/constants/Colors';
import Toast from 'react-native-toast-message';

SplashScreen.preventAutoHideAsync();
export const DATABASE_NAME = 'lift_eat_db';

// Init convex client
/* const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
}); */

const InitialLayout = () => {
  const router = useRouter();
  const { user } = useSessionStore();
  useEffect(() => {
    if (!user) {
      router.replace('/intro');
    } else if (user.id === 0) {
      router.replace('/login');
    } else {
      router.replace('/register');
    }
  }, []);

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
      <Stack.Screen name="(root)" options={{ headerShown: false }} />
      <Stack.Screen name="intro" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" options={{ headerShown: false }} />
    </Stack>
  );
};

export default function ProjectLayout() {
  const colorScheme = useColorScheme();
  const expoDb = openDatabaseSync(DATABASE_NAME);
  const db = drizzle(expoDb);
  const { success, error } = useMigrations(db, migrations);
  const [loaded] = useFonts({
    'Ubuntu-Regular': require('../assets/fonts/Ubuntu-Regular.ttf'),
    'Ubuntu-Bold': require('../assets/fonts/Ubuntu-Bold.ttf'),
    'Ubuntu-BoldItalic': require('../assets/fonts/Ubuntu-BoldItalic.ttf'),
    'Ubuntu-Italic': require('../assets/fonts/Ubuntu-Italic.ttf'),
    'Ubuntu-Light': require('../assets/fonts/Ubuntu-Light.ttf'),
    'Ubuntu-LightItalic': require('../assets/fonts/Ubuntu-LightItalic.ttf'),
    'Ubuntu-Medium': require('../assets/fonts/Ubuntu-Medium.ttf'),
    'Ubuntu-MediumItalic': require('../assets/fonts/Ubuntu-MediumItalic.ttf'),
  });

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: 2 } },
  });
  // Enable Tanstack query dev tools
  useReactQueryDevTools(queryClient);

  // Use the custom hooks
  useOnlineManager();
  useAppState();

  useEffect(() => {
    if (error) {
      console.log('errr', error);
    }
    if (success) {
      addDummyData(db);
    }
  }, [success]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    console.log('Font not loaded');
    return null;
  }

  const ErrorFallback = ({
    error,
    resetError,
  }: {
    error: Error;
    resetError: (event: GestureResponderEvent) => void;
  }) => (
    <VStack className="size-full items-center justify-center gap-4 p-4">
      <CloudAlert size={30} color={Colors.red.icon} />
      <Text>Oops! Something went wrong:</Text>
      <Text>{error.toString()}</Text>
      <Button className="w-full mt-10 mx-2" onPress={resetError}>
        <ButtonText>Reset</ButtonText>
      </Button>
    </VStack>
  );

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <QueryClientProvider client={queryClient}>
        {/*          <ClerkProvider
            tokenCache={tokenCache}
            publishableKey="pk_test_YW1hemluZy13ZXJld29sZi02NS5jbGVyay5hY2NvdW50cy5kZXYk"
          >
            <ClerkLoaded>
              <ConvexProviderWithClerk client={convex} useAuth={useAuth}>*/}
        <Suspense fallback={<ActivityIndicator size="large" />}>
          <SQLiteProvider
            databaseName={DATABASE_NAME}
            options={{ enableChangeListener: true }}
            useSuspense
          >
            <DrizzleProvider>
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <InitialLayout />
                <StatusBar style="auto" hidden={true} />
                <Toast />
              </ErrorBoundary>
            </DrizzleProvider>
          </SQLiteProvider>
        </Suspense>
        {/*              </ConvexProviderWithClerk>
            </ClerkLoaded>
          </ClerkProvider>*/}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
