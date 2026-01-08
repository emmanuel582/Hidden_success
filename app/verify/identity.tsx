import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Video, Camera, FileText } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

export default function IdentityVerificationHub() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Identity Verification</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Verify Your Identity</Text>
        <Text style={styles.subtitle}>
          Choose a verification method to continue
        </Text>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.option}
            onPress={() => router.push('/verify/video')}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#E3F2FD' }]}>
              <Video size={32} color={Colors.secondary} />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Live Video Recording</Text>
              <Text style={styles.optionDescription}>
                Record a short video for liveness check
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => router.push('/verify/photo')}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#E8F5E9' }]}>
              <Camera size={32} color={Colors.primary} />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Live Photo Capture</Text>
              <Text style={styles.optionDescription}>
                Take a selfie with your ID document
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => router.push('/verify/cac')}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#FFF3E0' }]}>
              <FileText size={32} color={Colors.warning} />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Business Verification</Text>
              <Text style={styles.optionDescription}>
                Upload CAC documents for business account
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.note}>
          Your information is securely encrypted and used only for verification
          purposes
        </Text>
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 32,
  },
  optionsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  option: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  note: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
