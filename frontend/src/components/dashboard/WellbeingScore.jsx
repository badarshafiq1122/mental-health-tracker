import { Box, Typography, LinearProgress } from '@mui/material';

export default function WellbeingScore({ score }) {
  const numericScore = Number(score) || 0;
  const boundedScore = Math.min(Math.max(numericScore, 0), 100);

  const getColorForScore = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'primary';
    if (score >= 40) return 'warning';
    return 'error';
  };

  const getScoreDescription = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Attention';
  };

  const color = getColorForScore(boundedScore);
  const description = getScoreDescription(boundedScore);

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h2" color={`${color}.main`} gutterBottom fontWeight="bold">
        {boundedScore}
      </Typography>

      <LinearProgress
        variant="determinate"
        value={boundedScore}
        color={color}
        sx={{
          height: 10,
          borderRadius: 5,
          mb: 1,
          backgroundColor: 'var(--background-color)',
          '& .MuiLinearProgress-bar': {
            transition: 'background-color 0.3s ease',
          },
        }}
      />

      <Typography variant="body1" color={`${color}.main`} fontWeight="bold">
        {description}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Your wellbeing score is calculated based on your mood, anxiety levels, sleep quality, and other factors from your logs.
      </Typography>
    </Box>
  );
}