import { Box, Typography, Button, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

export default function EmptyState({
  message = "No data available yet",
  icon = <SelfImprovementIcon sx={{ fontSize: 64, opacity: 0.6 }} />,
  height = 300,
  showAddButton = true
}) {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height,
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
        borderRadius: 2,
        padding: 3,
        border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
        backdropFilter: 'blur(8px)'
      }}
    >
      <Box sx={{
        mb: 2,
        color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.4)',
        animation: 'pulse 2s infinite ease-in-out',
        '@keyframes pulse': {
          '0%': { opacity: 0.6 },
          '50%': { opacity: 0.8 },
          '100%': { opacity: 0.6 },
        }
      }}>
        {icon}
      </Box>
      <Typography
        variant="body1"
        color="text.secondary"
        align="center"
        sx={{
          maxWidth: '80%',
          mb: showAddButton ? 3 : 0
        }}
      >
        {message}
      </Typography>

      {showAddButton && (
        <Button
          component={Link}
          to={ROUTES.LOGS.NEW}
          variant="outlined"
          color="primary"
          startIcon={<AddCircleOutlineIcon />}
          sx={{
            mt: 2,
            borderRadius: '20px',
            textTransform: 'none',
            boxShadow: theme.palette.mode === 'dark' ? '0 0 10px rgba(127, 169, 155, 0.3)' : 'none'
          }}
        >
          Add First Log
        </Button>
      )}
    </Paper>
  );
}