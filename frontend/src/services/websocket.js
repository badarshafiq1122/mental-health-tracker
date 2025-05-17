/**
 * WebSocket Service
 * Handles real-time communication with the backend
 */

import { attachWebSocketDebugger } from '../utils/wsDebugger';
import { WS_MESSAGE_TYPES } from '../utils/constants';

let ws = null;
let reconnectInterval = null;
let messageHandler = null;
let reconnectCount = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_RESET_TIMEOUT = 30000;
let connectionInProgress = false;

/**
 * Get the current WebSocket connection state
 * @returns {number} WebSocket state (0=CONNECTING, 1=OPEN, 2=CLOSING, 3=CLOSED, -1=NOT_INITIALIZED)
 */
export const getWebSocketState = () => {
  if (!ws) return -1;
  return ws.readyState;
};

/**
 * Connect to WebSocket server
 * @param {string} token - JWT authentication token
 * @param {Function} onMessage - Callback function for handling messages
 * @returns {WebSocket|null} WebSocket instance or null if connection failed
 */
export const connectWebSocket = (token, onMessage) => {
  if (!token) {
    console.warn('Cannot connect to WebSocket: No authentication token provided');
    return null;
  }

  if (connectionInProgress) {
    console.info('WebSocket connection already in progress');
    return ws;
  }

  if (ws && ws.readyState === 1) {
    console.info('WebSocket already connected, reusing existing connection');
    messageHandler = onMessage;
    return ws;
  }

  if (ws && ws.readyState !== 1) {
    try {
      disconnectWebSocket();
    } catch (e) {
      console.warn('Error closing existing WebSocket connection:', e);
    }
  }

  try {
    connectionInProgress = true;
    console.info('Connecting to WebSocket server...');

    const WS_URL = `${import.meta.env.VITE_WS_URL || 'ws://localhost:5001'}?token=${token}`;
    ws = new WebSocket(WS_URL);
    messageHandler = onMessage;

    if (import.meta.env.DEV) {
      ws = attachWebSocketDebugger(ws);
    }

    setTimeout(() => {
      connectionInProgress = false;
    }, 5000);

    ws.onopen = () => {
      console.info('WebSocket connected');
      connectionInProgress = false;
      reconnectCount = 0;

      if (reconnectInterval) {
        clearTimeout(reconnectInterval);
        reconnectInterval = null;
      }

      setTimeout(() => {
        if (ws && ws.readyState === 1) {
          sendWebSocketMessage({ type: WS_MESSAGE_TYPES.PING });
        }
      }, 1000);
    };

    ws.onclose = (event) => {
      console.info(`WebSocket disconnected: ${event.code} - ${event.reason || 'No reason provided'}`);
      connectionInProgress = false;

      if (event.code === 1000 || event.code === 1001 || reconnectCount >= MAX_RECONNECT_ATTEMPTS) {
        if (reconnectCount >= MAX_RECONNECT_ATTEMPTS) {
          console.warn('Maximum WebSocket reconnection attempts reached');

          setTimeout(() => {
            reconnectCount = 0;
          }, RECONNECT_RESET_TIMEOUT);
        }
        return;
      }

      const delay = Math.min(1000 * Math.pow(2, reconnectCount), 10000);
      reconnectCount++;

      console.info(`WebSocket reconnect attempt ${reconnectCount}/${MAX_RECONNECT_ATTEMPTS} in ${delay}ms`);

      if (reconnectInterval) {
        clearTimeout(reconnectInterval);
      }

      reconnectInterval = setTimeout(() => {
        if (token && messageHandler && reconnectCount <= MAX_RECONNECT_ATTEMPTS) {
          console.info('Attempting to reconnect WebSocket...');
          connectWebSocket(token, messageHandler);
        } else {
          console.warn('Cannot reconnect: missing token or message handler or max attempts reached');
          clearTimeout(reconnectInterval);
          reconnectInterval = null;
        }
      }, delay);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === WS_MESSAGE_TYPES.PING) {
          sendWebSocketMessage({ type: WS_MESSAGE_TYPES.PONG });
        }

        if (messageHandler) {
          messageHandler(data);
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.warn('WebSocket error:', error);
      connectionInProgress = false;
    };

    return ws;
  } catch (error) {
    console.error('Error creating WebSocket connection:', error);
    connectionInProgress = false;
    return null;
  }
};

/**
 * Disconnect from WebSocket server
 */
export const disconnectWebSocket = () => {
  console.log('Disconnecting WebSocket...');

  if (ws) {
    if (ws.readyState === 1) {
      ws.close(1000, "Normal closure");
    } else if (ws.readyState === 0) {
      ws.close(1000, "Cancelled connection attempt");
    }
    ws = null;
  }

  if (reconnectInterval) {
    clearTimeout(reconnectInterval);
    reconnectInterval = null;
  }

  messageHandler = null;
  connectionInProgress = false;
};

/**
 * Send message through WebSocket
 * @param {Object} data - Message data to send
 * @returns {boolean} - True if message was sent, false otherwise
 */
export const sendWebSocketMessage = (data) => {
  if (ws && ws.readyState === 1) {
    try {
      ws.send(JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Error sending WebSocket message:', e);
      return false;
    }
  }
  return false;
};
