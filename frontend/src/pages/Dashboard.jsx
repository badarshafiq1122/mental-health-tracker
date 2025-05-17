import { useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import useLogStore from '../stores/logStore';
import useAnalyticsStore from '../stores/analyticsStore';
import useAuthStore from '../stores/authStore';
import useWebSocket from '../hooks/useWebSocket';
import { format } from 'date-fns';
import { WS_MESSAGE_TYPES } from '../utils/constants';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertMessage from '../components/common/AlertMessage';
import WebSocketStatusIndicator from '../components/common/WebSocketStatusIndicator';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import WelcomeBanner from '../components/dashboard/WelcomeBanner';
import OverallWellbeingCard from '../components/dashboard/OverallWellbeingCard';
import MoodTrendsCard from '../components/dashboard/MoodTrendsCard';
import RecentLogsCard from '../components/dashboard/RecentLogsCard';
import ActivityImpactCard from '../components/dashboard/ActivityImpactCard';

/**
 * Dashboard Component
 * Shows overview of user's mental health data and key metrics
 */
export default function Dashboard() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('week');

  const { user } = useAuthStore();
  const { logs, fetchLogs } = useLogStore();
  const {
    moodTrends,
    wellbeingInsights,
    sleepStats,
    activityImpact,
    fetchMoodTrends,
    fetchWellbeingInsights,
    fetchSleepStats,
    fetchActivityImpact
  } = useAnalyticsStore();
  const { isConnected, lastMessage } = useWebSocket();

  const today = new Date();
  const todayFormatted = format(today, 'yyyy-MM-dd');
  const hasLogToday = logs.some(log => log.date === todayFormatted);

  /**
   * Load all dashboard data on initial render
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await fetchLogs();
        await fetchMoodTrends(timeframe);
        await fetchWellbeingInsights();
        await fetchSleepStats();
        await fetchActivityImpact();
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchLogs, fetchMoodTrends, fetchWellbeingInsights, fetchSleepStats, fetchActivityImpact]);

  /**
   * Handle real-time updates via WebSocket
   */
  useEffect(() => {
    if (!lastMessage || !lastMessage.type) return;

    // Handle different message types appropriately
    switch (lastMessage.type) {
      case WS_MESSAGE_TYPES.LOG_CREATE:
      case WS_MESSAGE_TYPES.LOG_UPDATE:
      case WS_MESSAGE_TYPES.LOG_DELETE:
        fetchLogs();
        fetchMoodTrends(timeframe);
        fetchWellbeingInsights();
        fetchSleepStats();
        fetchActivityImpact();
        break;

      case WS_MESSAGE_TYPES.PING:
        break;

      default:
        break;
    }
  }, [
    lastMessage,
    fetchLogs,
    fetchMoodTrends,
    fetchWellbeingInsights,
    fetchSleepStats,
    fetchActivityImpact,
    timeframe
  ]);

  if (loading) {
    return <LoadingSpinner message="Loading your dashboard..." />;
  }

  return (
    <Box>
      <DashboardHeader />

      {error && (
        <AlertMessage
          message={error}
          severity="error"
          onClose={() => setError(null)}
        />
      )}

      <WelcomeBanner user={user} hasLoggedToday={hasLogToday} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <OverallWellbeingCard wellbeingInsights={wellbeingInsights} />
        </Grid>

        <Grid item xs={12} md={8}>
          <MoodTrendsCard moodTrends={moodTrends} />
        </Grid>

        <Grid item xs={12} md={6}>
          <RecentLogsCard logs={logs} />
        </Grid>

        <Grid item xs={12} md={6}>
          <ActivityImpactCard activityImpact={activityImpact} />
        </Grid>
      </Grid>

      <WebSocketStatusIndicator isConnected={isConnected} />
    </Box>
  );
}