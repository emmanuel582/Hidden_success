import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Package,
  User,
  X,
  Check,
  CheckCircle,
  Clock,
  Navigation,
} from 'lucide-react-native';
import StatusBadge from '@/components/StatusBadge';
import Button from '@/components/Button';
import EmptyState from '@/components/EmptyState';
import { Colors } from '@/constants/Colors';
import { api } from '@/services/api';

export default function TripDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [trip, setTrip] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [currentMatchId, setCurrentMatchId] = useState<string | null>(null);
  const [otpValue, setOtpValue] = useState('');
  const [otpType, setOtpType] = useState<'pickup' | 'delivery' | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchData();
      const interval = setInterval(() => {
        fetchData(true);
      }, 5000);
      return () => clearInterval(interval);
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchData = async (isSilent = false) => {
    if (!id) return;
    if (!isSilent && !trip) {
      setLoading(true);
    }
    try {
      const [tripRes, requestsRes] = await Promise.all([
        api.get(`/trips/${id}`),
        api.get(`/matches/trip/${id}/requests`)
      ]);

      if (tripRes.status === 'success') {
        setTrip(tripRes.data);
      }
      if (requestsRes.status === 'success') {
        setRequests(requestsRes.data);
      }
    } catch (error) {
      console.log('Error fetching trip details:', error);
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  const handleAccept = async (matchId: string) => {
    setAcceptingId(matchId);
    try {
      const res = await api.patch(`/matches/${matchId}/accept`, {});
      if (res.status === 'success') {
        fetchData();
        Alert.alert('Success', 'Match accepted! You can now proceed to pickup.');
      }
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to accept match');
    } finally {
      setAcceptingId(null);
    }
  };

  const handleOpenOtpModal = (matchId: string, type: 'pickup' | 'delivery') => {
    setCurrentMatchId(matchId);
    setOtpType(type);
    setOtpValue('');
    setOtpModalVisible(true);
  };

  const handleConfirmOtp = async () => {
    if (!currentMatchId || !otpValue || !otpType) return;

    setConfirming(true);
    try {
      const endpoint = otpType === 'pickup'
        ? `/matches/${currentMatchId}/confirm-pickup`
        : `/matches/${currentMatchId}/confirm-delivery`;

      const res = await api.post(endpoint, { otp: otpValue });

      if (res.status === 'success') {
        setOtpModalVisible(false);
        fetchData();
        Alert.alert('Success', `${otpType === 'pickup' ? 'Pickup' : 'Delivery'} confirmed successfully!`);
      } else {
        Alert.alert('Error', res.message || 'Invalid OTP code');
      }
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Verification failed');
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!trip) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Trip not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)')}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trip Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.tripCard}>
          <View style={styles.tripHeader}>
            <View style={styles.routeContainer}>
              <MapPin size={20} color={Colors.primary} />
              <Text style={styles.route}>
                {trip.origin} → {trip.destination}
              </Text>
            </View>
            <StatusBadge status={trip.status} />
          </View>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Calendar size={16} color={Colors.textSecondary} />
              <View>
                <Text style={styles.detailLabel}>Date & Time</Text>
                <Text style={styles.detailValue}>
                  {trip.departure_date} at {trip.departure_time}
                </Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <Package size={16} color={Colors.textSecondary} />
              <View>
                <Text style={styles.detailLabel}>Available Space</Text>
                <Text style={styles.detailValue}>{trip.available_space}</Text>
              </View>
            </View>
          </View>

          {!!trip.description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.descriptionLabel}>Description</Text>
              <Text style={styles.descriptionText}>
                {trip.description}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Delivery Requests</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{requests.length}</Text>
          </View>
        </View>

        {requests.length === 0 ? (
          <EmptyState
            icon={<Package size={48} color={Colors.textSecondary} />}
            title="No requests yet"
            description="Delivery requests from businesses will appear here"
          />
        ) : (
          requests.map((match) => {
            const request = match.delivery_requests;
            const business = request?.users;
            return (
              <View key={match.id} style={styles.requestCard}>
                <View style={styles.requestHeader}>
                  <View>
                    <Text style={styles.businessName}>{business?.full_name || 'Business'}</Text>
                    <View style={styles.ratingRow}>
                      <Text style={styles.rating}>★ {business?.average_rating || 'New'}</Text>
                      {!!(business?.phone && (match.status === 'accepted' || match.status === 'in_transit')) && (
                        <Text style={styles.businessPhone}> • {business.phone}</Text>
                      )}
                    </View>
                  </View>
                  <Text style={styles.offer}>{request?.delivery_fee ? `₦${request.delivery_fee}` : 'Negotiable'}</Text>
                </View>

                <View style={styles.requestDetails}>
                  <View style={styles.locationDetail}>
                    <View style={styles.fromDot} />
                    <Text style={styles.locationText}>{request?.origin}</Text>
                  </View>
                  <View style={styles.locationDetail}>
                    <View style={styles.toDot} />
                    <Text style={styles.locationText}>{request?.destination}</Text>
                  </View>
                </View>

                <View style={styles.packageInfo}>
                  <Package size={16} color={Colors.textSecondary} />
                  <Text style={styles.packageSize}>{request?.package_size}</Text>
                </View>

                <View style={styles.statusRow}>
                  <StatusBadge status={match.status} />
                </View>

                <View style={styles.actionButtons}>
                  {match.status === 'pending' && (
                    <>
                      <TouchableOpacity
                        style={styles.declineButton}
                        onPress={() => { }}
                      >
                        <X size={20} color={Colors.error} />
                        <Text style={styles.declineButtonText}>Decline</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.acceptButton, acceptingId === match.id && { opacity: 0.7 }]}
                        onPress={() => handleAccept(match.id)}
                        disabled={acceptingId !== null}
                      >
                        {acceptingId === match.id ? (
                          <ActivityIndicator color={Colors.textLight} size="small" />
                        ) : (
                          <>
                            <Check size={20} color={Colors.textLight} />
                            <Text style={styles.acceptButtonText}>Accept</Text>
                          </>
                        )}
                      </TouchableOpacity>
                    </>
                  )}



                  {match.status === 'accepted' && (() => {
                    const isPaid = match.payments?.some((p: any) => p.payment_status === 'paid');
                    return (
                      <TouchableOpacity
                        style={[styles.acceptButton, { backgroundColor: isPaid ? Colors.secondary : Colors.warning }]}
                        onPress={() => router.push({ pathname: '/traveler/active-delivery', params: { matchId: match.id } })}
                      >
                        {isPaid ? <Package size={20} color={Colors.textLight} /> : <Clock size={20} color={Colors.textLight} />}
                        <Text style={styles.acceptButtonText}>
                          {isPaid ? 'Confirm Pickup' : 'Awaiting Payment'}
                        </Text>
                      </TouchableOpacity>
                    );
                  })()}

                  {(match.status === 'in_transit' || match.status === 'pickup_confirmed') && (
                    <TouchableOpacity
                      style={[styles.acceptButton, { backgroundColor: Colors.primary }]}
                      onPress={() => router.push({ pathname: '/traveler/active-delivery', params: { matchId: match.id } })}
                    >
                      <Package size={20} color={Colors.textLight} />
                      <Text style={styles.acceptButtonText}>Track / Confirm</Text>
                    </TouchableOpacity>
                  )}

                  {match.status === 'completed' && (
                    <View style={styles.completedBadge}>
                      <CheckCircle size={16} color={Colors.statusCompleted} />
                      <Text style={styles.completedText}>Delivery Completed</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
      <Modal
        visible={otpModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setOtpModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter {otpType === 'pickup' ? 'Pickup' : 'Delivery'} OTP</Text>
            <Text style={styles.modalDescription}>
              Ask the {otpType === 'pickup' ? 'sender' : 'recipient'} for the 6-digit verification code.
            </Text>

            <TextInput
              style={styles.otpInput}
              placeholder="000000"
              keyboardType="number-pad"
              maxLength={6}
              value={otpValue}
              onChangeText={setOtpValue}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setOtpModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmButton, confirming && { opacity: 0.7 }]}
                onPress={handleConfirmOtp}
                disabled={confirming || otpValue.length < 6}
              >
                {confirming ? (
                  <ActivityIndicator color={Colors.textLight} size="small" />
                ) : (
                  <Text style={styles.confirmButtonText}>Verify</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  tripCard: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  route: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  detailsGrid: {
    gap: 12,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  descriptionSection: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  descriptionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  badge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textLight,
  },
  requestCard: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  businessName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  ratingRow: {
    marginTop: 4,
  },
  rating: {
    fontSize: 14,
    color: Colors.warning,
  },
  businessPhone: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  offer: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  requestDetails: {
    gap: 8,
    marginBottom: 12,
  },
  locationDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fromDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  toDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.secondary,
  },
  locationText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  packageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginBottom: 12,
  },
  packageSize: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  declineButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.error,
    backgroundColor: Colors.surface,
  },
  declineButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.error,
  },
  acceptButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.primary,
  },
  acceptButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textLight,
  },
  statusRow: {
    marginBottom: 12,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.statusCompleted + '10',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    justifyContent: 'center',
  },
  completedText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.statusCompleted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: Colors.surface,
    padding: 24,
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  otpInput: {
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 16,
    fontSize: 24,
    textAlign: 'center',
    fontWeight: '700',
    letterSpacing: 8,
    marginBottom: 24,
    color: Colors.text,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textLight,
  },
});
