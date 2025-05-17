import AnalyticsService from '../services/analyticsService.js';
import Logger from '../utils/logger.js';
import { HTTP_STATUS } from '../config/constants.js';

/**
 * Get mood trends for the user
 *
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 * @param {express.NextFunction} next - Express next function
 */
const getMoodTrends = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { period } = req.query;

    const trends = await AnalyticsService.getMoodTrends(userId, period);

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: trends
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get sleep statistics for the user
 *
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 * @param {express.NextFunction} next - Express next function
 */
const getSleepStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const sleepStats = await AnalyticsService.getSleepStats(userId);

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: sleepStats
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get activity impact analysis
 *
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 * @param {express.NextFunction} next - Express next function
 */
const getActivityImpact = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const activityImpact = await AnalyticsService.getActivityImpact(userId);

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: activityImpact
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get overall wellbeing insights
 *
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 * @param {express.NextFunction} next - Express next function
 */
const getWellbeingInsights = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const insights = await AnalyticsService.getWellbeingInsights(userId);

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: insights
    });
  } catch (error) {
    next(error);
  }
};

export {
  getMoodTrends,
  getSleepStats,
  getActivityImpact,
  getWellbeingInsights
};