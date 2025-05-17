import { Button, Box, Typography, Avatar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

/**
 * User profile button component in the header
 */
export default function UserProfileButton({ user, onClick }) {
  const theme = useTheme();

  return (
    <Button
      onClick={onClick}
      sx={{
        textTransform: 'none',
        borderRadius: 3,
        py: 0.5,
        px: 1.5,
        '&:hover': {
          bgcolor: theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.04)',
        }
      }}
    >
      <Avatar
        src={user.picture}
        alt={user.name}
        sx={{ width: 32, height: 32, mr: 1 }}
      >
        {!user.picture && user.name?.charAt(0)}
      </Avatar>
      <Box sx={{ textAlign: 'left', display: { xs: 'none', sm: 'block' } }}>
        <Typography variant="subtitle2" lineHeight={1.2}>
          {user.name?.split(' ')[0]}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Profile
        </Typography>
      </Box>
    </Button>
  );
}

UserProfileButton.propTypes = {
  user: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired
};