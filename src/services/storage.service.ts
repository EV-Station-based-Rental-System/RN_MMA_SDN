/**
 * Storage Service - Quản lý AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  ACCESS_TOKEN: '@access_token',
  USER_DATA: '@user_data',
  REFRESH_TOKEN: '@refresh_token',
};

class StorageService {
  // Token Management
  async setAccessToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.ACCESS_TOKEN, token);
      console.warn('✅ Token saved to AsyncStorage');
      // Verify it was saved
      const saved = await AsyncStorage.getItem(KEYS.ACCESS_TOKEN);
      console.warn('🔍 Verify saved token:', saved ? saved.substring(0, 20) + '...' : 'NULL');
    } catch (error) {
      console.error('Error saving access token:', error);
      throw error;
    }
  }

  async getAccessToken(): Promise<string | null> {
    try {
      const token = await AsyncStorage.getItem(KEYS.ACCESS_TOKEN);
      if (token) {
        console.warn('🔑 Token retrieved from storage:', token.substring(0, 20) + '...');
      } else {
        console.warn('⚠️ No token found in storage');
      }
      return token;
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  async removeAccessToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(KEYS.ACCESS_TOKEN);
    } catch (error) {
      console.error('Error removing access token:', error);
      throw error;
    }
  }

  // User Data
  async setUserData(userData: any): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.USER_DATA, JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
  }

  async getUserData(): Promise<any | null> {
    try {
      const data = await AsyncStorage.getItem(KEYS.USER_DATA);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  async removeUserData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(KEYS.USER_DATA);
    } catch (error) {
      console.error('Error removing user data:', error);
      throw error;
    }
  }

  // Clear All
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        KEYS.ACCESS_TOKEN,
        KEYS.USER_DATA,
        KEYS.REFRESH_TOKEN,
      ]);
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }
}

export default new StorageService();
