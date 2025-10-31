/**
 * Tabs Layout
 * Main bottom tab navigation
 */

import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/src/theme';
import { HomeIcon, SearchIcon, BookmarkIcon, ProfileIcon } from '@/src/components';

// Custom tab bar icon with circular background
function TabBarIcon({ name, color, focused }: { name: any; color: string; focused: boolean }) {
  // Use custom HomeIcon for home tab
  if (name === 'home' || name === 'home-outline') {
    return (
      <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
        <HomeIcon color={color} size={22} filled={focused} />
      </View>
    );
  }
  
  // Use custom SearchIcon for search tab
  if (name === 'search' || name === 'search-outline') {
    return (
      <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
        <SearchIcon color={color} size={22} filled={focused} />
      </View>
    );
  }
  
  // Use custom BookmarkIcon for bookings tab
  if (name === 'bookmark' || name === 'bookmark-outline') {
    return (
      <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
        <BookmarkIcon color={color} size={22} filled={focused} />
      </View>
    );
  }
  
  // Use custom ProfileIcon for profile tab
  if (name === 'person' || name === 'person-outline') {
    return (
      <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
        <ProfileIcon color={color} size={22} filled={focused} />
      </View>
    );
  }
  
  return (
    <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
      <Ionicons name={name} size={24} color={color} />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          height: 70,
          backgroundColor: '#1C1C1E',
          borderRadius: 35,
          paddingBottom: 15,
          paddingTop: 15,
          paddingHorizontal: 0,
          borderTopWidth: 0,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
            },
            android: {
              elevation: 10,
            },
          }),
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "home" : "home-outline"} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "search" : "search-outline"} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "bookmark" : "bookmark-outline"} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "person" : "person-outline"} color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  iconContainerActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});
