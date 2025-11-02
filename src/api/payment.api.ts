/**
 * PaymentService
 * Auto-generated from OpenAPI spec
 */

import ApiClient from '@/src/services/api.client';

class PaymentService {
  /**
   * confirmBookingByCash
   */
  async confirmBookingByCash(id: string): Promise<any> {
    try {
      return await ApiClient.patch(`/payments/confirm-cash/${id}`, data);
    } catch (error) {
      console.error('confirmBookingByCash error:', error);
      throw error;
    }
  }
}

export default new PaymentService();
