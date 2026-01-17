import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Camera, CheckCircle } from 'lucide-react-native';
import Button from '@/components/Button';
import { Colors } from '@/constants/Colors';

export default function PhotoCaptureScreen() {
  const router = useRouter();

  const handleCapture = () => {
    router.push('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.canGoBack() ? router.back() : router.replace('/settings')}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Photo Verification</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.cameraPlaceholder}>
          <Camera size={64} color={Colors.textSecondary} />
          <Text style={styles.cameraText}>Camera View</Text>
        </View>

        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Instructions</Text>
          <View style={styles.instruction}>
            <CheckCircle size={20} color={Colors.primary} />
            <Text style={styles.instructionText}>
              Hold your ID document next to your face
            </Text>
          </View>
          <View style={styles.instruction}>
            <CheckCircle size={20} color={Colors.primary} />
            <Text style={styles.instructionText}>
              Ensure both your face and ID are clearly visible
            </Text>
          </View>
          <View style={styles.instruction}>
            <CheckCircle size={20} color={Colors.primary} />
            <Text style={styles.instructionText}>
              Make sure the photo on your ID matches your face
            </Text>
          </View>
          <View style={styles.instruction}>
            <CheckCircle size={20} color={Colors.primary} />
            <Text style={styles.instructionText}>
              Avoid glare on the ID document
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Capture Photo" onPress={handleCapture} />
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
    padding: 24,
  },
  cameraPlaceholder: {
    aspectRatio: 3 / 4,
    backgroundColor: Colors.text,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  cameraText: {
    fontSize: 16,
    color: Colors.textLight,
    marginTop: 16,
    opacity: 0.7,
  },
  instructionsContainer: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  instruction: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 8,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  buttonContainer: {
    marginTop: 'auto',
  },
});
