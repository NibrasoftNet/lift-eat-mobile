import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { MenuItem } from '@/utils/interfaces/drawer.interface';
import { UserOrmPros } from '@/db/schema';

interface UserSettingsDrawerServiceInterface {
  getMenuItems: () => MenuItem[];
  getNavigationUrl: (tag: string, userId: number) => string;
  fetchUserData: (userId: number) => Promise<UserOrmPros | null>;
}

class UserSettingsDrawerUIService implements UserSettingsDrawerServiceInterface {
  // Méthode pour obtenir les éléments du menu
  getMenuItems(): MenuItem[] {
    return [
      {
        title: 'Profile',
        icon: 'User',
        tag: 'profile',
      },
      {
        title: 'Analytics',
        icon: 'Compass',
        tag: 'analytics',
      },
      {
        title: 'Details',
        icon: 'PencilRuler',
        tag: 'details',
      },
      {
        title: 'Preferences',
        icon: 'Weight',
        tag: 'preference',
      },
      {
        title: 'Change Password',
        icon: 'SquareAsterisk',
        tag: 'newPassword',
      },
    ];
  }

  // Méthode pour obtenir l'URL de navigation
  getNavigationUrl(tag: string, userId: number): string {
    try {
      switch (tag) {
        case 'profile':
          return `/profile/${userId}`;
        case 'analytics':
          return '/analytics';
        case 'details':
          return `/details/edit/${userId}`;
        case 'preference':
          return `/preference/edit/${userId}`;
        case 'newPassword':
          return '/new-password';
        default:
          logger.warn(LogCategory.NAVIGATION, 'Unknown navigation tag', { tag });
          return '/';
      }
    } catch (error) {
      logger.error(LogCategory.NAVIGATION, 'Error getting navigation URL', {
        error: error instanceof Error ? error.message : String(error),
        tag,
        userId
      });
      return '/';
    }
  }

  // Méthode pour récupérer les données utilisateur
  async fetchUserData(userId: number): Promise<UserOrmPros | null> {
    try {
      // Simuler la récupération des données utilisateur
      // À remplacer par un vrai appel API ou base de données
      return {
        id: userId,
        name: 'John Doe',
        email: 'john@example.com',
        profileImage: null
      } as UserOrmPros;
    } catch (error) {
      logger.error(LogCategory.USER, 'Error fetching user data', {
        error: error instanceof Error ? error.message : String(error),
        userId
      });
      return null;
    }
  }
}

// Exporter une instance unique du service
export const userSettingsDrawerUIService = new UserSettingsDrawerUIService();
