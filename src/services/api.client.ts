/**
 * Axios Client với Interceptors
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from '@/src/config/api.config';
import StorageService from '@/src/services/storage.service';
import type { ErrorResponse } from '@/src/types/api.types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: API_CONFIG.HEADERS,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request Interceptor - Thêm JWT token vào header
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const token = await StorageService.getAccessToken();
        
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Log request trong development
        if (__DEV__) {
          console.log('🚀 API Request:', {
            method: config.method?.toUpperCase(),
            url: config.url,
            data: config.data,
            params: config.params,
          });
        }

        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response Interceptor - Xử lý response và error
    this.client.interceptors.response.use(
      (response) => {
        // Log response trong development
        if (__DEV__) {
          console.log('✅ API Response:', {
            url: response.config.url,
            status: response.status,
            data: response.data,
          });
        }

        return response;
      },
      async (error: AxiosError<ErrorResponse>) => {
        const { response, config } = error;

        // Log error
        console.error('❌ API Error:', {
          url: config?.url,
          status: response?.status,
          message: response?.data?.message,
        });

        // Xử lý các trường hợp error
        if (response) {
          switch (response.status) {
            case 401:
              // Unauthorized - Token hết hạn hoặc không hợp lệ
              console.log('🔒 Unauthorized - Clearing token...');
              await StorageService.clearAll();
              // TODO: Navigate to login screen
              break;

            case 403:
              // Forbidden - Không có quyền truy cập
              console.log('🚫 Forbidden - Access denied');
              break;

            case 404:
              // Not Found
              console.log('🔍 Resource not found');
              break;

            case 409:
              // Conflict - Dữ liệu đã tồn tại
              console.log('⚠️ Conflict - Resource already exists');
              break;

            case 500:
              // Server Error
              console.log('💥 Server error');
              break;

            default:
              console.log('❓ Unknown error:', response.status);
          }
        } else if (error.request) {
          // Request được gửi nhưng không nhận được response
          console.error('📡 No response received:', error.request);
        } else {
          // Lỗi khác trong quá trình setup request
          console.error('⚙️ Request setup error:', error.message);
        }

        return Promise.reject(error);
      }
    );
  }

  // Expose axios instance
  getInstance(): AxiosInstance {
    return this.client;
  }

  // Helper methods
  async get<T = any>(url: string, config?: any) {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: any) {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: any) {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async patch<T = any>(url: string, data?: any, config?: any) {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: any) {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export default new ApiClient();
