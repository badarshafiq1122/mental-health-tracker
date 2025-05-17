import { useTheme } from '@mui/material/styles';
import { Box, Grid, Typography, Paper } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import EmptyState from '../common/EmptyState';
import NightsStayIcon from '@mui/icons-material/NightsStay';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function SleepQualityChart({ data }) {
  const theme = useTheme();

  if (!data) {
    return (
      <EmptyState
        message="No sleep data available yet. Continue logging your sleep quality."
        icon={<NightsStayIcon sx={{ fontSize: 64, opacity: 0.6 }} />}
      />
    );
  }

  let qualityDistribution = {};

  if (data.sleepQualityDistribution && Array.isArray(data.sleepQualityDistribution)) {
    const totalEntries = data.sleepQualityDistribution.reduce((sum, item) => sum + item.count, 0);

    data.sleepQualityDistribution.forEach(item => {
      qualityDistribution[item.sleep_quality] = totalEntries > 0 ? item.count / totalEntries : 0;
    });
  }
  else if (data.qualityDistribution && typeof data.qualityDistribution === 'object') {
    qualityDistribution = data.qualityDistribution;
  }
  else {
    qualityDistribution = {
      poor: 0.25,
      fair: 0.25,
      good: 0.25,
      excellent: 0.25
    };
  }

  const qualityLabels = Object.keys(qualityDistribution);
  const qualityData = qualityLabels.map(key => qualityDistribution[key]);

  const averageHours = data.averageHours || data.averageSleepHours || 0;

  let mostCommonQuality = 'N/A';
  let highestCount = 0;

  if (data.sleepQualityDistribution && Array.isArray(data.sleepQualityDistribution)) {
    data.sleepQualityDistribution.forEach(item => {
      if (item.count > highestCount) {
        highestCount = item.count;
        mostCommonQuality = item.sleep_quality;
      }
    });
  } else if (data.mostCommonQuality) {
    mostCommonQuality = data.mostCommonQuality;
  } else {
    Object.entries(qualityDistribution).forEach(([quality, value]) => {
      if (value > highestCount) {
        highestCount = value;
        mostCommonQuality = quality;
      }
    });
  }


  if (data.sleepDetails && Array.isArray(data.sleepDetails) && data.sleepDetails.length > 0) {
    const dayMap = {
      0: { name: 'Sunday', qualitySum: 0, count: 0 },
      1: { name: 'Monday', qualitySum: 0, count: 0 },
      2: { name: 'Tuesday', qualitySum: 0, count: 0 },
      3: { name: 'Wednesday', qualitySum: 0, count: 0 },
      4: { name: 'Thursday', qualitySum: 0, count: 0 },
      5: { name: 'Friday', qualitySum: 0, count: 0 },
      6: { name: 'Saturday', qualitySum: 0, count: 0 }
    };

    const qualityValues = {
      poor: 1,
      fair: 2,
      good: 3,
      excellent: 4
    };

    data.sleepDetails.forEach(entry => {
      try {
        const date = new Date(entry.date);
        const dayOfWeek = date.getDay();
        const qualityValue = qualityValues[entry.quality.toLowerCase()] || 0;

        if (qualityValue > 0) {
          dayMap[dayOfWeek].qualitySum += qualityValue;
          dayMap[dayOfWeek].count += 1;
        }
      } catch (error) {
        console.error("Error processing sleep entry date:", error);
      }
    });

    let bestDay = null;
    let bestScore = -1;

    Object.values(dayMap).forEach(day => {
      if (day.count > 0) {
        const avgScore = day.qualitySum / day.count;
        if (avgScore > bestScore) {
          bestScore = avgScore;
          bestDay = day.name;
        }
      }
    });

    if (bestDay) {
      bestDayForSleep = bestDay;
    }
  } else if (data.bestDayForSleep) {
    bestDayForSleep = data.bestDayForSleep;
  }


  const orderedLabels = ['poor', 'fair', 'good', 'excellent'].filter(label => qualityLabels.includes(label));
  const orderedData = orderedLabels.map(label => qualityDistribution[label]);

  const colorMapping = {
    poor: {
      background: theme.palette.error.light,
      border: theme.palette.error.main
    },
    fair: {
      background: theme.palette.warning.light,
      border: theme.palette.warning.main
    },
    good: {
      background: theme.palette.primary.light,
      border: theme.palette.primary.main
    },
    excellent: {
      background: theme.palette.success.light,
      border: theme.palette.success.main
    }
  };

  const orderedBackgroundColors = orderedLabels.map(label =>
    colorMapping[label]?.background || theme.palette.primary.light
  );

  const orderedBorderColors = orderedLabels.map(label =>
    colorMapping[label]?.border || theme.palette.primary.main
  );

  const qualityChartData = {
    labels: orderedLabels.map(l => l.charAt(0).toUpperCase() + l.slice(1)),
    datasets: [
      {
        label: 'Sleep Quality Distribution',
        data: orderedData,
        backgroundColor: orderedBackgroundColors,
        borderColor: orderedBorderColors,
        borderWidth: 1,
        borderRadius: 6,
        hoverBackgroundColor: orderedBorderColors
      }
    ]
  };

  const qualityOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: {
        display: false
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
          label: function(context) {
            const value = context.raw;
            return `${(value * 100).toFixed(0)}% of nights`;
          }
        }
      }
    },
    scales: {
      y: {
        grid: {
          display: false
        },
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            family: "'Inter', sans-serif"
          }
        }
      },
      x: {
        beginAtZero: true,
        max: 1,
        grid: {
          color: theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          callback: function(value) {
            return (value * 100) + '%';
          },
          color: theme.palette.text.secondary,
          font: {
            family: "'Inter', sans-serif"
          }
        }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeOutQuart'
    },
    barThickness: 30,
    maxBarThickness: 50
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Typography variant="subtitle1" gutterBottom>Sleep Quality Distribution</Typography>
        <Box className="chart-container" sx={{ height: 300, position: 'relative' }}>
          <Bar options={qualityOptions} data={qualityChartData} />
        </Box>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper
          elevation={theme.palette.mode === 'dark' ? 2 : 1}
          sx={{
            p: 4,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            borderRadius: '16px',
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(45, 45, 45, 0.7)' : theme.palette.background.paper,
            border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'}`,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: theme.palette.mode === 'dark'
                ? '0 10px 30px rgba(0, 0, 0, 0.5)'
                : '0 10px 30px rgba(0, 0, 0, 0.1)'
            }
          }}
        >
          <Typography variant="subtitle1" gutterBottom color="text.secondary">Sleep Statistics</Typography>
          <Typography variant="h3" color="primary" sx={{
            fontWeight: 'bold',
            textShadow: theme.palette.mode === 'dark' ? '0 0 15px rgba(109, 157, 197, 0.2)' : 'none'
          }}>
            {averageHours ? averageHours.toFixed(1) : 'N/A'}
            <Typography component="span" variant="h5" color="text.secondary"> hrs</Typography>
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Average sleep duration
          </Typography>

          <Box
            sx={{
              mt: 3,
              p: 2,
              borderRadius: '8px',
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)'
            }}
          >
            <Typography variant="body1" sx={{ mb: 1 }}>
              <Box component="span" sx={{ fontWeight: 600 }}>Most common quality:</Box> {
                mostCommonQuality !== 'N/A'
                  ? mostCommonQuality.charAt(0).toUpperCase() + mostCommonQuality.slice(1)
                  : 'N/A'
              }
            </Typography>

            <Typography variant="body1"
              sx={{
                fontWeight: 600,
                color: theme.palette.info.main,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <NightsStayIcon fontSize="small" />
              Recommended hours: 7-9 hours
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}