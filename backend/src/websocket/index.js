import WebSocketService from '../services/websocketService.js';

export const setupWebSocketServer = WebSocketService.setupWebSocketServer;
export const getWss = WebSocketService.getWss;
export const sendMessage = WebSocketService.sendMessage;
export const broadcastMessage = WebSocketService.broadcastMessage;

/**
 * Initialize WebSocket server
 * @param {http.Server} server - HTTP server instance
 */
export const initializeWebSocketServer = (server) => {
  WebSocketService.setupWebSocketServer(server);
};
