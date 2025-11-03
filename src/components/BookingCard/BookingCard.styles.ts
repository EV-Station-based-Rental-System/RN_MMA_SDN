/**
 * BookingCard Styles
 */

import { StyleSheet } from 'react-native';
import { theme } from '@/src/theme';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  
  // Header section
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  headerLeft: {
    flex: 1,
  },
  bookingId: {
    fontSize: theme.fontSizes.xs,
    fontWeight: '600',
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  // Vehicle info section
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  vehicleImage: {
    width: 80,
    height: 60,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background.default,
    marginRight: theme.spacing.md,
  },
  vehicleDetails: {
    flex: 1,
  },
  vehicleName: {
    fontSize: theme.fontSizes.lg,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  vehicleModel: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text.secondary,
  },
  // No-image layout (compact)
  vehicleInfoNoImage: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  vehicleDetailsFull: {
    flex: 1,
    justifyContent: 'center',
  },
  
  // Dates section
  datesSection: {
    marginBottom: theme.spacing.md,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  dateIconContainer: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background.default,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  dateInfo: {
    flex: 1,
  },
  dateLabel: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.text.secondary,
    marginBottom: 2,
  },
  dateValue: {
    fontSize: theme.fontSizes.sm,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  
  // Pricing section
  pricingSection: {
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  priceLabel: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text.secondary,
  },
  priceValue: {
    fontSize: theme.fontSizes.sm,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  totalLabel: {
    fontSize: theme.fontSizes.lg,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  totalValue: {
    fontSize: theme.fontSizes.lg,
    fontWeight: '700',
    color: theme.colors.primary.main,
  },
  
  // Actions section
  actionsSection: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
  },
  primaryAction: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
  },
  secondaryAction: {
    backgroundColor: 'transparent',
    borderColor: theme.colors.border.main,
  },
  dangerAction: {
    backgroundColor: 'transparent',
    borderColor: theme.colors.error,
  },
  actionText: {
    fontSize: theme.fontSizes.sm,
    fontWeight: '600',
    marginLeft: theme.spacing.xs,
  },
  primaryActionText: {
    color: theme.colors.text.inverse,
  },
  secondaryActionText: {
    color: theme.colors.text.primary,
  },
  dangerActionText: {
    color: theme.colors.error,
  },
});
