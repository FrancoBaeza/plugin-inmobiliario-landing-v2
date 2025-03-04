import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import WhatWeDo from '../components/WhatWeDo';
import Benefits from '../components/Benefits';
import VideoDemo from '../components/VideoDemo';
import Pricing from '../components/Pricing';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  
  // Update document title when component mounts
  useEffect(() => {
    document.title = 'MatchFloor | ' + t('header.title');
    
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, [t]);
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'var(--color-background)'
    }}>
      <Navbar />
      <Hero />
      <WhatWeDo />
      <Benefits />
      <VideoDemo />
      <Pricing />
      <Contact />
      <Footer />
    </div>
  );
};

export default HomePage; 