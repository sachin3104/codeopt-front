// src/api/client.ts
import axios from 'axios';

// Ensure you have a `.env` at your project root with:
// VITE_API_URL=http://localhost:5000

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  withCredentials: true, // Send/receive HttpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - can be used for adding auth headers if needed
api.interceptors.request.use(
  (config) => {
    // You can add any request modifications here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle common response scenarios
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common error scenarios
    if (error.response?.status === 401) {
      // Unauthorized - could redirect to login or handle globally
      console.warn('Unauthorized request:', error.response.data?.message);
    } else if (error.response?.status === 403) {
      // Forbidden
      console.warn('Forbidden request:', error.response.data?.message);
    } else if (error.response?.status >= 500) {
      // Server errors
      console.error('Server error:', error.response.data?.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;