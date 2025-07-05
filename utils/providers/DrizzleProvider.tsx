import React, {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';
import { drizzle, ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';
import * as schema from '@/db/schema';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import { View, ActivityIndicator } from 'react-native';
import Text from '@/components-new/ui/atoms/base/Text';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

// ✅ Use the correct type for Drizzle database
type DrizzleDbType = ExpoSQLiteDatabase<typeof schema> | null;

const DrizzleContext = createContext<DrizzleDbType>(null);

export const DrizzleProvider = ({ children }: { children: ReactNode }) => {
  const db = useSQLiteContext();
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // ✅ Ensure drizzleDb has the correct inferred type
  const drizzleDb = useMemo(() => {
    try {
      logger.info(LogCategory.DATABASE, 'Initializing Drizzle ORM');
      return drizzle<typeof schema>(db, { schema });
    } catch (err) {
      logger.error(LogCategory.DATABASE, 'Failed to initialize Drizzle', err);
      setError(
        err instanceof Error ? err : new Error('Failed to initialize database'),
      );
      return null;
    }
  }, [db]);

  useEffect(() => {
    const initDb = async () => {
      try {
        if (drizzleDb) {
          logger.info(
            LogCategory.DATABASE,
            "Vérification de l'accès à la base de données",
          );

          // Vérifier que chaque table est accessible pour détecter des problèmes spécifiques
          try {
            await drizzleDb.query.users.findFirst();
            logger.info(LogCategory.DATABASE, 'Table users accessible');
          } catch (tableErr) {
            logger.error(
              LogCategory.DATABASE,
              "Erreur d'accès à la table users",
              tableErr,
            );
            throw new Error(
              `Erreur d'accès à la table users: ${
                tableErr instanceof Error ? tableErr.message : String(tableErr)
              }`,
            );
          }

          // Vérifier les autres tables importantes
          try {
            await drizzleDb.query.meals.findFirst();
            logger.info(LogCategory.DATABASE, 'Table meals accessible');
          } catch (tableErr) {
            logger.error(
              LogCategory.DATABASE,
              "Erreur d'accès à la table meals",
              tableErr,
            );
          }

          // Vérifier l'accès aux nouvelles tables de progression
          try {
            await drizzleDb.query.dailyProgress.findFirst();
            logger.info(LogCategory.DATABASE, 'Table dailyProgress accessible');
          } catch (tableErr) {
            logger.error(
              LogCategory.DATABASE,
              "Erreur d'accès à la table dailyProgress",
              tableErr,
            );
          }

          try {
            await drizzleDb.query.dailyMealProgress.findFirst();
            logger.info(
              LogCategory.DATABASE,
              'Table dailyMealProgress accessible',
            );
          } catch (tableErr) {
            logger.error(
              LogCategory.DATABASE,
              "Erreur d'accès à la table dailyMealProgress",
              tableErr,
            );
          }

          logger.info(
            LogCategory.DATABASE,
            'Base de données initialisée avec succès',
          );
          setIsInitialized(true);
        }
      } catch (err) {
        logger.error(
          LogCategory.DATABASE,
          "Erreur d'accès à la base de données",
          err,
        );
        setError(
          err instanceof Error ? err : new Error('Failed to access database'),
        );
      }
    };

    initDb();
  }, [drizzleDb]);

  useDrizzleStudio(db);

  if (error) {
    logger.error(
      LogCategory.DATABASE,
      "Affichage de l'erreur d'initialisation",
      { message: error.message },
    );
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}
      >
        <Text className="text-lg font-bold mb-2">
          Erreur d'initialisation de la base de données:
        </Text>
        <Text className="text-base mb-4">{error.message}</Text>
        <Text className="text-sm mb-1 text-gray-600">
          Essayez de redémarrer l'application ou de réinstaller si le problème
          persiste.
        </Text>
      </View>
    );
  }

  if (!isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <DrizzleContext.Provider value={drizzleDb}>
      {children}
    </DrizzleContext.Provider>
  );
};

// ✅ Use the correct type in the hook
export const useDrizzleDb = (): ExpoSQLiteDatabase<typeof schema> => {
  const context = useContext(DrizzleContext);
  if (!context) {
    throw new Error('useDrizzleDb must be used within a DrizzleProvider');
  }
  return context;
};
