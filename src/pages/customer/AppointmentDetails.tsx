import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
    Box,
    Container,
    Typography,
    Button,
    CircularProgress,
    Card,
    CardContent,
    Grid,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    Avatar,
    Paper,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Cancel as CancelIcon,
    CalendarMonth as CalendarIcon,
    Schedule as ScheduleIcon,
    AttachMoney as MoneyIcon,
    LocationOn as LocationIcon,
    Person as PersonIcon,
    ContentCut as ServiceIcon,
    AccessTime as DurationIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { appointmentService } from '../../services/appointmentService';
import { Appointment, AppointmentStatus } from '../../types';
import { formatCurrency } from '../../utils/helpers';
import toast from 'react-hot-toast';
import './AppointmentDetails.css';

const AppointmentDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false);

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['appointment', id],
        queryFn: () => appointmentService.getAppointmentById(id!),
        enabled: !!id,
    });

    const cancelMutation = useMutation({
        mutationFn: (appointmentId: string) => appointmentService.cancelAppointment(appointmentId),
        onSuccess: () => {
            toast.success('Appointment cancelled successfully');
            setCancelDialogOpen(false);
            refetch();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to cancel appointment');
        },
    });

    const appointment = data?.data as Appointment | undefined;

    const getStatusColor = (status: AppointmentStatus) => {
        switch (status) {
            case 'confirmed': return '#10b981';
            case 'pending': return '#f59e0b';
            case 'completed': return '#3b82f6';
            case 'cancelled': return '#ef4444';
            case 'in_progress': return '#8b5cf6';
            default: return '#6b7280';
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f8fafc' }}>
                <CircularProgress size={60} sx={{ color: '#6366f1' }} />
            </Box>
        );
    }

    if (!appointment) {
        return (
            <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', display: 'flex', alignItems: 'center' }}>
                <Container maxWidth="sm">
                    <Card sx={{ textAlign: 'center', p: 6, borderRadius: 4 }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>Appointment not found</Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                            The appointment you're looking for doesn't exist or has been removed.
                        </Typography>
                    </Card>
                </Container>
            </Box>
        );
    }

    const canCancel = appointment.status === 'pending' || appointment.status === 'confirmed';
    const dateTimeObj = dayjs(appointment.scheduledAt);
    const salonName = (appointment.salonId as any)?.name || 'Unknown Salon';
    const salonAddress = (appointment.salonId as any)?.address?.street || '';
    const barberName = (appointment.barberId as any)?.userId?.name || 'Any Stylist';
    const serviceNames = (appointment.serviceIds as any[])?.map(s => s.name).join(', ') || 'Service';
    const totalAmount = appointment.pricing?.total || 0;
    const statusColor = getStatusColor(appointment.status);

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', py: { xs: 4, md: 8 } }}>
            <Container maxWidth="md">
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/appointments')}
                        sx={{ mb: 4, mt: 4, mr:4 , color: '#64748b' }}
                    >
                        Back to Appointments
                    </Button>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                        <Box>
                            <Typography variant="h3" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>
                                Appointment Details
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Booking #{appointment._id.slice(-8).toUpperCase()}
                            </Typography>
                        </Box>
                        <Chip
                            label={appointment.status.replace('_', ' ').toUpperCase()}
                            sx={{
                                bgcolor: `${statusColor}15`,
                                color: statusColor,
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                px: 2,
                                py: 2.5,
                                borderRadius: '12px'
                            }}
                        />
                    </Box>
                </Box>

                <Grid container spacing={3}>
                    {/* Main Details Card */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.05)' }}>
                            <CardContent sx={{ p: 4 }}>
                                {/* Salon Info */}
                                <Box sx={{ mb: 4 }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600, mb: 1, display: 'block' }}>
                                        Salon
                                    </Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#1e293b' }}>
                                        {salonName}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LocationIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {salonAddress || 'Location not specified'}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Divider sx={{ my: 3 }} />

                                {/* Date & Time */}
                                <Grid container spacing={3} sx={{ mb: 4 }}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <Avatar sx={{ bgcolor: '#eff6ff', color: '#3b82f6', width: 48, height: 48 }}>
                                                <CalendarIcon />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                                    Date
                                                </Typography>
                                                <Typography variant="body1" sx={{ fontWeight: 600, color: '#334155' }}>
                                                    {dateTimeObj.format('dddd, MMMM DD, YYYY')}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <Avatar sx={{ bgcolor: '#fef3c7', color: '#f59e0b', width: 48, height: 48 }}>
                                                <ScheduleIcon />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                                    Time
                                                </Typography>
                                                <Typography variant="body1" sx={{ fontWeight: 600, color: '#334155' }}>
                                                    {dateTimeObj.format('hh:mm A')}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                </Grid>

                                <Divider sx={{ my: 3 }} />

                                {/* Service & Stylist */}
                                <Grid container spacing={3} sx={{ mb: 4 }}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <Avatar sx={{ bgcolor: '#f0fdf4', color: '#10b981', width: 48, height: 48 }}>
                                                <ServiceIcon />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                                    Service
                                                </Typography>
                                                <Typography variant="body1" sx={{ fontWeight: 600, color: '#334155' }}>
                                                    {serviceNames}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <Avatar
                                                src={(appointment.barberId as any)?.userId?.profilePicture}
                                                sx={{ width: 48, height: 48 }}
                                            />
                                            <Box>
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                                    Stylist
                                                </Typography>
                                                <Typography variant="body1" sx={{ fontWeight: 600, color: '#334155' }}>
                                                    {barberName}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                </Grid>

                                {/* Duration */}
                                <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                                    <Avatar sx={{ bgcolor: '#fce7f3', color: '#ec4899', width: 48, height: 48 }}>
                                        <DurationIcon />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                            Duration
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#334155' }}>
                                            {appointment.duration} minutes
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Notes */}
                                {appointment.notes && (
                                    <>
                                        <Divider sx={{ my: 3 }} />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600, mb: 1, display: 'block' }}>
                                                Notes
                                            </Typography>
                                            <Paper sx={{ p: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    {appointment.notes}
                                                </Typography>
                                            </Paper>
                                        </Box>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Pricing Sidebar */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.05)', position: 'sticky', top: 20 }}>
                            <Box sx={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', p: 3 }}>
                                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                                    Pricing Summary
                                </Typography>
                            </Box>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ mb: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Typography variant="body2" color="text.secondary">Services</Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                            {formatCurrency(appointment.pricing?.services || 0)}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Typography variant="body2" color="text.secondary">Platform Fee</Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                            {formatCurrency(appointment.pricing?.platformFee || 0)}
                                        </Typography>
                                    </Box>
                                    {appointment.pricing?.homeServiceFee > 0 && (
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                            <Typography variant="body2" color="text.secondary">Home Service</Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                {formatCurrency(appointment.pricing.homeServiceFee)}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                                <Divider sx={{ my: 2 }} />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Total</Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#6366f1' }}>
                                        {formatCurrency(totalAmount)}
                                    </Typography>
                                </Box>

                                <Divider sx={{ my: 3 }} />

                                <Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                        Payment Status
                                    </Typography>
                                    <Chip
                                        label={appointment.paymentStatus.toUpperCase()}
                                        size="small"
                                        sx={{
                                            bgcolor: appointment.paymentStatus === 'successful' ? '#10b98115' : '#f59e0b15',
                                            color: appointment.paymentStatus === 'successful' ? '#10b981' : '#f59e0b',
                                            fontWeight: 600
                                        }}
                                    />
                                </Box>

                                {canCancel && (
                                    <Box sx={{ mt: 3 }}>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            fullWidth
                                            startIcon={<CancelIcon />}
                                            onClick={() => setCancelDialogOpen(true)}
                                            disabled={cancelMutation.isPending}
                                            sx={{
                                                py: 1.5,
                                                borderRadius: '12px',
                                                fontWeight: 600
                                            }}
                                        >
                                            Cancel Appointment
                                        </Button>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Cancel Dialog */}
                <Dialog
                    open={cancelDialogOpen}
                    onClose={() => setCancelDialogOpen(false)}
                    PaperProps={{
                        sx: { borderRadius: 4, minWidth: 400 }
                    }}
                >
                    <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem' }}>Cancel Appointment?</DialogTitle>
                    <DialogContent>
                        <Typography color="text.secondary">
                            Are you sure you want to cancel this appointment? This action cannot be undone.
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, pt: 0 }}>
                        <Button
                            onClick={() => setCancelDialogOpen(false)}
                            sx={{ borderRadius: '12px', px: 3 }}
                        >
                            Keep Appointment
                        </Button>
                        <Button
                            onClick={() => id && cancelMutation.mutate(id)}
                            color="error"
                            variant="contained"
                            disabled={cancelMutation.isPending}
                            sx={{ borderRadius: '12px', px: 3 }}
                        >
                            {cancelMutation.isPending ? 'Cancelling...' : 'Yes, Cancel'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default AppointmentDetails;
