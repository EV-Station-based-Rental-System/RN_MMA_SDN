/**
 * Verify Phone Number Screen
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

export default function VerifyPhoneScreen() {
  const router = useRouter();
  const [country, setCountry] = useState('United States');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleContinue = () => {
    router.push('/(auth)/verify-code');
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
        <Text style={styles.title}>Verify your phone number</Text>
        <Text style={styles.subtitle}>
          We have sent you an SMS with a code to number
        </Text>

        <View style={styles.form}>
          <CustomInput
            placeholder="Country"
            value={country}
            onChangeText={setCountry}
          />

          <CustomInput
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />

          <CustomButton
            title="Continue"
            onPress={handleContinue}
            style={styles.button}
          />
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
    marginBottom: theme.spacing.xl,
  },
  form: {
    flex: 1,
  },
  button: {
    marginTop: theme.spacing.md,
  },
});
