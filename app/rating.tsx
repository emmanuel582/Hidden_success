import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Star, X } from 'lucide-react-native';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { Colors } from '@/constants/Colors';

export default function RatingScreen() {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    router.push('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.placeholder} />
        <Text style={styles.headerTitle}>Rate Experience</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)')}>
          <X size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>JA</Text>
          </View>
          <Text style={styles.name}>John Adebayo</Text>
          <Text style={styles.subtitle}>How was your delivery experience?</Text>
        </View>

        <View style={styles.ratingContainer}>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                style={styles.starButton}
              >
                <Star
                  size={48}
                  color={star <= rating ? Colors.warning : Colors.border}
                  fill={star <= rating ? Colors.warning : 'transparent'}
                />
              </TouchableOpacity>
            ))}
          </View>
          {rating > 0 && (
            <Text style={styles.ratingText}>
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </Text>
          )}
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Tell us more (optional)</Text>
          <Input
            placeholder="Share your feedback..."
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={5}
          />

          <View style={styles.quickTags}>
            <Text style={styles.tagsLabel}>Quick feedback:</Text>
            <View style={styles.tags}>
              <TouchableOpacity style={styles.tag}>
                <Text style={styles.tagText}>Professional</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tag}>
                <Text style={styles.tagText}>On Time</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tag}>
                <Text style={styles.tagText}>Careful</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tag}>
                <Text style={styles.tagText}>Friendly</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tag}>
                <Text style={styles.tagText}>Helpful</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Button
            title="Submit Rating"
            onPress={handleSubmit}
            disabled={rating === 0}
          />

          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={styles.skipButtonText}>Skip for now</Text>
          </TouchableOpacity>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.textLight,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  ratingContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  starButton: {
    padding: 4,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  form: {
    gap: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  quickTags: {
    marginTop: 8,
  },
  tagsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tagText: {
    fontSize: 14,
    color: Colors.text,
  },
  skipButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
});
