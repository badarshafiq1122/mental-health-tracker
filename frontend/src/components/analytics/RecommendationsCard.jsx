import { Box, Card, CardContent, Typography } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Card component displaying personalized recommendations based on user's data
 */
const RecommendationsCard = ({ recommendations }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Recommendations</Typography>

        {recommendations && recommendations.length > 0 ? (
          <Box>
            {recommendations.map((recommendation, index) => (
              <Typography key={index} paragraph>
                • {recommendation}
              </Typography>
            ))}
          </Box>
        ) : (
          <Typography color="text.secondary">
            Continue logging your daily data to receive personalized recommendations.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

RecommendationsCard.propTypes = {
  recommendations: PropTypes.array
};

export default RecommendationsCard;