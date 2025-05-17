import {
  FormControl, InputLabel, Select, MenuItem,
  Chip, Box, FormHelperText
} from '@mui/material';
import { Controller } from 'react-hook-form';
import PropTypes from 'prop-types';

/**
 * Reusable multi-select form field component
 */
export default function FormMultiSelect({
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
      defaultValue={[]}
      render={({ field }) => (
        <FormControl fullWidth error={!!error}>
          <InputLabel id={id}>{label}</InputLabel>
          <Select
            {...field}
            labelId={id}
            label={label}
            multiple
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => {
                  const option = options.find(opt => opt.value === value);
                  return (
                    <Chip
                      key={value}
                      label={option ? option.label : value}
                      size="small"
                      sx={{ borderRadius: '16px' }}
                    />
                  );
                })}
              </Box>
            )}
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

FormMultiSelect.propTypes = {
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