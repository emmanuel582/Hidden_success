import { useState } from 'react';
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
  Package,
  User,
  Phone,
  CheckCircle,
} from 'lucide-react-native';
import Input from '@/components/Input';
import Button from '@/components/Button';
import StatusBadge from '@/components/StatusBadge';
import { Colors } from '@/constants/Colors';

export default function ActiveDeliveryScreen() {
  const router = useRouter();
  const [pickupOtp, setPickupOtp] = useState('');
  const [deliveryOtp, setDeliveryOtp] = useState('');

  const delivery = {
    businessName: 'TechHub Nigeria',
    businessContact: '+234 801 234 5678',
    amount: '₦8,500',
    status: 'in_transit' as const,
    pickupAddress: 'Victoria Island, Lagos',
    deliveryAddress: 'Maitama, Abuja',
    packageSize: 'Small',
    description: 'Laptop accessories - Handle with care',
  };

  const timeline = [
    { label: 'Request Matched', completed: true },
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
        <Text style={styles.headerTitle}>Active Delivery</Text>
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

        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Delivery Fee</Text>
          <Text style={styles.amount}>{delivery.amount}</Text>
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pickup Details</Text>
          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <MapPin size={20} color={Colors.primary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Pickup Location</Text>
                <Text style={styles.detailValue}>
                  {delivery.pickupAddress}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Details</Text>
          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <MapPin size={20} color={Colors.secondary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Delivery Location</Text>
                <Text style={styles.detailValue}>
                  {delivery.deliveryAddress}
                </Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <User size={20} color={Colors.textSecondary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Business</Text>
                <Text style={styles.detailValue}>{delivery.businessName}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Package size={20} color={Colors.textSecondary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Package</Text>
                <Text style={styles.detailValue}>
                  {delivery.packageSize} - {delivery.description}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Confirm Delivery</Text>
          <View style={styles.otpCard}>
            <Text style={styles.otpLabel}>
              Enter OTP provided by recipient
            </Text>
            <Input
              placeholder="Enter 6-digit OTP"
              value={deliveryOtp}
              onChangeText={setDeliveryOtp}
              keyboardType="numeric"
            />
            <Button title="Confirm Delivery" onPress={() => router.push('/rating')} />
          </View>
        </View>

        <TouchableOpacity style={styles.contactButton}>
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
  },
  amountCard: {
    backgroundColor: Colors.primary,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
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
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  timelineLine: {
    width: 2,
    height: 32,
    backgroundColor: Colors.border,
  },
  timelineLineCompleted: {
    backgroundColor: Colors.primary,
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
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
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
  otpCard: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  otpLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
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
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
});
