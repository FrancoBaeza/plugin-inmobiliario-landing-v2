import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSubscriptionStore } from '../stores/useSubscriptionStore';
import SubscriptionFlow from '../components/subscription/SubscriptionFlow';

const SubscriptionPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const selectedPlan = useSubscriptionStore(state => state.selectedPlan);
  const fetchPlans = useSubscriptionStore(state => state.fetchPlans);
  const plansLoading = useSubscriptionStore(state => state.plansLoading);
  const plansError = useSubscriptionStore(state => state.plansError);

  console.log("selectedPlan: ", selectedPlan);
  console.log("plansLoading: ", plansLoading);
  
  // Redirect to homepage pricing section if no plan is selected
  useEffect(() => {
    if (!selectedPlan && !plansLoading) {
      // Add a small delay to ensure the store has loaded
      const redirectTimer = setTimeout(() => {
        navigate('/#pricing', { replace: true });
      }, 300);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [selectedPlan, plansLoading, navigate]);
  
  //TODO: aniize this
  // Reset subscription data when component mounts
  // useEffect(() => {
  //   // Only clear localStorage data, don't reset the subscription store
  //   // This ensures the selected plan is preserved
  //   const keysToRemove = [
  //     'subscription-storage',
  //     'zustand-subscription-storage'
  //   ];
    
  //   keysToRemove.forEach(key => {
  //     if (localStorage.getItem(key)) {
  //       localStorage.removeItem(key);
  //     }
  //   });
  // }, []);
  
  // Update document title when component mounts
  useEffect(() => {
    document.title = `${t('subscription.pageTitle')} | MatchFloor`;
    
    // Optional: Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('subscription.pageDescription'));
    }
  }, [t]);
  
  // Fetch plans when component mounts
  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);
  
  // If no plan is selected and we're still loading, show loading state
  if (!selectedPlan && plansLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // If no plan is selected and we're not loading, we'll redirect (handled in useEffect)
  if (!selectedPlan && !plansLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex flex-col items-center justify-center">
        <p className="text-lg text-gray-600 mb-4">{t('subscription.errors.noPlanSelected')}</p>
        <p className="text-gray-500">{t('subscription.redirecting')}</p>
      </div>
    );
  }
  
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
        
        {plansError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
            <p>{plansError}</p>
          </div>
        )}
        
        {plansLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <SubscriptionFlow />
        )}
      </div>
    </div>
  );
};

export default SubscriptionPage; 