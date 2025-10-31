/**
 * Main Theme Export
 * Central theme configuration cho toàn bộ app
 */

import { colors } from './colors';
import { typography, fontSizes, fontFamily } from './typography';
import { spacing, borderRadius, layout } from './spacing';
import { shadows } from './shadows';

/**
 * Main Theme Object
 */
export const theme = {
  colors,
  typography,
  fontSizes,
  fontFamily,
  spacing,
  borderRadius,
  layout,
  shadows,
} as const;

// Export individual modules
export { colors } from './colors';
export { typography, fontSizes, fontFamily } from './typography';
export { spacing, borderRadius, layout } from './spacing';
export { shadows } from './shadows';

// Type exports
export type Theme = typeof theme;
export type ThemeColors = typeof colors;
export type ThemeTypography = typeof typography;
export type ThemeSpacing = typeof spacing;

// Default export
export default theme;
