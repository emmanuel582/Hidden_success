import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Truck } from 'lucide-react-native';
import Button from '@/components/Button';
import { Colors } from '@/constants/Colors';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRootNavigationState } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    if (isAuthenticated && rootNavigationState?.key) {
      const timeout = setTimeout(() => {
        try {
          router.replace('/(tabs)');
        } catch (e) {
          console.warn('Navigation attempt failed:', e);
        }
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [isAuthenticated, router, rootNavigationState?.key]);

  if (isAuthenticated && !rootNavigationState?.key) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.primary }}>
        <ActivityIndicator color="#ffffff" size="large" />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={[Colors.primary, Colors.secondary]}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Truck size={80} color={Colors.textLight} strokeWidth={1.5} />
          <Text style={styles.logo}>MOVEVER</Text>
          <Text style={styles.tagline}>
            Connecting Travelers & Businesses
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Get Started"
            onPress={() => router.push('/signup')}
            variant="outline"
            style={styles.button}
          />
          <Button
            title="Sign In"
            onPress={() => router.push('/login')}
            style={[styles.button, styles.signInButton]}
          />
        </View>

        <Text style={styles.footer}>
          Affordable deliveries powered by travelers
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: 80,
    paddingBottom: 48,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  logo: {
    fontSize: 48,
    fontWeight: '700',
    color: Colors.textLight,
    marginTop: 24,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 16,
    color: Colors.textLight,
    marginTop: 8,
    opacity: 0.9,
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    width: '100%',
  },
  signInButton: {
    backgroundColor: Colors.surface,
  },
  footer: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
    opacity: 0.8,
  },
});
