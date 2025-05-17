import { Box, CircularProgress, Typography } from '@mui/material';

export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        py: 8
      }}
    >
      <CircularProgress size={48} thickness={4} />
      <Typography variant="body1" sx={{ mt: 3, fontWeight: 500 }}>
        {message}
      </Typography>
    </Box>
  );
}