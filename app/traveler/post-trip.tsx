import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Package, ShieldAlert } from 'lucide-react-native';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { Colors } from '@/constants/Colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import OpenStreetMapAutocomplete from '@/components/OsmAutocomplete';

import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';

export default function PostTripScreen() {
  const router = useRouter();
  const { token, user } = useAuth();

  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [selectedSpace, setSelectedSpace] = useState<string>('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  if (user && !user.is_verified) {
    return (
      <View style={[styles.container, { padding: 20, justifyContent: 'center', alignItems: 'center' }]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)')}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>
        <ShieldAlert size={64} color={Colors.error} style={{ marginBottom: 20 }} />
        <Text style={[styles.title, { textAlign: 'center', marginBottom: 10 }]}>Verification Required</Text>
        <Text style={[styles.subtitle, { textAlign: 'center', marginBottom: 30 }]}>
          To ensure safety, you must verify your identity before posting trips.
        </Text>
        <Button
          title="Verify Identity"
          onPress={() => router.push('/verify/identity')}
        />
      </View>
    );
  }

  const spaceOptions = [
    { id: 'small', label: 'Small', description: 'Up to 5kg' },
    { id: 'medium', label: 'Medium', description: 'Up to 15kg' },
    { id: 'large', label: 'Large', description: 'Up to 30kg' },
  ];

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const newDate = new Date(date);
      newDate.setFullYear(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      );
      setDate(newDate);
    }
  };

  const onTimeChange = (event: any, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate) {
      const newDate = new Date(date);
      newDate.setHours(selectedDate.getHours(), selectedDate.getMinutes());
      setDate(newDate);
    }
  };

  const handlePostTrip = async () => {
    if (!fromLocation || !toLocation || !selectedSpace) {
      Alert.alert('Error', 'Please fill in required fields (From, To, Space)');
      return;
    }

    setLoading(true);
    try {
      // Format date as YYYY-MM-DD
      const departure_date = date.toISOString().split('T')[0];
      // Format time as HH:MM:00
      const departure_time = date.toTimeString().split(' ')[0];

      const res = await api.post('/trips', {
        origin: fromLocation,
        destination: toLocation,
        departure_date,
        departure_time,
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
          onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)')}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post a Trip</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
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
                {/* FROM Location Autocomplete */}
                <View style={[styles.autocompleteContainer, { zIndex: 100 }]}>
                  <OpenStreetMapAutocomplete
                    placeholder="From (City)"
                    value={fromLocation}
                    onSelect={(item) => setFromLocation(item.display_name)}
                    onChangeText={setFromLocation}
                  />
                </View>

                {/* TO Location Autocomplete */}
                <View style={[styles.autocompleteContainer, { zIndex: 90 }]}>
                  <OpenStreetMapAutocomplete
                    placeholder="To (City)"
                    value={toLocation}
                    onSelect={(item) => setToLocation(item.display_name)}
                    onChangeText={setToLocation}
                  />
                </View>
              </View>
            </View>

            {/* Date and Time Pickers */}
            <View style={styles.dateTimeRow}>
              <TouchableOpacity
                style={styles.dateTimeInputContainer}
                onPress={() => setShowDatePicker(true)}
              >
                <Input
                  placeholder="Date"
                  value={date.toLocaleDateString()}
                  editable={Platform.OS === 'web'}
                  style={styles.dateTimeInput}
                  onPressIn={() => setShowDatePicker(true)}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dateTimeInputContainer}
                onPress={() => setShowTimePicker(true)}
              >
                <Input
                  placeholder="Time"
                  value={date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  editable={Platform.OS === 'web'}
                  style={styles.dateTimeInput}
                  onPressIn={() => setShowTimePicker(true)}
                />
              </TouchableOpacity>
            </View>

            {(showDatePicker || showTimePicker) && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={showDatePicker ? 'date' : 'time'}
                is24Hour={true}
                display="default"
                onChange={showDatePicker ? onDateChange : onTimeChange}
              />
            )}

            <View style={[styles.section, { zIndex: -1 }]}>
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
      </KeyboardAvoidingView>
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
    zIndex: 10,
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
    zIndex: 100, // Highest zIndex for location inputs
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
  autocompleteContainer: {
    flex: 1,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 12,
    zIndex: -1,
  },
  dateTimeInputContainer: {
    flex: 1,
  },
  dateTimeInput: {
    marginBottom: 0,
  },
  section: {
    marginTop: 8,
    zIndex: -1,
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
