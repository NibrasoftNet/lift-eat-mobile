/**
 * Service de gestion du drawer des paramu00e8tres utilisateur
 * Fournit des fonctionnalitu00e9s pour le composant UserSettingsDrawer
 */

import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { UserSettingsDrawerServiceInterface, MenuItem } from '../interfaces/drawer.interface';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { UserOrmPros } from '@/db/schema';

/**
 * Implu00e9mentation du service pour le drawer des paramu00e8tres utilisateur
 */
class UserSettingsDrawerService implements UserSettingsDrawerServiceInterface {
  /**
   * Ru00e9cupu00e8re les donnu00e9es de l'utilisateur par son ID
   * @param userId - L'ID de l'utilisateur
   * @returns Une promesse contenant les donnu00e9es de l'utilisateur ou null en cas d'erreur
   */
  async fetchUserData(userId: number): Promise<UserOrmPros | null> {
    try {
      logger.info(LogCategory.USER, `Fetching user data for ID: ${userId}`);
      
      // Vu00e9rifier si l'ID utilisateur est valide
      if (!userId) {
        logger.warn(LogCategory.AUTH, 'Invalid user ID provided');
        return null;
      }
      
      // Utiliser le MCP Server pour ru00e9cupu00e9rer les donnu00e9es de l'utilisateur
      const result = await sqliteMCPServer.getUserDetailsViaMCP(userId);
      
      if (result.success && result.user) {
        return result.user;
      } else {
        logger.error(LogCategory.USER, `Failed to get user details: ${result.error}`);
        return null;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(LogCategory.USER, `Error fetching user details: ${errorMessage}`);
      return null;
    }
  }

  /**
   * Gu00e9nu00e8re la liste des u00e9lu00e9ments du menu des paramu00e8tres
   * @returns Un tableau d'u00e9lu00e9ments de menu avec leurs propriu00e9tu00e9s
   */
  getMenuItems(): MenuItem[] {
    return [
      { title: 'Analytics', icon: 'Compass', tag: 'analytics' },
      { title: 'Edit profile', icon: 'PencilRuler', tag: 'profile' },
      { title: 'BMI data', icon: 'Weight', tag: 'details' },
      { title: 'Preference', icon: 'Drum', tag: 'preference' },
      { title: 'Change Password', icon: 'SquareAsterisk', tag: 'newPassword' },
    ];
  }

  /**
   * Gu00e9nu00e8re l'URL de navigation pour un u00e9lu00e9ment de menu
   * @param tag - Le tag de l'u00e9lu00e9ment de menu
   * @param userId - L'ID de l'utilisateur
   * @returns L'URL de navigation vers la page correspondante
   */
  getNavigationUrl(tag: string, userId: number): string {
    switch (tag) {
      case 'newPassword':
        return '/new-password';
      case 'profile':
        return `/profile/${userId}`;
      case 'details':
        return `/details/edit/${userId}`;
      case 'preference':
        return `/preference/edit/${userId}`;
      case 'analytics':
      default:
        return '/analytics';
    }
  }

  /**
   * Formate le nom d'utilisateur pour l'affichage
   * @param name - Le nom de l'utilisateur
   * @returns Le nom formatu00e9 pour l'affichage
   */
  formatUserName(name: string | null | undefined): string {
    if (!name) return 'User';
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  /**
   * Gu00e9nu00e8re les initiales de l'utilisateur pour l'avatar
   * @param name - Le nom de l'utilisateur
   * @returns Les initiales formatu00e9es pour l'avatar
   */
  getUserInitials(name: string | null | undefined): string {
    if (!name) return 'U';
    return name.slice(0, 2).toUpperCase();
  }
}

// Exporter une instance unique du service
export const userSettingsDrawerService = new UserSettingsDrawerService();
