import jwt from 'jsonwebtoken';
import db from '../db/index.js';
import { OAuth2Client } from 'google-auth-library';
import AppError from '../utils/AppError.js';
import { AUTH, HTTP_STATUS, DB_TABLES } from '../config/constants.js';
import AuthService from '../services/authService.js';
import Logger from '../utils/logger.js';
import catchAsync from '../utils/catchAsync.js';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Google OAuth client for token verification
 */
const client = new OAuth2Client(CLIENT_ID);

/**
 * Generate JWT token for authenticated user
 * @param {number} userId - User ID to include in token payload
 * @returns {string} JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: AUTH.TOKEN_EXPIRY
  });
};

/**
 * Verify Google token
 * @param {string} token - Google ID token
 * @returns {Promise<Object>} Google user data
 */
const verifyGoogleToken = async (token) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID
    });

    const payload = ticket.getPayload();

    return {
      email: payload.email,
      name: payload.name,
      picture: payload.picture
    };
  } catch (error) {
    Logger.error('Error verifying Google token', error);
    throw new AppError('Invalid Google token', HTTP_STATUS.UNAUTHORIZED);
  }
};

/**
 * Google sign-in controller
 */
const googleSignIn = catchAsync(async (req, res, next) => {
  const { token } = req.body;

  if (!token) {
    return next(new AppError('No token provided', HTTP_STATUS.BAD_REQUEST));
  }

  const googleUserData = await verifyGoogleToken(token);

  const { user, token: jwtToken } = await AuthService.processGoogleUser(googleUserData);

  Logger.debug(`Authenticated user ID: ${user.id}`);

  res.status(HTTP_STATUS.OK).json({
    status: 'success',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      picture: user.picture
    },
    token: jwtToken
  });
});

/**
 * Handle Google OAuth callback
 * This is called by Google after user grants permission
 *
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 * @param {express.NextFunction} next - Express next function
 */
const googleCallback = catchAsync(async (req, res, next) => {
  const { code } = req.query;
  if (!code) {
    throw new AppError('Authorization code is required', HTTP_STATUS.BAD_REQUEST);
  }

  const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.BACKEND_URL}${AUTH.CALLBACK_PATH}`
  );

  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  const ticket = await oauth2Client.verifyIdToken({
    idToken: tokens.id_token,
    audience: CLIENT_ID,
  });

  const payload = ticket.getPayload();

  const { token, user } = await AuthService.processGoogleUser(payload);

  res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
});

/**
 * Get current user controller
 */
const getCurrentUser = catchAsync(async (req, res, next) => {
  Logger.debug(`Request user ID: ${req.user?.id}`);

  if (!req.user?.id) {
    return next(new AppError('User not authenticated', HTTP_STATUS.UNAUTHORIZED));
  }

  const user = await AuthService.getUserById(req.user.id);

  res.status(HTTP_STATUS.OK).json({
    status: 'success',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      picture: user.picture
    }
  });
});

export {
  googleSignIn,
  getCurrentUser,
  googleCallback
};