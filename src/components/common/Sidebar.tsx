import React from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider, Avatar, IconButton, Badge } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/authStore';
import { getNavLinksForRole } from '../../utils/navigationConfig';
import { notificationService } from '../../services/notificationService';
import Logo from './Logo';

const DRAWER_WIDTH = 280;

interface SidebarProps {
    open: boolean;
    onClose: () => void;
    variant: 'permanent' | 'temporary';
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, variant }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, clearAuth } = useAuthStore();
    const navLinks = getNavLinksForRole(user?.role);

    // Fetch unread notification count
    const { data: unreadCount = 0 } = useQuery({
        queryKey: ['unreadNotificationCount'],
        queryFn: () => notificationService.getUnreadCount(),
        refetchInterval: 30000, // Refetch every 30 seconds
        enabled: !!user, // Only fetch if user is logged in
    });

    const handleLogout = () => {
        clearAuth();
        navigate('/login');
    };

    const drawerContent = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Logo size="medium" variant="default" />
            </Box>

            <Box sx={{ mb: 2, px: 2 }}>
                <Box sx={{
                    p: 2,
                    bgcolor: 'grey.100',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                }}>
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                        {user?.name?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{ overflow: 'hidden' }}>
                        <Typography variant="subtitle2" noWrap sx={{ fontWeight: 600 }}>
                            {user?.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                            {user?.role === 'salon_owner' ? 'Salon Owner' : 'Barber'}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <List sx={{ px: 2, flexGrow: 1 }}>
                {navLinks.map((item) => {
                    const isActive = location.pathname === item.path;
                    const isNotifications = item.label === 'Notifications';

                    return (
                        <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                onClick={() => {
                                    navigate(item.path);
                                    if (variant === 'temporary') onClose();
                                }}
                                sx={{
                                    borderRadius: 2,
                                    bgcolor: isActive ? 'primary.lighter' : 'transparent',
                                    color: isActive ? 'primary.main' : 'text.primary',
                                    '&:hover': {
                                        bgcolor: isActive ? 'primary.lighter' : 'grey.100',
                                    },
                                }}
                            >
                                <ListItemIcon sx={{
                                    minWidth: 40,
                                    color: isActive ? 'primary.main' : 'text.secondary'
                                }}>
                                    {isNotifications && unreadCount > 0 ? (
                                        <Badge
                                            badgeContent={unreadCount}
                                            color="error"
                                            max={99}
                                            sx={{
                                                '& .MuiBadge-badge': {
                                                    fontSize: '0.7rem',
                                                    height: '18px',
                                                    minWidth: '18px',
                                                    fontWeight: 600,
                                                }
                                            }}
                                        >
                                            {item.icon}
                                        </Badge>
                                    ) : (
                                        item.icon
                                    )}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        fontWeight: isActive ? 600 : 500,
                                        fontSize: '0.9rem'
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ p: 2 }}>
                <ListItemButton
                    onClick={handleLogout}
                    sx={{
                        borderRadius: 2,
                        color: 'error.main',
                        '&:hover': { bgcolor: 'error.lighter' }
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}>
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600 }} />
                </ListItemButton>
            </Box>
        </Box>
    );

    return (
        <React.Fragment>
            <Drawer
                variant={variant}
                open={open}
                onClose={onClose}
                PaperProps={{
                    sx: {
                        width: DRAWER_WIDTH,
                        borderRight: '1px dashed rgba(0, 0, 0, 0.12)',
                        boxShadow: variant === 'temporary' ? 24 : 'none',
                    },
                }}
                sx={{
                    display: { xs: variant === 'temporary' ? 'block' : 'none', md: variant === 'permanent' ? 'block' : 'none' },
                }}
            >
                {drawerContent}
            </Drawer>
        </React.Fragment>
    );
};

export default Sidebar;
