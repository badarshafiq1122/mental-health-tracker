import { Box, Typography } from '@mui/material';
import SleepQualityChart from './SleepQualityChart';
import PropTypes from 'prop-types';

/**
 * Panel component for sleep quality analytics
 */
const SleepAnalysisPanel = ({ data }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>Sleep Quality Analysis</Typography>
      <SleepQualityChart data={data} />
    </Box>
  );
};

SleepAnalysisPanel.propTypes = {
  data: PropTypes.object
};

export default SleepAnalysisPanel;