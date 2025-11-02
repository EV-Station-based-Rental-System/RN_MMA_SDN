/**
 * Profile Tab Screen - User Profile Page
 */

import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
// import * as ImagePicker from 'expo-image-picker';
// import * as DocumentPicker from 'expo-document-picker';
import { theme } from '@/src/theme';
import { useAuth } from '@/src/contexts/AuthContext';
import KycService from '@/src/api/kyc.api';
import type { components } from '@/src/api/generated/openapi-types';

type KYC = components['schemas']['Kycs'];
type CreateKycDto = components['schemas']['CreateKycsDto'];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, userId, logout, refreshUser, isLoading } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [kycData, setKycData] = useState<(KYC & { _id?: string }) | null>(null);
  const [kycLoading, setKycLoading] = useState(false);
  const [uploadingKyc, setUploadingKyc] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshUser();
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogout = async () => {
    try {
      console.log('🔴 Logout button pressed');
      console.log('🚪 Starting logout...');
      
      await logout();
      
      console.log('✅ Logout successful, navigating to login...');
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('❌ Logout failed:', error);
    }
  };

  const handleEditProfile = () => {
    // TODO: Navigate to edit profile screen
    Alert.alert('Coming Soon', 'Edit profile feature will be available soon.');
  };

  const handleUploadKyc = () => {
    Alert.alert(
      'Upload KYC Document',
      'Choose document type',
      [
        {
          text: 'National ID',
          onPress: () => showKycForm('national_id'),
        },
        {
          text: 'Passport',
          onPress: () => showKycForm('passport'),
        },
        {
          text: 'Driver License',
          onPress: () => showKycForm('driver_license'),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const showKycForm = (type: 'national_id' | 'passport' | 'driver_license' | 'other') => {
    Alert.prompt(
      'Enter Document Number',
      `Enter your ${type.replace('_', ' ')} number:`,
      async (documentNumber) => {
        if (!documentNumber || documentNumber.trim() === '') {
          Alert.alert('Error', 'Document number is required');
          return;
        }

        Alert.prompt(
          'Expiry Date (Optional)',
          'Enter expiry date (YYYY-MM-DD):',
          async (expiryDate) => {
            try {
              setUploadingKyc(true);

              const kycData: CreateKycDto = {
                type,
                document_number: documentNumber.trim(),
                ...(expiryDate && expiryDate.trim() && { expiry_date: expiryDate.trim() }),
              };

              const result = await KycService.createKyc(kycData);
              setKycData(result as any);
              
              Alert.alert(
                'Success',
                'KYC document submitted successfully! It will be reviewed by our team.'
              );
            } catch (error: any) {
              console.error('Upload KYC error:', error);
              Alert.alert(
                'Error',
                error?.response?.data?.message || 'Failed to upload KYC document'
              );
            } finally {
              setUploadingKyc(false);
            }
          },
          'plain-text',
          '',
          'default'
        );
      },
      'plain-text',
      '',
      'default'
    );
  };

  const getKycStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return theme.colors.success;
      case 'rejected':
      case 'expired':
        return theme.colors.error;
      case 'submitted':
        return theme.colors.warning;
      default:
        return theme.colors.text.secondary;
    }
  };

  const getKycStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return 'checkmark-circle';
      case 'rejected':
        return 'close-circle';
      case 'expired':
        return 'time';
      case 'submitted':
        return 'hourglass';
      default:
        return 'document-text';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.iconButton} />
        </View>

        {/* Error State */}
        <View style={styles.errorContainer}>
          <View style={styles.errorIconCircle}>
            <Ionicons name="person-outline" size={48} color={theme.colors.text.secondary} />
          </View>
          <Text style={styles.errorTitle}>User Not Found</Text>
          <Text style={styles.errorDescription}>
            We couldn't find your user information.{'\n'}
            Please try logging in again.
          </Text>
          <TouchableOpacity 
            style={styles.errorButton}
            onPress={() => router.replace('/(auth)/login')}
          >
            <Text style={styles.errorButtonText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header with back button and menu */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* User Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
            </Text>
          </View>
          <TouchableOpacity style={styles.editAvatarButton} onPress={handleEditProfile}>
            <Ionicons name="create" size={16} color={theme.colors.text.primary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.full_name || 'User'}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>

        <TouchableOpacity style={styles.editProfileButton} onPress={handleEditProfile}>
          <Text style={styles.editProfileText}>Edit profile</Text>
        </TouchableOpacity>
      </View>

      {/* KYC Verification Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Verification</Text>
        
        {kycLoading ? (
          <View style={styles.kycLoadingContainer}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text style={styles.kycLoadingText}>Loading verification status...</Text>
          </View>
        ) : kycData ? (
          <View style={styles.kycCard}>
            <View style={styles.kycHeader}>
              <View style={styles.kycTitleRow}>
                <Ionicons 
                  name={getKycStatusIcon(kycData.status)} 
                  size={24} 
                  color={getKycStatusColor(kycData.status)} 
                />
                <Text style={styles.kycType}>
                  {kycData.type.replace('_', ' ').toUpperCase()}
                </Text>
              </View>
              <View 
                style={[
                  styles.kycStatusBadge, 
                  { backgroundColor: getKycStatusColor(kycData.status) + '20' }
                ]}
              >
                <Text 
                  style={[
                    styles.kycStatusText, 
                    { color: getKycStatusColor(kycData.status) }
                  ]}
                >
                  {kycData.status.toUpperCase()}
                </Text>
              </View>
            </View>
            
            <View style={styles.kycDetails}>
              <Text style={styles.kycLabel}>Document Number:</Text>
              <Text style={styles.kycValue}>{kycData.document_number}</Text>
              
              {kycData.expiry_date && (
                <>
                  <Text style={[styles.kycLabel, { marginTop: 8 }]}>Expiry Date:</Text>
                  <Text style={styles.kycValue}>
                    {new Date(kycData.expiry_date).toLocaleDateString()}
                  </Text>
                </>
              )}
              
              {kycData.submitted_at && (
                <>
                  <Text style={[styles.kycLabel, { marginTop: 8 }]}>Submitted:</Text>
                  <Text style={styles.kycValue}>
                    {new Date(kycData.submitted_at).toLocaleDateString()}
                  </Text>
                </>
              )}
              
              {kycData.verified_at && (
                <>
                  <Text style={[styles.kycLabel, { marginTop: 8 }]}>Verified:</Text>
                  <Text style={styles.kycValue}>
                    {new Date(kycData.verified_at).toLocaleDateString()}
                  </Text>
                </>
              )}
            </View>
            
            {kycData.status === 'rejected' || kycData.status === 'expired' ? (
              <TouchableOpacity
                style={[styles.kycButton, styles.kycButtonResubmit]}
                onPress={handleUploadKyc}
                disabled={uploadingKyc}
              >
                <Ionicons name="refresh" size={20} color={theme.colors.white} />
                <Text style={styles.kycButtonText}>
                  {uploadingKyc ? 'Uploading...' : 'Resubmit Document'}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : (
          <TouchableOpacity
            style={styles.kycUploadCard}
            onPress={handleUploadKyc}
            disabled={uploadingKyc}
          >
            <Ionicons name="cloud-upload-outline" size={48} color={theme.colors.primary} />
            <Text style={styles.kycUploadTitle}>
              {uploadingKyc ? 'Uploading...' : 'Upload Verification Document'}
            </Text>
            <Text style={styles.kycUploadDescription}>
              Upload your ID to verify your account and unlock premium features
            </Text>
            {uploadingKyc && (
              <ActivityIndicator 
                size="small" 
                color={theme.colors.primary} 
                style={{ marginTop: 12 }}
              />
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* General Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <Ionicons name="heart-outline" size={20} color={theme.colors.text.primary} />
          </View>
          <Text style={styles.menuLabel}>Favorite Cars</Text>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <Ionicons name="time-outline" size={20} color={theme.colors.text.primary} />
          </View>
          <Text style={styles.menuLabel}>Previous Rent</Text>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <Ionicons name="notifications-outline" size={20} color={theme.colors.text.primary} />
          </View>
          <Text style={styles.menuLabel}>Notification</Text>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <Ionicons name="link-outline" size={20} color={theme.colors.text.primary} />
          </View>
          <Text style={styles.menuLabel}>Connected to QENT Partnerships</Text>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
        </TouchableOpacity>
      </View>

      {/* Support Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <Ionicons name="settings-outline" size={20} color={theme.colors.text.primary} />
          </View>
          <Text style={styles.menuLabel}>Settings</Text>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <Ionicons name="language-outline" size={20} color={theme.colors.text.primary} />
          </View>
          <Text style={styles.menuLabel}>Languages</Text>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <Ionicons name="people-outline" size={20} color={theme.colors.text.primary} />
          </View>
          <Text style={styles.menuLabel}>Invite Friends</Text>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <Ionicons name="document-text-outline" size={20} color={theme.colors.text.primary} />
          </View>
          <Text style={styles.menuLabel}>privacy policy</Text>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <Ionicons name="help-circle-outline" size={20} color={theme.colors.text.primary} />
          </View>
          <Text style={styles.menuLabel}>Help Support</Text>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <View style={styles.menuIconContainer}>
            <Ionicons name="log-out-outline" size={20} color={theme.colors.error} />
          </View>
          <Text style={[styles.menuLabel, styles.logoutLabel]}>Log out</Text>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.error} />
        </TouchableOpacity>
      </View>

      {/* Bottom spacing */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.default,
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.error,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  errorIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.background.paper,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  errorDescription: {
    fontSize: 15,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: theme.spacing.xl,
  },
  errorButton: {
    paddingHorizontal: theme.spacing['2xl'],
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borderRadius.lg,
    minWidth: 200,
  },
  errorButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.inverse,
    textAlign: 'center',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background.paper,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.background.dark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.text.inverse,
  },
  editAvatarButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.background.default,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.background.default,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs / 2,
  },
  userEmail: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  editProfileButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background.paper,
  },
  editProfileText: {
    fontSize: 14,
    color: theme.colors.text.primary,
  },
  section: {
    marginTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  menuIconContainer: {
    width: 24,
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.text.primary,
  },
  logoutLabel: {
    color: theme.colors.error,
  },
  bottomSpacer: {
    height: 100,
  },
  // KYC Styles
  kycLoadingContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
  },
  kycLoadingText: {
    marginTop: theme.spacing.md,
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  kycCard: {
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
  },
  kycHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  kycTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  kycType: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  kycStatusBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  kycStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  kycDetails: {
    marginBottom: theme.spacing.lg,
  },
  kycLabel: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    marginBottom: 4,
  },
  kycValue: {
    fontSize: 15,
    color: theme.colors.text.primary,
    fontWeight: '500',
  },
  kycButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  kycButtonResubmit: {
    backgroundColor: theme.colors.primary,
  },
  kycButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.white,
  },
  kycUploadCard: {
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.primary + '20',
    borderStyle: 'dashed',
  },
  kycUploadTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  kycUploadDescription: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
});
