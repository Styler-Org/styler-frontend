import React from 'react';
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Divider,
    Avatar,
    Badge,
    Tooltip,
    alpha,
    Chip,
} from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/authStore';
import { getNavLinksForRole } from '../../utils/navigationConfig';
import { notificationService } from '../../services/notificationService';
import Logo from './Logo';

const DRAWER_WIDTH = 268;

interface SidebarProps {
    open: boolean;
    onClose: () => void;
    variant: 'permanent' | 'temporary';
}

const roleColors: Record<string, { bg: string; text: string; label: string }> = {
    salon_owner: { bg: alpha('#6366f1', 0.1), text: '#6366f1', label: 'Salon Owner' },
    barber:      { bg: alpha('#10b981', 0.1), text: '#10b981', label: 'Barber' },
    customer:    { bg: alpha('#f59e0b', 0.1), text: '#d97706', label: 'Customer' },
    superadmin:  { bg: alpha('#ef4444', 0.1), text: '#dc2626', label: 'Super Admin' },
};

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, variant }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, clearAuth } = useAuthStore();
    const navLinks = getNavLinksForRole(user?.role);

    const { data: unreadCount = 0 } = useQuery({
        queryKey: ['unreadNotificationCount'],
        queryFn: () => notificationService.getUnreadCount(),
        refetchInterval: 30000,
        enabled: !!user,
    });

    const handleLogout = () => {
        clearAuth();
        navigate('/login');
    };

    const roleConfig = user?.role ? (roleColors[user.role] ?? roleColors.customer) : roleColors.customer;

    const drawerContent = (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: '#ffffff',
                borderRight: '1px solid #f1f5f9',
            }}
        >
            {/* Logo Area */}
            <Box
                sx={{
                    p: '20px 24px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: '1px solid #f8fafc',
                }}
            >
                <Logo size="medium" variant="default" />
            </Box>

            {/* User Profile Card */}
            <Box sx={{ px: 2, pt: 2, pb: 1 }}>
                <Box
                    sx={{
                        p: '14px 16px',
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)',
                        border: '1px solid #e0e7ff',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                    }}
                >
                    <Avatar
                        src={user?.profilePicture}
                        sx={{
                            width: 44,
                            height: 44,
                            background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                            fontWeight: 800,
                            fontSize: '1rem',
                            border: '2px solid white',
                            boxShadow: '0 2px 8px rgba(99, 102, 241, 0.25)',
                        }}
                    >
                        {user?.name?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                            variant="subtitle2"
                            noWrap
                            sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem', lineHeight: 1.3 }}
                        >
                            {user?.name}
                        </Typography>
                        <Chip
                            label={roleConfig.label}
                            size="small"
                            sx={{
                                height: '20px',
                                mt: 0.3,
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                bgcolor: roleConfig.bg,
                                color: roleConfig.text,
                                border: 'none',
                                letterSpacing: '0.02em',
                                '& .MuiChip-label': { px: '8px' },
                            }}
                        />
                    </Box>
                </Box>
            </Box>

            {/* Navigation Label */}
            <Box sx={{ px: 3, pt: 1.5, pb: 0.5 }}>
                <Typography
                    variant="overline"
                    sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em' }}
                >
                    Menu
                </Typography>
            </Box>

            {/* Nav Links */}
            <List sx={{ px: 1.5, flexGrow: 1, py: 0.5 }}>
                {navLinks.map((item) => {
                    const active = location.pathname === item.path;
                    const isNotifications = item.label === 'Notifications';

                    return (
                        <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                            <Tooltip title={item.label} placement="right" disableHoverListener>
                                <ListItemButton
                                    onClick={() => {
                                        navigate(item.path);
                                        if (variant === 'temporary') onClose();
                                    }}
                                    sx={{
                                        borderRadius: '12px',
                                        py: 1.1,
                                        px: 1.5,
                                        background: active
                                            ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
                                            : 'transparent',
                                        color: active ? '#ffffff' : '#475569',
                                        boxShadow: active ? '0 3px 12px rgba(99, 102, 241, 0.3)' : 'none',
                                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            background: active
                                                ? 'linear-gradient(135deg, #5558e8 0%, #4338ca 100%)'
                                                : alpha('#6366f1', 0.06),
                                            color: active ? '#ffffff' : '#6366f1',
                                            transform: 'none',
                                        },
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 36,
                                            color: active ? 'rgba(255,255,255,0.9)' : '#94a3b8',
                                            transition: 'color 0.2s ease',
                                        }}
                                    >
                                        {isNotifications && unreadCount > 0 ? (
                                            <Badge
                                                badgeContent={unreadCount}
                                                color="error"
                                                max={99}
                                                sx={{
                                                    '& .MuiBadge-badge': {
                                                        fontSize: '0.6rem',
                                                        height: '16px',
                                                        minWidth: '16px',
                                                        fontWeight: 700,
                                                    },
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
                                            fontWeight: active ? 700 : 500,
                                            fontSize: '0.875rem',
                                            lineHeight: 1.4,
                                            letterSpacing: active ? '0.005em' : 0,
                                            color: 'inherit',
                                        }}
                                    />
                                    {isNotifications && unreadCount > 0 && !active && (
                                        <Box
                                            sx={{
                                                width: 8,
                                                height: 8,
                                                borderRadius: '50%',
                                                bgcolor: '#ef4444',
                                                flexShrink: 0,
                                            }}
                                        />
                                    )}
                                </ListItemButton>
                            </Tooltip>
                        </ListItem>
                    );
                })}
            </List>

            {/* Bottom Section */}
            <Box sx={{ borderTop: '1px solid #f8fafc', p: 1.5 }}>
                <ListItemButton
                    onClick={handleLogout}
                    sx={{
                        borderRadius: '12px',
                        py: 1.1,
                        px: 1.5,
                        color: '#94a3b8',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            bgcolor: '#fef2f2',
                            color: '#ef4444',
                            '& .MuiListItemIcon-root': { color: '#ef4444' },
                        },
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 36, color: '#cbd5e1', transition: 'color 0.2s ease' }}>
                        <LogoutIcon sx={{ fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText
                        primary="Sign Out"
                        primaryTypographyProps={{ fontWeight: 600, fontSize: '0.875rem', color: 'inherit' }}
                    />
                </ListItemButton>

                <Box sx={{ mt: 1, px: 1.5, py: 1 }}>
                    <Typography variant="caption" sx={{ color: '#cbd5e1', fontSize: '0.7rem' }}>
                        StylerApp © {new Date().getFullYear()}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );

    return (
        <>
            <Drawer
                variant={variant}
                open={open}
                onClose={onClose}
                PaperProps={{
                    sx: {
                        width: DRAWER_WIDTH,
                        boxShadow: variant === 'temporary' ? '0 16px 56px rgba(0,0,0,0.15)' : 'none',
                        border: 'none',
                    },
                }}
                sx={{
                    display: {
                        xs: variant === 'temporary' ? 'block' : 'none',
                        md: variant === 'permanent' ? 'block' : 'none',
                    },
                    '& .MuiDrawer-paper': {
                        ...(variant === 'temporary' && {
                            borderRadius: '0 20px 20px 0',
                        }),
                    },
                }}
            >
                {drawerContent}
            </Drawer>
        </>
    );
};

export default Sidebar;
