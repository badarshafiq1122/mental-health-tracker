import { Box, Typography, Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import PropTypes from 'prop-types';

/**
 * Header component for Analytics page with export buttons
 */
const AnalyticsHeader = ({ onExportCsv, onExportJson }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Typography variant="h4" component="h1">
        Analytics & Insights
      </Typography>

      <Box>
        <Button
          variant="outlined"
          onClick={onExportCsv}
          startIcon={<DownloadIcon />}
          sx={{ mr: 2 }}
        >
          Export CSV
        </Button>

        <Button
          variant="outlined"
          onClick={onExportJson}
          startIcon={<DownloadIcon />}
        >
          Export JSON
        </Button>
      </Box>
    </Box>
  );
};

AnalyticsHeader.propTypes = {
  onExportCsv: PropTypes.func.isRequired,
  onExportJson: PropTypes.func.isRequired
};

export default AnalyticsHeader;