import { Typography } from '@mui/material';

/**
 * Dashboard header component with title
 */
export default function DashboardHeader() {
  return (
    <Typography 
      variant="h4" 
      gutterBottom 
      fontWeight="bold" 
      color="primary"
    >
      Dashboard
    </Typography>
  );
}