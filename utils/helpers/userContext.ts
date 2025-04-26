import useSessionStore from '../store/sessionStore';
import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import sqliteMCPServer from '../mcp/sqlite-server';

/**
 * Méthode centralisée pour récupérer l'ID de l'utilisateur courant
 * Cette fonction essaie d'abord d'obtenir l'ID depuis le store de session
 * Si aucun utilisateur n'est trouvé dans la session, elle tente de récupérer un utilisateur par défaut via le MCP Server
 * @param fallbackToDefault Si true, tente de récupérer un utilisateur par défaut si aucun n'est trouvé en session (défaut: true)
 * @returns L'ID de l'utilisateur ou null si aucun utilisateur n'est trouvé
 */
export async function getCurrentUserId(fallbackToDefault: boolean = true): Promise<number | null> {
  try {
    // 1. Tenter d'obtenir l'ID depuis le store de session
    const { user } = useSessionStore.getState();
    
    if (user?.id) {
      logger.info(LogCategory.USER, 'User ID retrieved from session', { userId: user.id });
      return Number(user.id);
    }
    
    // 2. Si aucun utilisateur en session et fallbackToDefault est true, tenter de récupérer un utilisateur par défaut
    if (fallbackToDefault) {
      logger.info(LogCategory.USER, 'No user found in session, falling back to default user');
      
      const result = await sqliteMCPServer.getDefaultUserViaMCP();
      
      if (result.success && result.user) {
        const userId = Number(result.user.id);
        logger.info(LogCategory.USER, 'Default user retrieved from database', { userId });
        
        // Mettre à jour la session avec l'utilisateur récupéré
        useSessionStore.setState({ 
          user: { 
            id: userId, 
            email: result.user.email 
          } 
        });
        
        return userId;
      }
    }
    
    // 3. Aucun utilisateur trouvé
    logger.warn(LogCategory.USER, 'No user found (session or default)');
    return null;
  } catch (error) {
    logger.error(LogCategory.USER, `Error retrieving current user ID: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

/**
 * Méthode synchrone pour récupérer l'ID de l'utilisateur courant depuis la session uniquement
 * Utile pour les composants UI qui ont besoin d'une valeur immédiate sans attente
 * @returns L'ID de l'utilisateur ou null si aucun utilisateur n'est trouvé en session
 */
export function getCurrentUserIdSync(): number | null {
  try {
    const { user } = useSessionStore.getState();
    
    if (user?.id) {
      return Number(user.id);
    }
    
    return null;
  } catch (error) {
    logger.error(LogCategory.USER, `Error in getCurrentUserIdSync: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

/**
 * Vérifie si un utilisateur est actuellement en session
 * @returns true si un utilisateur est en session, false sinon
 */
export function hasUserInSession(): boolean {
  try {
    const { user } = useSessionStore.getState();
    return !!user?.id;
  } catch (error) {
    logger.error(LogCategory.USER, `Error in hasUserInSession: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}
