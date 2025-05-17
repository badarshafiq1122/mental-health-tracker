import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { setupWebSocketServer } from './websocket/index.js';
import authRoutes from './routes/auth.js';
import logRoutes from './routes/logs.js';
import analyticsRoutes from './routes/analytics.js';
import exportRoutes from './routes/export.js';
import errorMiddleware from './middleware/error.js';
import Logger from './utils/logger.js';
import {
  HTTP_STATUS,
  API_PATHS,
  ENV,
  RATE_LIMIT
} from './config/constants.js';

/**
 * Load environment variables from .env file
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

if (!process.env.JWT_SECRET) {
  console.error('\x1b[31m%s\x1b[0m', '❌ ERROR: JWT_SECRET environment variable is not set.');
  console.error('   Please set a proper JWT_SECRET in your .env file.');
  process.exit(1);
}

/**
 * Express application instance
 * @type {express.Application}
 */
const app = express();
const isProduction = process.env.NODE_ENV === ENV.PRODUCTION;

/**
 * Security middleware configuration
 */
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

/**
 * Rate limiting to prevent abuse
 */
if (isProduction) {
  app.use(rateLimit({
    windowMs: RATE_LIMIT.WINDOW_MS,
    max: RATE_LIMIT.MAX_REQUESTS
  }));
}

/**
 * Request parsing middleware
 */
app.use(express.json({ limit: '10kb' })); // Body limit is 10kb
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

/**
 * Add request timestamp and logging
 */
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  Logger.debug(`${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

/**
 * API Routes
 */
app.use(API_PATHS.AUTH.BASE, authRoutes);
app.use(API_PATHS.LOGS.BASE, logRoutes);
app.use(API_PATHS.ANALYTICS.BASE, analyticsRoutes);
app.use(API_PATHS.EXPORT.BASE, exportRoutes);

/**
 * Health check endpoint for monitoring
 */
app.get(API_PATHS.HEALTH, (req, res) => {
  res.status(HTTP_STATUS.OK).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  });
});

/**
 * Handle undefined routes
 */
app.all('*', (req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} not found`);
  err.statusCode = HTTP_STATUS.NOT_FOUND;
  err.status = 'fail';
  next(err);
});

/**
 * Global error handling middleware
 * Must be registered after all routes
 */
app.use(errorMiddleware);

/**
 * Start the server and listen on the specified port
 */
let server;

const startServer = async () => {
  try {
    let PORT = process.env.PORT || 5000;

    const listen = (port) => {
      return new Promise((resolve, reject) => {
        const server = app.listen(port, () => {
          Logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
          resolve(server);
        });

        server.on('error', (err) => {
          if (err.code === 'EADDRINUSE') {
            Logger.warn(`Port ${port} is already in use`);
            reject(err);
          } else {
            reject(err);
          }
        });
      });
    };

    try {
      server = await listen(PORT);

      setupWebSocketServer(server);
      Logger.info('WebSocket server initialized');

      return server;
    } catch (err) {
      if (err.code === 'EADDRINUSE') {
        PORT = parseInt(PORT) + 1;
        Logger.info(`Trying alternative port: ${PORT}`);

        server = await listen(PORT);

        setupWebSocketServer(server);
        Logger.info('WebSocket server initialized');

        return server;
      } else {
        throw err;
      }
    }
  } catch (error) {
    Logger.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();

/**
 * Handle graceful shutdown
 */
process.on('SIGTERM', () => {
  Logger.info('SIGTERM signal received. Shutting down gracefully...');
  server.close(() => {
    Logger.info('Server closed.');
  });
});

process.on('unhandledRejection', (err) => {
  Logger.error('UNHANDLED REJECTION! Shutting down...', err);
  server.close(() => {
    process.exit(1);
  });
});

export { app };
