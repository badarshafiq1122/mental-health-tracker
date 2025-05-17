import { useState } from 'react';
import {
  Box, Button, Card, CardActions, CardContent,
  Typography, Chip, Grid
} from '@mui/material';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import { ROUTES } from '../../utils/constants';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import { useTheme } from '@mui/material/styles';

/**
 * Card component showing recent health logs
 */
export default function RecentLogsCard({ logs }) {
  const theme = useTheme();
  const hasLogs = logs && logs.length > 0;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Recent Logs
        </Typography>

        {hasLogs ? (
          logs.slice(0, 3).map((log, idx) => (
            <Box
              key={log.id}
              sx={{
                mb: 2,
                pb: 2,
                borderBottom: idx < 2 ? `1px solid ${theme.palette.divider}` : 'none'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarMonthIcon
                    fontSize="small"
                    color="primary"
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="subtitle1" fontWeight="medium">
                    {format(new Date(log.date), 'EEE, MMM d, yyyy')}
                  </Typography>
                </Box>
                <Chip
                  icon={
                    <SentimentSatisfiedAltIcon
                      fontSize="small"
                      sx={{ '&&': { color: 'inherit' } }}
                    />
                  }
                  label={`Mood: ${log.mood_rating}/10`}
                  size="small"
                  color={log.mood_rating >= 7 ? 'success' : log.mood_rating >= 4 ? 'warning' : 'error'}
                  sx={{ fontWeight: 500 }}
                />
              </Box>

              <Grid container spacing={1} sx={{ mt: 0.5 }}>
                <Grid item xs={4}>
                  <Typography variant="caption" color="text.secondary">
                    Anxiety:
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {log.anxiety_level}/10
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="caption" color="text.secondary">
                    Stress:
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {log.stress_level}/10
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="caption" color="text.secondary">
                    Sleep:
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {log.sleep_hours} hrs
                  </Typography>
                </Grid>
              </Grid>

              {log.notes && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {log.notes}
                </Typography>
              )}
            </Box>
          ))
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              No logs recorded yet
            </Typography>
            <Button
              component={Link}
              to={ROUTES.LOGS.NEW}
              variant="contained"
              sx={{ mt: 2 }}
            >
              Add Your First Log
            </Button>
          </Box>
        )}
      </CardContent>
      {hasLogs && (
        <CardActions>
          <Button size="small" component={Link} to={ROUTES.LOGS.ALL}>View All Logs</Button>
        </CardActions>
      )}
    </Card>
  );
}

RecentLogsCard.propTypes = {
  logs: PropTypes.array.isRequired
};