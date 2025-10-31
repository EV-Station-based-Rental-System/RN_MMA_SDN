/**
 * Auth Context - Quản lý authentication state
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthService, UserService } from '@/src/api';
import { UserRole } from '@/src/types/api.types';
import type { User } from '@/src/types/api.types';
import StorageService from '@/src/services/storage.service';
import { getUserIdFromToken } from '@/src/utils/jwt.helper';

interface AuthContextType {
  user: User | null;
  userId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
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
      const token = await AuthService.getToken();
      const userData = await StorageService.getUserData();
      
      if (token && userData) {
        setUser(userData);
        // Decode token to get userId
        const decodedUserId = getUserIdFromToken(token);
        if (decodedUserId) {
          setUserId(decodedUserId);
        }
      }
    } catch (error) {
      console.error('Check auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user data from API using userId
  const refreshUser = async () => {
    try {
      if (!userId) return;
      console.log('🔄 Refreshing user data for ID:', userId);
      
      const userData = await UserService.getUserById(userId);
      console.log('✅ User data refreshed:', userData);
      
      await StorageService.setUserData(userData);
      setUser(userData);
    } catch (error: any) {
      console.error('❌ Refresh user error:', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      console.log('🔐 Starting login for:', email);
      
      // Call API login - returns token string
      const token = await AuthService.login({ email, password });
      
      console.log('✅ Login successful, token received');
      
      // Decode token to get user ID
      console.log('🔍 Decoding token to get user ID');
      const decodedUserId = getUserIdFromToken(token);
      console.log('✅ Decoded user ID:', decodedUserId);
      
      if (decodedUserId) {
        setUserId(decodedUserId);
        
        // Fetch full user data from API
        console.log('📡 Fetching user data from API');
        const userData = await UserService.getUserById(decodedUserId);
        console.log('✅ User data fetched:', userData);
        
        await StorageService.setUserData(userData);
        setUser(userData);
      } else {
        // Fallback: create user object from email
        const userData: User = {
          email,
          password: '', // Không lưu password
          full_name: email.split('@')[0], // Tạm thời dùng email
          role: UserRole.RENTER,
          is_active: true,
        };
        
        await StorageService.setUserData(userData);
        setUser(userData);
      }
      
      console.log('✅ User data saved, login complete');
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
      
      // Clear storage and reset state
      await AuthService.logout();
      setUser(null);
      setUserId(null);
      
      console.log('✅ Logout complete - redirecting to login');
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Even if error, clear state
      setUser(null);
      setUserId(null);
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
