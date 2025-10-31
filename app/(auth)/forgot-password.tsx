/**
 * Reset Password Screen
 */

import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/src/theme';
import { CustomButton, CustomInput } from '@/src/components';
import { StatusBar } from 'expo-status-bar';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleContinue = () => {
    // TODO: Send reset email
    router.back();
  };

  const handleCreateAccount = () => {
    router.push('/(auth)/signup');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Ionicons name="car-sport" size={22} color={theme.colors.text.inverse} />
          </View>
          <Text style={styles.logoText}>Qent</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Reset your password</Text>
        <Text style={styles.subtitle}>
          Enter the email address associated with your account and we'll send you a link to reset your password.
        </Text>

        <View style={styles.form}>
          <CustomInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <CustomButton
            title="Continue"
            onPress={handleContinue}
            style={styles.button}
          />

          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.returnText}>Return to sign in</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Create a </Text>
          <TouchableOpacity onPress={handleCreateAccount}>
            <Text style={styles.footerLink}>New account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  header: {
    paddingTop: theme.spacing['2xl'],
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  backIcon: {
    fontSize: 24,
    marginBottom: theme.spacing.lg,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  logoIcon: {
    fontSize: 20,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 20,
    marginBottom: theme.spacing.xl,
  },
  form: {
    flex: 1,
  },
  button: {
    marginBottom: theme.spacing.md,
  },
  returnText: {
    fontSize: 14,
    color: theme.colors.text.primary,
    textAlign: 'center',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: theme.spacing.xl,
  },
  footerText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  footerLink: {
    fontSize: 14,
    color: theme.colors.text.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
