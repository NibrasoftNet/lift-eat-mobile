import React, { createContext, ReactNode, useContext, useEffect } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { useQueryClient } from '@tanstack/react-query';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { prefetchEssentialData } from '@/utils/helpers/prefetchData';

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
  const queryClient = useQueryClient();
  const [isInitialized, setIsInitialized] = React.useState(false);

  useEffect(() => {
    const initMCP = async () => {
      try {
        // Initialisation du serveur MCP avec la base de données SQLite
        logger.info(
          LogCategory.DATABASE,
          'Initialisation du MCP Server avec la base de données',
        );
        const success = await sqliteMCPServer.initializeWithDb(db);

        if (success) {
          setIsInitialized(true);
          console.log('SQLite MCP Server initialized successfully');
          logger.info(
            LogCategory.DATABASE,
            'MCP Server initialisé avec succès',
          );

          // Précharger les données essentielles UNIQUEMENT après initialisation réussie du MCP Server
          try {
            logger.info(
              LogCategory.APP,
              'Démarrage du préchargement des données essentielles',
            );
            await prefetchEssentialData(queryClient, {
              silentErrors: true,
              verbose: true,
              onProgress: (current, total) => {
                logger.debug(
                  LogCategory.CACHE,
                  `Préchargement: ${current}/${total} tâches terminées`,
                );
              },
            });
            logger.info(
              LogCategory.APP,
              'Préchargement des données essentielles terminé',
            );
          } catch (prefetchError) {
            logger.error(
              LogCategory.APP,
              'Erreur lors du préchargement des données essentielles',
              {
                error:
                  prefetchError instanceof Error
                    ? prefetchError.message
                    : String(prefetchError),
              },
            );
          }
        } else {
          logger.error(
            LogCategory.DATABASE,
            "Échec de l'initialisation du MCP Server",
          );
          console.error(
            'Failed to initialize SQLite MCP Server: initialization returned false',
          );
        }
      } catch (error) {
        logger.error(
          LogCategory.DATABASE,
          `Échec de l\'initialisation du MCP Server: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
        console.error('Failed to initialize SQLite MCP Server:', error);
      }
    };

    initMCP();
  }, [db, queryClient]);

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
