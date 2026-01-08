import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, MapPin, Calendar, Package } from 'lucide-react-native';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { Colors } from '@/constants/Colors';

import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { Alert } from 'react-native';

export default function PostTripScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [selectedSpace, setSelectedSpace] = useState<string>('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const spaceOptions = [
    { id: 'small', label: 'Small', description: 'Up to 5kg' },
    { id: 'medium', label: 'Medium', description: 'Up to 15kg' },
    { id: 'large', label: 'Large', description: 'Up to 30kg' },
  ];

  const handlePostTrip = async () => {
    if (!fromLocation || !toLocation || !date || !selectedSpace) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/trips', {
        origin: fromLocation,
        destination: toLocation,
        departure_date: date,
        departure_time: time,
        available_space: selectedSpace,
        description: description,
      });

      if (res.status === 'success') {
        Alert.alert('Success', 'Trip posted successfully!');
        router.replace('/(tabs)');
      } else {
        Alert.alert('Error', res.message || 'Failed to post trip');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post a Trip</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Share Your Journey</Text>
        <Text style={styles.subtitle}>
          Post your travel details and earn from deliveries
        </Text>

        <View style={styles.form}>
          <View style={styles.locationSection}>
            <View style={styles.locationIndicator}>
              <View style={styles.fromDot} />
              <View style={styles.locationLine} />
              <View style={styles.toDot} />
            </View>
            <View style={styles.locationInputs}>
              <Input
                placeholder="From (City)"
                value={fromLocation}
                onChangeText={setFromLocation}
                style={styles.locationInput}
              />
              <Input
                placeholder="To (City)"
                value={toLocation}
                onChangeText={setToLocation}
                style={styles.locationInput}
              />
            </View>
          </View>

          <View style={styles.dateTimeRow}>
            <Input
              placeholder="Date"
              value={date}
              onChangeText={setDate}
              style={styles.dateTimeInput}
            />
            <Input
              placeholder="Time"
              value={time}
              onChangeText={setTime}
              style={styles.dateTimeInput}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available Space</Text>
            <View style={styles.spaceOptions}>
              {spaceOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.spaceOption,
                    selectedSpace === option.id && styles.spaceOptionSelected,
                  ]}
                  onPress={() => setSelectedSpace(option.id)}
                >
                  <Package
                    size={24}
                    color={
                      selectedSpace === option.id
                        ? Colors.primary
                        : Colors.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.spaceLabel,
                      selectedSpace === option.id && styles.spaceLabelSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  <Text style={styles.spaceDescription}>
                    {option.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Input
            placeholder="Trip description (optional)"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />

          <View style={styles.noteCard}>
            <Text style={styles.noteTitle}>Note:</Text>
            <Text style={styles.noteText}>
              By posting this trip, you agree to accept delivery requests from
              verified businesses along your route.
            </Text>
          </View>

          <Button title="Post Trip" onPress={handlePostTrip} loading={loading} />
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
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  form: {
    gap: 16,
  },
  locationSection: {
    flexDirection: 'row',
    gap: 12,
  },
  locationIndicator: {
    alignItems: 'center',
    paddingTop: 20,
  },
  fromDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  locationLine: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
  toDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.secondary,
  },
  locationInputs: {
    flex: 1,
    gap: 16,
  },
  locationInput: {
    marginBottom: 0,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateTimeInput: {
    flex: 1,
    marginBottom: 0,
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  spaceOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  spaceOption: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  spaceOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  spaceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 8,
  },
  spaceLabelSelected: {
    color: Colors.primary,
  },
  spaceDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  noteCard: {
    backgroundColor: Colors.primary + '10',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  noteText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
