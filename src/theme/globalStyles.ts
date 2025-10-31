/**
 * Global Styles
 * Các style dùng chung trong toàn bộ app
 */

import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { spacing, borderRadius } from './spacing';
import { shadows } from './shadows';

export const globalStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },

  containerPadding: {
    flex: 1,
    backgroundColor: colors.background.default,
    padding: spacing.md,
  },

  // Flex utilities
  flexCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  flexBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Card styles
  card: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.md,
  },

  // Button base
  buttonBase: {
    height: 56,
    borderRadius: borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },

  buttonPrimary: {
    height: 56,
    borderRadius: borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.primary.main,
  },

  buttonSecondary: {
    height: 56,
    borderRadius: borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.secondary.main,
    borderWidth: 1,
    borderColor: colors.border.main,
  },

  // Input styles
  input: {
    height: 48,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    backgroundColor: colors.background.default,
    color: colors.text.primary,
  },

  inputFocused: {
    borderColor: colors.primary.main,
    borderWidth: 2,
  },

  // Text utilities
  textCenter: {
    textAlign: 'center',
  },

  textBold: {
    fontWeight: '700',
  },

  textMedium: {
    fontWeight: '600',
  },

  // Spacing utilities - Margin Top
  mtSm: { marginTop: spacing.sm },
  mtMd: { marginTop: spacing.md },
  mtLg: { marginTop: spacing.lg },
  mtXl: { marginTop: spacing.xl },

  // Margin Bottom
  mbSm: { marginBottom: spacing.sm },
  mbMd: { marginBottom: spacing.md },
  mbLg: { marginBottom: spacing.lg },
  mbXl: { marginBottom: spacing.xl },

  // Margin Horizontal
  mxSm: { marginHorizontal: spacing.sm },
  mxMd: { marginHorizontal: spacing.md },
  mxLg: { marginHorizontal: spacing.lg },
  mxXl: { marginHorizontal: spacing.xl },

  // Margin Vertical
  mySm: { marginVertical: spacing.sm },
  myMd: { marginVertical: spacing.md },
  myLg: { marginVertical: spacing.lg },
  myXl: { marginVertical: spacing.xl },

  // Shadow utilities
  shadowSm: shadows.sm,
  shadowMd: shadows.md,
  shadowLg: shadows.lg,
  shadowXl: shadows.xl,
});
