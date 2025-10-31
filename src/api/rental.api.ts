/**
 * Rental API Service
 */

import ApiClient from '@/src/services/api.client';
import { API_ENDPOINTS } from '@/src/config/api.config';
import type {
  Rental,
  RentalQueryParams,
  PaginatedResponse,
  ApiResponse,
} from '@/src/types/api.types';

class RentalService {
  /**
   * Get all rentals với pagination và filters
   */
  async getRentals(params?: RentalQueryParams): Promise<PaginatedResponse<Rental>> {
    try {
      return await ApiClient.get(API_ENDPOINTS.RENTAL.LIST, { params });
    } catch (error) {
      console.error('Get rentals error:', error);
      throw error;
    }
  }

  /**
   * Get rental by ID
   */
  async getRentalById(id: string): Promise<Rental> {
    try {
      const response = await ApiClient.get<ApiResponse<Rental>>(
        API_ENDPOINTS.RENTAL.BY_ID(id)
      );
      return response.data;
    } catch (error) {
      console.error('Get rental by ID error:', error);
      throw error;
    }
  }

  /**
   * Get my rentals (current user)
   */
  async getMyRentals(params?: RentalQueryParams): Promise<PaginatedResponse<Rental>> {
    try {
      return await ApiClient.get(API_ENDPOINTS.RENTAL.LIST, { params });
    } catch (error) {
      console.error('Get my rentals error:', error);
      throw error;
    }
  }

  /**
   * Get active rentals
   */
  async getActiveRentals(params?: RentalQueryParams): Promise<PaginatedResponse<Rental>> {
    try {
      return await ApiClient.get(API_ENDPOINTS.RENTAL.LIST, {
        params: {
          ...params,
          status: 'in_progress',
        },
      });
    } catch (error) {
      console.error('Get active rentals error:', error);
      throw error;
    }
  }
}

export default new RentalService();
