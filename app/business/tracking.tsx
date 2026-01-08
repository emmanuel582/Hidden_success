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
  MapPin,
  Phone,
  User,
  CheckCircle,
} from 'lucide-react-native';
import StatusBadge from '@/components/StatusBadge';
import { Colors } from '@/constants/Colors';

export default function TrackingScreen() {
  const router = useRouter();

  const delivery = {
    travelerName: 'John Adebayo',
    travelerContact: '+234 801 234 5678',
    status: 'in_transit' as const,
    pickupAddress: 'Victoria Island, Lagos',
    deliveryAddress: 'Maitama, Abuja',
    otp: '456789',
  };

  const timeline = [
    { label: 'Request Accepted', completed: true },
    { label: 'Pickup', completed: true },
    { label: 'In Transit', completed: true },
    { label: 'Delivered', completed: false },
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
        <Text style={styles.headerTitle}>Track Delivery</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.statusCard}>
          <StatusBadge status="active" />
          <Text style={styles.statusText}>Delivery in Progress</Text>
        </View>

        <View style={styles.mapPlaceholder}>
          <MapPin size={48} color={Colors.textSecondary} />
          <Text style={styles.mapText}>Live Tracking Map</Text>
        </View>

        <View style={styles.timelineCard}>
          <Text style={styles.cardTitle}>Delivery Status</Text>
          {timeline.map((step, index) => (
            <View key={index} style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View
                  style={[
                    styles.timelineDot,
                    step.completed && styles.timelineDotCompleted,
                  ]}
                >
                  {step.completed && (
                    <CheckCircle size={16} color={Colors.textLight} />
                  )}
                </View>
                {index < timeline.length - 1 && (
                  <View
                    style={[
                      styles.timelineLine,
                      step.completed && styles.timelineLineCompleted,
                    ]}
                  />
                )}
              </View>
              <Text
                style={[
                  styles.timelineLabel,
                  step.completed && styles.timelineLabelCompleted,
                ]}
              >
                {step.label}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.travelerCard}>
          <Text style={styles.cardTitle}>Traveler Information</Text>
          <View style={styles.travelerInfo}>
            <View style={styles.avatar}>
              <User size={24} color={Colors.textLight} />
            </View>
            <View style={styles.travelerDetails}>
              <Text style={styles.travelerName}>{delivery.travelerName}</Text>
              <Text style={styles.travelerContact}>
                {delivery.travelerContact}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.callButton}>
            <Phone size={20} color={Colors.secondary} />
            <Text style={styles.callButtonText}>Call Traveler</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.addressCard}>
          <Text style={styles.cardTitle}>Addresses</Text>
          <View style={styles.addressItem}>
            <View style={styles.fromDot} />
            <View style={styles.addressContent}>
              <Text style={styles.addressLabel}>Pickup</Text>
              <Text style={styles.addressValue}>
                {delivery.pickupAddress}
              </Text>
            </View>
          </View>
          <View style={styles.addressItem}>
            <View style={styles.toDot} />
            <View style={styles.addressContent}>
              <Text style={styles.addressLabel}>Delivery</Text>
              <Text style={styles.addressValue}>
                {delivery.deliveryAddress}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.otpCard}>
          <Text style={styles.otpTitle}>Delivery OTP</Text>
          <Text style={styles.otpDescription}>
            Share this code with the traveler upon delivery
          </Text>
          <View style={styles.otpBox}>
            <Text style={styles.otpCode}>{delivery.otp}</Text>
          </View>
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
  },
  mapPlaceholder: {
    aspectRatio: 16 / 9,
    backgroundColor: Colors.text,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  mapText: {
    fontSize: 16,
    color: Colors.textLight,
    marginTop: 12,
    opacity: 0.7,
  },
  timelineCard: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 12,
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
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
    height: 32,
    backgroundColor: Colors.border,
  },
  timelineLineCompleted: {
    backgroundColor: Colors.secondary,
  },
  timelineLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    paddingTop: 2,
  },
  timelineLabelCompleted: {
    fontWeight: '600',
    color: Colors.text,
  },
  travelerCard: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  travelerInfo: {
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
  travelerDetails: {
    flex: 1,
  },
  travelerName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  travelerContact: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.background,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.secondary,
  },
  callButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.secondary,
  },
  addressCard: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
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
  otpCard: {
    backgroundColor: Colors.secondary + '10',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.secondary + '30',
  },
  otpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  otpDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  otpBox: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.secondary,
  },
  otpCode: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.secondary,
    letterSpacing: 8,
  },
});
