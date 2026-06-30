import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Grid,
    Button,
    CircularProgress,
    Chip,
    alpha,
    Skeleton,
} from '@mui/material';
import {
    CalendarMonth as CalendarIcon,
    CheckCircle as CheckCircleIcon,
    Schedule as ScheduleIcon,
    TrendingUp as TrendingUpIcon,
    ArrowForward as ArrowForwardIcon,
    LocationOn as LocationIcon,
    Add as AddIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { appointmentService } from '../../services/appointmentService';
import { useAuthStore } from '../../stores/authStore';
import { Appointment } from '../../types';
import { formatDate, formatCurrency } from '../../utils/helpers';

const MotionBox = motion(Box);

const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show:   { opacity: 1, y: 0,  transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] } },
};

const stagger = {
    hidden: {},
    show:   { transition: { staggerChildren: 0.07 } },
};

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    confirmed:  { label: 'Confirmed',  color: '#059669', bg: alpha('#10b981', 0.1) },
    pending:    { label: 'Pending',    color: '#d97706', bg: alpha('#f59e0b', 0.1) },
    completed:  { label: 'Completed',  color: '#6366f1', bg: alpha('#6366f1', 0.1) },
    cancelled:  { label: 'Cancelled',  color: '#dc2626', bg: alpha('#ef4444', 0.1) },
    no_show:    { label: 'No Show',    color: '#64748b', bg: alpha('#64748b', 0.1) },
};

const StatCard: React.FC<{
    icon: React.ReactNode;
    value: number | string;
    label: string;
    color: string;
    index: number;
}> = ({ icon, value, label, color, index }) => (
    <MotionBox variants={fadeUp} transition={{ delay: index * 0.08 }}>
        <Box
            sx={{
                p: 3,
                borderRadius: '20px',
                bgcolor: 'white',
                border: '1px solid #f1f5f9',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                display: 'flex',
                alignItems: 'center',
                gap: 2.5,
                transition: 'all 0.25s ease',
                '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.08)', borderColor: '#e0e7ff', transform: 'translateY(-2px)' },
            }}
        >
            <Box
                sx={{
                    width: 52,
                    height: 52,
                    borderRadius: '16px',
                    bgcolor: alpha(color, 0.1),
                    color: color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    '& svg': { fontSize: '1.4rem' },
                }}
            >
                {icon}
            </Box>
            <Box>
                <Typography
                    sx={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', lineHeight: 1, mb: 0.3, fontFamily: '"Outfit", sans-serif' }}
                >
                    {value}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, fontSize: '0.82rem' }}>
                    {label}
                </Typography>
            </Box>
        </Box>
    </MotionBox>
);

const AppointmentRow: React.FC<{ appointment: Appointment; onClick: () => void }> = ({ appointment, onClick }) => {
    const status = appointment.status;
    const sc = statusConfig[status] || statusConfig.pending;

    const scheduledDate = appointment.scheduledDate || appointment.scheduledAt;
    const scheduledTime = appointment.scheduledTime ||
        (appointment.scheduledAt ? new Date(appointment.scheduledAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : '');

    return (
        <Box
            onClick={onClick}
            sx={{
                p: 2.5,
                borderRadius: '16px',
                bgcolor: 'white',
                border: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.06)', borderColor: '#e0e7ff', transform: 'translateX(4px)' },
            }}
        >
            {/* Date badge */}
            <Box
                sx={{
                    width: 52,
                    height: 52,
                    borderRadius: '14px',
                    bgcolor: alpha('#6366f1', 0.08),
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                }}
            >
                <CalendarIcon sx={{ color: '#6366f1', fontSize: 20 }} />
            </Box>

            {/* Info */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.25, fontSize: '0.9rem' }} noWrap>
                    {appointment.salon?.name || appointment.salon?.displayName || 'Salon'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500, fontSize: '0.78rem' }}>
                        {formatDate(scheduledDate)}
                    </Typography>
                    {scheduledTime && (
                        <>
                            <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: '#e2e8f0' }} />
                            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.78rem' }}>
                                {scheduledTime}
                            </Typography>
                        </>
                    )}
                </Box>
            </Box>

            {/* Amount + Status */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.75, flexShrink: 0 }}>
                <Typography sx={{ fontWeight: 700, color: '#6366f1', fontSize: '0.9rem' }}>
                    {formatCurrency(appointment.totalAmount ?? appointment.pricing?.total ?? 0)}
                </Typography>
                <Chip
                    label={sc.label}
                    size="small"
                    sx={{
                        height: 22,
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        bgcolor: sc.bg,
                        color: sc.color,
                        border: 'none',
                        '& .MuiChip-label': { px: '8px' },
                    }}
                />
            </Box>
        </Box>
    );
};

const CustomerDashboard: React.FC = () => {
    const navigate = useNavigate();
    const user = useAuthStore(s => s.user);

    const { data, isLoading } = useQuery({
        queryKey: ['customer-appointments'],
        queryFn: () => appointmentService.getMyAppointments(),
    });

    const appointments: Appointment[] = (data?.data as Appointment[]) || [];
    const upcoming = appointments.filter(a => a.status === 'confirmed' || a.status === 'pending');
    const completed = appointments.filter(a => a.status === 'completed');

    const stats = [
        { icon: <CalendarIcon />,     value: appointments.length,  label: 'Total Bookings', color: '#6366f1' },
        { icon: <ScheduleIcon />,     value: upcoming.length,      label: 'Upcoming',       color: '#f59e0b' },
        { icon: <CheckCircleIcon />,  value: completed.length,     label: 'Completed',      color: '#10b981' },
        { icon: <TrendingUpIcon />,   value: appointments.length > 0 ? '★ 4.8' : '—', label: 'Avg. Rating', color: '#ec4899' },
    ];

    const greetingHour = new Date().getHours();
    const greeting = greetingHour < 12 ? 'Good morning' : greetingHour < 17 ? 'Good afternoon' : 'Good evening';

    return (
        <Box sx={{ maxWidth: 1100 }}>

            {/* ── Header ── */}
            <MotionBox
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                sx={{ mb: 5 }}
            >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                        <Typography variant="overline" sx={{ color: '#94a3b8', fontWeight: 700, letterSpacing: '0.1em', fontSize: '0.7rem' }}>
                            {greeting}
                        </Typography>
                        <Typography variant="h3" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: '#0f172a', mt: 0.5, letterSpacing: '-0.02em' }}>
                            {user?.name?.split(' ')[0]} 👋
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#64748b', mt: 0.5 }}>
                            Here's an overview of your appointments.
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/salons')}
                        sx={{ borderRadius: '12px', fontWeight: 700, px: 3, py: 1.2, alignSelf: 'flex-start' }}
                    >
                        Book Appointment
                    </Button>
                </Box>
            </MotionBox>

            {/* ── Stats ── */}
            <MotionBox variants={stagger} initial="hidden" animate="show" sx={{ mb: 5 }}>
                <Grid container spacing={2.5}>
                    {stats.map((s, i) => (
                        <Grid size={{ xs: 6, md: 3 }} key={i}>
                            {isLoading ? (
                                <Skeleton variant="rectangular" height={96} sx={{ borderRadius: '20px' }} />
                            ) : (
                                <StatCard {...s} index={i} />
                            )}
                        </Grid>
                    ))}
                </Grid>
            </MotionBox>

            {/* ── Upcoming Appointments ── */}
            <MotionBox
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.45 }}
            >
                <Box
                    sx={{
                        borderRadius: '24px',
                        bgcolor: 'white',
                        border: '1px solid #f1f5f9',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                        overflow: 'hidden',
                    }}
                >
                    {/* Section header */}
                    <Box
                        sx={{
                            px: 3.5,
                            py: 2.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderBottom: '1px solid #f8fafc',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: alpha('#6366f1', 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <CalendarIcon sx={{ color: '#6366f1', fontSize: 18 }} />
                            </Box>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem', fontFamily: '"Outfit", sans-serif' }}>
                                    Upcoming Appointments
                                </Typography>
                                {!isLoading && (
                                    <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                                        {upcoming.length} appointment{upcoming.length !== 1 ? 's' : ''} scheduled
                                    </Typography>
                                )}
                            </Box>
                        </Box>

                        <Button
                            variant="text"
                            endIcon={<ArrowForwardIcon sx={{ fontSize: '0.9rem !important' }} />}
                            onClick={() => navigate('/appointments')}
                            size="small"
                            sx={{ color: '#6366f1', fontWeight: 700, fontSize: '0.8rem', borderRadius: '8px', px: 1.5 }}
                        >
                            View All
                        </Button>
                    </Box>

                    {/* Content */}
                    <Box sx={{ p: 2.5 }}>
                        {isLoading ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                {[1, 2, 3].map(i => (
                                    <Skeleton key={i} variant="rectangular" height={72} sx={{ borderRadius: '16px' }} />
                                ))}
                            </Box>
                        ) : upcoming.length === 0 ? (
                            <Box
                                sx={{
                                    textAlign: 'center',
                                    py: 8,
                                    px: 3,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 72,
                                        height: 72,
                                        borderRadius: '22px',
                                        background: 'linear-gradient(135deg, #eef2ff 0%, #fdf2f8 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mx: 'auto',
                                        mb: 3,
                                    }}
                                >
                                    <CalendarIcon sx={{ fontSize: 32, color: '#a5b4fc' }} />
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', mb: 1, fontFamily: '"Outfit", sans-serif' }}>
                                    No upcoming appointments
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#64748b', mb: 4, maxWidth: 300, mx: 'auto', lineHeight: 1.7 }}>
                                    Browse top-rated salons and book your first appointment today.
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() => navigate('/salons')}
                                    sx={{ borderRadius: '12px', fontWeight: 700, px: 3 }}
                                >
                                    Browse Salons
                                </Button>
                            </Box>
                        ) : (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                {upcoming.slice(0, 5).map((apt) => (
                                    <AppointmentRow
                                        key={apt._id}
                                        appointment={apt}
                                        onClick={() => navigate(`/customer/appointments/${apt._id}`)}
                                    />
                                ))}

                                {upcoming.length > 5 && (
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        endIcon={<ArrowForwardIcon />}
                                        onClick={() => navigate('/appointments')}
                                        sx={{
                                            mt: 1,
                                            borderRadius: '12px',
                                            fontWeight: 700,
                                            borderColor: '#e2e8f0',
                                            color: '#64748b',
                                            '&:hover': { borderColor: '#6366f1', color: '#6366f1' },
                                        }}
                                    >
                                        View {upcoming.length - 5} more
                                    </Button>
                                )}
                            </Box>
                        )}
                    </Box>
                </Box>
            </MotionBox>

        </Box>
    );
};

export default CustomerDashboard;
