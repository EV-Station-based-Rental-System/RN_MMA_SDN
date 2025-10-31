/**
 * Auth API Service
 */

import ApiClient from '@/src/services/api.client';
import StorageService from '@/src/services/storage.service';
import { API_ENDPOINTS } from '@/src/config/api.config';
import type {
  LoginDto,
  RenterDto,
  StaffDto,
  AdminDto,
  SendOtpDto,
  VerifyOtpDto,
  ResetPasswordDto,
  LoginResponse,
  ApiResponse,
} from '@/src/types/api.types';

class AuthService {
  /**
   * Login
   */
  async login(credentials: LoginDto): Promise<string> {
    try {
      const response = await ApiClient.post<LoginResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );

      const token = response.data.access_token;
      
      // Lưu token vào storage
      await StorageService.setAccessToken(token);

      return token;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Register Renter
   */
  async registerRenter(data: RenterDto): Promise<void> {
    try {
      await ApiClient.post<ApiResponse>(
        API_ENDPOINTS.AUTH.REGISTER_RENTER,
        data
      );
    } catch (error) {
      console.error('Register renter error:', error);
      throw error;
    }
  }

  /**
   * Register Staff
   */
  async registerStaff(data: StaffDto): Promise<void> {
    try {
      await ApiClient.post<ApiResponse>(
        API_ENDPOINTS.AUTH.REGISTER_STAFF,
        data
      );
    } catch (error) {
      console.error('Register staff error:', error);
      throw error;
    }
  }

  /**
   * Register Admin
   */
  async registerAdmin(data: AdminDto): Promise<void> {
    try {
      await ApiClient.post<ApiResponse>(
        API_ENDPOINTS.AUTH.REGISTER_ADMIN,
        data
      );
    } catch (error) {
      console.error('Register admin error:', error);
      throw error;
    }
  }

  /**
   * Send OTP
   */
  async sendOtp(data: SendOtpDto): Promise<void> {
    try {
      await ApiClient.post<ApiResponse>(
        API_ENDPOINTS.AUTH.SEND_OTP,
        data
      );
    } catch (error) {
      console.error('Send OTP error:', error);
      throw error;
    }
  }

  /**
   * Verify Email với OTP
   */
  async verifyEmail(data: VerifyOtpDto): Promise<void> {
    try {
      await ApiClient.post<ApiResponse>(
        API_ENDPOINTS.AUTH.VERIFY_EMAIL,
        data
      );
    } catch (error) {
      console.error('Verify email error:', error);
      throw error;
    }
  }

  /**
   * Reset Password
   */
  async resetPassword(data: ResetPasswordDto): Promise<void> {
    try {
      await ApiClient.post<ApiResponse>(
        API_ENDPOINTS.AUTH.RESET_PASSWORD,
        data
      );
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  /**
   * Logout - Clear local storage only (no API call needed)
   */
  async logout(): Promise<void> {
    try {
      console.log('🚪 Logging out user...');
      
      // Clear all local storage (token + user data)
      await StorageService.clearAll();
      
      console.log('✅ Token and user data cleared');
    } catch (error) {
      console.error('❌ Logout error:', error);
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await StorageService.getAccessToken();
    return !!token;
  }

  /**
   * Get current access token
   */
  async getToken(): Promise<string | null> {
    return await StorageService.getAccessToken();
  }
}

export default new AuthService();
