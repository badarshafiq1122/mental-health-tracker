import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import LoadingSpinner from '../components/common/LoadingSpinner';
import useAuthStore from '../stores/authStore';
import LoginCard from '../components/auth/LoginCard';

/**
 * Login page component
 * Handles authentication flow and renders login UI
 */
export default function Login() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Redirect to home or intended page if user is already authenticated
   */
  useEffect(() => {
    if (isAuthenticated) {
      navigate(location.state?.from || '/');
    }
  }, [isAuthenticated, navigate, location]);

  if (isLoading) return <LoadingSpinner message="Authenticating..." />;

  return (
    <Box className="login-container">
      <LoginCard />
    </Box>
  );
}