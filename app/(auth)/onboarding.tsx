/**
 * Onboarding Screen
 * Màn hình giới thiệu với carousel và smooth animations
 */

import { 
  View, 
  Text, 
  StyleSheet, 
  ImageBackground, 
  Dimensions, 
  TouchableOpacity,
  ScrollView,
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { useState, useRef } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/src/theme';
import { CustomButton, Logo } from '@/src/components';

const { width } = Dimensions.get('window');

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    title: 'Welcome to',
    subtitle: 'Premium Car Rental',
    description: "Discover your next adventure with Qent. We're here to provide you with a seamless car rental experience.",
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800',
  },
  {
    id: 2,
    title: 'Choose Your',
    subtitle: 'Dream Car',
    description: 'Browse through our premium collection of vehicles. From luxury sedans to sporty convertibles, find the perfect ride.',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800',
  },
  {
    id: 3,
    title: 'Book in',
    subtitle: 'Just a Few Taps',
    description: 'Simple and fast booking process. Reserve your car instantly and hit the road in minutes.',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800',
  },
  {
    id: 4,
    title: 'Drive with',
    subtitle: 'Confidence',
    description: 'All vehicles are regularly maintained and insured. Enjoy your journey with complete peace of mind.',
    image: 'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=800',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    if (index !== currentIndex) {
      setCurrentIndex(index);
      // Fade animation when changing slides
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: width * (currentIndex + 1),
        animated: true,
      });
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = () => {
    router.push('/(auth)/login');
  };

  const handleGetStarted = () => {
    router.push('/(auth)/login');
  };

  const isLastSlide = currentIndex === SLIDES.length - 1;

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: SLIDES[currentIndex].image }}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          {/* Header with Logo and Skip */}
          <View style={styles.header}>
            <Logo size="medium" variant="secondary" />
            {!isLastSlide && (
              <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                <Text style={styles.skipText}>Skip</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Scrollable Slides */}
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            style={styles.scrollView}
          >
            {SLIDES.map((slide) => (
              <View key={slide.id} style={styles.slide}>
                <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                  <Text style={styles.title}>{slide.title}</Text>
                  <Text style={styles.subtitle}>{slide.subtitle}</Text>
                  <Text style={styles.description}>{slide.description}</Text>
                </Animated.View>
              </View>
            ))}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            {/* Pagination Dots */}
            <View style={styles.pagination}>
              {SLIDES.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    index === currentIndex && styles.dotActive,
                  ]}
                />
              ))}
            </View>

            <CustomButton
              title={isLastSlide ? 'Get Started' : 'Next'}
              onPress={handleNext}
              style={styles.button}
            />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: theme.spacing.lg,
  },
  skipButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.inverse,
    opacity: 0.8,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: width,
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing['2xl'],
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: theme.colors.text.inverse,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 36,
    fontWeight: '700',
    color: theme.colors.text.inverse,
    marginBottom: theme.spacing.lg,
    lineHeight: 44,
  },
  description: {
    fontSize: 16,
    color: theme.colors.text.inverse,
    lineHeight: 24,
    opacity: 0.9,
  },
  footer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing['2xl'],
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
  },
  dotActive: {
    width: 32,
    backgroundColor: theme.colors.secondary.main,
  },
  button: {
    width: '100%',
  },
});
