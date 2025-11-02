import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/src/theme';

interface DateBadgeProps {
  label: string;
  date: string;
  variant?: 'dark' | 'info';
  onPress?: () => void;
}

export function DateBadge({ label, date, variant = 'dark', onPress }: DateBadgeProps) {
  const colors: [string, string] =
    variant === 'info' ? [theme.colors.info, '#1976D2'] : (theme.colors.gradient.primary as [string, string]);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={onPress ? 0.7 : 1} style={styles.container}>
      <LinearGradient colors={colors} start={[0, 0]} end={[1, 1]} style={styles.iconBox}>
        <Ionicons name="calendar-outline" size={18} color={theme.colors.text.inverse} />
      </LinearGradient>

      <View style={styles.texts}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{date}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  texts: {
    flex: 1,
  },
  label: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.text.secondary,
    marginBottom: 2,
  },
  value: {
    fontSize: theme.fontSizes.sm,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
});

export default DateBadge;
