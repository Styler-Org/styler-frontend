import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Grid, Button, Avatar, alpha, Chip } from '@mui/material';
import { useSalonStore } from '../../stores/salonStore';
import { useAuthStore } from '../../stores/authStore';
import {
    Store as StoreIcon,
    People as PeopleIcon,
    TrendingUp as TrendingIcon,
    AttachMoney as MoneyIcon,
    Add as AddIcon,
    Assessment as AssessmentIcon,
    ArrowForward as ArrowForwardIcon,
    CalendarToday as CalendarIcon,
    FiberManualRecord as DotIcon,
    Bolt as BoltIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import StatCard from '../../components/common/StatCard';

const MotionBox = motion(Box);

const SalonOwnerDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { stats, loading, fetchOwnerStats } = useSalonStore();

    useEffect(() => { fetchOwnerStats(); }, [fetchOwnerStats]);

    const currentStats = stats || { totalSalons: 0, totalStaff: 0, totalBookings: 0, monthlyRevenue: 0 };

    const firstName = user?.name?.split(' ')[0] || 'Partner';
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    const quickActions = [
        { title: 'Add New Salon', icon: <AddIcon />, description: 'Register a new branch to your network', path: '/salons/create', color: '#6366f1' },
        { title: 'Manage Staff', icon: <PeopleIcon />, description: 'View and manage your team members', path: '/salon-owner/staff-management', color: '#4338ca' },
        { title: 'View Analytics', icon: <AssessmentIcon />, description: 'Detailed insights on performance', path: '/salon-owner/analytics', color: '#10b981' },
    ];

    const recentActivity = [
        { message: 'New appointment at Downtown Branch', time: '2 mins ago', type: 'booking' },
        { message: 'Sarah joined North Hills Salon', time: '2 hours ago', type: 'staff' },
        { message: '5-star review received', time: '5 hours ago', type: 'review' },
        { message: 'Monthly earnings report ready', time: '1 day ago', type: 'report' },
    ];

    const activityColors: Record<string, string> = {
        booking: '#6366f1', staff: '#10b981', review: '#f59e0b', report: '#3b82f6',
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', pb: 8 }}>

            {/* ── Header ── */}
            <Box sx={{
                bgcolor: 'white', pt: { xs: 4, md: 6 }, pb: { xs: 6, md: 8 }, px: 3,
                borderBottom: '1px solid #f1f5f9', position: 'relative', overflow: 'hidden',
            }}>
                <Box sx={{ position: 'absolute', top: -60, right: -60, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <Box sx={{ position: 'absolute', bottom: -40, left: 80, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 3 }}>
                        <Box>
                            <Typography variant="overline" sx={{ color: '#6366f1', letterSpacing: '0.1em', fontWeight: 700, fontSize: '0.72rem' }}>
                                SALON OWNER DASHBOARD
                            </Typography>
                            <Typography variant="h3" sx={{ fontWeight: 800, color: '#0f172a', mt: 0.5, fontFamily: '"Outfit", sans-serif', lineHeight: 1.2 }}>
                                {greeting}, {firstName}!
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#64748b', mt: 1 }}>
                                Here's what's happening across your salons today.
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                            <Button
                                variant="outlined"
                                startIcon={<CalendarIcon />}
                                sx={{ borderRadius: '50px', bgcolor: 'white', borderColor: '#e2e8f0', color: '#64748b', textTransform: 'none', fontWeight: 600, '&:hover': { borderColor: '#6366f1', color: '#6366f1' } }}
                            >
                                {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric' })}
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => navigate('/salons/create')}
                                sx={{ borderRadius: '50px', textTransform: 'none', fontWeight: 600 }}
                            >
                                New Salon
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ mt: -5, position: 'relative', zIndex: 2 }}>

                {/* ── Stat Cards ── */}
                <Grid container spacing={3} sx={{ mb: 5 }}>
                    {[
                        { title: 'Active Salons', value: currentStats.totalSalons, icon: <StoreIcon />, color: '#6366f1', change: '+12%', trend: 'up' as const },
                        { title: 'Total Staff', value: currentStats.totalStaff, icon: <PeopleIcon />, color: '#4338ca', change: '+5%', trend: 'up' as const },
                        { title: 'Total Bookings', value: currentStats.totalBookings, icon: <TrendingIcon />, color: '#10b981', change: '+28%', trend: 'up' as const },
                        { title: 'Monthly Revenue', value: currentStats.monthlyRevenue, icon: <MoneyIcon />, color: '#f59e0b', prefix: '₹', change: '+15%', trend: 'up' as const },
                    ].map((stat, i) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                            <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} sx={{ height: '100%' }}>
                                <StatCard {...stat} />
                            </MotionBox>
                        </Grid>
                    ))}
                </Grid>

                <Grid container spacing={4}>

                    {/* ── Quick Actions ── */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, color: '#0f172a' }}>
                            Quick Actions
                        </Typography>
                        <Grid container spacing={2.5} sx={{ mb: 4 }}>
                            {quickActions.map((action, i) => (
                                <Grid size={{ xs: 12, sm: 4 }} key={i}>
                                    <MotionBox
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 + i * 0.08 }}
                                        whileHover={{ y: -4 }}
                                        onClick={() => navigate(action.path)}
                                        sx={{
                                            p: 3, borderRadius: '20px', bgcolor: 'white',
                                            border: '1px solid #f1f5f9', cursor: 'pointer',
                                            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                                            transition: 'box-shadow 0.25s ease, border-color 0.25s ease',
                                            '&:hover': {
                                                boxShadow: `0 8px 28px ${alpha(action.color, 0.14)}`,
                                                borderColor: alpha(action.color, 0.3),
                                            },
                                        }}
                                    >
                                        <Box sx={{
                                            width: 48, height: 48, borderRadius: '14px',
                                            bgcolor: alpha(action.color, 0.1), color: action.color,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            mb: 2, '& svg': { fontSize: '1.3rem' },
                                        }}>
                                            {action.icon}
                                        </Box>
                                        <Typography sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5, fontSize: '0.95rem' }}>
                                            {action.title}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.82rem', lineHeight: 1.5 }}>
                                            {action.description}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 2, color: action.color }}>
                                            <Typography sx={{ fontSize: '0.78rem', fontWeight: 700 }}>Get started</Typography>
                                            <ArrowForwardIcon sx={{ fontSize: 14 }} />
                                        </Box>
                                    </MotionBox>
                                </Grid>
                            ))}
                        </Grid>

                        {/* ── Monthly Revenue Bar ── */}
                        <MotionBox
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.55 }}
                            sx={{
                                p: 4, borderRadius: '20px', bgcolor: 'white',
                                border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                                <Box>
                                    <Typography sx={{ fontWeight: 700, color: '#0f172a', mb: 0.25 }}>Revenue Overview</Typography>
                                    <Typography variant="body2" sx={{ color: '#64748b' }}>Monthly performance trend</Typography>
                                </Box>
                                <Chip
                                    label="This Month"
                                    size="small"
                                    sx={{ bgcolor: alpha('#6366f1', 0.08), color: '#6366f1', fontWeight: 700, borderRadius: '8px', fontSize: '0.72rem' }}
                                />
                            </Box>

                            {/* Simulated bar chart */}
                            {[
                                { month: 'Mar', pct: 55 }, { month: 'Apr', pct: 70 },
                                { month: 'May', pct: 62 }, { month: 'Jun', pct: 85 },
                            ].map(({ month, pct }) => (
                                <Box key={month} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                                    <Typography sx={{ fontSize: '0.78rem', color: '#94a3b8', width: 28, flexShrink: 0 }}>{month}</Typography>
                                    <Box sx={{ flex: 1, height: 8, borderRadius: 4, bgcolor: '#f1f5f9', overflow: 'hidden' }}>
                                        <MotionBox
                                            initial={{ width: 0 }}
                                            animate={{ width: `${pct}%` }}
                                            transition={{ duration: 0.8, delay: 0.6 }}
                                            sx={{ height: '100%', borderRadius: 4, background: 'linear-gradient(90deg, #6366f1, #818cf8)' }}
                                        />
                                    </Box>
                                    <Typography sx={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600, width: 32, textAlign: 'right' }}>{pct}%</Typography>
                                </Box>
                            ))}
                        </MotionBox>
                    </Grid>

                    {/* ── Right Column ── */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                            {/* Activity Feed */}
                            <MotionBox
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                sx={{ p: 3, borderRadius: '20px', bgcolor: 'white', border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                            >
                                <Typography sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>Recent Activity</Typography>
                                <Typography variant="body2" sx={{ color: '#64748b', mb: 3, fontSize: '0.82rem' }}>Latest updates from your salons</Typography>

                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    {recentActivity.map((item, i) => (
                                        <Box key={i} sx={{
                                            display: 'flex', gap: 2, pb: 2.5,
                                            borderBottom: i < recentActivity.length - 1 ? '1px solid #f8fafc' : 'none',
                                            mb: i < recentActivity.length - 1 ? 2.5 : 0,
                                        }}>
                                            <Box sx={{
                                                width: 8, height: 8, borderRadius: '50%', mt: 0.75, flexShrink: 0,
                                                bgcolor: activityColors[item.type] || '#94a3b8',
                                                boxShadow: `0 0 0 3px ${alpha(activityColors[item.type] || '#94a3b8', 0.15)}`,
                                            }} />
                                            <Box sx={{ flex: 1 }}>
                                                <Typography sx={{ fontSize: '0.84rem', fontWeight: 600, color: '#334155', lineHeight: 1.4 }}>
                                                    {item.message}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#94a3b8', mt: 0.25, display: 'block' }}>
                                                    {item.time}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>

                                <Button
                                    fullWidth variant="outlined" size="small"
                                    sx={{ mt: 3, borderRadius: '12px', borderColor: '#e2e8f0', color: '#64748b', textTransform: 'none', fontWeight: 600, '&:hover': { borderColor: '#6366f1', color: '#6366f1' } }}
                                >
                                    View All Activity
                                </Button>
                            </MotionBox>

                            {/* Pro Tip */}
                            <MotionBox
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                sx={{
                                    p: 3.5, borderRadius: '20px', position: 'relative', overflow: 'hidden',
                                    background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4c1d95 100%)',
                                }}
                            >
                                <Box sx={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                    <BoltIcon sx={{ color: '#fbbf24', fontSize: '1.1rem' }} />
                                    <Typography sx={{ fontWeight: 700, color: 'rgba(255,255,255,0.9)', fontSize: '0.88rem' }}>
                                        Pro Tip
                                    </Typography>
                                </Box>
                                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.84rem', lineHeight: 1.6, mb: 2.5 }}>
                                    Adding high-quality photos to your salon profile can increase bookings by up to 40%.
                                </Typography>
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => navigate('/salon-owner/my-salons')}
                                    sx={{
                                        bgcolor: 'rgba(255,255,255,0.12)', color: 'white', fontWeight: 700,
                                        textTransform: 'none', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)',
                                        backdropFilter: 'blur(8px)',
                                        '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                                    }}
                                >
                                    Update Photos →
                                </Button>
                            </MotionBox>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default SalonOwnerDashboard;
