export interface UserInfo {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface AgencyDetails {
  agencyName: string;
  address?: string;
  phone?: string;
  website?: string;
}

export type PeriodPlan = 'monthly' | 'annually';
export type CurrencyPlan = 'eur' | 'usd';

export interface Plan {
  id: number;
  name: string;
  description: string;
  maxAPI: number;
  price: number;
  periodPlan: PeriodPlan;
  currencyPlan: CurrencyPlan;
  features?: string[];
  recommended?: boolean;
}

export interface PaymentDetails {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cvv: string;
  billingAddress: string;
}

export interface SubscriptionState {
  currentStep: number;
  userInfo: UserInfo;
  agencyDetails: AgencyDetails;
  selectedPlan: Plan | null;
  paymentDetails: PaymentDetails;
  isVerified: boolean;
  verificationCode: string;
  isSubmitting: boolean;
  showVerification: boolean;
}

export interface SubscriptionContextType {
  currentStep: number;
  userInfo: UserInfo;
  agencyDetails: AgencyDetails;
  selectedPlan: Plan | null;
  paymentDetails: PaymentDetails;
  isVerified: boolean;
  verificationCode: string;
  isSubmitting: boolean;
  showVerification: boolean;
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
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  userId?: string;
  verificationToken?: string;
}

export interface VerificationData {
  email: string;
  code: string;
}

export interface VerificationResponse {
  checkoutUrl: string;
}

export enum PasswordStrength {
  WEAK = 'weak',
  MEDIUM = 'medium',
  STRONG = 'strong'
}

export interface SubscriptionData {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  planId: string;
  agencyName: string;
  address?: string;
  phone?: string;
  website?: string;
} 