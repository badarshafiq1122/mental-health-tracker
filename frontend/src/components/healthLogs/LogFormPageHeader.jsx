import { Box, Typography, Alert } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Header component for log form pages with title and description
 */
export default function LogFormPageHeader({ isEditMode = false }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {isEditMode ? 'Edit Log' : 'Log Your Day'}
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Track your mental health by logging your daily experiences. This helps identify patterns and improve your well-being.
      </Typography>

      <Alert
        severity="info"
        sx={{
          mb: 3,
          borderRadius: 2,
          '& .MuiAlert-message': { width: '100%' }
        }}
      >
        <Typography variant="body2">
          Fill in today's data to generate insights about your mental health patterns. All fields with * are required.
        </Typography>
      </Alert>
    </Box>
  );
}

LogFormPageHeader.propTypes = {
  isEditMode: PropTypes.bool
};