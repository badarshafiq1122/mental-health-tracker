import React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import SettingsIcon from '@mui/icons-material/Settings';
import { ROUTES } from '../../utils/constants';

/**
 * Returns the navigation items configuration for the sidebar
 */
export function getNavigationItems() {
  return [
    { text: 'Dashboard', icon: DashboardIcon, path: ROUTES.HOME },
    { text: 'Logs', icon: CalendarTodayIcon, path: ROUTES.LOGS.ALL },
    { text: 'Analytics', icon: ShowChartIcon, path: ROUTES.ANALYTICS },
    { text: 'Settings', icon: SettingsIcon, path: ROUTES.SETTINGS },
  ];
}