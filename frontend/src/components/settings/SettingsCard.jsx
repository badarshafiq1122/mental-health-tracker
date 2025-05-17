import { Card, CardContent, Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

/**
 * Base card component for settings sections
 */
export default function SettingsCard({ 
  title, 
  icon, 
  iconBgColor = 'primary.light', 
  children 
}) {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
        height: '100%',
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.08)'
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 3,
          pb: 2,
          borderBottom: `1px solid ${theme.palette.divider}`
        }}>
          <Box
            sx={{
              bgcolor: iconBgColor,
              color: 'white',
              p: 1.5,
              borderRadius: 2,
              display: 'inline-flex',
              mr: 2
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>
        </Box>

        {children}
      </CardContent>
    </Card>
  );
}

SettingsCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  iconBgColor: PropTypes.string,
  children: PropTypes.node.isRequired
};