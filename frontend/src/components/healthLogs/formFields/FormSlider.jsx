import { Box, Typography, Slider } from '@mui/material';
import { Controller } from 'react-hook-form';
import PropTypes from 'prop-types';

/**
 * Reusable slider form field component
 */
export default function FormSlider({
  name,
  control,
  label,
  min = 1,
  max = 10,
  color = 'primary',
  marks = false,
  startLabel = null,
  endLabel = null,
  error = null
}) {
  return (
    <>
      <Typography id={`${name}-label`} gutterBottom>
        {label}
        {error && (
          <Typography
            component="span"
            color="error"
            variant="caption"
            sx={{ ml: 1 }}
          >
            {error.message}
          </Typography>
        )}
      </Typography>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Box sx={{ px: 2 }}>
            <Slider
              {...field}
              aria-labelledby={`${name}-label`}
              step={1}
              marks={marks}
              min={min}
              max={max}
              valueLabelDisplay="auto"
              color={color}
              onChange={(e, value) => field.onChange(value)}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              {startLabel}
              {endLabel}
            </Box>
          </Box>
        )}
      />
    </>
  );
}

FormSlider.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  color: PropTypes.string,
  marks: PropTypes.bool,
  startLabel: PropTypes.node,
  endLabel: PropTypes.node,
  error: PropTypes.object
};