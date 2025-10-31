/**
 * BrandIcon Component
 * Icon brand xe với tên
 */

import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/src/theme';
import { TeslaLogo } from '../Icons/BrandLogos/TeslaLogo';
import { LamborghiniLogo } from '../Icons/BrandLogos/LamborghiniLogo';
import { BMWLogo } from '../Icons/BrandLogos/BMWLogo';

interface BrandIconProps {
  name: string;
  icon: string;
  onPress?: () => void;
  isSelected?: boolean;
}

export function BrandIcon({ name, icon, onPress, isSelected = false }: BrandIconProps) {
  const renderIcon = () => {
    // Use custom Tesla logo
    if (name === 'Tesla') {
      return (
        <TeslaLogo 
          color={isSelected ? theme.colors.text.inverse : '#FFFFFF'} 
          size={32} 
        />
      );
    }
    
    // Use custom Lamborghini logo
    if (name === 'Lamborghini') {
      return (
        <LamborghiniLogo 
          color={isSelected ? theme.colors.text.inverse : '#FFFFFF'} 
          size={36} 
        />
      );
    }
    
    // Use custom BMW logo
    if (name === 'BMW') {
      return (
        <BMWLogo 
          size={36} 
        />
      );
    }
    
    // Use VinFast logo from assets
    if (name === 'VinFast') {
      return (
        <Image 
          source={require('../../../assets/logo/vinfast.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      );
    }
    
    // Default icons for other brands
    return (
      <MaterialCommunityIcons
        name={icon as any}
        size={28}
        color={isSelected ? theme.colors.text.inverse : '#FFFFFF'}
      />
    );
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={isSelected ? [theme.colors.primary.main, theme.colors.primary.main] : ['#000000', '#1a1a1a', '#000000']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.iconContainer}
      >
        {renderIcon()}
      </LinearGradient>
      <Text style={styles.name} numberOfLines={1}>{name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: theme.spacing.lg,
    width: 70,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
    ...theme.shadows.sm,
    overflow: 'hidden', // Important for gradient clipping
  },
  logoImage: {
    width: 40,
    height: 40,
  },
  name: {
    fontSize: 11,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});
