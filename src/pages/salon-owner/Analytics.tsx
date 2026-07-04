import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Card, CardContent, Grid, Button, IconButton, LinearProgress, Tooltip, CircularProgress, Alert } from '@mui/material';
import {
    TrendingUp as TrendingIcon,
    People as PeopleIcon,
    AccessTime as TimeIcon,
    MoreHoriz as MoreIcon,
    ArrowUpward as ArrowUpIcon,
    ArrowDownward as ArrowDownIcon,
    AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useSalonStore } from '../../stores/salonStore';
import { insightsService, InsightsRange, SalonOverview } from '../../services/insightsService';

const MotionCard = motion(Card);

const RANGE_OPTIONS: { label: string; value: InsightsRange }[] = [
    { label: '7 Days', value: '7d' },
    { label: '30 Days', value: '30d' },
    { label: '90 Days', value: '90d' },
];

function formatHour(hour: number): string {
    const period = hour >= 12 ? 'PM' : 'AM';
    const display = hour % 12 === 0 ? 12 : hour % 12;
    return `${display} ${period}`;
}

function formatDayLabel(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN', { weekday: 'short' });
}

const Analytics: React.FC = () => {
    const { mySalons, fetchMySalons } = useSalonStore();
    const [range, setRange] = useState<InsightsRange>('30d');
    const [overview, setOverview] = useState<SalonOverview | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchMySalons();
    }, [fetchMySalons]);

    const salonId = mySalons[0]?._id;

    useEffect(() => {
        if (!salonId) return;

        setLoading(true);
        setError(null);
        insightsService
            .getSalonOverview(salonId, range)
            .then((res) => setOverview(res.data || null))
            .catch((err) => setError(err?.response?.data?.error?.message || 'Failed to load analytics'))
            .finally(() => setLoading(false));
    }, [salonId, range]);

    if (mySalons.length > 0 && !salonId) {
        return null;
    }

    if (!loading && mySalons.length === 0) {
        return (
            <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Alert severity="info">Register a salon to see analytics.</Alert>
            </Box>
        );
    }

    const stats = overview
        ? [
              { title: 'Total Revenue', value: overview.revenue.value, change: overview.revenue.changePercent, isMoney: true, icon: <MoneyIcon /> },
              { title: 'Total Bookings', value: overview.bookings.value, change: overview.bookings.changePercent, isMoney: false, icon: <PeopleIcon /> },
              { title: 'Avg. Ticket', value: overview.avgTicket.value, change: overview.avgTicket.changePercent, isMoney: true, icon: <TrendingIcon /> },
          ]
        : [];

    const revenueData = (overview?.revenueSeries || []).map((d) => ({ label: formatDayLabel(d.date), value: d.value }));
    const maxRevenue = Math.max(1, ...revenueData.map((d) => d.value));
    const topServices = overview?.topServices || [];
    const peakHours = overview?.peakHours || [];

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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                        <Box>
                            <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.7)', letterSpacing: 1, fontWeight: 600 }}>
                                PERFORMANCE
                            </Typography>
                            <Typography variant="h2" sx={{ fontWeight: 800, color: 'white' }}>
                                Analytics Overview
                            </Typography>
                        </Box>

                        {/* Range Selector */}
                        <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', p: 0.5, borderRadius: '50px', display: 'flex' }}>
                            {RANGE_OPTIONS.map((opt) => (
                                <Button
                                    key={opt.value}
                                    onClick={() => setRange(opt.value)}
                                    sx={{
                                        color: range === opt.value ? '#0f172a' : 'white',
                                        bgcolor: range === opt.value ? 'white' : 'transparent',
                                        borderRadius: '50px',
                                        px: 3,
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        '&:hover': { bgcolor: range === opt.value ? 'white' : 'rgba(255,255,255,0.1)' }
                                    }}
                                >
                                    {opt.label}
                                </Button>
                            ))}
                        </Box>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                            <CircularProgress sx={{ color: 'white' }} />
                        </Box>
                    ) : (
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
                                                <CountUp end={stat.value} duration={1.2} separator="," decimals={stat.isMoney ? 2 : 0} />
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mt: 0.5 }}>
                                                {stat.title}
                                            </Typography>
                                        </CardContent>
                                    </MotionCard>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Container>
            </Box>

            {!loading && overview && (
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
                                            <Typography variant="body2" color="text.secondary">Daily earnings, completed bookings only</Typography>
                                        </Box>
                                        <IconButton size="small"><MoreIcon /></IconButton>
                                    </Box>

                                    {revenueData.length === 0 ? (
                                        <Typography variant="body2" color="text.secondary" sx={{ py: 8, textAlign: 'center' }}>
                                            No completed bookings in this range yet.
                                        </Typography>
                                    ) : (
                                        <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 300, gap: 2, overflowX: 'auto' }}>
                                            {revenueData.map((data, index) => (
                                                <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', minWidth: 32, height: '100%', justifyContent: 'flex-end' }}>
                                                    <Tooltip title={`₹${data.value.toLocaleString()}`}>
                                                        <motion.div
                                                            initial={{ height: 0 }}
                                                            animate={{ height: `${(data.value / maxRevenue) * 100}%` }}
                                                            transition={{ duration: 0.8, delay: index * 0.03, type: 'spring' }}
                                                            style={{
                                                                width: '100%',
                                                                maxWidth: 60,
                                                                backgroundColor: '#6366f1',
                                                                borderRadius: '12px 12px 4px 4px',
                                                                cursor: 'pointer'
                                                            }}
                                                        />
                                                    </Tooltip>
                                                    <Typography variant="caption" sx={{ mt: 2, fontWeight: 600, color: '#64748b' }}>
                                                        {data.label}
                                                    </Typography>
                                                </Box>
                                            ))}
                                        </Box>
                                    )}
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

                                    {topServices.length === 0 ? (
                                        <Typography variant="body2" color="text.secondary">No completed bookings yet.</Typography>
                                    ) : (
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
                                    )}

                                    <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                                        <Typography variant="subtitle2" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <TimeIcon fontSize="small" color="action" /> Peak Hours
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                                            {peakHours.length === 0 ? (
                                                <Typography variant="body2" color="text.secondary">Not enough data yet.</Typography>
                                            ) : (
                                                peakHours.map((h, i) => (
                                                    <Box key={i} sx={{ px: 2, py: 1, bgcolor: '#f0f9ff', color: '#0284c7', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600 }}>
                                                        {formatHour(h.hour)}
                                                    </Box>
                                                ))
                                            )}
                                        </Box>
                                    </Box>
                                </CardContent>
                            </MotionCard>
                        </Grid>
                    </Grid>
                </Container>
            )}
        </Box>
    );
};

export default Analytics;
