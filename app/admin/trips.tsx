import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, MapPin, Calendar, Package } from 'lucide-react-native';
import StatusBadge from '@/components/StatusBadge';
import { Colors } from '@/constants/Colors';

export default function AdminTripsScreen() {
  const router = useRouter();

  const trips = [
    {
      id: '1',
      traveler: 'Chinedu Okafor',
      from: 'Lagos',
      to: 'Abuja',
      date: 'Jan 15, 2026',
      requests: 3,
      status: 'active' as const,
    },
    {
      id: '2',
      traveler: 'Sarah Okonkwo',
      from: 'Port Harcourt',
      to: 'Enugu',
      date: 'Jan 20, 2026',
      requests: 1,
      status: 'pending' as const,
    },
    {
      id: '3',
      traveler: 'Ahmed Ibrahim',
      from: 'Kano',
      to: 'Lagos',
      date: 'Jan 8, 2026',
      requests: 2,
      status: 'completed' as const,
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
        <Text style={styles.headerTitle}>Trips Management</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {trips.map((trip) => (
          <View key={trip.id} style={styles.tripCard}>
            <View style={styles.tripHeader}>
              <View>
                <Text style={styles.tripId}>Trip #{trip.id}</Text>
                <Text style={styles.traveler}>{trip.traveler}</Text>
              </View>
              <StatusBadge status={trip.status} />
            </View>

            <View style={styles.routeInfo}>
              <MapPin size={16} color={Colors.primary} />
              <Text style={styles.route}>
                {trip.from} → {trip.to}
              </Text>
            </View>

            <View style={styles.tripDetails}>
              <View style={styles.detailItem}>
                <Calendar size={16} color={Colors.textSecondary} />
                <Text style={styles.detailText}>{trip.date}</Text>
              </View>
              <View style={styles.detailItem}>
                <Package size={16} color={Colors.textSecondary} />
                <Text style={styles.detailText}>
                  {trip.requests} request{trip.requests !== 1 ? 's' : ''}
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.viewButton}>
              <Text style={styles.viewButtonText}>View Details</Text>
            </TouchableOpacity>
          </View>
        ))}
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
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tripId: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  traveler: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  routeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  route: {
    fontSize: 16,
    color: Colors.text,
  },
  tripDetails: {
    flexDirection: 'row',
    gap: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
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
  viewButton: {
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textLight,
  },
});
