import {
  Grid, Typography, Box, TextField,
  Chip, Stack
} from '@mui/material';
import { Controller } from 'react-hook-form';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import FormSlider from '../formFields/FormSlider';
import FormMultiSelect from '../formFields/FormMultiSelect';

/**
 * Activity & Interactions tab component for the log form
 */
export default function ActivityTab({ control, errors, watch }) {
  const theme = useTheme();
  const hasActivities = watch('physical_activities')?.length > 0;

  /**
   * Activity options for multi-select input
   */
  const activityOptions = [
    { value: 'walking', label: 'Walking' },
    { value: 'running', label: 'Running' },
    { value: 'cycling', label: 'Cycling' },
    { value: 'swimming', label: 'Swimming' },
    { value: 'yoga', label: 'Yoga' },
    { value: 'strength', label: 'Strength Training' },
    { value: 'meditation', label: 'Meditation' },
    { value: 'dancing', label: 'Dancing' },
    { value: 'hiking', label: 'Hiking' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom>
          Physical Activity
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <FormMultiSelect
          name="physical_activities"
          control={control}
          label="Activities"
          options={activityOptions}
          error={errors.physical_activities}
        />
      </Grid>

      {hasActivities && (
        <Grid item xs={12}>
          <Box sx={{
            p: 2,
            borderRadius: 2,
            backgroundColor: theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(0, 0, 0, 0.02)'
          }}>
            <Stack spacing={2}>
              <Controller
                name="physical_activity_duration"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Total Duration (minutes)"
                    type="number"
                    InputProps={{
                      inputProps: { min: 0 },
                      startAdornment: (
                        <Box component="span" sx={{ color: 'text.secondary', mr: 1 }}>
                          ⏱️
                        </Box>
                      )
                    }}
                    size="small"
                  />
                )}
              />

              <Controller
                name="physical_activity_notes"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Activity Notes"
                    placeholder="E.g., intensity level, how you felt, etc."
                    multiline
                    rows={2}
                    size="small"
                  />
                )}
              />
            </Stack>
          </Box>
        </Grid>
      )}

      <Grid item xs={12}>
        <FormSlider
          name="social_interactions"
          control={control}
          label="Social Interactions (1-10)"
          min={1}
          max={10}
          color="info"
          marks={true}
          startLabel={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                component="span"
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  bgcolor: theme.palette.grey[500],
                  display: 'inline-block',
                  mr: 0.5
                }}
              />
              <Typography variant="caption" sx={{ ml: 0.5 }}>Minimal</Typography>
            </Box>
          }
          endLabel={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                component="span"
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  bgcolor: theme.palette.info.light,
                  display: 'inline-block',
                  mr: 0.5
                }}
              />
              <Typography variant="caption" sx={{ ml: 0.5 }}>Very Social</Typography>
            </Box>
          }
          error={errors.social_interactions}
        />
      </Grid>

      <Grid item xs={12}>
        <FormSlider
          name="stress_level"
          control={control}
          label="Stress Level (1-10)"
          min={1}
          max={10}
          color="error"
          marks={true}
          startLabel={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                component="span"
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  bgcolor: theme.palette.success.light,
                  display: 'inline-block',
                  mr: 0.5
                }}
              />
              <Typography variant="caption" sx={{ ml: 0.5 }}>Relaxed</Typography>
            </Box>
          }
          endLabel={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                component="span"
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  bgcolor: theme.palette.error.light,
                  display: 'inline-block',
                  mr: 0.5
                }}
              />
              <Typography variant="caption" sx={{ ml: 0.5 }}>Stressed</Typography>
            </Box>
          }
          error={errors.stress_level}
        />
      </Grid>
    </Grid>
  );
}

ActivityTab.propTypes = {
  control: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  watch: PropTypes.func.isRequired
};