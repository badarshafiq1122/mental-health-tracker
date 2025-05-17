import { useState } from 'react';
import { Box, Button, Card, CardActions, CardContent, Divider, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import WellbeingScore from './WellbeingScore';
import PropTypes from 'prop-types';
import { ROUTES } from '../../utils/constants';

/**
 * Card component showing overall wellbeing score and insights
 */
export default function OverallWellbeingCard({ wellbeingInsights }) {
  const hasScore = wellbeingInsights?.wellbeingScore !== undefined;
  const hasInsights = wellbeingInsights?.insights && wellbeingInsights.insights.length > 0;

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Overall Wellbeing
        </Typography>

        {hasScore ? (
          <WellbeingScore score={wellbeingInsights.wellbeingScore} />
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Track your daily logs to see your wellbeing score.
            </Typography>
          </Box>
        )}

        {hasInsights && (
          <Box mt={2}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Insights:
            </Typography>
            <Box>
              {wellbeingInsights.insights.map((insight, index) => (
                <Typography
                  key={index}
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 0.5
                  }}
                >
                  • {insight}
                </Typography>
              ))}
            </Box>
          </Box>
        )}
      </CardContent>
      <CardActions>
        <Button size="small" component={Link} to={ROUTES.ANALYTICS}>
          View Details
        </Button>
      </CardActions>
    </Card>
  );
}

OverallWellbeingCard.propTypes = {
  wellbeingInsights: PropTypes.shape({
    wellbeingScore: PropTypes.number,
    insights: PropTypes.arrayOf(PropTypes.string)
  })
};