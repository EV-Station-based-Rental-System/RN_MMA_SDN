/**
 * Shadow System
 * Định nghĩa bóng đổ cho iOS và Android
 */

import { ViewStyle } from 'react-native';
import { Platform } from 'react-native';

/**
 * Shadow presets cho iOS
 */
const iosShadows = {
  none: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
} as const;

/**
 * Shadow presets cho Android
 */
const androidShadows = {
  none: { elevation: 0 },
  sm: { elevation: 2 },
  md: { elevation: 4 },
  lg: { elevation: 8 },
  xl: { elevation: 16 },
} as const;

/**
 * Cross-platform shadows
 */
export const shadows = {
  none: {
    ...(Platform.OS === 'ios' ? iosShadows.none : androidShadows.none),
  } as ViewStyle,
  sm: {
    ...(Platform.OS === 'ios' ? iosShadows.sm : androidShadows.sm),
  } as ViewStyle,
  md: {
    ...(Platform.OS === 'ios' ? iosShadows.md : androidShadows.md),
  } as ViewStyle,
  lg: {
    ...(Platform.OS === 'ios' ? iosShadows.lg : androidShadows.lg),
  } as ViewStyle,
  xl: {
    ...(Platform.OS === 'ios' ? iosShadows.xl : androidShadows.xl),
  } as ViewStyle,
} as const;

export type Shadows = typeof shadows;
