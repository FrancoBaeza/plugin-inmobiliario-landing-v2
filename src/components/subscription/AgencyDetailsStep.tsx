import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useSubscriptionStore } from '../../stores/useSubscriptionStore';

const AgencyDetailsStep: React.FC = () => {
  const { t } = useTranslation();
  
  // Get state and actions from Zustand store
  const agencyDetails = useSubscriptionStore(state => state.agencyDetails);
  const updateAgencyDetails = useSubscriptionStore(state => state.updateAgencyDetails);
  const nextStep = useSubscriptionStore(state => state.nextStep);
  const prevStep = useSubscriptionStore(state => state.prevStep);
  
  const [errors, setErrors] = useState({
    agencyName: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateAgencyDetails({ [name]: value });
    
    // Clear error when user types
    if (name === 'agencyName') {
      setErrors(prev => ({ ...prev, agencyName: '' }));
    }
  };
  
  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = { ...errors };
    
    // Validate agency name
    if (!agencyDetails.agencyName) {
      newErrors.agencyName = t('subscription.errors.agencyNameRequired');
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
        {t('subscription.agencyDetails.title')}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Agency Name field */}
        <div>
          <label htmlFor="agencyName" className="block text-sm font-medium text-gray-700 mb-1">
            {t('subscription.agencyDetails.agencyName')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="agencyName"
            name="agencyName"
            value={agencyDetails.agencyName}
            onChange={handleChange}
            placeholder={t('subscription.agencyDetails.agencyNamePlaceholder')}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none ${
              errors.agencyName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.agencyName && <p className="mt-1 text-sm text-red-500">{errors.agencyName}</p>}
        </div>
        
        {/* Address field */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            {t('subscription.agencyDetails.address')}
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={agencyDetails.address || ''}
            onChange={handleChange}
            placeholder={t('subscription.agencyDetails.addressPlaceholder')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>
        
        {/* Phone field */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            {t('subscription.agencyDetails.phone')}
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={agencyDetails.phone || ''}
            onChange={handleChange}
            placeholder={t('subscription.agencyDetails.phonePlaceholder')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>
        
        {/* Website field */}
        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
            {t('subscription.agencyDetails.website')}
          </label>
          <input
            type="url"
            id="website"
            name="website"
            value={agencyDetails.website || ''}
            onChange={handleChange}
            placeholder={t('subscription.agencyDetails.websitePlaceholder')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
          />
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

export default AgencyDetailsStep; 