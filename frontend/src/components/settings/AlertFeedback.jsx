import { Alert, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PropTypes from 'prop-types';

/**
 * Component for displaying success and error feedback
 */
export default function AlertFeedback({ 
  success, 
  error, 
  onSuccessDismiss, 
  onErrorDismiss 
}) {
  if (!success && !error) return null;

  return (
    <>
      {success && (
        <Alert
          icon={<CheckCircleOutlineIcon fontSize="inherit" />}
          severity="success"
          sx={{
            mb: 3,
            borderRadius: 2,
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            display: 'flex',
            alignItems: 'center'
          }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={onSuccessDismiss}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {typeof success === 'string' ? success : 'Settings saved successfully'}
        </Alert>
      )}

      {error && (
        <Alert
          icon={<ErrorOutlineIcon fontSize="inherit" />}
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 2,
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
          }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={onErrorDismiss}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {error}
        </Alert>
      )}
    </>
  );
}

AlertFeedback.propTypes = {
  success: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  error: PropTypes.string,
  onSuccessDismiss: PropTypes.func.isRequired,
  onErrorDismiss: PropTypes.func.isRequired
};