import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import '@/global.css';

import { useFonts } from 'expo-font';
import ErrorBoundary from 'react-native-error-boundary';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { Suspense, useEffect, useState } from 'react';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { configureReanimated } from '@/utils/config/reanimated-config';
import { useOnlineManager } from '@/hooks/useOnlineManager';
import { useAppState } from '@/hooks/useAppState';
import { useColorScheme } from '@/hooks/useColorScheme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useReactQueryDevTools } from '@dev-plugins/react-query';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
// Le fichier logging-interceptor.ts a été supprimé
import { ActivityIndicator, GestureResponderEvent, View, Text as RNText, StyleSheet } from 'react-native';
import { openDatabaseSync, SQLiteProvider } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '@/drizzle/migrations';
import { addDummyData } from '@/db/addDummyData';
import { DrizzleProvider } from '@/utils/providers/DrizzleProvider';
import MCPProvider from '@/utils/providers/MCPProvider';
import UserContextProvider from '@/utils/providers/UserContextProvider';
import useSessionStore from '@/utils/store/sessionStore';
import '@/i18n';
import Box from '@/components-new/ui/atoms/base/Box';
import Button from '@/components-new/ui/atoms/inputs/Button';
import Text from '@/components-new/ui/atoms/base/Text';
import Icon from '@/components-new/ui/atoms/display/Icon';
import { CloudAlert } from 'lucide-react-native';
import { ThemeProvider as AppThemeProvider } from '@/utils/providers/ThemeProvider';
import { tokenCache } from '@/cache';
import { setQueryClient } from '@/utils/helpers/queryClient';
import { prefetchEssentialData } from '@/utils/helpers/prefetchData';

// Configurer Reanimated pour désactiver les avertissements du mode strict
configureReanimated();

// Empêcher la disparition automatique du SplashScreen
try {
  SplashScreen.preventAutoHideAsync();
  logger.info(LogCategory.UI, 'SplashScreen.preventAutoHideAsync appelé avec succès');
} catch (error) {
  logger.error(LogCategory.UI, 'Erreur lors de preventAutoHideAsync', error);
}
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

  setQueryClient(queryClient);

  // Use the custom hooks
  useOnlineManager();
  useAppState();

  // Ancienne configuration de logs supprimée
  useEffect(() => {
    logger.info(LogCategory.APP, 'Application démarrée');
  }, []);

  useEffect(() => {
    const initDb = async () => {
      try {
        logger.info(LogCategory.DATABASE, 'Initialisation de la base de données');
        
        if (migrationError) {
          logger.error(LogCategory.DATABASE, 'Erreur de migration détectée', migrationError);
          throw migrationError;
        }
        
        if (success) {
          logger.info(LogCategory.DATABASE, 'Migrations réussies, ajout des données de test');
          try {
            await addDummyData(db);
            logger.info(LogCategory.DATABASE, 'Données de test ajoutées avec succès');
            setIsDbReady(true);
          } catch (dummyDataErr) {
            logger.error(LogCategory.DATABASE, 'Erreur lors de l\'ajout des données de test', dummyDataErr);
            // On continue même si les données de test échouent
            setIsDbReady(true);
          }
        }
      } catch (err) {
        logger.error(LogCategory.DATABASE, 'Erreur d\'initialisation de la base de données', err);
        setError(err instanceof Error ? err : new Error('Database initialization failed'));
      }
      
      // Le préchargement des données essentielles sera géré par le MCPProvider
      // après confirmation que le MCP Server est complètement initialisé
    };

    initDb();
  }, [success, migrationError]);

  useEffect(() => {
    const hideSplash = async () => {
      try {
        if (loaded && isDbReady) {
          logger.info(LogCategory.UI, 'Conditions remplies pour masquer le SplashScreen');
          await SplashScreen.hideAsync();
          logger.info(LogCategory.UI, 'SplashScreen masqué avec succès');
        } else {
          logger.info(LogCategory.UI, 'En attente pour masquer le SplashScreen', { fontsLoaded: loaded, dbReady: isDbReady });
        }
      } catch (err) {
        logger.error(LogCategory.UI, 'Erreur lors du masquage du SplashScreen', err);
        // Force hide after timeout in case of error
        setTimeout(() => {
          try {
            SplashScreen.hideAsync();
            logger.info(LogCategory.UI, 'SplashScreen masqué après délai d\'attente');
          } catch (timeoutErr) {
            logger.error(LogCategory.UI, 'Échec du masquage forcé du SplashScreen', timeoutErr);
          }
        }, 5000);
      }
    };

    hideSplash();
  }, [loaded, isDbReady]);

  // Vérification de l'état du chargement
  if (!loaded || !isDbReady) {
    logger.info(LogCategory.UI, 'Affichage du chargement', { fontsLoaded: loaded, dbReady: isDbReady });
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <RNText style={styles.loadingText}>Chargement de l'application...</RNText>
      </View>
    );
  }

  if (error) {
    logger.error(LogCategory.UI, 'Affichage de l\'écran d\'erreur d\'initialisation', { errorMessage: error.message });
    return (
      <View style={styles.errorContainer}>
        <RNText style={styles.errorTitle}>
          Une erreur est survenue lors de l'initialisation:
        </RNText>
        <RNText style={styles.errorMessage}>{error.message}</RNText>
      </View>
    );
  }

  const ErrorFallback = ({
    error,
    resetError,
  }: {
    error: Error;
    resetError: (event: GestureResponderEvent) => void;
  }) => (
    <Box flex={1} alignItems="center" justifyContent="center" p={16}>
      <Icon as={CloudAlert} size={40} color="#EF4444" />
      <Text>Une erreur est survenue:</Text>
      <Text>{error.toString()}</Text>
      <Button
        style={{ width: '100%', marginTop: 40, marginHorizontal: 8 }}
        onPress={() => resetError({} as GestureResponderEvent)}
      >
        Réessayer
      </Button>
    </Box>
  );

  // Journaliser le démarrage complet de l'application
  logger.info(LogCategory.UI, 'Application complètement chargée et prête');
  
  return (
    <GestureHandlerRootView style={styles.flex1}>
      <AppThemeProvider>
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
                  <View style={styles.center}>
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
                        <UserContextProvider>
                          <ErrorBoundary FallbackComponent={ErrorFallback}>
                            <Slot />
                            <StatusBar style="auto" hidden={true} />
                          </ErrorBoundary>
                        </UserContextProvider>
                      </MCPProvider>
                    </DrizzleProvider>
                  </SQLiteProvider>
                </Suspense>
              {/* </ConvexProviderWithClerk>
            </ClerkLoaded>
          </ClerkProvider> */}
        </QueryClientProvider>
      </ThemeProvider>
      </AppThemeProvider>
    
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 20 },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  errorTitle: { fontSize: 18, color: '#EF4444', marginBottom: 8 },
  errorMessage: { textAlign: 'center', marginBottom: 16 },
});
