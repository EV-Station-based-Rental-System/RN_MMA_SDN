/**
 * BookingService
 * Auto-generated from OpenAPI spec
 */

import ApiClient from '@/src/services/api.client';
import type {
  CreateBookingDto,
  Booking,
  BookingQueryParams,
  CreateBookingResponse,
} from '@/src/types/api.types';

class BookingService {
  /**
   * createBooking - Creates a new booking and returns payment URL
   */
  async createBooking(data: CreateBookingDto): Promise<CreateBookingResponse> {
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
  async getAllBookings(params?: BookingQueryParams): Promise<any> {
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
   * getBookingsByRenter - Get booking history for logged-in renter
   */
  async getBookingsByRenter(params?: BookingQueryParams): Promise<{ data: Booking[] }> {
    try {
      return await ApiClient.get(`/bookings/history-renter`, { params });
    } catch (error) {
      console.error('getBookingsByRenter error:', error);
      throw error;
    }
  }

  /**
   * getBookingById - Get booking details by ID
   */
  async getBookingById(id: string): Promise<{ data: Booking }> {
    try {
      return await ApiClient.get(`/bookings/${id}`);
    } catch (error) {
      console.error('getBookingById error:', error);
      throw error;
    }
  }

  /**
   * cancelBooking - Cancel a booking
   */
  async cancelBooking(id: string): Promise<any> {
    try {
      return await ApiClient.patch(`/bookings/cancel/${id}`);
    } catch (error) {
      console.error('cancelBooking error:', error);
      throw error;
    }
  }
}

export default new BookingService();