import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
  Pressable,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { theme } from '@/src/theme';
import { CustomButton } from '@/src/components';
import VehicleService from '@/src/api/vehicle.api';
import type { VehicleWithPricingAndStation } from '@/src/types/api.types';

const { width } = Dimensions.get('window');

interface VehicleWithId extends VehicleWithPricingAndStation {
  _id?: string;
}

export default function CarDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const vehicleId = params.id as string;

  const [vehicle, setVehicle] = useState<VehicleWithId | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQuickActions, setShowQuickActions] = useState(false);

  const loadVehicleDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await VehicleService.findOne(vehicleId);
      setVehicle(data as VehicleWithId);
    } catch (err: any) {
      console.error('Load vehicle details error:', err);
      console.error('Error response:', err?.response?.data);
      console.error('Error status:', err?.response?.status);
      setError(err?.response?.data?.message || 'Failed to load vehicle details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicleDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicleId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Car Details</Text>
          <View style={styles.moreButton} />
        </View>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary.main} />
          <Text style={styles.loadingText}>Loading vehicle details...</Text>
        </View>
      </View>
    );
  }

  if (error || !vehicle) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Car Details</Text>
          <View style={styles.moreButton} />
        </View>
        <View style={styles.centerContainer}>
          <Ionicons name="car-outline" size={64} color={theme.colors.text.secondary} />
          <Text style={styles.errorText}>{error || 'Vehicle not found'}</Text>
          <TouchableOpacity onPress={loadVehicleDetails} style={styles.retryButton}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Car Details</Text>
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
        {/* Car Images */}
        <View style={styles.imageContainer}>
          <Image
            source={{ 
              uri: vehicle.img_url || 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800' 
            }}
            style={styles.carImage}
            resizeMode="cover"
          />
          <TouchableOpacity style={styles.favoriteButton}>
            <Ionicons name="heart-outline" size={24} color={theme.colors.error} />
          </TouchableOpacity>
          
          {/* Status Badge */}
          {vehicle.status && (
            <View style={[styles.statusBadge, getStatusBadgeStyle(vehicle.status)]}>
              <Text style={styles.statusText}>{vehicle.status.toUpperCase()}</Text>
            </View>
          )}
        </View>

        {/* Car Info */}
        <View style={styles.content}>
          <Text style={styles.carName}>{vehicle.make} {vehicle.model}</Text>
          <Text style={styles.carDescription}>
            {vehicle.model_year} • {vehicle.category} • VIN: {vehicle.vin_number || 'N/A'}
          </Text>

          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFB800" />
            <Text style={styles.rating}> 4.8 </Text>
            <Text style={styles.reviews}>(Based on reviews)</Text>
          </View>

          {/* Station Info */}
          {vehicle.station && (
            <View style={styles.stationContainer}>
              <View style={styles.stationIcon}>
                <Ionicons name="location" size={24} color={theme.colors.primary.main} />
              </View>
              <View style={styles.stationInfo}>
                <Text style={styles.stationLabel}>Pick-up Location</Text>
                <Text style={styles.stationName}>{vehicle.station.name}</Text>
                <Text style={styles.stationAddress}>{vehicle.station.address}</Text>
              </View>
            </View>
          )}

          {/* Car Specifications */}
          <Text style={styles.sectionTitle}>Vehicle Specifications</Text>
          <View style={styles.featuresGrid}>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <MaterialCommunityIcons name="calendar" size={24} color={theme.colors.primary.main} />
              </View>
              <Text style={styles.featureLabel}>Year</Text>
              <Text style={styles.featureValue}>{vehicle.model_year}</Text>
            </View>
            
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <MaterialCommunityIcons name="car-electric" size={24} color={theme.colors.primary.main} />
              </View>
              <Text style={styles.featureLabel}>Category</Text>
              <Text style={styles.featureValue}>{vehicle.category}</Text>
            </View>
            
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary.main} />
              </View>
              <Text style={styles.featureLabel}>Status</Text>
              <Text style={styles.featureValue}>{vehicle.is_active ? 'Active' : 'Inactive'}</Text>
            </View>
          </View>

          {/* Battery & Range */}
          {(vehicle.battery_capacity_kwh || vehicle.range_km) && (
            <View style={styles.featuresGrid}>
              {vehicle.battery_capacity_kwh && (
                <View style={styles.featureItem}>
                  <View style={styles.featureIcon}>
                    <Ionicons name="battery-charging" size={24} color={theme.colors.primary.main} />
                  </View>
                  <Text style={styles.featureLabel}>Battery</Text>
                  <Text style={styles.featureValue}>{vehicle.battery_capacity_kwh} kWh</Text>
                </View>
              )}
              
              {vehicle.range_km && (
                <View style={styles.featureItem}>
                  <View style={styles.featureIcon}>
                    <MaterialCommunityIcons name="map-marker-distance" size={24} color={theme.colors.primary.main} />
                  </View>
                  <Text style={styles.featureLabel}>Range</Text>
                  <Text style={styles.featureValue}>{vehicle.range_km} km</Text>
                </View>
              )}
              
              {vehicle.current_mileage !== undefined && (
                <View style={styles.featureItem}>
                  <View style={styles.featureIcon}>
                    <MaterialCommunityIcons name="speedometer" size={24} color={theme.colors.primary.main} />
                  </View>
                  <Text style={styles.featureLabel}>Mileage</Text>
                  <Text style={styles.featureValue}>{vehicle.current_mileage} km</Text>
                </View>
              )}
            </View>
          )}

          {/* Pricing Information */}
          {((vehicle as any).price_per_hour || vehicle.pricing) && (
            <>
              <Text style={styles.sectionTitle}>Pricing Details</Text>
              <View style={styles.pricingCard}>
                <View style={styles.pricingRow}>
                  <Text style={styles.pricingLabel}>Hourly Rate</Text>
                  <Text style={styles.pricingValue}>
                    {((vehicle as any).price_per_hour || vehicle.pricing?.price_per_hour || 0).toLocaleString('vi-VN')}₫/hr
                  </Text>
                </View>
                {((vehicle as any).price_per_day || vehicle.pricing?.price_per_day) && (
                  <View style={styles.pricingRow}>
                    <Text style={styles.pricingLabel}>Daily Rate</Text>
                    <Text style={styles.pricingValue}>
                      {((vehicle as any).price_per_day || vehicle.pricing?.price_per_day || 0).toLocaleString('vi-VN')}₫/day
                    </Text>
                  </View>
                )}
                <View style={styles.pricingRow}>
                  <Text style={styles.pricingLabel}>Deposit</Text>
                  <Text style={styles.pricingValue}>
                    {((vehicle as any).deposit_amount || vehicle.pricing?.deposit_amount || 0).toLocaleString('vi-VN')}₫
                  </Text>
                </View>
                {vehicle.pricing?.late_return_fee_per_hour && (
                  <View style={styles.pricingRow}>
                    <Text style={styles.pricingLabel}>Late Return Fee</Text>
                    <Text style={styles.pricingValue}>{vehicle.pricing.late_return_fee_per_hour.toLocaleString('vi-VN')}₫/hr</Text>
                  </View>
                )}
                {vehicle.pricing?.mileage_limit_per_day && (
                  <View style={styles.pricingRow}>
                    <Text style={styles.pricingLabel}>Daily Mileage Limit</Text>
                    <Text style={styles.pricingValue}>{vehicle.pricing.mileage_limit_per_day} km</Text>
                  </View>
                )}
                {vehicle.pricing?.excess_mileage_fee && (
                  <View style={styles.pricingRow}>
                    <Text style={styles.pricingLabel}>Excess Mileage Fee</Text>
                    <Text style={styles.pricingValue}>{vehicle.pricing.excess_mileage_fee.toLocaleString('vi-VN')}₫/km</Text>
                  </View>
                )}
              </View>
            </>
          )}

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Starting from</Text>
          <Text style={styles.price}>
            {((vehicle as any).price_per_hour || vehicle.pricing?.price_per_hour || 0).toLocaleString('vi-VN')}₫/hr
          </Text>
        </View>
        <CustomButton
          title="Book Now →"
          onPress={() => {
            if (vehicle.status === 'available') {
              router.push({
                pathname: '/booking/[id]',
                params: { id: vehicleId }
              });
            } else {
              Alert.alert(
                'Unavailable',
                `This vehicle is currently ${vehicle.status}. Please choose another vehicle.`
              );
            }
          }}
          style={styles.bookButton}
          disabled={vehicle.status !== 'available'}
        />
      </View>
    </View>
  );
}

const getStatusBadgeStyle = (status: string) => {
  switch (status) {
    case 'available':
      return { backgroundColor: theme.colors.success };
    case 'rented':
      return { backgroundColor: theme.colors.error };
    case 'maintain':
      return { backgroundColor: theme.colors.warning };
    default:
      return { backgroundColor: theme.colors.text.secondary };
  }
};

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
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    width: width,
    height: 250,
    position: 'relative',
  },
  carImage: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    position: 'absolute',
    top: theme.spacing.md,
    left: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.text.inverse,
  },
  imagePagination: {
    position: 'absolute',
    bottom: theme.spacing.md,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    width: 24,
    backgroundColor: theme.colors.secondary.main,
  },
  content: {
    padding: theme.spacing.lg,
  },
  carName: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  carDescription: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginRight: theme.spacing.xs,
  },
  reviews: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  stationContainer: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
  },
  stationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  stationInfo: {
    flex: 1,
  },
  stationLabel: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginBottom: 4,
  },
  stationName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  stationAddress: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  ownerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
  },
  ownerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: theme.spacing.md,
  },
  ownerInfo: {
    flex: 1,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  ownerStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.success,
    marginRight: 6,
  },
  ownerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background.default,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  featuresGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  featureItem: {
    flex: 1,
    alignItems: 'center',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.background.paper,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  featureLabel: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginBottom: 2,
  },
  featureValue: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  pricingCard: {
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  pricingLabel: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  pricingValue: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  errorText: {
    marginTop: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  retryButton: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borderRadius.md,
  },
  retryText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.inverse,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  seeAll: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  reviewItem: {
    marginBottom: theme.spacing.md,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: theme.spacing.sm,
  },
  reviewInfo: {
    flex: 1,
  },
  reviewName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  reviewDate: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background.default,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    ...theme.shadows.lg,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginBottom: 2,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  bookButton: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
});
