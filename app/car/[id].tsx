import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '@/src/theme';
import { CustomButton } from '@/src/components';

const { width } = Dimensions.get('window');

export default function CarDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Car Details</Text>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Car Images */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800' }}
            style={styles.carImage}
            resizeMode="cover"
          />
          <TouchableOpacity style={styles.favoriteButton}>
            <Ionicons name="heart-outline" size={24} color={theme.colors.error} />
          </TouchableOpacity>
          
          {/* Image Pagination */}
          <View style={styles.imagePagination}>
            <View style={[styles.paginationDot, styles.paginationDotActive]} />
            <View style={styles.paginationDot} />
            <View style={styles.paginationDot} />
          </View>
        </View>

        {/* Car Info */}
        <View style={styles.content}>
          <Text style={styles.carName}>Tesla Model S</Text>
          <Text style={styles.carDescription}>
            A car with high specs that are rented of an affordable price.
          </Text>

          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFB800" />
            <Text style={styles.rating}> 5.0 </Text>
            <Text style={styles.reviews}>(100 Reviews)</Text>
          </View>

          {/* Owner Info */}
          <TouchableOpacity style={styles.ownerContainer}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/100?img=1' }}
              style={styles.ownerAvatar}
            />
            <View style={styles.ownerInfo}>
              <Text style={styles.ownerName}>Hela Quintin</Text>
              <View style={styles.ownerStatus}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Online</Text>
              </View>
            </View>
            <View style={styles.ownerActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="call-outline" size={20} color={theme.colors.primary.main} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="chatbubble-outline" size={20} color={theme.colors.primary.main} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

          {/* Car Features */}
          <Text style={styles.sectionTitle}>Car features</Text>
          <View style={styles.featuresGrid}>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <MaterialCommunityIcons name="car-seat" size={24} color={theme.colors.primary.main} />
              </View>
              <Text style={styles.featureLabel}>Capacity</Text>
              <Text style={styles.featureValue}>5 Seats</Text>
            </View>
            
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="flash" size={24} color={theme.colors.primary.main} />
              </View>
              <Text style={styles.featureLabel}>Engine Out</Text>
              <Text style={styles.featureValue}>670 HP</Text>
            </View>
            
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <MaterialCommunityIcons name="speedometer" size={24} color={theme.colors.primary.main} />
              </View>
              <Text style={styles.featureLabel}>Max Speed</Text>
              <Text style={styles.featureValue}>250km/h</Text>
            </View>
          </View>

          <View style={styles.featuresGrid}>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <MaterialCommunityIcons name="robot" size={24} color={theme.colors.primary.main} />
              </View>
              <Text style={styles.featureLabel}>Advance</Text>
              <Text style={styles.featureValue}>Auto Pilot</Text>
            </View>
            
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="battery-charging" size={24} color={theme.colors.primary.main} />
              </View>
              <Text style={styles.featureLabel}>Single Charge</Text>
              <Text style={styles.featureValue}>405 Miles</Text>
            </View>
            
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <MaterialCommunityIcons name="parking" size={24} color={theme.colors.primary.main} />
              </View>
              <Text style={styles.featureLabel}>Advance</Text>
              <Text style={styles.featureValue}>Auto Parking</Text>
            </View>
          </View>

          {/* Reviews */}
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>Review (125)</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {/* Review Item */}
          <View style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
              <Image
                source={{ uri: 'https://i.pravatar.cc/100?img=2' }}
                style={styles.reviewAvatar}
              />
              <View style={styles.reviewInfo}>
                <Text style={styles.reviewName}>Mr. Jack</Text>
                <Text style={styles.reviewDate}>Today</Text>
              </View>
              <View style={styles.reviewRating}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons key={star} name="star" size={14} color="#FFB800" style={{ marginRight: 2 }} />
                ))}
              </View>
            </View>
            <Text style={styles.reviewText}>
              The rental car was clean, reliable, and the service was quick and efficient. Overall, the experience was hassle-free and enjoyable.
            </Text>
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.price}>$1400/Day</Text>
        </View>
        <CustomButton
          title="Book Now →"
          onPress={() => {
            router.push({
              pathname: '/booking/[id]',
              params: { id: params.id || '1' }
            });
          }}
          style={styles.bookButton}
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
  statusText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
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
