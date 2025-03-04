import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useSubscription } from '../../context/SubscriptionContext';

const ReviewStep: React.FC = () => {
    const { t } = useTranslation();
    const {
        userInfo,
        agencyDetails,
        selectedPlan,
        prevStep,
        submitSubscription,
        isSubmitting,
    } = useSubscription();

    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!selectedPlan) {
            setError(t('subscription.errors.noPlanSelected'));
            return;
        }

        setError('');
        await submitSubscription();
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
                {t('subscription.review.title')}
            </h2>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                    {error}
                </div>
            )}

            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium text-gray-700 border-b pb-2 mb-3">
                        {t('subscription.review.personalInfo')}
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                        <p className="text-sm text-gray-500">
                            {t('subscription.basicInfo.name')}
                        </p>
                        <p className="text-sm font-medium">{userInfo.name}</p>

                        <p className="text-sm text-gray-500">
                            {t('subscription.basicInfo.email')}
                        </p>
                        <p className="text-sm font-medium">{userInfo.email}</p>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium text-gray-700 border-b pb-2 mb-3">
                        {t('subscription.review.agencyInfo')}
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                        <p className="text-sm text-gray-500">
                            {t('subscription.agencyDetails.agencyName')}
                        </p>
                        <p className="text-sm font-medium">
                            {agencyDetails.agencyName}
                        </p>

                        {agencyDetails.address && (
                            <>
                                <p className="text-sm text-gray-500">
                                    {t('subscription.agencyDetails.address')}
                                </p>
                                <p className="text-sm font-medium">
                                    {agencyDetails.address}
                                </p>
                            </>
                        )}

                        {agencyDetails.phone && (
                            <>
                                <p className="text-sm text-gray-500">
                                    {t('subscription.agencyDetails.phone')}
                                </p>
                                <p className="text-sm font-medium">
                                    {agencyDetails.phone}
                                </p>
                            </>
                        )}

                        {agencyDetails.website && (
                            <>
                                <p className="text-sm text-gray-500">
                                    {t('subscription.agencyDetails.website')}
                                </p>
                                <p className="text-sm font-medium">
                                    {agencyDetails.website}
                                </p>
                            </>
                        )}
                    </div>
                </div>

                {selectedPlan && (
                    <div>
                        <h3 className="text-lg font-medium text-gray-700 border-b pb-2 mb-3">
                            {t('subscription.review.planInfo')}
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            <p className="text-sm text-gray-500">
                                {t('subscription.review.planName')}
                            </p>
                            <p className="text-sm font-medium">
                                {selectedPlan.name}
                            </p>

                            <p className="text-sm text-gray-500">
                                {t('subscription.review.billingCycle')}
                            </p>
                            <p className="text-sm font-medium">
                                {selectedPlan.billingCycle === 'monthly'
                                    ? t('subscription.planSelection.monthly')
                                    : t('subscription.planSelection.yearly')}
                            </p>

                            <p className="text-sm text-gray-500">
                                {t('subscription.review.price')}
                            </p>
                            <p className="text-sm font-medium">
                                ${selectedPlan.price.toFixed(2)}
                                {selectedPlan.billingCycle === 'monthly'
                                    ? t('subscription.planSelection.perMonth')
                                    : t('subscription.planSelection.perYear')}
                            </p>
                        </div>

                        <div className="mt-4">
                            <p className="text-sm text-gray-500 mb-2">
                                {t('subscription.review.features')}
                            </p>
                            <ul className="space-y-1 pl-5 list-disc text-sm text-gray-600">
                                {selectedPlan.features.map((feature, index) => (
                                    <li key={index}>{feature}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                <div className="pt-4 flex justify-between">
                    <button
                        type="button"
                        onClick={prevStep}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                    >
                        {t('subscription.common.backButton')}
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className={`px-6 py-2 bg-primary text-white rounded-lg transition-colors duration-300 ${
                            isSubmitting
                                ? 'opacity-70 cursor-not-allowed'
                                : 'hover:bg-opacity-90'
                        }`}
                    >
                        {isSubmitting
                            ? t('subscription.review.processing')
                            : t('subscription.review.confirmButton')}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ReviewStep;
