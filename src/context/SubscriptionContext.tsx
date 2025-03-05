import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  UserInfo, 
  AgencyDetails, 
  Plan, 
  PaymentDetails,
  SubscriptionContextType 
} from '../types/subscription';
import { subscriptionService } from '../services/subscriptionService';

// Mock data for plans - in a real app, this would come from an API
const PLANS: Plan[] = [
  {
    id: 'basic',
    name: 'Básico',
    price: 49,
    billingCycle: 'monthly',
    features: [
      'Hasta 5 agentes',
      'Gestión de citas',
      'Panel de control básico',
      'Soporte por email'
    ]
  },
  {
    id: 'pro',
    name: 'Profesional',
    price: 99,
    billingCycle: 'monthly',
    features: [
      'Hasta 15 agentes',
      'Gestión de citas avanzada',
      'Analítica detallada',
      'Integraciones con CRM',
      'Soporte prioritario'
    ],
    recommended: true
  },
  {
    id: 'enterprise',
    name: 'Empresarial',
    price: 199,
    billingCycle: 'monthly',
    features: [
      'Agentes ilimitados',
      'Funciones personalizadas',
      'API completa',
      'Gestor de cuenta dedicado',
      'Soporte 24/7',
      'Implementación guiada'
    ]
  }
];

const initialUserInfo: UserInfo = {
  name: '',
  email: '',
  password: '',
  passwordConfirmation: ''
};

const initialAgencyDetails: AgencyDetails = {
  agencyName: ''
};

const initialPaymentDetails: PaymentDetails = {
  cardNumber: '',
  cardholderName: '',
  expiryDate: '',
  cvv: '',
  billingAddress: ''
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [userInfo, setUserInfo] = useState<UserInfo>(initialUserInfo);
  const [agencyDetails, setAgencyDetails] = useState<AgencyDetails>(initialAgencyDetails);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>(initialPaymentDetails);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVerification, setShowVerification] = useState(false);

  // Get plan ID from URL query parameter
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const planId = queryParams.get('plan');
    
    console.log('Plan ID from URL:', planId);
    
    if (planId) {
      const plan = PLANS.find(p => p.id === planId);
      console.log('Found plan:', plan);
      if (plan) {
        setSelectedPlan(plan);
      } else {
        console.error('Plan not found for ID:', planId);
      }
    }
  }, [location.search]);

  // Log when selected plan changes
  useEffect(() => {
    console.log('Selected plan updated:', selectedPlan);
  }, [selectedPlan]);

  const updateUserInfo = (info: Partial<UserInfo>) => {
    setUserInfo(prev => ({ ...prev, ...info }));
  };

  const updateAgencyDetails = (details: Partial<AgencyDetails>) => {
    setAgencyDetails(prev => ({ ...prev, ...details }));
  };

  const updateSelectedPlan = (plan: Plan) => {
    setSelectedPlan(plan);
  };

  const updatePaymentDetails = (details: Partial<PaymentDetails>) => {
    setPaymentDetails(prev => ({ ...prev, ...details }));
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const resetSubscription = () => {
    setCurrentStep(1);
    setUserInfo(initialUserInfo);
    setAgencyDetails(initialAgencyDetails);
    setSelectedPlan(null);
    setPaymentDetails(initialPaymentDetails);
    setIsVerified(false);
    setVerificationCode('');
    setShowVerification(false);
  };

  const submitSubscription = async () => {
    if (!selectedPlan) return;
    
    setIsSubmitting(true);
    
    try {
      // Prepare subscription data
      const subscriptionData = {
        userInfo: {
          name: userInfo.name,
          email: userInfo.email
          // Password is not included for security reasons
        },
        agencyDetails,
        plan: {
          id: selectedPlan.id,
          name: selectedPlan.name,
          price: selectedPlan.price,
          billingCycle: selectedPlan.billingCycle
        }
      };
      
      // Submit subscription
      await subscriptionService.createSubscription(subscriptionData);
      
      // Send verification code
      await subscriptionService.sendVerificationCode(userInfo.email);
      
      // Show verification input
      setShowVerification(true);
    } catch (err) {
      console.error('Error creating subscription:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyEmail = async () => {
    if (!verificationCode) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await subscriptionService.verifyEmail(userInfo.email, verificationCode);
      
      if (response.success) {
        setIsVerified(true);
      }
    } catch (err) {
      console.error('Error verifying email:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const value: SubscriptionContextType = {
    currentStep,
    userInfo,
    agencyDetails,
    selectedPlan,
    paymentDetails,
    isVerified,
    verificationCode,
    isSubmitting,
    showVerification,
    updateUserInfo,
    updateAgencyDetails,
    updateSelectedPlan,
    updatePaymentDetails,
    setVerificationCode,
    setIsVerified,
    nextStep,
    prevStep,
    goToStep,
    resetSubscription,
    submitSubscription,
    verifyEmail
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}; 