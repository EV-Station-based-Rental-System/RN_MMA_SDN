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
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useCallback } from 'react';
import { theme } from '@/src/theme';
import { CarCard, BrandIcon, BellIcon } from '@/src/components';
import { useFavorites } from '@/src/contexts/FavoritesContext';
import VehicleService from '@/src/api/vehicle.api';

// Vehicle type with flexible structure
interface VehicleWithId {
  _id?: string;
  vin_number?: string;
  search?: string;
  model?: string;
  img_url?: string;
  station?: {
    name?: string;
  };
  pricing?: {
    price_per_hour?: number;
  };
  is_active?: boolean;
  status?: string;
  model_year?: number;
  [key: string]: any;
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
  const { toggleFavorite, isFavorite } = useFavorites();
  
  const [vehicles, setVehicles] = useState<VehicleWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'available'>('all'); // 'all' = available + pending, 'available' = only available

  // Fetch vehicles on mount and when search/filters change
  useEffect(() => {
    loadVehicles();
  }, [searchQuery, selectedYear, statusFilter]);

  // Reset search when screen loses focus (user navigates away)
  useFocusEffect(
    useCallback(() => {
      // Reset search when returning to this screen
      return () => {
        setSearchQuery('');
        setSelectedYear('');
        setShowFilters(false);
        setStatusFilter('all');
      };
    }, [])
  );

  const loadVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query params with filters
      const params: any = { 
        page: 1, 
        take: 100,
        is_active: true,
      };
      
      // Build search string from search query and year filter
      const searchParts: string[] = [];
      if (searchQuery.trim()) searchParts.push(searchQuery.trim());
      if (selectedYear) searchParts.push(selectedYear);
      
      // Add search param if any filter is active
      if (searchParts.length > 0) {
        params.search = searchParts.join(' ');
      }
      
      console.log('🔍 Loading vehicles with params:', params);
      
      const response = await VehicleService.findAll(params);
      console.log('📦 Vehicles response:', JSON.stringify(response, null, 2));

      // Filter vehicles: active AND (available OR pending_booking) - CLIENT SIDE
      const rawData = (response.data || []) as any[];
      const filtered = rawData.filter((v) => {
        const isActive = v?.is_active === true || v?.isActive === true;
        const status = (v?.status || v?.state || '').toString().toLowerCase();
        
        // Apply status filter
        if (statusFilter === 'available') {
          // Only available
          return isActive && status === 'available';
        } else {
          // All: available OR pending_booking
          const isAvailableOrPending = status === 'available' || status === 'pending_booking';
          return isActive && isAvailableOrPending;
        }
      });

      console.log('✅ Filtered vehicles (active & status filter):', filtered.length);
      setVehicles(filtered as VehicleWithId[]);
    } catch (err) {
      console.error('❌ Load vehicles error:', err);
      setError('Failed to load vehicles. Please try again.');
    } finally {
      setLoading(false);
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
              <Text style={styles.logoText}>EVN</Text>
            </View>

            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.iconButton}>
                <BellIcon color={theme.colors.text.primary} size={24} />
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>2</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={20} color={theme.colors.text.secondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by brand, model, etc..."
                placeholderTextColor={theme.colors.text.placeholder}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <TouchableOpacity 
              style={[styles.filterButton, showFilters && styles.filterButtonActive]}
              onPress={() => setShowFilters(!showFilters)}
            >
              <Ionicons name="options-outline" size={20} color={showFilters ? theme.colors.text.inverse : theme.colors.text.primary} />
            </TouchableOpacity>
          </View>

          {/* Filters Panel */}
          {showFilters && (
            <View style={styles.filtersPanel}>
              <Text style={styles.filtersPanelTitle}>Filters</Text>
              
              {/* Status Filter */}
              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Status</Text>
                <View style={styles.statusFilterContainer}>
                  <TouchableOpacity 
                    style={[
                      styles.statusFilterButton,
                      statusFilter === 'all' && styles.statusFilterButtonActive
                    ]}
                    onPress={() => setStatusFilter('all')}
                  >
                    <Text style={[
                      styles.statusFilterText,
                      statusFilter === 'all' && styles.statusFilterTextActive
                    ]}>
                      All Vehicles
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.statusFilterButton,
                      statusFilter === 'available' && styles.statusFilterButtonActive
                    ]}
                    onPress={() => setStatusFilter('available')}
                  >
                    <Text style={[
                      styles.statusFilterText,
                      statusFilter === 'available' && styles.statusFilterTextActive
                    ]}>
                      Available Only
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Year Filter */}
              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Year</Text>
                <TextInput
                  style={styles.filterInput}
                  placeholder="e.g., 2024, 2025"
                  placeholderTextColor={theme.colors.text.placeholder}
                  value={selectedYear}
                  onChangeText={setSelectedYear}
                  keyboardType="numeric"
                />
              </View>

              {/* Clear Filters Button */}
              <TouchableOpacity 
                style={styles.clearFiltersButton}
                onPress={() => {
                  setSelectedYear('');
                  setStatusFilter('all');
                }}
              >
                <Text style={styles.clearFiltersText}>Clear All Filters</Text>
              </TouchableOpacity>
            </View>
          )}
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
                onPress={() => setSearchQuery(brand.name)}
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

        {/* Available Vehicles Section - Grid 2 columns */}
        {!loading && !error && vehicles.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>List Vehicles</Text>
            </View>

            <View style={styles.availableText}>
              <Text style={styles.availableLabel}>{vehicles.length} vehicles available</Text>
            </View>

            {/* Grid Container - 2 columns */}
            <View style={styles.gridContainer}>
              {vehicles.map((vehicle, index) => {
                // Try to get _id from vehicle object, fallback to index
                const vehicleId = (vehicle as any)?._id || vehicle.vin_number || `vehicle-${index}`;
                console.log('Vehicle ID for card:', vehicleId, 'Full vehicle:', vehicle);
                
                return (
                  <View key={vehicleId} style={styles.cardWrapper}>
                    <CarCard
                      id={vehicleId}
                      name={`${vehicle.make} ${vehicle.model}`}
                      rating={4.5}
                      location={vehicle.station?.name || 'Unknown'}
                      price={(vehicle as any)?.price_per_hour || vehicle.pricing?.price_per_hour || 0}
                      seats={4}
                      imageUrl={vehicle.img_url || 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400'}
                      onPress={() => {
                        console.log('Navigating to vehicle:', vehicleId);
                        router.push(`/car/${vehicleId}`);
                      }}
                      onFavorite={() => toggleFavorite(vehicleId)}
                      isFavorite={isFavorite(vehicleId)}
                    />
                  </View>
                );
              })}
            </View>
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
  filterButtonActive: {
    backgroundColor: theme.colors.primary.main,
  },
  filtersPanel: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
  },
  filtersPanelTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  filterGroup: {
    marginBottom: theme.spacing.md,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  filterInput: {
    height: 44,
    backgroundColor: theme.colors.background.default,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    fontSize: 14,
    color: theme.colors.text.primary,
    borderWidth: 1,
    borderColor: theme.colors.background.paper,
  },
  statusFilterContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  statusFilterButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.background.default,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  statusFilterButtonActive: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
  },
  statusFilterText: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.text.secondary,
  },
  statusFilterTextActive: {
    color: theme.colors.text.inverse,
    fontWeight: '600',
  },
  clearFiltersButton: {
    marginTop: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.background.default,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  clearFiltersText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.secondary,
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
  gridContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardWrapper: {
    marginBottom: theme.spacing.lg,
    width: '48%',
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

