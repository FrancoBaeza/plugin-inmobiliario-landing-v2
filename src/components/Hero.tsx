import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';

const Hero = () => {
  const { t } = useTranslation();
  const heroRef = useRef<HTMLDivElement>(null);
  const isVisible = useAnimateOnScroll(heroRef);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center bg-background pt-16"
      ref={heroRef}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent z-0"></div>
      
      <div className="container-section relative z-10">
        <motion.div
          className="max-w-3xl"
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight mb-6"
            variants={itemVariants}
          >
            {t('header.title')}
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-700 mb-8"
            variants={itemVariants}
          >
            {t('header.subtitle')}
          </motion.p>
          
          <motion.div variants={itemVariants}>
            <a href="#contact" className="btn-primary mr-4">
              {t('header.cta')}
            </a>
            <a href="#what-we-do" className="text-primary font-semibold hover:text-primary/80 transition-colors">
              {t('nav.whatWeDo')} →
            </a>
          </motion.div>
        </motion.div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg 
          className="w-6 h-6 text-primary" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 14l-7 7m0 0l-7-7m7 7V3" 
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero; 