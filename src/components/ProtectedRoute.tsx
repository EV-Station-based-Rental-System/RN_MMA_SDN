/**
 * Protected Route Wrapper - Yêu cầu authentication
 */

import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { theme } from '@/src/theme';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login nếu chưa đăng nhập
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, isLoading]);

  // Hiển thị loading khi đang check auth
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
      </View>
    );
  }

  // Không render gì nếu chưa authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Render children nếu đã authenticated
  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.default,
  },
});
