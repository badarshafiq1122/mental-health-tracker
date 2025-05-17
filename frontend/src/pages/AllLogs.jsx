import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import useLogStore from '../stores/logStore';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertMessage from '../components/common/AlertMessage';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { format } from 'date-fns';
import LogsHeader from '../components/healthLogs/LogsHeader';
import LogsFilter from '../components/healthLogs/LogsFilter';
import LogsTable from '../components/healthLogs/LogsTable';
import LogsEmpty from '../components/healthLogs/LogsEmpty';

/**
 * AllLogs Component
 * Displays a paginated, sortable list of user logs
 */
export default function AllLogs() {
  const { logs, fetchLogs, deleteLog, isLoading } = useLogStore();
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [logToDelete, setLogToDelete] = useState(null);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        await fetchLogs();
      } catch (err) {
        setError('Failed to load logs. Please try again.');
      }
    };

    loadLogs();
  }, [fetchLogs]);

  useEffect(() => {
    const filterAndSortLogs = () => {
      let result = [...logs];

      if (searchTerm) {
        const searchTermLower = searchTerm.toLowerCase();
        result = result.filter(log =>
          log.notes?.toLowerCase().includes(searchTermLower) ||
          log.depression_symptoms?.toLowerCase().includes(searchTermLower) ||
          log.anxiety_symptoms?.toLowerCase().includes(searchTermLower) ||
          log.physical_activity_type?.toLowerCase().includes(searchTermLower)
        );
      }

      result.sort((a, b) => {
        let comparison = 0;

        switch (sortBy) {
          case 'date':
            comparison = new Date(a.date) - new Date(b.date);
            break;
          case 'mood_rating':
            comparison = a.mood_rating - b.mood_rating;
            break;
          case 'anxiety_level':
            comparison = a.anxiety_level - b.anxiety_level;
            break;
          case 'sleep_hours':
            comparison = a.sleep_hours - b.sleep_hours;
            break;
          default:
            comparison = 0;
        }

        return sortDirection === 'asc' ? comparison : -comparison;
      });

      setFilteredLogs(result);
    };

    filterAndSortLogs();
  }, [logs, searchTerm, sortBy, sortDirection]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortByChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleSortDirectionChange = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const handleDeleteClick = (log) => {
    setLogToDelete(log);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteLog(logToDelete.id);
      setDeleteDialogOpen(false);
      setLogToDelete(null);
      setSuccess('Log deleted successfully');

      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError('Failed to delete log. Please try again.');
      setDeleteDialogOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setLogToDelete(null);
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading your logs..." />;
  }

  return (
    <Box>
      <LogsHeader />

      {error && (
        <AlertMessage
          message={error}
          severity="error"
          onClose={() => setError(null)}
        />
      )}

      {success && (
        <AlertMessage
          message={success}
          severity="success"
          onClose={() => setSuccess(null)}
        />
      )}

      <LogsFilter
        searchTerm={searchTerm}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSearchChange={handleSearchChange}
        onSortByChange={handleSortByChange}
        onSortDirectionChange={handleSortDirectionChange}
      />

      {filteredLogs.length === 0 ? (
        <LogsEmpty hasLogs={logs.length > 0} />
      ) : (
        <LogsTable
          logs={filteredLogs}
          onDeleteClick={handleDeleteClick}
        />
      )}

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Log"
        content={`Are you sure you want to delete the log from ${logToDelete ? format(new Date(logToDelete.date), 'MMM d, yyyy') : ''}? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Box>
  );
}