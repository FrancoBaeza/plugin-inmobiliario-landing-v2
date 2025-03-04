import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useSubscription } from '../../context/SubscriptionContext';
import { subscriptionService } from '../../services/subscriptionService';

const ConfirmationStep: React.FC = () => {
  const { t } = useTranslation();
  const { 
    userInfo, 
    agencyDetails, 
    selectedPlan, 
    paymentDetails,
    resetSubscription
  } = useSubscription();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleSubmit = async () => {
    if (!selectedPlan) return;
    
    setIsSubmitting(true);
    setError('');
    
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
        },
        payment: {
          // Only include masked card details for security
          cardNumber: `**** **** **** ${paymentDetails.cardNumber.slice(-4)}`,
          cardholderName: paymentDetails.cardholderName,
          expiryDate: paymentDetails.expiryDate
          // CVV is not included for security reasons
        }
      };
      
      // Submit subscription
      await subscriptionService.createSubscription(subscriptionData);
      
      // Show success message
      setIsSuccess(true);
    } catch (err) {
      console.error('Error creating subscription:', err);
      setError(t('subscription.errors.submissionFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleStartOver = () => {
    resetSubscription();
  };
  
  // Mask card number for display
  const maskedCardNumber = paymentDetails.cardNumber 
    ? `**** **** **** ${paymentDetails.cardNumber.slice(-4)}`
    : '';
  
  if (isSuccess) {
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
          {t('subscription.confirmation.successTitle')}
        </h2>
        
        <p className="text-gray-600 mb-6">
          {t('subscription.confirmation.successMessage')}
        </p>
        
        <p className="text-gray-600 mb-8">
          {t('subscription.confirmation.emailSent', { email: userInfo.email })}
        </p>
        
        <button
          onClick={handleStartOver}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors duration-300"
        >
          {t('subscription.confirmation.returnToHome')}
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
        {t('subscription.confirmation.title')}
      </h2>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-700 border-b pb-2 mb-3">
            {t('subscription.confirmation.personalInfo')}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <p className="text-sm text-gray-500">{t('subscription.basicInfo.name')}</p>
            <p className="text-sm font-medium">{userInfo.name}</p>
            
            <p className="text-sm text-gray-500">{t('subscription.basicInfo.email')}</p>
            <p className="text-sm font-medium">{userInfo.email}</p>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-700 border-b pb-2 mb-3">
            {t('subscription.confirmation.agencyInfo')}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <p className="text-sm text-gray-500">{t('subscription.agencyDetails.agencyName')}</p>
            <p className="text-sm font-medium">{agencyDetails.agencyName}</p>
            
            {agencyDetails.address && (
              <>
                <p className="text-sm text-gray-500">{t('subscription.agencyDetails.address')}</p>
                <p className="text-sm font-medium">{agencyDetails.address}</p>
              </>
            )}
            
            {agencyDetails.phone && (
              <>
                <p className="text-sm text-gray-500">{t('subscription.agencyDetails.phone')}</p>
                <p className="text-sm font-medium">{agencyDetails.phone}</p>
              </>
            )}
            
            {agencyDetails.website && (
              <>
                <p className="text-sm text-gray-500">{t('subscription.agencyDetails.website')}</p>
                <p className="text-sm font-medium">{agencyDetails.website}</p>
              </>
            )}
          </div>
        </div>
        
        {selectedPlan && (
          <div>
            <h3 className="text-lg font-medium text-gray-700 border-b pb-2 mb-3">
              {t('subscription.confirmation.planInfo')}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <p className="text-sm text-gray-500">{t('subscription.confirmation.planName')}</p>
              <p className="text-sm font-medium">{selectedPlan.name}</p>
              
              <p className="text-sm text-gray-500">{t('subscription.confirmation.billingCycle')}</p>
              <p className="text-sm font-medium">
                {selectedPlan.billingCycle === 'monthly' 
                  ? t('subscription.planSelection.monthly') 
                  : t('subscription.planSelection.yearly')}
              </p>
              
              <p className="text-sm text-gray-500">{t('subscription.confirmation.price')}</p>
              <p className="text-sm font-medium">
                ${selectedPlan.price.toFixed(2)}
                {selectedPlan.billingCycle === 'monthly' 
                  ? t('subscription.planSelection.perMonth') 
                  : t('subscription.planSelection.perYear')}
              </p>
            </div>
          </div>
        )}
        
        <div>
          <h3 className="text-lg font-medium text-gray-700 border-b pb-2 mb-3">
            {t('subscription.confirmation.paymentInfo')}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <p className="text-sm text-gray-500">{t('subscription.paymentDetails.cardNumber')}</p>
            <p className="text-sm font-medium">{maskedCardNumber}</p>
            
            <p className="text-sm text-gray-500">{t('subscription.paymentDetails.cardholderName')}</p>
            <p className="text-sm font-medium">{paymentDetails.cardholderName}</p>
            
            <p className="text-sm text-gray-500">{t('subscription.paymentDetails.expiryDate')}</p>
            <p className="text-sm font-medium">{paymentDetails.expiryDate}</p>
          </div>
        </div>
        
        <div className="pt-4 flex justify-between">
          <button
            type="button"
            onClick={handleStartOver}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300"
          >
            {t('subscription.confirmation.cancel')}
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-6 py-2 bg-primary text-white rounded-lg transition-colors duration-300 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-opacity-90'
            }`}
          >
            {isSubmitting 
              ? t('subscription.confirmation.processing') 
              : t('subscription.confirmation.confirmButton')}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ConfirmationStep; 