/**
 * RentalService
 * Auto-generated from OpenAPI spec
 */

import ApiClient from '@/src/services/api.client';

class RentalService {
  /**
   * getAllRentals
   */
  async getAllRentals(params?: any): Promise<any> {
    try {
      return await ApiClient.get(`/rentals`, { params });
    } catch (error) {
      console.error('getAllRentals error:', error);
      throw error;
    }
  }

  /**
   * getRentalById
   */
  async getRentalById(id: string): Promise<any> {
    try {
      return await ApiClient.get(`/rentals/${id}`);
    } catch (error) {
      console.error('getRentalById error:', error);
      throw error;
    }
  }
}

export default new RentalService();
