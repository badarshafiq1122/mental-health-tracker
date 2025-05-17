import { Box, Drawer } from '@mui/material';
import PropTypes from 'prop-types';
import { DRAWER_WIDTH } from './constants';
import SidebarContent from './SidebarContent';

/**
 * Sidebar component with responsive behavior
 */
export default function Sidebar({
  user,
  isMobile,
  drawerOpen,
  currentPath,
  onDrawerClose
}) {
  /**
   * Drawer content shared between mobile and desktop versions
   */
  const drawerContent = (
    <SidebarContent user={user} currentPath={currentPath} />
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
    >
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={onDrawerClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              borderRight: 0,
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          open
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              position: 'relative',
              height: '100vh',
              border: 'none',
              borderRight: `1px solid var(--divider-color)`,
              backgroundColor: 'var(--sidebar-background)',
              transition: 'background-color 0.3s ease',
              overflowX: 'hidden',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </Box>
  );
}

Sidebar.propTypes = {
  user: PropTypes.object,
  isMobile: PropTypes.bool.isRequired,
  drawerOpen: PropTypes.bool.isRequired,
  currentPath: PropTypes.string.isRequired,
  onDrawerClose: PropTypes.func.isRequired
};