import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Upload, CheckCircle } from 'lucide-react-native';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { Colors } from '@/constants/Colors';

export default function CACVerificationScreen() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState('');
  const [cacNumber, setCacNumber] = useState('');

  const handleSubmit = () => {
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
        <Text style={styles.headerTitle}>Business Verification</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Verify Your Business</Text>
        <Text style={styles.subtitle}>
          Upload your CAC documents to verify your business
        </Text>

        <View style={styles.form}>
          <Input
            label="Business Name"
            placeholder="Enter registered business name"
            value={businessName}
            onChangeText={setBusinessName}
          />
          <Input
            label="CAC Registration Number"
            placeholder="Enter CAC number"
            value={cacNumber}
            onChangeText={setCacNumber}
          />

          <View style={styles.uploadSection}>
            <Text style={styles.uploadLabel}>Upload Documents</Text>

            <TouchableOpacity style={styles.uploadBox}>
              <Upload size={32} color={Colors.primary} />
              <Text style={styles.uploadTitle}>Certificate of Incorporation</Text>
              <Text style={styles.uploadHint}>Tap to upload (PDF, JPG, PNG)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.uploadBox}>
              <Upload size={32} color={Colors.primary} />
              <Text style={styles.uploadTitle}>CAC Form</Text>
              <Text style={styles.uploadHint}>Tap to upload (PDF, JPG, PNG)</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.requirementsContainer}>
            <Text style={styles.requirementsTitle}>Requirements</Text>
            <View style={styles.requirement}>
              <CheckCircle size={16} color={Colors.primary} />
              <Text style={styles.requirementText}>
                Documents must be clear and legible
              </Text>
            </View>
            <View style={styles.requirement}>
              <CheckCircle size={16} color={Colors.primary} />
              <Text style={styles.requirementText}>
                All information must match official records
              </Text>
            </View>
            <View style={styles.requirement}>
              <CheckCircle size={16} color={Colors.primary} />
              <Text style={styles.requirementText}>
                File size should not exceed 5MB
              </Text>
            </View>
          </View>

          <Button title="Submit for Verification" onPress={handleSubmit} />
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
    marginBottom: 24,
  },
  form: {
    gap: 8,
  },
  uploadSection: {
    marginTop: 16,
    marginBottom: 16,
  },
  uploadLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  uploadBox: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 12,
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 8,
  },
  uploadHint: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  requirementsContainer: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  requirementText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
