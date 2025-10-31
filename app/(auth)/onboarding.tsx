/**
 * Onboarding Screen
 * Màn hình giới thiệu với carousel
 */

import { View, Text, StyleSheet, ImageBackground, Dimensions, TouchableOpacity } from 'react-native';
import { useState, useRef } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/src/theme';
import { CustomButton } from '@/src/components';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: 1,
    title: 'Lets Start',
    subtitle: 'A New Experience\nWith Car rental.',
    description: "Discover your next adventure with Qent. we're here to provide you with a seamless car rental experience. Let's get started on your journey.",
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800',
  },
  // Có thể thêm slides khác
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleGetStarted = () => {
    router.push('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: SLIDES[currentIndex].image }}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Ionicons name="car-sport" size={32} color={theme.colors.text.inverse} />
            </View>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.title}>{SLIDES[currentIndex].title}</Text>
            <Text style={styles.subtitle}>{SLIDES[currentIndex].subtitle}</Text>
            
            <Text style={styles.description}>
              {SLIDES[currentIndex].description}
            </Text>
          </View>

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
              title="Get Started"
              onPress={handleGetStarted}
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
    justifyContent: 'space-between',
  },
  logoContainer: {
    paddingTop: 60,
    paddingLeft: theme.spacing.lg,
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.secondary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing['2xl'],
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.text.inverse,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.text.inverse,
    marginBottom: theme.spacing.lg,
    lineHeight: 40,
  },
  description: {
    fontSize: 14,
    color: theme.colors.text.inverse,
    lineHeight: 20,
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
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: theme.colors.secondary.main,
  },
  button: {
    width: '100%',
  },
});
