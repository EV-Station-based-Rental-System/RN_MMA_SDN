/**
 * KycService
 * Auto-generated from OpenAPI spec
 */

import ApiClient from '@/src/services/api.client';

class KycService {
  /**
   * create
   */
  async create(data: any): Promise<any> {
    try {
      // Create FormData for multipart upload
      const formData = new FormData();
      
      // Append text fields
      if (data.type) formData.append('type', data.type);
      if (data.document_number) formData.append('document_number', data.document_number);
      if (data.expiry_date) formData.append('expiry_date', data.expiry_date);
      
      // Handle file upload - if document_img_url is a local file URI, convert to file
      if (data.document_img_url) {
        if (data.document_img_url.startsWith('file://')) {
          // Convert local file URI to file object for upload
          const fileUri = data.document_img_url;
          const fileName = `kyc-${Date.now()}.jpg`; // Generate filename
          
          // Create file object from URI
          const file = {
            uri: fileUri,
            type: 'image/jpeg',
            name: fileName,
          };
          
          formData.append('document_img_url', file as any);
        } else {
          // If it's already a URL or other format, append as string
          formData.append('document_img_url', data.document_img_url);
        }
      }

      return await ApiClient.post(`/kycs`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
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
      return await ApiClient.put(`/kycs/${id}`, data);
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
      return await ApiClient.delete(`/kycs/${id}`);
    } catch (error) {
      console.error('remove error:', error);
      throw error;
    }
  }

  /**
   * changeStatus
   */
  async changeStatus(id: string, data: any): Promise<any> {
    try {
      return await ApiClient.patch(`/kycs/${id}/status`, data);
    } catch (error) {
      console.error('changeStatus error:', error);
      throw error;
    }
  }
}

export default new KycService();
