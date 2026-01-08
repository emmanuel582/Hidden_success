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

export default function TabLayout() {
  const { mode } = useMode();

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
