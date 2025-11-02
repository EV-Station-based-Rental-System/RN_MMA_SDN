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
      const response = await ApiClient.post(`/auth/login`, data);
      
      // Backend returns: { data: { access_token: "..." } }
      const token = response?.data?.access_token || response?.access_token || response?.token;
      
      if (token) {
        console.warn('💾 Saving token to storage:', token.substring(0, 20) + '...');
        await StorageService.setAccessToken(token);
        return token;
      }
      
      console.error('❌ No token found in response:', response);
      return response;
    } catch (error) {
      console.error('login error:', error);
      throw error;
    }
  }

  /**
   * Get stored token
   */
  async getToken(): Promise<string | null> {
    return await StorageService.getAccessToken();
  }

  /**
   * logout
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
