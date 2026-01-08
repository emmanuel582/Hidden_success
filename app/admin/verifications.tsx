import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, User, CheckCircle, X } from 'lucide-react-native';
import StatusBadge from '@/components/StatusBadge';
import { Colors } from '@/constants/Colors';

export default function AdminVerificationsScreen() {
  const router = useRouter();

  const verifications = [
    {
      id: '1',
      name: 'Adewale Ogunbiyi',
      type: 'Identity Verification',
      method: 'Live Photo Capture',
      submittedAt: 'Jan 10, 2026 - 2:30 PM',
      status: 'pending' as const,
    },
    {
      id: '2',
      name: 'TechHub Nigeria',
      type: 'Business Verification',
      method: 'CAC Documents',
      submittedAt: 'Jan 9, 2026 - 10:15 AM',
      status: 'pending' as const,
    },
    {
      id: '3',
      name: 'Sarah Okonkwo',
      type: 'Identity Verification',
      method: 'Live Video Recording',
      submittedAt: 'Jan 8, 2026 - 3:45 PM',
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
        <Text style={styles.headerTitle}>Verification Queue</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {verifications.map((verification) => (
          <View key={verification.id} style={styles.verificationCard}>
            <View style={styles.cardHeader}>
              <View style={styles.userInfo}>
                <View style={styles.avatar}>
                  <User size={20} color={Colors.textLight} />
                </View>
                <View>
                  <Text style={styles.name}>{verification.name}</Text>
                  <Text style={styles.type}>{verification.type}</Text>
                </View>
              </View>
              <StatusBadge status={verification.status} />
            </View>

            <View style={styles.details}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Method:</Text>
                <Text style={styles.detailValue}>{verification.method}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Submitted:</Text>
                <Text style={styles.detailValue}>
                  {verification.submittedAt}
                </Text>
              </View>
            </View>

            {verification.status === 'pending' && (
              <View style={styles.actions}>
                <TouchableOpacity style={styles.approveButton}>
                  <CheckCircle size={18} color={Colors.textLight} />
                  <Text style={styles.approveButtonText}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rejectButton}>
                  <X size={18} color={Colors.error} />
                  <Text style={styles.rejectButtonText}>Reject</Text>
                </TouchableOpacity>
              </View>
            )}
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
  verificationCard: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  type: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  details: {
    gap: 8,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  approveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: Colors.primary,
  },
  approveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textLight,
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  rejectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.error,
  },
});
