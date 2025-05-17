import DbService from '../services/dbService.js';
import { DB_TABLES } from '../config/constants.js';
import Logger from '../utils/logger.js';

/**
 * @class Log
 * @description Log model for database operations
 */
class Log {
  /**
   * Find all logs for a user
   * @param {number} userId - User ID
   * @returns {Promise<Array>} Array of log objects
   */
  static async findAllByUserId(userId) {
    try {
      return await DbService.all(
        `SELECT * FROM ${DB_TABLES.LOGS} WHERE user_id = ? ORDER BY date DESC`,
        [userId]
      );
    } catch (error) {
      Logger.error(`Error finding logs for user: ${userId}`, error);
      throw error;
    }
  }

  /**
   * Find a log by ID for a specific user
   * @param {number} id - Log ID
   * @param {number} userId - User ID
   * @returns {Promise<Object|null>} Log object or null if not found
   */
  static async findByIdAndUserId(id, userId) {
    try {
      return await DbService.get(
        `SELECT * FROM ${DB_TABLES.LOGS} WHERE id = ? AND user_id = ?`,
        [id, userId]
      );
    } catch (error) {
      Logger.error(`Error finding log: ${id} for user: ${userId}`, error);
      throw error;
    }
  }

  /**
   * Find a log by date for a specific user
   * @param {string} date - Log date
   * @param {number} userId - User ID
   * @returns {Promise<Object|null>} Log object or null if not found
   */
  static async findByDateAndUserId(date, userId) {
    try {
      return await DbService.get(
        `SELECT * FROM ${DB_TABLES.LOGS} WHERE date = ? AND user_id = ?`,
        [date, userId]
      );
    } catch (error) {
      Logger.error(`Error finding log for date: ${date} and user: ${userId}`, error);
      throw error;
    }
  }

  /**
   * Create a new log
   * @param {Object} logData - Log data
   * @returns {Promise<number>} ID of the created log
   */
  static async create(logData) {
    try {
      const {
        user_id,
        date,
        mood_rating,
        anxiety_level,
        sleep_hours,
        sleep_quality,
        physical_activity_type,
        physical_activity_duration,
        social_interactions,
        stress_level,
        depression_symptoms,
        anxiety_symptoms,
        notes
      } = logData;

      const result = await DbService.run(
        `INSERT INTO ${DB_TABLES.LOGS} (
          user_id, date, mood_rating, anxiety_level, sleep_hours,
          sleep_quality, physical_activity_type, physical_activity_duration,
          social_interactions, stress_level, depression_symptoms,
          anxiety_symptoms, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user_id,
          date,
          mood_rating,
          anxiety_level,
          sleep_hours,
          sleep_quality,
          physical_activity_type,
          physical_activity_duration,
          social_interactions,
          stress_level,
          depression_symptoms,
          anxiety_symptoms,
          notes
        ]
      );

      return result.lastID;
    } catch (error) {
      Logger.error(`Error creating log for user: ${logData.user_id}`, error);
      throw error;
    }
  }

  /**
   * Update an existing log
   * @param {number} id - Log ID
   * @param {Object} logData - Log data to update
   * @returns {Promise<void>}
   */
  static async update(id, logData) {
    try {
      const {
        mood_rating,
        anxiety_level,
        sleep_hours,
        sleep_quality,
        physical_activity_type,
        physical_activity_duration,
        social_interactions,
        stress_level,
        depression_symptoms,
        anxiety_symptoms,
        notes
      } = logData;

      await DbService.run(
        `UPDATE ${DB_TABLES.LOGS} SET
          mood_rating = ?,
          anxiety_level = ?,
          sleep_hours = ?,
          sleep_quality = ?,
          physical_activity_type = ?,
          physical_activity_duration = ?,
          social_interactions = ?,
          stress_level = ?,
          depression_symptoms = ?,
          anxiety_symptoms = ?,
          notes = ?
        WHERE id = ?`,
        [
          mood_rating,
          anxiety_level,
          sleep_hours,
          sleep_quality,
          physical_activity_type,
          physical_activity_duration,
          social_interactions,
          stress_level,
          depression_symptoms,
          anxiety_symptoms,
          notes,
          id
        ]
      );
    } catch (error) {
      Logger.error(`Error updating log: ${id}`, error);
      throw error;
    }
  }

  /**
   * Delete a log
   * @param {number} id - Log ID
   * @returns {Promise<void>}
   */
  static async delete(id) {
    try {
      await DbService.run(
        `DELETE FROM ${DB_TABLES.LOGS} WHERE id = ?`,
        [id]
      );
    } catch (error) {
      Logger.error(`Error deleting log: ${id}`, error);
      throw error;
    }
  }

  /**
   * Get log by ID
   * @param {number} id - Log ID
   * @returns {Promise<Object|null>} Log object or null if not found
   */
  static async findById(id) {
    try {
      return await DbService.get(
        `SELECT * FROM ${DB_TABLES.LOGS} WHERE id = ?`,
        [id]
      );
    } catch (error) {
      Logger.error(`Error finding log by ID: ${id}`, error);
      throw error;
    }
  }
}

export default Log;