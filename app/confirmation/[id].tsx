/**
 * Confirmation Screen
 */

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/src/theme';
import { CustomButton } from '@/src/components';

export default function ConfirmationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirmation</Text>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Progress Steps */}
      <View style={styles.progressContainer}>
        <View style={styles.stepContainer}>
          <View style={[styles.stepDot, styles.stepCompleted]}>
            <Ionicons name="checkmark" size={8} color="#FFFFFF" />
          </View>
          <Text style={[styles.stepLabel, styles.stepLabelActive]}>Booking details</Text>
        </View>
        
        <View style={[styles.stepLine, styles.stepLineActive]} />
        
        <View style={styles.stepContainer}>
          <View style={[styles.stepDot, styles.stepCompleted]}>
            <Ionicons name="checkmark" size={8} color="#FFFFFF" />
          </View>
          <Text style={[styles.stepLabel, styles.stepLabelActive]}>Payment methods</Text>
        </View>
        
        <View style={[styles.stepLine, styles.stepLineActive]} />
        
        <View style={styles.stepContainer}>
          <View style={[styles.stepDot, styles.stepActive]} />
          <Text style={[styles.stepLabel, styles.stepLabelActive]}>confirmation</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Car Image */}
        <View style={styles.carImageContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800' }}
            style={styles.carImage}
            resizeMode="contain"
          />
        </View>

        {/* Car Info */}
        <View style={styles.carInfo}>
          <Text style={styles.carName}>Tesla Model S</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>5.0</Text>
            <Ionicons name="star" size={16} color="#FFB800" />
            <Text style={styles.reviews}>(100reviews)</Text>
          </View>
          <Text style={styles.carDescription}>
            A car with high specs that are rented of an affordable price.
          </Text>
        </View>

        {/* Booking Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking informational</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>• Booking ID</Text>
            <Text style={styles.infoValue}>00451</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>• Name</Text>
            <Text style={styles.infoValue}>Benjamin Jack</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>• Pick up Date</Text>
            <Text style={styles.infoValue}>19 Jan 2024  10:30 am</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>• Return Date</Text>
            <Text style={styles.infoValue}>22 Jan 2024  05:10 pm</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>• Location</Text>
            <View style={styles.locationValue}>
              <Ionicons name="location-outline" size={14} color={theme.colors.text.secondary} />
              <Text style={styles.infoValue}>Shore Dr, Chicago 0062 Usa</Text>
            </View>
          </View>
        </View>

        {/* Payment */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment</Text>

          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Trx ID</Text>
            <Text style={styles.paymentValue}>#141mkv585d458</Text>
          </View>

          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Amount</Text>
            <Text style={styles.paymentValue}>$1400</Text>
          </View>

          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Service fee</Text>
            <Text style={styles.paymentValue}>$15</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total amount</Text>
            <Text style={styles.totalValue}>$1415</Text>
          </View>

          <View style={styles.paymentMethodRow}>
            <Text style={styles.paymentMethodLabel}>Payment with</Text>
            <View style={styles.mastercardBadge}>
              <View style={styles.mastercardCircles}>
                <View style={[styles.circle, styles.circleRed]} />
                <View style={[styles.circle, styles.circleOrange]} />
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <CustomButton
          title="Confirm"
          onPress={() => {
            router.push('/success');
          }}
          style={styles.confirmButton}
        />
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
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  stepContainer: {
    alignItems: 'center',
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E5E5E5',
    marginBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepActive: {
    backgroundColor: theme.colors.text.primary,
  },
  stepCompleted: {
    backgroundColor: theme.colors.text.primary,
  },
  stepLabel: {
    fontSize: 10,
    color: theme.colors.text.secondary,
  },
  stepLabelActive: {
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  stepLine: {
    height: 2,
    flex: 1,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 8,
    marginBottom: 16,
  },
  stepLineActive: {
    backgroundColor: theme.colors.text.primary,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  carImageContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  carImage: {
    width: '100%',
    height: 180,
  },
  carInfo: {
    marginBottom: theme.spacing.lg,
  },
  carName: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginRight: 4,
  },
  reviews: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginLeft: 4,
  },
  carDescription: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    lineHeight: 18,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  infoLabel: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    flex: 1,
  },
  infoValue: {
    fontSize: 13,
    color: theme.colors.text.primary,
    flex: 1.2,
    textAlign: 'right',
  },
  locationValue: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1.2,
    justifyContent: 'flex-end',
    gap: 4,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  paymentLabel: {
    fontSize: 13,
    color: theme.colors.text.secondary,
  },
  paymentValue: {
    fontSize: 13,
    color: theme.colors.text.primary,
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
    marginBottom: theme.spacing.md,
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
  paymentMethodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentMethodLabel: {
    fontSize: 13,
    color: theme.colors.text.secondary,
  },
  mastercardBadge: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  mastercardCircles: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  circleRed: {
    backgroundColor: '#EB001B',
  },
  circleOrange: {
    backgroundColor: '#FF5F00',
    marginLeft: -8,
  },
  bottomBar: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background.default,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  confirmButton: {
    height: 56,
  },
});
