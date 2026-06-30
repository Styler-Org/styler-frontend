import React, { useEffect } from 'react';
import {
    Box, Grid, Typography, CircularProgress, Alert, alpha, Chip,
} from '@mui/material';
import {
    People as PeopleIcon,
    Store as StoreIcon,
    ContentCut as ContentCutIcon,
    Event as EventIcon,
    TrendingUp as TrendingUpIcon,
    AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAdminStore } from '../../stores/adminStore';
import StatCard from '../../components/common/StatCard';

const MotionBox = motion(Box);

const roleColors: Record<string, string> = {
    customer: '#6366f1', barber: '#10b981', salon_owner: '#f59e0b', super_admin: '#ef4444',
};

const statusColors: Record<string, { color: string; bg: string }> = {
    pending:   { color: '#b45309', bg: '#fef3c7' },
    confirmed: { color: '#059669', bg: '#dcfce7' },
    completed: { color: '#2563eb', bg: '#dbeafe' },
    cancelled: { color: '#ef4444', bg: '#fee2e2' },
    no_show:   { color: '#64748b', bg: '#f1f5f9' },
};

const AdminDashboard: React.FC = () => {
    const { stats, loading, error, fetchDashboardStats, clearError } = useAdminStore();

    useEffect(() => { fetchDashboardStats(); }, [fetchDashboardStats]);

    if (loading && !stats) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress sx={{ color: '#6366f1' }} />
            </Box>
        );
    }

    const statCards = [
        { title: 'Total Users',         value: stats?.overview.totalUsers || 0,        icon: <PeopleIcon />,      color: '#6366f1', subtitle: 'Registered accounts' },
        { title: 'Total Salons',         value: stats?.overview.totalSalons || 0,       icon: <StoreIcon />,       color: '#4338ca', subtitle: 'Active businesses' },
        { title: 'Total Barbers',        value: stats?.overview.totalBarbers || 0,      icon: <ContentCutIcon />,  color: '#f59e0b', subtitle: 'Service providers' },
        { title: 'Total Appointments',   value: stats?.overview.totalAppointments || 0, icon: <EventIcon />,       color: '#10b981', subtitle: 'All-time bookings' },
        { title: 'Active Appointments',  value: stats?.overview.activeAppointments || 0, icon: <TrendingUpIcon />, color: '#3b82f6', subtitle: 'Confirmed bookings' },
        {
            title: 'Total Revenue', value: stats?.overview.totalRevenue || 0,
            icon: <MoneyIcon />, color: '#ec4899', prefix: '₹', subtitle: 'All-time earnings',
        },
    ];

    return (
        <Box>
            {/* ── Header ── */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5, fontFamily: '"Outfit", sans-serif' }}>
                    Dashboard Overview
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                    Platform-wide metrics and activity at a glance.
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" onClose={clearError} sx={{ mb: 3, borderRadius: '14px' }}>
                    {error}
                </Alert>
            )}

            {/* ── Stat Cards ── */}
            <Grid container spacing={3} sx={{ mb: 5 }}>
                {statCards.map((card, i) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                        <MotionBox initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} sx={{ height: '100%' }}>
                            <StatCard {...card} />
                        </MotionBox>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                {/* ── Users by Role ── */}
                {stats?.usersByRole && (
                    <Grid size={{ xs: 12, md: 6 }}>
                        <MotionBox
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.45 }}
                            sx={{ p: 3.5, borderRadius: '20px', bgcolor: 'white', border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                        >
                            <Typography sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>Users by Role</Typography>
                            <Typography variant="body2" sx={{ color: '#64748b', mb: 3, fontSize: '0.82rem' }}>Breakdown of registered accounts</Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {Object.entries(stats.usersByRole).map(([role, count]) => {
                                    const color = roleColors[role] || '#94a3b8';
                                    const total = Object.values(stats.usersByRole).reduce((a, b) => a + (b as number), 0);
                                    const pct = total ? Math.round(((count as number) / total) * 100) : 0;
                                    return (
                                        <Box key={role}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                                                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color }} />
                                                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', textTransform: 'capitalize' }}>
                                                        {role.replace('_', ' ')}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                                                        {count as number}
                                                    </Typography>
                                                    <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', width: 32, textAlign: 'right' }}>
                                                        {pct}%
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Box sx={{ height: 6, borderRadius: 3, bgcolor: '#f1f5f9', overflow: 'hidden' }}>
                                                <MotionBox
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${pct}%` }}
                                                    transition={{ duration: 0.8, delay: 0.5 }}
                                                    sx={{ height: '100%', borderRadius: 3, bgcolor: color }}
                                                />
                                            </Box>
                                        </Box>
                                    );
                                })}
                            </Box>
                        </MotionBox>
                    </Grid>
                )}

                {/* ── Appointments by Status ── */}
                {stats?.appointmentsByStatus && (
                    <Grid size={{ xs: 12, md: 6 }}>
                        <MotionBox
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            sx={{ p: 3.5, borderRadius: '20px', bgcolor: 'white', border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                        >
                            <Typography sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>Appointments by Status</Typography>
                            <Typography variant="body2" sx={{ color: '#64748b', mb: 3, fontSize: '0.82rem' }}>Current booking pipeline overview</Typography>

                            <Grid container spacing={1.5}>
                                {Object.entries(stats.appointmentsByStatus).map(([status, count]) => {
                                    const sc = statusColors[status] || { color: '#64748b', bg: '#f1f5f9' };
                                    return (
                                        <Grid size={{ xs: 6 }} key={status}>
                                            <Box sx={{
                                                p: 2, borderRadius: '14px', bgcolor: sc.bg,
                                                border: `1px solid ${alpha(sc.color, 0.15)}`,
                                                textAlign: 'center',
                                            }}>
                                                <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: sc.color, fontFamily: '"Outfit", sans-serif', lineHeight: 1 }}>
                                                    {count as number}
                                                </Typography>
                                                <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: sc.color, mt: 0.5, textTransform: 'capitalize' }}>
                                                    {status.replace('_', ' ')}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </MotionBox>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default AdminDashboard;
