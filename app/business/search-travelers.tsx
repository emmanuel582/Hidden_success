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
  Star,
  Filter,
  CheckCircle,
} from 'lucide-react-native';
import Button from '@/components/Button';
import { Colors } from '@/constants/Colors';

export default function SearchTravelersScreen() {
  const router = useRouter();

  const travelers = [
    {
      id: '1',
      name: 'John Adebayo',
      rating: 4.8,
      trips: 45,
      from: 'Lagos',
      to: 'Abuja',
      date: 'Jan 15, 2026',
      time: '9:00 AM',
      space: 'Medium',
      verified: true,
    },
    {
      id: '2',
      name: 'Sarah Okonkwo',
      rating: 4.9,
      trips: 62,
      from: 'Lagos',
      to: 'Abuja',
      date: 'Jan 15, 2026',
      time: '2:00 PM',
      space: 'Large',
      verified: true,
    },
    {
      id: '3',
      name: 'Ahmed Ibrahim',
      rating: 4.7,
      trips: 38,
      from: 'Lagos',
      to: 'Abuja',
      date: 'Jan 16, 2026',
      time: '8:00 AM',
      space: 'Small',
      verified: true,
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
        <Text style={styles.headerTitle}>Available Travelers</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.routeInfo}>
        <View style={styles.routeRow}>
          <MapPin size={16} color={Colors.secondary} />
          <Text style={styles.routeText}>Lagos → Abuja</Text>
        </View>
        <View style={styles.dateRow}>
          <Calendar size={14} color={Colors.textSecondary} />
          <Text style={styles.dateText}>Jan 15, 2026</Text>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.resultsText}>
          {travelers.length} travelers found
        </Text>

        {travelers.map((traveler) => (
          <View key={traveler.id} style={styles.travelerCard}>
            <View style={styles.travelerHeader}>
              <View style={styles.travelerLeft}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {traveler.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </Text>
                </View>
                <View style={styles.travelerInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.travelerName}>{traveler.name}</Text>
                    {traveler.verified && (
                      <CheckCircle size={16} color={Colors.primary} />
                    )}
                  </View>
                  <View style={styles.ratingRow}>
                    <Star
                      size={14}
                      color={Colors.warning}
                      fill={Colors.warning}
                    />
                    <Text style={styles.rating}>{traveler.rating}</Text>
                    <Text style={styles.trips}>
                      ({traveler.trips} trips)
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.tripDetails}>
              <View style={styles.tripRow}>
                <MapPin size={16} color={Colors.textSecondary} />
                <Text style={styles.tripText}>
                  {traveler.from} → {traveler.to}
                </Text>
              </View>
              <View style={styles.tripRow}>
                <Calendar size={16} color={Colors.textSecondary} />
                <Text style={styles.tripText}>
                  {traveler.date} at {traveler.time}
                </Text>
              </View>
            </View>

            <View style={styles.spaceInfo}>
              <Text style={styles.spaceLabel}>Available Space:</Text>
              <Text style={styles.spaceValue}>{traveler.space}</Text>
            </View>

            <Button
              title="Send Request"
              onPress={() => router.push('/business/request-sent')}
              variant="secondary"
            />
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
});
