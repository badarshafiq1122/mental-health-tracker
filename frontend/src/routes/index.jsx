import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import useAuthStore from '../stores/authStore';

const Dashboard = lazy(() => import('../pages/Dashboard'));
const NewLog = lazy(() => import('../pages/NewLog'));
const EditLog = lazy(() => import('../pages/EditLog'));
const AllLogs = lazy(() => import('../pages/AllLogs'));
const Analytics = lazy(() => import('../pages/Analytics'));
const Settings = lazy(() => import('../pages/Settings'));
const Login = lazy(() => import('../pages/Login'));
const NotFound = lazy(() => import('../pages/NotFound'));

/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 */
const ProtectedRoute = ({ element }) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  return isAuthenticated ? element : <Navigate to="/login" state={{ from: window.location.pathname }} />;
};

const routes = [
  {
    path: ROUTES.LOGIN,
    element: <Login />
  },

  {
    element: <Layout />,
    children: [
      {
        path: ROUTES.HOME,
        element: <ProtectedRoute element={<Dashboard />} />
      },
      {
        path: ROUTES.LOGS.ALL,
        element: <ProtectedRoute element={<AllLogs />} />
      },
      {
        path: ROUTES.LOGS.NEW,
        element: <ProtectedRoute element={<NewLog />} />
      },
      {
        path: "/log/:id/edit",
        element: <ProtectedRoute element={<EditLog />} />
      },
      {
        path: ROUTES.ANALYTICS,
        element: <ProtectedRoute element={<Analytics />} />
      },
      {
        path: ROUTES.SETTINGS,
        element: <ProtectedRoute element={<Settings />} />
      }
    ]
  },

  {
    path: "*",
    element: <NotFound />
  }
];

export { routes, ProtectedRoute };