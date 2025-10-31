/**
 * API Configuration
 */

export const API_CONFIG = {
  BASE_URL: 'https://be-nestjs.blackdune-7a87f460.southeastasia.azurecontainerapps.io',
  TIMEOUT: 30000,
  HEADERS: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER_RENTER: '/auth/register/renter',
    REGISTER_STAFF: '/auth/register/staff',
    REGISTER_ADMIN: '/auth/register/admin',
    SEND_OTP: '/auth/send-otp',
    VERIFY_EMAIL: '/auth/verify-email',
    RESET_PASSWORD: '/auth/reset-password',
  },
  
  // Users
  USERS: {
    RENTER: '/users/renter',
    STAFF: '/users/staff',
    BY_ID: (id: string) => `/users/${id}`,
    UPDATE_RENTER: (id: string) => `/users/update-renter/${id}`,
    UPDATE_STAFF: (id: string) => `/users/update-staff/${id}`,
    SOFT_DELETE: (id: string) => `/users/soft-delete/${id}`,
    RESTORE: (id: string) => `/users/restore/${id}`,
  },
  
  // Vehicle
  VEHICLE: {
    LIST: '/vehicle',
    BY_ID: (id: string) => `/vehicle/${id}`,
    CREATE: '/vehicle',
    UPDATE: (id: string) => `/vehicle/${id}`,
    SOFT_DELETE: (id: string) => `/vehicle/soft-delete/${id}`,
    HARD_DELETE: (id: string) => `/vehicle/${id}`,
    WITH_STATION_AND_PRICING: '/vehicle/with-station-and-pricing',
  },
  
  // Pricing
  PRICING: {
    CREATE: '/pricings',
    UPDATE: (id: string) => `/pricings/${id}`,
    DELETE: (id: string) => `/pricings/${id}`,
    HISTORY_BY_VEHICLE: (vehicleId: string) => `/pricings/vehicle/${vehicleId}/history`,
  },
  
  // KYC
  KYCS: {
    CREATE: '/kycs',
    UPDATE: (id: string) => `/kycs/${id}`,
    DELETE: (id: string) => `/kycs/${id}`,
    CHANGE_STATUS: (id: string) => `/kycs/${id}/status`,
  },
  
  // Booking
  BOOKING: {
    CREATE: '/bookings',
    LIST: '/bookings',
    BY_ID: (id: string) => `/bookings/${id}`,
    CONFIRM: (id: string) => `/bookings/confirm/${id}`,
  },
  
  // Payment
  PAYMENT: {
    CONFIRM_CASH: (id: string) => `/payments/confirm-cash/${id}`,
  },
  
  // Rental
  RENTAL: {
    LIST: '/rentals',
    BY_ID: (id: string) => `/rentals/${id}`,
  },
  
  // Inspection
  INSPECTION: {
    CREATE: '/inspection',
    UPLOAD_PHOTO: (id: string) => `/inspection/${id}/upload-photo`,
    GET_PHOTOS: (id: string) => `/inspection/${id}/photos`,
    COMPLETE: (id: string) => `/inspection/${id}/complete`,
    DELETE: (id: string) => `/inspection/${id}`,
  },
  
  // Contract
  CONTRACT: {
    CREATE: '/contracts',
    UPDATE: (id: string) => `/contracts/${id}`,
    DELETE: (id: string) => `/contracts/${id}`,
  },
  
  // Station
  STATION: {
    LIST: '/station',
    BY_ID: (id: string) => `/station/${id}`,
    CREATE: '/station',
    UPDATE: (id: string) => `/station/${id}`,
    SOFT_DELETE: (id: string) => `/station/soft-delete/${id}`,
    HARD_DELETE: (id: string) => `/station/${id}`,
  },
};
