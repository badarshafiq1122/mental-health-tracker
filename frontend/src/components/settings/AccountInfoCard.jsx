import { Grid, Paper, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import useAuthStore from '../../stores/authStore';
import SettingsCard from './SettingsCard';

/**
 * Component for displaying user account information
 */
export default function AccountInfoCard() {
  const theme = useTheme();
  const { user } = useAuthStore();

  return (
    <SettingsCard 
      title="Account Information" 
      icon={<PersonIcon />}
      iconBgColor="secondary.light"
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(0, 0, 0, 0.02)',
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Name
                </Typography>
                <Typography variant="subtitle1" fontWeight="medium">
                  {user?.name || 'Not available'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Email
                </Typography>
                <Typography variant="subtitle1" fontWeight="medium">
                  {user?.email || 'Not available'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </SettingsCard>
  );
}