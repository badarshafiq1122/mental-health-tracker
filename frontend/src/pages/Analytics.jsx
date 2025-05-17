import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Grid } from '@mui/material';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertMessage from '../components/common/AlertMessage';
import useAnalyticsStore from '../stores/analyticsStore';
import { exportApi } from '../services/api';

import AnalyticsHeader from '../components/analytics/AnalyticsHeader';
import AnalyticsTabs from '../components/analytics/AnalyticsTabs';
import MoodTrendPanel from '../components/analytics/MoodTrendPanel';
import SleepAnalysisPanel from '../components/analytics/SleepAnalysisPanel';
import ActivityImpactPanel from '../components/analytics/ActivityImpactPanel';
import WellbeingScorePanel from '../components/analytics/WellbeingScorePanel';
import InsightsCard from '../components/analytics/InsightsCard';
import RecommendationsCard from '../components/analytics/RecommendationsCard';

/**
 * Analytics page component
 * Shows detailed analytics and insights about user's mental health data
 */
export default function Analytics() {
  const [activeTab, setActiveTab] = useState(0);
  const [period, setPeriod] = useState('month');
  const [error, setError] = useState(null);
  const {
    moodTrends,
    sleepStats,
    activityImpact,
    wellbeingInsights,
    fetchMoodTrends,
    fetchSleepStats,
    fetchActivityImpact,
    fetchWellbeingInsights,
    isLoading
  } = useAnalyticsStore();

  /**
   * Load all analytics data when component mounts or period changes
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchMoodTrends(period),
          fetchSleepStats(),
          fetchActivityImpact(),
          fetchWellbeingInsights()
        ]);
      } catch (error) {
        setError('Failed to load analytics data. Please try again.');
      }
    };

    loadData();
  }, [fetchMoodTrends, fetchSleepStats, fetchActivityImpact, fetchWellbeingInsights, period]);

  /**
   * Handle tab change in the analytics tabs
   */
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  /**
   * Handle period change in the period selector
   */
  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
  };

  /**
   * Handle CSV export button click
   */
  const handleExportCsv = async () => {
    try {
      const response = await exportApi.exportCsv();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `mental-health-logs-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      setError('Failed to export data. Please try again.');
    }
  };

  /**
   * Handle JSON export button click
   */
  const handleExportJson = async () => {
    try {
      const response = await exportApi.exportJson();
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(response.data));
      const link = document.createElement('a');
      link.href = dataStr;
      link.setAttribute('download', `mental-health-logs-${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      setError('Failed to export data. Please try again.');
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading analytics..." />;
  }

  return (
    <Box>
      <AnalyticsHeader
        onExportCsv={handleExportCsv}
        onExportJson={handleExportJson}
      />

      {error && (
        <AlertMessage
          message={error}
          severity="error"
          onClose={() => setError(null)}
        />
      )}

      <Card sx={{ mb: 3 }}>
        <AnalyticsTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        <CardContent>
          {activeTab === 0 && (
            <MoodTrendPanel
              data={moodTrends}
              period={period}
              onPeriodChange={handlePeriodChange}
            />
          )}

          {activeTab === 1 && (
            <SleepAnalysisPanel data={sleepStats} />
          )}

          {activeTab === 2 && (
            <ActivityImpactPanel data={activityImpact} />
          )}

          {activeTab === 3 && (
            <WellbeingScorePanel data={wellbeingInsights} />
          )}
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <InsightsCard insights={wellbeingInsights?.insights} />
        </Grid>

        <Grid item xs={12} md={6}>
          <RecommendationsCard recommendations={wellbeingInsights?.recommendations} />
        </Grid>
      </Grid>
    </Box>
  );
}