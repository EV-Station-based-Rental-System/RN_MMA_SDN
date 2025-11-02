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
  TextInput,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { theme } from '@/src/theme';
import { useAuth } from '@/src/contexts/AuthContext';
import KycService from '@/src/api/kyc.api';
import UserService from '@/src/api/user.api';
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
  
  // KYC Form state
  const [showKycModal, setShowKycModal] = useState(false);
  const [kycType, setKycType] = useState<'national_id' | 'passport' | 'driver_license' | 'other'>('national_id');
  const [documentNumber, setDocumentNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [documentImage, setDocumentImage] = useState<string | null>(null);

  // Debug: Log user state changes
  useEffect(() => {
    console.log('👤 Profile screen - User state:', {
      hasUser: !!user,
      userId,
      userEmail: user?.email,
      isLoading
    });
  }, [user, userId, isLoading]);

  // Load KYC data when user is available
  useEffect(() => {
    const loadKycData = async () => {
      if (!user || !userId) return;

      try {
        setKycLoading(true);
        console.log('🔍 Loading KYC data for user:', userId);
        
        // Get user data which includes KYC information
        const userResponse = await UserService.findOne(userId);
        const userData = userResponse.data;
        
        if (userData?.kycs) {
          console.log('✅ Found existing KYC data:', userData.kycs);
          setKycData(userData.kycs as any);
        } else {
          console.log('ℹ️ No KYC data found for user');
          setKycData(null);
        }
      } catch (error) {
        console.error('❌ Failed to load KYC data:', error);
        setKycData(null);
      } finally {
        setKycLoading(false);
      }
    };

    loadKycData();
  }, [user, userId]);

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
    setShowKycModal(true);
  };

  const handlePickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please allow access to your photo library');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setDocumentImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSubmitKyc = async () => {
    // Validate form
    if (!documentNumber.trim()) {
      Alert.alert('Validation Error', 'Please enter document number');
      return;
    }

    if (!documentImage) {
      Alert.alert('Validation Error', 'Please upload document image');
      return;
    }

    try {
      setUploadingKyc(true);

      console.log('📤 Starting KYC upload for userId:', userId);

      // Prepare KYC data - service will handle file upload automatically
      const kycPayload: CreateKycDto = {
        type: kycType,
        document_number: documentNumber.trim(),
        document_img_url: documentImage, // Local URI - service will convert to file for upload
        ...(expiryDate.trim() && { expiry_date: expiryDate.trim() }),
      };

      const result = await KycService.create(kycPayload);
      console.log('✅ KYC upload successful:', result);

      // Refresh user data to get updated KYC information
      if (userId) {
        console.log('🔄 Refreshing user data after KYC upload for userId:', userId);
        try {
          const userResponse = await UserService.findOne(userId);
          console.log('📋 User response received:', userResponse);
          console.log('👤 User data from API:', userResponse.data);
          console.log('🆔 User ID from API response:', userResponse.data?._id || userResponse.data?.id);

          const updatedUser = userResponse.data;

          // Extract KYC data from user response
          if (updatedUser?.kycs) {
            console.log('✅ Found KYC data in user response:', updatedUser.kycs);
            setKycData(updatedUser.kycs as any);
          } else {
            console.log('⚠️ No KYC data found in user response, using upload response');
            setKycData(result as any);
          }
        } catch (userError) {
          console.error('❌ Failed to refresh user data:', userError);
          // Fallback to using the upload response
          setKycData(result as any);
        }
      } else {
        console.log('⚠️ No userId available, using upload response');
        setKycData(result as any);
      }
      
      // Reset form and close modal
      setShowKycModal(false);
      setDocumentNumber('');
      setExpiryDate('');
      setDocumentImage(null);
      setKycType('national_id');
      
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
  };

  const handleCancelKyc = () => {
    setShowKycModal(false);
    setDocumentNumber('');
    setExpiryDate('');
    setDocumentImage(null);
    setKycType('national_id');
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
                  name={getKycStatusIcon(kycData.status || 'submitted')} 
                  size={24} 
                  color={getKycStatusColor(kycData.status || 'submitted')} 
                />
                <Text style={styles.kycType}>
                  {kycData.type?.replace('_', ' ').toUpperCase() || 'DOCUMENT'}
                </Text>
              </View>
              <View 
                style={[
                  styles.kycStatusBadge, 
                  { backgroundColor: getKycStatusColor(kycData.status || 'submitted') + '20' }
                ]}
              >
                <Text 
                  style={[
                    styles.kycStatusText, 
                    { color: getKycStatusColor(kycData.status || 'submitted') }
                  ]}
                >
                  {kycData.status?.toUpperCase() || 'UNKNOWN'}
                </Text>
              </View>
            </View>
            
            <View style={styles.kycDetails}>
              <Text style={styles.kycLabel}>Document Number:</Text>
              <Text style={styles.kycValue}>{kycData.document_number || 'N/A'}</Text>
              
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

      {/* KYC Upload Modal */}
      <Modal
        visible={showKycModal}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancelKyc}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Upload KYC Document</Text>
              <TouchableOpacity onPress={handleCancelKyc} style={styles.modalCloseButton}>
                <Ionicons name="close" size={24} color={theme.colors.text.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              {/* Document Type Picker */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Document Type</Text>
                <View style={styles.pickerContainer}>
                  <TouchableOpacity
                    style={[styles.pickerOption, kycType === 'national_id' && styles.pickerOptionSelected]}
                    onPress={() => setKycType('national_id')}
                  >
                    <Text style={[styles.pickerOptionText, kycType === 'national_id' && styles.pickerOptionTextSelected]}>
                      National ID
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.pickerOption, kycType === 'passport' && styles.pickerOptionSelected]}
                    onPress={() => setKycType('passport')}
                  >
                    <Text style={[styles.pickerOptionText, kycType === 'passport' && styles.pickerOptionTextSelected]}>
                      Passport
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.pickerOption, kycType === 'driver_license' && styles.pickerOptionSelected]}
                    onPress={() => setKycType('driver_license')}
                  >
                    <Text style={[styles.pickerOptionText, kycType === 'driver_license' && styles.pickerOptionTextSelected]}>
                      Driver License
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.pickerOption, kycType === 'other' && styles.pickerOptionSelected]}
                    onPress={() => setKycType('other')}
                  >
                    <Text style={[styles.pickerOptionText, kycType === 'other' && styles.pickerOptionTextSelected]}>
                      Other
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Document Number Input */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Document Number *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter document number"
                  placeholderTextColor={theme.colors.text.secondary}
                  value={documentNumber}
                  onChangeText={setDocumentNumber}
                  autoCapitalize="characters"
                />
              </View>

              {/* Expiry Date Input */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Expiry Date (Optional)</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={theme.colors.text.secondary}
                  value={expiryDate}
                  onChangeText={setExpiryDate}
                  maxLength={10}
                />
              </View>

              {/* Image Upload */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Document Image *</Text>
                {documentImage ? (
                  <View style={styles.imagePreviewContainer}>
                    <Image
                      source={{ uri: documentImage }}
                      style={styles.imagePreview}
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      style={styles.imageRemoveButton}
                      onPress={() => setDocumentImage(null)}
                    >
                      <Ionicons name="close-circle" size={24} color={theme.colors.error} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.imagePickerButton} onPress={handlePickImage}>
                    <Ionicons name="cloud-upload-outline" size={32} color={theme.colors.primary.main} />
                    <Text style={styles.imagePickerText}>Tap to upload image</Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>

            {/* Modal Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={handleCancelKyc}
                disabled={uploadingKyc}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalSubmitButton]}
                onPress={handleSubmitKyc}
                disabled={uploadingKyc}
              >
                {uploadingKyc ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.modalSubmitButtonText}>Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: theme.colors.background.default,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background.dark,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  modalCloseButton: {
    padding: theme.spacing.xs,
  },
  modalContent: {
    padding: theme.spacing.lg,
  },
  formGroup: {
    marginBottom: theme.spacing.lg,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  formInput: {
    borderWidth: 1,
    borderColor: theme.colors.background.dark,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: 15,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.paper,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  pickerOption: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.background.dark,
    backgroundColor: theme.colors.background.paper,
    alignItems: 'center',
  },
  pickerOptionSelected: {
    borderColor: theme.colors.primary.main,
    backgroundColor: theme.colors.primary.main + '10',
  },
  pickerOptionText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  pickerOptionTextSelected: {
    color: theme.colors.primary.main,
    fontWeight: '600',
  },
  imagePickerButton: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: theme.colors.primary.main,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.xl * 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary.main + '05',
  },
  imagePickerText: {
    marginTop: theme.spacing.sm,
    fontSize: 14,
    color: theme.colors.primary.main,
    fontWeight: '500',
  },
  imagePreviewContainer: {
    position: 'relative',
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: theme.borderRadius.md,
  },
  imageRemoveButton: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: theme.colors.background.default,
    borderRadius: 12,
  },
  modalActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.background.dark,
  },
  modalButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelButton: {
    backgroundColor: theme.colors.background.dark,
  },
  modalCancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  modalSubmitButton: {
    backgroundColor: theme.colors.primary.main,
  },
  modalSubmitButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
