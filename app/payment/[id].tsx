/**
 * Payment Methods Screen
 */

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '@/src/theme';
import { CustomButton } from '@/src/components';
import { useState } from 'react';

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [selectedMethod, setSelectedMethod] = useState<'cash' | 'card'>('card');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [country, setCountry] = useState('United States');
  const [zip, setZip] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment methods</Text>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Progress Steps */}
      <View style={styles.progressContainer}>
        <View style={styles.stepContainer}>
          <View style={[styles.stepDot, styles.stepCompleted]} />
          <Text style={[styles.stepLabel, styles.stepLabelActive]}>Booking details</Text>
        </View>
        
        <View style={[styles.stepLine, styles.stepLineActive]} />
        
        <View style={styles.stepContainer}>
          <View style={[styles.stepDot, styles.stepActive]} />
          <Text style={[styles.stepLabel, styles.stepLabelActive]}>Payment methods</Text>
        </View>
        
        <View style={styles.stepLine} />
        
        <View style={styles.stepContainer}>
          <View style={styles.stepDot} />
          <Text style={styles.stepLabel}>confirmation</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Credit Card Display */}
        <View style={styles.creditCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardChip} />
            <View style={styles.cardLogos}>
              <View style={styles.mastercardLogo}>
                <View style={[styles.circle, styles.circleRed]} />
                <View style={[styles.circle, styles.circleOrange]} />
              </View>
              <View style={styles.visaLogo}>
                <Text style={styles.visaText}>VISA</Text>
              </View>
            </View>
          </View>
          
          <Text style={styles.cardName}>BANJAMIN JACK</Text>
          <Text style={styles.cardExpiry}>Expire  10-5-2030</Text>
          <View style={styles.cardNumberContainer}>
            <Text style={styles.cardNumber}>9655</Text>
            <Text style={styles.cardNumber}>9655</Text>
            <Text style={styles.cardNumber}>9655</Text>
            <Text style={styles.cardNumber}>9655</Text>
          </View>
        </View>

        {/* Payment Method Selection */}
        <Text style={styles.sectionTitle}>select payment method</Text>
        
        <TouchableOpacity
          style={[styles.paymentMethodCard, selectedMethod === 'cash' && styles.paymentMethodActive]}
          onPress={() => setSelectedMethod('cash')}
        >
          <View style={styles.paymentMethodContent}>
            <Ionicons name="cash-outline" size={20} color={theme.colors.text.secondary} />
            <Text style={styles.paymentMethodText}>Cash payment</Text>
          </View>
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultText}>DAFULT</Text>
          </View>
        </TouchableOpacity>

        {/* Card Information */}
        <Text style={styles.sectionTitle}>Card information</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor={theme.colors.text.placeholder}
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor={theme.colors.text.placeholder}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Number"
            placeholderTextColor={theme.colors.text.placeholder}
            keyboardType="number-pad"
            maxLength={19}
            value={cardNumber}
            onChangeText={setCardNumber}
          />
          <View style={styles.cardIcons}>
            <MaterialCommunityIcons name="credit-card-outline" size={20} color="#E5E5E5" />
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/349/349221.png' }} 
              style={styles.cardIcon}
            />
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/349/349228.png' }} 
              style={styles.cardIcon}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.inputContainer, styles.halfInput]}>
            <TextInput
              style={styles.input}
              placeholder="MM / YY"
              placeholderTextColor={theme.colors.text.placeholder}
              keyboardType="number-pad"
              maxLength={5}
              value={expiry}
              onChangeText={setExpiry}
            />
          </View>

          <View style={[styles.inputContainer, styles.halfInput]}>
            <TextInput
              style={styles.input}
              placeholder="CVO"
              placeholderTextColor={theme.colors.text.placeholder}
              keyboardType="number-pad"
              maxLength={3}
              secureTextEntry
              value={cvv}
              onChangeText={setCvv}
            />
            <Ionicons name="card-outline" size={20} color={theme.colors.text.secondary} />
          </View>
        </View>

        {/* Country or Region */}
        <Text style={styles.sectionTitle}>Country or region</Text>

        <TouchableOpacity style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="United States"
            placeholderTextColor={theme.colors.text.placeholder}
            value={country}
            onChangeText={setCountry}
            editable={false}
          />
          <Ionicons name="chevron-down" size={20} color={theme.colors.text.secondary} />
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="ZIP"
            placeholderTextColor={theme.colors.text.placeholder}
            keyboardType="number-pad"
            value={zip}
            onChangeText={setZip}
          />
        </View>

        {/* Terms and Conditions */}
        <TouchableOpacity 
          style={styles.termsContainer}
          onPress={() => setAcceptTerms(!acceptTerms)}
        >
          <View style={[styles.checkbox, acceptTerms && styles.checkboxActive]}>
            {acceptTerms && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
          </View>
          <View style={styles.termsTextContainer}>
            <Text style={styles.termsText}>Trams & continue </Text>
            <Ionicons name="chevron-down" size={14} color={theme.colors.text.secondary} />
          </View>
        </TouchableOpacity>

        <Text style={styles.infoText}>Pay with card Or</Text>

        {/* Apple Pay */}
        <TouchableOpacity style={styles.altPayButton}>
          <Ionicons name="logo-apple" size={24} color="#000000" />
          <Text style={styles.altPayText}>Apple pay</Text>
        </TouchableOpacity>

        {/* Google Pay */}
        <TouchableOpacity style={styles.altPayButton}>
          <Ionicons name="logo-google" size={24} color="#000000" />
          <Text style={styles.altPayText}>Google Pay</Text>
        </TouchableOpacity>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <CustomButton
          title="Continue"
          onPress={() => {
            // Navigate to confirmation
            router.push({
              pathname: '/confirmation/[id]',
              params: { id: params.id || '1' }
            });
          }}
          style={styles.continueButton}
        />
      </View>
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
  stepCompleted: {
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
  stepLineActive: {
    backgroundColor: theme.colors.text.primary,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  creditCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    minHeight: 200,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  cardChip: {
    width: 48,
    height: 36,
    backgroundColor: '#FFD700',
    borderRadius: 6,
  },
  cardLogos: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  mastercardLogo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  circleRed: {
    backgroundColor: '#EB001B',
  },
  circleOrange: {
    backgroundColor: '#FF5F00',
    marginLeft: -8,
  },
  visaLogo: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  visaText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  cardName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardExpiry: {
    color: '#CCCCCC',
    fontSize: 11,
    marginBottom: theme.spacing.md,
  },
  cardNumberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardNumber: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  paymentMethodActive: {
    borderWidth: 2,
    borderColor: theme.colors.primary.main,
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  paymentMethodText: {
    fontSize: 14,
    color: theme.colors.text.primary,
  },
  defaultBadge: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultText: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    height: 56,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text.primary,
  },
  cardIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardIcon: {
    width: 24,
    height: 16,
    resizeMode: 'contain',
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    marginRight: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  termsTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  termsText: {
    fontSize: 14,
    color: theme.colors.text.primary,
  },
  infoText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginVertical: theme.spacing.md,
  },
  altPayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    height: 56,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  altPayText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  bottomBar: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background.default,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  continueButton: {
    height: 56,
  },
});
