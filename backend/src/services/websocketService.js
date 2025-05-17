import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import Logger from '../utils/logger.js';
import { WS_MESSAGE_TYPES, WS_CLOSE_CODES, WEBSOCKET } from '../config/constants.js';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  Logger.error('JWT_SECRET is not set in the environment variables');
  throw new Error('JWT_SECRET must be provided for WebSocket authentication');
}

/**
 * @class WebSocketService
 * @description Service for handling WebSocket operations
 */
class WebSocketService {
  static wss = null;
  static pingInterval = null;

  /**
   * Authenticate WebSocket connection using JWT token
   * @param {WebSocket} ws - WebSocket connection
   * @param {string} token - JWT token
   * @returns {Promise<number|null>} User ID if authenticated, null otherwise
   */
  static async authenticateConnection(ws, token) {
    if (!token) {
      Logger.warn('Missing authentication token in WebSocket connection');
      return null;
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      if (!decoded || !decoded.id) {
        Logger.warn('Invalid token format in WebSocket connection');
        return null;
      }

      return decoded.id;
    } catch (error) {
      Logger.error('Failed to authenticate WebSocket connection', error);
      return null;
    }
  }

  /**
   * Send message to WebSocket client
   * @param {WebSocket} ws - WebSocket client
   * @param {string} type - Message type
   * @param {object} [data] - Message data
   * @returns {boolean} Success status
   */
  static sendMessage(ws, type, data = {}) {
    if (ws.readyState === 1) {
      try {
        const message = {
          type,
          ...data,
          timestamp: new Date().toISOString()
        };

        Logger.debug(`Sending WebSocket message: ${type}`, message);

        ws.send(JSON.stringify(message));
        return true;
      } catch (error) {
        Logger.error('Error sending WebSocket message', error);
        return false;
      }
    }
    return false;
  }

  /**
   * Broadcast message to all users or specific user
   * @param {string} type - Message type
   * @param {object} data - Message data
   * @param {number|null} [userId=null] - Specific user ID or null for all users
   * @returns {number} Number of clients that received the message
   */
  static broadcastMessage(type, data, userId = null) {
    if (!WebSocketService.wss) {
      Logger.warn('No WebSocket server instance available for broadcasting');
      return 0;
    }

    Logger.debug(`Broadcasting ${type} message to ${userId ? `user ${userId}` : 'all users'}`);

    let count = 0;

    try {
      WebSocketService.wss.clients.forEach(client => {
        if (client.readyState !== 1) {
          return;
        }

        if (userId !== null && client.userId !== userId) {
          return;
        }

        try {
          const message = {
            type,
            ...data,
            timestamp: new Date().toISOString()
          };


          Logger.debug(`Sending message to client ${client.userId || 'unknown'}:`, JSON.stringify(message));

          client.send(JSON.stringify(message));
          count++;
        } catch (error) {
          Logger.error(`Error sending WebSocket message to client: ${error.message}`);
        }
      });

      if (count > 0) {
        Logger.debug(`Successfully sent ${type} message to ${count} clients`);
      } else {
        Logger.debug(`No clients received the ${type} message`);
      }
    } catch (e) {
      Logger.error(`Error in broadcastMessage: ${e.message}`);
    }

    return count;
  }

  /**
   * Send a ping message to check if clients are still alive
   */
  static heartbeat() {
    if (!WebSocketService.wss) return;

    Logger.debug('Sending heartbeat to all connected clients');

    WebSocketService.wss.clients.forEach(ws => {
      if (ws.isAlive === false) {
        Logger.debug('Terminating inactive WebSocket connection');
        return ws.terminate();
      }

      ws.isAlive = false;

      try {
        WebSocketService.sendMessage(ws, WS_MESSAGE_TYPES.PING);
      } catch (e) {
        Logger.error('Error sending heartbeat ping', e);
      }
    });
  }

  /**
   * Setup WebSocket server
   *
   * @param {http.Server} server - HTTP server instance
   * @returns {WebSocketServer} WebSocket server instance
   */
  static setupWebSocketServer(server) {
    Logger.info('Initializing WebSocket server');

    WebSocketService.wss = new WebSocketServer({
      server,
      perMessageDeflate: {
        zlibDeflateOptions: {
          chunkSize: 1024,
          memLevel: 7,
          level: 3
        },
        zlibInflateOptions: {
          chunkSize: 10 * 1024
        },
        clientNoContextTakeover: true,
        serverNoContextTakeover: true,
        serverMaxWindowBits: 10,
        concurrencyLimit: 10,
        threshold: 1024
      }
    });

    const pingInterval = setInterval(WebSocketService.heartbeat, 30000);

    WebSocketService.wss.on('connection', (ws, req) => {
      ws.isAlive = true;

      const url = new URL(req.url, `http://${req.headers.host}`);
      const token = url.searchParams.get('token');

      Logger.info('WebSocket client connected');

      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message.toString());
          Logger.debug('Received WebSocket message', data);

          if (data.type === WS_MESSAGE_TYPES.PONG) {
            ws.isAlive = true;
            return;
          }
        } catch (error) {
          Logger.error('Error processing WebSocket message', error);
          WebSocketService.sendMessage(ws, WS_MESSAGE_TYPES.ERROR, {
            message: 'Error processing message'
          });
        }
      });

      WebSocketService.authenticateConnection(ws, token)
        .then(userId => {
          if (!userId) {
            ws.close(WS_CLOSE_CODES.POLICY_VIOLATION, 'Authentication failed');
            return;
          }

          ws.userId = userId;
          Logger.info(`Authenticated WebSocket for user: ${userId}`);

          WebSocketService.sendMessage(ws, WS_MESSAGE_TYPES.CONNECTION_SUCCESS, {
            message: 'Connection established'
          });
        })
        .catch(error => {
          Logger.error('WebSocket authentication error', error);
          ws.close(WS_CLOSE_CODES.POLICY_VIOLATION, 'Authentication failed');
        });

      ws.on('close', (code, reason) => {
        Logger.info(`WebSocket disconnected: ${code} - ${reason || ''}`);
      });

      ws.on('error', (error) => {
        Logger.error('WebSocket error', error);
      });
    });

    WebSocketService.wss.on('close', () => {
      Logger.info('WebSocket server closed');
      clearInterval(pingInterval);
    });

    return WebSocketService.wss;
  }

  /**
   * Get the WebSocket server instance
   * @returns {WebSocketServer|null} WebSocket server instance or null if not initialized
   */
  static getWss() {
    return WebSocketService.wss;
  }
}

export default WebSocketService;