import React, { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    Stepper,
    Step,
    StepLabel,
    Grid,
    Avatar,
    Chip,
    Radio,
    RadioGroup,
    FormControlLabel,
    TextField,
    Paper,
    Divider,
    CircularProgress,
    Alert,
} from '@mui/material';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { LocalizationProvider, DateCalendar, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import {
    CheckCircle as CheckCircleIcon,
    ArrowBack as ArrowBackIcon,
    ArrowForward as ArrowForwardIcon,
    Star as StarIcon,
    AccessTime as AccessTimeIcon,
    Person as PersonIcon,
    Event as EventIcon,
} from '@mui/icons-material';
import { salonService } from '../../services/salonService';
import { barberService } from '../../services/barberService';
import { appointmentService } from '../../services/appointmentService';
import { Salon, Service, Barber } from '../../types';
import './BookingFlow.css';

const BookingFlow: React.FC = () => {
    const { salonId } = useParams<{ salonId: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const preSelectedServiceId = searchParams.get('service');

    const [activeStep, setActiveStep] = useState(0);
    const [salon, setSalon] = useState<Salon | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [barbers, setBarbers] = useState<Barber[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Booking form state
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [selectedTime, setSelectedTime] = useState<Dayjs | null>(null);
    const [notes, setNotes] = useState('');

    const steps = ['Select Service', 'Choose Barber', 'Pick Date & Time', 'Confirm'];

    // Load Razorpay SDK (Removed for Zero Prepayment flow)
    useEffect(() => {
        // No pre-payment script needed anymore for booking
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!salonId) return;

            setLoading(true);
            try {
                const [salonRes, servicesRes, barbersRes] = await Promise.all([
                    salonService.getSalonById(salonId),
                    salonService.getSalonServices(salonId),
                    barberService.getSalonBarbers(salonId),
                ]);

                setSalon(salonRes.data as Salon);
                const activeServices = (servicesRes.data || []).filter((s: Service) => s.isActive);
                setServices(activeServices);
                const activeBarbers = (barbersRes.data || []).filter((b: Barber) => b.isActive && b.status === 'approved');
                setBarbers(activeBarbers);

                // Pre-select service if provided
                if (preSelectedServiceId) {
                    const service = activeServices.find((s: Service) => s._id === preSelectedServiceId);
                    if (service) setSelectedService(service);
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load booking information');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [salonId, preSelectedServiceId]);

    const formatRating = (rating: any): string => {
        if (!rating) return 'N/A';
        if (typeof rating === 'number') return rating.toFixed(1);
        if (typeof rating === 'object' && rating.average) return rating.average.toFixed(1);
        return 'N/A';
    };

    const handleNext = () => {
        if (activeStep === 0 && !selectedService) {
            setError('Please select a service');
            return;
        }
        if (activeStep === 1 && !selectedBarber) {
            setError('Please choose a barber');
            return;
        }
        if (activeStep === 2 && (!selectedDate || !selectedTime)) {
            setError('Please select date and time');
            return;
        }
        setError(null);
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setError(null);
        setActiveStep((prev) => prev - 1);
    };

    const handleSubmit = async () => {
        if (!selectedService || !selectedBarber || !selectedDate || !selectedTime) return;

        setSubmitting(true);
        setError(null);

        try {
            const appointmentDateTime = selectedDate
                .hour(selectedTime.hour())
                .minute(selectedTime.minute());

            // Step 1: Create appointment
            const appointmentResponse = await appointmentService.createAppointment({
                salonId: salonId!,
                barberId: selectedBarber._id,
                serviceIds: [selectedService._id],
                scheduledAt: appointmentDateTime.toISOString(),
                locationType: 'salon',
                notes,
            });

            const appointment = appointmentResponse.data;
            if (!appointment) {
                throw new Error('Failed to create appointment');
            }

            // Step 2: Skip payment, directly show success for Zero Pre-payment
            setSuccess(true);
            setTimeout(() => {
                navigate(`/payment/success?appointmentId=${appointment._id}`); // Retaining success route for visual continuity
            }, 1500);

        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to process booking');
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f8f9fa' }}>
                <CircularProgress size={60} sx={{ color: '#667eea' }} />
            </Box>
        );
    }

    if (success) {
        return (
            <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', display: 'flex', alignItems: 'center', py: 8 }}>
                <Container maxWidth="sm">
                    <Card sx={{ textAlign: 'center', p: 6, borderRadius: 4, boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}>
                        <CheckCircleIcon sx={{ fontSize: 100, color: '#10b981', mb: 3 }} />
                        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: '#1a1a1a' }}>
                            Booking Confirmed!
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                            Your appointment has been successfully booked
                        </Typography>
                        <Box sx={{ bgcolor: '#f0f0ff', p: 3, borderRadius: 2, mb: 4 }}>
                            <Typography variant="body1" sx={{ mb: 1 }}><strong>Salon:</strong> {salon?.name}</Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}><strong>Service:</strong> {selectedService?.name}</Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}><strong>Barber:</strong> {(selectedBarber?.userId as any)?.name}</Typography>
                            <Typography variant="body1">
                                <strong>Date & Time:</strong> {selectedDate?.format('MMM DD, YYYY')} at {selectedTime?.format('hh:mm A')}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)' } }}>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    onClick={() => navigate('/appointments')}
                                    sx={{ py: 1.5 }}
                                >
                                    View Appointments
                                </Button>
                            </Box>
                            <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)' } }}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={() => navigate('/salons')}
                                    sx={{
                                        py: 1.5,
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    }}
                                >
                                    Browse Salons
                                </Button>
                            </Box>
                        </Box>
                    </Card>
                </Container>
            </Box>
        );
    }

    return (
        <Box className="customer-dashboard" sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', py: 6 }}>
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate(`/salons/${salonId}`)}
                        sx={{ mb: 2 }}
                    >
                        Back to Salon
                    </Button>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: '#1a1a1a', mb: 1 }}>
                        Book Your Appointment
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        {salon?.name}
                    </Typography>
                </Box>

                {/* Stepper */}
                <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                    <CardContent sx={{ p: 4 }}>
                        <Stepper activeStep={activeStep} alternativeLabel>
                            {steps.map((label, index) => (
                                <Step key={label}>
                                    <StepLabel
                                        StepIconProps={{
                                            sx: {
                                                '&.Mui-completed': { color: '#10b981' },
                                                '&.Mui-active': { color: '#667eea' },
                                            },
                                        }}
                                    >
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {label}
                                        </Typography>
                                    </StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </CardContent>
                </Card>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                {/* Step Content */}
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', minHeight: 500 }}>
                            <CardContent sx={{ p: 4 }}>
                                {/* Step 0: Select Service */}
                                {activeStep === 0 && (
                                    <Box>
                                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                                            Choose Your Service
                                        </Typography>
                                        <Grid container spacing={2}>
                                            {services.map((service) => (
                                                <Grid size={{ xs: 12 }} key={service._id}>
                                                    <Card
                                                        onClick={() => setSelectedService(service)}
                                                        sx={{
                                                            cursor: 'pointer',
                                                            border: '2px solid',
                                                            borderColor: selectedService?._id === service._id ? '#667eea' : 'transparent',
                                                            transition: 'all 0.3s',
                                                            '&:hover': {
                                                                borderColor: '#667eea',
                                                                boxShadow: '0 8px 16px rgba(102, 126, 234, 0.2)',
                                                            },
                                                        }}
                                                    >
                                                        <CardContent>
                                                            <Grid container spacing={2} alignItems="center">
                                                                <Grid size="grow">
                                                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                                                        {service.name}
                                                                    </Typography>
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        {service.gender} • {service.duration} min
                                                                    </Typography>
                                                                    {service.description && (
                                                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                                            {service.description}
                                                                        </Typography>
                                                                    )}
                                                                </Grid>
                                                                <Grid size="auto">
                                                                    <Box sx={{ textAlign: 'right' }}>
                                                                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#667eea' }}>
                                                                            ₹{service.price}
                                                                        </Typography>
                                                                        {selectedService?._id === service._id && (
                                                                            <CheckCircleIcon sx={{ color: '#10b981', mt: 1 }} />
                                                                        )}
                                                                    </Box>
                                                                </Grid>
                                                            </Grid>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
                                )}

                                {/* Step 1: Choose Barber */}
                                {activeStep === 1 && (
                                    <Box>
                                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                                            Select Your Stylist
                                        </Typography>
                                        <Grid container spacing={3}>
                                            {barbers.map((barber) => (
                                                <Grid size={{ xs: 12, sm: 6 }} key={barber._id}>
                                                    <Card
                                                        onClick={() => setSelectedBarber(barber)}
                                                        sx={{
                                                            cursor: 'pointer',
                                                            border: '2px solid',
                                                            borderColor: selectedBarber?._id === barber._id ? '#667eea' : 'transparent',
                                                            transition: 'all 0.3s',
                                                            '&:hover': {
                                                                borderColor: '#667eea',
                                                                transform: 'translateY(-4px)',
                                                                boxShadow: '0 12px 24px rgba(102, 126, 234, 0.2)',
                                                            },
                                                        }}
                                                    >
                                                        <CardContent sx={{ textAlign: 'center', p: 3 }}>
                                                            <Avatar
                                                                sx={{
                                                                    width: 80,
                                                                    height: 80,
                                                                    mx: 'auto',
                                                                    mb: 2,
                                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                                    fontSize: '2rem',
                                                                }}
                                                            >
                                                                {(barber.userId as any)?.name?.charAt(0) || 'S'}
                                                            </Avatar>
                                                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                                                {(barber.userId as any)?.name || 'Stylist'}
                                                            </Typography>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 2 }}>
                                                                <StarIcon sx={{ fontSize: 18, color: '#fbbf24' }} />
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {formatRating(barber.rating)} • {barber.experience} yrs
                                                                </Typography>
                                                            </Box>
                                                            {barber.specialties && barber.specialties.length > 0 && (
                                                                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'center' }}>
                                                                    {barber.specialties.slice(0, 3).map((specialty, idx) => (
                                                                        <Chip
                                                                            key={idx}
                                                                            label={specialty}
                                                                            size="small"
                                                                            sx={{ fontSize: '0.7rem' }}
                                                                        />
                                                                    ))}
                                                                </Box>
                                                            )}
                                                            {selectedBarber?._id === barber._id && (
                                                                <CheckCircleIcon sx={{ color: '#10b981', mt: 2 }} />
                                                            )}
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
                                )}

                                {/* Step 2: Pick Date & Time */}
                                {activeStep === 2 && (
                                    <Box>
                                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                                            Choose Date & Time
                                        </Typography>
                                        <Grid container spacing={4}>
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                                                    Select Date
                                                </Typography>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DateCalendar
                                                        value={selectedDate}
                                                        onChange={(newValue) => setSelectedDate(newValue)}
                                                        minDate={dayjs()}
                                                        sx={{
                                                            width: '100%',
                                                            '& .MuiPickersDay-root.Mui-selected': {
                                                                bgcolor: '#667eea !important',
                                                            },
                                                        }}
                                                    />
                                                </LocalizationProvider>
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                                                    Select Time
                                                </Typography>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <TimePicker
                                                        value={selectedTime}
                                                        onChange={(newValue) => setSelectedTime(newValue)}
                                                        sx={{ width: '100%' }}
                                                    />
                                                </LocalizationProvider>

                                                <Box sx={{ mt: 4 }}>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                                                        Additional Notes (Optional)
                                                    </Typography>
                                                    <TextField
                                                        multiline
                                                        rows={4}
                                                        fullWidth
                                                        placeholder="Any special requests or notes..."
                                                        value={notes}
                                                        onChange={(e) => setNotes(e.target.value)}
                                                    />
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                )}

                                {/* Step 3: Confirm */}
                                {activeStep === 3 && (
                                    <Box>
                                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                                            Confirm Your Booking
                                        </Typography>

                                        <Paper sx={{ p: 3, bgcolor: '#f8f9fa', mb: 3 }}>
                                            <Grid container spacing={3}>
                                                <Grid size={{ xs: 12 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                        <Box
                                                            sx={{
                                                                width: 50,
                                                                height: 50,
                                                                borderRadius: 2,
                                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                color: 'white',
                                                            }}
                                                        >
                                                            <CheckCircleIcon />
                                                        </Box>
                                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                                            Service: {selectedService?.name}
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="body2" color="text.secondary" sx={{ pl: 8 }}>
                                                        Duration: {selectedService?.duration} minutes • Price: ₹{selectedService?.price}
                                                    </Typography>
                                                </Grid>

                                                <Grid size={{ xs: 12 }}>
                                                    <Divider />
                                                </Grid>

                                                <Grid size={{ xs: 12 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                        <Avatar
                                                            sx={{
                                                                width: 50,
                                                                height: 50,
                                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                            }}
                                                        >
                                                            {(selectedBarber?.userId as any)?.name?.charAt(0)}
                                                        </Avatar>
                                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                                            Stylist: {(selectedBarber?.userId as any)?.name}
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="body2" color="text.secondary" sx={{ pl: 8 }}>
                                                        Rating: {formatRating(selectedBarber?.rating)} ⭐ • Experience: {selectedBarber?.experience} years
                                                    </Typography>
                                                </Grid>

                                                <Grid size={{ xs: 12 }}>
                                                    <Divider />
                                                </Grid>

                                                <Grid size={{ xs: 12 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <EventIcon sx={{ fontSize: 40, color: '#667eea' }} />
                                                        <Box>
                                                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                                                {selectedDate?.format('dddd, MMMM DD, YYYY')}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                at {selectedTime?.format('hh:mm A')}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Grid>

                                                {notes && (
                                                    <>
                                                        <Grid size={{ xs: 12 }}>
                                                            <Divider />
                                                        </Grid>
                                                        <Grid size={{ xs: 12 }}>
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                                                Additional Notes:
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {notes}
                                                            </Typography>
                                                        </Grid>
                                                    </>
                                                )}
                                            </Grid>
                                        </Paper>

                                        <Alert severity="info">
                                            Please review your booking details before confirming
                                        </Alert>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Summary Sidebar */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card
                            sx={{
                                position: 'sticky',
                                top: 20,
                                borderRadius: 3,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            }}
                        >
                            <Box
                                sx={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    p: 3,
                                }}
                            >
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    Booking Summary
                                </Typography>
                            </Box>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                                        Service
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600, color: selectedService ? '#1a1a1a' : '#999' }}>
                                        {selectedService?.name || 'Not selected'}
                                    </Typography>
                                    {selectedService && (
                                        <Typography variant="body2" color="text.secondary">
                                            ₹{selectedService.price} • {selectedService.duration} min
                                        </Typography>
                                    )}
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                                        Stylist
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600, color: selectedBarber ? '#1a1a1a' : '#999' }}>
                                        {(selectedBarber?.userId as any)?.name || 'Not selected'}
                                    </Typography>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                                        Date & Time
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600, color: selectedDate ? '#1a1a1a' : '#999' }}>
                                        {selectedDate ? selectedDate.format('MMM DD, YYYY') : 'Not selected'}
                                    </Typography>
                                    {selectedTime && (
                                        <Typography variant="body2" color="text.secondary">
                                            {selectedTime.format('hh:mm A')}
                                        </Typography>
                                    )}
                                </Box>

                                {selectedService && (
                                    <>
                                        <Divider sx={{ my: 2 }} />
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                Total Value
                                            </Typography>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.secondary', textDecoration: 'line-through' }}>
                                                ₹{selectedService.price}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                                Amount Payable Now
                                            </Typography>
                                            <Box sx={{ textAlign: 'right' }}>
                                                <Typography variant="h4" sx={{ fontWeight: 800, color: '#10b981' }}>
                                                    ₹0
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>
                                                    Pay at salon
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Navigation Buttons */}
                <Card sx={{ mt: 4, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                    <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                startIcon={<ArrowBackIcon />}
                                sx={{ minWidth: 120 }}
                            >
                                Back
                            </Button>
                            {activeStep === steps.length - 1 ? (
                                <Button
                                    variant="contained"
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    sx={{
                                        minWidth: 200,
                                        py: 1.5,
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        fontSize: '1.1rem',
                                        fontWeight: 700,
                                    }}
                                >
                                    {submitting ? <CircularProgress size={24} color="inherit" /> : 'Confirm Booking'}
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    endIcon={<ArrowForwardIcon />}
                                    sx={{
                                        minWidth: 120,
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    }}
                                >
                                    Next
                                </Button>
                            )}
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default BookingFlow;
