import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Box,
    Typography,
    Divider,
    useTheme,
    useMediaQuery
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
} from '@mui/icons-material';

const DRAWER_WIDTH = 260;

interface MenuItem {
    title: string;
    path: string;
    icon: React.ReactElement;
}

const menuItems: MenuItem[] = [
    { title: 'Dashboard', path: '/admin', icon: <DashboardIcon /> },
    { title: 'Users', path: '/admin/users', icon: <PeopleIcon /> },
    { title: 'Salons', path: '/admin/salons', icon: <StoreIcon /> },
    { title: 'Barbers', path: '/admin/barbers', icon: <ContentCutIcon /> },
    { title: 'Appointments', path: '/admin/appointments', icon: <EventIcon /> },
    { title: 'Payments', path: '/admin/payments', icon: <PaymentIcon /> },
    { title: 'Reviews', path: '/admin/reviews', icon: <ReviewIcon /> },
];

interface AdminSidebarProps {
    mobileOpen?: boolean;
    onMobileClose?: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ mobileOpen, onMobileClose }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleNavigation = (path: string) => {
        navigate(path);
        if (isMobile && onMobileClose) {
            onMobileClose();
        }
    };

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Logo/Header */}
            <Box
                sx={{
                    p: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                }}
            >
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Admin Panel
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    StylerApp Management
                </Typography>
            </Box>

            <Divider />

            {/* Navigation Menu */}
            <List sx={{ flex: 1, pt: 2 }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;

                    return (
                        <ListItem key={item.path} disablePadding sx={{ px: 2, mb: 0.5 }}>
                            <ListItemButton
                                onClick={() => handleNavigation(item.path)}
                                sx={{
                                    borderRadius: 2,
                                    backgroundColor: isActive ? 'primary.lighter' : 'transparent',
                                    color: isActive ? 'primary.main' : 'text.primary',
                                    '&:hover': {
                                        backgroundColor: isActive ? 'primary.lighter' : 'action.hover',
                                    },
                                    transition: 'all 0.2s',
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: isActive ? 'primary.main' : 'text.secondary',
                                        minWidth: 40,
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.title}
                                    primaryTypographyProps={{
                                        fontWeight: isActive ? 600 : 400,
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            <Divider />

            {/* Settings at bottom */}
            <List sx={{ pb: 2 }}>
                <ListItem disablePadding sx={{ px: 2 }}>
                    <ListItemButton
                        onClick={() => handleNavigation('/admin/settings')}
                        sx={{ borderRadius: 2 }}
                    >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                            <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Settings" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <>
            {/* Mobile Drawer */}
            {isMobile ? (
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={onMobileClose}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        '& .MuiDrawer-paper': {
                            width: DRAWER_WIDTH,
                            boxSizing: 'border-box',
                        },
                    }}
                >
                    {drawer}
                </Drawer>
            ) : (
                /* Desktop Drawer */
                <Drawer
                    variant="permanent"
                    sx={{
                        width: DRAWER_WIDTH,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: DRAWER_WIDTH,
                            boxSizing: 'border-box',
                            borderRight: '1px solid',
                            borderColor: 'divider',
                        },
                    }}
                >
                    {drawer}
                </Drawer>
            )}
        </>
    );
};

export default AdminSidebar;
