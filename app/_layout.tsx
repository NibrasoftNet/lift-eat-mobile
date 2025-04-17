import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import '@/global.css';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { useFonts } from 'expo-font';
import ErrorBoundary from 'react-native-error-boundary';
import { Slot, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { Suspense, useEffect, useState } from 'react';
import 'react-native-reanimated';
import { useOnlineManager } from '@/hooks/useOnlineManager';
import { useAppState } from '@/hooks/useAppState';
import { useColorScheme } from '@/hooks/useColorScheme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useReactQueryDevTools } from '@dev-plugins/react-query';
import { ActivityIndicator, GestureResponderEvent, View } from 'react-native';
import { openDatabaseSync, SQLiteProvider } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '@/drizzle/migrations';
import { addDummyData } from '@/db/addDummyData';
import { DrizzleProvider } from '@/utils/providers/DrizzleProvider';
import MCPProvider from '@/utils/providers/MCPProvider';
import useSessionStore from '@/utils/store/sessionStore';
import '@/i18n';
import { VStack } from '@/components/ui/vstack';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { CloudAlert } from 'lucide-react-native';
import { tokenCache } from '@/cache';

SplashScreen.preventAutoHideAsync();
export const DATABASE_NAME = 'lift_eat_db';

// Temporarily commented out for Convex branch work
// const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
//   unsavedChangesWarning: false,
// });

export default function ProjectLayout() {
  const colorScheme = useColorScheme();
  const [isDbReady, setIsDbReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const expoDb = openDatabaseSync(DATABASE_NAME);
  const db = drizzle(expoDb);
  const { success, error: migrationError } = useMigrations(db, migrations);
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
    defaultOptions: { 
      queries: { 
        retry: 2,
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 30, // 30 minutes
      } 
    },
  });

  // Use the custom hooks
  useOnlineManager();
  useAppState();

  useEffect(() => {
    const initDb = async () => {
      try {
        if (migrationError) {
          throw migrationError;
        }
        if (success) {
          await addDummyData(db);
          setIsDbReady(true);
        }
      } catch (err) {
        console.error('Database initialization error:', err);
        setError(err instanceof Error ? err : new Error('Database initialization failed'));
      }
    };

    initDb();
  }, [success, migrationError]);

  useEffect(() => {
    const hideSplash = async () => {
      try {
        if (loaded && isDbReady) {
          await SplashScreen.hideAsync();
        }
      } catch (err) {
        console.error('Error hiding splash screen:', err);
      }
    };

    hideSplash();
  }, [loaded, isDbReady]);

  if (!loaded || !isDbReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <VStack className="size-full items-center justify-center gap-4 p-4">
        <Icon as={CloudAlert} className="w-10 h-10 text-red-500" />
        <Text>Une erreur est survenue lors de l'initialisation:</Text>
        <Text>{error.message}</Text>
      </VStack>
    );
  }

  const ErrorFallback = ({
    error,
    resetError,
  }: {
    error: Error;
    resetError: (event: GestureResponderEvent) => void;
  }) => (
    <VStack className="size-full items-center justify-center gap-4 p-4">
      <Icon as={CloudAlert} className="w-10 h-10 text-red-500" />
      <Text>Une erreur est survenue:</Text>
      <Text>{error.toString()}</Text>
      <Button className="w-full mt-10 mx-2" onPress={resetError}>
        <ButtonText>Réessayer</ButtonText>
      </Button>
    </VStack>
  );

  return (
    <GluestackUIProvider mode="system">
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <QueryClientProvider client={queryClient}>
          {/* Temporarily commented out for Convex branch work */}
          {/* <ClerkProvider
            tokenCache={tokenCache}
            publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
          >
            <ClerkLoaded>
              <ConvexProviderWithClerk client={convex} useAuth={useAuth}> */}
                <Suspense fallback={
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#0000ff" />
                  </View>
                }>
                  <SQLiteProvider
                    databaseName={DATABASE_NAME}
                    options={{ enableChangeListener: true }}
                    useSuspense
                  >
                    <DrizzleProvider>
                      <MCPProvider>
                        <ErrorBoundary FallbackComponent={ErrorFallback}>
                          <Slot />
                          <StatusBar style="auto" hidden={true} />
                        </ErrorBoundary>
                      </MCPProvider>
                    </DrizzleProvider>
                  </SQLiteProvider>
                </Suspense>
              {/* </ConvexProviderWithClerk>
            </ClerkLoaded>
          </ClerkProvider> */}
        </QueryClientProvider>
      </ThemeProvider>
    </GluestackUIProvider>
  );
}
