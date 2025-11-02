/**
 * UserService
 * Auto-generated from OpenAPI spec
 */

import ApiClient from '@/src/services/api.client';

class UserService {
  /**
   * findAllUser
   */
  async findAllUser(params?: any): Promise<any> {
    try {
      return await ApiClient.get(`/users/renter`, { params });
    } catch (error) {
      console.error('findAllUser error:', error);
      throw error;
    }
  }

  /**
   * findAllStaff
   */
  async findAllStaff(params?: any): Promise<any> {
    try {
      return await ApiClient.get(`/users/staff`, { params });
    } catch (error) {
      console.error('findAllStaff error:', error);
      throw error;
    }
  }

  /**
   * findOne
   */
  async findOne(id: string): Promise<any> {
    try {
      return await ApiClient.get(`/users/${id}`);
    } catch (error) {
      console.error('findOne error:', error);
      throw error;
    }
  }

  /**
   * hardDelete
   */
  async hardDelete(id: string): Promise<any> {
    try {
      return await ApiClient.delete(`/users/${id}`);
    } catch (error) {
      console.error('hardDelete error:', error);
      throw error;
    }
  }

  /**
   * updateRenter
   */
  async updateRenter(id: string, data: any): Promise<any> {
    try {
      return await ApiClient.put(`/users/update-renter/${id}`, data);
    } catch (error) {
      console.error('updateRenter error:', error);
      throw error;
    }
  }

  /**
   * updateStaff
   */
  async updateStaff(id: string, data: any): Promise<any> {
    try {
      return await ApiClient.put(`/users/update-staff/${id}`, data);
    } catch (error) {
      console.error('updateStaff error:', error);
      throw error;
    }
  }

  /**
   * softDelete
   */
  async softDelete(id: string): Promise<any> {
    try {
      return await ApiClient.patch(`/users/soft-delete/${id}`, data);
    } catch (error) {
      console.error('softDelete error:', error);
      throw error;
    }
  }

  /**
   * restore
   */
  async restore(id: string): Promise<any> {
    try {
      return await ApiClient.patch(`/users/restore/${id}`, data);
    } catch (error) {
      console.error('restore error:', error);
      throw error;
    }
  }
}

export default new UserService();
