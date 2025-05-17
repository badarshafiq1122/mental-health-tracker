import { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAuthStore from '../../stores/authStore';
import useThemeStore from '../../stores/themeStore';

/**
 * Google OAuth login button component
 * Dynamically loads Google's authentication library and renders the sign-in button
 */
export default function GoogleLoginButton({ onError }) {
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login } = useAuthStore();
  const { darkMode } = useThemeStore();
  const navigate = useNavigate();
  const googleButtonRef = useRef(null);

  /**
   * Initialize Google authentication
   */
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.id = 'google-auth-script';

    if (!document.getElementById('google-auth-script')) {
      document.body.appendChild(script);
    }

    script.onload = () => {
      if (window.google && googleButtonRef.current) {
        try {
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleGoogleCallback,
            auto_select: false,
          });

          window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: darkMode ? 'filled_black' : 'outline',
            size: 'large',
            width: '100%',
            text: 'signin_with',
            shape: 'pill'
          });
        } catch (error) {
          console.error("Error initializing Google Auth:", error);
          onError("Failed to initialize Google login");
        }
      }
    };

    return () => {
      const googleScript = document.getElementById('google-auth-script');
      if (googleScript) {
        googleScript.remove();
      }

      try {
        if (window.google?.accounts?.id) {
          window.google.accounts.id.cancel();
        }
      } catch (e) {
        console.error("Error cleaning up Google Auth:", e);
      }
    };
  }, [darkMode, onError]);

  /**
   * Handles Google Auth callback
   * @param {Object} response - Google Auth response
   */
  const handleGoogleCallback = async (response) => {
    try {
      setGoogleLoading(true);
      onError(null);

      if (response.credential) {
        const success = await login(response.credential);
        if (success) {
          navigate('/');
        } else {
          onError("Authentication failed. Please try again.");
        }
      } else {
        onError("No credential received from Google");
      }
    } catch (error) {
      console.error('Google login error:', error);
      onError(error.message || 'Failed to login with Google');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Box
        ref={googleButtonRef}
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center'
        }}
      />
    </Box>
  );
}

GoogleLoginButton.propTypes = {
  onError: PropTypes.func.isRequired
};