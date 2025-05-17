import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from '@mui/material';
import LogItem from './LogItem';
import PropTypes from 'prop-types';

/**
 * LogsTable Component
 * Displays the logs in a table format
 */
export default function LogsTable({ logs, onDeleteClick }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }}>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align="center">Mood</TableCell>
            <TableCell align="center">Anxiety</TableCell>
            <TableCell align="center">Sleep</TableCell>
            <TableCell>Activity</TableCell>
            <TableCell>Notes</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.map((log) => (
            <LogItem
              key={log.id}
              log={log}
              onDeleteClick={onDeleteClick}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

LogsTable.propTypes = {
  logs: PropTypes.array.isRequired,
  onDeleteClick: PropTypes.func.isRequired
};