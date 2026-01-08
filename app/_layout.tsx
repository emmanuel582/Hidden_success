import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ModeProvider } from '@/contexts/ModeContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <ModeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="login" />
        <Stack.Screen name="otp" />
        <Stack.Screen name="verify" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="traveler" />
        <Stack.Screen name="business" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="help" />
        <Stack.Screen name="rating" />
        <Stack.Screen name="admin" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ModeProvider>
  );
}
