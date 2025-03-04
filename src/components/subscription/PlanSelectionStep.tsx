import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useSubscription } from '../../context/SubscriptionContext';
import { Plan } from '../../types/subscription';

// Mock data for plans - in a real app, this would come from an API
const PLANS: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 29.99,
    billingCycle: 'monthly',
    features: [
      'Up to 50 property listings',
      'Basic analytics',
      'Email support',
      'Standard lead capture forms'
    ]
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 59.99,
    billingCycle: 'monthly',
    features: [
      'Up to 200 property listings',
      'Advanced analytics',
      'Priority email & phone support',
      'Custom lead capture forms',
      'Social media integration'
    ],
    recommended: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99.99,
    billingCycle: 'monthly',
    features: [
      'Unlimited property listings',
      'Premium analytics with market insights',
      '24/7 dedicated support',
      'Advanced CRM integration',
      'Custom branding',
      'API access'
    ]
  }
];

const PlanSelectionStep: React.FC = () => {
  const { t } = useTranslation();
  const { selectedPlan, updateSelectedPlan, nextStep, prevStep } = useSubscription();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  
  // Set default selected plan if none is selected
  useEffect(() => {
    if (!selectedPlan) {
      // Default to the recommended plan or the first one
      const defaultPlan = PLANS.find(plan => plan.recommended) || PLANS[0];
      updateSelectedPlan(defaultPlan);
    }
  }, [selectedPlan, updateSelectedPlan]);
  
  const handlePlanSelect = (plan: Plan) => {
    updateSelectedPlan({
      ...plan,
      billingCycle
    });
  };
  
  const handleBillingCycleChange = (cycle: 'monthly' | 'yearly') => {
    setBillingCycle(cycle);
    if (selectedPlan) {
      updateSelectedPlan({
        ...selectedPlan,
        billingCycle: cycle,
        // Apply discount for yearly billing
        price: cycle === 'yearly' 
          ? PLANS.find(p => p.id === selectedPlan.id)!.price * 10 * 0.8 // 20% discount
          : PLANS.find(p => p.id === selectedPlan.id)!.price
      });
    }
  };
  
  const calculateYearlyPrice = (monthlyPrice: number) => {
    return (monthlyPrice * 10 * 0.8).toFixed(2); // 20% discount for yearly
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold text-primary mb-6 text-center">
        {t('subscription.planSelection.title')}
      </h2>
      
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 p-1 rounded-full flex items-center">
          <button
            onClick={() => handleBillingCycleChange('monthly')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
              billingCycle === 'monthly'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t('subscription.planSelection.monthly')}
          </button>
          <button
            onClick={() => handleBillingCycleChange('yearly')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
              billingCycle === 'yearly'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t('subscription.planSelection.yearly')}
            <span className="ml-1 text-xs font-bold text-green-500">
              {t('subscription.planSelection.savePercent', { percent: '20%' })}
            </span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`border rounded-lg p-6 transition-all duration-300 ${
              selectedPlan?.id === plan.id
                ? 'border-primary ring-2 ring-primary ring-opacity-50 transform scale-[1.02]'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
            } ${plan.recommended ? 'relative' : ''}`}
          >
            {plan.recommended && (
              <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                {t('subscription.planSelection.recommended')}
              </div>
            )}
            
            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
            <div className="mb-4">
              <span className="text-3xl font-bold">
                ${billingCycle === 'monthly' ? plan.price : calculateYearlyPrice(plan.price)}
              </span>
              <span className="text-gray-500 text-sm">
                /{billingCycle === 'monthly' ? t('subscription.planSelection.month') : t('subscription.planSelection.year')}
              </span>
            </div>
            
            <ul className="mb-6 space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            
            <button
              onClick={() => handlePlanSelect(plan)}
              className={`w-full py-2 rounded-lg transition-colors duration-200 ${
                selectedPlan?.id === plan.id
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {selectedPlan?.id === plan.id
                ? t('subscription.planSelection.selected')
                : t('subscription.planSelection.selectPlan')}
            </button>
          </div>
        ))}
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
          onClick={nextStep}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors duration-300"
        >
          {t('subscription.common.nextButton')}
        </button>
      </div>
    </motion.div>
  );
};

export default PlanSelectionStep; 