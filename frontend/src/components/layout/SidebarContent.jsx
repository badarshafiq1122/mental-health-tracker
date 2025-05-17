import {
  Box, Divider, List, Typography,
  Avatar, Badge
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import PropTypes from 'prop-types';
import NavigationItem from './NavigationItem';
import { getNavigationItems } from './navigationConfig';

/**
 * Sidebar content component with app logo, navigation items and user profile
 */
export default function SidebarContent({ user, currentPath }) {
  const theme = useTheme();
  const navigationItems = getNavigationItems();

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden'
    }}>
      {/* App Logo */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <SelfImprovementIcon color="primary" sx={{ fontSize: 32, mr: 1, flexShrink: 0 }} />
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: theme.palette.primary.main, whiteSpace: 'nowrap' }}>
          Mental Health
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Navigation Items */}
      <List component="nav" sx={{ px: 1, flexGrow: 1, overflow: 'auto' }}>
        {navigationItems.map((item) => (
          <NavigationItem
            key={item.text}
            item={item}
            isActive={currentPath === item.path}
            badge={item.text === 'Logs' ? { show: true, color: 'primary' } : null}
          />
        ))}
      </List>

      {/* User Profile (if logged in) */}
      {user && <UserProfileFooter user={user} />}
    </Box>
  );
}

SidebarContent.propTypes = {
  user: PropTypes.object,
  currentPath: PropTypes.string.isRequired
};

/**
 * User profile footer component shown at the bottom of the sidebar
 */
function UserProfileFooter({ user }) {
  const theme = useTheme();

  return (
    <Box sx={{ mt: 'auto', mx: 2, mb: 2 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 2,
          borderRadius: 2,
          bgcolor: `${theme.palette.primary.light}10`,
        }}
      >
        <Avatar
          src={user.picture}
          alt={user.name}
          sx={{
            width: 40,
            height: 40,
            mr: 1.5,
            flexShrink: 0,
            border: `2px solid ${theme.palette.primary.main}`
          }}
        >
          {!user.picture && user.name?.charAt(0)}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle2" noWrap>
            {user.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
            {user.email}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

UserProfileFooter.propTypes = {
  user: PropTypes.object.isRequired
};