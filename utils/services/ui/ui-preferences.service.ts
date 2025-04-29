import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { UIPreferences } from '@/utils/mcp/interfaces/user-interfaces';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UI_PREFERENCES_KEY = 'ui_preferences';

class UIPreferencesService {
  private preferences: UIPreferences = {};

  async loadPreferences(): Promise<UIPreferences> {
    try {
      const storedPrefs = await AsyncStorage.getItem(UI_PREFERENCES_KEY);
      if (storedPrefs) {
        this.preferences = JSON.parse(storedPrefs);
      }
      return this.preferences;
    } catch (error) {
      logger.error(LogCategory.UI, 'Error loading UI preferences', {
        error: error instanceof Error ? error.message : String(error)
      });
      return {};
    }
  }

  async savePreferences(preferences: Partial<UIPreferences>): Promise<void> {
    try {
      this.preferences = { ...this.preferences, ...preferences };
      await AsyncStorage.setItem(UI_PREFERENCES_KEY, JSON.stringify(this.preferences));
      logger.info(LogCategory.UI, 'UI preferences saved', { preferences });
    } catch (error) {
      logger.error(LogCategory.UI, 'Error saving UI preferences', {
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

  async setLanguage(language: string): Promise<void> {
    await this.savePreferences({ language });
  }

  async setTheme(theme: string): Promise<void> {
    await this.savePreferences({ theme });
  }

  async setNotifications(enabled: boolean): Promise<void> {
    await this.savePreferences({ notifications: enabled });
  }
}

export const uiPreferencesService = new UIPreferencesService();
