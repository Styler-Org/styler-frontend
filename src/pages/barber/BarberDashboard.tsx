import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    CircularProgress,
    IconButton,
    Chip,
    Avatar,
    useTheme,
    Tooltip
} from '@mui/material';
import {
    ContentCut as ScissorsIcon,
    Schedule as ScheduleIcon,
    People as PeopleIcon,
    Star as StarIcon,
    MoreHoriz as MoreIcon,
    CalendarMonth as CalendarIcon,
    AccessTime as TimeIcon,
    TrendingUp as TrendingIcon,
    Notifications as NotificationsIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useBarberStore } from '../../stores/barberStore';
import CountUp from 'react-countup';
import AddWalkInModal from '../../components/barber/AddWalkInModal';
import BlockTimeModal from '../../components/barber/BlockTimeModal';
import ViewTipsDialog from '../../components/barber/ViewTipsDialog';
import RequestLeaveModal from '../../components/barber/RequestLeaveModal';
import CheckInOutButton from '../../components/barber/CheckInOutButton';

const MotionCard = motion(Card);

const BarberDashboard: React.FC = () => {
    const { stats, loading } = useBarberStore();
    const theme = useTheme();

    // Modal states
    const [walkInModalOpen, setWalkInModalOpen] = useState(false);
    const [blockTimeModalOpen, setBlockTimeModalOpen] = useState(false);
    const [tipsDialogOpen, setTipsDialogOpen] = useState(false);
    const [leaveModalOpen, setLeaveModalOpen] = useState(false);

    // Mock stats if null
    const currentStats = stats || {
        todaysAppointments: 5,
        totalClients: 142,
        averageRating: 4.8,
        servicesDone: 1250
    };

    const statsDisplay = [
        {
            icon: <ScheduleIcon />,
            value: currentStats.todaysAppointments,
            label: "Today's Appointments",
            color: '#6366f1',
            bg: 'rgba(99, 102, 241, 0.1)',
            trend: '+2 from yesterday'
        },
        {
            icon: <PeopleIcon />,
            value: currentStats.totalClients,
            label: 'Total Clients',
            color: '#f59e0b',
            bg: 'rgba(245, 158, 11, 0.1)',
            trend: '+12 this week'
        },
        {
            icon: <StarIcon />,
            value: currentStats.averageRating.toFixed(1),
            label: 'Average Rating',
            color: '#10b981',
            bg: 'rgba(16, 185, 129, 0.1)',
            trend: 'Top 10% staff'
        },
        {
            icon: <ScissorsIcon />,
            value: currentStats.servicesDone,
            label: 'Services Done',
            color: '#4338ca',
            bg: 'rgba(236, 72, 153, 0.1)',
            trend: 'Lifetime total'
        },
    ];

    // Mock upcoming appointments
    const upcomingAppointments = [
        { id: 1, time: '10:00 AM', client: 'Rahul Sharma', service: 'Haircut & Beard Trim', duration: '45 mins', status: 'confirmed' },
        { id: 2, time: '11:00 AM', client: 'Amit Patel', service: 'Classic Shave', duration: '30 mins', status: 'pending' },
        { id: 3, time: '01:30 PM', client: 'Vikram Singh', service: 'Hair Color', duration: '60 mins', status: 'confirmed' },
    ];

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', pb: 8 }}>
            {/* Header Section */}
            <Box sx={{
                bgcolor: 'white',
                pt: 6,
                pb: 8,
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Decorative Elements */}
                <Box sx={{ position: 'absolute', top: -50, right: -50, width: 300, height: 300, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.03)' }} />
                <Box sx={{ position: 'absolute', bottom: -30, left: 100, width: 150, height: 150, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.02)' }} />

                <Container maxWidth="xl">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Box>
                            <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.7)', letterSpacing: 1, fontWeight: 600 }}>
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </Typography>
                            <Typography variant="h2" sx={{ fontWeight: 800, color: 'white', mt: 1 }}>
                                Welcome back, Master Barber!
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', mt: 1, maxWidth: 600 }}>
                                You have {currentStats.todaysAppointments} appointments scheduled for today. Let's make today improved and productive.
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <CheckInOutButton />
                            <Button
                                variant="outlined"
                                sx={{
                                    color: 'white',
                                    borderColor: 'rgba(255,255,255,0.2)',
                                    borderRadius: '12px',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', borderColor: 'white' }
                                }}
                                startIcon={<CalendarIcon />}
                            >
                                View Calendar
                            </Button>
                            <Tooltip title="Notifications">
                                <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
                                    <NotificationsIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>

                    {/* Stats Grid */}
                    <Grid container spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
                        {statsDisplay.map((stat, index) => (
                            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                                <MotionCard
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    sx={{
                                        bgcolor: 'rgba(255,255,255,0.1)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '20px',
                                        color: 'white',
                                        height: '100%'
                                    }}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                            <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '14px', color: 'white' }}>
                                                {stat.icon}
                                            </Box>
                                            <Chip
                                                label={stat.trend}
                                                size="small"
                                                sx={{
                                                    bgcolor: 'rgba(255,255,255,0.1)',
                                                    color: 'rgba(255,255,255,0.9)',
                                                    fontWeight: 600,
                                                    fontSize: '0.7rem',
                                                    height: 24
                                                }}
                                            />
                                        </Box>
                                        <Typography variant="h3" fontWeight={700}>
                                            <CountUp end={Number(stat.value)} duration={2} decimals={stat.label.includes('Rating') ? 1 : 0} />
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mt: 0.5, fontWeight: 500 }}>
                                            {stat.label}
                                        </Typography>
                                    </CardContent>
                                </MotionCard>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            <Container maxWidth="xl" sx={{ mt: -4, position: 'relative', zIndex: 2 }}>
                <Grid container spacing={4}>
                    {/* Today's Schedule */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <MotionCard
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            sx={{ borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                        >
                            <CardContent sx={{ p: 4 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                                    <Box>
                                        <Typography variant="h6" fontWeight={700} color="#1e293b">Today's Schedule</Typography>
                                        <Typography variant="body2" color="#64748b">
                                            {upcomingAppointments.length} clients waiting
                                        </Typography>
                                    </Box>
                                    <IconButton size="small"><MoreIcon /></IconButton>
                                </Box>

                                {loading ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                                        <CircularProgress />
                                    </Box>
                                ) : (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {upcomingAppointments.length > 0 ? (
                                            upcomingAppointments.map((apt, index) => (
                                                <Box
                                                    key={apt.id}
                                                    sx={{
                                                        p: 2.5,
                                                        borderRadius: '16px',
                                                        border: '1px solid',
                                                        borderColor: 'divider',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 3,
                                                        transition: 'all 0.2s',
                                                        '&:hover': {
                                                            borderColor: '#6366f1',
                                                            bgcolor: '#f5f7ff',
                                                            transform: 'translateY(-2px)',
                                                            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.1)'
                                                        }
                                                    }}
                                                >
                                                    <Box sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        minWidth: 80,
                                                        bgcolor: 'white',
                                                        p: 1,
                                                        borderRadius: '12px',
                                                        border: '1px solid #e2e8f0'
                                                    }}>
                                                        <Typography variant="caption" color="text.secondary" fontWeight={600}>TIME</Typography>
                                                        <Typography variant="subtitle1" fontWeight={800} color="#1e293b">{apt.time}</Typography>
                                                    </Box>

                                                    <Box sx={{ flex: 1 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                                                            <Avatar sx={{ width: 32, height: 32, bgcolor: '#e2e8f0', color: '#64748b', fontSize: '0.8rem' }}>
                                                                {apt.client.charAt(0)}
                                                            </Avatar>
                                                            <Typography variant="subtitle1" fontWeight={700}>
                                                                {apt.client}
                                                            </Typography>
                                                            {apt.status === 'confirmed' && (
                                                                <Chip label="Confirmed" size="small" sx={{ height: 20, fontSize: '0.65rem', bgcolor: '#dcfce7', color: '#166534', fontWeight: 600 }} />
                                                            )}
                                                            {apt.status === 'pending' && (
                                                                <Chip label="Pending" size="small" sx={{ height: 20, fontSize: '0.65rem', bgcolor: '#fef3c7', color: '#b45309', fontWeight: 600 }} />
                                                            )}
                                                        </Box>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                <ScissorsIcon sx={{ fontSize: 16 }} /> {apt.service}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                <TimeIcon sx={{ fontSize: 16 }} /> {apt.duration}
                                                            </Typography>
                                                        </Box>
                                                    </Box>

                                                    <Button variant="contained" size="small" sx={{ borderRadius: '8px', textTransform: 'none', bgcolor: '#1e293b' }}>
                                                        Details
                                                    </Button>
                                                </Box>
                                            ))
                                        ) : (
                                            <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                                                No appointments scheduled for today
                                            </Typography>
                                        )}
                                    </Box>
                                )}
                            </CardContent>
                        </MotionCard>
                    </Grid>

                    {/* Quick Actions & Performance */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {/* Quick Actions */}
                            <MotionCard
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                sx={{ borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>Quick Actions</Typography>
                                    <Grid container spacing={2}>
                                        {[
                                            { label: 'Add Walk-in', icon: <PeopleIcon />, color: '#3b82f6', onClick: () => setWalkInModalOpen(true) },
                                            { label: 'Block Time', icon: <TimeIcon />, color: '#f97316', onClick: () => setBlockTimeModalOpen(true) },
                                            { label: 'View Tips', icon: <TrendingIcon />, color: '#10b981', onClick: () => setTipsDialogOpen(true) },
                                            { label: 'Request Leave', icon: <CalendarIcon />, color: '#ef4444', onClick: () => setLeaveModalOpen(true) }
                                        ].map((action, i) => (
                                            <Grid size={{ xs: 6 }} key={i}>
                                                <Button
                                                    fullWidth
                                                    variant="outlined"
                                                    onClick={action.onClick}
                                                    sx={{
                                                        flexDirection: 'column',
                                                        gap: 1,
                                                        py: 2,
                                                        borderRadius: '16px',
                                                        borderColor: '#e2e8f0',
                                                        color: '#64748b',
                                                        textTransform: 'none',
                                                        '&:hover': {
                                                            borderColor: action.color,
                                                            color: action.color,
                                                            bgcolor: `${action.color}08`
                                                        }
                                                    }}
                                                >
                                                    <Box sx={{ color: action.color }}>{action.icon}</Box>
                                                    <Typography variant="caption" fontWeight={600}>{action.label}</Typography>
                                                </Button>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </CardContent>
                            </MotionCard>

                            {/* Weekly Goal */}
                            <MotionCard
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                sx={{ borderRadius: '24px', bgcolor: '#1e293b', color: 'white' }}
                            >
                                <CardContent sx={{ p: 4, position: 'relative', overflow: 'hidden' }}>
                                    {/* Background decorative circles */}
                                    <Box sx={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)' }} />

                                    <Typography variant="h6" fontWeight={700} gutterBottom>Weekly Goal</Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
                                        32 / 40 Appointments
                                    </Typography>
                                    <Box sx={{ width: '100%', mr: 1, mb: 1 }}>
                                        <Box sx={{ width: '100%', height: 8, borderRadius: 5, bgcolor: 'rgba(255,255,255,0.1)' }}>
                                            <Box sx={{ width: '80%', height: '100%', borderRadius: 5, bgcolor: '#4ade80' }} />
                                        </Box>
                                    </Box>
                                    <Typography variant="caption" sx={{ color: '#4ade80', fontWeight: 600 }}>
                                        80% completed
                                    </Typography>
                                </CardContent>
                            </MotionCard>
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            {/* Modals */}
            <AddWalkInModal
                open={walkInModalOpen}
                onClose={() => setWalkInModalOpen(false)}
                onSuccess={() => {
                    // Refresh appointments or show success message
                    console.log('Walk-in added successfully');
                }}
            />
            <BlockTimeModal
                open={blockTimeModalOpen}
                onClose={() => setBlockTimeModalOpen(false)}
                onSuccess={() => {
                    console.log('Time blocked successfully');
                }}
            />
            <ViewTipsDialog
                open={tipsDialogOpen}
                onClose={() => setTipsDialogOpen(false)}
            />
            <RequestLeaveModal
                open={leaveModalOpen}
                onClose={() => setLeaveModalOpen(false)}
                onSuccess={() => {
                    console.log('Leave request submitted successfully');
                }}
            />
        </Box>
    );
};

export default BarberDashboard;
