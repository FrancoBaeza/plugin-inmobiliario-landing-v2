import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
    UserInfo,
    AgencyDetails,
    Plan,
    PaymentDetails,
    PeriodPlan,
    CurrencyPlan,
} from '../types/subscription';
import { subscriptionService } from '../services/subscriptionService';

// Initial state values
const initialUserInfo: UserInfo = {
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
};

const initialAgencyDetails: AgencyDetails = {
    agencyName: '',
};

const initialPaymentDetails: PaymentDetails = {
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: '',
    billingAddress: '',
};

// Define the store state type
interface SubscriptionState {
    // State
    currentStep: number;
    userInfo: UserInfo;
    agencyDetails: AgencyDetails;
    selectedPlan: Plan | null;
    paymentDetails: PaymentDetails;
    isVerified: boolean;
    verificationCode: string;
    isSubmitting: boolean;
    showVerification: boolean;
    plans: Plan[];
    plansLoading: boolean;
    plansError: string | null;

    // Actions
    updateUserInfo: (info: Partial<UserInfo>) => void;
    updateAgencyDetails: (details: Partial<AgencyDetails>) => void;
    updateSelectedPlan: (plan: Plan) => void;
    updatePaymentDetails: (details: Partial<PaymentDetails>) => void;
    setVerificationCode: (code: string) => void;
    setIsVerified: (isVerified: boolean) => void;
    nextStep: () => void;
    prevStep: () => void;
    goToStep: (step: number) => void;
    resetSubscription: () => void;
    submitSubscription: () => Promise<void>;
    verifyEmail: () => Promise<void>;
    getPlanById: (id: string) => Plan | undefined;
    fetchPlans: () => Promise<void>;
}

// Create the store with slices for better organization
export const useSubscriptionStore = create<SubscriptionState>()(
    devtools((set, get) => ({
        // State
        currentStep: 1,
        userInfo: initialUserInfo,
        agencyDetails: initialAgencyDetails,
        selectedPlan: null,
        paymentDetails: initialPaymentDetails,
        isVerified: false,
        verificationCode: '',
        isSubmitting: false,
        showVerification: false,
        plans: [],
        plansLoading: false,
        plansError: null,

        // Actions
        updateUserInfo: (info) =>
            set((state) => ({
                userInfo: { ...state.userInfo, ...info },
            })),

        updateAgencyDetails: (details) =>
            set((state) => ({
                agencyDetails: { ...state.agencyDetails, ...details },
            })),

        updateSelectedPlan: (plan) =>
        {
            set({
                selectedPlan: plan,
            });
        },

        updatePaymentDetails: (details) =>
            set((state) => ({
                paymentDetails: { ...state.paymentDetails, ...details },
            })),

        setVerificationCode: (code) =>
            set({
                verificationCode: code,
            }),

        setIsVerified: (isVerified) =>
            set({
                isVerified,
            }),

        nextStep: () =>
            set((state) => ({
                currentStep: state.currentStep + 1,
            })),

        prevStep: () =>
            set((state) => ({
                currentStep: Math.max(1, state.currentStep - 1),
            })),

        goToStep: (step) =>
            set({
                currentStep: step,
            }),

        resetSubscription: () =>
            set({
                currentStep: 1,
                userInfo: initialUserInfo,
                agencyDetails: initialAgencyDetails,
                selectedPlan: null,
                paymentDetails: initialPaymentDetails,
                isVerified: false,
                verificationCode: '',
                isSubmitting: false,
                showVerification: false,
            }),

        fetchPlans: async () => {
            set({ plansLoading: true, plansError: null });

            try {
                const response = await subscriptionService.getPlans();

                // Transform API plans to match our Plan interface if needed
                const transformedPlans: Plan[] = response.data.map(
                    (plan: {
                        id: number;
                        name: string;
                        description: string;
                        maxAPI: number;
                        price: number;
                        periodPlan: PeriodPlan;
                        currencyPlan: CurrencyPlan;
                    }) => ({
                        id: plan.id,
                        name: plan.name,
                        description: plan.description,
                        maxAPI: plan.maxAPI,
                        price: plan.price,
                        periodPlan: plan.periodPlan,
                        currencyPlan: plan.currencyPlan,
                        features: [], // API doesn't provide features, we'll use translations
                        recommended: plan.name.toLowerCase().includes('pro'), // Mark "pro" plans as recommended
                    }),
                );

                set({ plans: transformedPlans });
            } catch (error) {
                console.error('Error fetching plans:', error);
                set({
                    plansError: 'Failed to load plans. Please try again later.',
                });

                // Fallback plans in case the API fails
                set({
                    plans: [
                        {
                            id: 1,
                            name: 'Básico',
                            description: 'Ideal para pequeñas inmobiliarias',
                            maxAPI: 100,
                            price: 49,
                            periodPlan: 'monthly',
                            currencyPlan: 'eur',
                            features: [
                                'Hasta 5 agentes',
                                'Gestión de citas',
                                'Panel de control básico',
                                'Soporte por email',
                            ],
                        },
                        {
                            id: 2,
                            name: 'Profesional',
                            description:
                                'Perfecto para agencias en crecimiento',
                            maxAPI: 500,
                            price: 99,
                            periodPlan: 'monthly',
                            currencyPlan: 'eur',
                            features: [
                                'Hasta 15 agentes',
                                'Gestión de citas avanzada',
                                'Analítica detallada',
                                'Integraciones con CRM',
                                'Soporte prioritario',
                            ],
                            recommended: true,
                        },
                        {
                            id: 3,
                            name: 'Empresarial',
                            description:
                                'Solución completa para grandes inmobiliarias',
                            maxAPI: 2000,
                            price: 199,
                            periodPlan: 'monthly',
                            currencyPlan: 'eur',
                            features: [
                                'Agentes ilimitados',
                                'Funciones personalizadas',
                                'API completa',
                                'Gestor de cuenta dedicado',
                                'Soporte 24/7',
                                'Implementación guiada',
                            ],
                        },
                    ],
                });
            } finally {
                set({ plansLoading: false });
            }
        },

        submitSubscription: async () => {
            const { selectedPlan, userInfo } = get();

            if (!selectedPlan) return;

            set({ isSubmitting: true });

            try {
                // Prepare subscription data
                const subscriptionData = {
                    email: userInfo.email,
                    password: userInfo.password,
                    passwordConfirmation: userInfo.passwordConfirmation,
                    name: userInfo.name,
                    planId: selectedPlan.id
                };

                console.log("subscriptionData: ", subscriptionData);

                // Submit subscription
                await subscriptionService.createSubscription(subscriptionData);

                // Show verification input
                set({ showVerification: true });
            } catch (err) {
                console.error('Error creating subscription:', err);
            } finally {
                set({ isSubmitting: false });
            }
        },

        verifyEmail: async () => {
            const { verificationCode, userInfo } = get();

            if (!verificationCode) return;

            set({ isSubmitting: true });

            try {
                const response = await subscriptionService.verifyEmail(
                    userInfo.email,
                    verificationCode,
                );

                if (response.success) {
                    set({ isVerified: true });
                }
            } catch (err) {
                console.error('Error verifying email:', err);
            } finally {
                set({ isSubmitting: false });
            }
        },

        getPlanById: (id) => {
            const { plans } = get();
            return plans.find((plan) => plan.id === Number(id));
        },
    })),
);

// Export a helper function to get all plans
export const usePlans = () => useSubscriptionStore((state) => state.plans);
