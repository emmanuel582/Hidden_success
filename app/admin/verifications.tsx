import { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { ArrowLeft, User, CheckCircle, X, ExternalLink } from 'lucide-react-native';
import StatusBadge from '@/components/StatusBadge';
import { Colors } from '@/constants/Colors';
import { api } from '@/services/api';

export default function AdminVerificationsScreen() {
  const router = useRouter();
  const [verifications, setVerifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  const fetchVerifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/pending');
      if (res.status === 'success') {
        setVerifications(res.data);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to fetch verifications');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchVerifications();

      const interval = setInterval(() => {
        fetchVerifications();
      }, 10000); // Poll every 10 seconds (reduced from 5)

      return () => clearInterval(interval);
    }, [fetchVerifications])
  );

  const handleApprove = async (id: string) => {
    // Optimistic update
    setProcessingIds(prev => new Set(prev).add(id));
    setVerifications(prev => prev.map(v =>
      v.id === id ? { ...v, status: 'approved' } : v
    ));

    try {
      const res = await api.patch(`/admin/${id}/approve`, {});
      if (res.status === 'success') {
        Alert.alert('Success', 'Verification Approved ✓');
        // Remove from list after short delay
        setTimeout(() => {
          setVerifications(prev => prev.filter(v => v.id !== id));
        }, 1500);
      }
    } catch (error: any) {
      // Revert optimistic update on error
      Alert.alert('Error', error.message);
      fetchVerifications();
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleReject = async (id: string) => {
    Alert.prompt('Reject Verification', 'Enter reason for rejection:', async (reason) => {
      if (!reason) return;

      // Optimistic update
      setProcessingIds(prev => new Set(prev).add(id));
      setVerifications(prev => prev.map(v =>
        v.id === id ? { ...v, status: 'rejected' } : v
      ));

      try {
        const res = await api.patch(`/admin/${id}/reject`, { reason });
        if (res.status === 'success') {
          Alert.alert('Success', 'Verification Rejected');
          // Remove from list after short delay
          setTimeout(() => {
            setVerifications(prev => prev.filter(v => v.id !== id));
          }, 1500);
        }
      } catch (error: any) {
        // Revert optimistic update on error
        Alert.alert('Error', error.message);
        fetchVerifications();
      } finally {
        setProcessingIds(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    });
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
        <Text style={styles.headerTitle}>Verification Queue</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 20 }} />
        ) : verifications.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 20, color: Colors.textSecondary }}>No pending verifications</Text>
        ) : (
          verifications.map((verification) => (
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
                    {new Date(verification.submittedAt).toLocaleString()}
                  </Text>
                </View>
                {/* Add links to view documents/videos if needed */}
                <View style={styles.docsContainer}>
                  <Text style={styles.docsTitle}>Documents:</Text>
                  {verification.details?.id_document_url && <Text style={styles.docLink}>• ID Document</Text>}
                  {verification.details?.live_video_url && <Text style={styles.docLink}>• Live Video</Text>}
                </View>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[
                    styles.approveButton,
                    processingIds.has(verification.id) && styles.buttonDisabled
                  ]}
                  onPress={() => handleApprove(verification.id)}
                  disabled={processingIds.has(verification.id)}
                >
                  <CheckCircle size={18} color={Colors.textLight} />
                  <Text style={styles.approveButtonText}>
                    {processingIds.has(verification.id) ? 'Processing...' : 'Approve'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.rejectButton,
                    processingIds.has(verification.id) && styles.buttonDisabled
                  ]}
                  onPress={() => handleReject(verification.id)}
                  disabled={processingIds.has(verification.id)}
                >
                  <X size={18} color={Colors.error} />
                  <Text style={styles.rejectButtonText}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
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
  docsContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: Colors.border,
  },
  docsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  docLink: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
