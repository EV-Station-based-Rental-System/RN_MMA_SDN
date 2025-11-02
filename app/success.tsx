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
  Linking,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/src/theme';
import { CustomButton } from '@/src/components';
import { useEffect, useRef, useState } from 'react';

export default function PaymentSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const payUrl = params.payUrl as string;
  const message = (params.message as string) || 'Payment successful';
  
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [opening, setOpening] = useState(false);

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
      const supported = await Linking.canOpenURL(payUrl);
      
      if (supported) {
        await Linking.openURL(payUrl);
      } else {
        Alert.alert('Error', 'Cannot open payment URL');
      }
    } catch (error) {
      console.error('Open URL error:', error);
      Alert.alert('Error', 'Failed to open payment URL');
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
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

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
            <View style={styles.successIcon}>
              <Ionicons name="checkmark" size={48} color="#FFFFFF" />
            </View>
            {/* Animated circles */}
            <View style={[styles.animatedCircle, styles.circle1]} />
            <View style={[styles.animatedCircle, styles.circle2]} />
            <View style={[styles.animatedCircle, styles.circle3]} />
          </Animated.View>
        </View>

        <Text style={styles.successTitle}>{message}</Text>
        <Text style={styles.successSubtitle}>
          {payUrl ? 'Please complete your payment to finalize your booking' : 'Your car rent booking has been successfully completed'}
        </Text>

        {payUrl && (
          <View style={styles.paymentUrlCard}>
            <Ionicons name="information-circle-outline" size={20} color={theme.colors.primary.main} />
            <Text style={styles.paymentUrlText}>
              Tap the button below to proceed to payment
            </Text>
          </View>
        )}

        {/* Booking Information Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Booking information</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Car Model</Text>
            <Text style={styles.infoValue}>Tesla Model S</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Rental Date</Text>
            <Text style={styles.infoValue}>19.Jan24 - 22.Jan 24</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoValue}>Benjamin Jack</Text>
          </View>
        </View>

        {/* Transaction Detail Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Transaction detail</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Transaction ID</Text>
            <Text style={styles.infoValue}>#100012390J1</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Transaction Date</Text>
            <Text style={styles.infoValue}>01-Jan2024 - 10:30 am</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Payment  Method</Text>
            <View style={styles.paymentMethod}>
              <View style={styles.mastercardLogo}>
                <View style={[styles.circle, styles.circleRed]} />
                <View style={[styles.circle, styles.circleOrange]} />
              </View>
              <Text style={styles.cardNumber}>123 ••• ••• •••25</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Amount</Text>
            <Text style={styles.infoValue}>$1400</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Service fee</Text>
            <Text style={styles.infoValue}>$15</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tax</Text>
            <Text style={styles.infoValue}>$0</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total amount</Text>
            <Text style={styles.totalValue}>$1415</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="download-outline" size={20} color={theme.colors.text.primary} />
          <Text style={styles.actionButtonText}>Download Receipt</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-social-outline" size={20} color={theme.colors.text.primary} />
          <Text style={styles.actionButtonText}>Shar Your Receipt</Text>
        </TouchableOpacity>

        <View style={{ height: 120 }} />
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
  animatedCircle: {
    position: 'absolute',
    borderRadius: 50,
    borderWidth: 2,
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
    backgroundColor: theme.colors.background.paper,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
    marginHorizontal: theme.spacing.lg,
  },
  paymentUrlText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text.primary,
    lineHeight: 20,
  },
  secondaryButton: {
    height: 56,
    marginTop: theme.spacing.sm,
    backgroundColor: theme.colors.background.paper,
  },
});
