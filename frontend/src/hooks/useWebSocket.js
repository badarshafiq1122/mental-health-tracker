import { useState, useEffect, useCallback, useRef } from 'react';
import { connectWebSocket, disconnectWebSocket, sendWebSocketMessage, getWebSocketState } from '../services/websocket';
import useAuthStore from '../stores/authStore';
import { WS_MESSAGE_TYPES } from '../utils/constants';

let subscribers = [];
let globalLastMessage = null;
let globalIsConnected = false;
let globalError = null;
let connectionAttemptInProgress = false;

/**
 * Custom hook for WebSocket functionality
 * Implements a singleton pattern to prevent multiple connections
 * @returns {Object} WebSocket state and functions
 */
const useWebSocket = () => {
  const { token } = useAuthStore();
  const [isConnected, setIsConnected] = useState(globalIsConnected);
  const [lastMessage, setLastMessage] = useState(globalLastMessage);
  const [error, setError] = useState(globalError);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const componentIdRef = useRef(Math.random().toString(36).substring(7));

  /**
   * Handle incoming WebSocket messages
   * @param {Object} data - Message data from WebSocket
   */
  const handleMessage = useCallback((data) => {

    globalLastMessage = data;
    subscribers.forEach(sub => sub.onMessage?.(data));

    switch (data.type) {
      case WS_MESSAGE_TYPES.CONNECTION_SUCCESS:
        globalIsConnected = true;
        globalError = null;
        subscribers.forEach(sub => {
          sub.onConnectionChange?.(true);
          sub.onErrorChange?.(null);
        });
        break;
      case WS_MESSAGE_TYPES.CONNECTION_ERROR:
        globalError = data.message || 'Connection error';
        subscribers.forEach(sub => sub.onErrorChange?.(globalError));
        break;
      case WS_MESSAGE_TYPES.ERROR:
        globalError = data.message || 'WebSocket error';
        subscribers.forEach(sub => sub.onErrorChange?.(globalError));
        break;
      case WS_MESSAGE_TYPES.PONG:
        globalIsConnected = true;
        subscribers.forEach(sub => sub.onConnectionChange?.(true));
        break;
      case WS_MESSAGE_TYPES.LOG_CREATE:
      case WS_MESSAGE_TYPES.LOG_UPDATE:
      case WS_MESSAGE_TYPES.LOG_DELETE:
        break;
      default:
        break;
    }
  }, []);

  /**
   * Connect to WebSocket server
   */
  const connect = useCallback(() => {
    if (!token || connectionAttemptInProgress) {
      return;
    }

    try {
      connectionAttemptInProgress = true;
      setIsReconnecting(true);
      const wsState = getWebSocketState();

      if (wsState !== 1 && wsState !== 0) {
        connectWebSocket(token, handleMessage);
      }
    } catch (err) {
      globalError = `WebSocket connection error: ${err.message}`;
      subscribers.forEach(sub => sub.onErrorChange?.(globalError));
    } finally {
      setTimeout(() => {
        connectionAttemptInProgress = false;
        setIsReconnecting(false);
      }, 1000);
    }
  }, [token, handleMessage]);

  const processMessageRef = useRef({});
  const processMessage = useCallback((message) => {
    const messageKey = `${message.type}-${message.timestamp || Date.now()}`;

    if (processMessageRef.current[messageKey]) return;

    processMessageRef.current[messageKey] = true;

    setTimeout(() => {
      delete processMessageRef.current[messageKey];
    }, 5000);

    handleMessage(message);
  }, [handleMessage]);

  useEffect(() => {
    const subscriber = {
      id: componentIdRef.current,
      onMessage: (data) => setLastMessage(data),
      onConnectionChange: (status) => setIsConnected(status),
      onErrorChange: (err) => setError(err)
    };

    subscribers.push(subscriber);

    setIsConnected(globalIsConnected);
    setLastMessage(globalLastMessage);
    setError(globalError);

    if (token && getWebSocketState() !== 1 && !connectionAttemptInProgress) {
      connect();
    }

    return () => {
      subscribers = subscribers.filter(sub => sub.id !== componentIdRef.current);

      if (subscribers.length === 0) {
        disconnectWebSocket();
        globalIsConnected = false;
        globalLastMessage = null;
        globalError = null;
      }
    };
  }, [token, connect]);

  /**
   * Send message through WebSocket
   * @param {string} type - Message type
   * @param {Object} data - Message data
   * @returns {boolean} - Whether message was sent
   */
  const sendMessage = useCallback((type, data = {}) => {
    return sendWebSocketMessage({
      type,
      ...data,
      timestamp: new Date().toISOString()
    });
  }, []);

  return {
    isConnected,
    lastMessage,
    error,
    sendMessage,
    connect,
    isReconnecting
  };
};

export default useWebSocket;