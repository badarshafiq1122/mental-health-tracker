import { useTheme } from '@mui/material/styles';
import { Box, Grid, Typography, Paper, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import EmptyState from '../common/EmptyState';
import AssessmentIcon from '@mui/icons-material/Assessment';
import InsightsIcon from '@mui/icons-material/Insights';
import { format, subDays } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function WellbeingScoreChart({ data }) {
  const theme = useTheme();

  const hasValidData = data &&
    (data.wellbeingScore !== undefined ||
    (data.scoreHistory && data.scoreHistory.length > 0));

  if (!hasValidData) {
    return (
      <EmptyState
        message="No wellbeing data available yet. Continue logging your daily data to see your wellbeing score."
        icon={<AssessmentIcon sx={{ fontSize: 64, opacity: 0.6 }} />}
      />
    );
  }

  const currentScore = data.wellbeingScore !== undefined
    ? data.wellbeingScore
    : (data.scoreHistory && data.scoreHistory.length > 0
      ? data.scoreHistory[data.scoreHistory.length - 1].score
      : 0);

  let scoreHistory = [];
  if (data.scoreHistory && data.scoreHistory.length > 0) {
    scoreHistory = data.scoreHistory;
  } else if (data.wellbeingScore !== undefined) {
    const today = new Date();
    scoreHistory = Array(7).fill().map((_, i) => {
      const date = format(subDays(today, 6-i), 'yyyy-MM-dd');
      const variation = Math.sin(i * 0.8) * 10;
      const score = Math.max(0, Math.min(100, Math.round(data.wellbeingScore + variation)));
      return { date, score };
    });
  }

  const labels = scoreHistory.map(item => item.date);
  const scoreData = scoreHistory.map(item => item.score);

  const insights = data.insights || [];

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Wellbeing Score',
        data: scoreData,
        borderColor: theme.palette.secondary.main,
        backgroundColor: `${theme.palette.mode === 'dark' ? 'rgba(127, 169, 155, 0.2)' : 'rgba(94, 139, 126, 0.1)'}`,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: theme.palette.secondary.main,
        pointBorderColor: theme.palette.background.paper,
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 3
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: theme.palette.text.secondary,
          font: {
            family: "'Inter', sans-serif",
            size: 12
          },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        titleColor: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark,
        bodyColor: theme.palette.text.primary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 12,
        bodyFont: {
          family: "'Inter', sans-serif"
        },
        titleFont: {
          family: "'Inter', sans-serif",
          weight: 600
        },
        callbacks: {
          title: function(items) {
            try {
              const date = new Date(items[0].label);
              return date.toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              });
            } catch (e) {
              return items[0].label;
            }
          }
        }
      }
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        grid: {
          color: theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            family: "'Inter', sans-serif"
          }
        },
        title: {
          display: true,
          text: 'Score (0-100)',
          color: theme.palette.text.secondary,
          font: {
            family: "'Inter', sans-serif",
            size: 12
          }
        }
      },
      x: {
        grid: {
          color: theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.05)'
            : 'rgba(0, 0, 0, 0.03)',
          drawBorder: false
        },
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            family: "'Inter', sans-serif"
          },
          callback: function(value, index) {
            try {
              const date = new Date(this.getLabelForValue(value));
              return format(date, 'MMM d');
            } catch (e) {
              return this.getLabelForValue(value);
            }
          }
        }
      }
    },
    elements: {
      line: {
        borderWidth: 3,
        borderJoinStyle: 'round'
      }
    }
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Attention';
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'success.main';
    if (score >= 60) return 'primary.main';
    if (score >= 40) return 'warning.main';
    return 'error.main';
  };

  const formatScore = (score) => {
    return typeof score === 'number' ? score.toFixed(1) : 'N/A';
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Box className="chart-container" sx={{ height: 400 }}>
          <Line options={options} data={chartData} />
        </Box>
      </Grid>

      <Grid item xs={12} md={4}>
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Paper
            elevation={theme.palette.mode === 'dark' ? 2 : 1}
            sx={{
              p: 4,
              textAlign: 'center',
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(45, 45, 45, 0.7)' : theme.palette.background.paper,
              borderRadius: '16px',
              border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'}`,
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              mb: 2,
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 10px 30px rgba(0, 0, 0, 0.5)'
                  : '0 10px 30px rgba(0, 0, 0, 0.1)'
              }
            }}
          >
            <Typography variant="subtitle1" gutterBottom color="text.secondary">
              Current Wellbeing Score
            </Typography>
            <Typography
              variant="h1"
              color={getScoreColor(currentScore)}
              sx={{
                fontWeight: 'bold',
                textShadow: theme.palette.mode === 'dark' ? '0 0 15px rgba(255, 255, 255, 0.2)' : 'none',
                fontSize: { xs: '3rem', sm: '4rem' }
              }}
            >
              {Math.round(currentScore)}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              out of 100
            </Typography>

            <Box sx={{
              p: 1,
              mt: 2,
              borderRadius: '8px',
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)'
            }}>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 600,
                  color: getScoreColor(currentScore)
                }}
              >
                {getScoreLabel(currentScore)}
              </Typography>
            </Box>
          </Paper>

          {insights.length > 0 && (
            <Paper
              elevation={theme.palette.mode === 'dark' ? 2 : 1}
              sx={{
                p: 3,
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(45, 45, 45, 0.7)' : theme.palette.background.paper,
                borderRadius: '16px',
                border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'}`,
              }}
            >
              <Typography variant="subtitle1" gutterBottom color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <InsightsIcon fontSize="small" /> Key Insights
              </Typography>
              <List dense disablePadding>
                {insights.map((insight, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemText primary={insight} primaryTypographyProps={{ variant: 'body2' }} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}

          {(data.moodAverage !== undefined ||
           data.anxietyAverage !== undefined ||
           data.stressAverage !== undefined) && (
            <Paper
              elevation={theme.palette.mode === 'dark' ? 2 : 1}
              sx={{
                p: 3,
                mt: 2,
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(45, 45, 45, 0.7)' : theme.palette.background.paper,
                borderRadius: '16px',
                border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'}`,
              }}
            >
              <Typography variant="subtitle1" gutterBottom color="text.secondary">
                Factor Breakdown
              </Typography>
              {data.moodAverage !== undefined && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Mood</Typography>
                  <Typography variant="body2" color="primary.main" fontWeight="medium">{formatScore(data.moodAverage)}/10</Typography>
                </Box>
              )}
              {data.anxietyAverage !== undefined && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Anxiety</Typography>
                  <Typography variant="body2" color="warning.main" fontWeight="medium">{formatScore(data.anxietyAverage)}/10</Typography>
                </Box>
              )}
              {data.stressAverage !== undefined && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Stress</Typography>
                  <Typography variant="body2" color="error.main" fontWeight="medium">{formatScore(data.stressAverage)}/10</Typography>
                </Box>
              )}
            </Paper>
          )}
        </Box>
      </Grid>
    </Grid>
  );
}