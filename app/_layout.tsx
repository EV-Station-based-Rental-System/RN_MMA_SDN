/**
 * Root Layout
 * Main app layout configuration
 */

import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '@/src/contexts/AuthContext';
// import * as SplashScreen from 'expo-splash-screen';

// Prevent splash screen from auto-hiding
// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Load fonts and other resources here
    // SplashScreen.hideAsync();
  }, []);

  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AuthProvider>
  );
}
