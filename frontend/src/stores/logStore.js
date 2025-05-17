import { create } from 'zustand';
import api from '../services/api';
import { format } from 'date-fns';

const useLogStore = create((set, get) => ({
  logs: [],
  selectedLog: null,
  isLoading: false,
  error: null,

  fetchLogs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/logs');
      set({ logs: response.data.logs || [] });
      return response.data.logs;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch logs' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  getLogByDate: (date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    return get().logs.find(log => log.date === formattedDate);
  },

  getLogById: (id) => {
    return get().logs.find(log => log.id === id);
  },

  setSelectedLog: (log) => {
    set({ selectedLog: log });
  },

  createOrUpdateLog: async (logData) => {
    set({ isLoading: true, error: null });
    try {
      const dataToSend = { ...logData };

      const numericFields = ['mood_rating', 'anxiety_level', 'sleep_hours',
                            'physical_activity_duration', 'social_interactions', 'stress_level'];

      numericFields.forEach(field => {
        if (dataToSend[field] !== undefined && dataToSend[field] !== null) {
          dataToSend[field] = Number(dataToSend[field]);
        }
      });

      if (dataToSend.date && !(dataToSend.date instanceof String)) {
        try {
          dataToSend.date = format(new Date(dataToSend.date), 'yyyy-MM-dd');
        } catch (e) {
          console.error("Error formatting date:", e);
        }
      }

      console.log('Sending data to server:', dataToSend);

      const response = await api.post('/logs', dataToSend);
      const log = response.data?.data || response.data?.log;

      if (!log) {
        throw new Error('Invalid response from server');
      }

      set((state) => {
        const existingIndex = state.logs.findIndex(l => l.id === log.id);
        if (existingIndex >= 0) {
          const updatedLogs = [...state.logs];
          updatedLogs[existingIndex] = log;
          return { logs: updatedLogs, selectedLog: log };
        } else {
          return { logs: [log, ...state.logs], selectedLog: log };
        }
      });

      return log;
    } catch (error) {
      console.error('Error in createOrUpdateLog:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save log';
      set({ error: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteLog: async (logId) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/logs/${logId}`);

      set((state) => ({
        logs: state.logs.filter(log => log.id !== logId),
        selectedLog: state.selectedLog?.id === logId ? null : state.selectedLog
      }));

      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to delete log' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
}));

export default useLogStore;