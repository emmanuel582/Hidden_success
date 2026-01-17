import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Star,
  Filter,
  CheckCircle,
} from 'lucide-react-native';
import Button from '@/components/Button';
import { Colors } from '@/constants/Colors';
import { api } from '@/services/api';

import { useState, useEffect } from 'react';

export default function SearchTravelersScreen() {
  const router = useRouter();
  const { requestId, origin, destination, date, space, time } = useLocalSearchParams();

  const [travelers, setTravelers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestingId, setRequestingId] = useState<string | null>(null);

  useEffect(() => {
    fetchTravelers();
    const interval = setInterval(() => {
      fetchTravelers(true);
    }, 5000);
    return () => clearInterval(interval);
  }, [origin, destination, date, space, time]);

  const fetchTravelers = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const res = await api.get('/trips/search', {
        origin: origin,
        destination: destination,
        date: date,
        time: time,
        space: space
      });
      if (res.status === 'success') {
        setTravelers(res.data);
      }
    } catch (error) {
      console.log('Search Error:', error);
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  const handleSendRequest = async (tripId: string) => {
    const rid = typeof requestId === 'string' ? requestId : Array.isArray(requestId) ? requestId[0] : '';
    if (!rid) {
      Alert.alert('Error', 'No active delivery request found to match.');
      return;
    }

    setRequestingId(tripId);
    try {
      const res = await api.post('/matches/request', {
        tripId: tripId,
        requestId: rid
      });

      if (res.status === 'success') {
        Alert.alert('Success', 'Match request sent to traveler!');
        router.push('/business/request-sent');
      } else {
        Alert.alert('Error', res.message || 'Failed to send request');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'An error occurred');
    } finally {
      setRequestingId(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.canGoBack() ? router.back() : router.replace('/business/post-delivery')}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Available Travelers</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.routeInfo}>
        <View style={styles.routeRow}>
          <MapPin size={16} color={Colors.secondary} />
          <Text style={styles.routeText}>{origin || 'Anywhere'} → {destination || 'Anywhere'}</Text>
        </View>
        <View style={styles.dateRow}>
          <Calendar size={14} color={Colors.textSecondary} />
          <Text style={styles.dateText}>
            {(() => {
              if (!date) return 'Any Date';
              const d = new Date(date as string);
              return isNaN(d.getTime()) ? date : d.toLocaleDateString();
            })()}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 50 }} />
        ) : travelers.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Text style={{ color: Colors.textSecondary }}>No travelers found matching your criteria.</Text>
          </View>
        ) : (
          <>
            <Text style={styles.resultsText}>
              {travelers.length} traveler{travelers.length !== 1 ? 's' : ''} found
            </Text>

            {travelers.map((trip) => (
              <View key={trip.id} style={styles.travelerCard}>
                {trip.relevanceScore && (
                  <View style={styles.relevanceBadge}>
                    <Text style={styles.relevanceText}>{trip.relevanceScore}% Match</Text>
                  </View>
                )}

                <View style={styles.travelerHeader}>
                  <View style={styles.travelerLeft}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>
                        {trip.users?.full_name
                          ? trip.users.full_name.split(' ').map((n: any) => n[0]).join('')
                          : 'U'}
                      </Text>
                    </View>
                    <View style={styles.travelerInfo}>
                      <View style={styles.nameRow}>
                        <Text style={styles.travelerName}>{trip.users?.full_name || 'User'}</Text>
                        {trip.users?.is_verified && (
                          <CheckCircle size={16} color={Colors.primary} />
                        )}
                      </View>
                      <View style={styles.ratingRow}>
                        <Star
                          size={14}
                          color={Colors.warning}
                          fill={Colors.warning}
                        />
                        <Text style={styles.rating}>Verified</Text>
                        <Text style={styles.trips}>
                          {/* (Trips count not available yet) */}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {trip.matchReasons && trip.matchReasons.length > 0 && (
                  <View style={styles.matchReasons}>
                    {trip.matchReasons.map((reason: string, idx: number) => (
                      <View key={idx} style={styles.reasonChip}>
                        <Text style={styles.reasonText}>✓ {reason}</Text>
                      </View>
                    ))}
                  </View>
                )}

                <View style={styles.tripDetails}>
                  <View style={styles.tripRow}>
                    <MapPin size={16} color={Colors.textSecondary} />
                    <Text style={styles.tripText}>
                      {trip.origin} → {trip.destination}
                    </Text>
                  </View>
                  <View style={styles.tripRow}>
                    <Calendar size={16} color={Colors.textSecondary} />
                    <Text style={styles.tripText}>
                      {(() => {
                        const d = new Date(trip.departure_date);
                        const dateStr = isNaN(d.getTime()) ? trip.departure_date : d.toLocaleDateString();
                        return `${dateStr} at ${trip.departure_time || 'anytime'}`;
                      })()}
                    </Text>
                  </View>
                </View>

                <View style={styles.spaceInfo}>
                  <Text style={styles.spaceLabel}>Available Space:</Text>
                  <Text style={styles.spaceValue}>{trip.available_space}</Text>
                </View>

                <Button
                  title="Send Request"
                  onPress={() => handleSendRequest(trip.id)}
                  variant="secondary"
                  loading={requestingId === trip.id}
                  disabled={requestingId !== null && requestingId !== trip.id}
                />
              </View>
            ))}
          </>
        )}
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
  routeInfo: {
    backgroundColor: Colors.secondary + '10',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  routeText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  resultsText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  travelerCard: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  travelerHeader: {
    marginBottom: 12,
  },
  travelerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textLight,
  },
  travelerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  travelerName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  trips: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  tripDetails: {
    gap: 8,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  tripRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tripText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  spaceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  spaceLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  spaceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  relevanceBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  relevanceText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textLight,
  },
  matchReasons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  reasonChip: {
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  reasonText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '500',
  },
});
