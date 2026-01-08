import { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors } from '@/constants/Colors';

interface StatusMessageProps {
    message: string;
    type: 'info' | 'success' | 'error' | 'warning';
    visible: boolean;
    onHide?: () => void;
}

export default function StatusMessage({ message, type, visible, onHide }: StatusMessageProps) {
    const opacity = new Animated.Value(0);

    useEffect(() => {
        if (visible) {
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.delay(3000),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                if (onHide) onHide();
            });
        }
    }, [visible, message]);

    if (!visible) return null;

    const getBackgroundColor = () => {
        switch (type) {
            case 'success':
                return Colors.success || '#4CAF50';
            case 'error':
                return Colors.error || '#F44336';
            case 'warning':
                return Colors.warning || '#FF9800';
            default:
                return Colors.primary;
        }
    };

    return (
        <Animated.View
            style={[
                styles.container,
                { backgroundColor: getBackgroundColor(), opacity },
            ]}
        >
            <Text style={styles.message}>{message}</Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 60,
        left: 20,
        right: 20,
        padding: 16,
        borderRadius: 12,
        zIndex: 1000,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    message: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
});
