import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';

/**
 * Main content area component that renders the page content
 */
export default function MainContent() {
  return (
    <Box
      component="main"
      sx={{
        backgroundColor: 'var(--background-color)',
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        transition: 'background-color 0.3s ease',
      }}
    >
      <Toolbar />
      <Box sx={{ p: { xs: 2, md: 3 }, flexGrow: 1 }}>
        <Outlet />
      </Box>
    </Box>
  );
}