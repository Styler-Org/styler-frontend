import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    CircularProgress,
} from '@mui/material';
import {
    CalendarMonth as CalendarIcon,
    CheckCircle as CheckCircleIcon,
    Schedule as ScheduleIcon,
    TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { appointmentService } from '../../services/appointmentService';
import { useAuthStore } from '../../stores/authStore';
import { Appointment } from '../../types';
import { formatDate, formatCurrency } from '../../utils/helpers';
import toast from 'react-hot-toast';
import './Dashboard.css';

const CustomerDashboard: React.FC = () => {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);

    const { data, isLoading } = useQuery({
        queryKey: ['customer-appointments'],
        queryFn: () => appointmentService.getMyAppointments(),
    });

    const appointments = (data?.data as Appointment[]) || [];
    const upcomingAppointments = appointments.filter(
        (apt) => apt.status === 'confirmed' || apt.status === 'pending'
    );

    const stats = [
        { icon: <CalendarIcon />, value: appointments.length, label: 'Total Bookings', color: '#667eea' },
        { icon: <ScheduleIcon />, value: upcomingAppointments.length, label: 'Upcoming', color: '#f59e0b' },
        { icon: <CheckCircleIcon />, value: appointments.filter(a => a.status === 'completed').length, label: 'Completed', color: '#10b981' },
        { icon: <TrendingUpIcon />, value: appointments.length > 0 ? '100%' : '0%', label: 'Satisfaction', color: '#4338ca' },
    ];

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box className="customer-dashboard">
            <Container maxWidth="lg">
                <Typography variant="h1" gutterBottom>
                    Welcome back, {user?.name}!
                </Typography>

                {/* Stats */}
                <Grid container spacing={3} className="dashboard-stats" sx={{ mb: 4 }}>
                    {stats.map((stat, index) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                            <Card className="dashboard-stat-card">
                                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box
                                        className="dashboard-stat-icon"
                                        sx={{ color: stat.color, bgcolor: `${stat.color}15` }}
                                    >
                                        {stat.icon}
                                    </Box>
                                    <Box>
                                        <Typography variant="h3">{stat.value}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {stat.label}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Upcoming Appointments */}
                <Card className="dashboard-section">
                    <CardContent>
                        <Typography variant="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarIcon /> Upcoming Appointments
                        </Typography>

                        {upcomingAppointments.length === 0 ? (
                            <Box className="dashboard-empty" sx={{ textAlign: 'center', py: 6 }}>
                                <CalendarIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    No upcoming appointments
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    Book your first appointment to get started
                                </Typography>
                                <Button variant="contained" onClick={() => navigate('/salons')}>
                                    Browse Salons
                                </Button>
                            </Box>
                        ) : (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                                {upcomingAppointments.slice(0, 5).map((appointment) => (
                                    <Card
                                        key={appointment._id}
                                        className="appointment-card"
                                        sx={{ cursor: 'pointer' }}
                                        onClick={() => navigate(`/customer/appointments/${appointment._id}`)}
                                    >
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                                                <Typography variant="h6">{appointment.salon?.name || 'Salon'}</Typography>
                                                <Box
                                                    className={`appointment-status ${appointment.status}`}
                                                    sx={{
                                                        px: 2,
                                                        py: 0.5,
                                                        borderRadius: 2,
                                                        bgcolor: appointment.status === 'confirmed' ? 'success.light' : 'warning.light',
                                                        color: appointment.status === 'confirmed' ? 'success.dark' : 'warning.dark',
                                                    }}
                                                >
                                                    <Typography variant="caption" fontWeight={600}>
                                                        {appointment.status.toUpperCase()}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Box className="appointment-card-details" sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <CalendarIcon fontSize="small" />
                                                    <Typography variant="body2">{formatDate(appointment.scheduledDate || appointment.scheduledAt)}</Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <ScheduleIcon fontSize="small" />
                                                    <Typography variant="body2">
                                                        {appointment.scheduledTime || new Date(appointment.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" fontWeight={600} sx={{ color: 'primary.main' }}>
                                                    {formatCurrency(appointment.totalAmount ?? appointment.pricing.total)}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default CustomerDashboard;
