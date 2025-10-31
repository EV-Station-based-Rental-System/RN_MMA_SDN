/**
 * Typography System
 * Định nghĩa font chữ và text styles
 */

import { TextStyle } from 'react-native';

export const fontFamily = {
  regular: 'System', // Có thể thay bằng custom font
  medium: 'System',
  semiBold: 'System',
  bold: 'System',
} as const;

export const fontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 40,
} as const;

export const lineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
} as const;

/**
 * Predefined Text Styles
 */
export const typography = {
  // Headers
  h1: {
    fontSize: fontSizes['4xl'],
    fontWeight: '700',
    lineHeight: fontSizes['4xl'] * lineHeights.tight,
  } as TextStyle,

  h2: {
    fontSize: fontSizes['3xl'],
    fontWeight: '700',
    lineHeight: fontSizes['3xl'] * lineHeights.tight,
  } as TextStyle,

  h3: {
    fontSize: fontSizes['2xl'],
    fontWeight: '600',
    lineHeight: fontSizes['2xl'] * lineHeights.normal,
  } as TextStyle,

  h4: {
    fontSize: fontSizes.xl,
    fontWeight: '600',
    lineHeight: fontSizes.xl * lineHeights.normal,
  } as TextStyle,

  // Body Text
  body1: {
    fontSize: fontSizes.base,
    fontWeight: '400',
    lineHeight: fontSizes.base * lineHeights.normal,
  } as TextStyle,

  body2: {
    fontSize: fontSizes.sm,
    fontWeight: '400',
    lineHeight: fontSizes.sm * lineHeights.normal,
  } as TextStyle,

  // Button Text
  button: {
    fontSize: fontSizes.base,
    fontWeight: '600',
    lineHeight: fontSizes.base * lineHeights.tight,
  } as TextStyle,

  // Caption/Small Text
  caption: {
    fontSize: fontSizes.xs,
    fontWeight: '400',
    lineHeight: fontSizes.xs * lineHeights.normal,
  } as TextStyle,

  // Input Text
  input: {
    fontSize: fontSizes.base,
    fontWeight: '400',
    lineHeight: fontSizes.base * lineHeights.normal,
  } as TextStyle,
} as const;

export type Typography = typeof typography;
