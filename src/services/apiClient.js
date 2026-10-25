/**
 * Centralized HireConnect Frontend API Client
 * Configures Axios with base URL from Vite environment, request correlation IDs, and unified error handling.
 */

import axios from 'axios';

// Resolve base URL from Vite env, window config, or fallback to port 5000
const getBaseUrl = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof window !== 'undefined' && window.__VITE_API_BASE_URL__) {
    return window.__VITE_API_BASE_URL__;
  }
  return 'http://localhost:5000/api';
};

export const apiClient = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

// Request interceptor: attach auth token and correlation ID if available
apiClient.interceptors.request.use(
  (config) => {
    // Generate correlation ID
    if (!config.headers['X-Request-Id']) {
      config.headers['X-Request-Id'] = 'req_' + Math.random().toString(36).substring(2, 11);
    }

    // Attach Bearer token if stored in client
    if (typeof window !== 'undefined') {
      const token =
        (window.localStorage && (window.localStorage.getItem('hc_auth_token') || window.localStorage.getItem('hireconnect_token'))) ||
        (window.sessionStorage && (window.sessionStorage.getItem('hc_auth_token') || window.sessionStorage.getItem('hireconnect_token')));
      if (token && !config.headers['Authorization']) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: standardize error messages and status codes
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (!error.response) {
      // Network failure, CORS blockage, or offline
      return Promise.reject({
        success: false,
        message: 'Cannot reach HireConnect API. Ensure backend server is running.',
        code: 'NETWORK_ERROR',
        isNetworkError: true
      });
    }

    const { status, data } = error.response;
    return Promise.reject({
      success: false,
      status,
      message: (data && data.message) || error.message || 'Request failed',
      code: (data && data.code) || 'API_ERROR',
      errors: (data && data.errors) || null,
      requestId: (data && data.requestId) || error.response.headers['x-request-id']
    });
  }
);

/**
 * Health probe utility for frontend connectivity checks
 */
export async function checkApiHealth() {
  try {
    const res = await apiClient.get('/health');
    return { isOnline: true, data: res };
  } catch (err) {
    return { isOnline: false, error: err };
  }
}

/**
 * Readiness probe utility checking database readiness
 */
export async function checkApiReadiness() {
  try {
    const res = await apiClient.get('/health/ready');
    return { isReady: true, data: res };
  } catch (err) {
    return { isReady: false, error: err };
  }
}

export default apiClient;
