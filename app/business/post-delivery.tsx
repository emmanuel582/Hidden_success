import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, MapPin, Calendar, Package, Info } from 'lucide-react-native';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { Colors } from '@/constants/Colors';

export default function PostDeliveryScreen() {
  const router = useRouter();
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [description, setDescription] = useState('');

  const sizeOptions = [
    { id: 'small', label: 'Small', description: 'Up to 5kg', price: '₦5,000' },
    { id: 'medium', label: 'Medium', description: 'Up to 15kg', price: '₦10,000' },
    { id: 'large', label: 'Large', description: 'Up to 30kg', price: '₦18,000' },
  ];

  const handlePostDelivery = () => {
    router.push('/business/search-travelers');
  };

  const estimatedCost = sizeOptions.find((opt) => opt.id === selectedSize)
    ?.price || '₦0';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post Delivery Request</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Send a Package</Text>
        <Text style={styles.subtitle}>
          Find travelers going your way and save on delivery costs
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
            <Text style={styles.sectionTitle}>Package Size</Text>
            <View style={styles.sizeOptions}>
              {sizeOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.sizeOption,
                    selectedSize === option.id && styles.sizeOptionSelected,
                  ]}
                  onPress={() => setSelectedSize(option.id)}
                >
                  <Package
                    size={24}
                    color={
                      selectedSize === option.id
                        ? Colors.secondary
                        : Colors.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.sizeLabel,
                      selectedSize === option.id && styles.sizeLabelSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  <Text style={styles.sizeDescription}>
                    {option.description}
                  </Text>
                  <Text
                    style={[
                      styles.sizePrice,
                      selectedSize === option.id && styles.sizePriceSelected,
                    ]}
                  >
                    {option.price}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Input
            placeholder="Item description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />

          {selectedSize && (
            <View style={styles.costCard}>
              <View style={styles.costRow}>
                <Text style={styles.costLabel}>Estimated Cost</Text>
                <Text style={styles.costValue}>{estimatedCost}</Text>
              </View>
              <View style={styles.infoRow}>
                <Info size={14} color={Colors.secondary} />
                <Text style={styles.infoText}>
                  Final cost may vary based on traveler and route
                </Text>
              </View>
            </View>
          )}

          <Button title="Find Travelers" onPress={handlePostDelivery} />
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
    backgroundColor: Colors.secondary,
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
    backgroundColor: Colors.primary,
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
  sizeOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  sizeOption: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  sizeOptionSelected: {
    borderColor: Colors.secondary,
    backgroundColor: Colors.secondary + '10',
  },
  sizeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 8,
  },
  sizeLabelSelected: {
    color: Colors.secondary,
  },
  sizeDescription: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  sizePrice: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 4,
  },
  sizePriceSelected: {
    color: Colors.secondary,
  },
  costCard: {
    backgroundColor: Colors.secondary + '10',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.secondary + '30',
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  costLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  costValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.secondary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
