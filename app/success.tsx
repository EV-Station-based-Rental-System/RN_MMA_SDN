/**
 * Payment Success Screen
 */

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
  Pressable,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { theme } from '@/src/theme';
import { CustomButton } from '@/src/components';
import { useEffect, useRef, useState } from 'react';

export default function PaymentSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const payUrl = params.payUrl as string;
  const message = (params.message as string) || 'Payment successful';
  const statusType = (params.statusType as string) || 'success'; // 'success' | 'pending'
  const vehicleName = params.vehicleName as string;
  const startDate = params.startDate as string;
  const endDate = params.endDate as string;
  const rentalFee = params.rentalFee as string;
  const depositAmount = params.depositAmount as string;
  const totalAmount = params.totalAmount as string;
  const paymentMethod = params.paymentMethod as string;

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [opening, setOpening] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  useEffect(() => {
    // Success animation
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenPayment = async () => {
    if (!payUrl) return;

    try {
      setOpening(true);
      // Open payment URL in an in-app browser
      const result = await WebBrowser.openBrowserAsync(payUrl, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
        toolbarColor: theme.colors.primary.main,
        controlsColor: '#FFFFFF',
        showTitle: true,
        enableBarCollapsing: false,
      });

      // Handle browser dismissal
      if (result.type === 'cancel' || result.type === 'dismiss') {
        Alert.alert(
          'Payment Incomplete',
          'You closed the payment browser. Would you like to try again?',
          [
            { text: 'Not Now', style: 'cancel' },
            { text: 'Try Again', onPress: handleOpenPayment },
          ],
        );
      }
    } catch (error) {
      console.error('Open payment browser error:', error);
      Alert.alert('Error', 'Failed to open payment browser. Please try again.');
    } finally {
      setOpening(false);
    }
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/')} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment States</Text>
        <TouchableOpacity
          style={styles.moreButton}
          activeOpacity={0.8}
          onPress={() => setShowQuickActions((prev) => !prev)}
        >
          <Ionicons name="ellipsis-horizontal" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      {showQuickActions && (
        <View pointerEvents="box-none" style={styles.quickActionsOverlay}>
          <Pressable style={styles.quickActionsBackdrop} onPress={() => setShowQuickActions(false)} />
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity
              style={styles.quickActionItem}
              activeOpacity={0.85}
              onPress={() => {
                setShowQuickActions(false);
                router.push('/');
              }}
            >
              <Ionicons name="home" size={18} color={theme.colors.text.primary} />
              <View style={styles.quickActionTextContainer}>
                <Text style={styles.quickActionTitle}>Go to homepage</Text>
                <Text style={styles.quickActionSubtitle}>Jump back to your main dashboard</Text>
              </View>
              <Ionicons name="arrow-forward" size={16} color={theme.colors.text.secondary} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Success Icon */}
        <View style={styles.successContainer}>
          <Animated.View
            style={[
              styles.successIconContainer,
              {
                transform: [{ scale: scaleAnim }, { rotate }],
              },
            ]}
          >
            <View style={[styles.successIcon, statusType === 'pending' && styles.pendingIcon]}>
              <Ionicons
                name={statusType === 'pending' ? 'time-outline' : 'checkmark'}
                size={48}
                color="#FFFFFF"
              />
            </View>
            {/* Animated circles */}
            <View
              style={[
                styles.animatedCircle,
                styles.circle1,
                statusType === 'pending' && styles.pendingCircle,
              ]}
            />
            <View
              style={[
                styles.animatedCircle,
                styles.circle2,
                statusType === 'pending' && styles.pendingCircle,
              ]}
            />
            <View
              style={[
                styles.animatedCircle,
                styles.circle3,
                statusType === 'pending' && styles.pendingCircle,
              ]}
            />
          </Animated.View>
        </View>

        <Text style={styles.successTitle}>{message}</Text>
        <Text style={styles.successSubtitle}>
          {statusType === 'pending'
            ? paymentMethod === 'bank_transfer'
              ? 'Complete your payment, then wait for staff verification before pickup'
              : 'Your booking is pending staff verification. Please wait for confirmation before pickup'
            : 'Your car rent booking has been successfully completed'}
        </Text>

        {/* Verification Notice for Pending Bookings */}
        {statusType === 'pending' && (
          <View style={[styles.paymentUrlCard, styles.verificationCard]}>
            <View style={[styles.paymentIconContainer, styles.verificationIconContainer]}>
              <Ionicons name="shield-checkmark-outline" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.paymentUrlTextContainer}>
              <Text style={styles.paymentUrlTitle}>Verification Required</Text>
              <Text style={styles.paymentUrlText}>
                {paymentMethod === 'bank_transfer'
                  ? 'After completing payment, staff will verify your booking before vehicle pickup'
                  : 'Staff will verify your booking when you arrive at the station for pickup'}
              </Text>
            </View>
          </View>
        )}

        {/* Payment Action for Bank Transfer */}
        {payUrl && statusType === 'pending' && (
          <View style={styles.paymentUrlCard}>
            <View style={styles.paymentIconContainer}>
              <Ionicons name="card-outline" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.paymentUrlTextContainer}>
              <Text style={styles.paymentUrlTitle}>Complete Payment</Text>
              <Text style={styles.paymentUrlText}>
                Tap &ldquo;Proceed to Payment&rdquo; below to complete your bank transfer payment
                securely
              </Text>
            </View>
          </View>
        )}

        {/* Booking Information Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Booking information</Text>

          {vehicleName && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Car Model</Text>
              <Text style={styles.infoValue}>{vehicleName}</Text>
            </View>
          )}

          {startDate && endDate && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Rental Period</Text>
              <Text style={styles.infoValue}>
                {new Date(startDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}{' '}
                -{' '}
                {new Date(endDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
            </View>
          )}

          {paymentMethod && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Payment Method</Text>
              <Text style={styles.infoValue}>
                {paymentMethod === 'bank_transfer' ? 'Bank Transfer' : 'Cash'}
              </Text>
            </View>
          )}
        </View>

        {/* Transaction Detail Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Summary</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Booking Date</Text>
            <Text style={styles.infoValue}>
              {new Date().toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}{' '}
              - {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>

          {rentalFee && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Rental Fee</Text>
              <Text style={styles.infoValue}>{parseFloat(rentalFee).toLocaleString('vi-VN')}₫</Text>
            </View>
          )}

          {depositAmount && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Deposit</Text>
              <Text style={styles.infoValue}>
                {parseFloat(depositAmount).toLocaleString('vi-VN')}₫
              </Text>
            </View>
          )}

          <View style={styles.divider} />

          {totalAmount && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>
                {parseFloat(totalAmount).toLocaleString('vi-VN')}₫
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        {payUrl ? (
          <>
            <CustomButton
              title={opening ? 'Opening...' : 'Proceed to Payment'}
              onPress={handleOpenPayment}
              loading={opening}
              disabled={opening}
              style={styles.homeButton}
            />
            <CustomButton
              title="I'll Pay Later"
              onPress={() => router.replace('/(tabs)/bookings')}
              style={styles.secondaryButton}
            />
          </>
        ) : (
          <>
            <CustomButton
              title="View My Bookings"
              onPress={() => router.replace('/(tabs)/bookings')}
              style={styles.homeButton}
            />
            <CustomButton
              title="Back to Home"
              onPress={() => router.replace('/(tabs)')}
              style={styles.secondaryButton}
            />
          </>
        )}
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
  moreButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  successContainer: {
    alignItems: 'center',
    marginVertical: theme.spacing['2xl'],
  },
  successIconContainer: {
    position: 'relative',
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  pendingIcon: {
    backgroundColor: '#FF9800',
  },
  animatedCircle: {
    position: 'absolute',
    borderRadius: 50,
    borderWidth: 2,
  },
  pendingCircle: {
    borderColor: '#FF9800',
  },
  circle1: {
    width: 100,
    height: 100,
    borderColor: '#4CAF50',
    opacity: 0.3,
    top: 10,
    left: 10,
  },
  circle2: {
    width: 90,
    height: 90,
    borderColor: '#4CAF50',
    opacity: 0.5,
    top: 15,
    left: 15,
  },
  circle3: {
    width: 110,
    height: 110,
    borderColor: '#4CAF50',
    opacity: 0.2,
    top: 5,
    left: 5,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  successSubtitle: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing['2xl'],
  },
  card: {
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  infoLabel: {
    fontSize: 13,
    color: theme.colors.text.secondary,
  },
  infoValue: {
    fontSize: 13,
    color: theme.colors.text.primary,
    fontWeight: '500',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mastercardLogo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  circleRed: {
    backgroundColor: '#EB001B',
  },
  circleOrange: {
    backgroundColor: '#FF5F00',
    marginLeft: -6,
  },
  cardNumber: {
    fontSize: 13,
    color: theme.colors.text.primary,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border.light,
    marginVertical: theme.spacing.md,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    height: 56,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.colors.text.primary,
  },
  bottomBar: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background.default,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  homeButton: {
    height: 56,
  },
  paymentUrlCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF8E1',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#FFD54F',
  },
  verificationCard: {
    backgroundColor: '#E8F5E9',
    borderColor: '#81C784',
  },
  paymentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verificationIconContainer: {
    backgroundColor: '#4CAF50',
  },
  paymentUrlTextContainer: {
    flex: 1,
  },
  paymentUrlTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  paymentUrlText: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    lineHeight: 18,
  },
  secondaryButton: {
    height: 56,
    marginTop: theme.spacing.sm,
    backgroundColor: theme.colors.background.paper,
  },
  quickActionsOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 25,
  },
  quickActionsBackdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  quickActionsContainer: {
    position: 'absolute',
    top: theme.spacing['2xl'] + theme.spacing.md + 8,
    right: theme.spacing.lg,
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    minWidth: 220,
    ...theme.shadows.lg,
  },
  quickActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  quickActionTextContainer: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
});
