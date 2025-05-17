import { Card, CardActions, CardContent, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import MoodOverview from './MoodOverview';
import PropTypes from 'prop-types';
import { ROUTES } from '../../utils/constants';

/**
 * Card component showing mood trends over time
 */
export default function MoodTrendsCard({ moodTrends }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Mood Trends
        </Typography>
        <MoodOverview data={moodTrends} />
      </CardContent>
      <CardActions>
        <Button size="small" component={Link} to={ROUTES.ANALYTICS}>
          View Analytics
        </Button>
      </CardActions>
    </Card>
  );
}

MoodTrendsCard.propTypes = {
  moodTrends: PropTypes.array
};