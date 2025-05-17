import { Alert, Collapse, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect } from 'react';

export default function AlertMessage({
  message,
  severity = 'error',
  onClose,
  autoHide = true,
  duration = 6000
}) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    let timer;
    if (autoHide) {
      timer = setTimeout(() => {
        setOpen(false);
        if (onClose) {
          setTimeout(onClose, 300);
        }
      }, duration);
    }
    return () => clearTimeout(timer);
  }, [autoHide, duration, onClose]);

  const handleClose = () => {
    setOpen(false);
    if (onClose) {
      setTimeout(onClose, 300);
    }
  };

  return (
    <Collapse in={open}>
      <Alert
        severity={severity}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={handleClose}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        sx={{ mb: 2 }}
      >
        {message}
      </Alert>
    </Collapse>
  );
}