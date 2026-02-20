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
    Grid,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    Avatar,
    Step,
    StepLabel,
    Stepper,
    useTheme,
    alpha,
    Stack,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Cancel as CancelIcon,
    CalendarMonth as CalendarIcon,
    AccessTime as TimeIcon,
    LocationOn as LocationIcon,
    Person as PersonIcon,
    ContentCut as ServiceIcon,
    Phone as PhoneIcon,
    Directions as DirectionsIcon,
    ContentCopy as CopyIcon,
    CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { motion, AnimatePresence } from 'framer-motion';
import { appointmentService } from '../../services/appointmentService';
import { Appointment, AppointmentStatus } from '../../types';
import { formatCurrency } from '../../utils/helpers';
import toast from 'react-hot-toast';

// --- Styled Components & Utilites ---

const MotionCard = motion(Card);

const statusSteps = ['pending', 'confirmed', 'in_progress', 'completed'];

const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
        case 'confirmed': return '#10b981'; // Emerald
        case 'pending': return '#f59e0b';   // Amber
        case 'completed': return '#3b82f6'; // Blue
        case 'cancelled': return '#ef4444'; // Red
        case 'in_progress': return '#8b5cf6'; // Violet
        default: return '#6b7280';
    }
};

const getStatusLabel = (status: AppointmentStatus) => {
    return status.replace('_', ' ').toUpperCase();
};

const AppointmentDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const theme = useTheme();
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

    const copyAppointmentId = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success('ID copied to clipboard');
    };

    if (isLoading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                bgcolor: '#f8fafc'
            }}>
                <CircularProgress size={60} sx={{ color: theme.palette.primary.main }} />
            </Box>
        );
    }

    const appointment = data?.data as Appointment | undefined;

    if (!appointment) {
        return (
            <Box sx={{
                minHeight: '100vh',
                bgcolor: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2
            }}>
                <Card sx={{
                    textAlign: 'center',
                    p: 6,
                    borderRadius: 4,
                    maxWidth: 500,
                    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)'
                }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: '#1e293b' }}>
                        Appointment Not Found
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        The appointment you requested could not be found or may have been removed.
                    </Typography>
                </Card>
            </Box>
        );
    }

    // Data Extraction & Handling
    const isCancelled = appointment.status === 'cancelled';
    const activeStep = isCancelled ? -1 : statusSteps.indexOf(appointment.status);
    const statusColor = getStatusColor(appointment.status);

    const salon = appointment.salon || (appointment.salonId as any);
    const salonName = salon?.name || salon?.displayName || 'Unknown Salon';
    const salonAddressObj = salon?.address;
    const salonAddress = salonAddressObj
        ? `${salonAddressObj.street}, ${salonAddressObj.city}`
        : 'Location details unavailable';
    const salonImage = salon?.images?.[0] || salon?.coverImage;

    const barber = appointment.barberId as any;
    const barberName = barber?.userId?.name || barber?.name || 'Any Stylist';
    const barberImage = barber?.userId?.profilePicture || barber?.profilePicture;
    const barberRole = 'Professional Stylist';

    const services = (appointment.serviceIds as any[]) || [];
    const scheduledDate = dayjs(appointment.scheduledAt);

    const canCancel = ['pending', 'confirmed'].includes(appointment.status);

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', pt: { xs: 14, md: 16 }, pb: { xs: 6, md: 8 }, px: { xs: 2, md: 4 } }}>
            <Container maxWidth="xl">
                {/* Header Navigation */}
                <Box sx={{ mb: 4 }}>

                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: 'space-between',
                        alignItems: { xs: 'flex-start', md: 'center' },
                        gap: 2
                    }}>
                        <Box>
                            <Typography variant="h3" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', mb: 0.5 }}>
                                Appointment Details
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, fontFamily: 'monospace' }}>
                                    ID: #{appointment._id.slice(-8).toUpperCase()}
                                </Typography>
                                <Tooltip title="Copy ID">
                                    <IconButton size="small" onClick={() => copyAppointmentId(appointment._id)}>
                                        <CopyIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>

                        <Chip
                            label={getStatusLabel(appointment.status)}
                            sx={{
                                bgcolor: alpha(statusColor, 0.1),
                                color: statusColor,
                                fontWeight: 700,
                                fontSize: '0.875rem',
                                px: 2,
                                py: 2.5,
                                borderRadius: 3,
                                border: `1px solid ${alpha(statusColor, 0.2)}`
                            }}
                        />
                    </Box>
                </Box>

                {/* Progress Stepper (Desktop only) */}
                {!isCancelled && (
                    <Box sx={{ mb: 6, display: { xs: 'none', md: 'block' }, maxWidth: 800, mx: 'auto' }}>
                        <Stepper activeStep={activeStep} alternativeLabel>
                            {statusSteps.map((label) => (
                                <Step key={label}>
                                    <StepLabel
                                        StepIconProps={{
                                            sx: {
                                                '&.Mui-active': { color: theme.palette.primary.main },
                                                '&.Mui-completed': { color: theme.palette.success.main },
                                            }
                                        }}
                                    >
                                        {label.replace('_', ' ').toUpperCase()}
                                    </StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Box>
                )}

                <Grid container spacing={4}>
                    {/* LEFT COLUMN: Main Info */}
                    <Grid size={{ xs: 12, lg: 8 }}>
                        <Stack spacing={4}>
                            {/* Salon Banner Card */}
                            <MotionCard
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                sx={{
                                    borderRadius: 6,
                                    border: 'none',
                                    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.08)',
                                    overflow: 'hidden',
                                    position: 'relative'
                                }}
                            >
                                <Box sx={{
                                    height: 200,
                                    background: salonImage
                                        ? `url(${salonImage}) center/cover`
                                        : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    p: 4
                                }}>
                                    <Box sx={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)'
                                    }} />

                                    <Box sx={{ position: 'relative', zIndex: 1, width: '100%' }}>
                                        <Typography variant="h4" sx={{ fontWeight: 800, color: 'white', mb: 1 }}>
                                            {salonName}
                                        </Typography>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <LocationIcon sx={{ color: 'rgba(255,255,255,0.8)', fontSize: 20 }} />
                                            <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                                                {salonAddress}
                                            </Typography>
                                        </Stack>
                                    </Box>
                                </Box>

                                {/* Quick Actions Bar */}
                                <Box sx={{ p: 2, bgcolor: 'white', display: 'flex', gap: 2 }}>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        startIcon={<PhoneIcon />}
                                        sx={{ flex: 1, borderRadius: 3, py: 1.5, borderColor: '#e2e8f0', color: '#64748b' }}
                                    >
                                        Call
                                    </Button>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        startIcon={<DirectionsIcon />}
                                        sx={{ flex: 1, borderRadius: 3, py: 1.5, borderColor: '#e2e8f0', color: '#64748b' }}
                                    >
                                        Directions
                                    </Button>
                                </Box>
                            </MotionCard>

                            {/* Details Grid: Date/Time & Stylist */}
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Card sx={{ p: 3, borderRadius: 5, height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: 'none' }}>
                                        <Stack spacing={3}>
                                            <Box sx={{ display: 'flex', gap: 2 }}>
                                                <Box sx={{
                                                    width: 50, height: 50, borderRadius: 3,
                                                    bgcolor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    color: '#3b82f6'
                                                }}>
                                                    <CalendarIcon />
                                                </Box>
                                                <Box>
                                                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, letterSpacing: '0.05em' }}>DATE</Typography>
                                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                                        {scheduledDate.format('dddd')}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                                                        {scheduledDate.format('MMMM D, YYYY')}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Divider />
                                            <Box sx={{ display: 'flex', gap: 2 }}>
                                                <Box sx={{
                                                    width: 50, height: 50, borderRadius: 3,
                                                    bgcolor: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    color: '#f97316'
                                                }}>
                                                    <TimeIcon />
                                                </Box>
                                                <Box>
                                                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, letterSpacing: '0.05em' }}>TIME</Typography>
                                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                                        {scheduledDate.format('h:mm A')}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                                                        {appointment.duration} min duration
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Stack>
                                    </Card>
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Card sx={{ p: 3, borderRadius: 5, height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: 'none' }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 3 }}>Stylist</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar
                                                src={barberImage}
                                                sx={{ width: 64, height: 64, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                            >
                                                <PersonIcon />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                                    {barberName}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#64748b' }}>
                                                    {barberRole}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Card>
                                </Grid>
                            </Grid>

                            {/* Services List */}
                            <Card sx={{ p: 4, borderRadius: 6, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: 'none' }}>
                                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                                    <Avatar sx={{ bgcolor: '#f0fdf4', color: '#10b981', width: 40, height: 40, borderRadius: 2 }}>
                                        <ServiceIcon fontSize="small" />
                                    </Avatar>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                        Services
                                    </Typography>
                                </Stack>

                                <Stack spacing={2}>
                                    {services.map((service, idx) => (
                                        <React.Fragment key={idx}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                                                <Box>
                                                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#334155' }}>
                                                        {service.name || 'Unknown Service'}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                                        {service.duration} mins
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body1" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                                    {service.price ? formatCurrency(service.price) : '-'}
                                                </Typography>
                                            </Box>
                                            {idx < services.length - 1 && <Divider sx={{ borderColor: '#f1f5f9', borderStyle: 'dashed' }} />}
                                        </React.Fragment>
                                    ))}
                                    {services.length === 0 && (
                                        <Typography color="text.secondary">No services listed.</Typography>
                                    )}
                                </Stack>
                            </Card>
                        </Stack>
                    </Grid>

                    {/* RIGHT COLUMN: Payment & Actions */}
                    <Grid size={{ xs: 12, lg: 4 }}>
                        <MotionCard
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            sx={{
                                borderRadius: 6,
                                overflow: 'hidden',
                                boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.15)',
                                border: 'none',
                                position: 'sticky',
                                top: 24
                            }}
                        >
                            {/* Summary Header */}
                            <Box sx={{
                                background: '#1e293b',
                                p: 4,
                                color: 'white',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    position: 'absolute', top: -40, right: -40,
                                    width: 150, height: 150,
                                    background: 'rgba(255,255,255,0.05)',
                                    borderRadius: '50%'
                                }} />
                                <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', fontWeight: 700 }}>
                                    TOTAL AMOUNT
                                </Typography>
                                <Typography variant="h3" sx={{ fontWeight: 800, mt: 1 }}>
                                    {formatCurrency(appointment.pricing?.total || 0)}
                                </Typography>
                                <Box sx={{ mt: 3 }}>
                                    <Chip
                                        icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
                                        label={`Payment ${appointment.paymentStatus}`}
                                        sx={{
                                            bgcolor: appointment.paymentStatus === 'successful' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(251, 146, 60, 0.2)',
                                            color: appointment.paymentStatus === 'successful' ? '#4ade80' : '#fb923c',
                                            fontWeight: 700,
                                            border: 'none',
                                            textTransform: 'capitalize'
                                        }}
                                    />
                                </Box>
                            </Box>

                            {/* Breakdown */}
                            <Box sx={{ p: 4, bgcolor: 'white' }}>
                                <Stack spacing={2} sx={{ mb: 4 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography color="text.secondary">Services Total</Typography>
                                        <Typography fontWeight={600} color="#334155">
                                            {formatCurrency(appointment.pricing?.services || 0)}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography color="text.secondary">Platform Fee</Typography>
                                        <Typography fontWeight={600} color="#334155">
                                            {formatCurrency(appointment.pricing?.platformFee || 0)}
                                        </Typography>
                                    </Box>
                                    {appointment.pricing?.homeServiceFee > 0 && (
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography color="text.secondary">Home Service</Typography>
                                            <Typography fontWeight={600} color="#334155">
                                                {formatCurrency(appointment.pricing.homeServiceFee)}
                                            </Typography>
                                        </Box>
                                    )}
                                </Stack>

                                <Divider sx={{ mb: 4, borderStyle: 'dashed' }} />

                                {canCancel ? (
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        color="error"
                                        startIcon={<CancelIcon />}
                                        onClick={() => setCancelDialogOpen(true)}
                                        sx={{
                                            py: 1.5,
                                            borderRadius: 30,
                                            fontWeight: 700,
                                            textTransform: 'none',
                                            borderWidth: 2,
                                            '&:hover': { borderWidth: 2, bgcolor: '#fff1f2' }
                                        }}
                                    >
                                        Cancel Appointment
                                    </Button>
                                ) : (
                                    <Typography
                                        className="text-center"
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ bgcolor: '#f8fafc', p: 2, borderRadius: 2, textAlign: 'center' }}
                                    >
                                        {appointment.status === 'completed'
                                            ? 'Appointment completed. Invoice sent.'
                                            : 'Cancellation unavailable.'}
                                    </Typography>
                                )}
                            </Box>
                        </MotionCard>
                    </Grid>
                </Grid>

                {/* Cancel Confirmation Dialog */}
                <Dialog
                    open={cancelDialogOpen}
                    onClose={() => setCancelDialogOpen(false)}
                    PaperProps={{
                        elevation: 0,
                        sx: { borderRadius: 6, p: 2, maxWidth: 400, width: '100%', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }
                    }}
                    TransitionComponent={motion.div as any}
                >
                    <DialogTitle sx={{ textAlign: 'center', fontWeight: 800 }}>Confirm Cancellation</DialogTitle>
                    <DialogContent>
                        <Typography textAlign="center" color="text.secondary">
                            Are you sure you want to cancel? This action cannot be undone.
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: 'center', p: 2, gap: 2 }}>
                        <Button
                            onClick={() => setCancelDialogOpen(false)}
                            variant="text"
                            sx={{ color: '#64748b', fontWeight: 600, borderRadius: 2 }}
                        >
                            Keep Appointment
                        </Button>
                        <Button
                            onClick={() => id && cancelMutation.mutate(id)}
                            variant="contained"
                            color="error"
                            disabled={cancelMutation.isPending}
                            sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }}
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
