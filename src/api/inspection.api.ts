/**
 * InspectionService
 * Auto-generated from OpenAPI spec
 */

import ApiClient from '@/src/services/api.client';

class InspectionService {
  /**
   * create
   */
  async create(data: any): Promise<any> {
    try {
      return await ApiClient.post(`/inspection`, data);
    } catch (error) {
      console.error('create error:', error);
      throw error;
    }
  }

  /**
   * uploadPhoto
   */
  async uploadPhoto(id: string, data: any): Promise<any> {
    try {
      return await ApiClient.post(`/inspection/${id}/upload-photo`, data);
    } catch (error) {
      console.error('uploadPhoto error:', error);
      throw error;
    }
  }

  /**
   * getPhotos
   */
  async getPhotos(id: string): Promise<any> {
    try {
      return await ApiClient.get(`/inspection/${id}/photos`);
    } catch (error) {
      console.error('getPhotos error:', error);
      throw error;
    }
  }

  /**
   * completeInspection
   */
  async completeInspection(id: string, data: any): Promise<any> {
    try {
      return await ApiClient.post(`/inspection/${id}/complete`, data);
    } catch (error) {
      console.error('completeInspection error:', error);
      throw error;
    }
  }

  /**
   * remove
   */
  async remove(id: string): Promise<any> {
    try {
      return await ApiClient.delete(`/inspection/${id}`);
    } catch (error) {
      console.error('remove error:', error);
      throw error;
    }
  }
}

export default new InspectionService();
