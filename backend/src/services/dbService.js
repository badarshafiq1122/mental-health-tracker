import db from '../db/index.js';
import Logger from '../utils/logger.js';

/**
 * @class DbService
 * @description Service for database operations with error handling
 */
class DbService {
  /**
   * Execute a SELECT query returning all rows
   * @param {string} query - SQL query
   * @param {Array} params - Query parameters
   * @returns {Promise<Array>} Query results
   */
  static async all(query, params = []) {
    try {
      Logger.debug(`DB select all operation`, { query });
      const result = await db.allAsync(query, params);
      Logger.debug(`DB select all successful`);
      return result;
    } catch (error) {
      Logger.error(`DB select all error`, { error, query });
      throw error;
    }
  }

  /**
   * Execute a SELECT query returning one row
   * @param {string} query - SQL query
   * @param {Array} params - Query parameters
   * @returns {Promise<Object|null>} Query result or null
   */
  static async get(query, params = []) {
    try {
      Logger.debug(`DB select one operation`, { query });
      const result = await db.getAsync(query, params);
      Logger.debug(`DB select one successful`);
      return result;
    } catch (error) {
      Logger.error(`DB select one error`, { error, query });
      throw error;
    }
  }

  /**
   * Execute an INSERT/UPDATE/DELETE query
   * @param {string} query - SQL query
   * @param {Array} params - Query parameters
   * @returns {Promise<{lastID: number, changes: number}>} Query result with lastID and changes
   */
  static async run(query, params = []) {
    try {
      Logger.debug(`DB modify operation`, { query });

      return new Promise((resolve, reject) => {
        db.run(query, params, function(err) {
          if (err) {
            Logger.error(`DB modify error`, { error: err, query });
            reject(err);
            return;
          }
          resolve({
            lastID: this.lastID,
            changes: this.changes
          });
          Logger.debug(`DB modify successful`, { lastID: this.lastID, changes: this.changes });
        });
      });
    } catch (error) {
      Logger.error(`DB modify error`, { error, query });
      throw error;
    }
  }
}

export default DbService;