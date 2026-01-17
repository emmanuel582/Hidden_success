import { loadStripe } from '@stripe/stripe-js';
import { Platform } from 'react-native';

const stripePromise = loadStripe('pk_test_51RTrsT09JLSq6UP9lQ41ixX9hISV7UtP1eYkRT5mRx4uyHtIydWjDtr7bGZ5ztIjRQRMypg6Izj7JLGL0SPdHGmb00djsFyQdw');

export const useStripePayment = () => {
    const initPaymentSheet = async (params: any) => {
        // We'll store the session URL if provided for web
        if (Platform.OS === 'web') {
            (window as any)._stripeCheckoutUrl = params.checkoutUrl;
            return { error: null };
        }
        return { error: { message: 'Use mobile for payment sheet' } };
    };

    const presentPaymentSheet = async () => {
        if (Platform.OS === 'web') {
            try {
                const checkoutUrl = (window as any)._stripeCheckoutUrl;
                if (!checkoutUrl) throw new Error('Checkout session not initialized');

                // Redirect to Stripe's hosted Checkout page
                window.location.href = checkoutUrl;

                return { error: null };
            } catch (e: any) {
                console.error('[Stripe Web] Unexpected error:', e);
                return { error: { message: e.message } };
            }
        }
        return { error: { message: 'Stripe Payment Sheet is not supported on web.' } };
    };

    return {
        initPaymentSheet,
        presentPaymentSheet,
        isAvailable: true
    };
};


