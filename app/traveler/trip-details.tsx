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
  X,
  Check,
} from 'lucide-react-native';
import StatusBadge from '@/components/StatusBadge';
import Button from '@/components/Button';
import EmptyState from '@/components/EmptyState';
import { Colors } from '@/constants/Colors';

export default function TripDetailsScreen() {
  const router = useRouter();

  const tripDetails = {
    from: 'Lagos',
    to: 'Abuja',
    date: 'Jan 15, 2026',
    time: '9:00 AM',
    space: 'Medium',
    status: 'active' as const,
    description: 'Regular business trip, flexible with pickup times',
  };

  const deliveryRequests = [
    {
      id: '1',
      businessName: 'TechHub Nigeria',
      from: 'Victoria Island, Lagos',
      to: 'Maitama, Abuja',
      packageSize: 'Small',
      offer: '₦8,500',
      rating: 4.7,
    },
    {
      id: '2',
      businessName: 'Fashion Forward',
      from: 'Ikeja, Lagos',
      to: 'Wuse, Abuja',
      packageSize: 'Medium',
      offer: '₦12,000',
      rating: 4.9,
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
                {tripDetails.from} → {tripDetails.to}
              </Text>
            </View>
            <StatusBadge status={tripDetails.status} />
          </View>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Calendar size={16} color={Colors.textSecondary} />
              <View>
                <Text style={styles.detailLabel}>Date & Time</Text>
                <Text style={styles.detailValue}>
                  {tripDetails.date} at {tripDetails.time}
                </Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <Package size={16} color={Colors.textSecondary} />
              <View>
                <Text style={styles.detailLabel}>Available Space</Text>
                <Text style={styles.detailValue}>{tripDetails.space}</Text>
              </View>
            </View>
          </View>

          {tripDetails.description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.descriptionLabel}>Description</Text>
              <Text style={styles.descriptionText}>
                {tripDetails.description}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Delivery Requests</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{deliveryRequests.length}</Text>
          </View>
        </View>

        {deliveryRequests.length === 0 ? (
          <EmptyState
            icon={<Package size={48} color={Colors.textSecondary} />}
            title="No requests yet"
            description="Delivery requests from businesses will appear here"
          />
        ) : (
          deliveryRequests.map((request) => (
            <View key={request.id} style={styles.requestCard}>
              <View style={styles.requestHeader}>
                <View>
                  <Text style={styles.businessName}>{request.businessName}</Text>
                  <View style={styles.ratingRow}>
                    <Text style={styles.rating}>★ {request.rating}</Text>
                  </View>
                </View>
                <Text style={styles.offer}>{request.offer}</Text>
              </View>

              <View style={styles.requestDetails}>
                <View style={styles.locationDetail}>
                  <View style={styles.fromDot} />
                  <Text style={styles.locationText}>{request.from}</Text>
                </View>
                <View style={styles.locationDetail}>
                  <View style={styles.toDot} />
                  <Text style={styles.locationText}>{request.to}</Text>
                </View>
              </View>

              <View style={styles.packageInfo}>
                <Package size={16} color={Colors.textSecondary} />
                <Text style={styles.packageSize}>{request.packageSize}</Text>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.declineButton}
                  onPress={() => {}}
                >
                  <X size={20} color={Colors.error} />
                  <Text style={styles.declineButtonText}>Decline</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => router.push('/traveler/active-delivery')}
                >
                  <Check size={20} color={Colors.textLight} />
                  <Text style={styles.acceptButtonText}>Accept</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
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
});
