import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Plus,
  MapPin,
  Calendar,
  TrendingUp,
  Package,
  Plane,
} from 'lucide-react-native';
import { useMode } from '@/contexts/ModeContext';
import ModeToggle from '@/components/ModeToggle';
import StatusBadge from '@/components/StatusBadge';
import EmptyState from '@/components/EmptyState';
import { Colors } from '@/constants/Colors';

export default function DashboardScreen() {
  const { mode } = useMode();
  const router = useRouter();

  const travelerTrips = [
    {
      id: '1',
      from: 'Lagos',
      to: 'Abuja',
      date: 'Jan 15, 2026',
      requests: 3,
      status: 'active' as const,
    },
    {
      id: '2',
      from: 'Port Harcourt',
      to: 'Enugu',
      date: 'Jan 20, 2026',
      requests: 0,
      status: 'pending' as const,
    },
  ];

  const businessDeliveries = [
    {
      id: '1',
      from: 'Lagos',
      to: 'Abuja',
      traveler: 'John Adebayo',
      date: 'Jan 15, 2026',
      status: 'active' as const,
    },
    {
      id: '2',
      from: 'Ibadan',
      to: 'Kaduna',
      traveler: 'Sarah Okonkwo',
      date: 'Jan 18, 2026',
      status: 'pending' as const,
    },
  ];

  const renderTravelerDashboard = () => (
    <>
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <TrendingUp size={24} color={Colors.primary} />
          <Text style={styles.statValue}>₦45,000</Text>
          <Text style={styles.statLabel}>Total Earnings</Text>
        </View>
        <View style={styles.statCard}>
          <Plane size={24} color={Colors.secondary} />
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>Completed Trips</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Active Trips</Text>
        <TouchableOpacity onPress={() => router.push('/traveler/post-trip')}>
          <Plus size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {travelerTrips.length === 0 ? (
        <EmptyState
          icon={<Plane size={48} color={Colors.textSecondary} />}
          title="No active trips"
          description="Post a trip to start earning from deliveries"
        />
      ) : (
        travelerTrips.map((trip) => (
          <TouchableOpacity
            key={trip.id}
            style={styles.tripCard}
            onPress={() => router.push('/traveler/trip-details')}
          >
            <View style={styles.tripHeader}>
              <View style={styles.routeContainer}>
                <MapPin size={16} color={Colors.primary} />
                <Text style={styles.route}>
                  {trip.from} → {trip.to}
                </Text>
              </View>
              <StatusBadge status={trip.status} />
            </View>
            <View style={styles.tripInfo}>
              <View style={styles.infoRow}>
                <Calendar size={16} color={Colors.textSecondary} />
                <Text style={styles.infoText}>{trip.date}</Text>
              </View>
              <Text style={styles.requests}>
                {trip.requests} delivery request{trip.requests !== 1 ? 's' : ''}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </>
  );

  const renderBusinessDashboard = () => (
    <>
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Package size={24} color={Colors.secondary} />
          <Text style={styles.statValue}>8</Text>
          <Text style={styles.statLabel}>Active Deliveries</Text>
        </View>
        <View style={styles.statCard}>
          <TrendingUp size={24} color={Colors.primary} />
          <Text style={styles.statValue}>₦28,500</Text>
          <Text style={styles.statLabel}>Total Spent</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Deliveries</Text>
        <TouchableOpacity
          onPress={() => router.push('/business/post-delivery')}
        >
          <Plus size={24} color={Colors.secondary} />
        </TouchableOpacity>
      </View>

      {businessDeliveries.length === 0 ? (
        <EmptyState
          icon={<Package size={48} color={Colors.textSecondary} />}
          title="No deliveries yet"
          description="Create a delivery request to get started"
        />
      ) : (
        businessDeliveries.map((delivery) => (
          <TouchableOpacity
            key={delivery.id}
            style={styles.tripCard}
            onPress={() => router.push('/business/delivery-detail')}
          >
            <View style={styles.tripHeader}>
              <View style={styles.routeContainer}>
                <MapPin size={16} color={Colors.secondary} />
                <Text style={styles.route}>
                  {delivery.from} → {delivery.to}
                </Text>
              </View>
              <StatusBadge status={delivery.status} />
            </View>
            <View style={styles.tripInfo}>
              <View style={styles.infoRow}>
                <Calendar size={16} color={Colors.textSecondary} />
                <Text style={styles.infoText}>{delivery.date}</Text>
              </View>
              <Text style={styles.travelerText}>
                Traveler: {delivery.traveler}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back</Text>
          <Text style={styles.name}>Chinedu Okafor</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/settings')}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>CO</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ModeToggle />
        {mode === 'traveler'
          ? renderTravelerDashboard()
          : renderBusinessDashboard()}
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.fab,
          {
            backgroundColor:
              mode === 'traveler' ? Colors.primary : Colors.secondary,
          },
        ]}
        onPress={() =>
          router.push(
            mode === 'traveler'
              ? '/traveler/post-trip'
              : '/business/post-delivery'
          )
        }
      >
        <Plus size={24} color={Colors.textLight} />
      </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
    backgroundColor: Colors.surface,
  },
  greeting: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 2,
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
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  tripCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  route: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  tripInfo: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  requests: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  travelerText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 80,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
