import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/contexts/AuthContext';
import { ModeProvider } from '@/contexts/ModeContext';
import { StripeWrapper } from '@/components/StripeWrapper';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <StripeWrapper
      publishableKey="pk_test_51RTrsT09JLSq6UP9lQ41ixX9hISV7UtP1eYkRT5mRx4uyHtIydWjDtr7bGZ5ztIjRQRMypg6Izj7JLGL0SPdHGmb00djsFyQdw"
    >
      <AuthProvider>
        <ModeProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="signup" />
            <Stack.Screen name="login" />
            <Stack.Screen name="otp" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="settings" />
            <Stack.Screen name="help" />
            <Stack.Screen name="rating" />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </ModeProvider>
      </AuthProvider>
    </StripeWrapper>
  );
}
