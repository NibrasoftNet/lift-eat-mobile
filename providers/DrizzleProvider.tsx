import React, { createContext, ReactNode, useContext, useMemo } from "react";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import * as schema from "@/db/schema";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";

const DrizzleContext = createContext<any>(null);

export const DrizzleProvider = ({ children }: { children: ReactNode }) => {
    const db = useSQLiteContext();
    const drizzleDb = useMemo(() => drizzle(db, { schema }), [db]);
    useDrizzleStudio(db);
    return (
        <DrizzleContext.Provider value={drizzleDb}>{children}</DrizzleContext.Provider>
    );
};

export const useDrizzleDb = () => {
    const context = useContext(DrizzleContext);
    if (!context) {
        throw new Error("useDrizzleDb must be used within a DrizzleProvider");
    }
    return context;
};
