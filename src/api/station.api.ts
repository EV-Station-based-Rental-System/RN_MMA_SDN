/**
 * StationService
 * Auto-generated from OpenAPI spec
 */

import ApiClient from '@/src/services/api.client';

class StationService {
  /**
   * create
   */
  async create(data: any): Promise<any> {
    try {
      return await ApiClient.post(`/station`, data);
    } catch (error) {
      console.error('create error:', error);
      throw error;
    }
  }

  /**
   * findAll
   */
  async findAll(params?: any): Promise<any> {
    try {
      return await ApiClient.get(`/station`, { params });
    } catch (error) {
      console.error('findAll error:', error);
      throw error;
    }
  }

  /**
   * findOne
   */
  async findOne(id: string): Promise<any> {
    try {
      return await ApiClient.get(`/station/${id}`);
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
      return await ApiClient.put(`/station/${id}`, data);
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
      return await ApiClient.delete(`/station/${id}`);
    } catch (error) {
      console.error('hardDelete error:', error);
      throw error;
    }
  }

  /**
   * restore
   */
  async restore(id: string): Promise<any> {
    try {
      return await ApiClient.patch(`/station/restore/${id}`, data);
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
      return await ApiClient.patch(`/station/soft-delete/${id}`, data);
    } catch (error) {
      console.error('softDelete error:', error);
      throw error;
    }
  }
}

export default new StationService();
