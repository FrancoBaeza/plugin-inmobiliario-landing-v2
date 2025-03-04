import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';

const VideoDemo = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isVisible = useAnimateOnScroll(sectionRef);
  const [isPlaying, setIsPlaying] = useState(false);

  // In a real implementation, this would be a real video URL
  const videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ";

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  return (
    <section id="demo" className="bg-white py-16 md:py-24" ref={sectionRef}>
      <div className="container-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="section-title">{t('demo.title')}</h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-600">
            {t('demo.description')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7 }}
          className="relative aspect-video max-w-4xl mx-auto rounded-xl overflow-hidden shadow-xl"
        >
          {!isPlaying ? (
            <div className="absolute inset-0 bg-primary/80 flex flex-col items-center justify-center text-white">
              <button
                onClick={handlePlayClick}
                className="w-20 h-20 rounded-full bg-white text-primary flex items-center justify-center mb-4 hover:bg-gray-100 transition-colors"
              >
                <svg
                  className="w-8 h-8 ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
              <p className="text-xl font-semibold">Ver demostración</p>
            </div>
          ) : (
            <iframe
              src={videoUrl}
              title="MatchFloor Demo"
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <a href="#contact" className="btn-secondary">
            {t('contact.cta')}
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoDemo; 