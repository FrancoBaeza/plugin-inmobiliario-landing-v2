import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';

const WhatWeDo = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isVisible = useAnimateOnScroll(sectionRef);

  const steps = [
    { id: 'step1', icon: '🔌', text: t('whatWeDo.step1') },
    { id: 'step2', icon: '📅', text: t('whatWeDo.step2') },
    { id: 'step3', icon: '📊', text: t('whatWeDo.step3') },
    { id: 'step4', icon: '🚀', text: t('whatWeDo.step4') },
  ];

  return (
    <section id="what-we-do" className="bg-white py-16 md:py-24" ref={sectionRef}>
      <div className="container-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">{t('whatWeDo.title')}</h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-600">
            {t('whatWeDo.description')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="bg-background rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold text-primary mb-2">
                {`${index + 1}. `}{step.text}
              </h3>
              <div className={`h-1 w-16 bg-secondary mt-4 rounded-full`}></div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 relative">
          <div className="absolute inset-0 bg-primary/5 rounded-xl"></div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="relative p-8 rounded-xl overflow-hidden"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-primary mb-4">
                  MatchFloor Plugin
                </h3>
                <p className="text-gray-600 mb-6">
                  Nuestro plugin se integra perfectamente con tu sitio web existente, 
                  permitiendo a tus clientes programar visitas a propiedades de manera 
                  eficiente y a tus agentes gestionar su tiempo de forma óptima.
                </p>
                <div className="flex space-x-2">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                    Fácil integración
                  </span>
                  <span className="px-3 py-1 bg-secondary/20 text-secondary-2 rounded-full text-sm">
                    Sin código
                  </span>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="aspect-video bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-gray-400">Ilustración del plugin</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo; 