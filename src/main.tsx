import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './styles/theme.css';
import App from './App';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { muiTheme } from './theme/muiTheme';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { Toaster } from 'react-hot-toast';
import { useUIStore } from './stores/uiStore';

const AppWrapper = () => {
    const theme = useUIStore((state) => state.theme);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    return <App />;
};

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={muiTheme}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <CssBaseline />
                    <AppWrapper />
                    <Toaster
                        position="top-right"
                        gutter={10}
                        containerStyle={{ top: 20, right: 20 }}
                        toastOptions={{
                            duration: 3500,
                            style: {
                                background: '#ffffff',
                                color: '#0f172a',
                                borderRadius: '14px',
                                border: '1px solid #f1f5f9',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                                padding: '14px 18px',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                fontFamily: '"Inter", sans-serif',
                                maxWidth: '360px',
                            },
                            success: {
                                duration: 3000,
                                iconTheme: {
                                    primary: '#10b981',
                                    secondary: '#ecfdf5',
                                },
                                style: {
                                    borderLeft: '4px solid #10b981',
                                },
                            },
                            error: {
                                duration: 4500,
                                iconTheme: {
                                    primary: '#ef4444',
                                    secondary: '#fef2f2',
                                },
                                style: {
                                    borderLeft: '4px solid #ef4444',
                                },
                            },
                            loading: {
                                iconTheme: {
                                    primary: '#6366f1',
                                    secondary: '#eef2ff',
                                },
                                style: {
                                    borderLeft: '4px solid #6366f1',
                                },
                            },
                        }}
                    />
                </LocalizationProvider>
            </ThemeProvider>
        </QueryClientProvider>
    </StrictMode>
);
