import { Box, Typography } from '@mui/material';
import ActivityImpactChart from './ActivityImpactChart';
import PropTypes from 'prop-types';

/**
 * Panel component for physical activity impact analytics
 */
const ActivityImpactPanel = ({ data }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>Activity Impact on Mood</Typography>
      <ActivityImpactChart data={data} />
    </Box>
  );
};

ActivityImpactPanel.propTypes = {
  data: PropTypes.array
};

export default ActivityImpactPanel;