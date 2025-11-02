/**
 * JWT Helper - Decode và extract thông tin từ JWT token
 */

import { jwtDecode } from 'jwt-decode';
import type { User } from '@/src/types/api.types';

interface JwtPayload {
  _id?: string;
  id?: string;
  email: string;
  role: string;
  full_name?: string;
  phone_number?: string;
  is_active?: boolean;
  iat: number;
  exp: number;
  [key: string]: any; // Allow other fields from backend
}

export const decodeToken = (token: string): JwtPayload | null => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    console.log('🔓 Decoded JWT payload:', decoded);
    return decoded;
  } catch (error) {
    console.error('❌ Error decoding token:', error);
    return null;
  }
};

export const getUserIdFromToken = (token: string): string | null => {
  const decoded = decodeToken(token);
  return decoded?._id || decoded?.id || null;
};

export const getUserFromToken = (token: string): User | null => {
  const decoded = decodeToken(token);
  if (!decoded) return null;

  try {
    // Map JWT payload to User type
    const user: User = {
      _id: decoded._id || decoded.id,
      email: decoded.email,
      role: decoded.role,
      full_name: decoded.full_name || decoded.name || decoded.email.split('@')[0],
      phone_number: decoded.phone_number || decoded.phone,
      is_active: decoded.is_active !== undefined ? decoded.is_active : true,
      password: '', // Never store password
    };

    console.log('✅ User extracted from token:', user);
    return user;
  } catch (error) {
    console.error('❌ Error extracting user from token:', error);
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded) return true;
  
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};
