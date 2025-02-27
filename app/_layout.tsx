import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import {Suspense, useEffect, useState } from 'react';
import 'react-native-reanimated';
import { useOnlineManager } from "@/hooks/useOnlineManager";
import { useAppState } from "@/hooks/useAppState";

import { useColorScheme } from '@/hooks/useColorScheme';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { useReactQueryDevTools } from '@dev-plugins/react-query';
import {ActivityIndicator, View} from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import ErrorBoundary from "react-native-error-boundary";
import { openDatabaseSync, SQLiteProvider } from "expo-sqlite";
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '@/drizzle/migrations';
import { addDummyData } from "@/db/addDummyData";

SplashScreen.preventAutoHideAsync();
export const DATABASE_NAME = 'lift_eat_db';

const InitialLayout = () => {
    const router = useRouter();
    const [showIntro] = useState<boolean>(true);

    useEffect(() => {
        if (showIntro) {
            router.replace('/plans/my-plans');
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
        if (error) {
            console.log("error occurred", error);
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

    const ErrorFallback = ({ error, resetError }: any) => (
        <View>
            <Text>Oops! Something went wrong:</Text>
            <Text>{error.toString()}</Text>
            <Button onPress={resetError}>Reset</Button>
        </View>
    );

    return (
        <GluestackUIProvider mode="light">
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <QueryClientProvider client={queryClient}>
                    <Suspense fallback={<ActivityIndicator size="large" />}>
                        <SQLiteProvider
                            databaseName={DATABASE_NAME}
                            options={{ enableChangeListener: true }}
                            useSuspense>
                            <ErrorBoundary FallbackComponent={ErrorFallback}>
                                <InitialLayout />
                                <StatusBar style="auto" hidden={true} />
                    </ErrorBoundary>
                        </SQLiteProvider>
                    </Suspense>
                </QueryClientProvider>
            </ThemeProvider>
        </GluestackUIProvider>
    );
}
