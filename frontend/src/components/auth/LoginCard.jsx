import { useState } from 'react';
import { Card, CardContent } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useThemeStore from '../../stores/themeStore';
import AlertMessage from '../common/AlertMessage';
import LoginHeader from './LoginHeader';
import GoogleLoginButton from './GoogleLoginButton';
import LoginFooter from './LoginFooter';

/**
 * Card component containing login form and options
 */
export default function LoginCard() {
  const theme = useTheme();
  const { darkMode } = useThemeStore();
  const [error, setError] = useState(null);

  return (
    <Card
      elevation={darkMode ? 5 : 2}
      sx={{
        maxWidth: 400,
        width: '100%',
        overflow: 'hidden',
        borderRadius: '16px',
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <LoginHeader />

        {error && (
          <AlertMessage
            message={error}
            severity="error"
            onClose={() => setError(null)}
            sx={{ mb: 2 }}
          />
        )}

        <GoogleLoginButton onError={setError} />
        <LoginFooter />
      </CardContent>
    </Card>
  );
}