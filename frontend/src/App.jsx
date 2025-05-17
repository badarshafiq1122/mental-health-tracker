import { useEffect, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useRoutes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useAuthStore from './stores/authStore';
import useThemeStore from './stores/themeStore';
import LoadingSpinner from './components/common/LoadingSpinner';
import { routes } from './routes';

import { darkTheme, lightTheme } from './theme/theme';

/**
 * Route rendering component
 */
const AppRoutes = () => {
  const routeElements = useRoutes(routes);
  return routeElements;
};

/**
 * Main Application Component
 */
export default function App() {
  const { initialize, isAuthenticated } = useAuthStore();
  const { darkMode, initializeTheme } = useThemeStore();

  const activeTheme = createTheme(darkMode ? darkTheme : lightTheme);

  useEffect(() => {
    initialize();
    initializeTheme();
  }, [initialize, initializeTheme]);

  return (
    <ThemeProvider theme={activeTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <AppRoutes />
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}
