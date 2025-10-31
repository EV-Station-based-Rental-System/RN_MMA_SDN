/**
 * User API Service
 */

import ApiClient from '@/src/services/api.client';
import { API_ENDPOINTS } from '@/src/config/api.config';
import type {
  User,
  ApiResponse,
  UpdateRenterDto,
} from '@/src/types/api.types';

class UserService {
  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User> {
    try {
      const response = await ApiClient.get<ApiResponse<User>>(
        API_ENDPOINTS.USERS.BY_ID(id)
      );
      return response.data;
    } catch (error) {
      console.error('Get user by ID error:', error);
      throw error;
    }
  }

  /**
   * Update renter profile
   */
  async updateRenter(id: string, data: UpdateRenterDto): Promise<User> {
    try {
      const response = await ApiClient.put<ApiResponse<User>>(
        API_ENDPOINTS.USERS.UPDATE_RENTER(id),
        data
      );
      return response.data;
    } catch (error) {
      console.error('Update renter error:', error);
      throw error;
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(userId: string): Promise<User> {
    try {
      return await this.getUserById(userId);
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }
}

export default new UserService();
