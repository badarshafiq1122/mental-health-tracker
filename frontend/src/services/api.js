import axios from 'axios';
import { API_PATHS, STORAGE_KEYS } from '../utils/constants';

/**
 * Base API configuration
 */
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Create axios instance with base configuration
 */
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Axios request interceptor to add auth token
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor to handle common errors
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
    return Promise.reject(error);
  }
);

/**
 * Authentication API endpoints
 */
export const authApi = {
  /**
   * Google login endpoint
   * @param {string} token - Google ID token
   */
  googleLogin: (token) => {
    return api.post(API_PATHS.AUTH.LOGIN, { token });
  },

  /**
   * Get current user data
   */
  getMe: () => api.get(API_PATHS.AUTH.ME),
};

/**
 * Logs API endpoints
 */
export const logsApi = {
  getLogs: () => api.get(API_PATHS.LOGS.BASE),
  createLog: (logData) => api.post(API_PATHS.LOGS.BASE, logData),
  getLogById: (id) => api.get(API_PATHS.LOGS.DETAIL(id)),
  deleteLog: (id) => api.delete(API_PATHS.LOGS.DETAIL(id)),
};

/**
 * Analytics API endpoints
 */
export const analyticsApi = {
  getMoodTrends: (period) => api.get(`${API_PATHS.ANALYTICS.MOOD_TRENDS}?period=${period}`),
  getSleepStats: () => api.get(API_PATHS.ANALYTICS.SLEEP_STATS),
  getActivityImpact: () => api.get(API_PATHS.ANALYTICS.ACTIVITY_IMPACT),
  getWellbeingInsights: () => api.get(API_PATHS.ANALYTICS.WELLBEING),
};

/**
 * Export API endpoints
 */
export const exportApi = {
  exportJson: () => api.get(API_PATHS.EXPORT.JSON),
  exportCsv: () => api.get(API_PATHS.EXPORT.CSV, { responseType: 'blob' }),
};

export default api;
