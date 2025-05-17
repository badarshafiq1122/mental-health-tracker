import { Grid, Typography, Box, TextField } from '@mui/material';
import { Controller } from 'react-hook-form';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import MoodIcon from '@mui/icons-material/Mood';
import MoodBadIcon from '@mui/icons-material/MoodBad';
import FormSlider from '../formFields/FormSlider';
import FormSelect from '../formFields/FormSelect';

/**
 * Basic Information tab component for the log form
 */
export default function BasicInfoTab({ control, errors, isUpdate }) {
  const theme = useTheme();

  /**
   * Sleep quality options for select input
   */
  const sleepQualityOptions = [
    { value: 'poor', label: 'Poor' },
    { value: 'fair', label: 'Fair' },
    { value: 'good', label: 'Good' },
    { value: 'excellent', label: 'Excellent' }
  ];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Controller
          name="date"
          control={control}
          rules={{ required: 'Date is required' }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Date *"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.date}
              helperText={errors.date?.message}
              disabled={isUpdate}
            />
          )}
        />
      </Grid>

      <Grid item xs={12}>
        <FormSlider
          name="mood_rating"
          control={control}
          label="Mood Rating (1-10) *"
          min={1}
          max={10}
          color="primary"
          marks={true}
          startLabel={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <MoodBadIcon color="error" fontSize="small" />
              <Typography variant="caption" sx={{ ml: 0.5 }}>Poor</Typography>
            </Box>
          }
          endLabel={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <MoodIcon color="success" fontSize="small" />
              <Typography variant="caption" sx={{ ml: 0.5 }}>Excellent</Typography>
            </Box>
          }
          error={errors.mood_rating}
        />
      </Grid>

      <Grid item xs={12}>
        <FormSlider
          name="anxiety_level"
          control={control}
          label="Anxiety Level (1-10) *"
          min={1}
          max={10}
          color="secondary"
          marks={true}
          startLabel={<Typography variant="caption">Low</Typography>}
          endLabel={<Typography variant="caption">High</Typography>}
          error={errors.anxiety_level}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Controller
          name="sleep_hours"
          control={control}
          rules={{
            required: 'Sleep hours are required',
            min: { value: 0, message: 'Value must be positive' },
            max: { value: 24, message: 'Maximum is 24 hours' }
          }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Sleep Hours *"
              type="number"
              InputProps={{ inputProps: { min: 0, max: 24, step: 0.5 } }}
              error={!!errors.sleep_hours}
              helperText={errors.sleep_hours?.message}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormSelect
          name="sleep_quality"
          control={control}
          label="Sleep Quality *"
          options={sleepQualityOptions}
          error={errors.sleep_quality}
        />
      </Grid>
    </Grid>
  );
}

BasicInfoTab.propTypes = {
  control: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  isUpdate: PropTypes.bool
};