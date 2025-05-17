import { ENV, HTTP_STATUS } from '../config/constants.js';

/**
 * Global error handling middleware
 * Formats and sends error responses
 *
 * @param {Error} err - Error object
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 * @param {express.NextFunction} next - Express next function
 */
const errorMiddleware = (err, req, res, next) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER;
  const message = err.message || 'Internal Server Error';

  const response = {
    message,
    status: 'error',
    statusCode
  };

  if (process.env.NODE_ENV === ENV.DEVELOPMENT) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export default errorMiddleware;