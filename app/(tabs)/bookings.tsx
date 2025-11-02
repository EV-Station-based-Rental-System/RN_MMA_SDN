/**
 * Bookings Tab Screen
 * Hiển thị danh sách booking history của renter
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
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useCallback } from 'react';
import { theme } from '@/src/theme';
import { SwipeableTabs, BookingCard } from '@/src/components';
import BookingService from '@/src/api/booking.api';
import { Booking, BookingStatus, VerificationStatus, BookingQueryParams } from '@/src/types/api.types';

// Extended Booking type with vehicle info
interface BookingWithVehicle extends Booking {
  vehicle?: {
    _id?: string;
    make?: string;
    model?: string;
    img_url?: string;
    model_year?: number;
  };
}

// Filter tabs config
const FILTER_TABS = [
  { key: 'all', label: 'All', icon: 'list-outline' },
  { key: 'pending', label: 'Pending', icon: 'time-outline' },
  { key: 'approved', label: 'Approved', icon: 'checkmark-circle-outline' },
  { key: 'cancelled', label: 'Cancelled', icon: 'close-circle-outline' },
] as const;

type FilterKey = typeof FILTER_TABS[number]['key'];

export default function BookingsScreen() {
  const router = useRouter();
  
  const [bookings, setBookings] = useState<BookingWithVehicle[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<BookingWithVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<FilterKey>('all');
  const [showSearch, setShowSearch] = useState(false);

  // Load bookings on screen focus
  useFocusEffect(
    useCallback(() => {
      loadBookings();
    }, [])
  );

  // Filter bookings whenever search or filter changes
  useFocusEffect(
    useCallback(() => {
      applyFilters();
    }, [searchQuery, selectedFilter, bookings])
  );

  // Load bookings from API
  const loadBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: BookingQueryParams = {
        page: 1,
        take: 100,
        sortBy: 'created_at',
        sortOrder: 'DESC',
      };

      const response = await BookingService.getBookingsByRenter(params);
      
      if (response?.data) {
        setBookings(response.data as BookingWithVehicle[]);
      } else {
        setBookings([]);
      }
    } catch (err: any) {
      console.error('Load bookings error:', err);
      setError(err?.message || 'Unable to load booking list');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadBookings();
    setRefreshing(false);
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = [...bookings];

    // Filter by status
    if (selectedFilter === 'pending') {
      filtered = filtered.filter(
        b => b.status === BookingStatus.PENDING_VERIFICATION || 
             (b.status === BookingStatus.VERIFIED && b.verification_status === VerificationStatus.PENDING)
      );
    } else if (selectedFilter === 'approved') {
      filtered = filtered.filter(
        b => b.status === BookingStatus.VERIFIED && 
             b.verification_status === VerificationStatus.APPROVED
      );
    } else if (selectedFilter === 'cancelled') {
      filtered = filtered.filter(b => b.status === BookingStatus.CANCELLED);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        b => b._id?.toLowerCase().includes(query) ||
             b.vehicle?.make?.toLowerCase().includes(query) ||
             b.vehicle?.model?.toLowerCase().includes(query)
      );
    }

    setFilteredBookings(filtered);
  };

  // Handle cancel booking
  const handleCancelBooking = async (bookingId: string) => {
    try {
      await BookingService.cancelBooking(bookingId);
      Alert.alert('Success', 'Booking cancelled successfully');
      loadBookings(); // Reload list
    } catch (err: any) {
      console.error('Cancel booking error:', err);
      Alert.alert('Error', err?.message || 'Unable to cancel booking');
    }
  };

  // Handle view details
  const handleViewDetails = (bookingId: string) => {
    // Navigate to booking details screen
    router.push(`/booking-details/${bookingId}`);
  };

  // Render filter tabs
  const renderFilterTabs = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filterTabsContainer}
      style={styles.filterTabs}
    >
      {FILTER_TABS.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.filterTab,
            selectedFilter === tab.key && styles.filterTabActive,
          ]}
          onPress={() => setSelectedFilter(tab.key)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={tab.icon as any}
            size={18}
            color={
              selectedFilter === tab.key
                ? theme.colors.text.inverse
                : theme.colors.text.secondary
            }
          />
          <Text
            style={[
              styles.filterTabText,
              selectedFilter === tab.key && styles.filterTabTextActive,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons
        name="calendar-outline"
        size={64}
        color={theme.colors.text.disabled}
      />
      <Text style={styles.emptyStateTitle}>No Bookings Yet</Text>
      <Text style={styles.emptyStateSubtitle}>
        {searchQuery
          ? 'No matching results found'
          : 'You haven\'t made any bookings yet. Start exploring vehicles!'}
      </Text>
      {!searchQuery && (
        <TouchableOpacity
          style={styles.emptyStateButton}
          onPress={() => router.push('/(tabs)')}
          activeOpacity={0.7}
        >
          <Text style={styles.emptyStateButtonText}>Explore Vehicles</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Render error state
  const renderErrorState = () => (
    <View style={styles.errorState}>
      <Ionicons
        name="alert-circle-outline"
        size={64}
        color={theme.colors.error}
      />
      <Text style={styles.errorTitle}>Something Went Wrong</Text>
      <Text style={styles.errorMessage}>{error}</Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={loadBookings}
        activeOpacity={0.7}
      >
        <Ionicons name="refresh-outline" size={20} color={theme.colors.text.inverse} />
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SwipeableTabs>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background.default} />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>My Bookings</Text>
            <TouchableOpacity
              onPress={() => setShowSearch(!showSearch)}
              activeOpacity={0.7}
              style={styles.searchToggle}
            >
              <Ionicons
                name={showSearch ? 'close' : 'search'}
                size={24}
                color={theme.colors.text.primary}
              />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          {showSearch && (
            <View style={styles.searchContainer}>
              <Ionicons
                name="search"
                size={20}
                color={theme.colors.text.secondary}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search booking ID, vehicle name..."
                placeholderTextColor={theme.colors.text.disabled}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery('')}
                  activeOpacity={0.7}
                  style={styles.clearButton}
                >
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={theme.colors.text.secondary}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Filter Tabs */}
          {renderFilterTabs()}

          {/* Results Count */}
          {!loading && (
            <Text style={styles.resultsCount}>
              {filteredBookings.length} booking
            </Text>
          )}
        </View>

        {/* Content */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary.main} />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : error ? (
          renderErrorState()
        ) : filteredBookings.length === 0 ? (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {renderEmptyState()}
          </ScrollView>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
          >
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onCancel={handleCancelBooking}
                onViewDetails={handleViewDetails}
              />
            ))}
          </ScrollView>
        )}
      </View>
    </SwipeableTabs>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  
  // Header
  header: {
    backgroundColor: theme.colors.background.paper,
    paddingTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  headerTitle: {
    fontSize: theme.fontSizes.xl,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  searchToggle: {
    padding: theme.spacing.xs,
  },
  
  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.default,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    height: 48,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.fontSizes.base,
    color: theme.colors.text.primary,
    paddingVertical: theme.spacing.sm,
  },
  clearButton: {
    padding: theme.spacing.xs,
  },
  
  // Filter Tabs
  filterTabs: {
    marginBottom: theme.spacing.sm,
  },
  filterTabsContainer: {
    paddingRight: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.background.default,
    marginRight: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  filterTabActive: {
    backgroundColor: theme.colors.primary.main,
  },
  filterTabText: {
    fontSize: theme.fontSizes.sm,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  filterTabTextActive: {
    color: theme.colors.text.inverse,
  },
  
  // Results Count
  resultsCount: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.fontSizes.base,
    color: theme.colors.text.secondary,
  },
  
  // Content
  scrollContent: {
    padding: theme.spacing.md,
    flexGrow: 1,
  },
  
  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xl * 2,
  },
  emptyStateTitle: {
    fontSize: theme.fontSizes.xl,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  emptyStateSubtitle: {
    fontSize: theme.fontSizes.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xl,
  },
  emptyStateButton: {
    backgroundColor: theme.colors.primary.main,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  emptyStateButtonText: {
    fontSize: theme.fontSizes.base,
    fontWeight: '600',
    color: theme.colors.text.inverse,
  },
  
  // Error State
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xl * 2,
    paddingHorizontal: theme.spacing.xl,
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
