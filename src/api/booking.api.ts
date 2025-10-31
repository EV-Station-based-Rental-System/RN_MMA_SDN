/**
 * Booking API Service
 */

import ApiClient from '@/src/services/api.client';
import { API_ENDPOINTS } from '@/src/config/api.config';
import type {
  CreateBookingDto,
  CreateBookingResponse,
  Booking,
  BookingQueryParams,
  PaginatedResponse,
  ApiResponse,
  ChangeStatusBookingDto,
} from '@/src/types/api.types';

class BookingService {
  /**
   * Create new booking
   */
  async createBooking(data: CreateBookingDto): Promise<CreateBookingResponse> {
    try {
      return await ApiClient.post<CreateBookingResponse>(
        API_ENDPOINTS.BOOKING.CREATE,
        data
      );
    } catch (error) {
      console.error('Create booking error:', error);
      throw error;
    }
  }

  /**
   * Get all bookings với pagination và filters
   */
  async getBookings(params?: BookingQueryParams): Promise<PaginatedResponse<Booking>> {
    try {
      return await ApiClient.get(API_ENDPOINTS.BOOKING.LIST, { params });
    } catch (error) {
      console.error('Get bookings error:', error);
      throw error;
    }
  }

  /**
   * Get booking by ID
   */
  async getBookingById(id: string): Promise<Booking> {
    try {
      const response = await ApiClient.get<ApiResponse<Booking>>(
        API_ENDPOINTS.BOOKING.BY_ID(id)
      );
      return response.data;
    } catch (error) {
      console.error('Get booking by ID error:', error);
      throw error;
    }
  }

  /**
   * Confirm booking (Staff only)
   */
  async confirmBooking(id: string, data: ChangeStatusBookingDto): Promise<Booking> {
    try {
      const response = await ApiClient.patch<ApiResponse<Booking>>(
        API_ENDPOINTS.BOOKING.CONFIRM(id),
        data
      );
      return response.data;
    } catch (error) {
      console.error('Confirm booking error:', error);
      throw error;
    }
  }

  /**
   * Get my bookings (current user)
   */
  async getMyBookings(params?: BookingQueryParams): Promise<PaginatedResponse<Booking>> {
    try {
      return await ApiClient.get(API_ENDPOINTS.BOOKING.LIST, { params });
    } catch (error) {
      console.error('Get my bookings error:', error);
      throw error;
    }
  }

  /**
   * Cancel booking
   */
  async cancelBooking(id: string, reason: string): Promise<Booking> {
    try {
      const response = await ApiClient.patch<ApiResponse<Booking>>(
        API_ENDPOINTS.BOOKING.CONFIRM(id),
        {
          verification_status: 'rejected_other',
          cancel_reason: reason,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Cancel booking error:', error);
      throw error;
    }
  }
}

export default new BookingService();
