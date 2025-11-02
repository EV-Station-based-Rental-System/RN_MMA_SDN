/**
 * Root Layout - Main app wrapper with providers
 */

import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '@/src/contexts/AuthContext';
import { FavoritesProvider } from '@/src/contexts/FavoritesContext';
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <FavoritesProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'fade',
              animationDuration: 250,
            }}
          >
          <Stack.Screen 
            name="index"
            options={{
              animation: 'fade',
            }}
          />
          <Stack.Screen 
            name="(auth)"
            options={{
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen 
            name="(tabs)"
            options={{
              animation: 'fade',
            }}
          />
          <Stack.Screen name="car/[id]" />
          <Stack.Screen name="booking/[id]" />
          <Stack.Screen name="booking-details/[id]" />
          <Stack.Screen name="confirmation/[id]" />
          <Stack.Screen name="payment" />
          <Stack.Screen name="success" />
        </Stack>
      </FavoritesProvider>
    </AuthProvider>
    </GestureHandlerRootView>
  );
}
