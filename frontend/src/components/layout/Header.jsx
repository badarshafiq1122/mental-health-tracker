import {
  AppBar, Toolbar, IconButton, Typography, Box,
  Button, Avatar, Menu, MenuItem, ListItemIcon,
  ListItemText, Divider
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import PropTypes from 'prop-types';
import { ROUTES } from '../../utils/constants';
import UserProfileButton from './UserProfileButton';

/**
 * Header component with app bar, title, and user profile menu
 */
export default function Header({
  isMobile,
  user,
  anchorEl,
  onDrawerToggle,
  onProfileMenuOpen,
  onProfileMenuClose,
  onLogout
}) {
  const theme = useTheme();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: 'var(--header-background)',
        color: 'var(--header-text)',
        borderBottom: `1px solid var(--divider-color)`,
        backdropFilter: 'blur(8px)',
        transition: 'background-color 0.3s ease, color 0.3s ease',
      }}
    >
      <Toolbar>
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
            fontWeight: 600
          }}
        >
          <SelfImprovementIcon sx={{ mr: 1, fontSize: 28, color: theme.palette.primary.main }} />
          Mental Health Tracker
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {user ? (
            <UserProfileButton
              user={user}
              onClick={onProfileMenuOpen}
            />
          ) : (
            <Button
              component={Link}
              to={ROUTES.LOGIN}
              variant="contained"
              color="primary"
              sx={{ borderRadius: 3, px: 3 }}
            >
              Login
            </Button>
          )}

          <ProfileMenu
            anchorEl={anchorEl}
            onClose={onProfileMenuClose}
            onLogout={onLogout}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  user: PropTypes.object,
  anchorEl: PropTypes.object,
  onDrawerToggle: PropTypes.func.isRequired,
  onProfileMenuOpen: PropTypes.func.isRequired,
  onProfileMenuClose: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired
};

/**
 * Profile dropdown menu component
 */
function ProfileMenu({ anchorEl, onClose, onLogout }) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      PaperProps={{
        elevation: 1,
        sx: {
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.08))',
          mt: 1.5,
          borderRadius: 2,
          minWidth: 180,
          '& .MuiMenuItem-root': {
            px: 2,
            py: 1.5,
          }
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <MenuItem component={Link} to={ROUTES.SETTINGS}>
        <ListItemIcon>
          <AccountCircleIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText
          primary="Profile & Settings"
          primaryTypographyProps={{ fontSize: '0.9rem' }}
        />
      </MenuItem>
      <Divider />
      <MenuItem onClick={onLogout}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText
          primary="Logout"
          primaryTypographyProps={{ fontSize: '0.9rem' }}
        />
      </MenuItem>
    </Menu>
  );
}

ProfileMenu.propTypes = {
  anchorEl: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired
};