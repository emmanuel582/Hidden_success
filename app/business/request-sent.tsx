import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { CheckCircle, Home } from 'lucide-react-native';
import Button from '@/components/Button';
import { Colors } from '@/constants/Colors';

export default function RequestSentScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <CheckCircle size={80} color={Colors.primary} />
        </View>

        <Text style={styles.title}>Request Sent!</Text>
        <Text style={styles.description}>
          Your delivery request has been sent to the traveler. You'll receive a
          notification once they respond.
        </Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>What's Next?</Text>
          <View style={styles.infoItem}>
            <View style={styles.bullet} />
            <Text style={styles.infoText}>
              The traveler will review your request
            </Text>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.bullet} />
            <Text style={styles.infoText}>
              You'll be notified of their decision within 24 hours
            </Text>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.bullet} />
            <Text style={styles.infoText}>
              Once accepted, you can track your delivery in real-time
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="View Dashboard"
            onPress={() => router.push('/(tabs)')}
          />
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/business/post-delivery')}
          >
            <Text style={styles.secondaryButtonText}>
              Create Another Request
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  infoCard: {
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 12,
    width: '100%',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.secondary,
    marginTop: 6,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  secondaryButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.secondary,
  },
});
