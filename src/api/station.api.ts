/**
 * Station API Service
 */

import ApiClient from '@/src/services/api.client';
import { API_ENDPOINTS } from '@/src/config/api.config';
import type {
  Station,
  StationQueryParams,
  PaginatedResponse,
  ApiResponse,
  CreateStationDto,
  UpdateStationDto,
} from '@/src/types/api.types';

class StationService {
  /**
   * Get all stations
   */
  async getStations(params?: StationQueryParams): Promise<PaginatedResponse<Station>> {
    try {
      return await ApiClient.get(API_ENDPOINTS.STATION.LIST, { params });
    } catch (error) {
      console.error('Get stations error:', error);
      throw error;
    }
  }

  /**
   * Get station by ID
   */
  async getStationById(id: string): Promise<Station> {
    try {
      const response = await ApiClient.get<ApiResponse<Station>>(
        API_ENDPOINTS.STATION.BY_ID(id)
      );
      return response.data;
    } catch (error) {
      console.error('Get station by ID error:', error);
      throw error;
    }
  }

  /**
   * Create new station
   */
  async createStation(data: CreateStationDto): Promise<Station> {
    try {
      const response = await ApiClient.post<ApiResponse<Station>>(
        API_ENDPOINTS.STATION.CREATE,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Create station error:', error);
      throw error;
    }
  }

  /**
   * Update station
   */
  async updateStation(id: string, data: UpdateStationDto): Promise<Station> {
    try {
      const response = await ApiClient.put<ApiResponse<Station>>(
        API_ENDPOINTS.STATION.UPDATE(id),
        data
      );
      return response.data;
    } catch (error) {
      console.error('Update station error:', error);
      throw error;
    }
  }

  /**
   * Get active stations
   */
  async getActiveStations(): Promise<PaginatedResponse<Station>> {
    try {
      return await ApiClient.get(API_ENDPOINTS.STATION.LIST, {
        params: { is_active: true },
      });
    } catch (error) {
      console.error('Get active stations error:', error);
      throw error;
    }
  }
}

export default new StationService();
