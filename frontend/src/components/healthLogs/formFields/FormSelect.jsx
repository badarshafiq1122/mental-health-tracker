import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { Controller } from 'react-hook-form';
import PropTypes from 'prop-types';

/**
 * Reusable select form field component
 */
export default function FormSelect({
  name,
  control,
  label,
  options = [],
  error = null
}) {
  const id = `${name}-select-label`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControl fullWidth error={!!error}>
          <InputLabel id={id}>{label}</InputLabel>
          <Select
            {...field}
            labelId={id}
            label={label}
          >
            {options.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
}

FormSelect.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  error: PropTypes.object
};