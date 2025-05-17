import { create } from 'zustand';
import api from '../services/api';

const useAnalyticsStore = create((set, get) => ({
  moodTrends: [],
  sleepStats: null,
  activityImpact: [],
  wellbeingInsights: null,
  isLoading: false,
  error: null,

  refreshAllData: async (period = 'week') => {
    try {
      set({ isLoading: true, error: null });

      const [moodResponse, wellbeingResponse, sleepResponse, activityResponse] = await Promise.all([
        api.get(`/analytics/mood-trends?period=${period}`),
        api.get('/analytics/wellbeing'),
        api.get('/analytics/sleep-stats'),
        api.get('/analytics/activity-impact')
      ]);

      set({
        moodTrends: moodResponse.data.data,
        wellbeingInsights: wellbeingResponse.data.data,
        sleepStats: sleepResponse.data.data,
        activityImpact: activityResponse.data.data
      });

      return {
        moodTrends: moodResponse.data.data,
        wellbeingInsights: wellbeingResponse.data.data,
        sleepStats: sleepResponse.data.data,
        activityImpact: activityResponse.data.data
      };
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to refresh analytics data' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMoodTrends: async (period = 'month') => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/analytics/mood-trends?period=${period}`);
      set({ moodTrends: response.data.data });
      return response.data.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch mood trends' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSleepStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/analytics/sleep-stats');
      set({ sleepStats: response.data.data });
      return response.data.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch sleep stats' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchActivityImpact: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/analytics/activity-impact');
      set({ activityImpact: response.data.data });
      return response.data.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch activity impact' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchWellbeingInsights: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/analytics/wellbeing');
      set({ wellbeingInsights: response.data.data });
      return response.data.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch wellbeing insights' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
}));

export default useAnalyticsStore;