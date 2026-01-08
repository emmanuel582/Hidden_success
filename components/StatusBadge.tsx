import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

type Status = 'pending' | 'active' | 'completed' | 'declined';

interface StatusBadgeProps {
  status: Status;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return Colors.statusPending;
      case 'active':
        return Colors.statusActive;
      case 'completed':
        return Colors.statusCompleted;
      case 'declined':
        return Colors.statusDeclined;
      default:
        return Colors.textSecondary;
    }
  };

  const getStatusText = () => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <View style={[styles.badge, { backgroundColor: getStatusColor() + '20' }]}>
      <Text style={[styles.text, { color: getStatusColor() }]}>
        {getStatusText()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
