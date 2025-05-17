import { Alert } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Component to display form submission status messages
 */
export default function SubmissionStatus({ error, success }) {
  if (!error && !success) return null;

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
    </>
  );
}

SubmissionStatus.propTypes = {
  error: PropTypes.string,
  success: PropTypes.string
};