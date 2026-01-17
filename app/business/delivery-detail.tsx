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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useStripePayment } from '@/hooks/useStripePayment';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Package,
  User,
  DollarSign,
  Phone,
  CheckCircle,
  Navigation,
  Shield,
  AlertCircle,
} from 'lucide-react-native';
import StatusBadge from '@/components/StatusBadge';
import Button from '@/components/Button';
import { Colors } from '@/constants/Colors';

export default function DeliveryDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const { initPaymentSheet, presentPaymentSheet, isAvailable } = useStripePayment();
  const [delivery, setDelivery] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async (isSilent = false) => {
    if (!id) return;
    if (!isSilent && !delivery) {
      setLoading(true);
    }
    try {
      const res = await api.get(`/delivery-requests/${id}`);
      if (res.status === 'success') {
        const data = res.data;
        // Transform backend data to UI format
        // Find the match: Prioritize 'accepted' or 'in_transit' or 'completed', otherwise 'pending', ignore 'declined'
        const matches = data.matches || [];
        const match = matches.find((m: any) => ['accepted', 'in_transit', 'pickup_confirmed', 'delivery_confirmed', 'completed'].includes(m.status))
          || matches.find((m: any) => m.status === 'pending')
          || matches[0];

        const traveler = match?.traveler;

        setDelivery({
          id: data.id,
          status: data.status,
          travelerName: traveler?.full_name || 'Pending Match',
          travelerContact: traveler?.phone || 'N/A',
          pickupAddress: data.origin,
          deliveryAddress: data.destination,
          packageSize: data.package_size,
          packageDescription: data.item_description,
          deliveryDate: data.delivery_date,
          deliveryTime: data.delivery_time,
          amount: `₦${data.estimated_cost?.toLocaleString() || '0'}`,
          pickupOtp: match?.pickup_otp || '------',
          deliveryOtp: match?.delivery_otp || '------',
          createdAt: data.created_at,
          matchStatus: match?.status,
          matchAcceptedAt: match && match.status !== 'pending' ? match.updated_at : null,
          pickupConfirmedAt: match?.pickup_confirmed_at,
          deliveryConfirmedAt: match?.delivery_confirmed_at,
          isPaid: data.payments?.some((p: any) => p.payment_status === 'paid' && p.match_id === match?.id),
          matchId: match?.id,
        });
      }
    } catch (error) {
      console.error('Error fetching delivery:', error);
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  const [paying, setPaying] = useState(false);

  const handlePayment = async () => {
    console.log('handlePayment called', { matchId: delivery?.matchId, isAvailable });
    if (!delivery?.matchId) {
      Alert.alert('Error', 'No active match found to pay for. Please wait for a traveler to accept your request.');
      return;
    }

    if (!isAvailable) {
      Alert.alert('Payment Not Supported', 'Stripe payments are only available on mobile devices (iOS/Android) for now. Please use the mobile app to complete payment.');
      return;
    }

    setPaying(true);
    try {
      if (Platform.OS === 'web') {
        // Web flow: Use Stripe Checkout Sessions
        const sessionRes = await api.post('/payments/create-session', {
          matchId: delivery.matchId,
          email: user?.email
        });

        if (sessionRes.status === 'success') {
          const { url } = sessionRes.data;

          // Initialize and present (redirects on web)
          await (initPaymentSheet as any)({ checkoutUrl: url });
          await presentPaymentSheet();
          // Redirection happens here, so we don't need to do anything else.
          return;
        } else {
          Alert.alert('Error', sessionRes.message || 'Could not start payment session');
          setPaying(false);
          return;
        }
      }

      // Mobile flow (existing)
      const initRes = await api.post('/payments/initialize', {
        matchId: delivery.matchId,
        email: user?.email
      });

      if (initRes.status === 'success') {
        const { client_secret, reference } = initRes.data;

        // 2. Initialize Payment Sheet
        const { error: initError } = await initPaymentSheet({
          merchantDisplayName: 'Movever',
          paymentIntentClientSecret: client_secret,
          defaultBillingDetails: {
            email: user?.email,
          },
        });

        if (initError) {
          Alert.alert('Error', initError.message);
          setPaying(false);
          return;
        }

        // 3. Present Payment Sheet
        const { error: presentError } = await presentPaymentSheet();

        if (presentError) {
          if (presentError.code !== 'Canceled') {
            Alert.alert('Error', presentError.message);
          }
          setPaying(false);
          return;
        }

        // 4. Confirm on backend
        const confirmRes = await api.post('/payments/confirm', {
          reference,
        });

        if (confirmRes.status === 'success') {
          Alert.alert('Success', 'Payment completed! Your funds are held in escrow until delivery is confirmed.', [
            { text: 'OK', onPress: () => router.push('/(tabs)') }
          ]);
          fetchData(true);
        }
      }
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Payment failed');
    } finally {
      setPaying(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();

      // Auto-confirm payment if returning from Stripe Checkout (Web only)
      if (Platform.OS === 'web') {
        const params = new URLSearchParams(window.location.search);
        const paymentStatus = params.get('payment');
        const sessionId = params.get('session_id');

        if (paymentStatus === 'success' && sessionId) {
          confirmWebPayment(sessionId);
        }
      }

      const interval = setInterval(() => {
        fetchData(true);
      }, 5000);
      return () => clearInterval(interval);
    } else {
      setLoading(false);
    }
  }, [id]);

  const confirmWebPayment = async (sessionId: string) => {
    try {
      setPaying(true);
      const res = await api.post('/payments/confirm', { reference: sessionId });
      if (res.status === 'success') {
        Alert.alert('Success', 'Payment confirmed! Your order is now secure.');
        // Remove query params to avoid re-confirming on refresh
        window.history.replaceState({}, '', window.location.pathname + `?id=${id}`);
        fetchData(true);
      }
    } catch (e: any) {
      console.error('Web confirmation error:', e);
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!delivery) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Delivery not found</Text>
        <Button
          title="Go Back"
          onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)')}
          style={{ marginTop: 20 }}
        />
      </View>
    );
  }

  const statusUpdates = [
    {
      status: 'Request Created',
      time: delivery.createdAt ? new Date(delivery.createdAt).toLocaleString() : 'Just now',
      completed: true,
    },
    {
      status: 'Request Accepted',
      time: delivery.matchAcceptedAt ? new Date(delivery.matchAcceptedAt).toLocaleString() : 'Pending',
      completed: !!delivery.matchAcceptedAt || ['accepted', 'in_transit', 'pickup_confirmed', 'delivery_confirmed', 'completed'].includes(delivery.matchStatus),
    },
    {
      status: 'Pickup Completed',
      time: delivery.pickupConfirmedAt ? new Date(delivery.pickupConfirmedAt).toLocaleString() : 'Pending',
      completed: !!delivery.pickupConfirmedAt,
    },
    {
      status: 'In Transit',
      time: delivery.status === 'in_transit' || delivery.status === 'delivered' ? 'Active' : 'Pending',
      completed: delivery.status === 'in_transit' || delivery.status === 'delivered',
    },
    {
      status: 'Delivered',
      time: delivery.deliveryConfirmedAt ? new Date(delivery.deliveryConfirmedAt).toLocaleString() : 'Pending',
      completed: !!delivery.deliveryConfirmedAt,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)')}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delivery Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.statusHeader}>
          <View>
            <Text style={styles.orderId}>Order #{delivery.id}</Text>
            <Text style={styles.createdAt}>Created {delivery.createdAt}</Text>
          </View>
          <StatusBadge status={delivery.status} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Traveler Information</Text>
          <View style={styles.travelerCard}>
            <View style={styles.travelerHeader}>
              <View style={styles.avatar}>
                <User size={24} color={Colors.textLight} />
              </View>
              <View style={styles.travelerInfo}>
                <Text style={styles.travelerName}>{delivery.travelerName}</Text>
                <View style={styles.ratingRow}>
                  <CheckCircle size={14} color={Colors.primary} />
                  <Text style={styles.verified}>Verified</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.contactButton}>
              <Phone size={18} color={Colors.secondary} />
              <Text style={styles.contactButtonText}>
                {delivery.travelerContact}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Pickup & Delivery</Text>
            {!!(delivery.status === 'in_transit') && (
              <TouchableOpacity
                style={styles.trackButton}
                onPress={() => {
                  const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(delivery.pickupAddress)}&destination=${encodeURIComponent(delivery.deliveryAddress)}`;
                  require('react-native').Linking.openURL(url);
                }}
              >
                <Navigation size={14} color={Colors.primary} />
                <Text style={styles.trackButtonText}>Track on Map</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.addressCard}>
            <View style={styles.addressItem}>
              <View style={styles.fromDot} />
              <View style={styles.addressContent}>
                <Text style={styles.addressLabel}>Pickup Location</Text>
                <Text style={styles.addressValue}>
                  {delivery.pickupAddress}
                </Text>
              </View>
            </View>
            <View style={styles.addressDivider} />
            <View style={styles.addressItem}>
              <View style={styles.toDot} />
              <View style={styles.addressContent}>
                <Text style={styles.addressLabel}>Delivery Location</Text>
                <Text style={styles.addressValue}>
                  {delivery.deliveryAddress}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Package Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Package size={20} color={Colors.textSecondary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Package Size</Text>
                <Text style={styles.infoValue}>{delivery.packageSize}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Calendar size={20} color={Colors.textSecondary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Delivery Date & Time</Text>
                <Text style={styles.infoValue}>
                  {delivery.deliveryDate} at {delivery.deliveryTime}
                </Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.descriptionSection}>
              <Text style={styles.infoLabel}>Description</Text>
              <Text style={styles.descriptionText}>
                {delivery.packageDescription}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Information</Text>
          <View style={styles.paymentCard}>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Delivery Fee</Text>
              <Text style={styles.paymentValue}>{delivery.amount}</Text>
            </View>

            {!!(delivery.status === 'matched' || (delivery.status === 'accepted' && !delivery.isPaid)) && (
              <View style={styles.paymentAction}>
                <Text style={styles.paymentNote}>
                  {delivery.isPaid ? '✓ Payment Securely Held in Escrow' : 'Payment required to proceed with delivery'}
                </Text>
                {!delivery.isPaid && (
                  <Button
                    title="Pay & Secure Delivery"
                    onPress={handlePayment}
                    variant="secondary"
                    loading={paying}
                  />
                )}
              </View>
            )}

            {delivery.isPaid && (
              <View style={styles.secureBadge}>
                <Shield size={14} color={Colors.success} />
                <Text style={styles.secureText}>Money held safely in Escrow</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status Timeline</Text>
          <View style={styles.timelineCard}>
            {statusUpdates.map((update, index) => (
              <View key={index} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View
                    style={[
                      styles.timelineDot,
                      update.completed && styles.timelineDotCompleted,
                    ]}
                  >
                    {update.completed && (
                      <CheckCircle size={14} color={Colors.textLight} />
                    )}
                  </View>
                  {index < statusUpdates.length - 1 && (
                    <View
                      style={[
                        styles.timelineLine,
                        update.completed && styles.timelineLineCompleted,
                      ]}
                    />
                  )}
                </View>
                <View style={styles.timelineContent}>
                  <Text
                    style={[
                      styles.timelineStatus,
                      update.completed && styles.timelineStatusCompleted,
                    ]}
                  >
                    {update.status}
                  </Text>
                  <Text style={styles.timelineTime}>{update.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {!!(delivery.isPaid && (delivery.matchStatus === 'accepted' || delivery.matchStatus === 'in_transit' || delivery.matchStatus === 'pickup_confirmed')) ? (
          <View style={styles.section}>
            {(delivery.pickupOtp !== '------' || delivery.deliveryOtp !== '------') && (
              <Text style={styles.sectionTitle}>Verification Codes</Text>
            )}
            <View style={styles.otpContainer}>
              {(delivery.matchStatus === 'accepted' || delivery.matchStatus === 'pickup_confirmed') && delivery.pickupOtp !== '------' ? (
                <View style={styles.otpCard}>
                  <Text style={styles.otpLabel}>Pickup OTP</Text>
                  <Text style={styles.otpDescription}>
                    Share this with the traveler when they pick up the package
                  </Text>
                  <View style={[styles.otpBox, { borderColor: Colors.secondary }]}>
                    <Text style={[styles.otpCode, { color: Colors.secondary }]}>{delivery.pickupOtp}</Text>
                  </View>
                </View>
              ) : null}

              {(delivery.matchStatus === 'in_transit' || delivery.matchStatus === 'pickup_confirmed') && delivery.deliveryOtp !== '------' ? (
                <View style={[styles.otpCard, { marginTop: 16 }]}>
                  <Text style={styles.otpLabel}>Delivery OTP</Text>
                  <Text style={styles.otpDescription}>
                    Share this with the recipient to verify delivery
                  </Text>
                  <View style={[styles.otpBox, { borderColor: Colors.primary }]}>
                    <Text style={[styles.otpCode, { color: Colors.primary }]}>{delivery.deliveryOtp}</Text>
                  </View>
                </View>
              ) : null}
            </View>
          </View>
        ) : null}

        {!!(delivery.status === 'active') && (
          <Button
            title="Track Delivery"
            onPress={() => router.push('/business/tracking')}
          />
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
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  createdAt: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  section: {
    marginBottom: 16,
  },
  paymentWarning: {
    backgroundColor: '#FFEBEE',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  paymentWarningTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.error,
  },
  paymentWarningText: {
    fontSize: 12,
    color: '#D32F2F',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  travelerCard: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  travelerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  travelerInfo: {
    flex: 1,
  },
  travelerName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rating: {
    fontSize: 14,
    color: Colors.warning,
  },
  verified: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.background,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  addressCard: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  fromDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.secondary,
    marginTop: 4,
  },
  toDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
    marginTop: 4,
  },
  addressDivider: {
    height: 24,
    width: 2,
    backgroundColor: Colors.border,
    marginLeft: 5,
    marginVertical: 8,
  },
  addressContent: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  addressValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  infoCard: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  descriptionSection: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  descriptionText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  paymentCard: {
    backgroundColor: Colors.secondary + '10',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.secondary + '30',
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  paymentValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.secondary,
  },
  timelineCard: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 12,
  },
  timelineDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineDotCompleted: {
    borderColor: Colors.secondary,
    backgroundColor: Colors.secondary,
  },
  timelineLine: {
    width: 2,
    height: 28,
    backgroundColor: Colors.border,
  },
  timelineLineCompleted: {
    backgroundColor: Colors.secondary,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 1,
  },
  timelineStatus: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  timelineStatusCompleted: {
    fontWeight: '600',
    color: Colors.text,
  },
  timelineTime: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  otpContainer: {
    gap: 12,
  },
  otpLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  otpCard: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  otpDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  otpBox: {
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    width: '100%',
    alignItems: 'center',
  },
  otpCode: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 6,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  trackButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  paymentAction: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 12,
  },
  paymentNote: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    backgroundColor: Colors.success + '10',
    paddingVertical: 6,
    borderRadius: 8,
  },
  secureText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.success,
  },
});
