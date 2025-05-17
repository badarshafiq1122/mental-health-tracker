/**
 * @module Constants
 * @description Application-wide constants
 */

/**
 * Authentication constants
 */
export const AUTH = {
  TOKEN_EXPIRY: '7d',
  TOKEN_TYPE: 'Bearer',
  CALLBACK_PATH: '/auth/google/callback',
  STRATEGIES: {
    GOOGLE: 'google',
    JWT: 'jwt'
  }
};

/**
 * HTTP status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER: 500,
  NOT_IMPLEMENTED: 501,
  SERVICE_UNAVAILABLE: 503
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

/**
 * WebSocket close codes
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/code
 */
export const WS_CLOSE_CODES = {
  NORMAL_CLOSURE: 1000,
  GOING_AWAY: 1001,
  PROTOCOL_ERROR: 1002,
  UNSUPPORTED_DATA: 1003,
  POLICY_VIOLATION: 1008,
  INTERNAL_ERROR: 1011
};

/**
 * Database tables
 */
export const DB_TABLES = {
  USERS: 'users',
  LOGS: 'logs'
};

/**
 * Environment names
 */
export const ENV = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test'
};

/**
 * Log rating scales
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
 * API endpoints and paths
 */
export const API_PATHS = {
  BASE: '/api',
  AUTH: {
    BASE: '/api/auth',
    GOOGLE: '/api/auth/google',
    GOOGLE_CALLBACK: '/api/auth/google/callback',
    ME: '/api/auth/me'
  },
  LOGS: {
    BASE: '/api/logs',
    BY_ID: (id) => `/api/logs/${id}`
  },
  HEALTH: '/health',
  ANALYTICS: {
    BASE: '/api/analytics',
    MOOD_TRENDS: '/api/analytics/mood-trends',
    SLEEP_STATS: '/api/analytics/sleep-stats',
    ACTIVITY_IMPACT: '/api/analytics/activity-impact',
    WELLBEING: '/api/analytics/wellbeing'
  },
  EXPORT: {
    BASE: '/api/export',
    JSON: '/api/export/json',
    CSV: '/api/export/csv'
  }
};

/**
 * Rate limiting constants
 */
export const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000,
  MAX_REQUESTS: 100
};

/**
 * WebSocket configuration
 */
export const WEBSOCKET = {
  PING_INTERVAL: 30000,
  RECONNECT_INTERVAL: 3000,
  TOKEN_PARAM: 'token'
};