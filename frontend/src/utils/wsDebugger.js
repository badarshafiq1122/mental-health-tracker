/**
 * Utility for debugging WebSocket connections
 */

/**
 * Log WebSocket state changes
 * @param {WebSocket} ws - WebSocket instance
 */
export const attachWebSocketDebugger = (ws) => {
  if (!ws) return;

  const stateLabels = {
    0: 'CONNECTING',
    1: 'OPEN',
    2: 'CLOSING',
    3: 'CLOSED'
  };

  const originalOnOpen = ws.onopen;
  ws.onopen = (event) => {
    if (originalOnOpen) originalOnOpen.call(ws, event);
  };

  const originalOnClose = ws.onclose;
  ws.onclose = (event) => {
    console.log('%c[WS] Connection closed', 'color: orange', event.code, event.reason);
    if (originalOnClose) originalOnClose.call(ws, event);
  };

  const originalOnError = ws.onerror;
  ws.onerror = (event) => {
    console.error('%c[WS] Error occurred', 'color: red', event);
    if (originalOnError) originalOnError.call(ws, event);
  };

  const originalOnMessage = ws.onmessage;
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
    } catch (e) {
    }
    if (originalOnMessage) originalOnMessage.call(ws, event);
  };

  const originalSend = ws.send;
  ws.send = function(data) {
    try {
    } catch (e) {
      console.error('%c[WS] Sending raw message', 'color: purple', data);
    }
    originalSend.call(ws, data);
  };

  return ws;
};