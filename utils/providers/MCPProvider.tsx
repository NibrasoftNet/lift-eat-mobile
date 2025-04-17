import React, { createContext, ReactNode, useContext, useEffect } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';

// Création du contexte React
const MCPContext = createContext<{
  isInitialized: boolean;
}>({
  isInitialized: false,
});

/**
 * Provider pour le serveur MCP SQLite
 * Initialise le serveur MCP avec la base de données SQLite
 */
export const MCPProvider = ({ children }: { children: ReactNode }) => {
  const db = useSQLiteContext();
  const [isInitialized, setIsInitialized] = React.useState(false);

  useEffect(() => {
    const initMCP = async () => {
      try {
        // Initialisation du serveur MCP avec la base de données SQLite
        sqliteMCPServer.initializeWithDb(db);
        setIsInitialized(true);
        console.log('SQLite MCP Server initialized successfully');
      } catch (error) {
        console.error('Failed to initialize SQLite MCP Server:', error);
      }
    };

    initMCP();
  }, [db]);

  return (
    <MCPContext.Provider value={{ isInitialized }}>
      {children}
    </MCPContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte MCP
export const useMCP = () => {
  return useContext(MCPContext);
};

export default MCPProvider;
