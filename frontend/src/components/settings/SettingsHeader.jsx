import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SettingsIcon from '@mui/icons-material/Settings';

/**
 * Settings page header component
 */
export default function SettingsHeader() {
  const theme = useTheme();

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      mb: 4
    }}>
      <SettingsIcon
        sx={{
          fontSize: 32,
          mr: 2,
          color: theme.palette.primary.main
        }}
      />
      <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
        Settings
      </Typography>
    </Box>
  );
}