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

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { useFocusEffect } from 'expo-router';

export default function ActivityScreen() {
  const { mode } = useMode();
  const router = useRouter();
  const { token } = useAuth();

  const [trips, setTrips] = useState<any[]>([]);
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async (isSilent = false) => {
    if (!token) return;
    if (!isSilent && !trips.length && !deliveries.length) {
      setLoading(true);
    }
    try {
      const statsRes = await api.get('/users/stats');
      if (statsRes.status === 'success') setUserStats(statsRes.data);

      if (mode === 'traveler') {
        const res = await api.get('/trips');
        if (res.status === 'success') {
          setTrips(res.data);
        }
      } else {
        const res = await api.get('/delivery-requests');
        if (res.status === 'success') {
          setDeliveries(res.data);
        }
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, [mode, token, trips.length, deliveries.length]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
      const interval = setInterval(() => {
        fetchData(true);
      }, 5000);
      return () => clearInterval(interval);
    }, [fetchData])
  );

  const renderTravelerActivity = () => (
    <>
      <View style={styles.walletCard}>
        <View style={styles.walletHeader}>
          <WalletIcon size={24} color={Colors.primary} />
          <Text style={styles.walletTitle}>Available Balance</Text>
        </View>
        <Text style={styles.walletAmount}>₦{userStats?.wallet?.balance?.toLocaleString() || '0'}</Text>
        <TouchableOpacity
          style={styles.withdrawButton}
          onPress={() => router.push('/traveler/wallet')}
        >
          <Text style={styles.withdrawButtonText}>Withdraw</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Trip History</Text>
      </View>

      {trips.length === 0 ? (
        <EmptyState
          title="No trips yet"
          description="Your active and past trips will appear here."
        />
      ) : (
        trips.map((trip) => (
          <TouchableOpacity
            key={trip.id}
            style={styles.card}
            onPress={() => router.push({ pathname: '/traveler/trip-details', params: { id: trip.id } })}
          >
            <View style={styles.cardHeader}>
              <View style={styles.routeContainer}>
                <MapPin size={16} color={Colors.primary} />
                <Text style={styles.route}>
                  {trip.origin} → {trip.destination}
                </Text>
              </View>
              <StatusBadge status={trip.status} />
            </View>

            <View style={styles.cardInfo}>
              <View style={styles.infoRow}>
                <Calendar size={14} color={Colors.textSecondary} />
                <Text style={styles.infoText}>
                  {(() => {
                    const dateStr = trip.date || trip.departure_date;
                    if (!dateStr) return 'Date N/A';
                    const d = new Date(dateStr);
                    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString(undefined, {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    });
                  })()}
                </Text>
              </View>
              {trip.total_earnings > 0 && (
                <Text style={styles.amount}>
                  +₦{trip.total_earnings.toLocaleString()}
                </Text>
              )}
            </View>

            <View style={styles.cardFooter}>
              {trip.request_count > 0 && trip.status === 'active' ? (
                <View style={styles.requestBadge}>
                  <Text style={styles.requestBadgeText}>{trip.request_count} Request{trip.request_count !== 1 ? 's' : ''}</Text>
                </View>
              ) : (
                <Text style={styles.detailsLink}>View Details</Text>
              )}
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
            onPress={() => router.push({ pathname: '/business/delivery-detail', params: { id: delivery.id } })}
          >
            <View style={styles.cardHeader}>
              <View style={styles.routeContainer}>
                <MapPin size={16} color={Colors.secondary} />
                <Text style={styles.route}>
                  {delivery.origin} → {delivery.destination}
                </Text>
              </View>
              <StatusBadge status={delivery.status} />
            </View>
            <View style={styles.cardInfo}>
              <View style={styles.infoRow}>
                <Calendar size={14} color={Colors.textSecondary} />
                <Text style={styles.infoText}>
                  {(() => {
                    const d = new Date(delivery.delivery_date);
                    return isNaN(d.getTime()) ? delivery.delivery_date : d.toLocaleDateString();
                  })()}
                </Text>
              </View>
              <Text style={styles.amount}>
                {delivery.estimated_cost ? `₦${delivery.estimated_cost}` : ''}
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardFooter: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  requestBadge: {
    backgroundColor: Colors.secondary + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  requestBadgeText: {
    fontSize: 12,
    color: Colors.secondary,
    fontWeight: '600',
  },
  detailsLink: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
});
