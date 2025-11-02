/**
 * Payment Callback Screen
 * Handles redirect from payment gateways (MoMo, VNPay, etc.)
 */

import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { theme } from '@/src/theme';

export default function PaymentCallbackScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [status, setStatus] = useState<'processing' | 'success' | 'failed'>('processing');

  useEffect(() => {
    handlePaymentCallback();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePaymentCallback = async () => {
    try {
      // MoMo/VNPay typically return these parameters
      const resultCode = params.resultCode as string; // MoMo
      const responseCode = params.vnp_ResponseCode as string; // VNPay
      const orderId = params.orderId || params.vnp_TxnRef as string;
      const transactionId = params.transId || params.vnp_TransactionNo as string;

      console.warn('📱 Payment callback received:', {
        resultCode,
        responseCode,
        orderId,
        transactionId,
        allParams: params,
      });

      // Check payment status
      // MoMo: resultCode = "0" means success
      // VNPay: vnp_ResponseCode = "00" means success
      const isSuccess = resultCode === '0' || responseCode === '00';

      if (isSuccess) {
        setStatus('success');
        
        // Wait a moment then redirect to success screen
        setTimeout(() => {
          router.replace({
            pathname: '/success',
            params: {
              message: 'Payment successful',
              orderId: orderId,
              transactionId: transactionId,
            },
          });
        }, 1500);
      } else {
        setStatus('failed');
        
        // Wait a moment then redirect back to bookings with error
        setTimeout(() => {
          router.replace({
            pathname: '/(tabs)/bookings',
            params: {
              error: 'Payment failed or was cancelled',
            },
          });
        }, 2000);
      }
    } catch (error) {
      console.error('❌ Payment callback error:', error);
      setStatus('failed');
      
      setTimeout(() => {
        router.replace('/(tabs)/bookings');
      }, 2000);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {status === 'processing' && (
          <>
            <ActivityIndicator size="large" color={theme.colors.primary.main} />
            <Text style={styles.title}>Processing Payment</Text>
            <Text style={styles.subtitle}>Please wait...</Text>
          </>
        )}

        {status === 'success' && (
          <>
            <View style={styles.successIcon}>
              <Text style={styles.iconText}>✓</Text>
            </View>
            <Text style={styles.title}>Payment Successful!</Text>
            <Text style={styles.subtitle}>Redirecting...</Text>
          </>
        )}

        {status === 'failed' && (
          <>
            <View style={styles.failedIcon}>
              <Text style={styles.iconText}>✕</Text>
            </View>
            <Text style={styles.title}>Payment Failed</Text>
            <Text style={styles.subtitle}>Redirecting back...</Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  failedIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F44336',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 40,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
