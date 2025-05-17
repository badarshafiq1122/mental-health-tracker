import { Stack, Paper, Typography, Box, Switch, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import PropTypes from 'prop-types';
import useThemeStore from '../../stores/themeStore';
import SettingsCard from './SettingsCard';

/**
 * Component for theme and appearance settings
 */
export default function AppearanceCard({ onSuccess }) {
  const theme = useTheme();
  const { darkMode, toggleDarkMode } = useThemeStore();

  /**
   * Toggle dark mode and show success message
   */
  const handleDarkModeToggle = () => {
    toggleDarkMode();
    onSuccess('Theme updated successfully');
  };

  return (
    <SettingsCard 
      title="User Preferences" 
      icon={<ColorLensIcon />}
      iconBgColor="primary.light"
    >
      <Stack spacing={3}>
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: 2,
            bgcolor: theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(0, 0, 0, 0.02)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            transition: 'background-color 0.2s ease',
            '&:hover': {
              bgcolor: theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(0, 0, 0, 0.04)'
            }
          }}
        >
          <Box>
            <Typography variant="subtitle1" fontWeight="medium">
              Dark Mode
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Switch between light and dark theme
            </Typography>
          </Box>
          <Tooltip title={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
            <Switch
              checked={darkMode}
              onChange={handleDarkModeToggle}
              color="primary"
              icon={<LightModeIcon sx={{ color: '#f9d71c' }} fontSize="small" />}
              checkedIcon={<DarkModeIcon sx={{ color: '#3a3c64' }} fontSize="small" />}
              sx={{ ml: 1 }}
              inputProps={{ 'aria-label': 'Toggle dark mode' }}
            />
          </Tooltip>
        </Paper>
      </Stack>
    </SettingsCard>
  );
}

AppearanceCard.propTypes = {
  onSuccess: PropTypes.func.isRequired
};