import { createTheme, ThemeOptions } from '@mui/material/styles';

// Modern Dark + Vibrant Color Scheme
const themeOptions: ThemeOptions = {
    palette: {
        mode: 'light',
        primary: {
            main: '#4f46e5', // Indigo 600
            light: '#818cf8',
            dark: '#3730a3',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#f472b6', // Pink 400
            light: '#fbcfe8',
            dark: '#db2777',
            contrastText: '#ffffff',
        },
        success: {
            main: '#10b981',
            light: '#34d399',
            dark: '#059669',
        },
        warning: {
            main: '#f59e0b',
            light: '#fbbf24',
            dark: '#d97706',
        },
        error: {
            main: '#ef4444',
            light: '#f87171',
            dark: '#dc2626',
        },
        background: {
            default: '#f0f4f8', // Slightly cooler/richer slate
            paper: '#ffffff',
        },
        text: {
            primary: '#0f172a', // Slate 900
            secondary: '#64748b', // Slate 500
        },
    },
    typography: {
        fontFamily: [
            'Inter',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            'sans-serif',
        ].join(','),
        h1: {
            fontFamily: 'Outfit, sans-serif',
            fontSize: '3.5rem',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            lineHeight: 1.1,
        },
        h2: {
            fontFamily: 'Outfit, sans-serif',
            fontSize: '2.5rem',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
        },
        h3: {
            fontFamily: 'Outfit, sans-serif',
            fontSize: '2rem',
            fontWeight: 700,
            letterSpacing: '-0.015em',
            lineHeight: 1.3,
        },
        h4: {
            fontFamily: 'Outfit, sans-serif',
            fontSize: '1.5rem',
            fontWeight: 600,
            letterSpacing: '-0.01em',
            lineHeight: 1.4,
        },
        h5: {
            fontFamily: 'Outfit, sans-serif',
            fontSize: '1.25rem',
            fontWeight: 600,
            lineHeight: 1.5,
        },
        h6: {
            fontFamily: 'Outfit, sans-serif',
            fontSize: '1.125rem',
            fontWeight: 600,
            lineHeight: 1.5,
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.7,
            letterSpacing: '-0.01em',
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.6,
            letterSpacing: '-0.005em',
        },
        button: {
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 600,
            textTransform: 'none',
            letterSpacing: '0.02em',
        },
    },
    shape: {
        borderRadius: 16,
    },
    shadows: [
        'none',
        '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', // Fillers to satisfy types if needed, or accurate elevated shadows
        '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
        '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
        '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
    ],
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '50px',
                    textTransform: 'none',
                    fontWeight: 600,
                    padding: '10px 24px',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                },
                contained: {
                    background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
                    boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.3), 0 2px 4px -1px rgba(79, 70, 229, 0.2)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #4338ca 0%, #312e81 100%)',
                        boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.4), 0 4px 6px -2px rgba(79, 70, 229, 0.2)',
                        transform: 'translateY(-1px)',
                    },
                },
                outlined: {
                    borderWidth: '1.5px',
                    '&:hover': {
                        borderWidth: '1.5px',
                        background: 'rgba(99, 102, 241, 0.04)',
                    }
                }
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 24,
                    backgroundImage: 'none',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                        transform: 'translateY(-4px)',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 16,
                        backgroundColor: '#f8fafc',
                        '& fieldset': {
                            borderColor: '#e2e8f0',
                            borderWidth: '1px',
                        },
                        '&:hover fieldset': {
                            borderColor: '#94a3b8',
                        },
                        '&.Mui-focused': {
                            backgroundColor: '#ffffff',
                            '& fieldset': {
                                borderColor: '#4f46e5',
                                borderWidth: '2px',
                            },
                        },
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
                rounded: {
                    borderRadius: 24,
                },
                elevation1: {
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 28,
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                },
            },
        },
        MuiMenu: {
            styleOverrides: {
                paper: {
                    borderRadius: 16,
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    border: '1px solid #f1f5f9',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                    borderRadius: 12,
                },
                filled: {
                    border: 'none',
                }
            },
        },
    },
};

export const muiTheme = createTheme(themeOptions);
