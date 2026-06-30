import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
    Box, Typography, Divider, useTheme, useMediaQuery, alpha
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    Store as StoreIcon,
    ContentCut as ContentCutIcon,
    Event as EventIcon,
    Payment as PaymentIcon,
    RateReview as ReviewIcon,
    Settings as SettingsIcon,
    AutoAwesome as LogoIcon,
} from '@mui/icons-material';

const DRAWER_WIDTH = 260;

interface NavItem { title: string; path: string; icon: React.ReactElement; exact?: boolean }

const navItems: NavItem[] = [
    { title: 'Dashboard',     path: '/admin',              icon: <DashboardIcon />, exact: true },
    { title: 'Users',         path: '/admin/users',        icon: <PeopleIcon /> },
    { title: 'Salons',        path: '/admin/salons',       icon: <StoreIcon /> },
    { title: 'Barbers',       path: '/admin/barbers',      icon: <ContentCutIcon /> },
    { title: 'Appointments',  path: '/admin/appointments', icon: <EventIcon /> },
    { title: 'Payments',      path: '/admin/payments',     icon: <PaymentIcon /> },
    { title: 'Reviews',       path: '/admin/reviews',      icon: <ReviewIcon /> },
];

interface AdminSidebarProps { mobileOpen?: boolean; onMobileClose?: () => void }

const AdminSidebar: React.FC<AdminSidebarProps> = ({ mobileOpen, onMobileClose }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const isActive = (item: NavItem) =>
        item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);

    const handleNav = (path: string) => {
        navigate(path);
        if (isMobile && onMobileClose) onMobileClose();
    };

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#0f172a' }}>
            {/* Brand Header */}
            <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 38, height: 38, borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LogoIcon sx={{ color: 'white', fontSize: 20 }} />
                </Box>
                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'white', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
                        Styler
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                        Admin Panel
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />

            {/* Nav Links */}
            <List sx={{ flex: 1, pt: 2, px: 1.5 }}>
                {navItems.map(item => {
                    const active = isActive(item);
                    return (
                        <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                onClick={() => handleNav(item.path)}
                                sx={{
                                    borderRadius: '12px', py: 1.3,
                                    bgcolor: active ? alpha('#6366f1', 0.15) : 'transparent',
                                    border: active ? '1px solid rgba(99,102,241,0.25)' : '1px solid transparent',
                                    transition: 'all 0.2s',
                                    '&:hover': { bgcolor: active ? alpha('#6366f1', 0.18) : 'rgba(255,255,255,0.04)' }
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 38, color: active ? '#a5b4fc' : 'rgba(255,255,255,0.35)' }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.title}
                                    primaryTypographyProps={{
                                        fontSize: '0.875rem',
                                        fontWeight: active ? 700 : 500,
                                        color: active ? 'white' : 'rgba(255,255,255,0.5)',
                                    }}
                                />
                                {active && (
                                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#a5b4fc', flexShrink: 0 }} />
                                )}
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mx: 1.5 }} />

            {/* Settings at bottom */}
            <Box sx={{ p: 1.5, pb: 2 }}>
                <ListItemButton
                    onClick={() => handleNav('/admin/settings')}
                    sx={{
                        borderRadius: '12px', py: 1.3,
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.04)' }
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 38, color: 'rgba(255,255,255,0.35)' }}>
                        <SettingsIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary="Settings"
                        primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500, color: 'rgba(255,255,255,0.5)' }}
                    />
                </ListItemButton>
            </Box>
        </Box>
    );

    return (
        <>
            {isMobile ? (
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={onMobileClose}
                    ModalProps={{ keepMounted: true }}
                    sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', bgcolor: '#0f172a', border: 'none' } }}
                >
                    {drawer}
                </Drawer>
            ) : (
                <Drawer
                    variant="permanent"
                    sx={{ width: DRAWER_WIDTH, flexShrink: 0, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', bgcolor: '#0f172a', border: 'none' } }}
                >
                    {drawer}
                </Drawer>
            )}
        </>
    );
};

export default AdminSidebar;
