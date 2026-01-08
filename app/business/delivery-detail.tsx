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
  Calendar,
  Package,
  User,
  DollarSign,
  Phone,
  CheckCircle,
} from 'lucide-react-native';
import StatusBadge from '@/components/StatusBadge';
import Button from '@/components/Button';
import { Colors } from '@/constants/Colors';

export default function DeliveryDetailScreen() {
  const router = useRouter();

  const delivery = {
    id: 'DEL-12345',
    status: 'active' as const,
    travelerName: 'John Adebayo',
    travelerContact: '+234 801 234 5678',
    travelerRating: 4.8,
    pickupAddress: 'Victoria Island, Lagos',
    deliveryAddress: 'Maitama, Abuja',
    packageSize: 'Small',
    packageDescription: 'Laptop accessories - Handle with care',
    deliveryDate: 'Jan 15, 2026',
    deliveryTime: '9:00 AM',
    amount: '₦8,500',
    otp: '456789',
    createdAt: 'Jan 10, 2026',
  };

  const statusUpdates = [
    {
      status: 'Request Created',
      time: 'Jan 10, 2026 - 2:30 PM',
      completed: true,
    },
    {
      status: 'Request Accepted',
      time: 'Jan 10, 2026 - 4:15 PM',
      completed: true,
    },
    {
      status: 'Pickup Completed',
      time: 'Jan 15, 2026 - 9:00 AM',
      completed: true,
    },
    {
      status: 'In Transit',
      time: 'Jan 15, 2026 - 9:30 AM',
      completed: true,
    },
    {
      status: 'Delivered',
      time: 'Pending',
      completed: false,
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
                  <Text style={styles.rating}>
                    ★ {delivery.travelerRating}
                  </Text>
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
          <Text style={styles.sectionTitle}>Pickup & Delivery</Text>
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

        {delivery.status === 'active' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery OTP</Text>
            <View style={styles.otpCard}>
              <Text style={styles.otpDescription}>
                Share this code with the traveler upon delivery
              </Text>
              <View style={styles.otpBox}>
                <Text style={styles.otpCode}>{delivery.otp}</Text>
              </View>
            </View>
          </View>
        )}

        {delivery.status === 'active' && (
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
  otpCard: {
    backgroundColor: Colors.secondary + '10',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.secondary + '30',
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
