import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';
import { DB_TABLES } from '../config/constants.js';
import Logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = process.env.DATABASE_PATH || path.resolve(__dirname, '../../database.sqlite');

/**
 * SQLite database instance with verbose mode for debugging
 */
const sqlite = sqlite3.verbose();
const db = new sqlite.Database(DB_PATH, (err) => {
  if (err) {
    Logger.error('Error connecting to database', err);
  } else {
    Logger.info(`Connected to SQLite database at ${DB_PATH}`);
    initDb();
  }
});

db.runAsync = promisify(db.run.bind(db));
db.getAsync = promisify(db.get.bind(db));
db.allAsync = promisify(db.all.bind(db));

/**
 * Initialize database schema
 * Creates tables if they don't exist
 */
async function initDb() {
  try {
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS ${DB_TABLES.USERS} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        google_id TEXT UNIQUE,
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        picture TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS ${DB_TABLES.LOGS} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        mood_rating INTEGER,
        anxiety_level INTEGER,
        sleep_hours REAL,
        sleep_quality TEXT,
        physical_activity_type TEXT,
        physical_activity_duration INTEGER,
        social_interactions INTEGER,
        stress_level INTEGER,
        depression_symptoms TEXT,
        anxiety_symptoms TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES ${DB_TABLES.USERS} (id),
        UNIQUE(user_id, date)
      )
    `);

    Logger.info('Database initialized successfully');
  } catch (err) {
    Logger.error('Error initializing database', err);
  }
}

export default db;
