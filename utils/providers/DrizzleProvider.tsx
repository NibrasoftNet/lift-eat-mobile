import React, { createContext, ReactNode, useContext, useMemo, useState, useEffect } from 'react';
import { drizzle, ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';
import * as schema from '@/db/schema';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import { View, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';

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
      return drizzle<typeof schema>(db, { schema });
    } catch (err) {
      console.error('Failed to initialize Drizzle:', err);
      setError(err instanceof Error ? err : new Error('Failed to initialize database'));
      return null;
    }
  }, [db]);

  useEffect(() => {
    const initDb = async () => {
      try {
        if (drizzleDb) {
          // Vérifier que la base de données est accessible
          await drizzleDb.query.users.findFirst();
          setIsInitialized(true);
        }
      } catch (err) {
        console.error('Database access error:', err);
        setError(err instanceof Error ? err : new Error('Failed to access database'));
      }
    };

    initDb();
  }, [drizzleDb]);

  useDrizzleStudio(db);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text>Erreur d'initialisation de la base de données:</Text>
        <Text>{error.message}</Text>
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
