/**
 * BookingStatusBadge Component
 * Hiển thị status badge với màu sắc phù hợp
 */

import { View, Text, StyleSheet } from 'react-native';
import { BookingStatus, VerificationStatus } from '@/src/types/api.types';
import { theme } from '@/src/theme';

interface BookingStatusBadgeProps {
  status: BookingStatus;
  verificationStatus?: VerificationStatus;
}

export const BookingStatusBadge = ({ status, verificationStatus }: BookingStatusBadgeProps) => {
  const getStatusConfig = () => {
    // Status chính (cancelled)
    if (status === BookingStatus.CANCELLED) {
      return {
        label: 'Cancelled',
        backgroundColor: theme.colors.error,
        textColor: theme.colors.text.inverse,
      };
    }

    // Status pending_verification - chưa có verification_status
    if (status === BookingStatus.PENDING_VERIFICATION) {
      return {
        label: 'Pending Confirmation',
        backgroundColor: theme.colors.warning,
        textColor: theme.colors.text.inverse,
      };
    }

    // Status verified - xem verification_status
    if (status === BookingStatus.VERIFIED) {
      switch (verificationStatus) {
        case VerificationStatus.APPROVED:
          return {
            label: 'Approved',
            backgroundColor: theme.colors.success,
            textColor: theme.colors.text.inverse,
          };
        case VerificationStatus.REJECTED_MISMATCH:
        case VerificationStatus.REJECTED_OTHER:
          return {
            label: 'Rejected',
            backgroundColor: theme.colors.error,
            textColor: theme.colors.text.inverse,
          };
        case VerificationStatus.PENDING:
        default:
          return {
            label: 'Pending Approval',
            backgroundColor: theme.colors.info,
            textColor: theme.colors.text.inverse,
          };
      }
    }

    // Default fallback
    return {
      label: 'Unknown',
      backgroundColor: theme.colors.border.main,
      textColor: theme.colors.text.secondary,
    };
  };

  const config = getStatusConfig();

  return (
    <View style={[styles.badge, { backgroundColor: config.backgroundColor }]}>
      <Text style={[styles.badgeText, { color: config.textColor }]}>
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: theme.fontSizes.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
