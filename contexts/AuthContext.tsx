import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/services/api';

interface AuthContextType {
    user: any | null;
    token: string | null;
    isAuthenticated: boolean;
    signIn: (token: string, userData: any) => void;
    signOut: () => void;
    checkVerificationStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    isAuthenticated: false,
    signIn: () => { },
    signOut: () => { },
    checkVerificationStatus: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        // In a real app, load from SecureStore/AsyncStorage here
    }, []);

    const signIn = (newToken: string, userData: any) => {
        setToken(newToken);
        setUser(userData);
        api.setToken(newToken);
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
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
