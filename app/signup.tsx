import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import Input from '@/components/Input';
import Button from '@/components/Button';
import StatusMessage from '@/components/StatusMessage';
import { Colors } from '@/constants/Colors';
import { api } from '@/services/api';

export default function SignUpScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState<'info' | 'success' | 'error' | 'warning'>('info');
  const [showStatus, setShowStatus] = useState(false);

  const showStatusMessage = (message: string, type: 'info' | 'success' | 'error' | 'warning') => {
    setStatusMessage(message);
    setStatusType(type);
    setShowStatus(true);
  };

  const handleSignUp = async () => {
    // Validation
    if (!name || !email || !password || !phone) {
      showStatusMessage('Please fill in all fields to continue', 'warning');
      return;
    }

    if (password.length < 6) {
      showStatusMessage('Password must be at least 6 characters long', 'warning');
      return;
    }

    if (password !== confirmPassword) {
      showStatusMessage('Passwords do not match', 'error');
      return;
    }

    setLoading(true);
    showStatusMessage('Creating your account...', 'info');

    try {
      const response = await api.post('/auth/register', {
        full_name: name,
        email,
        phone_number: phone,
        password
      });

      if (response.status === 'success') {
        showStatusMessage('Account created! Sending verification code...', 'success');

        setTimeout(() => {
          router.push({ pathname: '/otp', params: { email } });
        }, 1500);
      } else {
        showStatusMessage(response.message || 'Unable to create account', 'error');
      }
    } catch (error: any) {
      // Provide specific error messages
      let errorMessage = 'Something went wrong. Please try again.';

      if (error.message.includes('already') || error.message.includes('exists')) {
        errorMessage = 'Account already exists. Please sign in instead.';
      } else if (error.message.includes('invalid') && error.message.includes('email')) {
        errorMessage = 'Invalid email address. Please use a valid email.';
      } else if (error.message.includes('network') || error.message.includes('Network')) {
        errorMessage = 'Network error. Check your connection';
      } else if (error.message) {
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
        <Text style={styles.headerTitle}>Create Account</Text>
        <View style={styles.placeholder} />
      </View>

      <StatusMessage
        message={statusMessage}
        type={statusType}
        visible={showStatus}
        onHide={() => setShowStatus(false)}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Join MOVEVER</Text>
        <Text style={styles.subtitle}>
          Create an account to start your journey
        </Text>

        <View style={styles.form}>
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
          />
          <Input
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <Input
            label="Phone Number"
            placeholder="Enter your phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <Input
            label="Password"
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <Button
            title={loading ? "Creating your account..." : "Create Account"}
            onPress={handleSignUp}
            style={styles.button}
            disabled={loading}
          />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.loginLink}>Sign In</Text>
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
  button: {
    marginTop: 8,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  loginText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
});
