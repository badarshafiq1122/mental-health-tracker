import { Box, Typography } from '@mui/material';
import WellbeingScoreChart from './WellbeingScoreChart';
import PropTypes from 'prop-types';

/**
 * Panel component for wellbeing score analytics
 */
const WellbeingScorePanel = ({ data }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>Wellbeing Score Trends</Typography>
      <WellbeingScoreChart data={data} />
    </Box>
  );
};

WellbeingScorePanel.propTypes = {
  data: PropTypes.object
};

export default WellbeingScorePanel;