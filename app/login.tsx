import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import Input from '@/components/Input';
import Button from '@/components/Button';
import StatusMessage from '@/components/StatusMessage';
import { Colors } from '@/constants/Colors';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState<'info' | 'success' | 'error' | 'warning'>('info');
  const [showStatus, setShowStatus] = useState(false);

  const showStatusMessage = (message: string, type: 'info' | 'success' | 'error' | 'warning') => {
    setStatusMessage(message);
    setStatusType(type);
    setShowStatus(true);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showStatusMessage('Please fill in all fields to continue', 'warning');
      return;
    }

    setLoading(true);
    showStatusMessage('Verifying credentials...', 'info');

    try {
      const response = await api.post('/auth/login', { email, password });

      // Backend returns { status: 'success', data: { session, user } }
      if (response.status === 'success') {
        showStatusMessage('Welcome back! Signing you in...', 'success');

        setTimeout(() => {
          signIn(response.data.session.access_token, response.data.user);
          router.replace('/(tabs)');
        }, 1000);
      } else {
        showStatusMessage(response.message || 'Invalid credentials', 'error');
      }
    } catch (error: any) {
      console.log('Login error caught:', error.message);

      // Check for email verification error (403)
      if (error.message.includes('verify your email') ||
        error.message.includes('Please verify') ||
        error.message.includes('Email not confirmed')) {

        showStatusMessage('Email not verified. Redirecting to verification...', 'warning');

        setTimeout(() => {
          Alert.alert(
            'Email Not Verified',
            'Please verify your email before logging in. Check your inbox for the verification code.',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Verify Now',
                onPress: () => router.push({ pathname: '/otp', params: { email } })
              }
            ]
          );
        }, 1500);

        setLoading(false);
        return;
      }

      // Check for incorrect credentials
      let errorMessage = 'Something went wrong. Please try again.';

      if (error.message.includes('Invalid login credentials') ||
        error.message.includes('Incorrect') ||
        error.message.includes('Invalid') ||
        error.message.includes('credentials')) {
        errorMessage = 'Incorrect email or password';
      }
      else if (error.message.includes('network') ||
        error.message.includes('Network') ||
        error.message.includes('Failed to fetch')) {
        errorMessage = 'Network error. Check your connection';
      }
      else if (error.message) {
        errorMessage = error.message;
      }

      showStatusMessage(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.canGoBack() ? router.back() : router.replace('/')}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sign In</Text>
        <View style={styles.placeholder} />
      </View>

      <StatusMessage
        message={statusMessage}
        type={statusType}
        visible={showStatus}
        onHide={() => setShowStatus(false)}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue to MOVEVER</Text>

        <View style={styles.form}>
          <Input
            label="Email or Phone"
            placeholder="Enter your email or phone"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <Button
            title={loading ? "Verifying credentials..." : "Sign In"}
            onPress={handleLogin}
            style={styles.button}
            disabled={loading}
          />

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/signup')}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
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
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 32,
  },
  form: {
    gap: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  button: {
    marginTop: 24,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  signupText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
});
