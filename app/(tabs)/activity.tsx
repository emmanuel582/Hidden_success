import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Calendar, Wallet as WalletIcon } from 'lucide-react-native';
import { useMode } from '@/contexts/ModeContext';
import StatusBadge from '@/components/StatusBadge';
import EmptyState from '@/components/EmptyState';
import { Colors } from '@/constants/Colors';

export default function ActivityScreen() {
  const { mode } = useMode();
  const router = useRouter();

  const trips = [
    {
      id: '1',
      from: 'Lagos',
      to: 'Abuja',
      date: 'Jan 15, 2026',
      amount: '₦15,000',
      status: 'completed' as const,
    },
    {
      id: '2',
      from: 'Port Harcourt',
      to: 'Enugu',
      date: 'Jan 20, 2026',
      amount: '₦8,500',
      status: 'active' as const,
    },
    {
      id: '3',
      from: 'Kano',
      to: 'Lagos',
      date: 'Jan 8, 2026',
      amount: '₦22,000',
      status: 'completed' as const,
    },
  ];

  const deliveries = [
    {
      id: '1',
      from: 'Lagos',
      to: 'Ibadan',
      date: 'Jan 12, 2026',
      amount: '₦5,500',
      status: 'completed' as const,
    },
    {
      id: '2',
      from: 'Abuja',
      to: 'Kaduna',
      date: 'Jan 16, 2026',
      amount: '₦7,000',
      status: 'active' as const,
    },
  ];

  const renderTravelerActivity = () => (
    <>
      <View style={styles.walletCard}>
        <View style={styles.walletHeader}>
          <WalletIcon size={24} color={Colors.primary} />
          <Text style={styles.walletTitle}>Available Balance</Text>
        </View>
        <Text style={styles.walletAmount}>₦45,000</Text>
        <TouchableOpacity
          style={styles.withdrawButton}
          onPress={() => router.push('/traveler/wallet')}
        >
          <Text style={styles.withdrawButtonText}>Withdraw</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Trip History</Text>

      {trips.length === 0 ? (
        <EmptyState
          title="No trips yet"
          description="Your completed and active trips will appear here"
        />
      ) : (
        trips.map((trip) => (
          <TouchableOpacity
            key={trip.id}
            style={styles.card}
            onPress={() => router.push('/traveler/trip-details')}
          >
            <View style={styles.cardHeader}>
              <View style={styles.routeContainer}>
                <MapPin size={16} color={Colors.primary} />
                <Text style={styles.route}>
                  {trip.from} → {trip.to}
                </Text>
              </View>
              <StatusBadge status={trip.status} />
            </View>
            <View style={styles.cardInfo}>
              <View style={styles.infoRow}>
                <Calendar size={14} color={Colors.textSecondary} />
                <Text style={styles.infoText}>{trip.date}</Text>
              </View>
              <Text style={styles.amount}>{trip.amount}</Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </>
  );

  const renderBusinessActivity = () => (
    <>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Total Deliveries</Text>
        <Text style={styles.summaryValue}>{deliveries.length}</Text>
      </View>

      <Text style={styles.sectionTitle}>Delivery History</Text>

      {deliveries.length === 0 ? (
        <EmptyState
          title="No deliveries yet"
          description="Your delivery requests will appear here"
        />
      ) : (
        deliveries.map((delivery) => (
          <TouchableOpacity
            key={delivery.id}
            style={styles.card}
            onPress={() => router.push('/business/delivery-detail')}
          >
            <View style={styles.cardHeader}>
              <View style={styles.routeContainer}>
                <MapPin size={16} color={Colors.secondary} />
                <Text style={styles.route}>
                  {delivery.from} → {delivery.to}
                </Text>
              </View>
              <StatusBadge status={delivery.status} />
            </View>
            <View style={styles.cardInfo}>
              <View style={styles.infoRow}>
                <Calendar size={14} color={Colors.textSecondary} />
                <Text style={styles.infoText}>{delivery.date}</Text>
              </View>
              <Text style={styles.amount}>{delivery.amount}</Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {mode === 'traveler' ? 'My Trips' : 'My Deliveries'}
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {mode === 'traveler'
          ? renderTravelerActivity()
          : renderBusinessActivity()}
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
  walletCard: {
    backgroundColor: Colors.primary,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  walletTitle: {
    fontSize: 14,
    color: Colors.textLight,
    opacity: 0.9,
  },
  walletAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.textLight,
    marginBottom: 16,
  },
  withdrawButton: {
    backgroundColor: Colors.textLight,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  withdrawButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  summaryCard: {
    backgroundColor: Colors.secondary,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.textLight,
    opacity: 0.9,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 48,
    fontWeight: '700',
    color: Colors.textLight,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  card: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
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
  cardInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
});
