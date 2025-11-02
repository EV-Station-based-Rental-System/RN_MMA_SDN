/**
 * Logo Component - Reusable app logo
 */

import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/src/theme';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  variant?: 'primary' | 'secondary' | 'white';
  style?: ViewStyle;
}

export function Logo({ 
  size = 'medium', 
  showText = true, 
  variant = 'secondary',
  style 
}: LogoProps) {
  const sizeStyles = {
    small: { 
      circle: 40, 
      icon: 20, 
      text: 24 
    },
    medium: { 
      circle: 60, 
      icon: 32, 
      text: 32 
    },
    large: { 
      circle: 80, 
      icon: 40, 
      text: 40 
    },
  };

  const currentSize = sizeStyles[size];

  const variantColors = {
    primary: theme.colors.primary.main,        // Đen
    secondary: theme.colors.primary.main,      // Đen thay vì trắng
    white: 'rgba(255, 255, 255, 0.2)',        // Trắng trong suốt
  };

  return (
    <View style={[styles.container, style]}>
      <View 
        style={[
          styles.logoCircle, 
          { 
            width: currentSize.circle, 
            height: currentSize.circle, 
            borderRadius: currentSize.circle / 2,
            backgroundColor: variantColors[variant]
          }
        ]}
      >
        <Ionicons
          name="car-sport"
          size={currentSize.icon}
          color={theme.colors.text.inverse}
        />
      </View>
      {showText && (
        <Text 
          style={[
            styles.logoText, 
            { fontSize: currentSize.text }
          ]}
        >
          EVN
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  logoCircle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontWeight: '700',
    color: theme.colors.text.inverse,
  },
});
