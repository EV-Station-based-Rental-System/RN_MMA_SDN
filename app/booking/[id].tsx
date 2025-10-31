/**
 * Booking Details Screen
 */

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/src/theme';
import { CustomButton, DateTimePicker } from '@/src/components';
import { useState, useEffect } from 'react';
import { useAuth } from '@/src/contexts/AuthContext';
import ProtectedRoute from '@/src/components/ProtectedRoute';

function BookingDetailsContent() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();
  
  const [withDriver, setWithDriver] = useState(false);
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | 'others'>('male');
  const [selectedPeriod, setSelectedPeriod] = useState<'hour' | 'day' | 'weekly' | 'monthly'>('day');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [pickupDate, setPickupDate] = useState('19/ January /2024');
  const [returnDate, setReturnDate] = useState('22/ January /2024');
  const [location, setLocation] = useState('Shore Dr, Chicago 0062 Usa');
  const [showPickupPicker, setShowPickupPicker] = useState(false);
  const [showReturnPicker, setShowReturnPicker] = useState(false);

  // Pre-fill form với user data
  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setEmail(user.email || '');
      setContact(user.phone || '');
    }
  }, [user]);

  const currentStep = 1; // Booking details step

  const handlePickupConfirm = (date: Date, time: { hour: number; minute: number; period: 'am' | 'pm' }) => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const formattedDate = `${date.getDate()}/ ${monthNames[date.getMonth()]} /${date.getFullYear()}`;
    setPickupDate(formattedDate);
  };

  const handleReturnConfirm = (date: Date, time: { hour: number; minute: number; period: 'am' | 'pm' }) => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const formattedDate = `${date.getDate()}/ ${monthNames[date.getMonth()]} /${date.getFullYear()}`;
    setReturnDate(formattedDate);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Details</Text>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Progress Steps */}
      <View style={styles.progressContainer}>
        <View style={styles.stepContainer}>
          <View style={[styles.stepDot, styles.stepActive]} />
          <Text style={[styles.stepLabel, styles.stepLabelActive]}>Booking details</Text>
        </View>
        
        <View style={styles.stepLine} />
        
        <View style={styles.stepContainer}>
          <View style={styles.stepDot} />
          <Text style={styles.stepLabel}>Payment methods</Text>
        </View>
        
        <View style={styles.stepLine} />
        
        <View style={styles.stepContainer}>
          <View style={styles.stepDot} />
          <Text style={styles.stepLabel}>confirmation</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Book with Driver */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>Book with driver</Text>
              <Text style={styles.cardSubtitle}>Don't have a driver? book with driver.</Text>
            </View>
            <Switch
              value={withDriver}
              onValueChange={setWithDriver}
              trackColor={{ false: '#E5E5E5', true: theme.colors.primary.main }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Full Name */}
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color={theme.colors.text.secondary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Full Name*"
            placeholderTextColor={theme.colors.text.placeholder}
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        {/* Email */}
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color={theme.colors.text.secondary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email Address*"
            placeholderTextColor={theme.colors.text.placeholder}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Contact */}
        <View style={styles.inputContainer}>
          <Ionicons name="call-outline" size={20} color={theme.colors.text.secondary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Contact*"
            placeholderTextColor={theme.colors.text.placeholder}
            keyboardType="phone-pad"
            value={contact}
            onChangeText={setContact}
          />
        </View>

        {/* Gender */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gender</Text>
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={[styles.optionButton, selectedGender === 'male' && styles.optionButtonActive]}
              onPress={() => setSelectedGender('male')}
            >
              <Ionicons 
                name="male" 
                size={16} 
                color={selectedGender === 'male' ? theme.colors.text.inverse : theme.colors.text.secondary} 
              />
              <Text style={[styles.optionText, selectedGender === 'male' && styles.optionTextActive]}>
                Male
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionButton, selectedGender === 'female' && styles.optionButtonActive]}
              onPress={() => setSelectedGender('female')}
            >
              <Ionicons 
                name="female" 
                size={16} 
                color={selectedGender === 'female' ? theme.colors.text.inverse : theme.colors.text.secondary} 
              />
              <Text style={[styles.optionText, selectedGender === 'female' && styles.optionTextActive]}>
                Female
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionButton, selectedGender === 'others' && styles.optionButtonActive]}
              onPress={() => setSelectedGender('others')}
            >
              <Ionicons 
                name="transgender" 
                size={16} 
                color={selectedGender === 'others' ? theme.colors.text.inverse : theme.colors.text.secondary} 
              />
              <Text style={[styles.optionText, selectedGender === 'others' && styles.optionTextActive]}>
                Others
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Rental Date & Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rental  Date &Time</Text>
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={[styles.optionButton, selectedPeriod === 'hour' && styles.optionButtonActive]}
              onPress={() => setSelectedPeriod('hour')}
            >
              <Text style={[styles.optionText, selectedPeriod === 'hour' && styles.optionTextActive]}>
                Hour
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionButton, selectedPeriod === 'day' && styles.optionButtonActive]}
              onPress={() => setSelectedPeriod('day')}
            >
              <Text style={[styles.optionText, selectedPeriod === 'day' && styles.optionTextActive]}>
                Day
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionButton, selectedPeriod === 'weekly' && styles.optionButtonActive]}
              onPress={() => setSelectedPeriod('weekly')}
            >
              <Text style={[styles.optionText, selectedPeriod === 'weekly' && styles.optionTextActive]}>
                Weekly
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionButton, selectedPeriod === 'monthly' && styles.optionButtonActive]}
              onPress={() => setSelectedPeriod('monthly')}
            >
              <Text style={[styles.optionText, selectedPeriod === 'monthly' && styles.optionTextActive]}>
                Monthly
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Date Pickers */}
        <View style={styles.dateRow}>
          <View style={styles.dateContainer}>
            <Text style={styles.dateLabel}>Pick up Date</Text>
            <TouchableOpacity style={styles.dateInput} onPress={() => setShowPickupPicker(true)}>
              <Ionicons name="calendar-outline" size={16} color={theme.colors.text.secondary} />
              <Text style={styles.dateText}>{pickupDate}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dateContainer}>
            <Text style={styles.dateLabel}>Return Date</Text>
            <TouchableOpacity style={styles.dateInput} onPress={() => setShowReturnPicker(true)}>
              <Ionicons name="calendar-outline" size={16} color={theme.colors.text.secondary} />
              <Text style={styles.dateText}>{returnDate}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Car Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Car Location</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="location-outline" size={20} color={theme.colors.text.secondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Location"
              placeholderTextColor={theme.colors.text.placeholder}
              value={location}
              onChangeText={setLocation}
            />
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <CustomButton
          title="$1400   Pay Now"
          onPress={() => {
            router.push({
              pathname: '/payment/[id]',
              params: { id: params.id || '1' }
            });
          }}
          style={styles.payButton}
        />
      </View>

      {/* Date Time Pickers */}
      <DateTimePicker
        visible={showPickupPicker}
        onClose={() => setShowPickupPicker(false)}
        onConfirm={handlePickupConfirm}
        title="Pick up Date"
      />

      <DateTimePicker
        visible={showReturnPicker}
        onClose={() => setShowReturnPicker(false)}
        onConfirm={handleReturnConfirm}
        title="Return Date"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing['2xl'],
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  moreButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  stepContainer: {
    alignItems: 'center',
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E5E5E5',
    marginBottom: 4,
  },
  stepActive: {
    backgroundColor: theme.colors.text.primary,
  },
  stepLabel: {
    fontSize: 10,
    color: theme.colors.text.secondary,
  },
  stepLabelActive: {
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  stepLine: {
    height: 2,
    flex: 1,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 8,
    marginBottom: 16,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  inputIcon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text.primary,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  optionButton: {
    flex: 1,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    gap: 6,
  },
  optionButtonActive: {
    backgroundColor: theme.colors.text.primary,
  },
  optionText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  optionTextActive: {
    color: theme.colors.text.inverse,
    fontWeight: '600',
  },
  dateRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  dateContainer: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  dateText: {
    fontSize: 12,
    color: theme.colors.text.primary,
  },
  bottomBar: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background.default,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  payButton: {
    height: 56,
  },
});

export default function BookingDetailsScreen() {
  return (
    <ProtectedRoute>
      <BookingDetailsContent />
    </ProtectedRoute>
  );
}
