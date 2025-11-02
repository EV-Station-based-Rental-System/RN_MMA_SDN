/**
 * Booking Details Screen
 * Hiển thị chi tiết của một booking
 */

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { theme } from '@/src/theme';
import { BookingStatusBadge } from '@/src/components';
import BookingService from '@/src/api/booking.api';
import { Booking, BookingStatus, VerificationStatus } from '@/src/types/api.types';

// Extended Booking type with vehicle info
interface BookingWithVehicle extends Booking {
  vehicle?: {
    _id?: string;
    make?: string;
    model?: string;
    img_url?: string;
    model_year?: number;
    battery_capacity_kwh?: number;
    range_km?: number;
    category?: string;
    station?: {
      name?: string;
      address?: string;
    };
  };
}

export default function BookingDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<BookingWithVehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  // Load booking details
  useEffect(() => {
    loadBookingDetails();
  }, [bookingId]);

  const loadBookingDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await BookingService.getBookingById(bookingId);
      if (response?.data) {
        setBooking(response.data as BookingWithVehicle);
      } else {
        setError('Booking not found');
      }
    } catch (err: any) {
      console.error('Load booking details error:', err);
      setError(err?.message || 'Unable to load booking details');
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  // Format date time - Native JavaScript
  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${day}/${month}/${year} at ${hours}:${minutes}`;
    } catch (error) {
      return dateString;
    }
  };

  // Handle cancel booking
  const handleCancelBooking = async () => {
    if (!booking?._id) return;

    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Cancel Booking',
          style: 'destructive',
          onPress: async () => {
            try {
              setCancelling(true);
              await BookingService.cancelBooking(booking._id!);
              Alert.alert('Success', 'Booking cancelled successfully', [
                {
                  text: 'OK',
                  onPress: () => {
                    // Reload booking details
                    loadBookingDetails();
                  },
                },
              ]);
            } catch (err: any) {
              console.error('Cancel booking error:', err);
              Alert.alert('Error', err?.message || 'Unable to cancel booking');
            } finally {
              setCancelling(false);
            }
          },
        },
      ]
    );
  };

  // Check if booking can be cancelled
  const canCancel = booking?.status === BookingStatus.PENDING_VERIFICATION ||
                     (booking?.status === BookingStatus.VERIFIED &&
                      booking?.verification_status === VerificationStatus.PENDING);

  // Loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Booking Details</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary.main} />
          <Text style={styles.loadingText}>Loading booking details...</Text>
        </View>
      </View>
    );
  }

  // Error state
  if (error || !booking) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Booking Details</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.centerContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={64}
            color={theme.colors.error}
          />
          <Text style={styles.errorTitle}>Unable to Load Booking</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadBookingDetails}
            activeOpacity={0.7}
          >
            <Ionicons name="refresh-outline" size={20} color={theme.colors.text.inverse} />
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background.default} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Booking ID and Status */}
        <View style={styles.section}>
          <View style={styles.bookingHeader}>
            <View style={styles.bookingIdContainer}>
              <Text style={styles.bookingIdLabel}>Booking ID</Text>
              <Text style={styles.bookingId}>#{booking._id?.slice(-8).toUpperCase()}</Text>
            </View>
            <BookingStatusBadge
              status={booking.status}
              verificationStatus={booking.verification_status}
            />
          </View>
        </View>

        {/* Vehicle Information */}
        {booking.vehicle && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="car" size={20} color={theme.colors.primary.main} />
              <Text style={styles.sectionTitle}>Vehicle Information</Text>
            </View>

            <View style={styles.vehicleCard}>
              <Image
                source={{ uri: booking.vehicle.img_url || 'https://via.placeholder.com/120' }}
                style={styles.vehicleImage}
                resizeMode="cover"
              />
              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleName}>
                  {booking.vehicle.make} {booking.vehicle.model}
                </Text>
                <Text style={styles.vehicleDetails}>
                  {booking.vehicle.model_year} • {booking.vehicle.category}
                </Text>

                {/* Vehicle Specs */}
                <View style={styles.vehicleSpecs}>
                  {booking.vehicle.battery_capacity_kwh && (
                    <View style={styles.spec}>
                      <Ionicons name="battery-charging" size={14} color={theme.colors.text.secondary} />
                      <Text style={styles.specText}>{booking.vehicle.battery_capacity_kwh} kWh</Text>
                    </View>
                  )}
                  {booking.vehicle.range_km && (
                    <View style={styles.spec}>
                      <MaterialCommunityIcons
                        name="map-marker-distance"
                        size={14}
                        color={theme.colors.text.secondary}
                      />
                      <Text style={styles.specText}>{booking.vehicle.range_km} km</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* Station Information */}
            {booking.vehicle.station && (
              <View style={styles.stationCard}>
                <View style={styles.stationHeader}>
                  <Ionicons name="location" size={16} color={theme.colors.primary.main} />
                  <Text style={styles.stationTitle}>Pickup Location</Text>
                </View>
                <Text style={styles.stationName}>{booking.vehicle.station.name}</Text>
                <Text style={styles.stationAddress}>{booking.vehicle.station.address}</Text>
              </View>
            )}
          </View>
        )}

        {/* Rental Period */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="calendar" size={20} color={theme.colors.primary.main} />
            <Text style={styles.sectionTitle}>Rental Period</Text>
          </View>

          <View style={styles.dateCard}>
            {/* Pickup Date */}
            <View style={styles.dateRow}>
              <View style={styles.dateIconContainer}>
                <Ionicons
                  name="log-in-outline"
                  size={20}
                  color={theme.colors.primary.main}
                />
              </View>
              <View style={styles.dateInfo}>
                <Text style={styles.dateLabel}>Pickup Date & Time</Text>
                <Text style={styles.dateValue}>
                  {formatDateTime(booking.rental_start_datetime)}
                </Text>
              </View>
            </View>

            {/* Return Date */}
            <View style={styles.dateRow}>
              <View style={styles.dateIconContainer}>
                <Ionicons
                  name="log-out-outline"
                  size={20}
                  color={theme.colors.info}
                />
              </View>
              <View style={styles.dateInfo}>
                <Text style={styles.dateLabel}>Expected Return Date & Time</Text>
                <Text style={styles.dateValue}>
                  {formatDateTime(booking.expected_return_datetime)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Pricing Breakdown */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="card" size={20} color={theme.colors.primary.main} />
            <Text style={styles.sectionTitle}>Pricing Breakdown</Text>
          </View>

          <View style={styles.pricingCard}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Rental Fee</Text>
              <Text style={styles.priceValue}>
                {formatCurrency(booking.rental_fee_amount || 0)}
              </Text>
            </View>

            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Deposit</Text>
              <Text style={styles.priceValue}>
                {formatCurrency(booking.deposit_fee_amount || 0)}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(booking.total_booking_fee_amount || 0)}
              </Text>
            </View>
          </View>
        </View>

        {/* Booking Timeline */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time" size={20} color={theme.colors.primary.main} />
            <Text style={styles.sectionTitle}>Booking Timeline</Text>
          </View>

          <View style={styles.timelineCard}>
            {/* Created */}
            <View style={styles.timelineItem}>
              <View style={styles.timelineDot} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Booking Created</Text>
                <Text style={styles.timelineDate}>
                  {booking.created_at ? formatDateTime(booking.created_at) : 'N/A'}
                </Text>
              </View>
            </View>

            {/* Verified */}
            {booking.status === BookingStatus.VERIFIED && booking.verified_at && (
              <View style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>Booking Verified</Text>
                  <Text style={styles.timelineDate}>
                    {formatDateTime(booking.verified_at)}
                  </Text>
                </View>
              </View>
            )}

            {/* Cancelled */}
            {booking.status === BookingStatus.CANCELLED && (
              <View style={styles.timelineItem}>
                <View style={[styles.timelineDot, styles.cancelledDot]} />
                <View style={styles.timelineContent}>
                  <Text style={[styles.timelineTitle, styles.cancelledText]}>Booking Cancelled</Text>
                  <Text style={styles.timelineDate}>
                    {booking.updated_at ? formatDateTime(booking.updated_at) : 'N/A'}
                  </Text>
                  {booking.cancel_reason && (
                    <Text style={styles.cancelReason}>
                      Reason: {booking.cancel_reason}
                    </Text>
                  )}
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        {canCancel && (
          <View style={styles.section}>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={handleCancelBooking}
              disabled={cancelling}
              activeOpacity={0.7}
            >
              {cancelling ? (
                <ActivityIndicator size="small" color={theme.colors.text.inverse} />
              ) : (
                <>
                  <Ionicons
                    name="close-circle-outline"
                    size={20}
                    color={theme.colors.text.inverse}
                  />
                  <Text style={styles.cancelButtonText}>Cancel Booking</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing['2xl'],
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.background.paper,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: theme.fontSizes.xl,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  placeholder: {
    width: 40,
  },

  // Content
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },

  // Booking Header
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bookingIdContainer: {
    flex: 1,
  },
  bookingIdLabel: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  bookingId: {
    fontSize: theme.fontSizes.lg,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },

  // Vehicle Card
  vehicleCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  vehicleImage: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.md,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: theme.fontSizes.lg,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  vehicleDetails: {
    fontSize: theme.fontSizes.base,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  vehicleSpecs: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  spec: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  specText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text.secondary,
  },

  // Station Card
  stationCard: {
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
  },
  stationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  stationTitle: {
    fontSize: theme.fontSizes.base,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  stationName: {
    fontSize: theme.fontSizes.base,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  stationAddress: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },

  // Date Card
  dateCard: {
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  dateIconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background.default,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  dateInfo: {
    flex: 1,
  },
  dateLabel: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  dateValue: {
    fontSize: theme.fontSizes.base,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },

  // Pricing Card
  pricingCard: {
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  priceLabel: {
    fontSize: theme.fontSizes.base,
    color: theme.colors.text.secondary,
  },
  priceValue: {
    fontSize: theme.fontSizes.base,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border.light,
    marginVertical: theme.spacing.sm,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  totalLabel: {
    fontSize: theme.fontSizes.lg,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  totalValue: {
    fontSize: theme.fontSizes.xl,
    fontWeight: '700',
    color: theme.colors.primary.main,
  },

  // Timeline
  timelineCard: {
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary.main,
    marginRight: theme.spacing.md,
    marginTop: 6,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: theme.fontSizes.base,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  timelineDate: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  cancelReason: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
  },
  cancelledDot: {
    backgroundColor: theme.colors.error,
  },
  cancelledText: {
    color: theme.colors.error,
  },

  // Action Buttons
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
  },
  cancelButton: {
    backgroundColor: theme.colors.error,
  },
  cancelButtonText: {
    fontSize: theme.fontSizes.base,
    fontWeight: '600',
    color: theme.colors.text.inverse,
  },

  // Loading/Error States
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.fontSizes.base,
    color: theme.colors.text.secondary,
  },
  errorTitle: {
    fontSize: theme.fontSizes.xl,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  errorMessage: {
    fontSize: theme.fontSizes.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary.main,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
  },
  retryButtonText: {
    fontSize: theme.fontSizes.base,
    fontWeight: '600',
    color: theme.colors.text.inverse,
  },
});