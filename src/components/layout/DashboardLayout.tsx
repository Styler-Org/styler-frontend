import React, { useState } from 'react';
import {
    Box,
    IconButton,
    useTheme,
    useMediaQuery,
    Typography,
    Avatar,
    alpha,
    Badge,
} from '@mui/material';
import {
    Menu as MenuIcon,
    NotificationsNoneOutlined as BellIcon,
    Search as SearchIcon,
} from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import { useAuthStore } from '../../stores/authStore';
import Logo from '../common/Logo';

const DRAWER_WIDTH = 268;

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const pageLabels: Record<string, string> = {
    '/barber/dashboard':           'Dashboard',
    '/barber/appointments':        'Appointments',
    '/barber/schedule':            'My Schedule',
    '/barber/availability':        'Availability',
    '/barber/profile':             'My Profile',
    '/salon-owner/dashboard':      'Dashboard',
    '/salon-owner/analytics':      'Analytics',
    '/salon-owner/staff-management': 'Staff Management',
    '/salon-owner/notifications':  'Notifications',
    '/salon-owner/profile':        'My Profile',
    '/salons-owner/my-salons':     'My Salons',
    '/salons/create':              'Create Salon',
    '/appointments':               'My Appointments',
    '/profile':                    'Profile',
    '/settings':                   'Settings',
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const { user } = useAuthStore();

    const handleDrawerToggle = () => setMobileOpen(prev => !prev);

    const pageTitle = (() => {
        if (pageLabels[location.pathname]) return pageLabels[location.pathname];
        const key = Object.keys(pageLabels).find(k => location.pathname.startsWith(k) && k !== '/');
        return key ? pageLabels[key] : 'Dashboard';
    })();

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
            {/* Sidebar Navigation */}
            <Box
                component="nav"
                sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
            >
                {/* Mobile drawer */}
                <Sidebar variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} />
                {/* Desktop permanent drawer */}
                <Sidebar variant="permanent" open={true} onClose={() => {}} />
            </Box>

            {/* Main Column */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* Top Header Bar */}
                <Box
                    component="header"
                    sx={{
                        height: 64,
                        display: 'flex',
                        alignItems: 'center',
                        px: { xs: 2, md: 4 },
                        bgcolor: '#ffffff',
                        borderBottom: '1px solid #f1f5f9',
                        position: 'sticky',
                        top: 0,
                        zIndex: 50,
                        gap: 2,
                        flexShrink: 0,
                        boxShadow: '0 1px 0 rgba(0,0,0,0.03)',
                    }}
                >
                    {/* Mobile menu button + Logo */}
                    {isMobile && (
                        <>
                            <IconButton
                                onClick={handleDrawerToggle}
                                size="small"
                                sx={{
                                    bgcolor: '#f8fafc',
                                    borderRadius: '10px',
                                    border: '1px solid #f1f5f9',
                                    '&:hover': { bgcolor: '#f1f5f9', transform: 'none' },
                                }}
                            >
                                <MenuIcon sx={{ fontSize: 20, color: '#64748b' }} />
                            </IconButton>
                            <Logo size="small" variant="default" />
                        </>
                    )}

                    {/* Page Title */}
                    <Box sx={{ flex: 1 }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                color: '#0f172a',
                                fontSize: { xs: '1rem', md: '1.1rem' },
                                fontFamily: '"Outfit", sans-serif',
                                letterSpacing: '-0.01em',
                            }}
                        >
                            {pageTitle}
                        </Typography>
                        {!isMobile && (
                            <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mt: -0.2, lineHeight: 1 }}>
                                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </Typography>
                        )}
                    </Box>

                    {/* Right Actions */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {/* User mini avatar */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            {!isMobile && (
                                <Box sx={{ textAlign: 'right' }}>
                                    <Typography variant="caption" sx={{ display: 'block', fontWeight: 700, color: '#0f172a', fontSize: '0.82rem', lineHeight: 1.3 }}>
                                        {user?.name}
                                    </Typography>
                                    <Typography variant="caption" sx={{ display: 'block', color: '#94a3b8', fontSize: '0.72rem', lineHeight: 1 }}>
                                        {user?.role === 'salon_owner' ? 'Salon Owner' : user?.role === 'barber' ? 'Barber' : 'Customer'}
                                    </Typography>
                                </Box>
                            )}
                            <Avatar
                                src={user?.profilePicture}
                                sx={{
                                    width: 36,
                                    height: 36,
                                    background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                                    fontWeight: 800,
                                    fontSize: '0.85rem',
                                    border: '2px solid #e0e7ff',
                                    cursor: 'default',
                                }}
                            >
                                {user?.name?.charAt(0).toUpperCase()}
                            </Avatar>
                        </Box>
                    </Box>
                </Box>

                {/* Page Content */}
                <Box
                    sx={{
                        flex: 1,
                        p: { xs: 2, sm: 3, md: 4 },
                        maxWidth: '100%',
                        overflowX: 'hidden',
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default DashboardLayout;
