import dotenv from 'dotenv';
import Logger from '../utils/logger.js';
import User from '../models/User.js';
import Log from '../models/Log.js';
import DbService from '../services/dbService.js';
import { DB_TABLES } from '../config/constants.js';
import db from './index.js';

dotenv.config();

/**
 * Seed the database with initial data
 */
async function seedDatabase() {
  try {
    Logger.info('Starting database seeding...');

    await new Promise(resolve => {
      const checkTables = async () => {
        try {
          const userTableExists = await db.getAsync(`
            SELECT name FROM sqlite_master
            WHERE type='table' AND name=?`,
            [DB_TABLES.USERS]
          );

          const logTableExists = await db.getAsync(`
            SELECT name FROM sqlite_master
            WHERE type='table' AND name=?`,
            [DB_TABLES.LOGS]
          );

          if (userTableExists && logTableExists) {
            resolve();
          } else {
            setTimeout(checkTables, 100);
          }
        } catch (err) {
          Logger.error('Error checking tables', err);
          setTimeout(checkTables, 100);
        }
      };

      checkTables();
    });

    await DbService.run(`DELETE FROM ${DB_TABLES.LOGS}`);
    await DbService.run(`DELETE FROM ${DB_TABLES.USERS}`);

    const testUser = {
      email: 'test@example.com',
      name: 'Test User',
      google_id: 'test123',
      picture: 'https://ui-avatars.com/api/?name=Test+User'
    };

    const userId = await User.create(testUser);

    Logger.info(`Created test user with ID: ${userId}`);

    const today = new Date();
    const logs = [
      {
        date: new Date().toISOString().split('T')[0],
        mood_rating: 8,
        anxiety_level: 3,
        sleep_hours: 7.5,
        sleep_quality: 'good',
        physical_activity_type: 'walking',
        physical_activity_duration: 30,
        social_interactions: 5,
        stress_level: 4,
        depression_symptoms: 'mild fatigue',
        anxiety_symptoms: 'occasional worry',
        notes: 'Had a productive day overall'
      },
      {
        date: new Date(today.setDate(today.getDate() - 1)).toISOString().split('T')[0],
        mood_rating: 6,
        anxiety_level: 5,
        sleep_hours: 6.5,
        sleep_quality: 'fair',
        physical_activity_type: 'yoga',
        physical_activity_duration: 20,
        social_interactions: 3,
        stress_level: 6,
        depression_symptoms: 'low energy',
        anxiety_symptoms: 'restlessness',
        notes: 'Work was stressful today'
      },
      {
        date: new Date(today.setDate(today.getDate() - 1)).toISOString().split('T')[0],
        mood_rating: 9,
        anxiety_level: 2,
        sleep_hours: 8,
        sleep_quality: 'excellent',
        physical_activity_type: 'running',
        physical_activity_duration: 45,
        social_interactions: 7,
        stress_level: 3,
        depression_symptoms: 'none',
        anxiety_symptoms: 'minimal',
        notes: 'Great day, spent time outdoors'
      }
    ];

    for (const logData of logs) {
      await Log.create({
        user_id: userId,
        ...logData
      });
    }

    Logger.info('Database seeding completed successfully!');
    Logger.info(`Created test user: ${testUser.email}`);
    Logger.info(`Added ${logs.length} sample logs`);

    process.exit(0);
  } catch (error) {
    Logger.error('Error seeding database', error);
    process.exit(1);
  }
}

seedDatabase();