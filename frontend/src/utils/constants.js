/**
 * Application-wide constants
 */

/**
 * API endpoint paths
 */
export const API_PATHS = {
  AUTH: {
    LOGIN: '/auth/google',
    ME: '/auth/me'
  },
  LOGS: {
    BASE: '/logs',
    DETAIL: (id) => `/logs/${id}`
  },
  ANALYTICS: {
    MOOD_TRENDS: '/analytics/mood-trends',
    SLEEP_STATS: '/analytics/sleep-stats',
    ACTIVITY_IMPACT: '/analytics/activity-impact',
    WELLBEING: '/analytics/wellbeing'
  },
  EXPORT: {
    JSON: '/export/json',
    CSV: '/export/csv'
  }
};

/**
 * Application routes
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  LOGS: {
    ALL: '/logs',
    NEW: '/log/new',
    EDIT: (id) => `/log/${id}/edit`
  },
  ANALYTICS: '/analytics',
  SETTINGS: '/settings'
};

/**
 * Rating scales
 */
export const RATING_SCALES = {
  MIN: 1,
  MAX: 10
};

/**
 * Sleep quality options
 */
export const SLEEP_QUALITY = {
  POOR: 'poor',
  FAIR: 'fair',
  GOOD: 'good',
  EXCELLENT: 'excellent'
};

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'token',
  USER: 'user'
};

/**
 * Chart colors
 */
export const CHART_COLORS = {
  MOOD: '#5E8B7E',
  ANXIETY: '#E98074',
  SLEEP: '#6D9DC5',
  STRESS: '#E4B363'
};

/**
 * WebSocket message types
 */
export const WS_MESSAGE_TYPES = {
  CONNECTION_SUCCESS: 'CONNECTION_SUCCESS',
  CONNECTION_ERROR: 'CONNECTION_ERROR',
  LOG_CREATE: 'LOG_CREATE',
  LOG_UPDATE: 'LOG_UPDATE',
  LOG_DELETE: 'LOG_DELETE',
  ANALYTICS_UPDATE: 'ANALYTICS_UPDATE',
  PING: 'PING',
  PONG: 'PONG',
  ERROR: 'ERROR'
};

export const DRAWER_WIDTH = 240;