import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useSubscriptionStore } from '../../stores/useSubscriptionStore';
import { 
  checkPasswordStrength, 
  getPasswordStrengthColor, 
  getPasswordStrengthText,
  validateEmail,
  validatePasswordMatch
} from '../../utils/passwordUtils';
import { PasswordStrength } from '../../types/subscription';

const BasicInfoStep: React.FC = () => {
  const { t } = useTranslation();
  
  // Get state and actions from Zustand store
  const userInfo = useSubscriptionStore(state => state.userInfo);
  const updateUserInfo = useSubscriptionStore(state => state.updateUserInfo);
  const nextStep = useSubscriptionStore(state => state.nextStep);
  
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirmation: ''
  });
  
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>(PasswordStrength.WEAK);
  const [showPassword, setShowPassword] = useState(false);
  
  // Update password strength when password changes
  useEffect(() => {
    if (userInfo.password) {
      setPasswordStrength(checkPasswordStrength(userInfo.password));
    }
  }, [userInfo.password]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateUserInfo({ [name]: value });
    
    // Clear error when user types
    setErrors(prev => ({ ...prev, [name]: '' }));
  };
  
  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = { ...errors };
    
    // Validate name
    if (!userInfo.name) {
      newErrors.name = t('subscription.errors.nameRequired');
      isValid = false;
    }
    
    // Validate email
    if (!userInfo.email) {
      newErrors.email = t('subscription.errors.emailRequired');
      isValid = false;
    } else if (!validateEmail(userInfo.email)) {
      newErrors.email = t('subscription.errors.invalidEmail');
      isValid = false;
    }
    
    // Validate password
    if (!userInfo.password) {
      newErrors.password = t('subscription.errors.passwordRequired');
      isValid = false;
    } else if (userInfo.password.length < 8) {
      newErrors.password = t('subscription.errors.passwordTooShort');
      isValid = false;
    }
    
    // Validate password confirmation
    if (!validatePasswordMatch(userInfo.password, userInfo.passwordConfirmation)) {
      newErrors.passwordConfirmation = t('subscription.errors.passwordsDontMatch');
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
  
  const strengthColor = getPasswordStrengthColor(passwordStrength);
  const strengthText = getPasswordStrengthText(passwordStrength);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold text-primary mb-6 text-center">
        {t('subscription.basicInfo.title')}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            {t('subscription.basicInfo.fullName')} *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={userInfo.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={t('subscription.basicInfo.fullNamePlaceholder')}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            {t('subscription.basicInfo.email')} *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={userInfo.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={t('subscription.basicInfo.emailPlaceholder')}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            {t('subscription.basicInfo.password')} *
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={userInfo.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={t('subscription.basicInfo.passwordPlaceholder')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 password-toggle-button"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
          )}
          
          {userInfo.password && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">{t('subscription.basicInfo.passwordStrength')}</span>
                <span className="text-xs font-medium">{t(`subscription.basicInfo.strength.${strengthText.toLowerCase()}`)}</span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${strengthColor} transition-all duration-300`} 
                  style={{ 
                    width: passwordStrength === PasswordStrength.WEAK 
                      ? '33%' 
                      : passwordStrength === PasswordStrength.MEDIUM 
                        ? '66%' 
                        : '100%' 
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>
        
        <div>
          <label htmlFor="passwordConfirmation" className="block text-sm font-medium text-gray-700 mb-1">
            {t('subscription.basicInfo.confirmPassword')} *
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="passwordConfirmation"
              name="passwordConfirmation"
              value={userInfo.passwordConfirmation}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none ${
                errors.passwordConfirmation ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={t('subscription.basicInfo.confirmPasswordPlaceholder')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 password-toggle-button"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          {errors.passwordConfirmation && (
            <p className="mt-1 text-sm text-red-500">{errors.passwordConfirmation}</p>
          )}
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors duration-300"
          >
            {t('subscription.basicInfo.nextButton')}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default BasicInfoStep; 