import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Paper, Alert } from '@mui/material';
import NewLogForm from '../components/healthLogs/NewLogForm';
import LogFormPageHeader from '../components/healthLogs/LogFormPageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import useLogStore from '../stores/logStore';

/**
 * Edit Log page component
 * Allows user to update an existing log entry
 */
export default function EditLog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { getLogById, logs, fetchLogs, isLoading } = useLogStore();
  const [log, setLog] = useState(null);

  useEffect(() => {
    const loadLog = async () => {
      try {
        let foundLog = getLogById(parseInt(id));

        if (!foundLog && logs.length === 0) {
          await fetchLogs();
          foundLog = getLogById(parseInt(id));
        }

        if (foundLog) {
          setLog(foundLog);
        } else {
          setError('Log not found');
          setTimeout(() => navigate('/logs'), 2000);
        }
      } catch (err) {
        setError(err.message || 'Failed to load log');
      }
    };

    loadLog();
  }, [id, getLogById, logs, fetchLogs, navigate]);

  if (isLoading || (!log && !error)) {
    return <LoadingSpinner message="Loading log..." />;
  }

  if (error) {
    return (
      <Alert severity="error">
        {error}
      </Alert>
    );
  }

  return (
    <Container maxWidth="md" sx={{ pb: 4 }}>
      <LogFormPageHeader isEditMode={true} />

      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          overflow: 'hidden'
        }}
      >
        {log && <NewLogForm defaultValues={log} isUpdate={true} />}
      </Paper>
    </Container>
  );
}