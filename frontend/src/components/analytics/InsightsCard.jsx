import { Box, Card, CardContent, Typography } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Card component displaying key insights based on user's data
 */
const InsightsCard = ({ insights }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Key Insights</Typography>

        {insights && insights.length > 0 ? (
          <Box>
            {insights.map((insight, index) => (
              <Typography key={index} paragraph>
                • {insight}
              </Typography>
            ))}
          </Box>
        ) : (
          <Typography color="text.secondary">
            Continue logging your daily data to receive personalized insights.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

InsightsCard.propTypes = {
  insights: PropTypes.array
};

export default InsightsCard;