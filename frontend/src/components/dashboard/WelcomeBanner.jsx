import { Box, Typography, Button, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

export default function WelcomeBanner({ user }) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <Paper
      elevation={0}
      className="dashboard-welcome-banner"
      sx={{
        p: 4,
        mb: 4,
        borderRadius: 3,
        background: 'var(--welcome-gradient)',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'center' },
        color: 'var(--text-primary)',
      }}
    >
      <Box sx={{ mb: { xs: 2, md: 0 } }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }} gutterBottom>
          {`${getGreeting()}, ${user?.name?.split(' ')[0] || 'User'}!`}
        </Typography>
        <Typography variant="body1">
          {user?.lastLog
            ? "You've logged your mental health today. Great job staying consistent!"
            : "Track your mental health today to gain insights about your wellbeing."}
        </Typography>
      </Box>

      {!user?.lastLog && (
        <Button
          component={Link}
          to={ROUTES.LOGS.NEW}
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          sx={{
            mt: { xs: 2, md: 0 },
            fontWeight: 600,
            borderRadius: 2,
            boxShadow: 'none',
            px: 3,
            py: 1,
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          Log Added Today
        </Button>
      )}
    </Paper>
  );
}