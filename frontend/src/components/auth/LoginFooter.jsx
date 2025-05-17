import { Typography } from '@mui/material';

/**
 * Footer component for login page with terms and privacy policy text
 */
export default function LoginFooter() {
  return (
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{ mt: 4, display: 'block', textAlign: 'center' }}
    >
      By signing in, you agree to our Terms of Service and Privacy Policy.
    </Typography>
  );
}