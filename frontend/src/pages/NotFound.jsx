import { Box, Button, Typography, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function NotFound() {
  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', py: 8 }}>
      <ErrorOutlineIcon sx={{ fontSize: 100, color: 'warning.main', mb: 4 }} />
      <Typography variant="h2" component="h1" gutterBottom>
        404: Page Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        The page you're looking for doesn't exist or has been moved.
      </Typography>
      <Button component={Link} to="/" variant="contained" sx={{ mt: 2 }}>
        Return to Dashboard
      </Button>
    </Container>
  );
}