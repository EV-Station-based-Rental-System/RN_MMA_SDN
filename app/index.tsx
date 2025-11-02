/**
 * Welcome Screen - Màn hình chào mừng đầu tiên
 */

import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '@/src/theme';
import { Logo } from '@/src/components';

export default function WelcomeScreen() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/(auth)/onboarding');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800' }}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.logoContainer}>
            <Logo size="medium" variant="secondary" />
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Welcome to</Text>
            <Text style={styles.appName}>EVN</Text>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
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
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing['4xl'],
  },
  title: {
    fontSize: 32,
    fontWeight: '400',
    color: theme.colors.text.inverse,
    marginBottom: theme.spacing.sm,
  },
  appName: {
    fontSize: 48,
    fontWeight: '700',
    color: theme.colors.text.inverse,
  },
  footer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing['2xl'],
  },
  button: {
    height: 56,
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.inverse,
  },
});
