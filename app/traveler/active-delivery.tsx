import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import {
  ArrowLeft,
  MapPin,
  Package,
  User,
  Phone,
  Shield,
  Clock,
  Info,
} from 'lucide-react-native';
import Input from '@/components/Input';
import Button from '@/components/Button';
import StatusBadge from '@/components/StatusBadge';
import { Colors } from '@/constants/Colors';
import { api } from '@/services/api';

export default function ActiveDeliveryScreen() {
  const router = useRouter();
  const { matchId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [delivery, setDelivery] = useState<any>(null);
  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [requestingOtp, setRequestingOtp] = useState(false);

  const fetchData = async () => {
    if (!matchId) return;
    try {
      const res = await api.get(`/matches/${matchId}`);
      if (res.status === 'success') {
        const data = res.data;
        const req = data.delivery_requests;
        const biz = data.business;

        const isPaid = data.payments?.some((p: any) => p.payment_status === 'paid');

        setDelivery({
          id: data.id,
          businessName: biz?.full_name || 'Business',
          businessContact: biz?.phone || 'N/A',
          amount: `₦${req?.estimated_cost?.toLocaleString() || '0'}`,
          status: data.status,
          pickupAddress: req?.origin,
          deliveryAddress: req?.destination,
          packageSize: req?.package_size,
          description: req?.item_description,
          requestId: data.delivery_request_id,
          isPaid: !!isPaid,
        });
      }
    } catch (error) {
      console.error('Error fetching match:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [matchId])
  );

  const isPendingAcceptance = delivery?.status === 'pending';
  const isPickupPhase = delivery?.status === 'accepted';
  const isInTransit = delivery?.status === 'in_transit' || delivery?.status === 'pickup_confirmed';

  useEffect(() => {
    // Debug log to trace status updates
    console.log('Current Delivery Status:', delivery?.status);
  }, [delivery]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(), 5000);
    return () => clearInterval(interval);
  }, [matchId]);

  useEffect(() => {
    let timer: any;
    if (cooldownRemaining > 0) {
      timer = setInterval(() => {
        setCooldownRemaining(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldownRemaining]);

  const handleRequestOtp = async (type: 'pickup' | 'delivery') => {
    if (cooldownRemaining > 0) return;
    if (type === 'pickup' && !delivery.isPaid) {
      Alert.alert('Payment Required', 'The business must pay for the delivery before you can request the pickup code.');
      return;
    }

    setRequestingOtp(true);
    try {
      const res = await api.post(`/matches/${matchId}/request-otp`, { type });
      if (res.status === 'success') {
        setCooldownRemaining(300); // 5 minutes
        Alert.alert('Success', `Verification code has been sent to the business. Please ask them for the code.`);
      }
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to request code');
    } finally {
      setRequestingOtp(false);
    }
  };

  const handleVerify = async (type: 'pickup' | 'delivery') => {
    if (!otp || otp.length < 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    setVerifying(true);
    try {
      const endpoint = type === 'pickup' ? `/matches/${matchId}/confirm-pickup` : `/matches/${matchId}/confirm-delivery`;
      const res = await api.post(endpoint, { otp });

      if (res.status === 'success') {
        Alert.alert('Success', type === 'pickup' ? 'Package picked up successfully!' : 'Delivery confirmed!');
        setOtp('');
        if (type === 'delivery') {
          router.replace('/(tabs)/activity');
        } else {
          fetchData();
        }
      } else {
        Alert.alert('Error', res.message || 'Verification failed');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  const handleAccept = async () => {
    setVerifying(true);
    try {
      const res = await api.post(`/matches/${matchId}/accept`, {});
      if (res.status === 'success') {
        Alert.alert('Success', 'Match accepted! Please wait for the business to make payment.');
        fetchData();
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to accept match');
    } finally {
      setVerifying(false);
    }
  };

  const handleDecline = async () => {
    Alert.alert(
      'Decline Request',
      'Are you sure you want to decline this request?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: async () => {
            router.replace('/(tabs)');
          }
        }
      ]
    );
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



  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)')}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delivery Status</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.statusCard}>
          <StatusBadge status={delivery.status} />
          <Text style={styles.statusText}>
            {isPendingAcceptance ? 'Action Required' : isPickupPhase ? 'Awaiting Pickup' : isInTransit ? 'In Transit' : 'Completed'}
          </Text>
        </View>

        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Earnings</Text>
          <Text style={styles.amount}>{delivery.amount}</Text>
          <View style={styles.secureBadgeAmount}>
            <Shield size={14} color={Colors.textLight} />
            <Text style={styles.secureTextAmount}>Payment Securely in Escrow</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Route Details</Text>
          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <MapPin size={20} color={Colors.primary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Pickup Location</Text>
                <Text style={styles.detailValue}>{delivery.pickupAddress}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <MapPin size={20} color={Colors.secondary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Delivery Location</Text>
                <Text style={styles.detailValue}>{delivery.deliveryAddress}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Package & Business</Text>
          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <User size={20} color={Colors.textSecondary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Business Name</Text>
                <Text style={styles.detailValue}>{delivery.businessName}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Package size={20} color={Colors.textSecondary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Package Details</Text>
                <Text style={styles.detailValue}>
                  {delivery.packageSize} - {delivery.description}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {isPendingAcceptance ? (
          <View style={styles.section}>
            <View style={styles.pendingCard}>
              <Info size={32} color={Colors.primary} />
              <Text style={styles.pendingTitle}>New Match Request</Text>
              <Text style={styles.pendingText}>
                The business has requested you for this delivery. Accept the request to proceed to the payment stage.
              </Text>
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.declineButton}
                  onPress={handleDecline}
                  disabled={verifying}
                >
                  <Text style={styles.declineText}>Decline</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={handleAccept}
                  disabled={verifying}
                >
                  {verifying ? (
                    <ActivityIndicator color={Colors.textLight} size="small" />
                  ) : (
                    <Text style={styles.acceptText}>Accept Match</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : null}

        {isPickupPhase && !delivery.isPaid ? (
          <View style={styles.section}>
            <View style={[styles.waitingCard, { backgroundColor: '#FFF9C4', borderColor: '#FBC02D' }]}>
              <Clock size={32} color="#F57F17" />
              <Text style={[styles.waitingTitle, { color: '#F57F17' }]}>Awaiting Payment</Text>
              <Text style={[styles.waitingText, { color: '#7F5E00' }]}>
                Match accepted! The business now needs to pay before you can pick up the package.
                {"\n\n"}
                <Text style={{ fontWeight: '700' }}>Do not pick up until payment is confirmed.</Text>
              </Text>
              <TouchableOpacity style={styles.refreshButton} onPress={() => fetchData()}>
                <Text style={styles.refreshText}>I've been told they paid - Refresh</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        {((isPickupPhase && delivery.isPaid) || isInTransit) ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {isPickupPhase ? 'Verify Pickup' : 'Verify Delivery'}
            </Text>
            <View style={styles.otpCard}>
              <View style={styles.otpHeader}>
                <Text style={styles.otpLabel}>
                  {isPickupPhase
                    ? 'Ask Business for Pickup Code'
                    : 'Ask Recipient for Delivery Code'}
                </Text>
                <TouchableOpacity
                  onPress={() => handleRequestOtp(isPickupPhase ? 'pickup' : 'delivery')}
                  disabled={requestingOtp || cooldownRemaining > 0}
                >
                  <Text style={[
                    styles.requestCodeText,
                    (requestingOtp || cooldownRemaining > 0) && { opacity: 0.5 }
                  ]}>
                    {requestingOtp ? 'Sending...' :
                      cooldownRemaining > 0 ? `Wait ${Math.floor(cooldownRemaining / 60)}:${(cooldownRemaining % 60).toString().padStart(2, '0')}` :
                        'Request Code'}
                  </Text>
                </TouchableOpacity>
              </View>
              <Input
                placeholder="Enter 6-digit code"
                value={otp}
                onChangeText={setOtp}
                keyboardType="numeric"
                maxLength={6}
              />
              <Button
                title={isPickupPhase ? "Confirm Pickup" : "Confirm Delivery"}
                onPress={() => handleVerify(isPickupPhase ? 'pickup' : 'delivery')}
                loading={verifying}
              />
            </View>
          </View>
        ) : null}

        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => {
            if (delivery.businessContact !== 'N/A') {
              require('react-native').Linking.openURL(`tel:${delivery.businessContact}`);
            }
          }}
        >
          <Phone size={20} color={Colors.primary} />
          <Text style={styles.contactButtonText}>Contact Business</Text>
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
  statusCard: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statusText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
    fontWeight: '500',
  },
  amountCard: {
    backgroundColor: Colors.primary,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  amountLabel: {
    fontSize: 14,
    color: Colors.textLight,
    opacity: 0.9,
    marginBottom: 4,
  },
  amount: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.textLight,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  detailCard: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  detailRow: {
    flexDirection: 'row',
    gap: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  pendingCard: {
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    gap: 12,
  },
  pendingTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  pendingText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    width: '100%',
  },
  declineButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.error,
    alignItems: 'center',
  },
  declineText: {
    color: Colors.error,
    fontWeight: '600',
  },
  acceptButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  acceptText: {
    color: Colors.textLight,
    fontWeight: '600',
  },
  waitingCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    gap: 12,
  },
  waitingTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  waitingText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  refreshButton: {
    backgroundColor: Colors.surface,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FBC02D',
    marginTop: 8,
  },
  refreshText: {
    color: '#F57F17',
    fontWeight: '700',
  },
  otpCard: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 0,
  },
  otpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  otpLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  requestCodeText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  secureBadgeAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  secureTextAmount: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textLight,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    marginTop: 8,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
});
