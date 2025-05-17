import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Box, CssBaseline, useMediaQuery, useTheme } from '@mui/material';
import useAuthStore from '../../stores/authStore';
import useWebSocket from '../../hooks/useWebSocket';
import Header from './Header';
import Sidebar from './Sidebar';
import MainContent from './MainContent';

/**
 * Main Layout Component
 * Provides the overall page structure with header, sidebar and content area
 */
export default function Layout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout } = useAuthStore();
  const { isAuthenticated } = useAuthStore();
  const { isConnected, connect } = useWebSocket();

  /**
   * Connect to WebSocket when user is authenticated
   */
  useEffect(() => {
    if (isAuthenticated && !isConnected) {
      connect();
    }
  }, [isAuthenticated, isConnected, connect]);

  /**
   * Handle responsive drawer state based on screen size
   */
  useEffect(() => {
    if (isMobile && drawerOpen) {
      setDrawerOpen(false);
    } else if (!isMobile && !drawerOpen) {
      setDrawerOpen(true);
    }
  }, [isMobile]);

  /**
   * Toggle drawer open/closed (for mobile)
   */
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  /**
   * Handle profile menu open
   */
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Handle profile menu close
   */
  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  /**
   * Handle user logout and redirect to login
   */
  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />

      <Header
        isMobile={isMobile}
        user={user}
        anchorEl={anchorEl}
        onDrawerToggle={handleDrawerToggle}
        onProfileMenuOpen={handleProfileMenuOpen}
        onProfileMenuClose={handleProfileMenuClose}
        onLogout={handleLogout}
      />

      <Sidebar
        user={user}
        isMobile={isMobile}
        drawerOpen={drawerOpen}
        currentPath={location.pathname}
        onDrawerClose={handleDrawerToggle}
      />

      <MainContent />
    </Box>
  );
}