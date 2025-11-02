/**
 * Root Layout - Main app wrapper with providers
 */

import { Stack } from 'expo-router';
import { AuthProvider } from '@/src/contexts/AuthContext';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    // Add custom fonts here if needed
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="car/[id]" />
        <Stack.Screen name="booking/[id]" />
        <Stack.Screen name="confirmation/[id]" />
        <Stack.Screen name="payment" />
        <Stack.Screen name="success" />
      </Stack>
    </AuthProvider>
  );
}
