import React from 'react';
import { Box, Typography, Card, CardContent, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function MoodOverview({ data = [] }) {
  const theme = useTheme();

  if (!data || data.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
        <Typography variant="body1" color="text.secondary">
          No mood data available yet. Start logging your daily mood.
        </Typography>
      </Box>
    );
  }

  const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

  const recentData = sortedData.slice(-10);
  const labels = recentData.map(item => {
    const date = new Date(item.date);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });
  const moodData = recentData.map(item => item.mood_rating);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Mood',
        data: moodData,
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.main,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          title: function(items) {
            const index = items[0].dataIndex;
            const date = new Date(recentData[index].date);
            return date.toLocaleDateString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });
          }
        }
      }
    },
    scales: {
      y: {
        min: 0,
        max: 10,
        title: {
          display: false,
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const totalMood = moodData.reduce((sum, rating) => sum + rating, 0);
  const averageMood = totalMood / moodData.length;

  const halfIndex = Math.floor(moodData.length / 2);
  const firstHalf = moodData.slice(0, halfIndex);
  const secondHalf = moodData.slice(halfIndex);

  const firstHalfAvg = firstHalf.reduce((sum, rating) => sum + rating, 0) / firstHalf.length;
  const secondHalfAvg = secondHalf.reduce((sum, rating) => sum + rating, 0) / secondHalf.length;
  const trend = secondHalfAvg - firstHalfAvg;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography variant="body2" color="text.secondary">
            Average Mood
          </Typography>
          <Typography variant="h5" fontWeight="bold">
            {averageMood.toFixed(1)}/10
          </Typography>
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary">
            Trend
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              variant="h6"
              color={trend > 0 ? 'success.main' : trend < 0 ? 'error.main' : 'text.primary'}
              sx={{ mr: 0.5 }}
              fontWeight="medium"
            >
              {trend > 0 ? '+' : ''}{trend.toFixed(1)}
            </Typography>
            {trend > 0 ? (
              <TrendingUpIcon color="success" fontSize="small" />
            ) : trend < 0 ? (
              <TrendingDownIcon color="error" fontSize="small" />
            ) : null}
          </Box>
        </Box>
      </Box>

      <Box sx={{ height: 250 }}>
        <Line options={options} data={chartData} />
      </Box>
    </Box>
  );
}