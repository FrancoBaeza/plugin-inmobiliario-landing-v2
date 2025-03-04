import axios from 'axios';

// Get API URL from environment or use default
const API_URL = import.meta.env.VITE_API_URL || 'https://api.matchfloor.com';

// Create an axios instance with default config
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle specific error cases
    if (error.response) {
      // Server responded with an error status
      const { status } = error.response;
      
      if (status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('authToken');
        // You might want to redirect to login page here
        // or dispatch an action to your state management
      }
      
      if (status === 403) {
        // Forbidden - user doesn't have permission
        console.error('You do not have permission to perform this action');
      }
      
      if (status === 500) {
        // Server error
        console.error('Server error occurred. Please try again later.');
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received from server. Please check your connection.');
    } else {
      // Error in setting up the request
      console.error('Error setting up the request:', error.message);
    }
    
    return Promise.reject(error);
  }
); 