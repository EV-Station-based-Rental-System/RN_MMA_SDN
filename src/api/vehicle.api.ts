/**
 * VehicleService
 * Auto-generated from OpenAPI spec
 */

import ApiClient from '@/src/services/api.client';
import type { VehicleWithPricingAndStation, VehicleQueryParams } from '@/src/types/api.types';

class VehicleService {
  /**
   * create
   */
  async create(data: any): Promise<any> {
    try {
      return await ApiClient.post(`/vehicle`, data);
    } catch (error) {
      console.error('create error:', error);
      throw error;
    }
  }

  /**
   * Get available vehicles with pagination
   */
  async getAvailableVehicles(params?: VehicleQueryParams): Promise<{ data: VehicleWithPricingAndStation[] }> {
    try {
      const response = await ApiClient.get(`/vehicle`, { params });
      return response;
    } catch (error) {
      console.error('getAvailableVehicles error:', error);
      throw error;
    }
  }

  /**
   * findAll
   */
  async findAll(params?: any): Promise<any> {
    try {
      return await ApiClient.get(`/vehicle`, { params });
    } catch (error) {
      console.error('findAll error:', error);
      throw error;
    }
  }

  /**
   * Get vehicle by ID
   */
  async getVehicleById(id: string): Promise<VehicleWithPricingAndStation> {
    try {
      const response = await ApiClient.get(`/vehicle/${id}`);
      return response.data;
    } catch (error) {
      console.error('getVehicleById error:', error);
      throw error;
    }
  }

  /**
   * findOne
   */
  async findOne(id: string): Promise<any> {
    try {
      return await ApiClient.get(`/vehicle/${id}`);
    } catch (error) {
      console.error('findOne error:', error);
      throw error;
    }
  }

  /**
   * update
   */
  async update(id: string, data: any): Promise<any> {
    try {
      return await ApiClient.put(`/vehicle/${id}`, data);
    } catch (error) {
      console.error('update error:', error);
      throw error;
    }
  }

  /**
   * hardDelete
   */
  async hardDelete(id: string): Promise<any> {
    try {
      return await ApiClient.delete(`/vehicle/${id}`);
    } catch (error) {
      console.error('hardDelete error:', error);
      throw error;
    }
  }

  /**
   * changeStatus
   */
  async changeStatus(id: string, data: any): Promise<any> {
    try {
      return await ApiClient.patch(`/vehicle/change-status/${id}`, data);
    } catch (error) {
      console.error('changeStatus error:', error);
      throw error;
    }
  }

  /**
   * restore
   */
  async restore(id: string): Promise<any> {
    try {
      return await ApiClient.patch(`/vehicle/restore/${id}`);
    } catch (error) {
      console.error('restore error:', error);
      throw error;
    }
  }

  /**
   * softDelete
   */
  async softDelete(id: string): Promise<any> {
    try {
      return await ApiClient.patch(`/vehicle/soft-delete/${id}`);
    } catch (error) {
      console.error('softDelete error:', error);
      throw error;
    }
  }
}

export default new VehicleService();
