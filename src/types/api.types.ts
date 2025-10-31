/**
 * API Types từ OpenAPI Schema
 */

// ================== Enums ==================
export enum UserRole {
  UNKNOWN = 'unknown',
  RENTER = 'renter',
  STAFF = 'staff',
  ADMIN = 'admin',
}

export enum VehicleStatus {
  MAINTAIN = 'maintain',
  AVAILABLE = 'available',
  BOOKED = 'booked',
  PENDING_BOOKING = 'pending_booking',
  RENTED = 'rented',
}

export enum BookingStatus {
  PENDING_VERIFICATION = 'pending_verification',
  VERIFIED = 'verified',
  CANCELLED = 'cancelled',
}

export enum VerificationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED_MISMATCH = 'rejected_mismatch',
  REJECTED_OTHER = 'rejected_other',
}

export enum PaymentMethod {
  UNKNOWN = 'unknown',
  CASH = 'cash',
  BANK_TRANSFER = 'bank_transfer',
}

export enum PaymentStatus {
  PAID = 'paid',
  REFUNDED = 'refunded',
  PENDING = 'pending',
}

export enum RentalStatus {
  RESERVED = 'reserved',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  LATE = 'late',
  CANCELLED = 'cancelled',
}

export enum KycType {
  NATIONAL_ID = 'national_id',
  PASSPORT = 'passport',
  DRIVER_LICENSE = 'driver_license',
  OTHER = 'other',
}

export enum KycStatus {
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

export enum InspectionType {
  PRE_RENTAL = 'pre_rental',
  POST_RENTAL = 'post_rental',
}

// ================== Base Entities ==================
export interface User {
  _id?: string;
  email: string;
  password: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  phone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Renter {
  _id?: string;
  user_id: string;
  address?: string;
  date_of_birth?: string;
  risk_score?: number;
}

export interface Staff {
  _id?: string;
  user_id: string;
  station_id: string;
  employee_code: string;
  position: string;
  hire_date: string;
}

export interface Admin {
  _id?: string;
  user_id: string;
  title?: string;
  notes?: string;
  hire_date: string;
}

export interface Station {
  _id?: string;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Vehicle {
  _id?: string;
  station_id: string;
  make: string;
  model: string;
  model_year: number;
  category: string;
  battery_capacity_kwh?: number;
  range_km?: number;
  vin_number?: string;
  img_url?: string;
  is_active: boolean;
  current_battery_capacity_kwh?: number;
  current_mileage?: number;
  status: VehicleStatus;
  created_at?: string;
  updated_at?: string;
}

export interface Pricing {
  _id?: string;
  vehicle_id: string;
  price_per_hour: number;
  price_per_day?: number;
  effective_from: string;
  effective_to?: string;
  deposit_amount: number;
  late_return_fee_per_hour?: number;
  mileage_limit_per_day?: number;
  excess_mileage_fee?: number;
  created_at?: string;
  updated_at?: string;
}

export interface VehicleWithPricingAndStation extends Vehicle {
  station?: Station;
  pricing?: Pricing;
}

export interface Kycs {
  _id?: string;
  renter_id: string;
  type: KycType;
  document_number: string;
  expiry_date?: string;
  status: KycStatus;
  submitted_at: string;
  verified_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Booking {
  _id?: string;
  renter_id: string;
  vehicle_id: string;
  rental_start_datetime: string;
  expected_return_datetime: string;
  status: BookingStatus;
  verification_status: VerificationStatus;
  verified_by_staff_id?: string;
  verified_at?: string;
  cancel_reason?: string;
  total_booking_fee_amount: number;
  deposit_fee_amount: number;
  rental_fee_amount: number;
  created_at?: string;
  updated_at?: string;
}

export interface Payment {
  _id?: string;
  booking_id: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount_paid: number;
  transaction_code?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Rental {
  _id?: string;
  booking_id: string;
  vehicle_id: string;
  pickup_datetime: string;
  expected_return_datetime: string;
  actual_return_datetime?: string;
  status: RentalStatus;
  score?: number | null;
  comment?: string;
  rated_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Inspection {
  _id?: string;
  rental_id: string;
  type: InspectionType;
  inspected_at: string;
  inspector_staff_id?: string;
  current_battery_capacity_kwh?: number;
  current_mileage: number;
  created_at?: string;
  updated_at?: string;
}

export interface Report {
  _id?: string;
  inspection_id: string;
  damage_notes?: string;
  damage_found: boolean;
  damage_price: number;
  is_over_deposit: boolean;
  over_deposit_fee_amount: number;
}

export interface ReportsPhoto {
  _id?: string;
  report_id?: string;
  inspection_id: string;
  url: string;
  label?: string;
}

export interface Contract {
  _id?: string;
  rental_id: string;
  completed_at?: string;
  document_url: string;
  label?: string;
  created_at?: string;
  updated_at?: string;
}

// ================== DTOs ==================
export interface LoginDto {
  email: string;
  password: string;
}

export interface RenterDto {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
}

export interface StaffDto {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  position: string;
  station_id: string;
}

export interface AdminDto {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  title?: string;
  notes?: string;
}

export interface SendOtpDto {
  email: string;
}

export interface VerifyOtpDto {
  email: string;
  otp: string;
}

export interface ResetPasswordDto {
  email: string;
  new_password: string;
}

export interface UpdateRenterDto {
  full_name?: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
}

export interface UpdateStaffDto {
  full_name?: string;
  phone?: string;
  position?: string;
  station_id?: string;
}

export interface CreateVehicleDto {
  make: string;
  model: string;
  model_year: number;
  category: string;
  battery_capacity_kwh?: number;
  range_km?: number;
  vin_number?: string;
  img_url?: string;
}

export interface UpdateVehicleDto {
  make?: string;
  model?: string;
  model_year?: number;
  category?: string;
  battery_capacity_kwh?: number;
  range_km?: number;
  vin_number?: string;
  img_url?: string;
}

export interface CreateStationDto {
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
}

export interface UpdateStationDto {
  name?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface CreatePricingDto {
  vehicle_id: string;
  price_per_hour: number;
  price_per_day?: number;
  effective_from: string;
  effective_to?: string;
  deposit_amount: number;
  late_return_fee_per_hour?: number;
  mileage_limit_per_day?: number;
  excess_mileage_fee?: number;
}

export interface CreateKycsDto {
  type: KycType;
  document_number: string;
  expiry_date?: string;
}

export interface UpdateKycsDto {
  type?: KycType;
  document_number?: string;
  expiry_date?: string;
}

export interface ChangeKycStatusDto {
  status: KycStatus;
}

export interface CreateBookingDto {
  payment_method: PaymentMethod;
  total_amount: number;
  vehicle_id: string;
  rental_start_datetime: string;
  expected_return_datetime: string;
}

export interface ChangeStatusBookingDto {
  verification_status: VerificationStatus;
  cancel_reason?: string;
}

export interface CreateInspectionDto {
  rental_id: string;
  type: InspectionType;
  inspected_at?: string;
  current_battery_capacity_kwh?: number;
  current_mileage: number;
}

export interface CompleteInspectionDto {
  damage_found: boolean;
  damage_notes?: string;
  damage_price?: number;
  is_over_deposit?: boolean;
  over_deposit_fee_amount?: number;
}

// ================== Response Types ==================
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  meta: {
    total: number;
    page: number;
    take: number;
    totalPages: number;
  };
}

export interface LoginResponse {
  data: {
    access_token: string;
  };
}

export interface CreateBookingResponse {
  data: {
    payUrl: string;
  };
}

export interface ErrorResponse {
  message: string | string[];
  statusCode: number;
}

// ================== Query Params ==================
export interface PaginationParams {
  page?: number;
  take?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  search?: string;
}

export interface VehicleQueryParams extends PaginationParams {
  model_year?: number;
  is_active?: boolean;
}

export interface BookingQueryParams extends PaginationParams {
  from_date?: string;
  to_date?: string;
  statusBooking?: BookingStatus;
  statusConfirm?: VerificationStatus;
  method?: PaymentMethod;
}

export interface RentalQueryParams extends PaginationParams {
  status?: RentalStatus;
  from_date?: string;
  to_date?: string;
}

export interface StationQueryParams extends PaginationParams {
  is_active?: boolean;
}
