import { useState, useEffect, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Typography, Paper } from '@mui/material';
import { Line } from 'react-chartjs-2';
import useWebSocket from '../../hooks/useWebSocket';
import { WS_MESSAGE_TYPES } from '../../utils/constants';
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
import EmptyState from '../common/EmptyState';
import MoodIcon from '@mui/icons-material/Mood';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MoodTrendsChart = ({ data = [], timeframe }) => {
  const theme = useTheme();
  const [chartData, setChartData] = useState(null);
  const { lastMessage } = useWebSocket();

  if (!data || data.length === 0) {
    return (
      <EmptyState
        message="No mood data available. Continue logging your daily mood."
        icon={<MoodIcon sx={{ fontSize: 64, opacity: 0.6 }} />}
      />
    );
  }

  const processChartData = useCallback(() => {
    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

    const labels = sortedData.map(item => item.date);
    const moodData = sortedData.map(item => item.mood_rating);
    const anxietyData = sortedData.map(item => item.anxiety_level);
    const stressData = sortedData.map(item => item.stress_level);

    const chartData = {
      labels,
      datasets: [
        {
          label: 'Mood',
          data: moodData,
          borderColor: theme.palette.primary.main,
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(127, 169, 155, 0.5)' : 'rgba(94, 139, 126, 0.5)',
          tension: 0.4,
          pointBackgroundColor: theme.palette.primary.main,
          pointBorderColor: theme.palette.background.paper,
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: false,
          borderWidth: 3
        },
        {
          label: 'Anxiety',
          data: anxietyData,
          borderColor: theme.palette.warning.main,
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(228, 179, 99, 0.5)' : 'rgba(228, 179, 99, 0.5)',
          tension: 0.4,
          pointBackgroundColor: theme.palette.warning.main,
          pointBorderColor: theme.palette.background.paper,
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: false,
          borderWidth: 3
        },
        {
          label: 'Stress',
          data: stressData,
          borderColor: theme.palette.error.main,
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(233, 128, 116, 0.5)' : 'rgba(233, 128, 116, 0.5)',
          tension: 0.4,
          pointBackgroundColor: theme.palette.error.main,
          pointBorderColor: theme.palette.background.paper,
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: false,
          borderWidth: 3
        }
      ]
    };

    setChartData(chartData);
  }, [data, timeframe, theme]);

  useEffect(() => {
    processChartData();
  }, [data, timeframe, processChartData]);

  useEffect(() => {
    if (lastMessage && lastMessage.type === WS_MESSAGE_TYPES.LOG_UPDATE) {
      processChartData();
    }
  }, [lastMessage, processChartData]);

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
          pointStyle: 'circle',
          padding: 20
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
            const date = new Date(items[0].label);
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
          text: 'Rating (1-10)',
          color: theme.palette.text.secondary,
          font: {
            family: "'Inter', sans-serif",
            size: 12,
            weight: 'normal'
          }
        }
      },
      x: {
        grid: {
          color: theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.05)'
            : 'rgba(0, 0, 0, 0.03)',
          display: true,
          drawBorder: false
        },
        ticks: {
          color: theme.palette.text.secondary,
          maxRotation: 45,
          minRotation: 45,
          font: {
            family: "'Inter', sans-serif",
            size: 10
          }
        }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeOutQuart'
    }
  };

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
          border: `1px solid ${theme.palette.divider}`
        }}
      >
        <Box className="chart-legend">
          <Box className="legend-item">
            <Box className="legend-color" sx={{ backgroundColor: theme.palette.primary.main }}></Box>
            <Typography variant="caption">Higher mood is better</Typography>
          </Box>
          <Box className="legend-item">
            <Box className="legend-color" sx={{ backgroundColor: theme.palette.warning.main }}></Box>
            <Typography variant="caption">Lower anxiety is better</Typography>
          </Box>
          <Box className="legend-item">
            <Box className="legend-color" sx={{ backgroundColor: theme.palette.error.main }}></Box>
            <Typography variant="caption">Lower stress is better</Typography>
          </Box>
        </Box>
      </Paper>

      <Box className="chart-container" sx={{ height: 400 }}>
        {chartData && <Line options={options} data={chartData} />}
      </Box>
    </Box>
  );
};

export default MoodTrendsChart;