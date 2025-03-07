import axios from 'axios';
import {
    SubscriptionData,
    RegistrationResponse,
    VerificationData,
    VerificationResponse,
} from '../types/subscription';

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface ApiResponse<T> {
    status: string;
    data: T;
}

interface ErrorResponse {
    success: false;
    message: string;
}

export const registerAgency = async (
    data: SubscriptionData,
): Promise<ApiResponse<RegistrationResponse>> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/agencies/register`, {
            name: data.name,
            email: data.email,
            password: data.password,
            passwordConfirmation: data.passwordConfirmation,
            planId: data.planId,
            agencyName: data.agencyName,
            address: data.address,
            phone: data.phone,
            website: data.website,
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return {
                status: 'error',
                data: {
                    success: false,
                    message: error.response.data.message || 'Registration failed',
                }
            };
        }

        return {
            status: 'error',
            data: {
                success: false,
                message: 'An unexpected error occurred',
            }
        };
    }
};

export const verifyEmail = async (
    data: VerificationData,
): Promise<ApiResponse<VerificationResponse|ErrorResponse>> => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/agencies/verify-email`,
            {
                email: data.email,
                code: data.code,
            },
        );

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return {
                status: 'error',
                data: {
                    success: false,
                    message: error.response.data.message || 'Verification failed',
                }
            };
        }

        return {
            status: 'error',
            data: {
                success: false,
                message: 'An unexpected error occurred',
            }
        };
    }
};

// TODO: Analize
export const resendVerificationCode = async (
    email: string,
): Promise<ApiResponse<{ success: boolean; message: string }>> => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/agencies/resend-code`,
            { email },
        );

        return {
            status: 'success',
            data: {
                success: true,
                message: response.data.message || 'Verification code resent successfully',
            }
        };
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return {
                status: 'error',
                data: {
                    success: false,
                    message: error.response.data.message || 'Failed to resend verification code',
                }
            };
        }

        return {
            status: 'error',
            data: {
                success: false,
                message: 'An unexpected error occurred',
            }
        };
    }
};
