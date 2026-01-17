import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { api } from '@/services/api';
import { usePushNotifications } from '@/hooks/usePushNotifications';

interface AuthContextType {
    user: any | null;
    token: string | null;
    isAuthenticated: boolean;
    signIn: (token: string, userData: any) => void;
    signOut: () => void;
    checkVerificationStatus: () => Promise<void>;
    initialCheckDone: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    isAuthenticated: false,
    signIn: () => { },
    signOut: () => { },
    checkVerificationStatus: async () => { },
    initialCheckDone: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { registerForPushNotificationsAsync, sendTokenToBackend } = usePushNotifications();

    // Initialize synchronously to avoid flash
    const [token, setToken] = useState<string | null>(() => {
        if (Platform.OS === 'web') {
            try {
                const stored = localStorage.getItem('auth_token');
                if (stored) {
                    api.setToken(stored); // Ensure API is ready immediately
                    return stored;
                }
            } catch (e) {
                console.error('Failed to access localStorage', e);
            }
        }
        return null;
    });

    const [user, setUser] = useState<any | null>(() => {
        if (Platform.OS === 'web') {
            try {
                const stored = localStorage.getItem('auth_user');
                return stored ? JSON.parse(stored) : null;
            } catch (e) {
                return null;
            }
        }
        return null;
    });
    const [initialCheckDone, setInitialCheckDone] = useState(false);

    useEffect(() => {
        if (token) {
            // Register and sync push token
            registerForPushNotificationsAsync().then(pushToken => {
                if (pushToken) {
                    console.log('Got Push Token:', pushToken);
                    sendTokenToBackend(pushToken);
                }
            });

            if (!initialCheckDone) {
                checkVerificationStatus().then(() => setInitialCheckDone(true));
            }
        }
    }, [token]);

    const signIn = (newToken: string, userData: any) => {
        setToken(newToken);
        setUser(userData);
        api.setToken(newToken);

        // Save to storage
        if (Platform.OS === 'web') {
            localStorage.setItem('auth_token', newToken);
            localStorage.setItem('auth_user', JSON.stringify(userData));
        }

        console.log('User signed in:', userData.email);
    };

    const checkVerificationStatus = async () => {
        if (!token) return;
        try {
            // Fetch latest user data from backend
            const res = await api.get('/auth/me');
            if (res.status === 'success' && res.data) {
                // Fetch verification record to get actual status
                let verificationStatus = null;
                if (res.data.id) {
                    try {
                        const verifyRes = await api.get(`/verification/status/${res.data.id}`);
                        if (verifyRes.status === 'success' && verifyRes.data) {
                            verificationStatus = verifyRes.data.status; // 'pending', 'approved', 'rejected', or null
                        }
                    } catch (e) {
                        // No verification record exists yet
                        verificationStatus = null;
                    }
                }

                // Update user state with latest data including is_verified flag
                setUser((prevUser: any) => ({
                    ...prevUser,
                    ...res.data,
                    // Ensure these critical fields are updated
                    is_verified: res.data.is_verified,
                    verification_status: verificationStatus
                }));
                console.log('[Auth] Verification status updated:', {
                    is_verified: res.data.is_verified,
                    verification_status: verificationStatus
                });
            }
        } catch (e: any) {
            console.log('[Auth] Status check failed:', e.message);
            // Don't clear user on failed status check, just log it
        }
    };

    const signOut = () => {
        setToken(null);
        setUser(null);
        api.setToken(null);
        if (Platform.OS === 'web') {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
        }
    };


    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!token,
                signIn,
                signOut,
                checkVerificationStatus,
                initialCheckDone,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
