import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useFonts } from 'expo-font';
import {Slot, Stack, useRouter} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import {useEffect, useState} from 'react';
import 'react-native-reanimated';
import { useOnlineManager } from "@/hooks/useOnlineManager";
import { useAppState } from "@/hooks/useAppState";

import { useColorScheme } from '@/hooks/useColorScheme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Intro from "@/app/intro";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
    const router = useRouter();
    const [showIntro, setShowIntro] = useState<boolean>(true);

    useEffect(() => {
        if (showIntro) {
            router.replace('/intro');
        } else {
            router.replace('/auth/register');
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
            <Stack.Screen name="auth/register" options={{ headerShown: false }} />
            <Stack.Screen name="auth/login" options={{ headerShown: false }} />
            <Stack.Screen name="intro" options={{ headerShown: false }} />
        </Stack>
    );
};

export default function ProjectLayout() {
    const colorScheme = useColorScheme();

    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: 2 } },
    });

    // Use the custom hooks
    useOnlineManager();
    useAppState();


    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <GluestackUIProvider mode="light">
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <QueryClientProvider client={queryClient}>
                    <InitialLayout />
                    <StatusBar style="auto" />
                </QueryClientProvider>
            </ThemeProvider>
        </GluestackUIProvider>
    );
}