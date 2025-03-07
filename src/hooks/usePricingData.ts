import { useState, useEffect } from 'react';
import axios from 'axios';

export interface PricingPlan {
    id: string;
    name: string;
    description: string;
    monthlyPrice: number;
    annualPrice: number;
    currency: string;
    features: string[];
    isPopular?: boolean;
}

export const usePricingData = () => {
    const [plans, setPlans] = useState<PricingPlan[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPricingData = async () => {
            try {
                setLoading(true);
                // In a real scenario, this would be the actual API endpoint
                const response = await axios.get(
                    'https://matchfloor.com/api/plans/public',
                );

                // Check if the response has a data property that contains the plans
                const plansData = response.data?.data || response.data;

                if (Array.isArray(plansData)) {
                    setPlans(plansData);
                } else {
                    throw new Error('Invalid data format received from API');
                }

                setError(null);
            } catch (err) {
                console.error('Error fetching pricing data:', err);
                setError(
                    'Failed to load pricing data. Please try again later.',
                );

                // Fallback data in case the API fails
                setPlans([
                    {
                        id: 'basic',
                        name: 'Básico',
                        description: 'Ideal para pequeñas inmobiliarias',
                        monthlyPrice: 49,
                        annualPrice: 470,
                        currency: 'EUR',
                        features: [
                            'Hasta 5 agentes',
                            'Gestión de citas',
                            'Panel de control básico',
                            'Soporte por email',
                        ],
                    },
                    {
                        id: 'pro',
                        name: 'Profesional',
                        description: 'Para inmobiliarias en crecimiento',
                        monthlyPrice: 99,
                        annualPrice: 950,
                        currency: 'EUR',
                        features: [
                            'Hasta 15 agentes',
                            'Gestión de citas avanzada',
                            'Analítica detallada',
                            'Integraciones con CRM',
                            'Soporte prioritario',
                        ],
                        isPopular: true,
                    },
                    {
                        id: 'enterprise',
                        name: 'Empresarial',
                        description:
                            'Solución completa para grandes inmobiliarias',
                        monthlyPrice: 199,
                        annualPrice: 1900,
                        currency: 'EUR',
                        features: [
                            'Agentes ilimitados',
                            'Funciones personalizadas',
                            'API completa',
                            'Gestor de cuenta dedicado',
                            'Soporte 24/7',
                            'Implementación guiada',
                        ],
                    },
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchPricingData();
    }, []);

    return { plans, loading, error };
};
