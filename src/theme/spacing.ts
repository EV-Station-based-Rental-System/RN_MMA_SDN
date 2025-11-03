/**
 * Spacing System
 * Hệ thống khoảng cách chuẩn (8px base unit)
 */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
  '4xl': 64,
} as const;

/**
 * Border Radius
 */
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 24,
  lg: 32,
  xl: 40,
  '2xl': 48,
  full: 9999,
} as const;

/**
 * Layout dimensions
 */
export const layout = {
  headerHeight: 56,
  tabBarHeight: 60,
  buttonHeight: 56,
  inputHeight: 48,
  iconSize: {
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
  },
} as const;

export type Spacing = typeof spacing;
export type BorderRadius = typeof borderRadius;
export type Layout = typeof layout;
