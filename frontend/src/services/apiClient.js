/**
 * Centralized HireConnect Frontend API Client
 * Configures Axios with base URL from Vite environment, session cookies, Bearer token,
 * request correlation IDs, and unified error handling.
 */

import axios from 'axios';

// Resolve base URL from Vite env or fallback to local proxy / port 5000
const getBaseUrl = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  return 'http://localhost:5000/api';
};

export const apiClient = axios.create({
  baseURL: getBaseUrl(),
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

// Request interceptor: attach auth token and correlation ID
apiClient.interceptors.request.use(
  (config) => {
    // Generate unique correlation ID
    if (!config.headers['X-Request-Id']) {
      config.headers['X-Request-Id'] = 'req_' + Math.random().toString(36).substring(2, 11);
    }

    // Attach Bearer token if stored in client
    if (typeof window !== 'undefined') {
      const token =
        window.localStorage.getItem('hc_token') ||
        window.sessionStorage.getItem('hc_token') ||
        window.localStorage.getItem('hireconnect_token');

      if (token && !config.headers['Authorization']) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle automatic token refresh and standardize errors
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // Network / offline failure
    if (!error.response) {
      return Promise.reject({
        success: false,
        message: 'Cannot reach HireConnect API. Ensure backend server is running.',
        code: 'NETWORK_ERROR',
        isNetworkError: true
      });
    }

    const { status, data } = error.response;

    // Handle 401 Unauthorized and attempt token refresh if not already retried
    if (
      status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshRes = await axios.post(
          `${getBaseUrl()}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken =
          refreshRes.data?.data?.accessToken ||
          refreshRes.data?.accessToken ||
          refreshRes.data?.data?.token ||
          refreshRes.data?.token;

        if (newAccessToken) {
          if (typeof window !== 'undefined') {
            if (window.localStorage.getItem('hc_token')) {
              window.localStorage.setItem('hc_token', newAccessToken);
            } else {
              window.sessionStorage.setItem('hc_token', newAccessToken);
            }
          }

          apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          processQueue(null, newAccessToken);
          return apiClient(originalRequest);
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem('hc_token');
          window.sessionStorage.removeItem('hc_token');
        }
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject({
      success: false,
      status,
      message: (data && data.message) || error.message || 'Request failed',
      code: (data && data.code) || 'API_ERROR',
      errors: (data && data.errors) || null,
      requestId: (data && data.requestId) || error.response.headers?.['x-request-id']
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
