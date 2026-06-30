import React, { useState } from 'react';
import { Box, Container, Typography, Card, CardContent, Grid, Button, IconButton, LinearProgress, Tooltip, useTheme } from '@mui/material';
import {
    TrendingUp as TrendingIcon,
    CalendarMonth as CalendarIcon,
    AttachMoney as MoneyIcon,
    People as PeopleIcon,
    AccessTime as TimeIcon,
    MoreHoriz as MoreIcon,
    ArrowUpward as ArrowUpIcon,
    ArrowDownward as ArrowDownIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

const MotionCard = motion(Card);

const Analytics: React.FC = () => {
    const theme = useTheme();
    const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

    // Mock Data
    const stats = [
        { title: 'Total Revenue', value: 45250, isMoney: true, change: 12.5, icon: <MoneyIcon /> },
        { title: 'Total Bookings', value: 342, isMoney: false, change: 8.2, icon: <PeopleIcon /> },
        { title: 'Avg. Ticket', value: 1323, isMoney: true, change: -2.4, icon: <TrendingIcon /> },
    ];

    const revenueData = [
        { label: 'Mon', value: 4500 },
        { label: 'Tue', value: 3200 },
        { label: 'Wed', value: 6800 },
        { label: 'Thu', value: 5400 },
        { label: 'Fri', value: 8900 },
        { label: 'Sat', value: 12500 },
        { label: 'Sun', value: 9800 },
    ];

    const topServices = [
        { name: 'Haircut & Beard Trim', count: 145, percentage: 85 },
        { name: 'Classic Shave', count: 98, percentage: 60 },
        { name: 'Hair Color', count: 65, percentage: 40 },
        { name: 'Facial Treatment', count: 42, percentage: 25 },
    ];

    const maxRevenue = Math.max(...revenueData.map(d => d.value));

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', pb: 8 }}>
            {/* Header Section */}
            <Box sx={{
                bgcolor: 'white',
                borderBottom: '1px solid rgba(0,0,0,0.05)',
                pt: 4,
                pb: 6,
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                color: 'white'
            }}>
                <Container maxWidth="xl">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Box>
                            <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.7)', letterSpacing: 1, fontWeight: 600 }}>
                                PERFORMANCE
                            </Typography>
                            <Typography variant="h2" sx={{ fontWeight: 800, color: 'white' }}>
                                Analytics Overview
                            </Typography>
                        </Box>

                        {/* Time Range Selector */}
                        <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', p: 0.5, borderRadius: '50px', display: 'flex' }}>
                            {['Week', 'Month', 'Year'].map((range) => (
                                <Button
                                    key={range}
                                    onClick={() => setTimeRange(range.toLowerCase() as any)}
                                    sx={{
                                        color: timeRange === range.toLowerCase() ? '#0f172a' : 'white',
                                        bgcolor: timeRange === range.toLowerCase() ? 'white' : 'transparent',
                                        borderRadius: '50px',
                                        px: 3,
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        '&:hover': { bgcolor: timeRange === range.toLowerCase() ? 'white' : 'rgba(255,255,255,0.1)' }
                                    }}
                                >
                                    {range}
                                </Button>
                            ))}
                        </Box>
                    </Box>

                    {/* Key Stats Cards */}
                    <Grid container spacing={3}>
                        {stats.map((stat, index) => (
                            <Grid size={{ xs: 12, md: 4 }} key={index}>
                                <MotionCard
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    sx={{
                                        bgcolor: 'rgba(255,255,255,0.1)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '24px',
                                        color: 'white'
                                    }}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                            <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '14px' }}>
                                                {stat.icon}
                                            </Box>
                                            {stat.change >= 0 ? (
                                                <Box sx={{ display: 'flex', alignItems: 'center', color: '#4ade80', bgcolor: 'rgba(74, 222, 128, 0.2)', px: 1, borderRadius: '8px', height: 'fit-content', py: 0.5 }}>
                                                    <ArrowUpIcon sx={{ fontSize: 16 }} />
                                                    <Typography variant="caption" fontWeight={700}>+{stat.change}%</Typography>
                                                </Box>
                                            ) : (
                                                <Box sx={{ display: 'flex', alignItems: 'center', color: '#f87171', bgcolor: 'rgba(248, 113, 113, 0.2)', px: 1, borderRadius: '8px', height: 'fit-content', py: 0.5 }}>
                                                    <ArrowDownIcon sx={{ fontSize: 16 }} />
                                                    <Typography variant="caption" fontWeight={700}>{stat.change}%</Typography>
                                                </Box>
                                            )}
                                        </Box>
                                        <Typography variant="h3" fontWeight={700}>
                                            {stat.isMoney && '₹'}
                                            <CountUp end={stat.value} duration={2} separator="," />
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mt: 0.5 }}>
                                            {stat.title}
                                        </Typography>
                                    </CardContent>
                                </MotionCard>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            <Container maxWidth="xl" sx={{ mt: 4 }}>
                <Grid container spacing={4}>
                    {/* Revenue Trend Chart */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <MotionCard
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            sx={{ borderRadius: '24px', height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                        >
                            <CardContent sx={{ p: 4 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                                    <Box>
                                        <Typography variant="h6" fontWeight={700}>Revenue Trend</Typography>
                                        <Typography variant="body2" color="text.secondary">Daily earnings for the current week</Typography>
                                    </Box>
                                    <IconButton size="small"><MoreIcon /></IconButton>
                                </Box>

                                {/* Custom Bar Chart */}
                                <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 300, gap: 2 }}>
                                    {revenueData.map((data, index) => (
                                        <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%', justifyContent: 'flex-end' }}>
                                            <Tooltip title={data.value.toLocaleString()}>
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${(data.value / maxRevenue) * 100}%` }}
                                                    transition={{ duration: 1, delay: index * 0.1, type: 'spring' }}
                                                    style={{
                                                        width: '100%',
                                                        maxWidth: 60,
                                                        backgroundColor: index === revenueData.length - 2 ? '#6366f1' : '#e2e8f0', // Highlight Sat
                                                        borderRadius: '12px 12px 4px 4px',
                                                        position: 'relative',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <Box sx={{
                                                        position: 'absolute',
                                                        top: -30,
                                                        left: '50%',
                                                        transform: 'translateX(-50%)',
                                                        opacity: 0,
                                                        transition: 'opacity 0.2s',
                                                        '&:hover': { opacity: 1 }
                                                    }}>
                                                        <Typography variant="caption" fontWeight={700}>{data.value.toLocaleString()}</Typography>
                                                    </Box>
                                                </motion.div>
                                            </Tooltip>
                                            <Typography variant="caption" sx={{ mt: 2, fontWeight: 600, color: '#64748b' }}>
                                                {data.label}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </CardContent>
                        </MotionCard>
                    </Grid>

                    {/* Top Services */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <MotionCard
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            sx={{ borderRadius: '24px', height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                        >
                            <CardContent sx={{ p: 4 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                                    <Box>
                                        <Typography variant="h6" fontWeight={700}>Top Services</Typography>
                                        <Typography variant="body2" color="text.secondary">Most booked treatments</Typography>
                                    </Box>
                                    <IconButton size="small"><MoreIcon /></IconButton>
                                </Box>

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    {topServices.map((service, index) => (
                                        <Box key={index}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography variant="body2" fontWeight={600}>{service.name}</Typography>
                                                <Typography variant="caption" color="text.secondary">{service.count} bookings</Typography>
                                            </Box>
                                            <LinearProgress
                                                variant="determinate"
                                                value={service.percentage}
                                                sx={{
                                                    height: 8,
                                                    borderRadius: 4,
                                                    bgcolor: '#f1f5f9',
                                                    '& .MuiLinearProgress-bar': { bgcolor: index === 0 ? '#6366f1' : index === 1 ? '#8b5cf6' : index === 2 ? '#4338ca' : '#cbd5e1', borderRadius: 4 }
                                                }}
                                            />
                                        </Box>
                                    ))}
                                </Box>

                                <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                                    <Typography variant="subtitle2" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <TimeIcon fontSize="small" color="action" /> Peak Hours
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                                        {['5 PM', '6 PM', '11 AM'].map((time, i) => (
                                            <Box key={i} sx={{ px: 2, py: 1, bgcolor: '#f0f9ff', color: '#0284c7', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600 }}>
                                                {time}
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            </CardContent>
                        </MotionCard>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Analytics;
