import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Container, Typography, Card, CardContent, IconButton,
    Chip, Avatar, Button, Stack, Divider, Tabs, Tab,
    CircularProgress, alpha, useTheme
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    Event as EventIcon,
    People as PeopleIcon,
    Star as StarIcon,
    Info as InfoIcon,
    DoneAll as DoneAllIcon,
    DeleteOutline as DeleteIcon,
    Circle as UnreadDot,
    NotificationsNone as EmptyIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { notificationService, Notification } from '../../services/notificationService';
import toast from 'react-hot-toast';

dayjs.extend(relativeTime);

const MotionBox = motion(Box);

type FilterType = 'all' | 'appointment' | 'review' | 'staff' | 'system';

const typeConfig: Record<string, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
    appointment: { icon: <EventIcon />, color: '#6366f1', bg: '#eef2ff', label: 'Appointment' },
    review:      { icon: <StarIcon />,  color: '#f59e0b', bg: '#fef9c3', label: 'Review' },
    staff:       { icon: <PeopleIcon />, color: '#10b981', bg: '#dcfce7', label: 'Staff' },
    system:      { icon: <InfoIcon />,  color: '#64748b', bg: '#f1f5f9', label: 'System' },
};

interface NotificationCardProps {
    notification: Notification;
    onRead: (id: string) => void;
    onDelete: (id: string) => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onRead, onDelete }) => {
    const config = typeConfig[notification.type] ?? typeConfig.system;
    const timeAgo = dayjs(notification.createdAt).fromNow();

    return (
        <MotionBox
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -24, transition: { duration: 0.2 } }}
            transition={{ duration: 0.3 }}
        >
            <Card
                sx={{
                    borderRadius: '16px',
                    border: notification.isRead ? '1px solid #f1f5f9' : '1px solid #c7d2fe',
                    boxShadow: notification.isRead ? '0 1px 4px rgba(0,0,0,0.04)' : '0 4px 16px rgba(99,102,241,0.1)',
                    bgcolor: notification.isRead ? 'white' : alpha('#6366f1', 0.02),
                    transition: 'all 0.2s',
                    '&:hover': { boxShadow: '0 6px 24px rgba(0,0,0,0.08)', borderColor: '#e2e8f0' },
                    mb: 2
                }}
            >
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                        <Avatar sx={{ bgcolor: config.bg, color: config.color, borderRadius: '12px', width: 48, height: 48, flexShrink: 0 }}>
                            {config.icon}
                        </Avatar>

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1, mb: 0.5 }}>
                                <Typography variant="body1" sx={{ fontWeight: notification.isRead ? 600 : 700, color: '#1e293b', lineHeight: 1.4 }}>
                                    {notification.title}
                                </Typography>
                                {!notification.isRead && (
                                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#6366f1', flexShrink: 0, mt: 0.6 }} />
                                )}
                            </Box>
                            <Typography variant="body2" sx={{ color: '#64748b', mb: 1.5, lineHeight: 1.6 }}>
                                {notification.message}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Chip
                                        label={config.label}
                                        size="small"
                                        sx={{ bgcolor: config.bg, color: config.color, fontWeight: 700, fontSize: '0.65rem', height: 22, borderRadius: '6px' }}
                                    />
                                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>{timeAgo}</Typography>
                                </Stack>
                                <Stack direction="row" spacing={0.5}>
                                    {!notification.isRead && (
                                        <IconButton
                                            size="small"
                                            onClick={() => onRead(notification._id)}
                                            sx={{ color: '#6366f1', '&:hover': { bgcolor: '#eef2ff' } }}
                                            title="Mark as read"
                                        >
                                            <DoneAllIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                    <IconButton
                                        size="small"
                                        onClick={() => onDelete(notification._id)}
                                        sx={{ color: '#ef4444', '&:hover': { bgcolor: '#fff1f2' } }}
                                        title="Delete"
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Stack>
                            </Box>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </MotionBox>
    );
};

const CustomerNotifications: React.FC = () => {
    const theme = useTheme();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        try {
            const params = activeFilter !== 'all' ? { type: activeFilter as any } : undefined;
            const data = await notificationService.getNotifications(params);
            setNotifications(data.notifications ?? []);
        } catch {
            toast.error('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    }, [activeFilter]);

    useEffect(() => {
        fetchNotifications();
        notificationService.getUnreadCount().then(setUnreadCount).catch(() => {});
    }, [fetchNotifications]);

    const handleRead = async (id: string) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(c => Math.max(0, c - 1));
        } catch {
            toast.error('Failed to mark as read');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const wasUnread = notifications.find(n => n._id === id)?.isRead === false;
            await notificationService.deleteNotification(id);
            setNotifications(prev => prev.filter(n => n._id !== id));
            if (wasUnread) setUnreadCount(c => Math.max(0, c - 1));
        } catch {
            toast.error('Failed to delete');
        }
    };

    const handleMarkAll = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
            toast.success('All notifications marked as read');
        } catch {
            toast.error('Failed to mark all as read');
        }
    };

    const filters: { id: FilterType; label: string; color: string }[] = [
        { id: 'all',         label: 'All',         color: '#1e293b' },
        { id: 'appointment', label: 'Appointments', color: '#6366f1' },
        { id: 'review',      label: 'Reviews',      color: '#f59e0b' },
        { id: 'staff',       label: 'Staff',        color: '#10b981' },
        { id: 'system',      label: 'System',       color: '#64748b' },
    ];

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', pt: { xs: 14, md: 12 }, pb: 8 }}>
            {/* Header */}
            <Box sx={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #1e293b 100%)', pb: 6, pt: 3, mb: -3 }}>
                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                        <Box>
                            <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', fontWeight: 700 }}>
                                INBOX
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography variant="h3" sx={{ fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>
                                    Notifications
                                </Typography>
                                {unreadCount > 0 && (
                                    <Box sx={{ px: 1.5, py: 0.5, bgcolor: '#ec4899', borderRadius: '50px', minWidth: 32, textAlign: 'center' }}>
                                        <Typography variant="caption" sx={{ color: 'white', fontWeight: 800, fontSize: '0.7rem' }}>
                                            {unreadCount}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                        {unreadCount > 0 && (
                            <Button
                                onClick={handleMarkAll}
                                startIcon={<DoneAllIcon />}
                                sx={{
                                    color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.2)',
                                    border: '1px solid', borderRadius: '50px', px: 3, fontWeight: 600,
                                    textTransform: 'none',
                                    '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                                }}
                            >
                                Mark all as read
                            </Button>
                        )}
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                {/* Filter Pills */}
                <Box sx={{ bgcolor: 'white', borderRadius: '20px', p: 1.5, mb: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.07)', display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {filters.map(f => (
                        <Button
                            key={f.id}
                            onClick={() => setActiveFilter(f.id)}
                            sx={{
                                borderRadius: '50px', px: 3, py: 1, fontWeight: 600, textTransform: 'none',
                                fontSize: '0.875rem',
                                bgcolor: activeFilter === f.id ? f.color : 'transparent',
                                color: activeFilter === f.id ? 'white' : '#64748b',
                                boxShadow: activeFilter === f.id ? `0 4px 14px ${alpha(f.color, 0.4)}` : 'none',
                                transition: 'all 0.2s',
                                '&:hover': { bgcolor: activeFilter === f.id ? f.color : '#f1f5f9' }
                            }}
                        >
                            {f.label}
                        </Button>
                    ))}
                </Box>

                {/* Notification List */}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                        <CircularProgress sx={{ color: '#6366f1' }} />
                    </Box>
                ) : notifications.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 10 }}>
                        <Box sx={{ width: 80, height: 80, borderRadius: '24px', bgcolor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
                            <EmptyIcon sx={{ fontSize: 40, color: '#cbd5e1' }} />
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                            No notifications
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                            {activeFilter === 'all' ? "You're all caught up!" : `No ${activeFilter} notifications found.`}
                        </Typography>
                    </Box>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {notifications.map(n => (
                            <NotificationCard
                                key={n._id}
                                notification={n}
                                onRead={handleRead}
                                onDelete={handleDelete}
                            />
                        ))}
                    </AnimatePresence>
                )}
            </Container>
        </Box>
    );
};

export default CustomerNotifications;
