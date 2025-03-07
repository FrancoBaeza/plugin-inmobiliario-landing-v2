import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useSubscriptionStore } from '../../stores/useSubscriptionStore';
import { verifyEmail, resendVerificationCode } from '../../services/api';

const VerificationStep: React.FC = () => {
    const { t } = useTranslation();

    // Get state and actions from Zustand store
    const userInfo = useSubscriptionStore((state) => state.userInfo);
    const selectedPlan = useSubscriptionStore((state) => state.selectedPlan);
    const verificationCode = useSubscriptionStore(
        (state) => state.verificationCode,
    );
    const setVerificationCode = useSubscriptionStore(
        (state) => state.setVerificationCode,
    );
    const isVerified = useSubscriptionStore((state) => state.isVerified);
    const isSubmitting = useSubscriptionStore((state) => state.isSubmitting);
    const setIsVerified = useSubscriptionStore((state) => state.setIsVerified);

    const [error, setError] = useState('');
    const [isResending, setIsResending] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);

    // Format currency based on the selected plan's currency
    const formatCurrency = (amount: number, currency: string = 'EUR') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    const handleVerify = async () => {
        if (!verificationCode) {
            setError(t('subscription.verification.codeRequired'));
            return;
        }

        setError('');

        try {
            const response = await verifyEmail({
                email: userInfo.email,
                code: verificationCode,
            });

            if (response.status === 'success') {
                setIsVerified(true);

                // TODO: here store the checkoutUrl, then

            } else {
                setError(
                    'message' in response.data 
                        ? response.data.message 
                        : t('subscription.errors.verificationFailed')
                );
            }
        } catch (err) {
            console.error('Error verifying email:', err);
            setError(t('subscription.errors.verificationFailed'));
        }
    };

    const handleResendCode = async () => {
        setIsResending(true);
        setResendSuccess(false);
        setError('');

        try {
            const response = await resendVerificationCode(userInfo.email);

            if (response.status === 'success') {
                setResendSuccess(true);
            } else {
                setError(
                    response.data.message || t('subscription.errors.resendFailed'),
                );
            }
        } catch (err) {
            console.error('Error resending verification code:', err);
            setError(t('subscription.errors.resendFailed'));
        } finally {
            setIsResending(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVerificationCode(e.target.value);
        setError('');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md"
        >
            {isVerified ? (
                // Success state
                <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-8 h-8 text-green-500"
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
                    </div>

                    <h2 className="text-2xl font-bold text-primary mb-4">
                        {t('subscription.verification.successTitle')}
                    </h2>

                    <p className="text-gray-600 mb-6">
                        {t('subscription.verification.successMessage')}
                    </p>

                    <p className="text-gray-600 mb-8">
                        {t('subscription.verification.nextSteps')}
                    </p>

                    <a
                        href="/"
                        className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors duration-300"
                    >
                        {t('subscription.verification.returnToHome')}
                    </a>
                </div>
            ) : (
                // Verification form
                <>
                    <h2 className="text-2xl font-bold text-primary mb-6 text-center">
                        {t('subscription.verification.title')}
                    </h2>

                    <p className="text-gray-600 mb-2">
                        {t('subscription.verification.instructions')}
                    </p>

                    <p className="font-medium text-gray-800 mb-6">
                        {userInfo.email}
                    </p>

                    {selectedPlan && (
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-700 mb-2">
                                {t('subscription.verification.selectedPlan')}
                            </p>
                            <p className="text-lg font-bold text-primary">
                                {selectedPlan.name} -{' '}
                                {formatCurrency(
                                    selectedPlan.price,
                                    selectedPlan.currencyPlan,
                                )}
                                /
                                {selectedPlan.periodPlan === 'monthly'
                                    ? t('pricing.monthly').toLowerCase()
                                    : t('pricing.annual').toLowerCase()}
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                            {error}
                        </div>
                    )}

                    {resendSuccess && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600">
                            {t('subscription.verification.codeSent')}
                        </div>
                    )}

                    <div className="mb-6">
                        <label
                            htmlFor="verificationCode"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            {t('subscription.verification.verificationCode')}{' '}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="verificationCode"
                            value={verificationCode}
                            onChange={handleInputChange}
                            placeholder={t(
                                'subscription.verification.codePlaceholder',
                            )}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-col space-y-3">
                        <button
                            onClick={handleVerify}
                            disabled={isSubmitting}
                            className={`w-full py-2 px-4 bg-primary text-white rounded-lg transition-colors duration-300 ${
                                isSubmitting
                                    ? 'opacity-70 cursor-not-allowed'
                                    : 'hover:bg-opacity-90'
                            }`}
                        >
                            {isSubmitting
                                ? t('subscription.verification.verifying')
                                : t('subscription.verification.verifyButton')}
                        </button>

                        <button
                            type="button"
                            onClick={handleResendCode}
                            disabled={isResending}
                            className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                        >
                            {isResending
                                ? t('subscription.verification.resending')
                                : t('subscription.verification.resendButton')}
                        </button>
                    </div>
                </>
            )}
        </motion.div>
    );
};

export default VerificationStep;
