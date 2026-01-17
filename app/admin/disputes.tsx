import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, AlertCircle } from 'lucide-react-native';
import StatusBadge from '@/components/StatusBadge';
import { Colors } from '@/constants/Colors';

export default function AdminDisputesScreen() {
  const router = useRouter();

  const disputes = [
    {
      id: '1',
      deliveryId: 'DEL-12345',
      reporter: 'TechHub Nigeria',
      reportedUser: 'John Adebayo',
      reason: 'Package not delivered',
      description: 'The traveler claims delivery was made but no OTP was provided to us.',
      submittedAt: 'Jan 15, 2026 - 3:00 PM',
      status: 'pending' as const,
    },
    {
      id: '2',
      deliveryId: 'DEL-12346',
      reporter: 'Sarah Okonkwo',
      reportedUser: 'Fashion Forward',
      reason: 'Package damaged',
      description: 'Package was damaged during transit. Business did not pack properly.',
      submittedAt: 'Jan 14, 2026 - 11:30 AM',
      status: 'pending' as const,
    },
    {
      id: '3',
      deliveryId: 'DEL-12340',
      reporter: 'Ahmed Ibrahim',
      reportedUser: 'ElectroMart',
      reason: 'Payment issue',
      description: 'Business disputed the delivery fee after successful delivery.',
      submittedAt: 'Jan 10, 2026 - 9:15 AM',
      status: 'completed' as const,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.canGoBack() ? router.back() : router.replace('/admin/dashboard')}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Disputes</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {disputes.map((dispute) => (
          <View key={dispute.id} style={styles.disputeCard}>
            <View style={styles.cardHeader}>
              <View style={styles.disputeIcon}>
                <AlertCircle size={24} color={Colors.warning} />
              </View>
              <View style={styles.disputeInfo}>
                <Text style={styles.disputeId}>
                  Dispute #{dispute.id} - {dispute.deliveryId}
                </Text>
                <Text style={styles.disputeDate}>{dispute.submittedAt}</Text>
              </View>
              <StatusBadge status={dispute.status} />
            </View>

            <View style={styles.parties}>
              <View style={styles.party}>
                <Text style={styles.partyLabel}>Reporter:</Text>
                <Text style={styles.partyName}>{dispute.reporter}</Text>
              </View>
              <View style={styles.party}>
                <Text style={styles.partyLabel}>Reported:</Text>
                <Text style={styles.partyName}>{dispute.reportedUser}</Text>
              </View>
            </View>

            <View style={styles.reasonSection}>
              <Text style={styles.reasonLabel}>Reason:</Text>
              <Text style={styles.reasonText}>{dispute.reason}</Text>
            </View>

            <View style={styles.descriptionSection}>
              <Text style={styles.descriptionLabel}>Description:</Text>
              <Text style={styles.descriptionText}>
                {dispute.description}
              </Text>
            </View>

            {dispute.status === 'pending' && (
              <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>Investigate</Text>
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
  disputeCard: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  disputeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.warning + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disputeInfo: {
    flex: 1,
  },
  disputeId: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  disputeDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  parties: {
    flexDirection: 'row',
    gap: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  party: {
    flex: 1,
  },
  partyLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  partyName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  reasonSection: {
    marginBottom: 12,
  },
  reasonLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  reasonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.error,
  },
  descriptionSection: {
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  descriptionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textLight,
  },
});
