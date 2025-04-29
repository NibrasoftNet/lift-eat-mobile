import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

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
const UserContext = createContext<UserContextType>({
  currentUser: null,
  isLoading: false,
  error: null,
  setCurrentUser: () => {},
  refreshUser: async () => {},
  logout: () => {}
});

/**
 * Provider pour le contexte utilisateur global
 * Gère l'utilisateur actuellement connecté et fournit des méthodes pour le mettre à jour
 */
export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
        logger.info(LogCategory.USER, `User data refreshed successfully: ${response.user.name}`);
      } else {
        throw new Error(response.error || 'Failed to fetch user details');
      }
    } catch (err: any) {
      const errorMessage = `Error refreshing user: ${err.message}`;
      logger.error(LogCategory.USER, errorMessage);
      setError(errorMessage);
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
  };

  // Valeur du contexte à fournir aux composants enfants
  const contextValue: UserContextType = {
    currentUser,
    isLoading,
    error,
    setCurrentUser,
    refreshUser,
    logout
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
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
