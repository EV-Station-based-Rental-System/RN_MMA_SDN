/**
 * KYC API Service
 */

import ApiClient from '@/src/services/api.client';
import { API_ENDPOINTS } from '@/src/config/api.config';
import type { components } from '@/src/api/generated/openapi-types';

type KYC = components['schemas']['Kycs'];
type CreateKycDto = components['schemas']['CreateKycsDto'];
type UpdateKycDto = components['schemas']['UpdateKycsDto'];
type ChangeKycStatusDto = components['schemas']['ChangeKycStatusDto'];

interface ApiResponse<T = any> {
  data: T | null;
  message?: string;
}

class KycService {
  /**
   * Create new KYC document
   */
  async createKyc(data: CreateKycDto): Promise<KYC> {
    try {
      const response = await ApiClient.post<ApiResponse<KYC>>(
        API_ENDPOINTS.KYCS.CREATE,
        data
      );
      return response.data!;
    } catch (error) {
      console.error('Create KYC error:', error);
      throw error;
    }
  }

  /**
   * Update existing KYC document
   */
  async updateKyc(id: string, data: UpdateKycDto): Promise<KYC> {
    try {
      const response = await ApiClient.put<ApiResponse<KYC>>(
        API_ENDPOINTS.KYCS.UPDATE(id),
        data
      );
      return response.data!;
    } catch (error) {
      console.error('Update KYC error:', error);
      throw error;
    }
  }

  /**
   * Delete KYC document
   */
  async deleteKyc(id: string): Promise<void> {
    try {
      await ApiClient.delete(API_ENDPOINTS.KYCS.DELETE(id));
    } catch (error) {
      console.error('Delete KYC error:', error);
      throw error;
    }
  }

  /**
   * Change KYC status (admin only)
   */
  async changeStatus(id: string, status: ChangeKycStatusDto): Promise<KYC> {
    try {
      const response = await ApiClient.patch<ApiResponse<KYC>>(
        API_ENDPOINTS.KYCS.CHANGE_STATUS(id),
        status
      );
      return response.data!;
    } catch (error) {
      console.error('Change KYC status error:', error);
      throw error;
    }
  }
}

export default new KycService();
