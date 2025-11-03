/**
 * Booking Time Selection Screen
 * Select rental start and end date/time
 */

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { theme } from '@/src/theme';
import VehicleService from '@/src/api/vehicle.api';
import BookingService from '@/src/api/booking.api';
import { PaymentMethod } from '@/src/types/api.types';
import type { VehicleWithPricingAndStation } from '@/src/types/api.types';

export default function BookingTimeSelectionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const vehicleId = params.id as string;

  const [vehicle, setVehicle] = useState<VehicleWithPricingAndStation | null>(null);
  const [loading, setLoading] = useState(true);

  // Date/Time states
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date;
  });

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.BANK_TRANSFER);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await VehicleService.findOne(vehicleId);
        setVehicle(data);
      } catch (error: any) {
        console.error('Load vehicle error:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [vehicleId]);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const calculateDuration = (): { hours: number; days: number } => {
    const diffMs = endDate.getTime() - startDate.getTime();
    const hours = Math.ceil(diffMs / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    return { hours, days };
  };

  const calculatePrice = (): number => {
    const { hours } = calculateDuration();
    const pricePerHour = (vehicle as any)?.price_per_hour || vehicle?.pricing?.price_per_hour || 0;
    const pricePerDay = (vehicle as any)?.price_per_day || vehicle?.pricing?.price_per_day || 0;

    // Debug: In ra console để kiểm tra
    console.warn('🔍 Price Calculation:', {
      hours,
      pricePerHour,
      pricePerDay,
      useDaily: hours >= 24,
    });

    // Nếu thuê >= 24 giờ (1 ngày trở lên): tính theo ngày (làm tròn lên)
    // Ví dụ: 24h = 1 ngày, 26h = 2 ngày, 48h = 2 ngày, 49h = 3 ngày
    if (hours >= 24) {
      const totalDays = Math.ceil(hours / 24);
      const price = totalDays * pricePerDay;
      console.warn(`✅ DAILY: ${totalDays} days × ${pricePerDay} = ${price}`);
      return price;
    }

    // Nếu thuê < 24 giờ: tính theo giờ
    const price = hours * pricePerHour;
    console.warn(`✅ HOURLY: ${hours} hours × ${pricePerHour} = ${price}`);
    return price;
  };

  const handleCreateBooking = async () => {
    try {
      if (endDate <= startDate) {
        alert('End date must be after start date');
        return;
      }
      setSubmitting(true);

      const { hours } = calculateDuration();
      const rentalUntil = hours >= 24 ? 'days' : 'hours';

      const bookingData = {
        payment_method: paymentMethod,
        total_amount: totalAmount,
        vehicle_id: vehicleId,
        rental_start_datetime: startDate.toISOString(),
        expected_return_datetime: endDate.toISOString(),
        rental_until: rentalUntil,
      };

      console.warn('📤 Creating booking with data:', JSON.stringify(bookingData, null, 2));

      const resp = await BookingService.createBooking(bookingData as any);

      // Bank Transfer: Has payUrl, needs payment then staff verification
      if (resp?.data?.payUrl && paymentMethod === PaymentMethod.BANK_TRANSFER) {
        router.push({
          pathname: '/success',
          params: {
            payUrl: resp.data.payUrl,
            message: 'Booking Pending Verification',
            statusType: 'pending',
            vehicleName: `${vehicle?.make} ${vehicle?.model}`,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            rentalFee: rentalFee.toString(),
            depositAmount: depositAmount.toString(),
            totalAmount: totalAmount.toString(),
            paymentMethod: paymentMethod,
          },
        });
      }
      // Cash Payment: No payUrl, needs staff verification at pickup
      else if (paymentMethod === PaymentMethod.CASH) {
        router.push({
          pathname: '/success',
          params: {
            message: 'Booking Pending Verification',
            statusType: 'pending',
            vehicleName: `${vehicle?.make} ${vehicle?.model}`,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            rentalFee: rentalFee.toString(),
            depositAmount: depositAmount.toString(),
            totalAmount: totalAmount.toString(),
            paymentMethod: paymentMethod,
          },
        });
      }
      // Fallback
      else {
        alert('Booking created successfully. Waiting for staff verification.');
        router.replace('/(tabs)/bookings');
      }
    } catch (error: any) {
      console.error('❌ Create booking error:', error);
      console.error('❌ Error response:', error?.response);
      console.error('❌ Error response data:', JSON.stringify(error?.response?.data, null, 2));

      const msg = error?.response?.data?.message || error?.message || 'Failed to create booking';
      alert(`Booking Error: ${msg}`);
    } finally {
      setSubmitting(false);
    }
  };

  const onStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const onStartTimeChange = (event: any, selectedDate?: Date) => {
    setShowStartTimePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const onEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const onEndTimeChange = (event: any, selectedDate?: Date) => {
    setShowEndTimePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Rental Period</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary.main} />
        </View>
      </View>
    );
  }

  if (!vehicle) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Rental Period</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Vehicle not found</Text>
        </View>
      </View>
    );
  }

  const { hours } = calculateDuration();
  const rentalFee = calculatePrice();
  const depositAmount = (vehicle as any)?.deposit_amount || vehicle?.pricing?.deposit_amount || 0;
  const totalAmount = rentalFee + depositAmount;
  const isDailyRental = hours >= 24;
  const totalDays = isDailyRental ? Math.ceil(hours / 24) : 0;
  const durationDisplay = isDailyRental
    ? `${totalDays} day${totalDays > 1 ? 's' : ''}`
    : `${hours} hour${hours !== 1 ? 's' : ''}`;
  const rateDisplay = isDailyRental
    ? `${((vehicle as any)?.price_per_day || 0).toLocaleString('vi-VN')}₫/day`
    : `${((vehicle as any)?.price_per_hour || 0).toLocaleString('vi-VN')}₫/h`;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Rental Period</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Vehicle Info Card */}
        <View style={styles.vehicleCard}>
          <Image
            source={{ uri: vehicle.img_url || 'https://via.placeholder.com/120' }}
            style={styles.vehicleImage}
          />
          <View style={styles.vehicleInfo}>
            <Text style={styles.vehicleName}>
              {vehicle.make} {vehicle.model}
            </Text>
            <Text style={styles.vehicleDetails}>
              {vehicle.model_year} • {vehicle.category}
            </Text>
            <View style={styles.vehicleSpecs}>
              {vehicle.battery_capacity_kwh && (
                <View style={styles.spec}>
                  <Ionicons name="battery-charging" size={14} color={theme.colors.text.secondary} />
                  <Text style={styles.specText}>{vehicle.battery_capacity_kwh} kWh</Text>
                </View>
              )}
              {vehicle.range_km && (
                <View style={styles.spec}>
                  <MaterialCommunityIcons
                    name="map-marker-distance"
                    size={14}
                    color={theme.colors.text.secondary}
                  />
                  <Text style={styles.specText}>{vehicle.range_km} km</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Pick-up Station */}
        {vehicle.station && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="location" size={20} color={theme.colors.primary.main} />
              <Text style={styles.sectionTitle}>Pick-up Location</Text>
            </View>
            <View style={styles.stationCard}>
              <Text style={styles.stationName}>{vehicle.station.name}</Text>
              <Text style={styles.stationAddress}>{vehicle.station.address}</Text>
            </View>
          </View>
        )}

        {/* Start Date & Time */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="calendar" size={20} color={theme.colors.primary.main} />
            <Text style={styles.sectionTitle}>Rental Start</Text>
          </View>

          <TouchableOpacity
            style={styles.dateTimeButton}
            onPress={() => setShowStartDatePicker(true)}
          >
            <View style={styles.dateTimeContent}>
              <Ionicons name="calendar-outline" size={20} color={theme.colors.text.secondary} />
              <Text style={styles.dateTimeText}>{formatDate(startDate)}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dateTimeButton}
            onPress={() => setShowStartTimePicker(true)}
          >
            <View style={styles.dateTimeContent}>
              <Ionicons name="time-outline" size={20} color={theme.colors.text.secondary} />
              <Text style={styles.dateTimeText}>{formatTime(startDate)}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
          </TouchableOpacity>
        </View>

        {/* End Date & Time */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="calendar" size={20} color={theme.colors.primary.main} />
            <Text style={styles.sectionTitle}>Rental End</Text>
          </View>

          <TouchableOpacity
            style={styles.dateTimeButton}
            onPress={() => setShowEndDatePicker(true)}
          >
            <View style={styles.dateTimeContent}>
              <Ionicons name="calendar-outline" size={20} color={theme.colors.text.secondary} />
              <Text style={styles.dateTimeText}>{formatDate(endDate)}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dateTimeButton}
            onPress={() => setShowEndTimePicker(true)}
          >
            <View style={styles.dateTimeContent}>
              <Ionicons name="time-outline" size={20} color={theme.colors.text.secondary} />
              <Text style={styles.dateTimeText}>{formatTime(endDate)}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
          </TouchableOpacity>
        </View>

        {/* Pricing Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing Summary</Text>
          <View style={styles.pricingCard}>
            <View style={styles.pricingHeader}>
              <View>
                <Text style={styles.pricingTitle}>Total due today</Text>
                <Text style={styles.pricingAmount}>{totalAmount.toLocaleString('vi-VN')}₫</Text>
              </View>
              <View style={styles.pricingBadge}>
                <Ionicons name="shield-checkmark" size={16} color={theme.colors.primary.main} />
                <Text style={styles.pricingBadgeText}>Includes deposit</Text>
              </View>
            </View>

            <View style={styles.pricingDivider} />

            <View style={styles.pricingBreakdown}>
              <View style={styles.pricingRow}>
                <View style={styles.pricingLabelGroup}>
                  <Ionicons name="time-outline" size={18} color={theme.colors.text.secondary} />
                  <Text style={styles.pricingLabel}>Rental duration</Text>
                </View>
                <Text style={styles.pricingValue}>{durationDisplay}</Text>
              </View>

              <View style={styles.pricingRow}>
                <View style={styles.pricingLabelGroup}>
                  <Ionicons name="pricetag-outline" size={18} color={theme.colors.text.secondary} />
                  <Text style={styles.pricingLabel}>
                    {isDailyRental ? 'Daily rate' : 'Hourly rate'}
                  </Text>
                </View>
                <Text style={styles.pricingValue}>{rateDisplay}</Text>
              </View>

              <View style={styles.pricingRow}>
                <View style={styles.pricingLabelGroup}>
                  <Ionicons name="car-outline" size={18} color={theme.colors.text.secondary} />
                  <Text style={styles.pricingLabel}>Rental fee</Text>
                </View>
                <Text style={styles.pricingValue}>{rentalFee.toLocaleString('vi-VN')}₫</Text>
              </View>

              <View style={[styles.pricingRow, styles.pricingRowHighlight]}>
                <View style={styles.pricingLabelGroup}>
                  <Ionicons name="wallet-outline" size={18} color={theme.colors.primary.main} />
                  <Text style={[styles.pricingLabel, styles.pricingLabelHighlight]}>
                    Refundable deposit
                  </Text>
                </View>
                <Text style={[styles.pricingValue, styles.pricingValueHighlight]}>
                  {depositAmount.toLocaleString('vi-VN')}₫
                </Text>
              </View>
            </View>

            <View style={styles.pricingNote}>
              <Ionicons name="information-circle" size={16} color={theme.colors.text.secondary} />
              <Text style={styles.pricingNoteText}>
                Deposit is refunded once the vehicle is returned in good condition.
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Date/Time Pickers */}
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onStartDateChange}
          minimumDate={new Date()}
        />
      )}

      {showStartTimePicker && (
        <DateTimePicker
          value={startDate}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onStartTimeChange}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onEndDateChange}
          minimumDate={startDate}
        />
      )}

      {showEndTimePicker && (
        <DateTimePicker
          value={endDate}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onEndTimeChange}
        />
      )}

      {/* Bottom Action */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomSummary}>
          <View style={styles.bottomSummaryHeader}>
            <Text style={styles.bottomPriceLabel}>Total due today</Text>
            <Text style={styles.bottomPrice}>{totalAmount.toLocaleString('vi-VN')}₫</Text>
          </View>
        </View>

        <View style={styles.bottomPaymentSection}>
          <Text style={styles.bottomPaymentLabel}>Payment method</Text>
          <View style={styles.bottomPaymentOptions}>
            <TouchableOpacity
              onPress={() => setPaymentMethod(PaymentMethod.BANK_TRANSFER)}
              style={[
                styles.bottomPaymentOption,
                paymentMethod === PaymentMethod.BANK_TRANSFER && styles.bottomPaymentOptionSelected,
              ]}
              activeOpacity={0.85}
            >
              <Image
                source={{
                  uri: 'https://developers.momo.vn/v3/assets/images/icon-wthout-bgr-e4496e210dca9a7372ad1fe53d079e16.png',
                }}
                style={styles.bottomPaymentLogo}
                resizeMode="contain"
              />
              <View style={styles.bottomPaymentDetails}>
                <Text style={styles.bottomPaymentTitle}>MoMo</Text>
                <Text style={styles.bottomPaymentSubtitle}>Online payment</Text>
              </View>
              {paymentMethod === PaymentMethod.BANK_TRANSFER && (
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={theme.colors.primary.main}
                  style={styles.bottomPaymentCheck}
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setPaymentMethod(PaymentMethod.CASH)}
              style={[
                styles.bottomPaymentOption,
                paymentMethod === PaymentMethod.CASH && styles.bottomPaymentOptionSelected,
              ]}
              activeOpacity={0.85}
            >
              <View style={styles.bottomPaymentIconBubble}>
                <Ionicons name="cash" size={18} color="#10B981" />
              </View>
              <View style={styles.bottomPaymentDetails}>
                <Text style={styles.bottomPaymentTitle}>Cash</Text>
                <Text style={styles.bottomPaymentSubtitle}>Pay on pickup</Text>
              </View>
              {paymentMethod === PaymentMethod.CASH && (
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={theme.colors.primary.main}
                  style={styles.bottomPaymentCheck}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.checkoutButton, submitting && styles.checkoutButtonDisabled]}
          onPress={handleCreateBooking}
          activeOpacity={0.85}
          disabled={submitting}
        >
          <View style={styles.checkoutButtonContent}>
            <View>
              <Text style={styles.checkoutButtonText}>
                {submitting ? 'Processing payment…' : 'Proceed to payment'}
              </Text>
            </View>
            <View style={styles.checkoutButtonIcon}>
              {submitting ? (
                <ActivityIndicator color={theme.colors.text.inverse} />
              ) : (
                <Ionicons name="arrow-forward" size={20} color={theme.colors.text.inverse} />
              )}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing['2xl'],
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.error,
  },
  vehicleCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.paper,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
  },
  vehicleImage: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.md,
  },
  vehicleInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  vehicleDetails: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  vehicleSpecs: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  spec: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  specText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  section: {
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  stationCard: {
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
  },
  stationName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  stationAddress: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  dateTimeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  dateTimeText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text.primary,
  },
  pricingCard: {
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.md,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  pricingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
  },
  pricingTitle: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  pricingAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  pricingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECF8FF',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
    gap: 6,
  },
  pricingBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.primary.main,
  },
  pricingDivider: {
    height: 1,
    backgroundColor: theme.colors.border.light,
    marginVertical: theme.spacing.md,
  },
  pricingBreakdown: {
    gap: theme.spacing.sm,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pricingLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pricingLabel: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  pricingValue: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  pricingRowHighlight: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.sm,
    backgroundColor: '#F8FBFF',
  },
  pricingLabelHighlight: {
    color: theme.colors.primary.main,
  },
  pricingValueHighlight: {
    color: theme.colors.primary.main,
  },
  pricingNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: theme.spacing.lg,
  },
  pricingNoteText: {
    flex: 1,
    fontSize: 12,
    color: theme.colors.text.secondary,
    lineHeight: 18,
  },
  bottomBar: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background.default,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    gap: theme.spacing.md,
  },
  bottomSummary: {
    width: '100%',
    gap: theme.spacing.xs,
  },
  bottomSummaryHeader: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 4,
  },
  bottomPriceLabel: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bottomPrice: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  bottomPaymentSection: {
    gap: theme.spacing.sm,
  },
  bottomPaymentLabel: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bottomPaymentOptions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  bottomPaymentOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  bottomPaymentOptionSelected: {
    borderColor: theme.colors.primary.main,
    backgroundColor: '#F0F9FF',
  },
  bottomPaymentLogo: {
    width: 40,
    height: 24,
  },
  bottomPaymentIconBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomPaymentDetails: {
    flex: 1,
  },
  bottomPaymentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  bottomPaymentSubtitle: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  bottomPaymentCheck: {
    marginLeft: 'auto',
  },
  checkoutButton: {
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borderRadius.xl,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 2,
  },
  checkoutButtonDisabled: {
    opacity: 0.7,
  },
  checkoutButtonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing.md,
    borderRadius: theme.spacing.xl,
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text.inverse,
  },
  checkoutButtonIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
