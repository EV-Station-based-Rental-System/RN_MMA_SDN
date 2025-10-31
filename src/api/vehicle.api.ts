/**
 * Vehicle API Service
 */

import ApiClient from '@/src/services/api.client';
import { API_ENDPOINTS } from '@/src/config/api.config';
import type {
  VehicleWithPricingAndStation,
  PaginatedResponse,
  ApiResponse,
  VehicleQueryParams,
  CreateVehicleDto,
  UpdateVehicleDto,
} from '@/src/types/api.types';

class VehicleService {
  /**
   * Get list vehicles với pagination
   */
  async getVehicles(
    params?: VehicleQueryParams
  ): Promise<PaginatedResponse<VehicleWithPricingAndStation>> {
    try {
      return await ApiClient.get(API_ENDPOINTS.VEHICLE.LIST, { params });
    } catch (error) {
      console.error('Get vehicles error:', error);
      throw error;
    }
  }

  /**
   * Get vehicle by ID
   */
  async getVehicleById(id: string): Promise<VehicleWithPricingAndStation> {
    try {
      const response = await ApiClient.get<ApiResponse<VehicleWithPricingAndStation>>(
        API_ENDPOINTS.VEHICLE.BY_ID(id)
      );
      return response.data;
    } catch (error) {
      console.error('Get vehicle by ID error:', error);
      throw error;
    }
  }

  /**
   * Create new vehicle
   */
  async createVehicle(data: CreateVehicleDto): Promise<any> {
    try {
      const response = await ApiClient.post<ApiResponse>(
        API_ENDPOINTS.VEHICLE.CREATE,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Create vehicle error:', error);
      throw error;
    }
  }

  /**
   * Update vehicle
   */
  async updateVehicle(id: string, data: UpdateVehicleDto): Promise<any> {
    try {
      const response = await ApiClient.put<ApiResponse>(
        API_ENDPOINTS.VEHICLE.UPDATE(id),
        data
      );
      return response.data;
    } catch (error) {
      console.error('Update vehicle error:', error);
      throw error;
    }
  }

  /**
   * Soft delete vehicle
   */
  async softDeleteVehicle(id: string): Promise<void> {
    try {
      await ApiClient.patch(API_ENDPOINTS.VEHICLE.SOFT_DELETE(id));
    } catch (error) {
      console.error('Soft delete vehicle error:', error);
      throw error;
    }
  }

  /**
   * Hard delete vehicle
   */
  async hardDeleteVehicle(id: string): Promise<void> {
    try {
      await ApiClient.delete(API_ENDPOINTS.VEHICLE.HARD_DELETE(id));
    } catch (error) {
      console.error('Hard delete vehicle error:', error);
      throw error;
    }
  }

  /**
   * Search vehicles by brand (make)
   */
  async searchByBrand(brand: string, params?: VehicleQueryParams): Promise<PaginatedResponse<VehicleWithPricingAndStation>> {
    try {
      return await ApiClient.get(API_ENDPOINTS.VEHICLE.LIST, {
        params: {
          ...params,
          search: brand,
        },
      });
    } catch (error) {
      console.error('Search vehicles by brand error:', error);
      throw error;
    }
  }

  /**
   * Get available vehicles
   */
  async getAvailableVehicles(params?: VehicleQueryParams): Promise<PaginatedResponse<VehicleWithPricingAndStation>> {
    try {
      return await ApiClient.get(API_ENDPOINTS.VEHICLE.LIST, {
        params: {
          ...params,
          is_active: true,
        },
      });
    } catch (error) {
      console.error('Get available vehicles error:', error);
      throw error;
    }
  }
}

export default new VehicleService();
