import jwt from 'jsonwebtoken';
import { AUTH, HTTP_STATUS } from '../config/constants.js';
import AppError from './AppError.js';
import Logger from '../utils/logger.js';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  Logger.error('JWT_SECRET environment variable is not set');
  throw new Error('JWT_SECRET environment variable must be set');
}

/**
 * Generate a JWT token for authenticated users
 *
 * @param {number} userId - User ID to include in token payload
 * @param {object} [additionalData={}] - Additional data to include in token
 * @returns {string} JWT token
 */
export const generateToken = (userId, additionalData = {}) => {
  return jwt.sign({
    id: userId,
    ...additionalData
  }, JWT_SECRET, {
    expiresIn: AUTH.TOKEN_EXPIRY
  });
};

/**
 * Verify JWT token and return decoded payload
 *
 * @param {string} token - JWT token to verify
 * @returns {object} Decoded token payload
 * @throws {AppError} If token is invalid or expired
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new AppError(
      error.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token',
      HTTP_STATUS.UNAUTHORIZED
    );
  }
};

/**
 * Extract token from request headers
 *
 * @param {object} headers - Request headers
 * @returns {string|null} Token or null if not found
 */
export const extractTokenFromHeaders = (headers) => {
  if (!headers.authorization) return null;

  const parts = headers.authorization.split(' ');
  if (parts.length !== 2 || parts[0] !== AUTH.TOKEN_TYPE) return null;

  return parts[1];
};