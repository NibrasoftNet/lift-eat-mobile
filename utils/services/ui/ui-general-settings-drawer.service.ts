import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { uiPreferencesService } from '@/utils/services/ui/ui-preferences.service';
import { GeneralSettingsDrawerServiceInterface, GeneralSettingsMenuItem } from '@/utils/interfaces/drawer.interface';

class GeneralSettingsDrawerService implements GeneralSettingsDrawerServiceInterface {
  // Méthode pour changer la langue
  async handleLanguageChange(lang: string): Promise<void> {
    try {
      await uiPreferencesService.setLanguage(lang);
      logger.info(LogCategory.UI, 'Language changed', { lang });
    } catch (error) {
      logger.error(LogCategory.UI, 'Error changing language', {
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

  // Méthode pour changer le thème
  async handleThemeChange(theme: string): Promise<void> {
    try {
      await uiPreferencesService.setTheme(theme);
      logger.info(LogCategory.UI, 'Theme changed', { theme });
    } catch (error) {
      logger.error(LogCategory.UI, 'Error changing theme', {
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

  // Méthode pour activer/désactiver les notifications
  async handleNotificationToggle(enabled: boolean): Promise<void> {
    try {
      await uiPreferencesService.setNotifications(enabled);
      logger.info(LogCategory.UI, 'Notifications toggled', { enabled });
    } catch (error) {
      logger.error(LogCategory.UI, 'Error toggling notifications', {
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

  // Méthode pour gérer la sélection d'un élément
  handleItemSelect(item: GeneralSettingsMenuItem): void {
    logger.info(LogCategory.UI, 'Settings item selected', { item });
    // Implémenter la logique de sélection d'élément si nécessaire
  }

  // Méthode pour obtenir les langues disponibles
  getAvailableLanguages(): Array<{ label: string; value: string }> {
    return [
      { label: 'English', value: 'en' },
      { label: 'Français', value: 'fr' },
      { label: 'العربية', value: 'ar' },
    ];
  }

  // Méthode pour obtenir les éléments du menu des paramètres généraux
  getGeneralMenuItems(): GeneralSettingsMenuItem[] {
    return [
      {
        title: 'Help & Support',
        icon: 'CircleHelp',
        action: 'help',
      },
      {
        title: 'Privacy & Security',
        icon: 'ShieldAlert',
        action: 'privacy',
      },
      {
        title: 'News & Updates',
        icon: 'Newspaper',
        action: 'news',
      },
    ];
  }

  // Méthode pour gérer les actions du menu
  handleMenuAction(action: string, callback?: () => void): void {
    switch (action) {
      case 'help':
        // Logique pour l'aide et le support
        logger.info(LogCategory.UI, 'Help & Support selected');
        break;
      case 'privacy':
        // Logique pour la confidentialité et la sécurité
        logger.info(LogCategory.UI, 'Privacy & Security selected');
        break;
      case 'news':
        // Logique pour les nouvelles et mises à jour
        logger.info(LogCategory.UI, 'News & Updates selected');
        break;
      default:
        logger.warn(LogCategory.UI, 'Unknown menu action', { action });
    }
    callback?.();
  }

  // Méthode pour changer la langue dans l'application
  changeLanguage(languageCode: string): boolean {
    try {
      this.handleLanguageChange(languageCode);
      return true;
    } catch (error) {
      logger.error(LogCategory.UI, 'Error changing language', {
        error: error instanceof Error ? error.message : String(error)
      });
      return false;
    }
  }
}

// Exporter une instance unique du service
export const generalSettingsDrawerService = new GeneralSettingsDrawerService();
