import { useState } from 'react';
import { Box, Grid } from '@mui/material';
import {
  SettingsHeader,
  AlertFeedback,
  AppearanceCard,
  AccountInfoCard,
  DataExportCard
} from '../components/settings';

/**
 * Settings page component
 * Handles user preferences and account settings
 */
export default function Settings() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Handles displaying success messages and auto-clearing them
   * @param {string} message - Success message to display
   */
  const handleSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(false), 3000);
  };

  /**
   * Handles displaying error messages
   * @param {string} message - Error message to display
   */
  const handleError = (message) => {
    setError(message);
  };

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
      <SettingsHeader />

      <AlertFeedback
        success={success}
        error={error}
        onSuccessDismiss={() => setSuccess(false)}
        onErrorDismiss={() => setError(null)}
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <AppearanceCard onSuccess={handleSuccess} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Grid container spacing={3} direction="column">
            <Grid item xs={12}>
              <AccountInfoCard />
            </Grid>

            <Grid item xs={12}>
              <DataExportCard
                onSuccess={handleSuccess}
                onError={handleError}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}