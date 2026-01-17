import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
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

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { useFocusEffect } from 'expo-router';



export default function DashboardScreen() {
  const { mode, setMode } = useMode();
  const { user, checkVerificationStatus, token, initialCheckDone } = useAuth();
  const router = useRouter();

  // Poll for verification status changes if user is not verified
  useFocusEffect(
    useCallback(() => {
      if (user && !user.is_verified) {
        // Initial check
        checkVerificationStatus();

        const interval = setInterval(() => {
          console.log('[Dashboard] Checking verification status...');
          checkVerificationStatus();
        }, 10000); // Reduced from 5 to 10 seconds
        return () => clearInterval(interval);
      }
    }, [user?.is_verified, checkVerificationStatus])
  );

  const [travelerTrips, setTravelerTrips] = useState<any[]>([]);
  const [activeMatches, setActiveMatches] = useState<any[]>([]);
  const [businessDeliveries, setBusinessDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // Default to true
  const [isFirstFetch, setIsFirstFetch] = useState(true);

  const [userStats, setUserStats] = useState<any>(null);

  const fetchData = useCallback(async (isSilent = false) => {
    if (!token) return;
    if (!isSilent && !travelerTrips.length && !businessDeliveries.length) {
      setLoading(true);
    }
    try {
      // Fetch Stats
      const statsRes = await api.get('/users/stats');
      if (statsRes.status === 'success') {
        setUserStats(statsRes.data);
      }

      if (mode === 'traveler') {
        const res = await api.get('/trips');
        if (res.status === 'success') {
          setTravelerTrips(res.data);
        }
        // Fetch traveler matches
        const matchesRes = await api.get('/matches/my-deliveries');
        if (matchesRes.status === 'success') {
          setActiveMatches(matchesRes.data);
        }
      } else {
        const res = await api.get('/delivery-requests');
        if (res.status === 'success') {
          setBusinessDeliveries(res.data);
        }
      }
    } catch (error) {
      console.error('Fetch Error:', error);
    } finally {
      if (!isSilent) setLoading(false);
      setIsFirstFetch(false);
    }
  }, [mode, token]);


  useFocusEffect(
    useCallback(() => {
      fetchData();

      const interval = setInterval(() => {
        fetchData(true); // Silent poll
      }, 5000);

      return () => clearInterval(interval);
    }, [fetchData])
  );

  const renderTravelerDashboard = () => (
    <>
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <TrendingUp size={24} color={Colors.primary} />
          <Text style={styles.statValue}>₦{userStats?.wallet?.total_earned || '0'}</Text>
          <Text style={styles.statLabel}>Total Earnings</Text>
        </View>
        <View style={styles.statCard}>
          <Plane size={24} color={Colors.secondary} />
          <Text style={styles.statValue}>{userStats?.counts?.completedTrips || '0'}</Text>
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
      ) : null}

      {travelerTrips.length > 0 ? (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Trips</Text>
          </View>
          {travelerTrips.map((trip) => (
            <TouchableOpacity
              key={trip.id}
              style={styles.tripCard}
              onPress={() => router.push({ pathname: '/traveler/trip-details', params: { id: trip.id } })}
            >
              <View style={styles.tripHeader}>
                <View style={styles.routeContainer}>
                  <MapPin size={20} color={Colors.primary} />
                  <Text style={styles.route}>{trip.origin} → {trip.destination}</Text>
                </View>
                <StatusBadge status={trip.status} />
              </View>
              <View style={styles.tripDetails}>
                <View style={styles.detailItem}>
                  <Calendar size={16} color={Colors.textSecondary} />
                  <Text style={styles.detailText}>
                    {trip.departure_date ? `${trip.departure_date} at ${trip.departure_time}` : 'Date TBD'}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Package size={16} color={Colors.textSecondary} />
                  <Text style={styles.detailText}>
                    {trip.available_space ? `${trip.available_space} available` : 'Space available'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </>
      ) : null}

      {activeMatches.length > 0 ? (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ongoing Deliveries</Text>
          </View>
          {activeMatches.map((match) => (
            <TouchableOpacity
              key={match.id}
              style={[styles.tripCard, { borderLeftWidth: 4, borderLeftColor: Colors.secondary }]}
              onPress={() => router.push({ pathname: '/traveler/active-delivery', params: { matchId: match.id } })}
            >
              <View style={styles.tripHeader}>
                <View style={styles.routeContainer}>
                  <Package size={16} color={Colors.secondary} />
                  <Text style={styles.route}>
                    {match.delivery_requests?.origin} → {match.delivery_requests?.destination}
                  </Text>
                </View>
                <StatusBadge status={match.status} />
              </View>
              <View style={styles.tripInfo}>
                <Text style={styles.businessText}>
                  Business: {match.delivery_requests?.users?.full_name}
                </Text>
                <Text style={styles.statusDetail}>
                  {match.status === 'accepted' ? 'Ready for pickup' : 'In Transit'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </>
      ) : null}
    </>
  );

  const renderBusinessDashboard = () => (
    <>
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Package size={24} color={Colors.secondary} />
          <Text style={styles.statValue}>{userStats?.counts?.activeDeliveries || '0'}</Text>
          <Text style={styles.statLabel}>Active Deliveries</Text>
        </View>
        <View style={styles.statCard}>
          <TrendingUp size={24} color={Colors.primary} />
          <Text style={styles.statValue}>₦{userStats?.counts?.totalSpent || '0'}</Text>
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
            onPress={() => router.push({ pathname: '/business/delivery-detail', params: { id: delivery.id } })}
          >
            <View style={styles.tripHeader}>
              <View style={styles.routeContainer}>
                <MapPin size={16} color={Colors.secondary} />
                <Text style={styles.route}>
                  {delivery.origin} → {delivery.destination}
                </Text>
              </View>
              <StatusBadge status={delivery.status} />
            </View>
            <View style={styles.tripInfo}>
              <View style={styles.infoRow}>
                <Calendar size={16} color={Colors.textSecondary} />
                <Text style={styles.infoText}>
                  {(() => {
                    const d = new Date(delivery.delivery_date);
                    return isNaN(d.getTime()) ? delivery.delivery_date : d.toLocaleDateString();
                  })()}
                </Text>
              </View>
              <Text style={styles.travelerText}>
                Traveler: {delivery.traveler_name || 'Pending Match'}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </>
  );

  if (loading && isFirstFetch || !initialCheckDone) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ marginTop: 12, color: Colors.textSecondary }}>Checking status...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back</Text>
          <Text style={styles.name}>{user?.full_name || 'User'}</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/settings')}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.full_name?.substring(0, 2).toUpperCase() || 'UR'}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {!user?.is_verified ? (
        <View style={styles.verificationBanner}>
          <View style={{ flex: 1 }}>
            <Text style={styles.verificationText}>
              {user?.verification_status === 'pending'
                ? '⏳ Verification Pending Approval'
                : '⚠️ Account Unverified'}
            </Text>
            {user?.verification_status === 'pending' ? (
              <Text style={styles.verificationSubtext}>
                We're reviewing your documents
              </Text>
            ) : null}
          </View>
          {user?.verification_status !== 'pending' ? (
            <TouchableOpacity onPress={() => router.push('/verify/identity')}>
              <Text style={styles.verifyLink}>Verify Now</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={checkVerificationStatus}>
              <Text style={styles.refreshLink}>Refresh</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : null}

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
            opacity: user?.is_verified ? 1 : 0.5,
          },
        ]}
        onPress={() => {
          if (!user?.is_verified) {
            Alert.alert("Action Blocked", "Your account verification is pending approval.");
            return;
          }
          router.push(
            mode === 'traveler'
              ? '/traveler/post-trip'
              : '/business/post-delivery'
          );
        }}
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
    ...(Platform.OS !== 'web' ? {
      elevation: 8,
      shadowColor: Colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    } : {
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
    } as any),
  },
  verificationBanner: {
    backgroundColor: '#FFF3E0',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#FFE0B2',
  },
  verificationText: {
    color: Colors.warning,
    fontWeight: '600',
    fontSize: 14,
  },
  verificationSubtext: {
    color: Colors.warning,
    fontSize: 12,
    marginTop: 2,
    opacity: 0.8,
  },
  verifyLink: {
    color: Colors.primary,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  refreshLink: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 13,
  },
  businessText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  statusDetail: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  tripDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
