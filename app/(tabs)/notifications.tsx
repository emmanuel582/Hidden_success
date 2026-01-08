import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import {
  CheckCircle,
  Package,
  AlertCircle,
  Info,
} from 'lucide-react-native';
import EmptyState from '@/components/EmptyState';
import { Colors } from '@/constants/Colors';

type NotificationType = 'success' | 'info' | 'warning' | 'delivery';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export default function NotificationsScreen() {
  const notifications: Notification[] = [
    {
      id: '1',
      type: 'delivery',
      title: 'New Delivery Request',
      message: 'You have a new delivery request from Lagos to Abuja',
      time: '10 minutes ago',
      read: false,
    },
    {
      id: '2',
      type: 'success',
      title: 'Delivery Completed',
      message: 'Your delivery to Ibadan has been completed successfully',
      time: '2 hours ago',
      read: false,
    },
    {
      id: '3',
      type: 'info',
      title: 'Payment Received',
      message: '₦15,000 has been added to your wallet',
      time: '1 day ago',
      read: true,
    },
    {
      id: '4',
      type: 'warning',
      title: 'Verification Pending',
      message: 'Complete your identity verification to start receiving requests',
      time: '2 days ago',
      read: true,
    },
  ];

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={24} color={Colors.success} />;
      case 'delivery':
        return <Package size={24} color={Colors.secondary} />;
      case 'warning':
        return <AlertCircle size={24} color={Colors.warning} />;
      case 'info':
        return <Info size={24} color={Colors.primary} />;
      default:
        return <Info size={24} color={Colors.textSecondary} />;
    }
  };

  const getIconBackground = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return Colors.success + '20';
      case 'delivery':
        return Colors.secondary + '20';
      case 'warning':
        return Colors.warning + '20';
      case 'info':
        return Colors.primary + '20';
      default:
        return Colors.textSecondary + '20';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity>
          <Text style={styles.markAllRead}>Mark all as read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {notifications.length === 0 ? (
          <EmptyState
            title="No notifications"
            description="You're all caught up! Notifications will appear here"
          />
        ) : (
          notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationCard,
                !notification.read && styles.unread,
              ]}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: getIconBackground(notification.type) },
                ]}
              >
                {getIcon(notification.type)}
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>
                  {notification.title}
                </Text>
                <Text style={styles.notificationMessage}>
                  {notification.message}
                </Text>
                <Text style={styles.notificationTime}>{notification.time}</Text>
              </View>
              {!notification.read && <View style={styles.unreadDot} />}
            </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  markAllRead: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'flex-start',
    gap: 12,
  },
  unread: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
});
