import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSubscription } from '../../context/SubscriptionContext';

// Import step components
import BasicInfoStep from './BasicInfoStep';
import AgencyDetailsStep from './AgencyDetailsStep';
import ReviewStep from './ReviewStep';
import VerificationStep from './VerificationStep';

// Progress indicator component
const ProgressIndicator: React.FC = () => {
    const { t } = useTranslation();
    const { currentStep } = useSubscription();

    const steps = [
        { id: 1, label: t('subscription.steps.basicInfo') },
        { id: 2, label: t('subscription.steps.agencyDetails') },
        { id: 3, label: t('subscription.steps.review') },
        { id: 4, label: t('subscription.steps.verification') },
    ];

    return (
        <div className="mb-8">
            <div className="flex items-center justify-center">
                {steps.map((step, index) => (
                    <React.Fragment key={step.id}>
                        {/* Step circle */}
                        <div
                            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                                currentStep >= step.id
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-200 text-gray-500'
                            }`}
                        >
                            {step.id}
                        </div>

                        {/* Step label (only show on larger screens) */}
                        <div className="hidden md:block ml-2 mr-6 text-sm font-medium text-gray-600">
                            {step.label}
                        </div>

                        {/* Connector line (except after last step) */}
                        {index < steps.length - 1 && (
                            <div
                                className={`flex-1 h-1 max-w-[50px] mx-2 ${
                                    currentStep > step.id
                                        ? 'bg-primary'
                                        : 'bg-gray-200'
                                }`}
                            />
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Mobile step label (only show on small screens) */}
            <div className="md:hidden mt-4 text-center text-sm font-medium text-gray-700">
                {steps.find((step) => step.id === currentStep)?.label}
            </div>
        </div>
    );
};

const SubscriptionFlow: React.FC = () => {
    const { currentStep, showVerification } = useSubscription();

    // Render the current step
    const renderStep = () => {
        // If verification is active, show verification step
        if (showVerification) {
            return <VerificationStep />;
        }

        // Otherwise show the current step in the flow
        switch (currentStep) {
            case 1:
                return <BasicInfoStep />;
            case 2:
                return <AgencyDetailsStep />;
            case 3:
                return <ReviewStep />;
            default:
                return <BasicInfoStep />;
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <ProgressIndicator />

            <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
        </div>
    );
};

export default SubscriptionFlow;
