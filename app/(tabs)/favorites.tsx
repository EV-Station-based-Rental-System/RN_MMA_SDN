/**
 * Favorites Tab Screen - Danh sách xe yêu thích
 */

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { theme } from '@/src/theme';
import { CarCard } from '@/src/components';
import { useFavorites } from '@/src/contexts/FavoritesContext';
import VehicleService from '@/src/api/vehicle.api';

// Vehicle type with flexible structure
interface VehicleWithId {
  _id?: string;
  vin_number?: string;
  make?: string;
  model?: string;
  img_url?: string;
  station?: {
    name?: string;
  };
  pricing?: {
    price_per_hour?: number;
  };
  [key: string]: any;
}

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites, toggleFavorite, isFavorite, clearFavorites, removeMany } = useFavorites();
  const [vehicles, setVehicles] = useState<VehicleWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Search & Selection state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    loadFavoriteVehicles();
  }, [favorites]);

  // Reset search and selection mode when screen loses focus
  useFocusEffect(
    useCallback(() => {
      return () => {
        setSearchQuery('');
        setIsSelectionMode(false);
        setSelectedIds([]);
      };
    }, [])
  );

  const loadFavoriteVehicles = async () => {
    try {
      setLoading(true);
      
      if (favorites.length === 0) {
        setVehicles([]);
        setLoading(false);
        return;
      }

      // Fetch all vehicles and filter favorites
      const response = await VehicleService.findAll({ page: 1, take: 100 });
      const allVehicles = (response.data || []) as VehicleWithId[];
      
      // Filter only favorited vehicles
      const favoriteVehicles = allVehicles.filter((vehicle) => {
        const vehicleId = (vehicle as any)?._id || vehicle.vin_number;
        return favorites.includes(vehicleId);
      });

      console.log('✅ Loaded favorite vehicles:', favoriteVehicles.length);
      setVehicles(favoriteVehicles);
    } catch (error) {
      console.error('❌ Failed to load favorite vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFavoriteVehicles();
    setRefreshing(false);
  };

  // Filter vehicles based on search query
  const filteredVehicles = useMemo(() => {
    if (!searchQuery.trim()) return vehicles;
    
    const query = searchQuery.toLowerCase();
    return vehicles.filter((vehicle) => {
      const make = vehicle.make?.toLowerCase() || '';
      const model = vehicle.model?.toLowerCase() || '';
      const fullName = `${make} ${model}`.toLowerCase();
      return fullName.includes(query) || make.includes(query) || model.includes(query);
    });
  }, [vehicles, searchQuery]);

  // Toggle selection mode
  const handleToggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedIds([]);
  };

  // Toggle individual selection
  const handleToggleSelect = (vehicleId: string) => {
    setSelectedIds((prev) =>
      prev.includes(vehicleId)
        ? prev.filter((id) => id !== vehicleId)
        : [...prev, vehicleId]
    );
  };

  // Select all visible vehicles
  const handleSelectAll = () => {
    const allIds = filteredVehicles.map(
      (v) => (v as any)?._id || v.vin_number || ''
    );
    setSelectedIds(allIds);
  };

  // Deselect all
  const handleDeselectAll = () => {
    setSelectedIds([]);
  };

  // Delete selected favorites
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      return;
    }

    // Remove selected vehicle IDs atomically from favorites (single state update)
    if (removeMany) {
      await removeMany(selectedIds);
    } else {
      // Fallback: toggle one by one
      for (const id of selectedIds) {
        await toggleFavorite(id);
      }
    }
    // Remove selected items from local vehicles state immediately so UI updates
    setVehicles((prev) => prev.filter((v) => {
      const vid = (v as any)?._id || v.vin_number || '';
      return !selectedIds.includes(vid);
    }));

    // debug: log current favorites state (from context) after toggles
    console.log('🧹 Deleted selected IDs:', selectedIds);

    setSelectedIds([]);
    setIsSelectionMode(false);
  };

  // Delete all favorites
  const handleDeleteAll = async () => {
    await clearFavorites();
    // Clear local vehicles and refresh
    setVehicles([]);
    setSelectedIds([]);
    setIsSelectionMode(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>My Favorites</Text>
            <Text style={styles.headerSubtitle}>
              {favorites.length} {favorites.length === 1 ? 'vehicle' : 'vehicles'}
            </Text>
          </View>
          
          {/* Action Buttons */}
          {vehicles.length > 0 && (
            <View style={styles.headerActions}>
              {!isSelectionMode ? (
                <>
                  <TouchableOpacity
                    style={styles.headerButton}
                    onPress={handleToggleSelectionMode}
                  >
                    <Ionicons name="checkmark-circle-outline" size={24} color={theme.colors.text.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.headerButton, { marginLeft: 8 }]}
                    onPress={handleDeleteAll}
                  >
                    <Ionicons name="trash-outline" size={24} color={theme.colors.error} />
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.headerButton}
                    onPress={selectedIds.length === filteredVehicles.length ? handleDeselectAll : handleSelectAll}
                  >
                    <Text style={styles.selectAllText}>
                      {selectedIds.length === filteredVehicles.length ? 'Deselect All' : 'Select All'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.headerButton, { marginLeft: 8 }]}
                    onPress={handleToggleSelectionMode}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
        </View>

  {/* Search Bar: only show when list has 4 or more items (otherwise it's unnecessary) */}
  {vehicles.length >= 4 && (
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color={theme.colors.text.secondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search favorites..."
              placeholderTextColor={theme.colors.text.secondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                <Ionicons name="close-circle" size={20} color={theme.colors.text.secondary} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary.main} />
            <Text style={styles.loadingText}>Loading favorites...</Text>
          </View>
        ) : vehicles.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="heart-outline" size={64} color={theme.colors.text.secondary} />
            </View>
            <Text style={styles.emptyTitle}>No Favorites Yet</Text>
            <Text style={styles.emptyDescription}>
              Start exploring vehicles and tap the heart icon{'\n'}
              to add them to your favorites!
            </Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => router.push('/')}
            >
              <Text style={styles.exploreButtonText}>Explore Vehicles</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.gridContainer}>
            {filteredVehicles.map((vehicle, index) => {
              const vehicleId = (vehicle as any)?._id || vehicle.vin_number || `vehicle-${index}`;
              const isSelected = selectedIds.includes(vehicleId);
              
              return (
                <View key={vehicleId} style={styles.cardWrapper}>
                  {/* Selection Checkbox */}
                  {isSelectionMode && (
                    <TouchableOpacity
                      style={styles.checkboxContainer}
                      onPress={() => handleToggleSelect(vehicleId)}
                    >
                      <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                        {isSelected && (
                          <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                        )}
                      </View>
                    </TouchableOpacity>
                  )}
                  
                  <CarCard
                    id={vehicleId}
                    name={`${vehicle.make} ${vehicle.model}`}
                    rating={4.5}
                    location={vehicle.station?.name || 'Unknown'}
                    price={(vehicle as any)?.price_per_hour || vehicle.pricing?.price_per_hour || 0}
                    seats={4}
                    imageUrl={vehicle.img_url || 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400'}
                    onPress={() => {
                      if (isSelectionMode) {
                        handleToggleSelect(vehicleId);
                      } else {
                        router.push(`/car/${vehicleId}`);
                      }
                    }}
                    onFavorite={() => toggleFavorite(vehicleId)}
                    isFavorite={isFavorite(vehicleId)}
                  />
                </View>
              );
            })}
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Delete Selected Button (Fixed Bottom) - moved outside ScrollView so it doesn't overlap cards */}
      {isSelectionMode && (
        <View style={styles.deleteButtonContainer} pointerEvents="box-none">
          <TouchableOpacity
            style={[
              styles.deleteSelectedButton,
              selectedIds.length === 0 && styles.deleteSelectedButtonDisabled,
            ]}
            onPress={handleDeleteSelected}
            disabled={selectedIds.length === 0}
          >
            <Ionicons name="trash" size={20} color="#FFFFFF" />
            <Text style={[
              styles.deleteSelectedText,
              selectedIds.length === 0 && styles.deleteSelectedTextDisabled,
            ]}>
              Delete {selectedIds.length} {selectedIds.length === 1 ? 'item' : 'items'}
            </Text>
        </TouchableOpacity>
      </View>
    )}
  </View>
  );
}const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
    position: 'relative',
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
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background.paper,
  },
  selectAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary.main,
    paddingHorizontal: theme.spacing.sm,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.secondary,
    paddingHorizontal: theme.spacing.sm,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    height: 48,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.text.primary,
    paddingVertical: theme.spacing.sm,
  },
  clearButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: theme.colors.text.secondary,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing['2xl'] * 2,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: 15,
    color: theme.colors.text.secondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing['2xl'] * 3,
    paddingHorizontal: theme.spacing.xl,
  },
  emptyIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.background.paper,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 15,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: theme.spacing.xl,
  },
  exploreButton: {
    paddingHorizontal: theme.spacing['2xl'],
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borderRadius.lg,
  },
  exploreButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.inverse,
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
    position: 'relative',
    width: '48%',
  },
  checkboxContainer: {
    position: 'absolute',
    top: theme.spacing.sm,
    left: theme.spacing.sm,
    zIndex: 10,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: theme.colors.text.secondary,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
  },
  deleteButtonContainer: {
    position: 'absolute',
    bottom: 88, // raised above bottom tab bar so it's always visible
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    zIndex: 999,
    alignItems: 'stretch',
  },
  deleteSelectedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: theme.colors.error,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
    marginBottom: theme.spacing.md,
  },
  deleteSelectedButtonDisabled: {
    backgroundColor: theme.colors.background.paper,
    opacity: 0.7,
  },
  deleteSelectedTextDisabled: {
    color: theme.colors.text.secondary,
  },
  deleteSelectedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: theme.spacing.sm,
  },
});
