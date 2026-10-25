/**
 * Centralized HireConnect Frontend API Client (Dual CJS/ESM support)
 */

let axios;
try {
  axios = require('axios');
} catch (e) {
  // If in browser or ESM context where axios is global or imported
  if (typeof window !== 'undefined' && window.axios) {
    axios = window.axios;
  }
}

const getBaseUrl = () => {
  if (typeof process !== 'undefined' && process.env && process.env.VITE_API_BASE_URL) {
    return process.env.VITE_API_BASE_URL;
  }
  if (typeof window !== 'undefined' && window.__VITE_API_BASE_URL__) {
    return window.__VITE_API_BASE_URL__;
  }
  return 'http://localhost:5000/api';
};

const createClient = (axiosInstance) => {
  if (!axiosInstance) return null;
  const client = axiosInstance.create({
    baseURL: getBaseUrl(),
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  });

  client.interceptors.request.use((config) => {
    if (!config.headers['X-Request-Id']) {
      config.headers['X-Request-Id'] = 'req_' + Math.random().toString(36).substring(2, 11);
    }
    if (typeof window !== 'undefined') {
      const token =
        (window.localStorage && (window.localStorage.getItem('hc_auth_token') || window.localStorage.getItem('hireconnect_token'))) ||
        (window.sessionStorage && (window.sessionStorage.getItem('hc_auth_token') || window.sessionStorage.getItem('hireconnect_token')));
      if (token && !config.headers['Authorization']) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response.data,
    (error) => {
      if (!error.response) {
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

  return client;
};

const apiClient = createClient(axios);

async function checkApiHealth() {
  if (!apiClient) {
    // Fallback to fetch if axios not initialized
    try {
      const res = await fetch(`${getBaseUrl()}/health`);
      const data = await res.json();
      return { isOnline: res.ok, data };
    } catch (err) {
      return { isOnline: false, error: err };
    }
  }
  try {
    const res = await apiClient.get('/health');
    return { isOnline: true, data: res };
  } catch (err) {
    return { isOnline: false, error: err };
  }
}

async function checkApiReadiness() {
  if (!apiClient) {
    try {
      const res = await fetch(`${getBaseUrl()}/health/ready`);
      const data = await res.json();
      return { isReady: res.ok, data };
    } catch (err) {
      return { isReady: false, error: err };
    }
  }
  try {
    const res = await apiClient.get('/health/ready');
    return { isReady: true, data: res };
  } catch (err) {
    return { isReady: false, error: err };
  }
}

module.exports = {
  apiClient,
  checkApiHealth,
  checkApiReadiness,
  getBaseUrl
};
