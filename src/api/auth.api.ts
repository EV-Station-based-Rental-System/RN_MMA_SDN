/**
 * AuthService
 * Auto-generated from OpenAPI spec
 */

import ApiClient from '@/src/services/api.client';

class AuthService {
  /**
   * login
   */
  async login(data: any): Promise<any> {
    try {
      return await ApiClient.post(`/auth/login`, data);
    } catch (error) {
      console.error('login error:', error);
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
