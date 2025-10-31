/**
 * Sign Up Screen
 */

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/src/theme';
import { CustomButton, CustomInput } from '@/src/components';
import { StatusBar } from 'expo-status-bar';
import { AuthService } from '@/src/api';

export default function SignUpScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleSignUp = async () => {
    // Validate inputs
    if (!fullName || !email || !password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Validate password length
    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    try {
      setIsLoading(true);
      setApiError(null);
      // Register renter
      await AuthService.registerRenter({
        email: email.trim(),
        password,
        full_name: fullName.trim(),
        phone: phone.trim() || undefined,
      });

      // Registration successful
      Alert.alert(
        'Success',
        'Account created successfully! Please login to continue.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(auth)/login'),
          },
        ]
      );
    } catch (error: any) {
      console.error('Signup failed:', error);
      // Try to extract a useful message from different error shapes
      let errorMessage: string = 'Registration failed. Please try again.';

      try {
        // axios-like error with response.data.message
        if (error?.response?.data) {
          const d = error.response.data;
          if (typeof d.message === 'string') errorMessage = d.message;
          else if (Array.isArray(d.message)) errorMessage = d.message.join('\n');
          else if (typeof d === 'string') errorMessage = d;
        } else if (typeof error?.message === 'string') {
          // generic Error
          errorMessage = error.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        }
      } catch (parseErr) {
        console.warn('Failed to parse signup error', parseErr);
      }

      // Show inline error banner for better UX (works on web & native)
      setApiError(errorMessage);

      // Also log and show a smaller alert as fallback
      Alert.alert('Registration Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  const handleGooglePay = () => {
    // TODO: Implement Google Pay signup
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Ionicons name="car-sport" size={22} color={theme.colors.text.inverse} />
            </View>
            <Text style={styles.logoText}>Qent</Text>
          </View>

          <Text style={styles.title}>Sign Up</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <CustomInput
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />

          <CustomInput
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <CustomInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            isPassword
          />

          <CustomInput 
            placeholder="Phone Number (Optional)" 
            value={phone} 
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <CustomButton 
            title={isLoading ? "Creating Account..." : "Sign up"} 
            onPress={handleSignUp} 
            style={styles.signupButton}
            disabled={isLoading}
          />

          {/* Inline API error banner */}
          {apiError ? (
            <View style={styles.apiErrorBox}>
              <Text style={styles.apiErrorText}>{apiError}</Text>
            </View>
          ) : null}

          <CustomButton title="Login" onPress={handleLogin} variant="secondary" />

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.socialButton} onPress={handleGooglePay}>
            <Ionicons name="logo-google" size={20} color="#DB4437" />
            <Text style={styles.socialButtonText}>Login with Google</Text>
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.footerLink}>Login.</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  header: {
    paddingTop: theme.spacing['2xl'],
    marginBottom: theme.spacing.xl,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  form: {
    flex: 1,
  },
  signupButton: {
    marginBottom: theme.spacing.md,
  },
  apiErrorBox: {
    marginVertical: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: '#FFF4F4',
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: '#F8C0C0',
  },
  apiErrorText: {
    color: theme.colors.error,
    fontSize: 14,
    textAlign: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border.light,
  },
  dividerText: {
    marginHorizontal: theme.spacing.md,
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  socialButton: {
    height: 56,
    backgroundColor: theme.colors.secondary.light,
    borderRadius: theme.borderRadius.xl,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  footerText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  footerLink: {
    fontSize: 14,
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
});
