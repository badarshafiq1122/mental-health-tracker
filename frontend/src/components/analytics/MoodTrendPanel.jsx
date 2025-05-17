import { Box, Typography } from '@mui/material';
import MoodTrendsChart from './MoodTrendsChart';
import PeriodSelector from './PeriodSelector';
import PropTypes from 'prop-types';

/**
 * Panel component for mood trends analytics
 */
const MoodTrendPanel = ({ data, period, onPeriodChange }) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Mood Trends Over Time</Typography>
        <PeriodSelector period={period} onPeriodChange={onPeriodChange} />
      </Box>

      <MoodTrendsChart data={data} timeframe={period} />
    </Box>
  );
};

MoodTrendPanel.propTypes = {
  data: PropTypes.array,
  period: PropTypes.string.isRequired,
  onPeriodChange: PropTypes.func.isRequired
};

export default MoodTrendPanel;