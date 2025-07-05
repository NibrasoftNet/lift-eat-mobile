import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import useSessionStore from '@/utils/store/sessionStore';

// Définition de l'interface utilisateur basée sur le schéma
export interface User {
  id: number;
  name: string;
  email: string;
  age?: number;
  gender?: string;
  weight?: number;
  weightUnit?: string;
  height?: number;
  heightUnit?: string;
  physicalActivity?: string;
  profileImage?: Buffer | null;
  score?: number;
  clerkId?: string; // Ajout du champ clerkId pour l'authentification avec Clerk
}

// Interface du contexte
interface UserContextType {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  setCurrentUser: (user: User) => void;
  refreshUser: (userId: number) => Promise<void>;
  logout: () => void;
}

// Création du contexte avec valeurs par défaut
export const UserContext = createContext<UserContextType>({
  currentUser: null,
  isLoading: false,
  error: null,
  setCurrentUser: () => {},
  refreshUser: async () => {},
  logout: () => {},
});

/**
 * Provider pour le contexte utilisateur global
 * Gère l'utilisateur actuellement connecté et fournit des méthodes pour le mettre à jour
 */
export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Charger l'utilisateur depuis AsyncStorage au démarrage
  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        setIsLoading(true);

        // Récupérer l'ID utilisateur depuis AsyncStorage
        const userId = await AsyncStorage.getItem('userId');

        logger.info(
          LogCategory.USER,
          `Tentative de chargement de l'utilisateur depuis le stockage`,
          {
            storedUserId: userId || 'aucun',
          },
        );

        if (userId) {
          // Convertir l'ID en nombre et charger l'utilisateur
          const numericId = parseInt(userId, 10);

          if (!isNaN(numericId)) {
            logger.info(
              LogCategory.USER,
              `Chargement des données utilisateur pour l'ID: ${numericId}`,
            );

            // Mettre à jour immédiatement le sessionStore avec l'ID pour que les services synchrones puissent l'utiliser
            const { setUser } = useSessionStore.getState();
            setUser({ id: numericId, email: '' });

            await refreshUser(numericId);
          } else {
            logger.warn(
              LogCategory.USER,
              `ID utilisateur invalide dans AsyncStorage: ${userId}`,
            );
          }
        } else {
          logger.info(
            LogCategory.USER,
            `Aucun ID utilisateur trouvé dans AsyncStorage`,
          );
        }
      } catch (err: any) {
        const errorMessage = `Erreur lors du chargement de l'utilisateur: ${err.message}`;
        logger.error(LogCategory.USER, errorMessage);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  /**
   * Rafraîchit les données de l'utilisateur depuis le serveur MCP
   * @param userId ID de l'utilisateur à récupérer
   */
  const refreshUser = async (userId: number) => {
    try {
      setIsLoading(true);
      setError(null);

      logger.info(LogCategory.USER, `Refreshing user data for ID: ${userId}`);

      // Utilisation du MCP Server pour récupérer les détails de l'utilisateur
      const response = await sqliteMCPServer.getUserDetailsViaMCP(userId);

      if (response.success && response.user) {
        setCurrentUser(response.user as User);

        // Mettre à jour le sessionStore avec les infos complètes de l'utilisateur (non persistées)
        const { setUser } = useSessionStore.getState();
        setUser({ id: response.user.id, email: response.user.email });

        logger.info(
          LogCategory.USER,
          `User data refreshed successfully: ${response.user.name}`,
        );
      } else {
        throw new Error(response.error || 'Failed to fetch user details');
      }
    } catch (err: any) {
      const errorMessage = `Error refreshing user: ${err.message}`;
      logger.error(LogCategory.USER, errorMessage);
      setError(errorMessage);

      // Si l'utilisateur n'est pas trouvé, supprimer son ID d'AsyncStorage
      if (err.message && err.message.includes('not found')) {
        logger.warn(
          LogCategory.USER,
          `Suppression de l'ID utilisateur ${userId} d'AsyncStorage car il n'existe plus`,
        );
        AsyncStorage.removeItem('userId').catch((storageErr) => {
          logger.error(
            LogCategory.USER,
            `Erreur lors de la suppression de l'ID utilisateur d'AsyncStorage: ${storageErr.message}`,
          );
        });
      }
      // Ne pas effacer l'utilisateur actuel en cas d'erreur de rafraîchissement
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Déconnecte l'utilisateur actuel
   */
  const logout = () => {
    setCurrentUser(null);
    logger.info(LogCategory.USER, 'User logged out');

    // Note: La déconnexion de Clerk doit être gérée séparément dans les composants qui utilisent Clerk
  };

  // Note: La synchronisation avec Clerk doit être gérée dans les composants enfants du ClerkProvider

  // Valeur du contexte à fournir aux composants enfants
  const contextValue: UserContextType = {
    currentUser,
    isLoading,
    error,
    setCurrentUser,
    refreshUser,
    logout,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

/**
 * Hook personnalisé pour utiliser le contexte utilisateur
 * @returns Le contexte utilisateur
 */
export const useUserContext = () => {
  return useContext(UserContext);
};

export default UserContextProvider;
