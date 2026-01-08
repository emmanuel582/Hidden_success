import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Settings,
  HelpCircle,
  Star,
  Shield,
  ChevronRight,
  LogOut,
} from 'lucide-react-native';
import { useMode } from '@/contexts/ModeContext';
import { Colors } from '@/constants/Colors';

export default function ProfileScreen() {
  const router = useRouter();
  const { mode } = useMode();

  const menuItems = [
    {
      icon: Settings,
      label: 'Settings',
      onPress: () => router.push('/settings'),
    },
    {
      icon: Shield,
      label: 'Verification Status',
      onPress: () => router.push('/verify/identity'),
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      onPress: () => router.push('/help'),
    },
    {
      icon: Star,
      label: 'Rate Your Experience',
      onPress: () => router.push('/rating'),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>CO</Text>
          </View>
          <Text style={styles.name}>Chinedu Okafor</Text>
          <Text style={styles.email}>chinedu.okafor@email.com</Text>
          <View style={styles.ratingContainer}>
            <Star size={16} color={Colors.warning} fill={Colors.warning} />
            <Text style={styles.rating}>4.8</Text>
            <Text style={styles.ratingCount}>(127 ratings)</Text>
          </View>
          <View style={styles.verificationBadge}>
            <Shield size={16} color={Colors.primary} />
            <Text style={styles.verificationText}>Verified User</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {mode === 'traveler' ? '12' : '8'}
            </Text>
            <Text style={styles.statLabel}>
              {mode === 'traveler' ? 'Trips' : 'Deliveries'}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {mode === 'traveler' ? '₦45,000' : '₦28,500'}
            </Text>
            <Text style={styles.statLabel}>
              {mode === 'traveler' ? 'Earned' : 'Spent'}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>6</Text>
            <Text style={styles.statLabel}>Months</Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIconContainer}>
                  <item.icon size={20} color={Colors.text} />
                </View>
                <Text style={styles.menuItemText}>{item.label}</Text>
              </View>
              <ChevronRight size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => router.push('/')}
        >
          <LogOut size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  profileCard: {
    backgroundColor: Colors.surface,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.textLight,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  ratingCount: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  verificationText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  divider: {
    width: 1,
    backgroundColor: Colors.border,
  },
  menuContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: Colors.text,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.error,
  },
});
