import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import PropTypes from 'prop-types';

/**
 * LogsEmpty Component
 * Displays a message when no logs are found
 */
export default function LogsEmpty({ hasLogs }) {
  return (
    <Box sx={{ textAlign: 'center', py: 8, bgcolor: 'background.paper', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        No logs found
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {!hasLogs
          ? "You haven't created any logs yet."
          : "No logs match your search criteria."}
      </Typography>
      
      {!hasLogs && (
        <Button
          component={Link}
          to={ROUTES.LOGS.NEW}
          variant="contained"
          startIcon={<AddIcon />}
        >
          Create Your First Log
        </Button>
      )}
    </Box>
  );
}

LogsEmpty.propTypes = {
  hasLogs: PropTypes.bool.isRequired
};