import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, Card, CardContent, Grid, TextField, Typography,
  Slider, MenuItem, RadioGroup, FormControlLabel, Radio,
  FormControl, InputLabel, Select, FormHelperText,
  Chip, Stack, Rating, Alert
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MoodIcon from '@mui/icons-material/Mood';
import MoodBadIcon from '@mui/icons-material/MoodBad';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import useLogStore from '../../stores/logStore';
import LoadingSpinner from '../common/LoadingSpinner';
import { ROUTES } from '../../utils/constants';

export default function DailyLogForm({ defaultValues = {}, isUpdate = false }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { createOrUpdateLog, isLoading } = useLogStore();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Default values for new log
  const today = format(new Date(), 'yyyy-MM-dd');
  const initialValues = {
    date: today,
    mood_rating: 5,
    anxiety_level: 5,
    sleep_hours: 7,
    sleep_quality: 'good',
    physical_activities: [], // Changed from physical_activity_type
    physical_activity_duration: 30,
    physical_activity_notes: '', // New field
    social_interactions: 5,
    stress_level: 5,
    depression_symptoms: '',
    anxiety_symptoms: '',
    notes: '',
    ...defaultValues
  };

  const { control, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: initialValues
  });

  const activityType = watch('physical_activity_type');

  const onSubmit = async (data) => {
    try {
      setError(null);
      setSuccess(null);

      const formattedData = {
        date: data.date,
        mood_rating: Number(data.mood_rating),
        anxiety_level: Number(data.anxiety_level),
        sleep_hours: Number(data.sleep_hours),
        sleep_quality: data.sleep_quality,
        physical_activity_type: data.physical_activity_type ||
                              (data.physical_activities && data.physical_activities.length > 0
                                ? data.physical_activities[0]
                                : null),
        physical_activity_duration: data.physical_activity_duration
                                  ? Number(data.physical_activity_duration)
                                  : null,
        social_interactions: Number(data.social_interactions),
        stress_level: Number(data.stress_level),
        depression_symptoms: data.depression_symptoms || null,
        anxiety_symptoms: data.anxiety_symptoms || null,
        notes: data.notes || null
      };

      console.log("Submitting log data:", formattedData);

      const result = await createOrUpdateLog(formattedData);
      console.log("Log saved successfully:", result);

      setSuccess(isUpdate ? 'Log updated successfully!' : 'Log created successfully!');

      setTimeout(() => {
        navigate(ROUTES.HOME);
      }, 1500);
    } catch (err) {
      console.error('Error saving log:', err);
      setError(err.message || 'Failed to save log. Please try again.');
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Saving your log..." />;
  }

  return (
    <Card sx={{
      borderRadius: '16px',
      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
      overflow: 'hidden'
    }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h5" gutterBottom>
          {isUpdate ? 'Update Daily Log' : 'New Daily Log'}
        </Typography>

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

        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="date"
                control={control}
                rules={{ required: 'Date is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Date"
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
              <Typography id="mood-rating-label" gutterBottom>
                Mood Rating (1-10)
              </Typography>
              <Controller
                name="mood_rating"
                control={control}
                rules={{ required: 'Mood rating is required' }}
                render={({ field }) => (
                  <Box sx={{ px: 2 }}>
                    <Slider
                      {...field}
                      aria-labelledby="mood-rating-label"
                      step={1}
                      marks
                      min={1}
                      max={10}
                      valueLabelDisplay="auto"
                      color="primary"
                      sx={{ color: theme.palette.primary.main }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <MoodBadIcon color="error" fontSize="small" />
                        <Typography variant="caption" sx={{ ml: 0.5 }}>Poor</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <MoodIcon color="success" fontSize="small" />
                        <Typography variant="caption" sx={{ ml: 0.5 }}>Excellent</Typography>
                      </Box>
                    </Box>
                  </Box>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography id="anxiety-level-label" gutterBottom>
                Anxiety Level (1-10)
              </Typography>
              <Controller
                name="anxiety_level"
                control={control}
                render={({ field }) => (
                  <Box sx={{ px: 2 }}>
                    <Slider
                      {...field}
                      aria-labelledby="anxiety-level-label"
                      step={1}
                      marks
                      min={1}
                      max={10}
                      valueLabelDisplay="auto"
                      color="secondary"
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption">Low</Typography>
                      <Typography variant="caption">High</Typography>
                    </Box>
                  </Box>
                )}
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
                    label="Sleep Hours"
                    type="number"
                    InputProps={{ inputProps: { min: 0, max: 24, step: 0.5 } }}
                    error={!!errors.sleep_hours}
                    helperText={errors.sleep_hours?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="sleep_quality"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel id="sleep-quality-label">Sleep Quality</InputLabel>
                    <Select
                      {...field}
                      labelId="sleep-quality-label"
                      label="Sleep Quality"
                    >
                      <MenuItem value="poor">Poor</MenuItem>
                      <MenuItem value="fair">Fair</MenuItem>
                      <MenuItem value="good">Good</MenuItem>
                      <MenuItem value="excellent">Excellent</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Physical Activity
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Controller
                    name="physical_activities"
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel id="activities-label">Activities</InputLabel>
                        <Select
                          {...field}
                          labelId="activities-label"
                          label="Activities"
                          multiple
                          renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {selected.map((value) => (
                                <Chip
                                  key={value}
                                  label={value.charAt(0).toUpperCase() + value.slice(1)}
                                  size="small"
                                  sx={{ borderRadius: '16px' }}
                                />
                              ))}
                            </Box>
                          )}
                        >
                          <MenuItem value="walking">Walking</MenuItem>
                          <MenuItem value="running">Running</MenuItem>
                          <MenuItem value="cycling">Cycling</MenuItem>
                          <MenuItem value="swimming">Swimming</MenuItem>
                          <MenuItem value="yoga">Yoga</MenuItem>
                          <MenuItem value="strength">Strength Training</MenuItem>
                          <MenuItem value="meditation">Meditation</MenuItem>
                          <MenuItem value="dancing">Dancing</MenuItem>
                          <MenuItem value="hiking">Hiking</MenuItem>
                          <MenuItem value="other">Other</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Activity Details:
                  </Typography>
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
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography id="social-interactions-label" gutterBottom>
                Social Interactions (1-10)
              </Typography>
              <Controller
                name="social_interactions"
                control={control}
                render={({ field }) => (
                  <Box sx={{ px: 2 }}>
                    <Slider
                      {...field}
                      aria-labelledby="social-interactions-label"
                      step={1}
                      marks
                      min={1}
                      max={10}
                      valueLabelDisplay="auto"
                      color="info"
                      sx={{ color: theme.palette.info.main }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
                    </Box>
                  </Box>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography id="stress-level-label" gutterBottom>
                Stress Level (1-10)
              </Typography>
              <Controller
                name="stress_level"
                control={control}
                render={({ field }) => (
                  <Box sx={{ px: 2 }}>
                    <Slider
                      {...field}
                      aria-labelledby="stress-level-label"
                      step={1}
                      marks
                      min={1}
                      max={10}
                      valueLabelDisplay="auto"
                      color="error"
                      sx={{ color: theme.palette.error.main }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
                    </Box>
                  </Box>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="depression_symptoms"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Depression Symptoms (if any)"
                    multiline
                    rows={2}
                    placeholder="E.g., low energy, loss of interest, etc."
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="anxiety_symptoms"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Anxiety Symptoms (if any)"
                    multiline
                    rows={2}
                    placeholder="E.g., restlessness, worry, etc."
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Notes"
                    multiline
                    rows={4}
                    placeholder="Any additional notes about your day..."
                  />
                )}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              color="primary"
              sx={{
                py: 1.5,
                borderRadius: 2,
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(94, 139, 126, 0.2)'
                }
              }}
            >
              {isUpdate ? 'Update Log' : 'Save Log'}
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate(ROUTES.HOME)}
              disabled={isLoading}
              sx={{ py: 1.5, borderRadius: 2 }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}