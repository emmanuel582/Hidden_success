import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  ArrowDownToLine,
  TrendingUp,
  Calendar,
} from 'lucide-react-native';
import Button from '@/components/Button';
import { Colors } from '@/constants/Colors';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { useFocusEffect } from 'expo-router';

export default function WalletScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchWalletData = useCallback(async () => {
    if (!token) return;
    try {
      const res = await api.get('/users/stats');
      if (res.status === 'success') {
        setStats(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      fetchWalletData();
    }, [fetchWalletData])
  );

  const wallet = stats?.wallet || { balance: '0', pending_balance: '0', total_earned: '0' };
  const deliveriesCount = stats?.counts?.completedTrips || 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wallet</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <TrendingUp size={24} color={Colors.textLight} />
            <Text style={styles.balanceLabel}>Available Balance</Text>
          </View>
          <Text style={styles.balance}>₦{Number(wallet.balance).toLocaleString()}</Text>
          <Button
            title="Withdraw to Bank"
            onPress={() => { }}
            variant="secondary"
            style={styles.withdrawButton}
          />
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <ArrowDownToLine size={20} color={Colors.primary} />
            <Text style={[styles.statValue, { color: Colors.primary }]}>
              ₦{Number(wallet.pending_balance).toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>Incoming (Pending)</Text>
          </View>
          <View style={styles.statCard}>
            <TrendingUp size={20} color={Colors.secondary} />
            <Text style={styles.statValue}>
              ₦{Number(wallet.total_earned).toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>Total Earned</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Payment Indicator</Text>
          <Text style={styles.infoText}>
            Funds are held in escrow when a business pays. They shift from 'Incoming' to 'Available' once the delivery is confirmed by OTP.
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Deliveries Overview</Text>
        </View>

        <View style={styles.totalDeliveriesCard}>
          <Text style={styles.totalValue}>{deliveriesCount}</Text>
          <Text style={styles.totalLabel}>Completed Deliveries</Text>
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
    padding: 16,
    paddingBottom: 24,
  },
  balanceCard: {
    backgroundColor: Colors.primary,
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: Colors.textLight,
    opacity: 0.9,
  },
  balance: {
    fontSize: 40,
    fontWeight: '700',
    color: Colors.textLight,
    marginBottom: 20,
  },
  withdrawButton: {
    backgroundColor: Colors.textLight,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  infoCard: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  totalDeliveriesCard: {
    backgroundColor: Colors.surface,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 12,
  },
  totalValue: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.secondary,
  },
  totalLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});
