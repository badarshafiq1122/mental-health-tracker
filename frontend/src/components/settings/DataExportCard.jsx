import { useState } from 'react';
import { 
  Box, Paper, Typography, FormControl, InputLabel, 
  Select, MenuItem, Button 
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PropTypes from 'prop-types';
import { exportApi } from '../../services/api';
import SettingsCard from './SettingsCard';

/**
 * Component for data export settings and functionality
 */
export default function DataExportCard({ onSuccess, onError }) {
  const theme = useTheme();
  const [exportFormat, setExportFormat] = useState('json');
  const [isExporting, setIsExporting] = useState(false);

  /**
   * Handle data export in selected format
   */
  const handleExportData = async () => {
    try {
      setIsExporting(true);
      
      const response = await (exportFormat === 'csv'
        ? exportApi.exportCsv()
        : exportApi.exportJson());

      const blob = new Blob([response.data], {
        type: exportFormat === 'csv'
          ? 'text/csv'
          : 'application/json'
      });

      // Create and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `mental-health-data.${exportFormat}`);
      document.body.appendChild(link);
      link.click();

      // Clean up
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }, 100);

      onSuccess(`Data exported successfully in ${exportFormat.toUpperCase()} format`);
    } catch (err) {
      console.error('Export error:', err);
      onError('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <SettingsCard 
      title="Export Data" 
      icon={<FileDownloadIcon />}
      iconBgColor="info.light"
    >
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.05)'
            : 'rgba(0, 0, 0, 0.02)',
          mb: 2.5
        }}
      >
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Download your mental health data in different formats
        </Typography>

        <FormControl size="small" fullWidth sx={{ mb: 2, mt: 1.5 }}>
          <InputLabel id="export-format-label">Format</InputLabel>
          <Select
            labelId="export-format-label"
            id="export-format"
            value={exportFormat}
            label="Format"
            onChange={(e) => setExportFormat(e.target.value)}
          >
            <MenuItem value="json">JSON</MenuItem>
            <MenuItem value="csv">CSV</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          color="info"
          onClick={handleExportData}
          disabled={isExporting}
          sx={{
            borderRadius: 2,
            boxShadow: 'none',
            py: 1.25,
            px: 3,
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }
          }}
          startIcon={<FileDownloadIcon />}
        >
          {isExporting ? 'Exporting...' : 'Export Data'}
        </Button>
      </Box>
    </SettingsCard>
  );
}

DataExportCard.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired
};