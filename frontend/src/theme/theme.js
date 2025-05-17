
const baseColors = {
  primary: {
    main: '#5E8B7E',
    light: '#7FA99B',
    dark: '#3B685E',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#A7C4BC',
    light: '#C2D8D2',
    dark: '#7A9992',
    contrastText: '#333333',
  },
  error: {
    main: '#E98074',
    light: '#F2A59B',
    dark: '#D25F52',
    contrastText: '#ffffff',
  },
  warning: {
    main: '#E4B363',
    light: '#EDC785',
    dark: '#C99543',
    contrastText: '#333333',
  },
  info: {
    main: '#6D9DC5',
    light: '#8FB5D5',
    dark: '#4A7BA6',
    contrastText: '#ffffff',
  },
  success: {
    main: '#83BD75',
    light: '#A5D39C',
    dark: '#629954',
    contrastText: '#ffffff',
  },
};

// Common theme settings
const commonSettings = {
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      letterSpacing: '-0.01em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      letterSpacing: '-0.01em',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      letterSpacing: '-0.01em',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 16px',
          transition: 'all 0.2s ease-in-out',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.08)',
            transform: 'translateY(-1px)'
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          transition: 'background-color 0.2s ease-in-out',
        }
      }
    },
    MuiSlider: {
      styleOverrides: {
        thumb: {
          width: 16,
          height: 16,
          boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
        },
        track: {
          height: 6,
          borderRadius: 3,
        },
        rail: {
          height: 6,
          borderRadius: 3,
          opacity: 0.3,
        }
      }
    },
  },
};

const lightTheme = {
  ...commonSettings,
  palette: {
    mode: 'light',
    primary: baseColors.primary,
    secondary: baseColors.secondary,
    error: baseColors.error,
    warning: baseColors.warning,
    info: baseColors.info,
    success: baseColors.success,
    background: {
      default: '#F8FAFB',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2E3C40',
      secondary: '#5A6B6E',
      disabled: '#90A4A7',
    },
    divider: 'rgba(0, 0, 0, 0.08)',
    action: {
      active: baseColors.primary.main,
      hover: 'rgba(94, 139, 126, 0.08)',
    }
  },
};

const darkTheme = {
  ...commonSettings,
  palette: {
    mode: 'dark',
    primary: {
      main: '#7FA99B',
      light: '#9EBEBC',
      dark: '#4D6A60',
      contrastText: '#000000',
    },
    secondary: {
      main: '#A7C4BC',
      light: '#C2D8D2',
      dark: '#7A9992',
      contrastText: '#000000',
    },
    error: baseColors.error,
    warning: baseColors.warning,
    info: baseColors.info,
    success: baseColors.success,
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#E8ECEC',
      secondary: '#B0BABA',
      disabled: '#6C7777',
    },
    divider: 'rgba(255, 255, 255, 0.1)',
    action: {
      active: '#7FA99B',
      hover: 'rgba(127, 169, 155, 0.12)',
    }
  },
  components: {
    ...commonSettings.components,
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
          overflow: 'hidden',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
};

export { lightTheme, darkTheme };