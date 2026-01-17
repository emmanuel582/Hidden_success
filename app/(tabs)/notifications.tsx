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
  metadata?: any;
}

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { useRouter, useFocusEffect } from 'expo-router';

export default function NotificationsScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async (isSilent = false) => {
    if (!token) return;
    if (!isSilent && !notifications.length) {
      setLoading(true);
    }
    try {
      const res = await api.get('/notifications');
      if (res.status === 'success') {
        const sorted = (res.data || []).sort((a: any, b: any) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        const mapped = sorted.map((n: any) => ({
          id: n.id,
          type: n.type || 'info',
          title: n.title,
          message: n.message,
          time: (() => {
            const d = new Date(n.created_at);
            if (isNaN(d.getTime())) return 'Just now';
            const now = new Date();
            const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 3600 * 24));

            if (diffDays === 0) {
              return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            } else if (diffDays === 1) {
              return 'Yesterday';
            } else if (diffDays < 7) {
              return d.toLocaleDateString([], { weekday: 'short' });
            } else {
              return d.toLocaleDateString([], { day: 'numeric', month: 'short' });
            }
          })(),
          read: n.is_read,
          metadata: n.metadata
        }));
        setNotifications(mapped);
      }
    } catch (e) {
      console.error(e);
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, [token, notifications.length]);

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
      const interval = setInterval(() => {
        fetchNotifications(true);
      }, 5000);
      return () => clearInterval(interval);
    }, [fetchNotifications])
  );

  const markAllAsRead = async () => {
    if (notifications.every(n => n.read)) return;

    // Optimistic update
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

    try {
      await api.patch('/notifications/read-all', {});
    } catch (e) {
      console.error('Failed to mark all as read:', e);
      // Re-fetch on error to sync state
      fetchNotifications(true);
    }
  };

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
        <TouchableOpacity onPress={markAllAsRead}>
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
              onPress={() => {
                // Navigate immediately based on metadata (don't wait for API)
                const meta = notification.metadata;
                if (meta) {
                  console.log('Notification Click Meta:', meta);

                  // Routing Logic
                  if (meta.type === 'match_requested' && meta.status === 'pending') {
                    // Traveler: New request, go to trip details to accept
                    router.push({ pathname: '/traveler/trip-details', params: { id: meta.tripId } });
                  } else if (meta.type === 'match_accepted') {
                    // Business: Traveler accepted, go to delivery detail to pay
                    router.push(`/business/delivery-detail?id=${meta.requestId}`);
                  } else if (meta.requestId && !meta.matchId) {
                    // Logic for business-originated notifications
                    router.push(`/business/delivery-detail?id=${meta.requestId}`);
                  } else if (meta.matchId) {
                    // Default for match-related (pickup, delivery, payment success)
                    router.push(`/traveler/active-delivery?matchId=${meta.matchId}`);
                  } else if (meta.tripId) {
                    router.push({ pathname: '/traveler/trip-details', params: { id: meta.tripId } });
                  }
                }

                // Mark as read in background optimistically
                if (!notification.read) {
                  setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, read: true } : n));
                  api.patch(`/notifications/${notification.id}/read`, {}).catch(e => {
                    console.error('Failed to mark as read:', e);
                    // On error, the next poll will fix the state anyway
                  });
                }
              }}
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
              {!notification.read ? <View style={styles.unreadDot} /> : null}
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
