import { Grid } from '@mui/material';
import { Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
import FormTextField from '../formFields/FormTextField';

/**
 * Symptoms & Notes tab component for the log form
 */
export default function SymptomsTab({ control, errors }) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Controller
          name="depression_symptoms"
          control={control}
          render={({ field }) => (
            <FormTextField
              {...field}
              label="Depression Symptoms (if any)"
              multiline
              rows={3}
              placeholder="E.g., low energy, loss of interest, etc."
              fullWidth
              error={errors.depression_symptoms}
            />
          )}
        />
      </Grid>

      <Grid item xs={12}>
        <Controller
          name="anxiety_symptoms"
          control={control}
          render={({ field }) => (
            <FormTextField
              {...field}
              label="Anxiety Symptoms (if any)"
              multiline
              rows={3}
              placeholder="E.g., restlessness, worry, etc."
              fullWidth
              error={errors.anxiety_symptoms}
            />
          )}
        />
      </Grid>

      <Grid item xs={12}>
        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <FormTextField
              {...field}
              label="General Notes"
              multiline
              rows={5}
              placeholder="Any additional notes about your day..."
              fullWidth
              error={errors.notes}
            />
          )}
        />
      </Grid>
    </Grid>
  );
}

SymptomsTab.propTypes = {
  control: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};