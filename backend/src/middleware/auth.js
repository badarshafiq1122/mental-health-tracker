import AppError from '../utils/AppError.js';
import { HTTP_STATUS } from '../config/constants.js';
import { verifyToken, extractTokenFromHeaders } from '../utils/auth.js';
import Logger from '../utils/logger.js';

/**
 * Authentication middleware to protect routes
 * Verifies JWT token from Authorization header
 *
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 * @param {express.NextFunction} next - Express next function
 */
const authMiddleware = (req, res, next) => {
  try {
    const token = extractTokenFromHeaders(req.headers);

    if (!token) {
      return next(new AppError('Authentication required', HTTP_STATUS.UNAUTHORIZED));
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    Logger.debug(`Authenticated user: ${decoded.id}`);
    next();
  } catch (error) {
    Logger.error('Auth middleware error', error);
    return next(new AppError('Invalid or expired token', HTTP_STATUS.UNAUTHORIZED));
  }
};

export default authMiddleware;