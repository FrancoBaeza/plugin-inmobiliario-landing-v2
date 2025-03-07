import { apiClient } from './apiClient';

interface SubscriptionPayload {
    // userInfo: {
    //     name: string;
    //     email: string;
    // };
    // agencyDetails: {
    //     agencyName: string;
    //     address?: string;
    //     phone?: string;
    //     website?: string;
    // };
    // plan: {
    //     id: string;
    //     name: string;
    //     price: number;
    //     billingCycle: string;
    // };
    email: string;
    password: string;
    passwordConfirmation: string;
    name: string;
    planId: number;
}

export const subscriptionService = {
    /**
     * Create a new subscription/ Registers a new agency
     * @param data Subscription data
     * @returns Promise with the created subscription
     */
    createSubscription: async (data: SubscriptionPayload) => {
        try {
            const response = await apiClient.post('/agencies/register', data);
            return response.data;
        } catch (error) {
            console.error('Error creating subscription:', error);
            throw error;
        }
    },

    /**
     * Verify a user's email with a verification code
     * @param email User's email
     * @param code Verification code
     * @returns Promise with verification result
     */
    verifyEmail: async (email: string, code: string) => {
        try {
            const response = await apiClient.post('/verify-email', {
                email,
                code,
            });
            return response.data;
        } catch (error) {
            console.error('Error verifying email:', error);
            throw error;
        }
    },

    /**
     * Get available subscription plans
     * @returns Promise with plans data
     */
    getPlans: async () => {
        try {
            const response = await apiClient.get('/plans/public');
            return response.data;
        } catch (error) {
            console.error('Error fetching subscription plans:', error);
            throw error;
        }
    },
};
