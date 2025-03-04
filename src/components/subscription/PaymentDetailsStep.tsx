import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useSubscription } from '../../context/SubscriptionContext';

const PaymentDetailsStep: React.FC = () => {
  const { t } = useTranslation();
  const { 
    paymentDetails, 
    updatePaymentDetails, 
    selectedPlan,
    nextStep, 
    prevStep 
  } = useSubscription();
  
  const [errors, setErrors] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: '',
    billingAddress: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updatePaymentDetails({ [name]: value });
    
    // Clear error when user types
    if (name in errors) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Format card number with spaces
  const formatCardNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (value.length > 16) {
      value = value.substr(0, 16);
    }
    
    // Add space after every 4 digits
    const formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
    updatePaymentDetails({ cardNumber: formattedValue });
    
    // Clear error
    setErrors(prev => ({ ...prev, cardNumber: '' }));
  };
  
  // Format expiry date as MM/YY
  const formatExpiryDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (value.length > 4) {
      value = value.substr(0, 4);
    }
    
    // Format as MM/YY
    if (value.length > 2) {
      value = value.substr(0, 2) + '/' + value.substr(2);
    }
    
    updatePaymentDetails({ expiryDate: value });
    
    // Clear error
    setErrors(prev => ({ ...prev, expiryDate: '' }));
  };
  
  // Limit CVV to 3 or 4 digits
  const formatCVV = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (value.length > 4) {
      value = value.substr(0, 4);
    }
    
    updatePaymentDetails({ cvv: value });
    
    // Clear error
    setErrors(prev => ({ ...prev, cvv: '' }));
  };
  
  const validateForm = (): boolean => {
    const newErrors = {
      cardNumber: '',
      cardholderName: '',
      expiryDate: '',
      cvv: '',
      billingAddress: ''
    };
    
    let isValid = true;
    
    // Card number validation (should be 16 digits without spaces)
    const cardNumberDigits = paymentDetails.cardNumber.replace(/\s+/g, '');
    if (!cardNumberDigits) {
      newErrors.cardNumber = t('subscription.errors.cardNumberRequired');
      isValid = false;
    } else if (cardNumberDigits.length !== 16) {
      newErrors.cardNumber = t('subscription.errors.invalidCardNumber');
      isValid = false;
    }
    
    // Cardholder name validation
    if (!paymentDetails.cardholderName.trim()) {
      newErrors.cardholderName = t('subscription.errors.cardholderNameRequired');
      isValid = false;
    }
    
    // Expiry date validation (should be in MM/YY format)
    if (!paymentDetails.expiryDate) {
      newErrors.expiryDate = t('subscription.errors.expiryDateRequired');
      isValid = false;
    } else {
      const [month, year] = paymentDetails.expiryDate.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits of year
      const currentMonth = currentDate.getMonth() + 1; // January is 0
      
      if (!month || !year || month.length !== 2 || year.length !== 2) {
        newErrors.expiryDate = t('subscription.errors.invalidExpiryFormat');
        isValid = false;
      } else {
        const monthNum = parseInt(month, 10);
        const yearNum = parseInt(year, 10);
        
        if (monthNum < 1 || monthNum > 12) {
          newErrors.expiryDate = t('subscription.errors.invalidMonth');
          isValid = false;
        } else if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
          newErrors.expiryDate = t('subscription.errors.cardExpired');
          isValid = false;
        }
      }
    }
    
    // CVV validation (should be 3 or 4 digits)
    if (!paymentDetails.cvv) {
      newErrors.cvv = t('subscription.errors.cvvRequired');
      isValid = false;
    } else if (paymentDetails.cvv.length < 3) {
      newErrors.cvv = t('subscription.errors.invalidCvv');
      isValid = false;
    }
    
    // Billing address validation
    if (!paymentDetails.billingAddress.trim()) {
      newErrors.billingAddress = t('subscription.errors.billingAddressRequired');
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      nextStep();
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold text-primary mb-6 text-center">
        {t('subscription.paymentDetails.title')}
      </h2>
      
      {selectedPlan && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-2">
            {t('subscription.paymentDetails.selectedPlan')}
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
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
            {t('subscription.paymentDetails.cardNumber')} *
          </label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={paymentDetails.cardNumber}
            onChange={formatCardNumber}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none ${
              errors.cardNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="1234 5678 9012 3456"
            maxLength={19} // 16 digits + 3 spaces
          />
          {errors.cardNumber && (
            <p className="mt-1 text-sm text-red-500">{errors.cardNumber}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-1">
            {t('subscription.paymentDetails.cardholderName')} *
          </label>
          <input
            type="text"
            id="cardholderName"
            name="cardholderName"
            value={paymentDetails.cardholderName}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none ${
              errors.cardholderName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={t('subscription.paymentDetails.cardholderNamePlaceholder')}
          />
          {errors.cardholderName && (
            <p className="mt-1 text-sm text-red-500">{errors.cardholderName}</p>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
              {t('subscription.paymentDetails.expiryDate')} *
            </label>
            <input
              type="text"
              id="expiryDate"
              name="expiryDate"
              value={paymentDetails.expiryDate}
              onChange={formatExpiryDate}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none ${
                errors.expiryDate ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="MM/YY"
              maxLength={5} // MM/YY format
            />
            {errors.expiryDate && (
              <p className="mt-1 text-sm text-red-500">{errors.expiryDate}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
              {t('subscription.paymentDetails.cvv')} *
            </label>
            <input
              type="text"
              id="cvv"
              name="cvv"
              value={paymentDetails.cvv}
              onChange={formatCVV}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none ${
                errors.cvv ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="123"
              maxLength={4}
            />
            {errors.cvv && (
              <p className="mt-1 text-sm text-red-500">{errors.cvv}</p>
            )}
          </div>
        </div>
        
        <div>
          <label htmlFor="billingAddress" className="block text-sm font-medium text-gray-700 mb-1">
            {t('subscription.paymentDetails.billingAddress')} *
          </label>
          <textarea
            id="billingAddress"
            name="billingAddress"
            value={paymentDetails.billingAddress}
            onChange={handleChange}
            rows={3}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none ${
              errors.billingAddress ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={t('subscription.paymentDetails.billingAddressPlaceholder')}
          />
          {errors.billingAddress && (
            <p className="mt-1 text-sm text-red-500">{errors.billingAddress}</p>
          )}
        </div>
        
        <div className="pt-4 flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300"
          >
            {t('subscription.common.backButton')}
          </button>
          
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors duration-300"
          >
            {t('subscription.common.nextButton')}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default PaymentDetailsStep; 