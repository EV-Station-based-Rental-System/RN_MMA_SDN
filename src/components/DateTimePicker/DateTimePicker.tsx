/**
 * DateTimePicker Component
 * Custom date and time picker with calendar
 */

import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/src/theme';

const { width } = Dimensions.get('window');

interface DateTimePickerProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (date: Date, time: { hour: number; minute: number; period: 'am' | 'pm' }) => void;
  initialDate?: Date;
  title?: string;
}

export function DateTimePicker({
  visible,
  onClose,
  onConfirm,
  initialDate = new Date(),
  title = 'Time',
}: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedHour, setSelectedHour] = useState(10);
  const [selectedMinute, setSelectedMinute] = useState(30);
  const [selectedPeriod, setSelectedPeriod] = useState<'am' | 'pm'>('am');
  const [currentMonth, setCurrentMonth] = useState(new Date(2022, 0, 1)); // January 2022

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleConfirm = () => {
    const finalDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      selectedDate.getDate()
    );
    onConfirm(finalDate, {
      hour: selectedHour,
      minute: selectedMinute,
      period: selectedPeriod,
    });
    onClose();
  };

  const renderCalendarDays = () => {
    const days = [];
    const prevMonthDays = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      0
    ).getDate();

    // Previous month days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push(
        <View key={`prev-${i}`} style={styles.dayCell}>
          <Text style={styles.dayTextInactive}>{prevMonthDays - i}</Text>
        </View>
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = day === 6 || day === 19 || day === 22; // Selected dates from design
      const isToday = day === 6;
      
      days.push(
        <TouchableOpacity
          key={`current-${day}`}
          style={styles.dayCell}
          onPress={() => setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
        >
          <View style={[
            styles.dayButton,
            isSelected && styles.dayButtonSelected,
            isToday && !isSelected && styles.dayButtonToday,
          ]}>
            <Text style={[
              styles.dayText,
              isSelected && styles.dayTextSelected,
            ]}>
              {day}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }

    // Next month days to fill the grid
    const remainingCells = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingCells; i++) {
      days.push(
        <View key={`next-${i}`} style={styles.dayCell}>
          <Text style={styles.dayTextInactive}>{i}</Text>
        </View>
      );
    }

    return days;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>

          {/* Time Selector */}
          <View style={styles.timeSelector}>
            <TouchableOpacity
              style={[styles.timeButton, selectedPeriod === 'am' && styles.timeButtonActive]}
              onPress={() => setSelectedPeriod('am')}
            >
              <Ionicons
                name="moon"
                size={16}
                color={selectedPeriod === 'am' ? '#FFFFFF' : theme.colors.text.secondary}
              />
              <Text style={[styles.timeText, selectedPeriod === 'am' && styles.timeTextActive]}>
                {selectedHour} : {selectedMinute.toString().padStart(2, '0')}  am
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.timeButton, selectedPeriod === 'pm' && styles.timeButtonActive]}
              onPress={() => setSelectedPeriod('pm')}
            >
              <Ionicons
                name="sunny"
                size={16}
                color={selectedPeriod === 'pm' ? '#FFFFFF' : theme.colors.text.secondary}
              />
              <Text style={[styles.timeText, selectedPeriod === 'pm' && styles.timeTextActive]}>
                05 : 30  pm
              </Text>
            </TouchableOpacity>
          </View>

          {/* Calendar Header */}
          <View style={styles.calendarHeader}>
            <TouchableOpacity onPress={handlePrevMonth}>
              <Ionicons name="chevron-back" size={20} color={theme.colors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.monthYear}>
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </Text>
            <TouchableOpacity onPress={handleNextMonth}>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>

          {/* Week Days */}
          <View style={styles.weekDaysRow}>
            {weekDays.map((day) => (
              <View key={day} style={styles.weekDayCell}>
                <Text style={styles.weekDayText}>{day}</Text>
              </View>
            ))}
          </View>

          {/* Calendar Days */}
          <View style={styles.calendarGrid}>
            {renderCalendarDays()}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.doneButton} onPress={handleConfirm}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdrop: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: theme.spacing.lg,
    maxHeight: '85%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  timeSelector: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  timeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    gap: 8,
  },
  timeButtonActive: {
    backgroundColor: '#000000',
  },
  timeText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  timeTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  monthYear: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.lg,
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  dayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayButtonSelected: {
    backgroundColor: '#000000',
  },
  dayButtonToday: {
    backgroundColor: '#E5E5E5',
  },
  dayText: {
    fontSize: 14,
    color: theme.colors.text.primary,
  },
  dayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  dayTextInactive: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  cancelButton: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  doneButton: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
