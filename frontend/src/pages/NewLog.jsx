import { Box, Typography, Paper, Container } from '@mui/material';
import NewLogForm from '../components/healthLogs/NewLogForm';
import LogFormPageHeader from '../components/healthLogs/LogFormPageHeader';

/**
 * New Log page component
 * Page for creating a new daily health log with improved UI layout and organization
 */
export default function NewLog() {
  return (
    <Container maxWidth="md" sx={{ pb: 4 }}>
      <LogFormPageHeader />
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          overflow: 'hidden'
        }}
      >
        <NewLogForm />
      </Paper>
    </Container>
  );
}