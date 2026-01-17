import { useStripe } from '@stripe/stripe-react-native';

export const useStripePayment = () => {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    return { initPaymentSheet, presentPaymentSheet, isAvailable: true };
};
