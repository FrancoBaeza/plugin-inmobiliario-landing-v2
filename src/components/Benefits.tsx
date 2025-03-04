import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';

const Benefits = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isVisible = useAnimateOnScroll(sectionRef);

  const benefits = [
    {
      id: 'efficiency',
      title: t('benefits.efficiency.title'),
      description: t('benefits.efficiency.description'),
      icon: '🏡',
      color: 'bg-primary/10 text-primary',
    },
    {
      id: 'experience',
      title: t('benefits.experience.title'),
      description: t('benefits.experience.description'),
      icon: '🤝',
      color: 'bg-secondary/20 text-secondary-2',
    },
    {
      id: 'integration',
      title: t('benefits.integration.title'),
      description: t('benefits.integration.description'),
      icon: '🔌',
      color: 'bg-primary/10 text-primary',
    },
    {
      id: 'analytics',
      title: t('benefits.analytics.title'),
      description: t('benefits.analytics.description'),
      icon: '📊',
      color: 'bg-secondary/20 text-secondary-2',
    },
  ];

  return (
    <section id="benefits" className="bg-background py-16 md:py-24" ref={sectionRef}>
      <div className="container-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">{t('benefits.title')}</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow flex"
            >
              <div className={`${benefit.color} w-16 h-16 rounded-full flex items-center justify-center text-2xl mr-4 flex-shrink-0`}>
                {benefit.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <a href="#pricing" className="btn-primary">
            {t('pricing.cta')}
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Benefits; 