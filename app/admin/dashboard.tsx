import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Users,
  Truck,
  Package,
  DollarSign,
  AlertCircle,
  TrendingUp,
  Shield,
} from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

export default function AdminDashboardScreen() {
  const router = useRouter();

  const stats = [
    {
      icon: Users,
      label: 'Total Users',
      value: '1,247',
      change: '+12%',
      color: Colors.primary,
    },
    {
      icon: Truck,
      label: 'Active Trips',
      value: '89',
      change: '+5%',
      color: Colors.secondary,
    },
    {
      icon: Package,
      label: 'Deliveries',
      value: '456',
      change: '+18%',
      color: Colors.primary,
    },
    {
      icon: DollarSign,
      label: 'Revenue',
      value: '₦2.4M',
      change: '+24%',
      color: Colors.success,
    },
  ];

  const quickActions = [
    {
      icon: Users,
      label: 'Users',
      count: '1,247',
      route: '/admin/users',
    },
    {
      icon: Truck,
      label: 'Trips',
      count: '89',
      route: '/admin/trips',
    },
    {
      icon: Shield,
      label: 'Verifications',
      count: '23',
      route: '/admin/verifications',
    },
    {
      icon: AlertCircle,
      label: 'Disputes',
      count: '7',
      route: '/admin/disputes',
    },
  ];

  const recentActivity = [
    {
      id: '1',
      type: 'user',
      message: 'New user registration: Adewale Ogunbiyi',
      time: '5 mins ago',
    },
    {
      id: '2',
      type: 'trip',
      message: 'New trip posted: Lagos to Abuja',
      time: '12 mins ago',
    },
    {
      id: '3',
      type: 'verification',
      message: 'Verification pending: TechHub Nigeria',
      time: '30 mins ago',
    },
    {
      id: '4',
      type: 'dispute',
      message: 'New dispute reported for delivery #12345',
      time: '1 hour ago',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View
                style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}
              >
                <stat.icon size={24} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <View style={styles.statChange}>
                <TrendingUp size={12} color={Colors.success} />
                <Text style={styles.statChangeText}>{stat.change}</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionCard}
              onPress={() => router.push(action.route as any)}
            >
              <action.icon size={32} color={Colors.primary} />
              <Text style={styles.actionLabel}>{action.label}</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{action.count}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityList}>
          {recentActivity.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={styles.activityDot} />
              <View style={styles.activityContent}>
                <Text style={styles.activityMessage}>{activity.message}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
            </View>
          ))}
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  statChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statChangeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.success,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  actionCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 8,
  },
  countBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textLight,
  },
  activityList: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activityItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginTop: 6,
  },
  activityContent: {
    flex: 1,
  },
  activityMessage: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
