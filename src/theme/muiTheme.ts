import { createTheme, ThemeOptions, alpha } from '@mui/material/styles';

declare module '@mui/material/styles' {
    interface Palette {
        neutral: Palette['primary'];
    }
    interface PaletteOptions {
        neutral?: PaletteOptions['primary'];
    }
}

const themeOptions: ThemeOptions = {
    palette: {
        mode: 'light',
        primary: {
            main: '#6366f1',
            light: '#a5b4fc',
            dark: '#4f46e5',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#ec4899',
            light: '#f9a8d4',
            dark: '#db2777',
            contrastText: '#ffffff',
        },
        success: {
            main: '#10b981',
            light: '#6ee7b7',
            dark: '#059669',
            contrastText: '#ffffff',
        },
        warning: {
            main: '#f59e0b',
            light: '#fde68a',
            dark: '#d97706',
            contrastText: '#ffffff',
        },
        error: {
            main: '#ef4444',
            light: '#fca5a5',
            dark: '#dc2626',
            contrastText: '#ffffff',
        },
        neutral: {
            main: '#64748b',
            light: '#94a3b8',
            dark: '#475569',
            contrastText: '#ffffff',
        },
        background: {
            default: '#f8fafc',
            paper: '#ffffff',
        },
        text: {
            primary: '#0f172a',
            secondary: '#64748b',
            disabled: '#cbd5e1',
        },
        divider: '#f1f5f9',
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
            fontFamily: '"Outfit", Inter, sans-serif',
            fontSize: 'clamp(2rem, 5vw, 3.75rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
        },
        h2: {
            fontFamily: '"Outfit", Inter, sans-serif',
            fontSize: 'clamp(1.6rem, 4vw, 2.75rem)',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            lineHeight: 1.2,
        },
        h3: {
            fontFamily: '"Outfit", Inter, sans-serif',
            fontSize: 'clamp(1.4rem, 3vw, 2.125rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1.3,
        },
        h4: {
            fontFamily: '"Outfit", Inter, sans-serif',
            fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
            fontWeight: 600,
            letterSpacing: '-0.015em',
            lineHeight: 1.4,
        },
        h5: {
            fontFamily: '"Outfit", Inter, sans-serif',
            fontSize: '1.2rem',
            fontWeight: 600,
            letterSpacing: '-0.01em',
            lineHeight: 1.5,
        },
        h6: {
            fontFamily: '"Outfit", Inter, sans-serif',
            fontSize: '1.05rem',
            fontWeight: 600,
            letterSpacing: '-0.005em',
            lineHeight: 1.5,
        },
        subtitle1: {
            fontSize: '1rem',
            fontWeight: 500,
            lineHeight: 1.6,
            letterSpacing: '-0.01em',
        },
        subtitle2: {
            fontSize: '0.875rem',
            fontWeight: 600,
            lineHeight: 1.5,
            letterSpacing: '-0.005em',
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.7,
            letterSpacing: '-0.01em',
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.65,
            letterSpacing: '-0.005em',
        },
        caption: {
            fontSize: '0.75rem',
            lineHeight: 1.5,
            letterSpacing: '0.01em',
        },
        overline: {
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            lineHeight: 1.5,
        },
        button: {
            fontFamily: '"Outfit", Inter, sans-serif',
            fontWeight: 600,
            fontSize: '0.9rem',
            textTransform: 'none',
            letterSpacing: '0.01em',
        },
    },
    shape: {
        borderRadius: 12,
    },
    shadows: [
        'none',
        '0 1px 2px 0 rgba(0,0,0,0.04)',
        '0 1px 4px 0 rgba(0,0,0,0.06)',
        '0 2px 8px -1px rgba(0,0,0,0.08)',
        '0 4px 12px -2px rgba(0,0,0,0.1)',
        '0 8px 24px -4px rgba(0,0,0,0.1)',
        '0 12px 32px -6px rgba(0,0,0,0.12)',
        '0 16px 40px -8px rgba(0,0,0,0.14)',
        '0 20px 48px -10px rgba(0,0,0,0.16)',
        '0 24px 56px -12px rgba(0,0,0,0.18)',
        '0 28px 64px -14px rgba(0,0,0,0.2)',
        '0 32px 72px -16px rgba(0,0,0,0.22)',
        '0 36px 80px -18px rgba(0,0,0,0.22)',
        '0 40px 88px -20px rgba(0,0,0,0.24)',
        '0 44px 96px -22px rgba(0,0,0,0.24)',
        '0 48px 104px -24px rgba(0,0,0,0.26)',
        '0 52px 112px -26px rgba(0,0,0,0.26)',
        '0 56px 120px -28px rgba(0,0,0,0.28)',
        '0 60px 128px -30px rgba(0,0,0,0.28)',
        '0 64px 136px -32px rgba(0,0,0,0.30)',
        '0 68px 144px -34px rgba(0,0,0,0.30)',
        '0 72px 152px -36px rgba(0,0,0,0.32)',
        '0 76px 160px -38px rgba(0,0,0,0.32)',
        '0 80px 168px -40px rgba(0,0,0,0.34)',
        '0 84px 176px -42px rgba(0,0,0,0.35)',
    ],
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                '*': {
                    boxSizing: 'border-box',
                },
                'html, body': {
                    margin: 0,
                    padding: 0,
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                },
            },
        },
        MuiButton: {
            defaultProps: {
                disableElevation: true,
            },
            styleOverrides: {
                root: {
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontWeight: 600,
                    padding: '9px 20px',
                    fontSize: '0.9rem',
                    letterSpacing: '0.01em',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:focus-visible': {
                        outline: '2px solid #6366f1',
                        outlineOffset: '2px',
                    },
                },
                sizeLarge: {
                    padding: '12px 28px',
                    fontSize: '0.975rem',
                },
                sizeSmall: {
                    padding: '6px 14px',
                    fontSize: '0.8rem',
                    borderRadius: '8px',
                },
                contained: {
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.35)',
                    color: '#ffffff',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #5558e8 0%, #4338ca 100%)',
                        boxShadow: '0 6px 20px 0 rgba(99, 102, 241, 0.5)',
                        transform: 'translateY(-1px)',
                    },
                    '&:active': {
                        transform: 'translateY(0)',
                        boxShadow: '0 2px 8px 0 rgba(99, 102, 241, 0.3)',
                    },
                    '&.Mui-disabled': {
                        background: '#e2e8f0',
                        color: '#94a3b8',
                        boxShadow: 'none',
                    },
                },
                containedSecondary: {
                    background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                    boxShadow: '0 4px 14px 0 rgba(236, 72, 153, 0.35)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #e11d77 0%, #be185d 100%)',
                        boxShadow: '0 6px 20px 0 rgba(236, 72, 153, 0.5)',
                    },
                },
                containedSuccess: {
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.3)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #0da876 0%, #047857 100%)',
                        boxShadow: '0 6px 20px 0 rgba(16, 185, 129, 0.45)',
                    },
                },
                outlined: {
                    borderWidth: '1.5px',
                    borderColor: '#e2e8f0',
                    color: '#334155',
                    '&:hover': {
                        borderWidth: '1.5px',
                        borderColor: '#6366f1',
                        color: '#6366f1',
                        background: alpha('#6366f1', 0.04),
                        transform: 'translateY(-1px)',
                    },
                },
                outlinedPrimary: {
                    borderColor: alpha('#6366f1', 0.4),
                    '&:hover': {
                        borderColor: '#6366f1',
                        background: alpha('#6366f1', 0.04),
                    },
                },
                text: {
                    '&:hover': {
                        background: alpha('#6366f1', 0.06),
                    },
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    borderRadius: '10px',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        background: alpha('#6366f1', 0.08),
                        transform: 'scale(1.05)',
                    },
                },
            },
        },
        MuiCard: {
            defaultProps: {
                elevation: 0,
            },
            styleOverrides: {
                root: {
                    borderRadius: '20px',
                    backgroundImage: 'none',
                    border: '1px solid #f1f5f9',
                    boxShadow: '0 1px 4px 0 rgba(0,0,0,0.04)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        boxShadow: '0 8px 28px -4px rgba(0,0,0,0.1)',
                        borderColor: '#e2e8f0',
                        transform: 'translateY(-3px)',
                    },
                },
            },
        },
        MuiCardContent: {
            styleOverrides: {
                root: {
                    padding: '24px',
                    '&:last-child': {
                        paddingBottom: '24px',
                    },
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
            },
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: '#f8fafc',
                        fontSize: '0.95rem',
                        transition: 'all 0.2s ease',
                        '& fieldset': {
                            borderColor: '#e2e8f0',
                            borderWidth: '1.5px',
                            transition: 'all 0.2s ease',
                        },
                        '&:hover': {
                            backgroundColor: '#f1f5f9',
                            '& fieldset': {
                                borderColor: '#cbd5e1',
                            },
                        },
                        '&.Mui-focused': {
                            backgroundColor: '#ffffff',
                            '& fieldset': {
                                borderColor: '#6366f1',
                                borderWidth: '2px',
                            },
                        },
                        '&.Mui-error fieldset': {
                            borderColor: '#ef4444',
                        },
                        '& input': {
                            padding: '13px 16px',
                        },
                        '& input::placeholder': {
                            color: '#94a3b8',
                            opacity: 1,
                        },
                    },
                    '& .MuiInputLabel-root': {
                        fontSize: '0.9rem',
                        color: '#64748b',
                        '&.Mui-focused': {
                            color: '#6366f1',
                        },
                        '&.Mui-error': {
                            color: '#ef4444',
                        },
                    },
                    '& .MuiFormHelperText-root': {
                        fontSize: '0.78rem',
                        marginTop: '6px',
                        marginLeft: '4px',
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                outlined: {
                    borderRadius: '12px',
                },
            },
        },
        MuiPaper: {
            defaultProps: {
                elevation: 0,
            },
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
                rounded: {
                    borderRadius: '20px',
                },
                elevation1: {
                    boxShadow: '0 2px 8px -1px rgba(0,0,0,0.06)',
                },
                elevation2: {
                    boxShadow: '0 4px 16px -2px rgba(0,0,0,0.08)',
                },
                elevation3: {
                    boxShadow: '0 8px 24px -4px rgba(0,0,0,0.1)',
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: '24px',
                    boxShadow: '0 24px 64px -12px rgba(0,0,0,0.2)',
                    border: '1px solid #f1f5f9',
                },
                container: {
                    backdropFilter: 'blur(4px)',
                },
            },
        },
        MuiDialogTitle: {
            styleOverrides: {
                root: {
                    padding: '24px 28px 16px',
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 700,
                    fontSize: '1.25rem',
                },
            },
        },
        MuiDialogContent: {
            styleOverrides: {
                root: {
                    padding: '8px 28px 24px',
                },
            },
        },
        MuiDialogActions: {
            styleOverrides: {
                root: {
                    padding: '8px 24px 24px',
                    gap: '8px',
                },
            },
        },
        MuiMenu: {
            styleOverrides: {
                paper: {
                    borderRadius: '16px',
                    boxShadow: '0 10px 40px -8px rgba(0,0,0,0.15)',
                    border: '1px solid #f1f5f9',
                    minWidth: '180px',
                },
                list: {
                    padding: '8px',
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    borderRadius: '10px',
                    padding: '10px 14px',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: '#334155',
                    transition: 'all 0.15s ease',
                    '&:hover': {
                        backgroundColor: '#f8fafc',
                        color: '#0f172a',
                    },
                    '&.Mui-selected': {
                        backgroundColor: alpha('#6366f1', 0.08),
                        color: '#6366f1',
                        fontWeight: 600,
                        '&:hover': {
                            backgroundColor: alpha('#6366f1', 0.12),
                        },
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                    fontSize: '0.78rem',
                    borderRadius: '8px',
                    height: '28px',
                    letterSpacing: '0.01em',
                },
                filled: {
                    border: 'none',
                },
                colorPrimary: {
                    backgroundColor: alpha('#6366f1', 0.1),
                    color: '#6366f1',
                    '&.MuiChip-filled:hover': {
                        backgroundColor: alpha('#6366f1', 0.15),
                    },
                },
                colorSuccess: {
                    backgroundColor: alpha('#10b981', 0.1),
                    color: '#059669',
                },
                colorWarning: {
                    backgroundColor: alpha('#f59e0b', 0.1),
                    color: '#d97706',
                },
                colorError: {
                    backgroundColor: alpha('#ef4444', 0.1),
                    color: '#dc2626',
                },
                label: {
                    padding: '0 10px',
                },
            },
        },
        MuiAvatar: {
            styleOverrides: {
                root: {
                    fontWeight: 700,
                    fontSize: '0.9rem',
                },
                colorDefault: {
                    backgroundColor: '#e2e8f0',
                    color: '#64748b',
                },
            },
        },
        MuiBadge: {
            styleOverrides: {
                badge: {
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    minWidth: '18px',
                    height: '18px',
                    padding: '0 4px',
                    borderRadius: '9px',
                    border: '2px solid #ffffff',
                },
            },
        },
        MuiAppBar: {
            defaultProps: {
                elevation: 0,
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    borderRight: 'none',
                    backgroundImage: 'none',
                },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: '10px',
                    transition: 'all 0.2s ease',
                    '&.Mui-selected': {
                        backgroundColor: alpha('#6366f1', 0.08),
                        color: '#6366f1',
                        '& .MuiListItemIcon-root': {
                            color: '#6366f1',
                        },
                        '&:hover': {
                            backgroundColor: alpha('#6366f1', 0.12),
                        },
                    },
                },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    backgroundColor: '#1e293b',
                    color: '#f8fafc',
                    fontSize: '0.78rem',
                    fontWeight: 500,
                    borderRadius: '8px',
                    padding: '6px 12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    letterSpacing: '0.01em',
                },
                arrow: {
                    color: '#1e293b',
                },
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    border: '1px solid transparent',
                    alignItems: 'flex-start',
                    padding: '12px 16px',
                },
                standardSuccess: {
                    backgroundColor: alpha('#10b981', 0.08),
                    color: '#065f46',
                    borderColor: alpha('#10b981', 0.2),
                    '& .MuiAlert-icon': { color: '#10b981' },
                },
                standardWarning: {
                    backgroundColor: alpha('#f59e0b', 0.08),
                    color: '#92400e',
                    borderColor: alpha('#f59e0b', 0.2),
                    '& .MuiAlert-icon': { color: '#f59e0b' },
                },
                standardError: {
                    backgroundColor: alpha('#ef4444', 0.08),
                    color: '#991b1b',
                    borderColor: alpha('#ef4444', 0.2),
                    '& .MuiAlert-icon': { color: '#ef4444' },
                },
                standardInfo: {
                    backgroundColor: alpha('#6366f1', 0.08),
                    color: '#3730a3',
                    borderColor: alpha('#6366f1', 0.2),
                    '& .MuiAlert-icon': { color: '#6366f1' },
                },
            },
        },
        MuiAccordion: {
            defaultProps: {
                disableGutters: true,
                elevation: 0,
            },
            styleOverrides: {
                root: {
                    borderRadius: '12px !important',
                    border: '1px solid #f1f5f9',
                    marginBottom: '8px',
                    '&:before': {
                        display: 'none',
                    },
                    '&.Mui-expanded': {
                        borderColor: alpha('#6366f1', 0.25),
                        boxShadow: `0 0 0 1px ${alpha('#6366f1', 0.1)}`,
                    },
                },
            },
        },
        MuiAccordionSummary: {
            styleOverrides: {
                root: {
                    padding: '4px 16px',
                    fontWeight: 600,
                    '&.Mui-expanded': {
                        color: '#6366f1',
                    },
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    minWidth: 0,
                    padding: '10px 16px',
                    borderRadius: '8px',
                    transition: 'all 0.2s ease',
                    color: '#64748b',
                    '&.Mui-selected': {
                        color: '#6366f1',
                    },
                    '&:hover': {
                        color: '#0f172a',
                        backgroundColor: alpha('#6366f1', 0.04),
                    },
                },
            },
        },
        MuiTabs: {
            styleOverrides: {
                indicator: {
                    borderRadius: '2px',
                    height: '3px',
                    background: 'linear-gradient(90deg, #6366f1, #ec4899)',
                },
            },
        },
        MuiLinearProgress: {
            styleOverrides: {
                root: {
                    borderRadius: '4px',
                    height: '6px',
                    backgroundColor: alpha('#6366f1', 0.1),
                },
                bar: {
                    borderRadius: '4px',
                    background: 'linear-gradient(90deg, #6366f1, #ec4899)',
                },
            },
        },
        MuiCircularProgress: {
            styleOverrides: {
                colorPrimary: {
                    color: '#6366f1',
                },
            },
        },
        MuiSkeleton: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    backgroundColor: '#f1f5f9',
                    '&::after': {
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                    },
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: '#f1f5f9',
                },
            },
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    '& .MuiTableCell-root': {
                        backgroundColor: '#f8fafc',
                        fontWeight: 600,
                        fontSize: '0.78rem',
                        color: '#64748b',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        borderBottom: '1px solid #f1f5f9',
                        padding: '12px 16px',
                    },
                },
            },
        },
        MuiTableBody: {
            styleOverrides: {
                root: {
                    '& .MuiTableRow-root': {
                        transition: 'background-color 0.15s ease',
                        '&:hover': {
                            backgroundColor: '#fafafa',
                        },
                    },
                    '& .MuiTableCell-root': {
                        borderBottom: '1px solid #f8fafc',
                        fontSize: '0.875rem',
                        color: '#334155',
                        padding: '14px 16px',
                    },
                },
            },
        },
        MuiSwitch: {
            styleOverrides: {
                root: {
                    padding: 8,
                },
                switchBase: {
                    '&.Mui-checked': {
                        '& + .MuiSwitch-track': {
                            backgroundColor: '#6366f1',
                            opacity: 1,
                        },
                    },
                },
                track: {
                    borderRadius: '12px',
                    backgroundColor: '#cbd5e1',
                    opacity: 1,
                },
                thumb: {
                    boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                },
            },
        },
        MuiFormControlLabel: {
            styleOverrides: {
                label: {
                    fontSize: '0.9rem',
                    fontWeight: 500,
                },
            },
        },
        MuiSnackbar: {
            styleOverrides: {
                root: {
                    '& .MuiAlert-root': {
                        borderRadius: '12px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    },
                },
            },
        },
        MuiPagination: {
            styleOverrides: {
                root: {},
            },
        },
        MuiPaginationItem: {
            styleOverrides: {
                root: {
                    borderRadius: '10px',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    transition: 'all 0.2s ease',
                    '&.Mui-selected': {
                        backgroundColor: '#6366f1',
                        color: '#ffffff',
                        '&:hover': {
                            backgroundColor: '#4f46e5',
                        },
                    },
                },
            },
        },
    },
};

export const muiTheme = createTheme(themeOptions);
