import LogService from '../services/logService.js';
import Logger from '../utils/logger.js';
import { HTTP_STATUS } from '../config/constants.js';

/**
 * Get all logs for authenticated user
 *
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 * @param {express.NextFunction} next - Express next function
 */
const getLogs = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const logs = await LogService.getAllLogs(userId);

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      results: logs.length,
      logs
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create or update a daily log entry
 *
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 * @param {express.NextFunction} next - Express next function
 */
const createOrUpdateLog = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const logData = req.body;

    Logger.info(`Create/update log request from user ${userId}`);

    const { log, isUpdate } = await LogService.createOrUpdateLog(userId, logData);

    Logger.info(`Log ${isUpdate ? 'updated' : 'created'} - WebSocket notification should have been sent`);

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: log
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a specific log by ID
 *
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 * @param {express.NextFunction} next - Express next function
 */
const getLogById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const logId = req.params.id;

    const log = await LogService.getLogById(userId, logId);

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      log
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing log entry
 *
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 * @param {express.NextFunction} next - Express next function
 */
const updateLog = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const logId = req.params.id;

    const updatedLogData = {
      ...req.body,
      id: parseInt(logId)
    };

    const { log } = await LogService.createOrUpdateLog(userId, updatedLogData);

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      message: 'Log updated successfully',
      log
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a log entry
 *
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 * @param {express.NextFunction} next - Express next function
 */
const deleteLog = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const logId = req.params.id;

    await LogService.deleteLog(userId, logId);

    res.status(HTTP_STATUS.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};

export {
  getLogs,
  createOrUpdateLog,
  getLogById,
  updateLog,
  deleteLog
};