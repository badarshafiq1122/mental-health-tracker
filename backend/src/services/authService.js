import { OAuth2Client } from 'google-auth-library';
import AppError from '../utils/AppError.js';
import Logger from '../utils/logger.js';
import { AUTH, HTTP_STATUS } from '../config/constants.js';
import User from '../models/User.js';
import { generateToken } from '../utils/auth.js';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

/**
 * @class AuthService
 * @description Service for handling authentication operations
 */
class AuthService {
  /**
   * Generate JWT token for authenticated user
   * @param {number} userId - User ID to include in token payload
   * @param {Object} [additionalData={}] - Additional data to include in token
   * @returns {string} JWT token
   */
  static generateToken(userId, additionalData = {}) {
    return generateToken(userId, additionalData);
  }

  /**
   * Verify Google token ID
   * @param {string} tokenId - Google OAuth token ID
   * @returns {Promise<Object>} Token payload with user information
   * @throws {AppError} If token verification fails
   */
  static async verifyGoogleToken(tokenId) {
    try {
      const ticket = await client.verifyIdToken({
        idToken: tokenId,
        audience: CLIENT_ID
      });

      return ticket.getPayload();
    } catch (error) {
      Logger.error('Error verifying Google token', error);
      throw new AppError('Invalid Google token', HTTP_STATUS.UNAUTHORIZED);
    }
  }

  /**
   * Process Google sign-in
   * @param {string} googleToken - Google OAuth token
   * @returns {Promise<Object>} User data and JWT token
   * @throws {AppError} If token is missing or invalid
   */
  static async processGoogleSignIn(googleToken) {
    if (!googleToken) {
      throw new AppError('Token is required', HTTP_STATUS.BAD_REQUEST);
    }

    const payload = await this.verifyGoogleToken(googleToken);
    Logger.debug(`Google auth for user email: ${payload.email}`);

    return this.processGoogleUser(payload);
  }

  /**
   * Process user data from Google OAuth
   *
   * @param {Object} payload - Google user profile data
   * @returns {Promise<Object>} User and token data
   */
  static async processGoogleUser(googleUserData) {
    try {
      const { email, name, picture } = googleUserData;

      let user = await User.findByEmail(email);

      if (user) {
        Logger.info(`Existing user logged in: ${email}`);

        if (name !== user.name || picture !== user.picture) {
          user = await User.update(user.id, { name, picture });
        }
      } else {
        user = await User.create({
          email,
          name,
          picture
        });
        Logger.info(`New user registered: ${email}`);
      }

      Logger.debug(`User authenticated with ID: ${user.id}`);

      const token = this.generateToken(user.id);

      return {
        user,
        token
      };
    } catch (error) {
      Logger.error('Error processing Google user', error);
      throw new AppError('Authentication failed', HTTP_STATUS.UNAUTHORIZED);
    }
  }

  /**
   * Get user by ID
   * @param {number} userId - User ID
   * @returns {Promise<Object>} User object
   * @throws {AppError} If user not found
   */
  static async getUserById(userId) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        Logger.warn(`User ${userId} not found`);
        throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
      }

      return user;
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }

      Logger.error(`Error fetching user ${userId}`, error);
      throw new AppError('Error fetching user', HTTP_STATUS.INTERNAL_SERVER);
    }
  }
}

export default AuthService;