import db from '../db/index.js';
import Logger from '../utils/logger.js';

/**
 * User model
 * @class User
 */
class User {
  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<number>} Created user ID
   */
  static async create(userData) {
    try {
      const { email, name, picture, google_id } = userData;

      return new Promise((resolve, reject) => {
        db.run(`
          INSERT INTO users (email, name, picture, google_id, created_at)
          VALUES (?, ?, ?, ?, datetime('now'))
        `, [email, name, picture, google_id], function(err) {
          if (err) {
            Logger.error('Error creating user', err);
            reject(err);
            return;
          }
          
          Logger.debug(`Created new user with ID: ${this.lastID}`);
          resolve(this.lastID);
        });
      });
    } catch (error) {
      Logger.error('Error creating user', error);
      throw error;
    }
  }

  /**
   * Find user by ID
   * @param {number} id - User ID
   * @returns {Promise<Object|null>} User object or null if not found
   */
  static async findById(id) {
    try {
      Logger.debug(`Looking up user with ID: ${id}`);

      const user = await db.getAsync('SELECT * FROM users WHERE id = ?', [id]);

      if (user) {
        Logger.debug(`Found user: ${user.email}`);
      } else {
        Logger.debug(`No user found with ID: ${id}`);
      }

      return user || null;
    } catch (error) {
      Logger.error(`Error finding user by ID: ${id}`, error);
      throw error;
    }
  }

  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise<Object|null>} User object or null if not found
   */
  static async findByEmail(email) {
    try {
      const user = await db.getAsync('SELECT * FROM users WHERE email = ?', [email]);
      return user || null;
    } catch (error) {
      Logger.error(`Error finding user by email: ${email}`, error);
      throw error;
    }
  }

  /**
   * Find user by Google ID
   * @param {string} googleId - Google ID
   * @returns {Promise<Object|null>} User object or null if not found
   */
  static async findByGoogleId(googleId) {
    try {
      const user = await db.getAsync('SELECT * FROM users WHERE google_id = ?', [googleId]);
      return user || null;
    } catch (error) {
      Logger.error(`Error finding user by Google ID: ${googleId}`, error);
      throw error;
    }
  }

  /**
   * Update user
   * @param {number} id - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated user object
   */
  static async update(id, updateData) {
    try {
      const allowedFields = ['name', 'email', 'picture'];
      const updates = [];
      const values = [];

      for (const [key, value] of Object.entries(updateData)) {
        if (allowedFields.includes(key)) {
          updates.push(`${key} = ?`);
          values.push(value);
        }
      }

      if (updates.length === 0) {
        return this.findById(id);
      }

      values.push(id);

      await db.runAsync(`
        UPDATE users
        SET ${updates.join(', ')}
        WHERE id = ?
      `, values);

      return this.findById(id);
    } catch (error) {
      Logger.error(`Error updating user ${id}`, error);
      throw error;
    }
  }
}

export default User;