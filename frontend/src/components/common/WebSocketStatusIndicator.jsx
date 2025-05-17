import { useState, useEffect } from 'react';
import { Box, Tooltip, CircularProgress } from '@mui/material';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';

/**
 * WebSocket status indicator component with debounce to prevent flickering
 * @param {Object} props - Component props
 * @param {boolean} props.isConnected - Whether WebSocket is connected
 * @returns {JSX.Element} Status indicator component
 */
const WebSocketStatusIndicator = ({ isConnected, reconnecting = false }) => {
  const [displayConnected, setDisplayConnected] = useState(isConnected);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [isReconnecting, setIsReconnecting] = useState(reconnecting);

  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    if (isConnected) {
      setDisplayConnected(true);
      setIsReconnecting(false);
    } else {
      if (reconnecting) {
        setIsReconnecting(true);
      }

      const timeout = setTimeout(() => {
        setDisplayConnected(false);
      }, 1500);
      setDebounceTimeout(timeout);
    }

    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [isConnected, reconnecting]);

  if (isReconnecting) {
    return (
      <Tooltip title="Reconnecting...">
        <Box
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            bgcolor: 'warning.main',
            color: 'white',
            borderRadius: '50px',
            px: 1.5,
            py: 0.5,
            fontSize: '0.75rem',
            zIndex: 1000,
            opacity: 0.8,
          }}
        >
          <CircularProgress size={14} color="inherit" sx={{ mr: 0.5 }} />
          Reconnecting
        </Box>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={displayConnected ? 'Live updates connected' : 'Live updates disconnected'}>
      <Box
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          bgcolor: displayConnected ? 'success.main' : 'error.main',
          color: 'white',
          borderRadius: '50px',
          px: 1.5,
          py: 0.5,
          fontSize: '0.75rem',
          zIndex: 1000,
          opacity: 0.7,
          transition: 'opacity 0.2s ease-in-out, background-color 0.5s ease',
          '&:hover': {
            opacity: 1
          }
        }}
      >
        {displayConnected ? (
          <WifiIcon fontSize="small" sx={{ mr: 0.5 }} />
        ) : (
          <WifiOffIcon fontSize="small" sx={{ mr: 0.5 }} />
        )}
        {displayConnected ? 'Live' : 'Offline'}
      </Box>
    </Tooltip>
  );
};

export default WebSocketStatusIndicator;