import { ENV } from '../config/constants.js';

const isDev = process.env.NODE_ENV === ENV.DEVELOPMENT;

/**
 * Enhanced console logger with timestamp and log level
 */
class Logger {
  /**
   * Format log message with timestamp and level
   * @private
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @returns {string} Formatted log message
   */
  static _formatMessage(level, message) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  }

  /**
   * Log info level message
   * @param {string} message - Log message
   * @param {object} [data] - Optional data to log
   */
  static info(message, data) {
    console.log(Logger._formatMessage('info', message));
    if (data && isDev) {
      console.dir(data, { depth: null, colors: true });
    }
  }

  /**
   * Log error level message
   * @param {string} message - Log message
   * @param {Error|object} [error] - Optional error to log
   */
  static error(message, error) {
    console.error(Logger._formatMessage('error', message));
    if (error) {
      if (error instanceof Error) {
        console.error(error.stack);
      } else {
        console.dir(error, { depth: null, colors: true });
      }
    }
  }

  /**
   * Log warning level message
   * @param {string} message - Log message
   * @param {object} [data] - Optional data to log
   */
  static warn(message, data) {
    console.warn(Logger._formatMessage('warn', message));
    if (data && isDev) {
      console.dir(data, { depth: null, colors: true });
    }
  }

  /**
   * Log debug level message (only in development)
   * @param {string} message - Log message
   * @param {object} [data] - Optional data to log
   */
  static debug(message, data) {
    if (isDev) {
      console.debug(Logger._formatMessage('debug', message));
      if (data) {
        console.dir(data, { depth: null, colors: true });
      }
    }
  }
}

export default Logger;