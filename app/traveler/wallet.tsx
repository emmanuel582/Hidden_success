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

export default function WalletScreen() {
  const router = useRouter();

  const transactions = [
    {
      id: '1',
      type: 'credit' as const,
      description: 'Delivery fee - Lagos to Abuja',
      amount: '₦15,000',
      date: 'Jan 15, 2026',
      status: 'completed',
    },
    {
      id: '2',
      type: 'debit' as const,
      description: 'Withdrawal to bank account',
      amount: '₦30,000',
      date: 'Jan 12, 2026',
      status: 'completed',
    },
    {
      id: '3',
      type: 'credit' as const,
      description: 'Delivery fee - Port Harcourt to Enugu',
      amount: '₦8,500',
      date: 'Jan 10, 2026',
      status: 'completed',
    },
    {
      id: '4',
      type: 'credit' as const,
      description: 'Delivery fee - Kano to Lagos',
      amount: '₦22,000',
      date: 'Jan 8, 2026',
      status: 'completed',
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
          <Text style={styles.balance}>₦45,000</Text>
          <Button
            title="Withdraw to Bank"
            onPress={() => {}}
            style={styles.withdrawButton}
          />
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <ArrowDownToLine size={20} color={Colors.primary} />
            <Text style={styles.statValue}>₦120,500</Text>
            <Text style={styles.statLabel}>Total Earned</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Deliveries</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Transaction History</Text>
        </View>

        {transactions.map((transaction) => (
          <View key={transaction.id} style={styles.transactionCard}>
            <View style={styles.transactionLeft}>
              <View
                style={[
                  styles.transactionIcon,
                  {
                    backgroundColor:
                      transaction.type === 'credit'
                        ? Colors.primary + '20'
                        : Colors.error + '20',
                  },
                ]}
              >
                <ArrowDownToLine
                  size={20}
                  color={
                    transaction.type === 'credit'
                      ? Colors.primary
                      : Colors.error
                  }
                  style={{
                    transform: [
                      {
                        rotate:
                          transaction.type === 'credit' ? '180deg' : '0deg',
                      },
                    ],
                  }}
                />
              </View>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionDescription}>
                  {transaction.description}
                </Text>
                <View style={styles.transactionMeta}>
                  <Calendar size={12} color={Colors.textSecondary} />
                  <Text style={styles.transactionDate}>{transaction.date}</Text>
                </View>
              </View>
            </View>
            <Text
              style={[
                styles.transactionAmount,
                {
                  color:
                    transaction.type === 'credit'
                      ? Colors.primary
                      : Colors.error,
                },
              ]}
            >
              {transaction.type === 'credit' ? '+' : '-'}
              {transaction.amount}
            </Text>
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
});
