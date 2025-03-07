import { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';
import { useSubscriptionStore, usePlans } from '../stores/useSubscriptionStore';
import { Plan } from '../types/subscription';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
    const { t, i18n } = useTranslation();
    const sectionRef = useRef<HTMLDivElement>(null);
    const isVisible = useAnimateOnScroll(sectionRef);
    const [isAnnual, setIsAnnual] = useState(false);
    const navigate = useNavigate();
    
    // Get plans and loading state from Zustand store
    const plans = usePlans();
    const plansLoading = useSubscriptionStore(state => state.plansLoading);
    const plansError = useSubscriptionStore(state => state.plansError);
    const fetchPlans = useSubscriptionStore(state => state.fetchPlans);
    const updateSelectedPlan = useSubscriptionStore(state => state.updateSelectedPlan);
    
    // Fetch plans when component mounts
    useEffect(() => {
        fetchPlans();
    }, [fetchPlans]);

    const formatCurrency = (amount: number, currency: string = 'EUR') => {
        return new Intl.NumberFormat(
            i18n.language === 'es' ? 'es-ES' : 'en-US',
            {
                style: 'currency',
                currency: currency.toUpperCase(),
                minimumFractionDigits: 0,
            },
        ).format(amount);
    };

    const calculateSavings = (plan: Plan) => {
        // For annual plans, assume 20% discount
        const monthlyCost = plan.price * 12;
        const annualCost = monthlyCost * 0.8;
        const savings = ((monthlyCost - annualCost) / monthlyCost) * 100;
        return Math.round(savings);
    };

    // Handle plan selection
    const handleSelectPlan = (plan: Plan) => {
        // Update the selected plan in the store
        updateSelectedPlan(plan);
        
        // Use react router to navigate to the subscription page
        navigate('/subscribe');
    };

    // Filter plans based on selected billing cycle
    const filteredPlans = plans.filter(plan => 
        isAnnual ? plan.periodPlan === 'annually' : plan.periodPlan === 'monthly'
    );

    // If no plans match the selected period, show all plans
    const displayPlans = filteredPlans.length > 0 ? filteredPlans : plans;

    return (
        <section
            id="pricing"
            className="bg-background py-16 md:py-24"
            ref={sectionRef}
        >
            <div className="container-section">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={
                        isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                    }
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="section-title">{t('pricing.title')}</h2>
                    <p className="max-w-3xl mx-auto text-lg text-gray-600">
                        {t('pricing.description')}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={
                        isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                    }
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="flex justify-center mb-12"
                >
                    <div className="bg-white rounded-full p-1 inline-flex shadow-sm">
                        <button
                            onClick={() => setIsAnnual(false)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                                !isAnnual
                                    ? 'bg-primary text-white'
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            {t('pricing.monthly')}
                        </button>
                        <button
                            onClick={() => setIsAnnual(true)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                                isAnnual
                                    ? 'bg-primary text-white'
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            {t('pricing.annual')}
                        </button>
                    </div>
                </motion.div>

                {plansLoading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-gray-600">Cargando planes...</p>
                    </div>
                ) : plansError ? (
                    <div className="text-center py-12 text-red-500">
                        <p>{plansError}</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                        {displayPlans.map((plan: Plan, index: number) => (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={
                                    isVisible
                                        ? { opacity: 1, y: 0 }
                                        : { opacity: 0, y: 20 }
                                }
                                transition={{
                                    duration: 0.5,
                                    delay: 0.2 + index * 0.1,
                                }}
                                className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
                                    plan.recommended
                                        ? 'ring-2 ring-secondary'
                                        : ''
                                }`}
                            >
                                {plan.recommended && (
                                    <div className="bg-secondary text-primary text-center py-2 font-semibold text-sm">
                                        Más popular
                                    </div>
                                )}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                                        {plan.name}
                                    </h3>
                                    <p className="text-gray-600 mb-6 h-12">
                                        {plan.description || t(`pricing.plans.${plan.id}.description`)}
                                    </p>
                                    <div className="mb-6">
                                        <div className="text-3xl font-bold text-primary">
                                            {formatCurrency(
                                                plan.price,
                                                plan.currencyPlan
                                            )}
                                            <span className="text-sm font-normal text-gray-500">
                                                /
                                                {plan.periodPlan === 'monthly' 
                                                    ? t('pricing.monthly').toLowerCase() 
                                                    : t('pricing.annual').toLowerCase()}
                                            </span>
                                        </div>
                                        {plan.periodPlan === 'annually' && (
                                            <div className="text-sm text-gray-500 mt-1">
                                                <span className="text-green-500 font-medium">
                                                    ({t('pricing.save')}{' '}
                                                    {calculateSavings(plan)}%)
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mb-6">
                                        <div className="text-sm font-medium text-gray-700 mb-2">
                                            {t('pricing.features')}:
                                        </div>
                                        <ul className="space-y-2">
                                            {plan.features && plan.features.length > 0 ? (
                                                plan.features.map(
                                                    (feature: string, idx: number) => (
                                                        <li
                                                            key={idx}
                                                            className="flex items-start"
                                                        >
                                                            <svg
                                                                className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M5 13l4 4L19 7"
                                                                />
                                                            </svg>
                                                            <span className="text-gray-600">
                                                                {feature}
                                                            </span>
                                                        </li>
                                                    )
                                                )
                                            ) : (
                                                // If no features provided, show default features from translations
                                                <>
                                                    <li className="flex items-start">
                                                        <svg
                                                            className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M5 13l4 4L19 7"
                                                            />
                                                        </svg>
                                                        <span className="text-gray-600">
                                                            {t(`pricing.plans.${plan.id}.feature1`, {defaultValue: `${plan.maxAPI} API calls per month`})}
                                                        </span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <svg
                                                            className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M5 13l4 4L19 7"
                                                            />
                                                        </svg>
                                                        <span className="text-gray-600">
                                                            {t(`pricing.plans.${plan.id}.feature2`, {defaultValue: 'Email support'})}
                                                        </span>
                                                    </li>
                                                </>
                                            )}
                                        </ul>
                                    </div>
                                    <button
                                        onClick={() => handleSelectPlan(plan)}
                                        className={`w-full block text-center py-3 px-4 rounded-lg font-medium transition-colors ${
                                            plan.recommended
                                                ? 'bg-secondary text-primary hover:bg-secondary/90'
                                                : 'bg-primary text-white hover:bg-primary/90'
                                        }`}
                                    >
                                        {t('pricing.cta')}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Pricing;
