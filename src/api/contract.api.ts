/**
 * ContractService
 * Auto-generated from OpenAPI spec
 */

import ApiClient from '@/src/services/api.client';

class ContractService {
  /**
   * create
   */
  async create(data: any): Promise<any> {
    try {
      return await ApiClient.post(`/contracts`, data);
    } catch (error) {
      console.error('create error:', error);
      throw error;
    }
  }

  /**
   * update
   */
  async update(id: string, data: any): Promise<any> {
    try {
      return await ApiClient.put(`/contracts/${id}`, data);
    } catch (error) {
      console.error('update error:', error);
      throw error;
    }
  }

  /**
   * remove
   */
  async remove(id: string): Promise<any> {
    try {
      return await ApiClient.delete(`/contracts/${id}`);
    } catch (error) {
      console.error('remove error:', error);
      throw error;
    }
  }
}

export default new ContractService();
