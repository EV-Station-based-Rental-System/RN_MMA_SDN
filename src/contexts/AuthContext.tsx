/**
 * Auth Context - Quản lý authentication state
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthService, UserService } from '@/src/api';
import { UserRole } from '@/src/types/api.types';
import type { User } from '@/src/types/api.types';
import StorageService from '@/src/services/storage.service';
import { getUserIdFromToken, getUserFromToken, decodeToken } from '@/src/utils/jwt.helper';

interface AuthContextType {
  user: User | null;
  userId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setToken: (token: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication khi app khởi động
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      console.log('🔍 Checking authentication...');
      
      // Load token from storage
      const token = await AuthService.getToken();
      console.log('🔑 Token from storage:', token ? `${token.substring(0, 20)}...` : 'null');
      
      // Load user data from storage
      const userData = await StorageService.getUserData();
      console.log('👤 User data from storage:', userData);
      
      if (token && userData) {
        console.log('✅ Found token and user data in storage');
        setUser(userData);
        console.log('✅ User set from storage:', userData.email);
        
        // Decode token to get userId
        const decodedUserId = getUserIdFromToken(token);
        console.log('🆔 Decoded userId from stored token:', decodedUserId);
        
        if (decodedUserId) {
          setUserId(decodedUserId);
          console.log('✅ Authentication restored from storage');
        } else {
          console.log('⚠️ Could not decode userId from stored token');
        }
      } else {
        console.log('⚠️ No token or user data found in storage');
        // Clear any partial data
        if (token && !userData) {
          console.log('🧹 Cleaning up orphaned token...');
          await AuthService.logout();
        }
      }
    } catch (error) {
      console.error('❌ Check auth error:', error);
      // Clear storage on error to prevent corrupted state
      try {
        await AuthService.logout();
        console.log('🧹 Cleared storage due to auth check error');
      } catch (clearError) {
        console.error('❌ Failed to clear storage:', clearError);
      }
    } finally {
      setIsLoading(false);
      console.log('✅ Auth check complete');
    }
  };

  // Fetch user data from API using userId (optional - for refresh)
  const refreshUser = async () => {
    try {
      if (!userId) {
        console.log('⚠️ No userId available for refresh');
        return;
      }
      
      console.log('🔄 Refreshing user data for ID:', userId);
      
      const userData = await UserService.findOne(userId);
      console.log('✅ User data refreshed:', userData);
      console.log('🆔 User ID from API response:', userData?._id || userData?.id);
      console.log('🔍 Current userId in context:', userId);
      
      // Check if user ID from API matches current userId
      const apiUserId = userData?._id || userData?.id;
      if (apiUserId && apiUserId !== userId) {
        console.log('⚠️ WARNING: User ID mismatch!');
        console.log('   JWT userId:', userId);
        console.log('   API userId:', apiUserId);
      }
      
      // Save refreshed user data to storage
      console.log('💾 Saving refreshed user data to storage...');
      try {
        await StorageService.setUserData(userData);
        console.log('✅ Refreshed user data saved to storage');
      } catch (storageError) {
        console.error('❌ Failed to save refreshed user data to storage:', storageError);
      }
      
      setUser(userData);
      console.log('✅ User data refreshed and saved to storage');
    } catch (error: any) {
      console.error('❌ Refresh user error:', error);
      // If refresh fails, try to get user from stored token
      console.log('🔄 Attempting to restore user from token...');
      const token = await AuthService.getToken();
      if (token) {
        const userData = getUserFromToken(token);
        if (userData) {
          setUser(userData);
          console.log('✅ User restored from token');
        }
      }
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      console.log('🔐 Starting login for:', email);
      
      // Call API login - returns token string
      const token = await AuthService.login({ email, password });
      
      console.log('✅ Login successful, token received');
      
      // Decode token to extract user data
      console.log('🔍 Decoding token to extract user data...');
      const userData = getUserFromToken(token);
      
      if (userData) {
        console.log('✅ User data extracted from token:', userData.email);
        
        // Extract userId for future API calls
        const decodedUserId = getUserIdFromToken(token);
        console.log('🆔 Decoded userId from token:', decodedUserId);
        console.log('🔍 Full decoded token payload:', decodeToken(token));
        
        if (decodedUserId) {
          setUserId(decodedUserId);
          console.log('🆔 User ID set to context:', decodedUserId);
        }
        
        // Save user data to storage and state - ALWAYS save to storage on login
        console.log('💾 Saving user data to storage...');
        try {
          await StorageService.setUserData(userData);
          console.log('✅ User data saved to storage successfully');
        } catch (storageError) {
          console.error('❌ Failed to save user data to storage:', storageError);
          // Continue with login even if storage fails
        }
        
        setUser(userData);
        console.log('✅ User state updated');
      } else {
        console.log('⚠️ Could not extract user from token, using fallback');
        // Fallback: create user object from email
        const fallbackUser: User = {
          email,
          password: '', // Không lưu password
          full_name: email.split('@')[0], // Tạm thời dùng email
          role: UserRole.RENTER,
          is_active: true,
        };
        
        // Save fallback user data to storage
        try {
          await StorageService.setUserData(fallbackUser);
          console.log('✅ Fallback user data saved to storage');
        } catch (storageError) {
          console.error('❌ Failed to save fallback user data to storage:', storageError);
        }
        
        setUser(fallbackUser);
        console.log('✅ Fallback user created:', fallbackUser);
      }
      
      console.log('✅ Login complete - user data saved to storage');
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Starting logout...');
      
      // Clear storage first
      console.log('🗑️ Clearing all storage data...');
      await AuthService.logout();
      console.log('✅ Storage cleared successfully');
      
      // Reset state
      setUser(null);
      setUserId(null);
      
      console.log('✅ Logout complete - user data removed from storage');
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Even if error, reset state
      setUser(null);
      setUserId(null);
      console.log('⚠️ State reset despite storage clear error');
    }
  };

  const setToken = async (token: string) => {
    try {
      console.log('🔑 Setting token manually...');
      
      // Save token to storage
      await AuthService.setToken(token);
      console.log('✅ Token saved to storage');
      
      // Decode token to extract user data
      console.log('🔍 Decoding token to extract user data...');
      const userData = getUserFromToken(token);
      
      if (userData) {
        console.log('✅ User data extracted from token:', userData.email);
        
        // Extract userId for future API calls
        const decodedUserId = getUserIdFromToken(token);
        console.log('🆔 Decoded userId from token:', decodedUserId);
        
        if (decodedUserId) {
          setUserId(decodedUserId);
          console.log('🆔 User ID set to context:', decodedUserId);
        }
        
        // Save user data to storage and state - ALWAYS save to storage
        console.log('💾 Saving user data to storage...');
        try {
          await StorageService.setUserData(userData);
          console.log('✅ User data saved to storage successfully');
        } catch (storageError) {
          console.error('❌ Failed to save user data to storage:', storageError);
          // Continue with setting state even if storage fails
        }
        
        setUser(userData);
        console.log('✅ User state updated and saved to storage');
      } else {
        console.log('⚠️ Could not extract user from token');
        throw new Error('Invalid token');
      }
      
      console.log('✅ Token set successfully - user data saved to storage');
    } catch (error) {
      console.error('❌ Set token error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    userId,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    setUser,
    setToken,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
