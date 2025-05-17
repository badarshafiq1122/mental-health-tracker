import { Box, Tabs, Tab } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Tab navigation component for analytics sections
 */
const AnalyticsTabs = ({ activeTab, onTabChange }) => {
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs
        value={activeTab}
        onChange={onTabChange}
        aria-label="analytics tabs"
      >
        <Tab label="Mood Trends" />
        <Tab label="Sleep Analysis" />
        <Tab label="Activity Impact" />
        <Tab label="Wellbeing Score" />
      </Tabs>
    </Box>
  );
};

AnalyticsTabs.propTypes = {
  activeTab: PropTypes.number.isRequired,
  onTabChange: PropTypes.func.isRequired
};

export default AnalyticsTabs;