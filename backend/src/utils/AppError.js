import Logger from './logger.js';

/**
 * @class AppError
 * @description Custom error class for application-specific errors with status codes
 * @extends Error
 */
class AppError extends Error {
  /**
   * Create an application error
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
    Logger.error(`AppError: ${message}`, { statusCode });
  }
}

export default AppError;