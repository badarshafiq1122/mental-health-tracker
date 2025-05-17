import {
  Card, CardContent, Grid, TextField, FormControl,
  InputLabel, Select, MenuItem, Button, Stack,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import FilterListIcon from '@mui/icons-material/FilterList';
import PropTypes from 'prop-types';

/**
 * LogsFilter Component
 * Provides search and sorting controls for logs
 */
export default function LogsFilter({
  searchTerm,
  sortBy,
  sortDirection,
  onSearchChange,
  onSortByChange,
  onSortDirectionChange
}) {
  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search logs"
              value={searchTerm}
              onChange={onSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              placeholder="Search by notes, symptoms, or activities"
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={2}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel id="sort-by-label">Sort By</InputLabel>
                <Select
                  labelId="sort-by-label"
                  value={sortBy}
                  label="Sort By"
                  onChange={onSortByChange}
                  startAdornment={
                    <InputAdornment position="start">
                      <SortIcon fontSize="small" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="date">Date</MenuItem>
                  <MenuItem value="mood_rating">Mood</MenuItem>
                  <MenuItem value="anxiety_level">Anxiety</MenuItem>
                  <MenuItem value="sleep_hours">Sleep</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                onClick={onSortDirectionChange}
                size="small"
              >
                {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

LogsFilter.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortDirection: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onSortByChange: PropTypes.func.isRequired,
  onSortDirectionChange: PropTypes.func.isRequired
};