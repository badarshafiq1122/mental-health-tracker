import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';

/**
 * Header component for login page with app title and icon
 */
export default function LoginHeader() {
  const theme = useTheme();

  return (
    <Box sx={{ textAlign: 'center', mb: 3 }}>
      <SelfImprovementIcon
        color="primary"
        sx={{ fontSize: 48, mb: 1 }}
      />
      <Typography
        component="h1"
        variant="h4"
        gutterBottom
        sx={{ fontWeight: 700, color: theme.palette.primary.main }}
      >
        Mental Health Tracker
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Track your daily mental wellbeing and discover insights to improve your mental health.
      </Typography>
    </Box>
  );
}