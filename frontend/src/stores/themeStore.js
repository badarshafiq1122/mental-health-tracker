import { create } from 'zustand';

const useThemeStore = create((set, get) => ({
  darkMode: localStorage.getItem('darkMode') === 'true' || false,

  toggleDarkMode: () => {
    const newMode = !get().darkMode;
    localStorage.setItem('darkMode', newMode);
    set({ darkMode: newMode });

    if (newMode) {
      document.documentElement.classList.add('dark-mode');
      const metaThemeColor = document.querySelector("meta[name=theme-color]");
      if (metaThemeColor) {
        metaThemeColor.setAttribute("content", "#121212");
      }
    } else {
      document.documentElement.classList.remove('dark-mode');
      const metaThemeColor = document.querySelector("meta[name=theme-color]");
      if (metaThemeColor) {
        metaThemeColor.setAttribute("content", "#5E8B7E");
      }
    }
  },

  initializeTheme: () => {
    const darkMode = localStorage.getItem('darkMode') === 'true' || false;
    set({ darkMode });

    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
      const metaThemeColor = document.querySelector("meta[name=theme-color]");
      if (metaThemeColor) {
        metaThemeColor.setAttribute("content", "#121212");
      }
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }
}));

export default useThemeStore;