// enhancedStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MMKV } from 'react-native-mmkv';

/**
 * Enhanced storage adapter that uses MMKV when available, falling back to AsyncStorage
 * for Expo Go compatibility. Can be used both with Zustand and directly in your code.
 */
class EnhancedStorage {
  private mmkv: MMKV | null = null;
  private readonly storageId: string;

  constructor(storageId: string = 'app-storage') {
    this.storageId = storageId;

    // Try to initialize MMKV, but catch errors for Expo Go compatibility
    try {
      this.mmkv = new MMKV({ id: this.storageId });
      console.log('MMKV initialized successfully');
    } catch (error) {
      console.log('MMKV not available, falling back to AsyncStorage');
    }
  }

  /**
   * Get an item from storage
   */
  async getItem(key: string): Promise<string | null> {
    try {
      if (this.mmkv) {
        const value = this.mmkv.getString(key);
        return value !== undefined ? value : null;
      }
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('Error getting item from storage:', error);
      return null;
    }
  }

  /**
   * Set an item in storage
   */
  async setItem(key: string, value: string): Promise<void> {
    try {
      if (this.mmkv) {
        this.mmkv.set(key, value);
      } else {
        await AsyncStorage.setItem(key, value);
      }
    } catch (error) {
      console.error('Error setting item in storage:', error);
    }
  }

  /**
   * Remove an item from storage
   */
  async removeItem(key: string): Promise<void> {
    try {
      if (this.mmkv) {
        this.mmkv.delete(key);
      } else {
        await AsyncStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Error removing item from storage:', error);
    }
  }

  /**
   * Clear all items from storage with a specific prefix
   */
  async clearWithPrefix(prefix: string): Promise<void> {
    try {
      if (this.mmkv) {
        const allKeys = this.mmkv.getAllKeys();
        allKeys.forEach((key) => {
          if (key.startsWith(prefix)) {
            this.mmkv?.delete(key);
          }
        });
      } else {
        const allKeys = await AsyncStorage.getAllKeys();
        const keysToRemove = allKeys.filter((key) => key.startsWith(prefix));
        if (keysToRemove.length > 0) {
          await AsyncStorage.multiRemove(keysToRemove);
        }
      }
    } catch (error) {
      console.error('Error clearing storage with prefix:', error);
    }
  }

  /**
   * Get all keys in storage
   * @returns A readonly array of keys
   */
  async getAllKeys(): Promise<readonly string[]> {
    try {
      if (this.mmkv) {
        return this.mmkv.getAllKeys();
      }
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Error getting all keys from storage:', error);
      return [];
    }
  }

  /**
   * Create a Zustand-compatible storage object
   */
  createJSONStorage() {
    return {
      getItem: async (name: string): Promise<string | null> => {
        return this.getItem(name);
      },
      setItem: async (name: string, value: string): Promise<void> => {
        return this.setItem(name, value);
      },
      removeItem: async (name: string): Promise<void> => {
        return this.removeItem(name);
      },
    };
  }
}

// Create and export a singleton instance
export const enhancedStorage = new EnhancedStorage();

// Export for use with Zustand
export const createEnhancedJSONStorage = () =>
  enhancedStorage.createJSONStorage();

export default enhancedStorage;
