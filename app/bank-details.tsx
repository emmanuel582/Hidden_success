import { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { ArrowLeft, Check, Landmark, CreditCard, User } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

export default function BankDetailsScreen() {
    const router = useRouter();
    const { user, checkVerificationStatus } = useAuth();
    const [loading, setLoading] = useState(false);
    const [bankName, setBankName] = useState('');
    const [accountName, setAccountName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');

    useEffect(() => {
        if (user) {
            setBankName(user.bank_name || '');
            setAccountName(user.account_name || '');
            setAccountNumber(user.account_number || '');
        }
    }, [user]);

    const handleSave = async () => {
        if (!bankName.trim() || !accountNumber.trim() || !accountName.trim()) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/users/update-bank', {
                bank_name: bankName,
                account_name: accountName,
                account_number: accountNumber
            });

            if (res.status === 'success') {
                Alert.alert('Success', 'Bank details updated successfully');
                await checkVerificationStatus(); // Refresh user data
                router.back();
            } else {
                Alert.alert('Error', res.message || 'Failed to update details');
            }
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to update details');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Bank Details</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.infoCard}>
                    <Landmark size={32} color={Colors.primary} />
                    <Text style={styles.infoTitle}>Payout Information</Text>
                    <Text style={styles.infoText}>
                        Please provide your bank details to receive payments from your trips.
                    </Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Bank Name</Text>
                        <View style={styles.inputContainer}>
                            <Landmark size={20} color={Colors.textSecondary} />
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Guarantee Trust Bank"
                                value={bankName}
                                onChangeText={setBankName}
                                placeholderTextColor={Colors.textLight + '80'}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Account Name</Text>
                        <View style={styles.inputContainer}>
                            <User size={20} color={Colors.textSecondary} />
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. John Doe"
                                value={accountName}
                                onChangeText={setAccountName}
                                placeholderTextColor={Colors.textLight + '80'}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Account Number</Text>
                        <View style={styles.inputContainer}>
                            <CreditCard size={20} color={Colors.textSecondary} />
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. 0123456789"
                                value={accountNumber}
                                onChangeText={setAccountNumber}
                                keyboardType="numeric"
                                placeholderTextColor={Colors.textLight + '80'}
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleSave}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={Colors.textLight} />
                        ) : (
                            <>
                                <Check size={20} color={Colors.textLight} />
                                <Text style={styles.saveButtonText}>Save Details</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
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
    content: {
        padding: 20,
    },
    infoCard: {
        backgroundColor: Colors.surface,
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 32,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text,
        marginTop: 12,
        marginBottom: 8,
    },
    infoText: {
        textAlign: 'center',
        color: Colors.textSecondary,
        lineHeight: 22,
    },
    form: {
        gap: 20,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text,
        marginLeft: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 56,
        gap: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: Colors.text,
        height: '100%',
    },
    saveButton: {
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        gap: 8,
        marginTop: 12,
    },
    saveButtonText: {
        color: Colors.textLight,
        fontSize: 16,
        fontWeight: '600',
    },
});
