import { TextField } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Reusable text field form component
 */
export default function FormTextField({
  error,
  ...props
}) {
  return (
    <TextField
      error={!!error}
      helperText={error?.message}
      {...props}
    />
  );
}

FormTextField.propTypes = {
  error: PropTypes.object
};