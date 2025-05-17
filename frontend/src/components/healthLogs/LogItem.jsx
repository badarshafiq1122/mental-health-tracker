import {
  TableRow, TableCell, Box, Typography,
  Tooltip, IconButton, Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ROUTES } from '../../utils/constants';
import PropTypes from 'prop-types';

/**
 * LogItem Component
 * Displays a single log entry in the logs table
 */
export default function LogItem({ log, onDeleteClick }) {
  /**
   * Returns the appropriate mood icon based on the rating
   */
  const renderMoodIcon = (moodRating) => {
    if (moodRating >= 7) {
      return <SentimentSatisfiedIcon color="success" />;
    } else if (moodRating >= 4) {
      return <SentimentNeutralIcon color="warning" />;
    } else {
      return <SentimentDissatisfiedIcon color="error" />;
    }
  };

  return (
    <TableRow key={log.id}>
      <TableCell component="th" scope="row">
        {format(new Date(log.date), 'MMM d, yyyy')}
      </TableCell>
      <TableCell align="center">
        <Tooltip title={`Mood: ${log.mood_rating}/10`}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {renderMoodIcon(log.mood_rating)}
            <Typography variant="body2" sx={{ ml: 1 }}>
              {log.mood_rating}/10
            </Typography>
          </Box>
        </Tooltip>
      </TableCell>
      <TableCell align="center">{log.anxiety_level}/10</TableCell>
      <TableCell align="center">
        <Tooltip title={`Quality: ${log.sleep_quality}`}>
          <span>{log.sleep_hours} hrs</span>
        </Tooltip>
      </TableCell>
      <TableCell>
        {log.physical_activity_type ? (
          <Chip
            label={`${log.physical_activity_type} (${log.physical_activity_duration} min)`}
            size="small"
            color="primary"
            variant="outlined"
          />
        ) : (
          <Typography variant="body2" color="text.secondary">
            None
          </Typography>
        )}
      </TableCell>
      <TableCell>
        <Typography
          variant="body2"
          sx={{
            maxWidth: 200,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {log.notes || '—'}
        </Typography>
      </TableCell>
      <TableCell align="center">
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Tooltip title="Edit">
            <IconButton
              component={Link}
              to={ROUTES.LOGS.EDIT(log.id)}
              size="small"
              color="primary"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() => onDeleteClick(log)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </TableCell>
    </TableRow>
  );
}

LogItem.propTypes = {
  log: PropTypes.shape({
    id: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    mood_rating: PropTypes.number.isRequired,
    anxiety_level: PropTypes.number.isRequired,
    sleep_hours: PropTypes.number.isRequired,
    sleep_quality: PropTypes.string.isRequired,
    physical_activity_type: PropTypes.string,
    physical_activity_duration: PropTypes.number,
    notes: PropTypes.string
  }).isRequired,
  onDeleteClick: PropTypes.func.isRequired
};