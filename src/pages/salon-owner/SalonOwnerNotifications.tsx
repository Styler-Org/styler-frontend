import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Tabs,
    Tab,
    IconButton,
    Chip,
    Avatar,
    Button,
    Stack,
    Badge,
    Divider,
    Tooltip
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    Event as EventIcon,
    People as PeopleIcon,
    Star as StarIcon,
    Info as InfoIcon,
    CheckCircle as CheckCircleIcon,
    Circle as CircleIcon,
    DoneAll as DoneAllIcon,
    DeleteOutline as DeleteIcon,
    FilterList as FilterIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
    id: string;
    type: 'appointment' | 'staff' | 'review' | 'system';
    title: string;
    message: string;
    timestamp: Date;
    isRead: boolean;
}

const SalonOwnerNotifications: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: '1',
            type: 'appointment',
            title: 'New Appointment Booked',
            message: 'John Doe has booked a haircut appointment for tomorrow at 2:00 PM',
            timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 mins ago
            isRead: false
        },
        {
            id: '2',
            type: 'staff',
            title: 'Staff Member Added',
            message: 'Sarah Johnson joined Downtown Branch as a senior stylist',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            isRead: false
        },
        {
            id: '3',
            type: 'review',
            title: '5-Star Review Received',
            message: 'Your North Hills Salon received a 5-star review from Michael Smith',
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
            isRead: true
        },
        {
            id: '4',
            type: 'appointment',
            title: 'Appointment Cancelled',
            message: 'Jane Williams cancelled her appointment scheduled for today at 4:00 PM',
            timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000), // Yesterday
            isRead: true
        },
        {
            id: '5',
            type: 'system',
            title: 'Payment Received',
            message: 'Payment of ₹2,500 received for appointment #A12345',
            timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000), // Yesterday
            isRead: true
        },
        {
            id: '6',
            type: 'staff',
            title: 'Staff Availability Updated',
            message: 'Robert Brown updated his availability for next week',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            isRead: true
        },
        {
            id: '7',
            type: 'review',
            title: 'New Review Posted',
            message: 'Your Downtown Branch received a review from Emily Davis',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
            isRead: true
        },
        {
            id: '8',
            type: 'system',
            title: 'Monthly Report Available',
            message: 'Your performance report for December 2025 is now available',
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
            isRead: true
        }
    ]);

    const tabs = [
        { label: 'All', value: 'all' },
        { label: 'Unread', value: 'unread' },
        { label: 'Appointments', value: 'appointment' },
        { label: 'Staff', value: 'staff' },
        { label: 'Reviews', value: 'review' },
        { label: 'System', value: 'system' }
    ];

    const getNotificationIcon = (type: Notification['type']) => {
        switch (type) {
            case 'appointment':
                return <EventIcon fontSize="small" />;
            case 'staff':
                return <PeopleIcon fontSize="small" />;
            case 'review':
                return <StarIcon fontSize="small" />;
            case 'system':
                return <InfoIcon fontSize="small" />;
            default:
                return <NotificationsIcon fontSize="small" />;
        }
    };

    const getNotificationColor = (type: Notification['type']) => {
        switch (type) {
            case 'appointment':
                return '#3b82f6'; // Blue
            case 'staff':
                return '#8b5cf6'; // Violet
            case 'review':
                return '#f59e0b'; // Amber
            case 'system':
                return '#10b981'; // Emerald
            default:
                return '#64748b'; // Slate
        }
    };

    const getRelativeTime = (date: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    // Group notifications by date for better organizing
    const filterNotifications = () => {
        let filtered = notifications;
        const currentTabValue = tabs[activeTab].value;

        if (currentTabValue === 'unread') {
            filtered = notifications.filter(n => !n.isRead);
        } else if (currentTabValue !== 'all') {
            filtered = notifications.filter(n => n.type === currentTabValue);
        }
        return filtered;
    };

    const filteredList = filterNotifications();
    const unreadCount = notifications.filter(n => !n.isRead).length;

    const handleMarkAsRead = (id: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        setNotifications(prev =>
            prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
        );
    };

    const handleDelete = (id: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const handleMarkAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    return (
        <Box sx={{ pb: 6 }}>
            {/* Header Banner */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    pt: { xs: 4, md: 5 },
                    pb: { xs: 8, md: 10 },
                    px: { xs: 2, md: 4 },
                    borderRadius: { xs: 0, md: '0 0 32px 32px' },
                    mb: 4,
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(99, 102, 241, 0.2)'
                }}
            >
                {/* Decorative circles */}
                <Box sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 300,
                    height: 300,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
                    pointerEvents: 'none'
                }} />

                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                            <Typography variant="h3" fontWeight={800} sx={{ mb: 1, textShadow: '0 2px 4px rgba(0,0,0,0.1)', fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
                                Notifications
                            </Typography>
                            <Typography variant="body1" sx={{ opacity: 0.9, fontSize: '1.1rem', fontWeight: 500 }}>
                                You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                            </Typography>
                        </Box>
                        {unreadCount > 0 && (
                            <Button
                                variant="contained"
                                onClick={handleMarkAllAsRead}
                                startIcon={<DoneAllIcon />}
                                sx={{
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    backdropFilter: 'blur(10px)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.3)', transform: 'translateY(-2px)' },
                                    textTransform: 'none',
                                    borderRadius: '12px',
                                    fontWeight: 600,
                                    px: 3,
                                    py: 1,
                                    transition: 'all 0.2s',
                                    position: 'relative',
                                    zIndex: 1
                                }}
                            >
                                Mark all as read
                            </Button>
                        )}
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ mt: { xs: -6, md: -8 }, position: 'relative', zIndex: 2, px: { xs: 2, md: 3 } }}>
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: '24px',
                        border: '1px solid',
                        borderColor: 'divider',
                        overflow: 'hidden',
                        bgcolor: 'background.paper',
                        boxShadow: '0 12px 32px -4px rgba(0,0,0,0.1)'
                    }}
                >
                    {/* Tabs Header */}
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'rgba(248, 250, 252, 0.5)' }}>
                        <Tabs
                            value={activeTab}
                            onChange={(_, v) => setActiveTab(v)}
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{
                                px: 2,
                                '& .MuiTab-root': {
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    fontSize: '0.9rem',
                                    minHeight: 56,
                                    px: 3
                                },
                            }}
                        >
                            {tabs.map((tab) => (
                                <Tab
                                    key={tab.value}
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {tab.label}
                                            {tab.value === 'unread' && unreadCount > 0 && (
                                                <Chip
                                                    label={unreadCount}
                                                    size="small"
                                                    sx={{
                                                        height: 20,
                                                        minWidth: 20,
                                                        px: 0.5,
                                                        fontSize: '0.7rem',
                                                        fontWeight: 700,
                                                        bgcolor: 'error.main',
                                                        color: 'white'
                                                    }}
                                                />
                                            )}
                                        </Box>
                                    }
                                />
                            ))}
                        </Tabs>
                    </Box>

                    {/* Notifications List */}
                    <Box sx={{ minHeight: 400, bgcolor: '#fff' }}>
                        <AnimatePresence mode="popLayout">
                            {filteredList.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <Box sx={{ py: 10, textAlign: 'center' }}>
                                        <Avatar sx={{ width: 80, height: 80, bgcolor: '#f1f5f9', color: '#94a3b8', mx: 'auto', mb: 2 }}>
                                            <NotificationsIcon sx={{ fontSize: 40 }} />
                                        </Avatar>
                                        <Typography variant="h6" color="text.secondary" fontWeight={600}>
                                            No notifications found
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            We'll simplify let you know when something important happens.
                                        </Typography>
                                    </Box>
                                </motion.div>
                            ) : (
                                <Stack divider={<Divider component="li" />}>
                                    {filteredList.map((notification) => (
                                        <motion.div
                                            key={notification.id}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <Box
                                                sx={{
                                                    p: 2.5,
                                                    display: 'flex',
                                                    gap: 2,
                                                    alignItems: 'flex-start',
                                                    transition: 'all 0.2s',
                                                    bgcolor: notification.isRead ? 'transparent' : 'rgba(99, 102, 241, 0.02)',
                                                    '&:hover': {
                                                        bgcolor: '#f8fafc',
                                                        '& .action-buttons': { opacity: 1 }
                                                    },
                                                    position: 'relative'
                                                }}
                                            >
                                                {/* Left Status Indicator */}
                                                {!notification.isRead && (
                                                    <Box sx={{
                                                        position: 'absolute',
                                                        left: 0,
                                                        top: '50%',
                                                        transform: 'translateY(-50%)',
                                                        width: 3,
                                                        height: '60%',
                                                        bgcolor: 'primary.main',
                                                        borderRadius: '0 4px 4px 0'
                                                    }} />
                                                )}

                                                {/* Icon */}
                                                <Avatar
                                                    sx={{
                                                        bgcolor: notification.isRead ? '#f1f5f9' : `${getNotificationColor(notification.type)}15`,
                                                        color: notification.isRead ? '#94a3b8' : getNotificationColor(notification.type),
                                                        width: 44,
                                                        height: 44,
                                                        mt: 0.5
                                                    }}
                                                >
                                                    {getNotificationIcon(notification.type)}
                                                </Avatar>

                                                {/* Content */}
                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                                                        <Typography
                                                            variant="subtitle1"
                                                            sx={{
                                                                fontWeight: notification.isRead ? 600 : 700,
                                                                color: notification.isRead ? 'text.primary' : '#1e293b',
                                                                lineHeight: 1.3
                                                            }}
                                                        >
                                                            {notification.title}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'nowrap', ml: 2 }}>
                                                            {getRelativeTime(notification.timestamp)}
                                                        </Typography>
                                                    </Box>

                                                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, lineHeight: 1.5 }}>
                                                        {notification.message}
                                                    </Typography>

                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        {/* Type Badge */}
                                                        <Chip
                                                            label={notification.type}
                                                            size="small"
                                                            sx={{
                                                                height: 20,
                                                                fontSize: '0.65rem',
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.5px',
                                                                fontWeight: 700,
                                                                borderRadius: '4px',
                                                                bgcolor: notification.isRead ? '#f1f5f9' : `${getNotificationColor(notification.type)}10`,
                                                                color: notification.isRead ? '#64748b' : getNotificationColor(notification.type)
                                                            }}
                                                        />
                                                    </Box>
                                                </Box>

                                                {/* Actions */}
                                                <Box
                                                    className="action-buttons"
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: 0.5,
                                                        opacity: { xs: 1, sm: 0 },
                                                        transition: 'opacity 0.2s',
                                                    }}
                                                >
                                                    {!notification.isRead && (
                                                        <Tooltip title="Mark as read">
                                                            <IconButton
                                                                size="small"
                                                                onClick={(e) => handleMarkAsRead(notification.id, e)}
                                                                sx={{ color: 'primary.main', '&:hover': { bgcolor: 'primary.lighter' } }}
                                                            >
                                                                <CircleIcon sx={{ fontSize: 12 }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                    <Tooltip title="Delete">
                                                        <IconButton
                                                            size="small"
                                                            onClick={(e) => handleDelete(notification.id, e)}
                                                            sx={{ color: 'text.secondary', '&:hover': { color: 'error.main', bgcolor: 'error.lighter' } }}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </Box>
                                        </motion.div>
                                    ))}
                                </Stack>
                            )}
                        </AnimatePresence>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default SalonOwnerNotifications;
