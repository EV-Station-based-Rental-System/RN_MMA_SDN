/**
 * JWT Helper - Decode và extract thông tin từ JWT token
 */

import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  _id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export const decodeToken = (token: string): JwtPayload | null => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const getUserIdFromToken = (token: string): string | null => {
  const decoded = decodeToken(token);
  return decoded?._id || null;
};

export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded) return true;
  
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};
