import { Card, CardActions, CardContent, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import ActivityImpact from './ActivityImpact';
import PropTypes from 'prop-types';
import { ROUTES } from '../../utils/constants';

/**
 * Card component showing how physical activities impact mood
 */
export default function ActivityImpactCard({ activityImpact }) {
  const hasActivityData = activityImpact && Array.isArray(activityImpact) && activityImpact.length > 0;

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Activity Impact
        </Typography>

        {hasActivityData ? (
          <ActivityImpact
            data={activityImpact}
            onViewMore={() => {}}
          />
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              Log activities to see their impact on your mood
            </Typography>
          </Box>
        )}
      </CardContent>
      <CardActions>
        <Button size="small" component={Link} to={ROUTES.ANALYTICS}>
          View More Insights
        </Button>
      </CardActions>
    </Card>
  );
}

ActivityImpactCard.propTypes = {
  activityImpact: PropTypes.array
};