import { Tabs } from 'expo-router';
import {
  Home,
  Wallet,
  Bell,
  User,
  Package,
} from 'lucide-react-native';
import { useMode } from '@/contexts/ModeContext';
import { Colors } from '@/constants/Colors';
import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

export default function TabLayout() {
  const { mode } = useMode();
  const { token } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!token) return;

    const fetchCount = async () => {
      try {
        const res = await api.get('/notifications/unread-count');
        if (res.status === 'success') {
          setUnreadCount(res.data.count);
        }
      } catch (e) {
        console.log('Error fetching unread count:', e);
      }
    };

    fetchCount();
    const interval = setInterval(fetchCount, 5000);
    return () => clearInterval(interval);
  }, [token]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: mode === 'traveler' ? Colors.primary : Colors.secondary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          backgroundColor: Colors.surface,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: mode === 'traveler' ? 'Trips' : 'Deliveries',
          tabBarIcon: ({ size, color }) =>
            mode === 'traveler' ? (
              <Wallet size={size} color={color} />
            ) : (
              <Package size={size} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ size, color }) => <Bell size={size} color={color} />,
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: mode === 'traveler' ? Colors.primary : Colors.secondary,
            color: Colors.textLight,
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
