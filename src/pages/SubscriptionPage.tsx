import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SubscriptionProvider } from '../context/SubscriptionContext';
import SubscriptionFlow from '../components/subscription/SubscriptionFlow';

const SubscriptionPage: React.FC = () => {
  const { t } = useTranslation();
  
  // Update document title when component mounts
  useEffect(() => {
    document.title = `${t('subscription.pageTitle')} | MatchFloor`;
    
    // Optional: Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('subscription.pageDescription'));
    }
  }, [t]);
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {t('subscription.pageHeading')}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('subscription.pageSubheading')}
          </p>
        </div>
        
        <SubscriptionProvider>
          <SubscriptionFlow />
        </SubscriptionProvider>
      </div>
    </div>
  );
};

export default SubscriptionPage; 