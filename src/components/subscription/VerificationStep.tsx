import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useSubscription } from '../../context/SubscriptionContext';
import { subscriptionService } from '../../services/subscriptionService';

const VerificationStep: React.FC = () => {
  const { t } = useTranslation();
  const { 
    userInfo, 
    selectedPlan,
    verificationCode,
    setVerificationCode,
    isVerified,
    isSubmitting,
    verifyEmail,
    resetSubscription
  } = useSubscription();
  
  const [error, setError] = useState('');
  const [isResending, setIsResending] = useState(false);
  
  const handleVerify = async () => {
    if (!verificationCode.trim()) {
      setError(t('subscription.verification.codeRequired'));
      return;
    }
    
    setError('');
    await verifyEmail();
  };
  
  const handleResendCode = async () => {
    setIsResending(true);
    setError('');
    
    try {
      await subscriptionService.sendVerificationCode(userInfo.email);
      // Show success message
      setError(t('subscription.verification.codeSent'));
    } catch (err) {
      console.error('Error resending verification code:', err);
      setError(t('subscription.errors.resendFailed'));
    } finally {
      setIsResending(false);
    }
  };
  
  if (isVerified) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md text-center"
      >
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-100 p-3">
            <svg className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-primary mb-4">
          {t('subscription.verification.successTitle')}
        </h2>
        
        <p className="text-gray-600 mb-6">
          {t('subscription.verification.successMessage')}
        </p>
        
        <p className="text-gray-600 mb-8">
          {t('subscription.verification.nextSteps')}
        </p>
        
        <button
          onClick={resetSubscription}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors duration-300"
        >
          {t('subscription.verification.returnToHome')}
        </button>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold text-primary mb-6 text-center">
        {t('subscription.verification.title')}
      </h2>
      
      <div className="mb-6 text-center">
        <p className="text-gray-600">
          {t('subscription.verification.instructions')}
        </p>
        <p className="font-medium mt-2">
          {userInfo.email}
        </p>
      </div>
      
      {selectedPlan && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-2">
            {t('subscription.verification.selectedPlan')}
          </h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-lg">{selectedPlan.name}</p>
              <p className="text-sm text-gray-500">
                {selectedPlan.billingCycle === 'monthly' 
                  ? t('subscription.planSelection.billedMonthly') 
                  : t('subscription.planSelection.billedYearly')}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg">${selectedPlan.price.toFixed(2)}</p>
              <p className="text-sm text-gray-500">
                {selectedPlan.billingCycle === 'monthly' 
                  ? t('subscription.planSelection.perMonth') 
                  : t('subscription.planSelection.perYear')}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className={`mb-6 p-4 rounded-lg ${
          error === t('subscription.verification.codeSent') 
            ? 'bg-green-50 border border-green-200 text-green-600' 
            : 'bg-red-50 border border-red-200 text-red-600'
        }`}>
          {error}
        </div>
      )}
      
      <div className="space-y-6">
        <div>
          <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-1">
            {t('subscription.verification.verificationCode')} *
          </label>
          <input
            type="text"
            id="verificationCode"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder={t('subscription.verification.codePlaceholder')}
          />
        </div>
        
        <div className="pt-4 flex flex-col space-y-3">
          <button
            onClick={handleVerify}
            disabled={isSubmitting}
            className={`w-full py-2 bg-primary text-white rounded-lg transition-colors duration-300 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-opacity-90'
            }`}
          >
            {isSubmitting 
              ? t('subscription.verification.verifying') 
              : t('subscription.verification.verifyButton')}
          </button>
          
          <button
            type="button"
            onClick={handleResendCode}
            disabled={isResending}
            className="w-full py-2 text-gray-600 hover:text-gray-800 transition-colors duration-300"
          >
            {isResending 
              ? t('subscription.verification.resending') 
              : t('subscription.verification.resendButton')}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default VerificationStep; 