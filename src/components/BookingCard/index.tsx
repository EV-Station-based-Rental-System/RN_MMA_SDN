/**
 * BookingCard Component
 * Hiển thị thông tin chi tiết của một booking
 */

import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import DateBadge from '@/src/components/DateBadge';
import { Ionicons } from '@expo/vector-icons';
import { Booking, BookingStatus, VerificationStatus } from '@/src/types/api.types';
import { theme } from '@/src/theme';
import { BookingStatusBadge } from './BookingStatusBadge';
import { styles } from './BookingCard.styles';

interface BookingCardProps {
  booking: Booking & {
    vehicle?: {
      _id?: string;
      make?: string;
      model?: string;
      img_url?: string;
      model_year?: number;
    };
  };
  onPress?: () => void;
  onCancel?: (bookingId: string) => void;
  onViewDetails?: (bookingId: string) => void;
}

export const BookingCard = ({ booking, onPress, onCancel, onViewDetails }: BookingCardProps) => {
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

      // Use English-friendly separator "at" for readability
      return `${day}/${month}/${year} at ${hours}:${minutes}`;
    } catch (error) {
      return dateString;
    }
  };

  // Kiểm tra xem có thể cancel không
  const canCancel = booking.status === BookingStatus.PENDING_VERIFICATION || 
                     (booking.status === BookingStatus.VERIFIED && 
                      booking.verification_status === VerificationStatus.PENDING);

  // Handle cancel booking
  const handleCancel = () => {
    if (!onCancel || !booking._id) return;

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
          onPress: () => onCancel(booking._id!),
        },
      ]
    );
  };

  // Handle view details
  const handleViewDetails = () => {
    if (onViewDetails && booking._id) {
      onViewDetails(booking._id);
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress || handleViewDetails}
      activeOpacity={0.7}
    >
      {/* Header with Booking ID and Status */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.bookingId}>
            Booking ID: #{booking._id?.slice(-8).toUpperCase()}
          </Text>
        </View>
        <BookingStatusBadge 
          status={booking.status} 
          verificationStatus={booking.verification_status}
        />
      </View>

      {/* Vehicle Info */}
      {booking.vehicle && (
        <View style={styles.vehicleInfo}>
          <Image
            source={{ 
              uri: booking.vehicle.img_url || 'https://via.placeholder.com/150' 
            }}
            style={styles.vehicleImage}
            resizeMode="cover"
          />
          <View style={styles.vehicleDetails}>
            <Text style={styles.vehicleName}>
              {booking.vehicle.make} {booking.vehicle.model}
            </Text>
            <Text style={styles.vehicleModel}>
              Year {booking.vehicle.model_year || 'N/A'}
            </Text>
          </View>
        </View>
      )}

      {/* Dates Section */}
      <View style={styles.datesSection}>
        <DateBadge
          label="Pickup Date"
          date={formatDateTime(booking.rental_start_datetime)}
          variant="dark"
        />

        <DateBadge
          label="Return Date (Expected)"
          date={formatDateTime(booking.expected_return_datetime)}
          variant="info"
        />
      </View>

      {/* Pricing Section */}
      <View style={styles.pricingSection}>
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
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>
            {formatCurrency(booking.total_booking_fee_amount || 0)}
          </Text>
        </View>
      </View>

      {/* Actions Section */}
      <View style={styles.actionsSection}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.primaryAction]}
          onPress={handleViewDetails}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="eye-outline" 
            size={18} 
            color={theme.colors.text.inverse} 
          />
          <Text style={[styles.actionText, styles.primaryActionText]}>
            Details
          </Text>
        </TouchableOpacity>

        {canCancel && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.dangerAction]}
            onPress={handleCancel}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="close-circle-outline" 
              size={18} 
              color={theme.colors.error} 
            />
            <Text style={[styles.actionText, styles.dangerActionText]}>
              Cancel
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Cancel Reason (if cancelled) */}
      {booking.status === BookingStatus.CANCELLED && booking.cancel_reason && (
        <View style={{ marginTop: theme.spacing.md, padding: theme.spacing.sm, backgroundColor: theme.colors.background.default, borderRadius: theme.borderRadius.md }}>
          <Text style={{ fontSize: theme.fontSizes.xs, color: theme.colors.text.secondary, marginBottom: theme.spacing.xs }}>
            Cancellation Reason:
          </Text>
          <Text style={{ fontSize: theme.fontSizes.sm, color: theme.colors.text.primary }}>
            {booking.cancel_reason}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
