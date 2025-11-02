/**
 * AuthService
 * Auto-generated from OpenAPI spec
 */

import ApiClient from '@/src/services/api.client';
import StorageService from '@/src/services/storage.service';

class AuthService {
  /**
   * login
   */
  async login(data: any): Promise<any> {
    try {
      const resp = await ApiClient.post(`/auth/login`, data);
      console.log('🔐 Login response:', resp);
      
      // Try to extract token from response (handle various response structures)
      const token = resp?.accessToken || resp?.access_token || resp?.token || resp?.data?.accessToken || resp?.data?.access_token || resp;
      console.log('🔑 Extracted token:', token ? `${String(token).substring(0, 30)}...` : 'null');
      
      if (token && typeof token === 'string') {
        await StorageService.setAccessToken(token);
        console.log('✅ Token saved to storage');
        return token;
      }

      // If response contains object with accessToken/access_token field
      if (resp && typeof resp === 'object') {
        const tokenField = resp.accessToken || resp.access_token;
        if (tokenField && typeof tokenField === 'string') {
          await StorageService.setAccessToken(tokenField);
          console.log('✅ Token saved to storage (from object)');
          return tokenField;
        }
      }

      console.log('⚠️ Could not extract token from response, response structure:', Object.keys(resp || {}));
      return resp;
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  }

  /**
   * Get saved access token
   */
  async getToken(): Promise<string | null> {
    try {
      return await StorageService.getAccessToken();
    } catch (error) {
      console.error('getToken error:', error);
      return null;
    }
  }

  /**
   * Set access token
   */
  async setToken(token: string): Promise<void> {
    try {
      await StorageService.setAccessToken(token);
      console.log('✅ Token saved to storage');
    } catch (error) {
      console.error('setToken error:', error);
      throw error;
    }
  }

  /**
   * Logout - clear stored tokens and user data
   */
  async logout(): Promise<void> {
    try {
      await StorageService.clearAll();
    } catch (error) {
      console.error('logout error:', error);
      throw error;
    }
  }

  /**
   * createRenter
   */
  async createRenter(data: any): Promise<any> {
    try {
      return await ApiClient.post(`/auth/register/renter`, data);
    } catch (error) {
      console.error('createRenter error:', error);
      throw error;
    }
  }

  /**
   * createStaff
   */
  async createStaff(data: any): Promise<any> {
    try {
      return await ApiClient.post(`/auth/register/staff`, data);
    } catch (error) {
      console.error('createStaff error:', error);
      throw error;
    }
  }

  /**
   * createAdmin
   */
  async createAdmin(data: any): Promise<any> {
    try {
      return await ApiClient.post(`/auth/register/admin`, data);
    } catch (error) {
      console.error('createAdmin error:', error);
      throw error;
    }
  }

  /**
   * sendOtp
   */
  async sendOtp(data: any): Promise<any> {
    try {
      return await ApiClient.post(`/auth/send-otp`, data);
    } catch (error) {
      console.error('sendOtp error:', error);
      throw error;
    }
  }

  /**
   * verifyEmail
   */
  async verifyEmail(data: any): Promise<any> {
    try {
      return await ApiClient.post(`/auth/verify-email`, data);
    } catch (error) {
      console.error('verifyEmail error:', error);
      throw error;
    }
  }

  /**
   * resetPassword
   */
  async resetPassword(data: any): Promise<any> {
    try {
      return await ApiClient.post(`/auth/reset-password`, data);
    } catch (error) {
      console.error('resetPassword error:', error);
      throw error;
    }
  }
}

export default new AuthService();
