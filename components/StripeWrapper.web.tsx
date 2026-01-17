import React from 'react';

// Stripe React Native isn't fully compatible with some web bundlers in Expo without extra config.
// This mock unblocks web bundling. 
export const StripeWrapper = ({ children }: { children: React.ReactNode; publishableKey: string }) => {
    return <>{children}</>;
};
