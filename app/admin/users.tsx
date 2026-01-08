import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, Filter, CheckCircle, Ban } from 'lucide-react-native';
import StatusBadge from '@/components/StatusBadge';
import { Colors } from '@/constants/Colors';

export default function AdminUsersScreen() {
  const router = useRouter();

  const users = [
    {
      id: '1',
      name: 'Chinedu Okafor',
      email: 'chinedu@email.com',
      type: 'Traveler',
      verified: true,
      trips: 12,
      rating: 4.8,
      status: 'active' as const,
    },
    {
      id: '2',
      name: 'TechHub Nigeria',
      email: 'info@techhub.ng',
      type: 'Business',
      verified: true,
      deliveries: 8,
      rating: 4.9,
      status: 'active' as const,
    },
    {
      id: '3',
      name: 'Sarah Okonkwo',
      email: 'sarah@email.com',
      type: 'Traveler',
      verified: false,
      trips: 0,
      rating: 0,
      status: 'pending' as const,
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
        <Text style={styles.headerTitle}>Users Management</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <Search size={20} color={Colors.textSecondary} />
        <Text style={styles.searchPlaceholder}>Search users...</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {users.map((user) => (
          <View key={user.id} style={styles.userCard}>
            <View style={styles.userHeader}>
              <View style={styles.userLeft}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </Text>
                </View>
                <View style={styles.userInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.userName}>{user.name}</Text>
                    {user.verified && (
                      <CheckCircle size={16} color={Colors.primary} />
                    )}
                  </View>
                  <Text style={styles.userEmail}>{user.email}</Text>
                  <Text style={styles.userType}>{user.type}</Text>
                </View>
              </View>
              <StatusBadge status={user.status} />
            </View>

            <View style={styles.userStats}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>
                  {user.type === 'Traveler' ? 'Trips' : 'Deliveries'}
                </Text>
                <Text style={styles.statValue}>
                  {user.type === 'Traveler' ? user.trips : user.deliveries}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Rating</Text>
                <Text style={styles.statValue}>
                  {user.rating > 0 ? `★ ${user.rating}` : 'N/A'}
                </Text>
              </View>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>View Details</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButtonDanger}>
                <Ban size={16} color={Colors.error} />
                <Text style={styles.actionButtonDangerText}>Suspend</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
  filterButton: {
    padding: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchPlaceholder: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  userCard: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userLeft: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textLight,
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  userType: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  userStats: {
    flexDirection: 'row',
    gap: 24,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textLight,
  },
  actionButtonDanger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  actionButtonDangerText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.error,
  },
});
