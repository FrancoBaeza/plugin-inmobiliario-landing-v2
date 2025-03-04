import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import pages
import HomePage from '../pages/HomePage';
import SubscriptionPage from '../pages/SubscriptionPage';

// Import layouts if needed
// import MainLayout from '../layouts/MainLayout';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/subscribe" element={<SubscriptionPage />} />
      
      {/* 404 - Not found */}
      <Route path="*" element={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-8">Page not found</p>
            <a 
              href="/"
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors duration-300"
            >
              Go to Home
            </a>
          </div>
        </div>
      } />
    </Routes>
  );
};

export default AppRoutes; 