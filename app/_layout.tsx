import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import '@/global.css';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
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
import { Icon } from '@/components/ui/icon';
import { CloudAlert } from 'lucide-react-native';

SplashScreen.preventAutoHideAsync();
export const DATABASE_NAME = 'lift_eat_db';

const InitialLayout = () => {
  const router = useRouter();
  const { user } = useSessionStore();
  useEffect(() => {
    if (!user) {
      router.replace('/login');
    } else {
      router.replace('/analytics');
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
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
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
    console.log(success, 'errr', error);
    if (error) {
      console.log('error occurred', error);
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
      <Icon as={CloudAlert} className="w-10 h-10 text-red-500" />
      <Text>Oops! Something went wrong:</Text>
      <Text>{error.toString()}</Text>
      <Button className="w-full mt-10 text-white" onPress={resetError}>
        <ButtonText>Reset</ButtonText>
      </Button>
    </VStack>
  );

  return (
    <GluestackUIProvider mode="system">
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <QueryClientProvider client={queryClient}>
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
                </ErrorBoundary>
              </DrizzleProvider>
            </SQLiteProvider>
          </Suspense>
        </QueryClientProvider>
      </ThemeProvider>
    </GluestackUIProvider>
  );
}
