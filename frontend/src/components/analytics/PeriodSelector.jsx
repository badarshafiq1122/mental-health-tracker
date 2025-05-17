import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Time period selector for analytics data
 */
const PeriodSelector = ({ period, onPeriodChange }) => {
  return (
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <InputLabel id="period-select-label">Period</InputLabel>
      <Select
        labelId="period-select-label"
        value={period}
        label="Period"
        onChange={onPeriodChange}
      >
        <MenuItem value="week">Week</MenuItem>
        <MenuItem value="month">Month</MenuItem>
        <MenuItem value="year">Year</MenuItem>
      </Select>
    </FormControl>
  );
};

PeriodSelector.propTypes = {
  period: PropTypes.string.isRequired,
  onPeriodChange: PropTypes.func.isRequired
};

export default PeriodSelector;