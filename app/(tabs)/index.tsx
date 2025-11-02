/**
 * Home Tab Screen
 */

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { theme } from '@/src/theme';
import { CarCard, BrandIcon, BellIcon } from '@/src/components';
import { useAuth } from '@/src/contexts/AuthContext';
import VehicleService from '@/src/api/vehicle.api';
import type { components } from '@/src/api/generated/openapi-types';

type VehicleFromAPI = components['schemas']['VehicleWithPricingAndStation'];

// Extend type to handle runtime _id field from MongoDB
interface VehicleWithId extends Omit<VehicleFromAPI, 'station_id'> {
  _id?: string;
  station_id?: string;
}

// Get current time
const getCurrentTime = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Mock data - Brand icons will use MaterialCommunityIcons for car brands
const BRANDS = [
  { id: '1', name: 'Tesla', icon: 'lightning-bolt' },
  { id: '2', name: 'Lamborghini', icon: 'car-sports' },
  { id: '3', name: 'BMW', icon: 'car-convertible' },
  { id: '4', name: 'VinFast', icon: 'car-electric' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  
  const [vehicles, setVehicles] = useState<VehicleWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch vehicles on mount
  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await VehicleService.getAvailableVehicles({ page: 1, take: 10 });
      console.log('Vehicles response:', JSON.stringify(response, null, 2));
      console.log('First vehicle:', response.data?.[0]);
      setVehicles((response.data || []) as VehicleWithId[]);
    } catch (err) {
      console.error('Load vehicles error:', err);
      setError('Failed to load vehicles. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              router.replace('/(auth)/login');
            } catch (error) {
              console.error('Logout error:', error);
            }
          },
        },
      ]
    );
  };

  const handleAvatarPress = () => {
    if (!isAuthenticated) {
      router.push('/(auth)/login');
    } else {
      // TODO: Navigate to profile
      Alert.alert('Profile', `Logged in as: ${user?.email}`);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Ionicons name="car-sport" size={18} color={theme.colors.text.inverse} />
              </View>
              <Text style={styles.logoText}>Qent</Text>
            </View>

            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.iconButton}>
                <BellIcon color={theme.colors.text.primary} size={24} />
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>2</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.iconButton} 
                onPress={handleAvatarPress}
                onLongPress={isAuthenticated ? handleLogout : undefined}
              >
                {isAuthenticated ? (
                  <View style={styles.avatarContainer}>
                    <Image
                      source={{ uri: 'https://i.pravatar.cc/100' }}
                      style={styles.avatar}
                    />
                    <View style={styles.onlineBadge} />
                  </View>
                ) : (
                  <View style={[styles.avatar, styles.avatarPlaceholder]}>
                    <Ionicons name="person-outline" size={16} color={theme.colors.text.secondary} />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={20} color={theme.colors.text.secondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search your dream car..."
                placeholderTextColor={theme.colors.text.placeholder}
              />
            </View>
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="options-outline" size={20} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Brands Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Brands</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.brandsContainer}
          >
            {BRANDS.map((brand) => (
              <BrandIcon
                key={brand.id}
                name={brand.name}
                icon={brand.icon}
                onPress={() => {}}
              />
            ))}
          </ScrollView>
        </View>

        {/* Loading / Error State */}
        {loading && (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary.main} />
            <Text style={styles.loadingText}>Loading vehicles...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={loadVehicles} style={styles.retryButton}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Available Vehicles Section */}
        {!loading && !error && vehicles.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Available Vehicles</Text>
              <TouchableOpacity>
                <Text style={styles.viewAll}>View All</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.availableText}>
              <Text style={styles.availableLabel}>{vehicles.length} vehicles available</Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carsContainer}
            >
              {vehicles.map((vehicle, index) => {
                // Try to get _id from vehicle object, fallback to index
                const vehicleId = (vehicle as any)?._id || vehicle.vin_number || `vehicle-${index}`;
                console.log('Vehicle ID for card:', vehicleId, 'Full vehicle:', vehicle);
                
                return (
                  <CarCard
                    key={vehicleId}
                    id={vehicleId}
                    name={`${vehicle.make} ${vehicle.model}`}
                    rating={4.5}
                    location={vehicle.station?.name || 'Unknown'}
                    price={vehicle.pricing?.price_per_hour || 0}
                    seats={4}
                    imageUrl={vehicle.img_url || 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400'}
                    onPress={() => {
                      console.log('Navigating to vehicle:', vehicleId);
                      router.push(`/car/${vehicleId}`);
                    }}
                    onFavorite={() => {}}
                  />
                );
              })}
            </ScrollView>
          </View>
        )}

        {!loading && !error && vehicles.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="car-outline" size={64} color={theme.colors.text.secondary} />
            <Text style={styles.emptyText}>No vehicles available</Text>
            <TouchableOpacity onPress={loadVehicles} style={styles.retryButton}>
              <Text style={styles.retryText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: theme.spacing['2xl'],
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: theme.spacing.md,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme.colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.text.inverse,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarPlaceholder: {
    backgroundColor: theme.colors.background.paper,
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: theme.colors.background.default,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    marginRight: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text.primary,
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginTop: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  viewAll: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  brandsContainer: {
    paddingHorizontal: theme.spacing.lg,
  },
  availableText: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  availableLabel: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  carsContainer: {
    paddingHorizontal: theme.spacing.lg,
  },
  centerContainer: {
    paddingVertical: theme.spacing['4xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  errorContainer: {
    paddingVertical: theme.spacing['2xl'],
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  emptyContainer: {
    paddingVertical: theme.spacing['4xl'],
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.lg,
  },
  retryButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borderRadius.md,
  },
  retryText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.inverse,
  },
});
