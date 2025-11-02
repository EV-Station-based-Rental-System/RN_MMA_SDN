/**
 * CarCard Component
 * Card hiển thị thông tin xe
 */

import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/src/theme';

interface CarCardProps {
  id: string;
  name: string;
  rating: number;
  location: string;
  price: number;
  seats?: number;
  imageUrl: string;
  onPress?: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
}

export function CarCard({
  name,
  rating,
  location,
  price,
  seats,
  imageUrl,
  onPress,
  onFavorite,
  isFavorite = false,
}: CarCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
        <TouchableOpacity style={styles.favoriteButton} onPress={onFavorite}>
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={20}
            color={isFavorite ? theme.colors.error : theme.colors.text.secondary}
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        
        <View style={styles.row}>
          <Ionicons name="star" size={14} color="#FFB800" />
          <Text style={styles.rating}> {rating.toFixed(1)}</Text>
        </View>
        
        <View style={styles.footer}>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={12} color={theme.colors.text.secondary} />
            <Text style={styles.location} numberOfLines={1}> {location}</Text>
          </View>
          
          <View style={styles.priceRow}>
            {seats && (
              <View style={styles.seatsContainer}>
                <Ionicons name="people-outline" size={12} color={theme.colors.text.secondary} />
                <Text style={styles.seats}> {seats} Seats</Text>
              </View>
            )}
            <Text style={styles.price}>{price.toLocaleString('vi-VN')}₫/hr</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book now</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    marginRight: theme.spacing.md,
    ...theme.shadows.sm,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 120,
  },
  image: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
  },
  favoriteButton: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    fontSize: 16,
  },
  content: {
    padding: theme.spacing.sm,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  rating: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginLeft: 4,
  },
  footer: {
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  location: {
    fontSize: 11,
    color: theme.colors.text.secondary,
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  seatsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seats: {
    fontSize: 11,
    color: theme.colors.text.secondary,
  },
  price: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  bookButton: {
    height: 32,
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text.inverse,
  },
});
