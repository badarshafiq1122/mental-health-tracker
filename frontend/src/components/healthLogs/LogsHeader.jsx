import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import PropTypes from 'prop-types';

/**
 * LogsHeader Component
 * Displays the header with title and add button
 */
export default function LogsHeader() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Typography variant="h4" component="h1">
        Your Logs
      </Typography>

      <Button
        component={Link}
        to={ROUTES.LOGS.NEW}
        variant="contained"
        startIcon={<AddIcon />}
      >
        Add New Log
      </Button>
    </Box>
  );
}

LogsHeader.propTypes = {};