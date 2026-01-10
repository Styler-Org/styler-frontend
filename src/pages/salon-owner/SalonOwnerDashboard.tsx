import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Grid, Card, CardContent, Button, IconButton, Chip, Avatar } from '@mui/material';
import { useSalonStore } from '../../stores/salonStore';
import { useAuthStore } from '../../stores/authStore';
import {
    Store as StoreIcon,
    People as PeopleIcon,
    TrendingUp as TrendingIcon,
    AttachMoney as MoneyIcon,
    Add as AddIcon,
    Settings as SettingsIcon,
    Assessment as AssessmentIcon,
    ArrowForward as ArrowForwardIcon,
    Notifications as NotificationsIcon,
    CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import './SalonOwnerDashboard.css';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const SalonOwnerDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    // Ignore error to suppress 500 alerts, handle with 0-value fallbacks
    const { stats, loading, fetchOwnerStats } = useSalonStore();

    useEffect(() => {
        fetchOwnerStats();
    }, [fetchOwnerStats]);

    const currentStats = stats || {
        totalSalons: 0,
        totalStaff: 0,
        totalBookings: 0,
        monthlyRevenue: 0
    };

    const statsDisplay = [
        {
            icon: <StoreIcon />,
            value: currentStats.totalSalons,
            label: 'Active Salons',
            color: '#6366f1',
            increase: '+12%', // Mock data for now
            trend: 'up'
        },
        {
            icon: <PeopleIcon />,
            value: currentStats.totalStaff,
            label: 'Total Staff',
            color: '#4338ca',
            increase: '+5%',
            trend: 'up'
        },
        {
            icon: <TrendingIcon />,
            value: currentStats.totalBookings,
            label: 'Total Bookings',
            color: '#10b981',
            increase: '+28%',
            trend: 'up'
        },
        {
            icon: <MoneyIcon />,
            value: currentStats.monthlyRevenue,
            label: 'Revenue (Monthly)',
            color: '#f59e0b',
            isMoney: true,
            increase: '+15%',
            trend: 'up'
        },
    ];

    const quickActions = [
        {
            title: 'Add New Salon',
            icon: <AddIcon sx={{ fontSize: 40, color: '#6366f1' }} />,
            description: 'Register a new branch to your network',
            path: '/salons/create',
            color: '#6366f1'
        },
        {
            title: 'Manage Staff',
            icon: <PeopleIcon sx={{ fontSize: 40, color: '#4338ca' }} />,
            description: 'View and manage your team members',
            path: '/salon-owner/staff-management',
            color: '#4338ca'
        },
        {
            title: 'View Analytics',
            icon: <AssessmentIcon sx={{ fontSize: 40, color: '#10b981' }} />,
            description: 'Detailed insights on performance',
            path: '/salon-owner/analytics',
            color: '#10b981'
        }
    ];

    // Mock recent activity
    const recentActivity = [
        { type: 'booking', message: 'New appointment at Downtown Branch', time: '2 mins ago' },
        { type: 'staff', message: 'Sarah joined North Hills Salon', time: '2 hours ago' },
        { type: 'review', message: '5-star review received', time: '5 hours ago' },
    ];

    return (
        <Box className="salon-owner-dashboard" sx={{ minHeight: '100vh', bgcolor: '#f8fafc', pb: 8 }}>
            {/* Header Section */}
            <Box sx={{
                bgcolor: 'white',
                pt: 6,
                pb: 8,
                px: 3,
                borderBottom: '1px solid rgba(0,0,0,0.05)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Background decorative elements */}
                <Box sx={{
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 300,
                    height: 300,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
                    zIndex: 0
                }} />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1, fontWeight: 600 }}>
                                DASHBOARD
                            </Typography>
                            <Typography variant="h2" sx={{ fontWeight: 800, color: '#1e293b', mt: 1 }}>
                                Welcome back, {user?.name?.split(' ')[0] || 'Partner'}!
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: 600 }}>
                                Here's what's happening across your salons today.
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="outlined"
                                startIcon={<CalendarIcon />}
                                sx={{ borderRadius: '50px', bgcolor: 'white' }}
                            >
                                {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ mt: -5, position: 'relative', zIndex: 2 }}>
                {/* Stats Grid */}
                <Grid container spacing={3} sx={{ mb: 6 }}>
                    {statsDisplay.map((stat, index) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                            <MotionCard
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                elevation={0}
                                sx={{
                                    height: '100%',
                                    borderRadius: '20px',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                                    border: '1px solid rgba(0,0,0,0.02)',
                                    overflow: 'visible'
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Box sx={{
                                            p: 1.5,
                                            borderRadius: '16px',
                                            bgcolor: `${stat.color}15`,
                                            color: stat.color,
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            {stat.icon}
                                        </Box>
                                        <Chip
                                            label={stat.increase}
                                            size="small"
                                            sx={{
                                                bgcolor: 'rgba(16, 185, 129, 0.1)',
                                                color: '#10b981',
                                                fontWeight: 700,
                                                borderRadius: '8px'
                                            }}
                                        />
                                    </Box>
                                    <Typography variant="h3" sx={{ fontWeight: 800, color: '#1e293b', mb: 0.5 }}>
                                        {stat.isMoney ? (
                                            <CountUp
                                                end={stat.value}
                                                prefix="₹"
                                                separator=","
                                                duration={2}
                                            />
                                        ) : (
                                            <CountUp end={stat.value as number} duration={2} />
                                        )}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                        {stat.label}
                                    </Typography>
                                </CardContent>
                            </MotionCard>
                        </Grid>
                    ))}
                </Grid>

                <Grid container spacing={4}>
                    {/* Quick Actions */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#1e293b' }}>
                            Quick Actions
                        </Typography>
                        <Grid container spacing={3}>
                            {quickActions.map((action, index) => (
                                <Grid size={{ xs: 12, md: 6 }} key={index}>
                                    <MotionCard
                                        whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                                        transition={{ type: 'spring', stiffness: 300 }}
                                        elevation={0}
                                        sx={{
                                            borderRadius: '24px',
                                            cursor: 'pointer',
                                            border: '1px solid rgba(0,0,0,0.03)',
                                            height: '100%'
                                        }}
                                        onClick={() => navigate(action.path)}
                                    >
                                        <CardContent sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
                                            <Box sx={{
                                                p: 2,
                                                borderRadius: '20px',
                                                bgcolor: `${action.color}10`,
                                                display: 'flex'
                                            }}>
                                                {action.icon}
                                            </Box>
                                            <Box>
                                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                                                    {action.title}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {action.description}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </MotionCard>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>

                    {/* Recent Activity Sidebar */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#1e293b' }}>
                            Recent Activity
                        </Typography>
                        <Card elevation={0} sx={{ borderRadius: '24px', border: '1px solid rgba(0,0,0,0.03)' }}>
                            <CardContent sx={{ p: 4 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    {recentActivity.map((item, index) => (
                                        <Box key={index} sx={{ display: 'flex', gap: 2 }}>
                                            <Box sx={{
                                                width: 10,
                                                height: 10,
                                                borderRadius: '50%',
                                                bgcolor: index === 0 ? '#10b981' : '#cbd5e1',
                                                mt: 1
                                            }} />
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#334155' }}>
                                                    {item.message}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {item.time}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    sx={{ mt: 4, borderRadius: '12px', borderColor: 'rgba(0,0,0,0.1)' }}
                                >
                                    View All Activity
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Pro Tip Card */}
                        <Box sx={{ mt: 4 }}>
                            <MotionCard
                                elevation={0}
                                whileHover={{ scale: 1.02 }}
                                sx={{
                                    borderRadius: '24px',
                                    background: '#4338ca',
                                    color: 'white'
                                }}
                            >
                                <CardContent sx={{ p: 4, position: 'relative', overflow: 'hidden' }}>
                                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, opacity: 0.9 }}>
                                            🚀 Pro Tip
                                        </Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.9, mb: 3 }}>
                                            Adding high-quality photos to your salon profile increases booking rates by 40%.
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={() => navigate('/salons-owner/my-salons')}
                                            sx={{
                                                bgcolor: 'white',
                                                color: 'white',
                                                fontWeight: 700,
                                                '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                                            }}
                                        >
                                            Update Photos
                                        </Button>
                                    </Box>
                                </CardContent>
                            </MotionCard>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default SalonOwnerDashboard;
