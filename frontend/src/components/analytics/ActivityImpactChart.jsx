import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ActivityImpactChart({ data = [] }) {
  const theme = useTheme();

  if (!data || data.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
        <Typography variant="body1" color="text.secondary">
          No activity data available. Continue logging your physical activities.
        </Typography>
      </Box>
    );
  }

  const formatActivityName = (name) => {
    if (!name) return 'None';
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const activityLabels = data.map(item => {
    const activityType = item.activityType || item.physical_activity_type;
    return formatActivityName(activityType);
  });

  const moodImpactData = data.map(item => {
    return item.averageMoodRating || item.avg_mood || 0;
  });

  const anxietyImpactData = data.map(item => {
    return item.averageAnxietyLevel || item.avg_anxiety || 0;
  });

  const chartData = {
    labels: activityLabels,
    datasets: [
      {
        label: 'Average Mood',
        data: moodImpactData,
        backgroundColor: theme.palette.primary.light,
        borderColor: theme.palette.primary.main,
        borderWidth: 1
      },
      {
        label: 'Average Anxiety',
        data: anxietyImpactData,
        backgroundColor: theme.palette.warning.light,
        borderColor: theme.palette.warning.main,
        borderWidth: 1
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
          color: theme.palette.text.primary,
          font: {
            family: theme.typography.fontFamily
          }
        }
      },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 10,
        boxPadding: 3
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        grid: {
          color: theme.palette.divider
        },
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            family: theme.typography.fontFamily
          }
        },
        title: {
          display: true,
          text: 'Average Rating (1-10)',
          color: theme.palette.text.primary,
          font: {
            family: theme.typography.fontFamily,
            weight: 'medium'
          }
        }
      },
      x: {
        grid: {
          color: theme.palette.divider
        },
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            family: theme.typography.fontFamily
          }
        }
      }
    }
  };

  return (
    <Box>
      <Typography variant="body1" paragraph>
        This chart shows how different physical activities impact your mood and anxiety levels.
        Activities with higher mood ratings and lower anxiety levels generally have a more positive impact.
      </Typography>

      <Box sx={{ height: 400 }}>
        <Bar options={options} data={chartData} />
      </Box>
    </Box>
  );
}