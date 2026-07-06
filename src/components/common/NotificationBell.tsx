import React, { useState } from 'react';
import {
    Box, IconButton, Badge, Popover, Typography, CircularProgress, Button,
    alpha,
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    Event as AppointmentIcon,
    Groups as StaffIcon,
    RateReview as ReviewIcon,
    Campaign as SystemIcon,
    NotificationsNone as EmptyIcon,
    DoneAll as MarkAllReadIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { notificationService, Notification } from '../../services/notificationService';
import toast from 'react-hot-toast';

dayjs.extend(relativeTime);

const MotionBox = motion(Box);

const TYPE_ICON: Record<Notification['type'], React.ReactNode> = {
    appointment: <AppointmentIcon sx={{ fontSize: 17 }} />,
    staff: <StaffIcon sx={{ fontSize: 17 }} />,
    review: <ReviewIcon sx={{ fontSize: 17 }} />,
    system: <SystemIcon sx={{ fontSize: 17 }} />,
};

const TYPE_COLOR: Record<Notification['type'], string> = {
    appointment: '#6366f1',
    staff: '#f59e0b',
    review: '#ec4899',
    system: '#10b981',
};

/** Icon-button bell with unread badge + dropdown list. Drop into any AppBar. */
const NotificationBell: React.FC = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const queryClient = useQueryClient();
    const open = Boolean(anchorEl);

    const { data: unreadCount = 0 } = useQuery({
        queryKey: ['unreadNotificationCount'],
        queryFn: () => notificationService.getUnreadCount(),
        refetchInterval: 45000,
    });

    const { data, isLoading } = useQuery({
        queryKey: ['notifications', 'bell'],
        queryFn: () => notificationService.getNotifications({ limit: 10, sortBy: 'createdAt', sortOrder: 'desc' }),
        enabled: open,
    });

    const notifications = data?.notifications || [];

    const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleMarkAsRead = async (id: string) => {
        queryClient.setQueryData<typeof data>(['notifications', 'bell'], (prev) =>
            prev ? { ...prev, notifications: prev.notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n)) } : prev
        );
        try {
            await notificationService.markAsRead(id);
            queryClient.invalidateQueries({ queryKey: ['unreadNotificationCount'] });
        } catch {
            queryClient.invalidateQueries({ queryKey: ['notifications', 'bell'] });
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await notificationService.markAllAsRead();
            queryClient.setQueryData<typeof data>(['notifications', 'bell'], (prev) =>
                prev ? { ...prev, notifications: prev.notifications.map((n) => ({ ...n, isRead: true })) } : prev
            );
            queryClient.setQueryData(['unreadNotificationCount'], 0);
        } catch {
            toast.error('Failed to mark all as read');
        }
    };

    return (
        <>
            <IconButton onClick={handleOpen} sx={{ color: '#64748b' }}>
                <Badge
                    badgeContent={unreadCount}
                    max={99}
                    sx={{ '& .MuiBadge-badge': { bgcolor: '#ef4444', color: 'white', fontWeight: 700, fontSize: '0.65rem', minWidth: 17, height: 17 } }}
                >
                    <NotificationsIcon />
                </Badge>
            </IconButton>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{ paper: { sx: { mt: 1.5, width: 380, maxWidth: '92vw', borderRadius: '18px', border: '1px solid #f1f5f9', boxShadow: '0 12px 40px rgba(0,0,0,0.12)' } } }}
            >
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9' }}>
                    <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>Notifications</Typography>
                    {unreadCount > 0 && (
                        <Button
                            size="small" onClick={handleMarkAllRead} startIcon={<MarkAllReadIcon sx={{ fontSize: 15 }} />}
                            sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.75rem', color: '#6366f1', '&:hover': { bgcolor: alpha('#6366f1', 0.06) } }}
                        >
                            Mark all read
                        </Button>
                    )}
                </Box>

                <Box sx={{ maxHeight: 420, overflowY: 'auto' }}>
                    {isLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                            <CircularProgress size={26} sx={{ color: '#6366f1' }} />
                        </Box>
                    ) : notifications.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 6, px: 3 }}>
                            <EmptyIcon sx={{ fontSize: 40, color: '#e2e8f0', mb: 1 }} />
                            <Typography sx={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600 }}>You're all caught up</Typography>
                            <Typography sx={{ color: '#cbd5e1', fontSize: '0.76rem', mt: 0.5 }}>No notifications yet</Typography>
                        </Box>
                    ) : (
                        <AnimatePresence initial={false}>
                            {notifications.map((n) => {
                                const color = TYPE_COLOR[n.type] || '#94a3b8';
                                return (
                                    <MotionBox
                                        key={n._id}
                                        layout
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        onClick={() => !n.isRead && handleMarkAsRead(n._id)}
                                        sx={{
                                            display: 'flex', gap: 1.5, p: 2, cursor: n.isRead ? 'default' : 'pointer',
                                            borderBottom: '1px solid #f8fafc',
                                            bgcolor: n.isRead ? 'transparent' : alpha('#6366f1', 0.03),
                                            transition: 'background 0.15s ease',
                                            '&:hover': { bgcolor: n.isRead ? '#fafafa' : alpha('#6366f1', 0.06) },
                                        }}
                                    >
                                        <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: alpha(color, 0.12), color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            {TYPE_ICON[n.type] || <SystemIcon sx={{ fontSize: 17 }} />}
                                        </Box>
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
                                                <Typography sx={{ fontSize: '0.83rem', fontWeight: n.isRead ? 600 : 800, color: '#1e293b' }}>
                                                    {n.title}
                                                </Typography>
                                                {!n.isRead && <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#6366f1', flexShrink: 0, mt: 0.6 }} />}
                                            </Box>
                                            <Typography sx={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.5, mt: 0.25 }}>
                                                {n.message}
                                            </Typography>
                                            <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8', mt: 0.5, fontWeight: 600 }}>
                                                {dayjs(n.createdAt).fromNow()}
                                            </Typography>
                                        </Box>
                                    </MotionBox>
                                );
                            })}
                        </AnimatePresence>
                    )}
                </Box>
            </Popover>
        </>
    );
};

export default NotificationBell;
