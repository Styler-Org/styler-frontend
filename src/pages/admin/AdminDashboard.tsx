import React, { useEffect } from 'react';
import {
    Box, Grid, Typography, CircularProgress, Alert, alpha, Chip, Avatar,
} from '@mui/material';
import {
    People as PeopleIcon,
    Store as StoreIcon,
    ContentCut as ContentCutIcon,
    Event as EventIcon,
    TrendingUp as TrendingUpIcon,
    AttachMoney as MoneyIcon,
    PersonAdd as PersonAddIcon,
    CalendarMonth as CalendarMonthIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
    ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    BarChart, Bar, Cell, LabelList,
} from 'recharts';
import { useAdminStore } from '../../stores/adminStore';
import StatCard from '../../components/common/StatCard';

dayjs.extend(relativeTime);

const MotionBox = motion(Box);

// Categorical — fixed order, validated (node scripts/validate_palette.js): all PASS.
const roleColors: Record<string, string> = {
    customer: '#6366f1', barber: '#10b981', salon_owner: '#f59e0b', superadmin: '#ef4444',
};

// Status — reserved scale, always paired with a label (never color alone).
const statusColors: Record<string, { color: string; bg: string }> = {
    pending:   { color: '#b45309', bg: '#fef3c7' },
    confirmed: { color: '#059669', bg: '#dcfce7' },
    completed: { color: '#2563eb', bg: '#dbeafe' },
    cancelled: { color: '#ef4444', bg: '#fee2e2' },
    no_show:   { color: '#64748b', bg: '#f1f5f9' },
};

const roleLabel = (r: string) => r.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const CHART_TEXT = '#64748b';
const CHART_GRID = '#f1f5f9';

const AdminDashboard: React.FC = () => {
    const {
        stats, growthTrend, recentActivity, loading, error,
        fetchDashboardStats, fetchGrowthTrend, fetchRecentActivity, clearError,
    } = useAdminStore();

    useEffect(() => {
        fetchDashboardStats();
        fetchGrowthTrend(14);
        fetchRecentActivity(8);
    }, [fetchDashboardStats, fetchGrowthTrend, fetchRecentActivity]);

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

    const roleData = Object.entries(stats?.usersByRole || {}).map(([role, count]) => ({
        role: roleLabel(role), count: count as number, fill: roleColors[role] || '#94a3b8',
    }));

    const statusData = Object.entries(stats?.appointmentsByStatus || {}).map(([status, count]) => ({
        status: roleLabel(status), count: count as number, fill: statusColors[status]?.color || '#94a3b8',
    }));

    const trendDateFmt = (d: string) => dayjs(d).format('MMM D');

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
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {statCards.map((card, i) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                        <MotionBox initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} sx={{ height: '100%' }}>
                            <StatCard {...card} />
                        </MotionBox>
                    </Grid>
                ))}
            </Grid>

            {/* ── Growth Trend (two single-series charts — never one dual-axis chart) ── */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <MotionBox initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        sx={{ p: 3.5, borderRadius: '20px', bgcolor: 'white', border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                        <Typography sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>New Signups</Typography>
                        <Typography variant="body2" sx={{ color: '#64748b', mb: 2, fontSize: '0.82rem' }}>Last 14 days</Typography>
                        <ResponsiveContainer width="100%" height={220}>
                            <LineChart data={growthTrend} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} vertical={false} />
                                <XAxis dataKey="date" tickFormatter={trendDateFmt} tick={{ fontSize: 11, fill: CHART_TEXT }} axisLine={{ stroke: CHART_GRID }} tickLine={false} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: CHART_TEXT }} axisLine={false} tickLine={false} width={28} />
                                <Tooltip
                                    labelFormatter={(d) => dayjs(d as string).format('MMM D, YYYY')}
                                    formatter={(v: number) => [v, 'New users']}
                                    contentStyle={{ borderRadius: 12, border: '1px solid #f1f5f9', fontSize: 13 }}
                                />
                                <Line type="monotone" dataKey="newUsers" stroke="#6366f1" strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </MotionBox>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <MotionBox initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                        sx={{ p: 3.5, borderRadius: '20px', bgcolor: 'white', border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                        <Typography sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>Revenue</Typography>
                        <Typography variant="body2" sx={{ color: '#64748b', mb: 2, fontSize: '0.82rem' }}>Last 14 days</Typography>
                        <ResponsiveContainer width="100%" height={220}>
                            <LineChart data={growthTrend} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} vertical={false} />
                                <XAxis dataKey="date" tickFormatter={trendDateFmt} tick={{ fontSize: 11, fill: CHART_TEXT }} axisLine={{ stroke: CHART_GRID }} tickLine={false} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: CHART_TEXT }} axisLine={false} tickLine={false} width={36} tickFormatter={(v) => `₹${v}`} />
                                <Tooltip
                                    labelFormatter={(d) => dayjs(d as string).format('MMM D, YYYY')}
                                    formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']}
                                    contentStyle={{ borderRadius: 12, border: '1px solid #f1f5f9', fontSize: 13 }}
                                />
                                <Line type="monotone" dataKey="revenue" stroke="#ec4899" strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </MotionBox>
                </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* ── Users by Role ── */}
                {roleData.length > 0 && (
                    <Grid size={{ xs: 12, md: 6 }}>
                        <MotionBox
                            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
                            sx={{ p: 3.5, borderRadius: '20px', bgcolor: 'white', border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                        >
                            <Typography sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>Users by Role</Typography>
                            <Typography variant="body2" sx={{ color: '#64748b', mb: 2, fontSize: '0.82rem' }}>Breakdown of registered accounts</Typography>
                            <ResponsiveContainer width="100%" height={Math.max(120, roleData.length * 52)}>
                                <BarChart data={roleData} layout="vertical" margin={{ top: 0, right: 36, left: 0, bottom: 0 }}>
                                    <XAxis type="number" hide allowDecimals={false} />
                                    <YAxis type="category" dataKey="role" width={90} tick={{ fontSize: 12.5, fill: '#334155', fontWeight: 600 }} axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{ fill: 'rgba(99,102,241,0.04)' }} contentStyle={{ borderRadius: 12, border: '1px solid #f1f5f9', fontSize: 13 }} />
                                    <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={22}>
                                        {roleData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                                        <LabelList dataKey="count" position="right" style={{ fontSize: 12.5, fontWeight: 700, fill: '#0f172a' }} />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </MotionBox>
                    </Grid>
                )}

                {/* ── Appointments by Status ── */}
                {statusData.length > 0 && (
                    <Grid size={{ xs: 12, md: 6 }}>
                        <MotionBox
                            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                            sx={{ p: 3.5, borderRadius: '20px', bgcolor: 'white', border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                        >
                            <Typography sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>Appointments by Status</Typography>
                            <Typography variant="body2" sx={{ color: '#64748b', mb: 2, fontSize: '0.82rem' }}>Current booking pipeline overview</Typography>
                            <ResponsiveContainer width="100%" height={Math.max(120, statusData.length * 44)}>
                                <BarChart data={statusData} layout="vertical" margin={{ top: 0, right: 36, left: 0, bottom: 0 }}>
                                    <XAxis type="number" hide allowDecimals={false} />
                                    <YAxis type="category" dataKey="status" width={90} tick={{ fontSize: 12.5, fill: '#334155', fontWeight: 600 }} axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{ fill: 'rgba(99,102,241,0.04)' }} contentStyle={{ borderRadius: 12, border: '1px solid #f1f5f9', fontSize: 13 }} />
                                    <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={20}>
                                        {statusData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                                        <LabelList dataKey="count" position="right" style={{ fontSize: 12.5, fontWeight: 700, fill: '#0f172a' }} />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </MotionBox>
                    </Grid>
                )}
            </Grid>

            {/* ── Recent Activity ── */}
            <MotionBox
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
                sx={{ p: 3.5, borderRadius: '20px', bgcolor: 'white', border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
            >
                <Typography sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>Recent Activity</Typography>
                <Typography variant="body2" sx={{ color: '#64748b', mb: 2.5, fontSize: '0.82rem' }}>Latest signups and bookings across the platform</Typography>

                {recentActivity.length === 0 ? (
                    <Typography sx={{ color: '#94a3b8', fontSize: '0.85rem', py: 2, textAlign: 'center' }}>No recent activity yet</Typography>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        {recentActivity.map((item: any, i: number) => {
                            const isUser = item.type === 'user';
                            const color = isUser ? '#6366f1' : '#10b981';
                            const label = isUser
                                ? `${item.data?.name || 'Someone'} registered as ${roleLabel(item.data?.role || 'customer')}`
                                : `New appointment #${(item.data?._id || '').slice(-6).toUpperCase()} created`;
                            return (
                                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.75, py: 1.25, borderBottom: i < recentActivity.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                                    <Avatar sx={{ width: 34, height: 34, bgcolor: alpha(color, 0.12), color }}>
                                        {isUser ? <PersonAddIcon sx={{ fontSize: 17 }} /> : <CalendarMonthIcon sx={{ fontSize: 17 }} />}
                                    </Avatar>
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Typography sx={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 600 }} noWrap>{label}</Typography>
                                    </Box>
                                    <Chip
                                        label={dayjs(item.timestamp).fromNow()}
                                        size="small"
                                        sx={{ bgcolor: '#f8fafc', color: '#94a3b8', fontSize: '0.68rem', fontWeight: 600, height: 22, flexShrink: 0 }}
                                    />
                                </Box>
                            );
                        })}
                    </Box>
                )}
            </MotionBox>
        </Box>
    );
};

export default AdminDashboard;
