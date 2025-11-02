/**
 * BookingService
 * Auto-generated from OpenAPI spec
 */

import ApiClient from '@/src/services/api.client';

class BookingService {
  /**
   * createBooking
   */
  async createBooking(data: any): Promise<any> {
    try {
      return await ApiClient.post(`/bookings`, data);
    } catch (error) {
      console.error('createBooking error:', error);
      throw error;
    }
  }

  /**
   * getAllBookings
   */
  async getAllBookings(params?: any): Promise<any> {
    try {
      return await ApiClient.get(`/bookings`, { params });
    } catch (error) {
      console.error('getAllBookings error:', error);
      throw error;
    }
  }

  /**
   * confirmBooking
   */
  async confirmBooking(id: string, data: any): Promise<any> {
    try {
      return await ApiClient.patch(`/bookings/confirm/${id}`, data);
    } catch (error) {
      console.error('confirmBooking error:', error);
      throw error;
    }
  }

  /**
   * getBookingsByRenter
   */
  async getBookingsByRenter(params?: any): Promise<any> {
    try {
      return await ApiClient.get(`/bookings/history-renter`, { params });
    } catch (error) {
      console.error('getBookingsByRenter error:', error);
      throw error;
    }
  }

  /**
   * getBookingById
   */
  async getBookingById(id: string): Promise<any> {
    try {
      return await ApiClient.get(`/bookings/${id}`);
    } catch (error) {
      console.error('getBookingById error:', error);
      throw error;
    }
  }

  /**
   * cancelBooking
   */
  async cancelBooking(id: string): Promise<any> {
    try {
      return await ApiClient.patch(`/bookings/cancel/${id}`, data);
    } catch (error) {
      console.error('cancelBooking error:', error);
      throw error;
    }
  }
}

export default new BookingService();
