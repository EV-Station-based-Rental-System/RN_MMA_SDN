/**
 * Swipeable Tabs Wrapper
 * Adds smooth swipe gestures between tabs with animations
 */

import { View, StyleSheet, Dimensions } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useCallback } from 'react';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.2; // Giảm xuống 20% để dễ swipe hơn
const VELOCITY_THRESHOLD = 300; // Giảm velocity threshold

interface SwipeableTabsProps {
  children: React.ReactNode;
}

// Tab routes in order
const TAB_ROUTES = [
  '/(tabs)',
  '/(tabs)/favorites',
  '/(tabs)/bookings',
  '/(tabs)/profile',
];

export function SwipeableTabs({ children }: SwipeableTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Animation values
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const getCurrentTabIndex = useCallback(() => {
    // Map pathname to tab index
    if (pathname === '/' || pathname === '/(tabs)') return 0;
    if (pathname.includes('/favorites')) return 1;
    if (pathname.includes('/bookings')) return 2;
    if (pathname.includes('/profile')) return 3;
    return 0;
  }, [pathname]);

  const navigateToTab = useCallback((index: number, direction: 'left' | 'right') => {
    if (index < 0 || index >= TAB_ROUTES.length) return;
    
    // Reset animation state trước khi navigate
    translateX.value = 0;
    opacity.value = 1;
    
    // Haptic feedback khi chuyển tab thành công
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const route = TAB_ROUTES[index];
    console.log('🚀 Navigating to:', route, 'from direction:', direction);
    
    // Use replace instead of push for smoother transition
    router.replace(route as any);
  }, [router, translateX, opacity]);

  const pan = Gesture.Pan()
    .activeOffsetX([-10, 10]) // Active khi vuốt ngang ít nhất 10px
    .failOffsetY([-20, 20])    // Fail nếu vuốt dọc nhiều hơn 20px (ưu tiên scroll)
    .onUpdate((event) => {
      // Update translation during swipe
      translateX.value = event.translationX;
      // Fade effect during swipe
      opacity.value = 1 - Math.abs(event.translationX) / SCREEN_WIDTH * 0.3;
    })
    .onEnd((event) => {
      const { translationX, velocityX } = event;
      const currentIndex = getCurrentTabIndex();

      console.log('🔄 Swipe detected:', { 
        translationX, 
        velocityX, 
        currentIndex,
        pathname,
      });

      // Determine swipe direction
      let shouldNavigate = false;
      let targetIndex = currentIndex;

      // Swipe left (next tab) - translationX âm
      if (translationX < -SWIPE_THRESHOLD || velocityX < -VELOCITY_THRESHOLD) {
        if (currentIndex < TAB_ROUTES.length - 1) {
          shouldNavigate = true;
          targetIndex = currentIndex + 1;
          console.log('➡️ Swipe left to next tab:', targetIndex);
        }
      }
      // Swipe right (previous tab) - translationX dương
      else if (translationX > SWIPE_THRESHOLD || velocityX > VELOCITY_THRESHOLD) {
        if (currentIndex > 0) {
          shouldNavigate = true;
          targetIndex = currentIndex - 1;
          console.log('⬅️ Swipe right to previous tab:', targetIndex);
        } else {
          console.log('⚠️ Already at first tab');
        }
      }

      if (shouldNavigate) {
        console.log('✅ Navigation approved, animating...');
        
        // Xác định direction dựa vào target index
        const isGoingForward = targetIndex > currentIndex;
        const animationDirection = isGoingForward ? -SCREEN_WIDTH / 2 : SCREEN_WIDTH / 2;
        
        // Animate out theo đúng chiều
        translateX.value = withTiming(
          animationDirection,
          { duration: 150 },
        );
        opacity.value = withTiming(0.5, { duration: 150 }, () => {
          runOnJS(navigateToTab)(targetIndex, isGoingForward ? 'left' : 'right');
        });
      } else {
        console.log('❌ Navigation denied, spring back');
        // Spring back to original position
        translateX.value = withSpring(0, {
          damping: 15,
          stiffness: 150,
        });
        opacity.value = withSpring(1);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.container, animatedStyle]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
