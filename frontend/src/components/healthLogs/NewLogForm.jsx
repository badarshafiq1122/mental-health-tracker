import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Tab, Tabs } from '@mui/material';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import useLogStore from '../../stores/logStore';
import { ROUTES } from '../../utils/constants';
import FormSubmitBar from './FormSubmitBar';
import BasicInfoTab from './formTabs/BasicInfoTab';
import ActivityTab from './formTabs/ActivityTab';
import SymptomsTab from './formTabs/SymptomsTab';
import SubmissionStatus from './SubmissionStatus';
import TabPanel from './TabPanel';

/**
 * Form component for creating a new daily log with tabbed interface
 */
export default function NewLogForm({ defaultValues = {}, isUpdate = false }) {
  const navigate = useNavigate();
  const { createOrUpdateLog, isLoading } = useLogStore();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  // Default values for new log
  const today = format(new Date(), 'yyyy-MM-dd');
  const initialValues = {
    date: today,
    mood_rating: 5,
    anxiety_level: 5,
    sleep_hours: 7,
    sleep_quality: 'good',
    physical_activities: [],
    physical_activity_duration: 30,
    physical_activity_notes: '',
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

  /**
   * Handle tab change
   */
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  /**
   * Handle form submission
   */
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

  // Check if form has validation errors in specific tab
  const hasTabErrors = (tabIndex) => {
    const tabFields = {
      0: ['date', 'mood_rating', 'anxiety_level', 'sleep_hours', 'sleep_quality'],
      1: ['physical_activities', 'physical_activity_duration', 'social_interactions', 'stress_level'],
      2: ['depression_symptoms', 'anxiety_symptoms', 'notes']
    };

    return tabFields[tabIndex].some(fieldName => errors[fieldName]);
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
      <SubmissionStatus error={error} success={success} />

      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3, pt: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
          <Tab
            label="Basic Information"
            error={hasTabErrors(0)}
            icon={hasTabErrors(0) ? "⚠️" : null}
            iconPosition="end"
          />
          <Tab
            label="Activities & Interactions"
            error={hasTabErrors(1)}
            icon={hasTabErrors(1) ? "⚠️" : null}
            iconPosition="end"
          />
          <Tab
            label="Symptoms & Notes"
            error={hasTabErrors(2)}
            icon={hasTabErrors(2) ? "⚠️" : null}
            iconPosition="end"
          />
        </Tabs>
      </Box>

      <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 3 }}>
        <TabPanel value={activeTab} index={0}>
          <BasicInfoTab
            control={control}
            errors={errors}
            isUpdate={isUpdate}
          />
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <ActivityTab
            control={control}
            errors={errors}
            watch={watch}
          />
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <SymptomsTab
            control={control}
            errors={errors}
          />
        </TabPanel>
      </Box>

      <FormSubmitBar
        isLoading={isLoading}
        isUpdate={isUpdate}
        onCancel={() => navigate(ROUTES.HOME)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalTabs={3}
      />
    </Box>
  );
}