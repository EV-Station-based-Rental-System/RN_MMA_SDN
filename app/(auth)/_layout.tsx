/**
 * Auth Layout
 * Layout cho các màn hình authentication với smooth animations
 */

import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack 
      screenOptions={{ 
        headerShown: false,
        animation: 'fade_from_bottom',
        animationDuration: 300,
      }}
    >
      <Stack.Screen 
        name="onboarding"
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="login"
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="signup"
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="verify-phone" />
      <Stack.Screen name="verify-code" />
      <Stack.Screen name="reset-password" />
    </Stack>
  );
}
