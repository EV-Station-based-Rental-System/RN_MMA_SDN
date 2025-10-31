/**
 * Verify Code Screen
 * Màn hình nhập mã OTP
 */

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useState, useRef } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/src/theme';
import { CustomButton } from '@/src/components';
import { StatusBar } from 'expo-status-bar';

export default function VerifyCodeScreen() {
  const router = useRouter();
  const [code, setCode] = useState(['', '', '', '']);
  const inputRefs = useRef<TextInput[]>([]);

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto focus next input
    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleContinue = () => {
    router.replace('/(tabs)');
  };

  const handleResend = () => {
    // TODO: Resend OTP
  };

  return (
    <View style={styles.container}>
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
        <Text style={styles.title}>Enter verification code</Text>
        <Text style={styles.subtitle}>
          We have send a Code to - +10********00
        </Text>

        {/* OTP Input */}
        <View style={styles.otpContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                if (ref) inputRefs.current[index] = ref;
              }}
              style={styles.otpInput}
              value={digit}
              onChangeText={(text) => handleCodeChange(text, index)}
              keyboardType="number-pad"
              maxLength={1}
            />
          ))}
        </View>

        <CustomButton
          title="Continue"
          onPress={handleContinue}
          style={styles.button}
        />

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the OTP? </Text>
          <TouchableOpacity onPress={handleResend}>
            <Text style={styles.resendLink}>Resend</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.formMessageButton}>
          <Text style={styles.formMessageText}>Form Message</Text>
          <Text style={styles.formMessageCode}>6930</Text>
        </TouchableOpacity>
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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  otpInput: {
    width: 70,
    height: 70,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  button: {
    marginBottom: theme.spacing.lg,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  },
  resendText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  resendLink: {
    fontSize: 14,
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  formMessageButton: {
    alignItems: 'center',
  },
  formMessageText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: 4,
  },
  formMessageCode: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
});
