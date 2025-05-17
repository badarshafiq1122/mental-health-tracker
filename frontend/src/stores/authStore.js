import { create } from 'zustand';
import { authApi } from '../services/api';
import { STORAGE_KEYS } from '../utils/constants';

/**
 * Authentication Store
 * Manages user authentication state and operations
 */
const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  /**
   * Initialize authentication state from local storage
   */
  initialize: async () => {
    set({ isLoading: true, error: null });

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

      if (!token) {
        set({ isAuthenticated: false, isLoading: false, user: null, token: null });
        return;
      }

      set({ token });

      // Validate token and get current user
      const response = await authApi.getMe();
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error) {
      console.error("Auth initialization error:", error);
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: error.response?.data?.message || 'Authentication failed'
      });
    }
  },

  /**
   * Login with Google token
   * @param {string} tokenId - Google ID token
   * @returns {Promise<boolean>} Success status
   */
  login: async (tokenId) => {
    set({ isLoading: true, error: null });

    try {
      const response = await authApi.googleLogin(tokenId);

      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error("Invalid response from server");
      }

      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false
      });

      return true;
    } catch (error) {
      console.error("Login error:", error);
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Login failed'
      });
      return false;
    }
  },

  /**
   * Logout user
   */
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null
    });
  },

  /**
   * Clear authentication error
   */
  clearError: () => set({ error: null })
}));

export default useAuthStore;