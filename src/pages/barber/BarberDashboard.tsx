import React, { useState } from 'react';
import {
    Box, Container, Typography, Grid, Button, Avatar, alpha, Chip, Tooltip, IconButton,
} from '@mui/material';
import {
    ContentCut as ScissorsIcon,
    Schedule as ScheduleIcon,
    People as PeopleIcon,
    Star as StarIcon,
    CalendarMonth as CalendarIcon,
    AccessTime as TimeIcon,
    TrendingUp as TrendingIcon,
    Notifications as NotificationsIcon,
    MoreHoriz as MoreIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useBarberStore } from '../../stores/barberStore';
import CountUp from 'react-countup';
import StatCard from '../../components/common/StatCard';
import AddWalkInModal from '../../components/barber/AddWalkInModal';
import BlockTimeModal from '../../components/barber/BlockTimeModal';
import ViewTipsDialog from '../../components/barber/ViewTipsDialog';
import RequestLeaveModal from '../../components/barber/RequestLeaveModal';
import CheckInOutButton from '../../components/barber/CheckInOutButton';

const MotionBox = motion(Box);

const BarberDashboard: React.FC = () => {
    const { stats, loading } = useBarberStore();

    const [walkInModalOpen, setWalkInModalOpen] = useState(false);
    const [blockTimeModalOpen, setBlockTimeModalOpen] = useState(false);
    const [tipsDialogOpen, setTipsDialogOpen] = useState(false);
    const [leaveModalOpen, setLeaveModalOpen] = useState(false);

    const currentStats = stats || {
        todaysAppointments: 5,
        totalClients: 142,
        averageRating: 4.8,
        servicesDone: 1250,
    };

    const upcomingAppointments = [
        { id: 1, time: '10:00 AM', client: 'Rahul Sharma', service: 'Haircut & Beard Trim', duration: '45 mins', status: 'confirmed' },
        { id: 2, time: '11:00 AM', client: 'Amit Patel', service: 'Classic Shave', duration: '30 mins', status: 'pending' },
        { id: 3, time: '01:30 PM', client: 'Vikram Singh', service: 'Hair Color', duration: '60 mins', status: 'confirmed' },
    ];

    const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
        confirmed: { label: 'Confirmed', color: '#059669', bg: '#dcfce7' },
        pending:   { label: 'Pending',   color: '#b45309', bg: '#fef3c7' },
    };

    const quickActions = [
        { label: 'Add Walk-in',    icon: <PeopleIcon />,    color: '#3b82f6', onClick: () => setWalkInModalOpen(true) },
        { label: 'Block Time',     icon: <TimeIcon />,      color: '#f97316', onClick: () => setBlockTimeModalOpen(true) },
        { label: 'View Tips',      icon: <TrendingIcon />,  color: '#10b981', onClick: () => setTipsDialogOpen(true) },
        { label: 'Request Leave',  icon: <CalendarIcon />,  color: '#ef4444', onClick: () => setLeaveModalOpen(true) },
    ];

    const goalPct = Math.round((32 / 40) * 100);

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', pb: 8 }}>

            {/* ── Hero Header ── */}
            <Box sx={{
                background: 'linear-gradient(140deg, #1e1b4b 0%, #312e81 50%, #1e293b 100%)',
                pt: { xs: 4, md: 6 }, pb: { xs: 10, md: 14 }, px: 3,
                position: 'relative', overflow: 'hidden',
            }}>
                {/* Decorative orbs */}
                <Box sx={{ position: 'absolute', top: -60, right: -60, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <Box sx={{ position: 'absolute', bottom: -40, left: 80, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

                <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 3, mb: 5 }}>
                        <Box>
                            <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', mb: 0.75 }}>
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </Typography>
                            <Typography variant="h3" sx={{ fontWeight: 800, color: 'white', fontFamily: '"Outfit", sans-serif', lineHeight: 1.2 }}>
                                Welcome back, Master Barber!
                            </Typography>
                            <Typography sx={{ color: 'rgba(255,255,255,0.6)', mt: 1, maxWidth: 540, lineHeight: 1.6 }}>
                                You have{' '}
                                <Box component="span" sx={{ color: '#a78bfa', fontWeight: 700 }}>
                                    {currentStats.todaysAppointments} appointments
                                </Box>{' '}
                                scheduled for today.
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
                            <CheckInOutButton />
                            <Button
                                variant="outlined"
                                startIcon={<CalendarIcon />}
                                sx={{
                                    color: 'rgba(255,255,255,0.85)', borderColor: 'rgba(255,255,255,0.2)',
                                    borderRadius: '12px', textTransform: 'none', fontWeight: 600,
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.07)', borderColor: 'rgba(255,255,255,0.4)' },
                                }}
                            >
                                View Calendar
                            </Button>
                            <Tooltip title="Notifications">
                                <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.85)', '&:hover': { bgcolor: 'rgba(255,255,255,0.18)' } }}>
                                    <NotificationsIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>

                    {/* ── Stat Cards inside header ── */}
                    <Grid container spacing={2.5}>
                        {[
                            { title: "Today's Appointments", value: currentStats.todaysAppointments, icon: <ScheduleIcon />, color: '#6366f1', subtitle: '+2 from yesterday' },
                            { title: 'Total Clients',         value: currentStats.totalClients,        icon: <PeopleIcon />,  color: '#f59e0b', subtitle: '+12 this week' },
                            { title: 'Average Rating',        value: currentStats.averageRating,       icon: <StarIcon />,    color: '#10b981', subtitle: 'Top 10% staff', suffix: '' },
                            { title: 'Services Done',         value: currentStats.servicesDone,        icon: <ScissorsIcon />, color: '#8b5cf6', subtitle: 'Lifetime total' },
                        ].map((stat, i) => (
                            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                                <MotionBox
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.08 }}
                                    sx={{
                                        p: 3, borderRadius: '20px',
                                        bgcolor: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        height: '100%',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Box sx={{ p: 1.25, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', '& svg': { fontSize: '1.1rem' } }}>
                                            {stat.icon}
                                        </Box>
                                        <Chip
                                            label={stat.subtitle} size="small"
                                            sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: '0.68rem', height: 22, borderRadius: '6px' }}
                                        />
                                    </Box>
                                    <Typography sx={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', lineHeight: 1.1, fontFamily: '"Outfit", sans-serif' }}>
                                        <CountUp end={Number(stat.value)} duration={2} decimals={stat.title.includes('Rating') ? 1 : 0} />
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)', mt: 0.5, fontWeight: 500 }}>
                                        {stat.title}
                                    </Typography>
                                </MotionBox>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            <Container maxWidth="xl" sx={{ mt: -5, position: 'relative', zIndex: 2 }}>
                <Grid container spacing={4}>

                    {/* ── Today's Schedule ── */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <MotionBox
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35 }}
                            sx={{ p: 4, borderRadius: '24px', bgcolor: 'white', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                                <Box>
                                    <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem' }}>Today's Schedule</Typography>
                                    <Typography variant="body2" sx={{ color: '#64748b', mt: 0.25 }}>
                                        {upcomingAppointments.length} clients waiting
                                    </Typography>
                                </Box>
                                <IconButton size="small" sx={{ color: '#94a3b8', '&:hover': { color: '#475569' } }}>
                                    <MoreIcon />
                                </IconButton>
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {upcomingAppointments.map((apt) => {
                                    const sc = statusConfig[apt.status] || statusConfig.pending;
                                    return (
                                        <MotionBox
                                            key={apt.id}
                                            whileHover={{ x: 4 }}
                                            transition={{ duration: 0.2 }}
                                            sx={{
                                                p: 2.5, borderRadius: '16px', border: '1px solid #f1f5f9',
                                                display: 'flex', alignItems: 'center', gap: 3,
                                                transition: 'all 0.2s ease',
                                                '&:hover': { borderColor: alpha('#6366f1', 0.3), bgcolor: alpha('#6366f1', 0.02), boxShadow: `0 4px 16px ${alpha('#6366f1', 0.08)}` },
                                            }}
                                        >
                                            {/* Time box */}
                                            <Box sx={{
                                                display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 72,
                                                p: 1.5, borderRadius: '12px', bgcolor: '#f8fafc', border: '1px solid #f1f5f9',
                                            }}>
                                                <Typography sx={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.05em' }}>TIME</Typography>
                                                <Typography sx={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>{apt.time}</Typography>
                                            </Box>

                                            {/* Client info */}
                                            <Box sx={{ flex: 1 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                                                    <Avatar sx={{ width: 30, height: 30, bgcolor: alpha('#6366f1', 0.12), color: '#6366f1', fontSize: '0.78rem', fontWeight: 700 }}>
                                                        {apt.client.charAt(0)}
                                                    </Avatar>
                                                    <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>
                                                        {apt.client}
                                                    </Typography>
                                                    <Chip
                                                        label={sc.label} size="small"
                                                        sx={{ height: 20, fontSize: '0.65rem', bgcolor: sc.bg, color: sc.color, fontWeight: 700, borderRadius: '6px' }}
                                                    />
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Typography sx={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <ScissorsIcon sx={{ fontSize: 13 }} /> {apt.service}
                                                    </Typography>
                                                    <Typography sx={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <TimeIcon sx={{ fontSize: 13 }} /> {apt.duration}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Button
                                                variant="outlined" size="small"
                                                sx={{
                                                    borderRadius: '10px', textTransform: 'none', fontWeight: 600, fontSize: '0.8rem',
                                                    borderColor: '#e2e8f0', color: '#475569',
                                                    '&:hover': { borderColor: '#6366f1', color: '#6366f1', bgcolor: alpha('#6366f1', 0.04) },
                                                }}
                                            >
                                                Details
                                            </Button>
                                        </MotionBox>
                                    );
                                })}
                            </Box>
                        </MotionBox>
                    </Grid>

                    {/* ── Right Column ── */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                            {/* Quick Actions */}
                            <MotionBox
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.45 }}
                                sx={{ p: 3, borderRadius: '24px', bgcolor: 'white', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                            >
                                <Typography sx={{ fontWeight: 700, color: '#0f172a', mb: 2.5 }}>Quick Actions</Typography>
                                <Grid container spacing={1.5}>
                                    {quickActions.map((action, i) => (
                                        <Grid size={{ xs: 6 }} key={i}>
                                            <Button
                                                fullWidth onClick={action.onClick}
                                                sx={{
                                                    flexDirection: 'column', gap: 1, py: 2,
                                                    borderRadius: '14px', border: `1.5px solid #f1f5f9`,
                                                    color: '#64748b', textTransform: 'none', bgcolor: '#f8fafc',
                                                    '&:hover': {
                                                        borderColor: action.color,
                                                        color: action.color,
                                                        bgcolor: alpha(action.color, 0.05),
                                                    },
                                                    transition: 'all 0.2s ease',
                                                }}
                                            >
                                                <Box sx={{ color: action.color, '& svg': { fontSize: '1.2rem' } }}>{action.icon}</Box>
                                                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, lineHeight: 1.2 }}>{action.label}</Typography>
                                            </Button>
                                        </Grid>
                                    ))}
                                </Grid>
                            </MotionBox>

                            {/* Weekly Goal */}
                            <MotionBox
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.55 }}
                                sx={{
                                    p: 4, borderRadius: '24px', position: 'relative', overflow: 'hidden',
                                    background: 'linear-gradient(140deg, #1e1b4b 0%, #312e81 60%, #1e293b 100%)',
                                }}
                            >
                                <Box sx={{ position: 'absolute', top: -25, right: -25, width: 100, height: 100, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />

                                <Typography sx={{ fontWeight: 700, color: 'white', mb: 0.5 }}>Weekly Goal</Typography>
                                <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', mb: 3 }}>
                                    32 / 40 appointments completed
                                </Typography>

                                <Box sx={{ width: '100%', height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.1)', mb: 1.5 }}>
                                    <MotionBox
                                        initial={{ width: 0 }}
                                        animate={{ width: `${goalPct}%` }}
                                        transition={{ duration: 1, delay: 0.6 }}
                                        sx={{ height: '100%', borderRadius: 4, background: 'linear-gradient(90deg, #4ade80, #22d3ee)' }}
                                    />
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography sx={{ color: '#4ade80', fontWeight: 700, fontSize: '0.9rem' }}>{goalPct}% completed</Typography>
                                    <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>8 remaining</Typography>
                                </Box>
                            </MotionBox>
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            {/* Modals — preserved as-is */}
            <AddWalkInModal
                open={walkInModalOpen}
                onClose={() => setWalkInModalOpen(false)}
                onSuccess={() => console.log('Walk-in added')}
            />
            <BlockTimeModal
                open={blockTimeModalOpen}
                onClose={() => setBlockTimeModalOpen(false)}
                onSuccess={() => console.log('Time blocked')}
            />
            <ViewTipsDialog open={tipsDialogOpen} onClose={() => setTipsDialogOpen(false)} />
            <RequestLeaveModal
                open={leaveModalOpen}
                onClose={() => setLeaveModalOpen(false)}
                onSuccess={() => console.log('Leave requested')}
            />
        </Box>
    );
};

export default BarberDashboard;
