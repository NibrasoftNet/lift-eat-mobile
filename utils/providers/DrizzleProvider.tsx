import React, { createContext, ReactNode, useContext, useMemo } from "react";
import { drizzle, ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import * as schema from "@/db/schema";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";

// ✅ Use the correct type for Drizzle database
type DrizzleDbType = ExpoSQLiteDatabase<typeof schema> | null;

const DrizzleContext = createContext<DrizzleDbType>(null);

export const DrizzleProvider = ({ children }: { children: ReactNode }) => {
    const db = useSQLiteContext();

    // ✅ Ensure drizzleDb has the correct inferred type
    const drizzleDb = useMemo(() => drizzle<typeof schema>(db, { schema }), [db]);

    useDrizzleStudio(db);

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
        throw new Error("useDrizzleDb must be used within a DrizzleProvider");
    }
    return context;
};
