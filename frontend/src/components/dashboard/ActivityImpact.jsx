import { Box, Typography, Chip, LinearProgress, Button } from '@mui/material';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import PoolIcon from '@mui/icons-material/Pool';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function ActivityImpact({ data = [], onViewMore }) {
  if (!data || data.length === 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 200, gap: 2 }}>
        <Typography variant="body1" color="text.secondary">
          No activity data available yet
        </Typography>
      </Box>
    );
  }

  const normalizedData = data.map(activity => ({
    activityType: activity.activityType || activity.physical_activity_type,
    averageMoodRating: activity.averageMoodRating || activity.avg_mood,
    entryCount: activity.entryCount || activity.entry_count || 1,
    averageDuration: activity.averageDuration || activity.physical_activity_duration || 30,
    averageAnxiety: activity.averageAnxiety || activity.avg_anxiety
  }));

  const sortedActivities = [...normalizedData]
    .filter(a => a && typeof a.averageMoodRating === 'number')
    .sort((a, b) => b.averageMoodRating - a.averageMoodRating);

  const topActivities = sortedActivities.slice(0, 4);

  const getActivityIcon = (type) => {
    if (!type) return <HelpOutlineIcon fontSize="small" />;

    switch (type.toLowerCase()) {
      case 'running': return <DirectionsRunIcon fontSize="small" />;
      case 'walking': return <DirectionsWalkIcon fontSize="small" />;
      case 'cycling': return <DirectionsBikeIcon fontSize="small" />;
      case 'swimming': return <PoolIcon fontSize="small" />;
      case 'yoga': return <SelfImprovementIcon fontSize="small" />;
      case 'strength': return <FitnessCenterIcon fontSize="small" />;
      default: return <HelpOutlineIcon fontSize="small" />;
    }
  };

  const formatActivityName = (name) => {
    if (!name) return 'None';
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" paragraph>
        Activities that positively impact your mood:
      </Typography>

      {topActivities.length > 0 ? (
        <>
          {topActivities.map((activity) => (
            <Box key={activity.activityType || 'unknown'} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Chip
                  icon={getActivityIcon(activity.activityType)}
                  label={formatActivityName(activity.activityType)}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 500 }}
                />
                <Typography variant="body2" fontWeight="bold">
                  {(activity.averageMoodRating || 0).toFixed(1)}/10 mood
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={(activity.averageMoodRating || 0) * 10}
                color={
                  (activity.averageMoodRating || 0) >= 7 ? 'success' :
                  (activity.averageMoodRating || 0) >= 5 ? 'primary' :
                  (activity.averageMoodRating || 0) >= 3 ? 'warning' : 'error'
                }
                sx={{ height: 8, borderRadius: 4 }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  {activity.entryCount} {activity.entryCount === 1 ? 'session' : 'sessions'} logged
                </Typography>
                {activity.averageAnxiety && (
                  <Typography variant="caption" color="text.secondary">
                    Anxiety: {activity.averageAnxiety.toFixed(1)}/10
                  </Typography>
                )}
              </Box>
            </Box>
          ))}

        </>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Track physical activities to see their impact on your mood
        </Typography>
      )}
    </Box>
  );
}