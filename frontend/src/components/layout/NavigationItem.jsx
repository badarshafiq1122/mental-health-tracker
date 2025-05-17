import {
  ListItem, ListItemButton, ListItemIcon,
  ListItemText, Badge
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

/**
 * Navigation item component for the sidebar
 */
export default function NavigationItem({ item, isActive, badge }) {
  const theme = useTheme();
  const Icon = item.icon;
  console.log("🚀 ~ NavigationItem ~ Icon:", Icon)

  return (
    <ListItem disablePadding sx={{ mb: 1 }}>
      <ListItemButton
        component={Link}
        to={item.path}
        selected={isActive}
        sx={{
          borderRadius: '10px',
          '&.Mui-selected': {
            bgcolor: `${theme.palette.primary.light}20`,
            color: theme.palette.primary.main,
            '&:hover': {
              bgcolor: `${theme.palette.primary.light}30`,
            },
          },
          '&:hover': {
            bgcolor: theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.08)'
              : 'rgba(0, 0, 0, 0.04)',
          },
          py: 1.5,
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 40,
            color: isActive
              ? theme.palette.primary.main
              : theme.palette.text.secondary,
          }}
        >
          <Icon fontSize="small" />
        </ListItemIcon>
        <ListItemText
          primary={item.text}
          primaryTypographyProps={{
            fontWeight: isActive ? 600 : 400,
          }}
        />
        {badge && (
          <Badge
            color={badge.color || "primary"}
            variant="dot"
            invisible={!badge.show}
            sx={{ ml: 1 }}
          />
        )}
      </ListItemButton>
    </ListItem>
  );
}

NavigationItem.propTypes = {
  item: PropTypes.shape({
    text: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,
    path: PropTypes.string.isRequired
  }).isRequired,
  isActive: PropTypes.bool.isRequired,
  badge: PropTypes.shape({
    show: PropTypes.bool.isRequired,
    color: PropTypes.string
  })
};