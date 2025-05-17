import AppError from '../utils/AppError.js';
import Logger from '../utils/logger.js';
import { HTTP_STATUS, WS_MESSAGE_TYPES } from '../config/constants.js';
import Log from '../models/Log.js';
import WebSocketService from '../services/websocketService.js';

/**
 * @class LogService
 * @description Service for handling log operations
 */
class LogService {
  /**
   * Get all logs for a user
   * @param {number} userId - User ID
   * @returns {Promise<Array>} Array of log entries
   * @throws {AppError} If database operation fails
   */
  static async getAllLogs(userId) {
    try {
      Logger.debug(`Fetching logs for user ${userId}`);

      const logs = await Log.findAllByUserId(userId);

      Logger.info(`Retrieved ${logs.length} logs for user ${userId}`);
      return logs;
    } catch (error) {
      Logger.error(`Error fetching logs for user ${userId}`, error);
      throw new AppError('Failed to retrieve logs', HTTP_STATUS.INTERNAL_SERVER);
    }
  }

  /**
   * Create or update a daily log entry
   * @param {number} userId - User ID
   * @param {Object} logData - Log data
   * @returns {Promise<Object>} Created/updated log entry
   * @throws {AppError} If database operation fails
   */
  static async createOrUpdateLog(userId, logData) {
    try {
      const { date, id } = logData;

      Logger.debug(`Creating/updating log for user ${userId} on date ${date}`);

      let logId;
      let isUpdate = false;

      if (id || (await Log.findByDateAndUserId(date, userId))) {
        isUpdate = true;
        logId = id || (await Log.findByDateAndUserId(date, userId)).id;
        await Log.update(logId, logData);
        Logger.info(`Updated log id ${logId} for user ${userId}`);
      } else {
        logId = await Log.create({
          user_id: userId,
          date,
          ...logData
        });
        Logger.info(`Created new log id ${logId} for user ${userId}`);
      }

      const log = await Log.findById(logId);

      if (!log) {
        Logger.error(`Failed to retrieve created/updated log ${logId}`);
        throw new AppError('Failed to create log entry', HTTP_STATUS.INTERNAL_SERVER);
      }

      const messageType = isUpdate ? WS_MESSAGE_TYPES.LOG_UPDATE : WS_MESSAGE_TYPES.LOG_CREATE;

      const clientsNotified = WebSocketService.broadcastMessage(
        messageType,
        { log },
        userId
      );

      Logger.info(`Notified ${clientsNotified} clients about log ${isUpdate ? 'update' : 'creation'}`);

      return { log, isUpdate };
    } catch (error) {
      Logger.error(`Error creating/updating log for user ${userId}`, error);
      throw new AppError('Failed to create log', HTTP_STATUS.INTERNAL_SERVER);
    }
  }

  /**
   * Get a log by ID
   * @param {number} userId - User ID
   * @param {number} logId - Log ID to retrieve
   * @returns {Promise<Object>} Log entry
   * @throws {AppError} If log not found or database error occurs
   */
  static async getLogById(userId, logId) {
    try {
      Logger.debug(`Fetching log ${logId} for user ${userId}`);

      const log = await Log.findByIdAndUserId(logId, userId);

      if (!log) {
        Logger.warn(`Log ${logId} not found for user ${userId}`);
        throw new AppError('Log not found', HTTP_STATUS.NOT_FOUND);
      }

      Logger.info(`Retrieved log ${logId} for user ${userId}`);
      return log;
    } catch (error) {
      if (error instanceof AppError) throw error;

      Logger.error(`Error fetching log ${logId} for user ${userId}`, error);
      throw new AppError('Failed to retrieve log', HTTP_STATUS.INTERNAL_SERVER);
    }
  }

  /**
   * Delete a log by ID
   * @param {number} userId - User ID
   * @param {number} logId - Log ID to delete
   * @throws {AppError} If log not found or database error occurs
   */
  static async deleteLog(userId, logId) {
    try {
      Logger.debug(`Deleting log ${logId} for user ${userId}`);

      const log = await Log.findByIdAndUserId(logId, userId);

      if (!log) {
        Logger.warn(`Log ${logId} not found for user ${userId} during delete attempt`);
        throw new AppError('Log not found', HTTP_STATUS.NOT_FOUND);
      }

      await Log.delete(logId);

      Logger.info(`Deleted log ${logId} for user ${userId}`);

      const clientsNotified = WebSocketService.broadcastMessage(WS_MESSAGE_TYPES.LOG_DELETE, { logId }, userId);
      Logger.debug(`Notified ${clientsNotified} clients about log deletion`);
    } catch (error) {
      if (error instanceof AppError) throw error;

      Logger.error(`Error deleting log ${logId} for user ${userId}`, error);
      throw new AppError('Failed to delete log', HTTP_STATUS.INTERNAL_SERVER);
    }
  }
}

export default LogService;