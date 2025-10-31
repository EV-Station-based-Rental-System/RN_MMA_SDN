/**
 * Payment API Service
 */

import ApiClient from '@/src/services/api.client';
import { API_ENDPOINTS } from '@/src/config/api.config';
import type { ApiResponse } from '@/src/types/api.types';

class PaymentService {
  /**
   * Confirm payment by cash
   */
  async confirmCashPayment(bookingId: string): Promise<void> {
    try {
      await ApiClient.patch<ApiResponse>(
        API_ENDPOINTS.PAYMENT.CONFIRM_CASH(bookingId)
      );
    } catch (error) {
      console.error('Confirm cash payment error:', error);
      throw error;
    }
  }
}

export default new PaymentService();
