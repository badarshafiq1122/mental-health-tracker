import { Box, Button, Paper, CircularProgress } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PropTypes from 'prop-types';

/**
 * Form navigation and submit button bar
 */
export default function FormSubmitBar({
  isLoading,
  isUpdate,
  onCancel,
  activeTab,
  setActiveTab,
  totalTabs
}) {
  const isFirstTab = activeTab === 0;
  const isLastTab = activeTab === totalTabs - 1;

  const handlePrevious = () => {
    setActiveTab(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setActiveTab(prev => Math.min(totalTabs - 1, prev + 1));
  };

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'sticky',
        bottom: 0,
        left: 0,
        right: 0,
        p: 3,
        borderTop: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        justifyContent: 'space-between',
        zIndex: 10,
        backgroundColor: 'background.paper'
      }}
    >
      <Box>
        {!isFirstTab && (
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handlePrevious}
            sx={{ mr: 1 }}
          >
            Previous
          </Button>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>

        {!isLastTab ? (
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={handleNext}
          >
            Next
          </Button>
        ) : (
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={24} color="inherit" /> : <SaveIcon />}
            color="primary"
          >
            {isUpdate ? 'Update Log' : 'Save Log'}
          </Button>
        )}
      </Box>
    </Paper>
  );
}

FormSubmitBar.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isUpdate: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  activeTab: PropTypes.number.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  totalTabs: PropTypes.number.isRequired
};