import React, { useEffect, useState } from 'react';
import {
    Box, Container, Typography, Button, Grid, Avatar,
    Chip, TextField, Divider, CircularProgress, Alert, alpha,
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
    Event as EventIcon,
    ContentCut as ContentCutIcon,
    Person as PersonIcon,
    Check as CheckIcon,
    CalendarToday as CalendarIcon,
    Notes as NotesIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { salonService } from '../../services/salonService';
import { barberService } from '../../services/barberService';
import { appointmentService } from '../../services/appointmentService';
import { Salon, Service, Barber } from '../../types';

const MotionBox = motion(Box);

const slideVariant = {
    enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] } },
    exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0, transition: { duration: 0.25 } }),
};

const steps = [
    { label: 'Service', icon: <ContentCutIcon sx={{ fontSize: 16 }} /> },
    { label: 'Stylist', icon: <PersonIcon sx={{ fontSize: 16 }} /> },
    { label: 'Schedule', icon: <CalendarIcon sx={{ fontSize: 16 }} /> },
    { label: 'Confirm', icon: <CheckIcon sx={{ fontSize: 16 }} /> },
];

const BookingFlow: React.FC = () => {
    const { salonId } = useParams<{ salonId: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const preSelectedServiceId = searchParams.get('service');

    const [activeStep, setActiveStep] = useState(0);
    const [direction, setDirection] = useState(1);
    const [salon, setSalon] = useState<Salon | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [barbers, setBarbers] = useState<Barber[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [selectedTime, setSelectedTime] = useState<Dayjs | null>(null);
    const [notes, setNotes] = useState('');

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
                if (preSelectedServiceId) {
                    const service = activeServices.find((s: Service) => s._id === preSelectedServiceId);
                    if (service) setSelectedService(service);
                }
            } catch (err) {
                console.error('Error fetching booking data:', err);
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
        if (activeStep === 0 && !selectedService) { setError('Please select a service'); return; }
        if (activeStep === 1 && !selectedBarber) { setError('Please choose a stylist'); return; }
        if (activeStep === 2 && (!selectedDate || !selectedTime)) { setError('Please select date and time'); return; }
        setError(null);
        setDirection(1);
        setActiveStep(prev => prev + 1);
    };

    const handleBack = () => {
        setError(null);
        setDirection(-1);
        setActiveStep(prev => prev - 1);
    };

    const handleSubmit = async () => {
        if (!selectedService || !selectedBarber || !selectedDate || !selectedTime) return;
        setSubmitting(true);
        setError(null);
        try {
            const appointmentDateTime = selectedDate.hour(selectedTime.hour()).minute(selectedTime.minute());
            const appointmentResponse = await appointmentService.createAppointment({
                salonId: salonId!,
                barberId: selectedBarber._id,
                serviceIds: [selectedService._id],
                scheduledAt: appointmentDateTime.toISOString(),
                locationType: 'salon',
                notes,
            });
            const appointment = appointmentResponse.data;
            if (!appointment) throw new Error('Failed to create appointment');
            setSuccess(true);
            setTimeout(() => {
                navigate(`/payment/success?appointmentId=${appointment._id}`);
            }, 1500);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to process booking');
            setSubmitting(false);
        }
    };

    /* ── Loading ── */
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f8fafc', flexDirection: 'column', gap: 2 }}>
                <CircularProgress size={40} sx={{ color: '#6366f1' }} />
                <Typography sx={{ color: '#64748b', fontSize: '0.9rem' }}>Preparing your booking...</Typography>
            </Box>
        );
    }

    /* ── Success Screen ── */
    if (success) {
        return (
            <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 6 }}>
                <MotionBox initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, type: 'spring' }}
                    sx={{ maxWidth: 480, width: '100%', mx: 2, p: { xs: 4, sm: 6 }, borderRadius: '28px', bgcolor: 'white', boxShadow: '0 24px 64px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                    <Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: alpha('#10b981', 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
                        <CheckCircleIcon sx={{ fontSize: 46, color: '#10b981' }} />
                    </Box>
                    <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, fontSize: '1.8rem', color: '#09090b', mb: 1 }}>Booking Confirmed!</Typography>
                    <Typography sx={{ color: '#64748b', mb: 4, lineHeight: 1.7 }}>Your appointment has been booked successfully. See you there!</Typography>
                    <Box sx={{ p: 3, borderRadius: '18px', bgcolor: '#f8fafc', border: '1px solid #f1f5f9', textAlign: 'left', mb: 4 }}>
                        {[
                            { label: 'Venue', val: salon?.name },
                            { label: 'Service', val: selectedService?.name },
                            { label: 'Stylist', val: (selectedBarber?.userId as any)?.name },
                            { label: 'Date', val: selectedDate?.format('MMM DD, YYYY') },
                            { label: 'Time', val: selectedTime?.format('hh:mm A') },
                        ].map(item => (
                            <Box key={item.label} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.9, borderBottom: '1px solid #f1f5f9', '&:last-child': { border: 'none' } }}>
                                <Typography sx={{ fontSize: '0.83rem', color: '#64748b', fontWeight: 600 }}>{item.label}</Typography>
                                <Typography sx={{ fontSize: '0.83rem', color: '#09090b', fontWeight: 700 }}>{item.val || '—'}</Typography>
                            </Box>
                        ))}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1.5, flexDirection: { xs: 'column', sm: 'row' } }}>
                        <Button variant="outlined" fullWidth onClick={() => navigate('/appointments')} sx={{ borderRadius: '14px', fontWeight: 700, textTransform: 'none', borderColor: '#e2e8f0', color: '#475569', py: 1.4 }}>
                            View Appointments
                        </Button>
                        <Button variant="contained" fullWidth onClick={() => navigate('/salons')} sx={{ borderRadius: '14px', fontWeight: 700, textTransform: 'none', py: 1.4, background: 'linear-gradient(135deg, #6366f1, #7c3aed)' }}>
                            Browse More
                        </Button>
                    </Box>
                </MotionBox>
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', pt: { xs: 10, md: 11 }, pb: 10 }}>
            <Container maxWidth="lg">

                {/* Header */}
                <Box sx={{ mb: 5 }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate(`/salons/${salonId}`)}
                        sx={{ color: '#64748b', fontWeight: 600, textTransform: 'none', mb: 2, '&:hover': { color: '#0f172a', bgcolor: 'transparent' } }}
                    >
                        Back to {salon?.name || 'Salon'}
                    </Button>
                    <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: '#09090b', fontSize: { xs: '1.7rem', md: '2.4rem' }, letterSpacing: '-0.03em', mb: 0.5 }}>
                        Book Your Appointment
                    </Typography>
                    {salon?.name && (
                        <Typography sx={{ color: '#64748b', fontSize: '1rem' }}>at {salon.name}</Typography>
                    )}
                </Box>

                {/* Custom Stepper */}
                <Box sx={{ display: 'flex', gap: 0, mb: 5, bgcolor: 'white', borderRadius: '18px', border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                    {steps.map((step, i) => {
                        const isCompleted = i < activeStep;
                        const isActive = i === activeStep;
                        return (
                            <Box key={i} sx={{
                                flex: 1, py: 2, px: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                                flexDirection: { xs: 'column', sm: 'row' },
                                bgcolor: isActive ? alpha('#6366f1', 0.06) : 'transparent',
                                borderBottom: isActive ? '2px solid #6366f1' : '2px solid transparent',
                                borderRight: i < steps.length - 1 ? '1px solid #f1f5f9' : 'none',
                                transition: 'all 0.25s ease',
                            }}>
                                <Box sx={{
                                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    bgcolor: isCompleted ? '#10b981' : isActive ? '#6366f1' : '#f1f5f9',
                                    color: isCompleted || isActive ? 'white' : '#94a3b8',
                                    transition: 'all 0.25s ease',
                                    '& svg': { fontSize: '0.85rem !important' },
                                }}>
                                    {isCompleted ? <CheckIcon sx={{ fontSize: '0.85rem !important' }} /> : step.icon}
                                </Box>
                                <Typography sx={{
                                    fontSize: { xs: '0.65rem', sm: '0.8rem' }, fontWeight: 700, textAlign: 'center',
                                    color: isActive ? '#6366f1' : isCompleted ? '#10b981' : '#94a3b8',
                                    transition: 'all 0.25s ease',
                                }}>
                                    {step.label}
                                </Typography>
                            </Box>
                        );
                    })}
                </Box>

                {/* Error */}
                <AnimatePresence>
                    {error && (
                        <MotionBox initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} sx={{ mb: 3 }}>
                            <Alert severity="error" onClose={() => setError(null)} sx={{ borderRadius: '14px', fontWeight: 600 }}>{error}</Alert>
                        </MotionBox>
                    )}
                </AnimatePresence>

                <Grid container spacing={3.5} alignItems="flex-start">

                    {/* ── Main Step Content ── */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Box sx={{ bgcolor: 'white', borderRadius: '22px', border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden', minHeight: 480 }}>
                            <AnimatePresence mode="wait" custom={direction}>
                                <MotionBox key={activeStep} custom={direction} variants={slideVariant} initial="enter" animate="center" exit="exit" sx={{ p: { xs: 3, sm: 4 } }}>

                                    {/* Step 0: Services */}
                                    {activeStep === 0 && (
                                        <>
                                            <Typography variant="overline" sx={{ color: '#6366f1', fontWeight: 700, letterSpacing: '0.12em', fontSize: '0.7rem' }}>Step 1</Typography>
                                            <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: '#09090b', fontSize: '1.4rem', mb: 3, mt: 0.3 }}>Choose Your Service</Typography>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                                {services.map(service => {
                                                    const isSelected = selectedService?._id === service._id;
                                                    return (
                                                        <MotionBox
                                                            key={service._id}
                                                            whileHover={{ x: 2 }}
                                                            onClick={() => setSelectedService(service)}
                                                            sx={{
                                                                p: 2.5, borderRadius: '16px', cursor: 'pointer',
                                                                border: `1.5px solid ${isSelected ? '#6366f1' : '#f1f5f9'}`,
                                                                bgcolor: isSelected ? alpha('#6366f1', 0.04) : 'white',
                                                                transition: 'all 0.2s ease',
                                                                '&:hover': { border: `1.5px solid ${isSelected ? '#6366f1' : '#c7d2fe'}`, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
                                                                display: 'flex', alignItems: 'center', gap: 2,
                                                            }}
                                                        >
                                                            <Box sx={{ width: 44, height: 44, borderRadius: '13px', bgcolor: isSelected ? '#6366f1' : '#f1f5f9', color: isSelected ? 'white' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
                                                                <ContentCutIcon sx={{ fontSize: 18 }} />
                                                            </Box>
                                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                                <Typography sx={{ fontWeight: 700, color: '#09090b', fontFamily: '"Outfit", sans-serif', mb: 0.3 }}>{service.name}</Typography>
                                                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                                    <Chip label={service.gender} size="small" sx={{ fontSize: '0.68rem', fontWeight: 600, bgcolor: '#f1f5f9', color: '#64748b', borderRadius: '6px', height: 20 }} />
                                                                    <AccessTimeIcon sx={{ fontSize: 12, color: '#94a3b8' }} />
                                                                    <Typography sx={{ fontSize: '0.78rem', color: '#64748b' }}>{service.duration} min</Typography>
                                                                    {service.description && (
                                                                        <Typography sx={{ fontSize: '0.78rem', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: { xs: 'none', sm: 'block' } }}>
                                                                            · {service.description}
                                                                        </Typography>
                                                                    )}
                                                                </Box>
                                                            </Box>
                                                            <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                                                                <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: isSelected ? '#6366f1' : '#09090b', fontSize: '1.1rem' }}>
                                                                    {service.price}
                                                                </Typography>
                                                                {isSelected && <CheckCircleIcon sx={{ color: '#10b981', fontSize: 18, mt: 0.3 }} />}
                                                            </Box>
                                                        </MotionBox>
                                                    );
                                                })}
                                            </Box>
                                        </>
                                    )}

                                    {/* Step 1: Barbers */}
                                    {activeStep === 1 && (
                                        <>
                                            <Typography variant="overline" sx={{ color: '#6366f1', fontWeight: 700, letterSpacing: '0.12em', fontSize: '0.7rem' }}>Step 2</Typography>
                                            <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: '#09090b', fontSize: '1.4rem', mb: 3, mt: 0.3 }}>Select Your Stylist</Typography>
                                            <Grid container spacing={2}>
                                                {barbers.map(barber => {
                                                    const isSelected = selectedBarber?._id === barber._id;
                                                    const name = (barber.userId as any)?.name || 'Stylist';
                                                    return (
                                                        <Grid size={{ xs: 12, sm: 6 }} key={barber._id}>
                                                            <MotionBox
                                                                whileHover={{ y: -3 }}
                                                                onClick={() => setSelectedBarber(barber)}
                                                                sx={{
                                                                    p: 3, borderRadius: '18px', textAlign: 'center', cursor: 'pointer',
                                                                    border: `1.5px solid ${isSelected ? '#6366f1' : '#f1f5f9'}`,
                                                                    bgcolor: isSelected ? alpha('#6366f1', 0.04) : 'white',
                                                                    transition: 'all 0.2s ease',
                                                                    '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.07)', border: `1.5px solid ${isSelected ? '#6366f1' : '#c7d2fe'}` },
                                                                    position: 'relative',
                                                                }}
                                                            >
                                                                {isSelected && (
                                                                    <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                                                                        <CheckCircleIcon sx={{ color: '#10b981', fontSize: 20 }} />
                                                                    </Box>
                                                                )}
                                                                <Avatar sx={{ width: 68, height: 68, mx: 'auto', mb: 1.5, background: isSelected ? 'linear-gradient(135deg, #6366f1, #ec4899)' : 'linear-gradient(135deg, #e2e8f0, #cbd5e1)', fontSize: '1.5rem', fontWeight: 800, border: '3px solid white', boxShadow: isSelected ? '0 6px 18px rgba(99,102,241,0.35)' : '0 2px 8px rgba(0,0,0,0.06)', transition: 'all 0.2s' }}>
                                                                    {name.charAt(0)}
                                                                </Avatar>
                                                                <Typography sx={{ fontWeight: 700, color: '#09090b', fontFamily: '"Outfit", sans-serif', mb: 0.5 }}>{name}</Typography>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 1.5 }}>
                                                                    <StarIcon sx={{ fontSize: 13, color: '#fbbf24' }} />
                                                                    <Typography sx={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>{formatRating(barber.rating)}</Typography>
                                                                    {barber.experience && <Typography sx={{ fontSize: '0.78rem', color: '#94a3b8' }}>· {barber.experience}y</Typography>}
                                                                </Box>
                                                                {barber.specialties?.length > 0 && (
                                                                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'center' }}>
                                                                        {barber.specialties.slice(0, 2).map((s, idx) => (
                                                                            <Chip key={idx} label={s} size="small" sx={{ fontSize: '0.65rem', fontWeight: 600, bgcolor: '#f1f5f9', color: '#475569', borderRadius: '6px', height: 20 }} />
                                                                        ))}
                                                                    </Box>
                                                                )}
                                                            </MotionBox>
                                                        </Grid>
                                                    );
                                                })}
                                            </Grid>
                                        </>
                                    )}

                                    {/* Step 2: Date & Time */}
                                    {activeStep === 2 && (
                                        <>
                                            <Typography variant="overline" sx={{ color: '#6366f1', fontWeight: 700, letterSpacing: '0.12em', fontSize: '0.7rem' }}>Step 3</Typography>
                                            <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: '#09090b', fontSize: '1.4rem', mb: 3, mt: 0.3 }}>Choose Date & Time</Typography>
                                            <Grid container spacing={3}>
                                                <Grid size={{ xs: 12, md: 6 }}>
                                                    <Typography sx={{ fontWeight: 700, color: '#09090b', mb: 1.5, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <CalendarIcon sx={{ fontSize: 16, color: '#6366f1' }} /> Select Date
                                                    </Typography>
                                                    <Box sx={{ '& .MuiDateCalendar-root': { width: '100%' }, '& .MuiPickersDay-root.Mui-selected': { bgcolor: '#6366f1 !important' }, '& .MuiPickersDay-today': { border: '1.5px solid #6366f1 !important' } }}>
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                            <DateCalendar value={selectedDate} onChange={val => setSelectedDate(val)} minDate={dayjs()} sx={{ width: '100%' }} />
                                                        </LocalizationProvider>
                                                    </Box>
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 6 }}>
                                                    <Typography sx={{ fontWeight: 700, color: '#09090b', mb: 1.5, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <AccessTimeIcon sx={{ fontSize: 16, color: '#6366f1' }} /> Select Time
                                                    </Typography>
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <TimePicker
                                                            value={selectedTime}
                                                            onChange={val => setSelectedTime(val)}
                                                            sx={{ width: '100%', '& .MuiOutlinedInput-root': { borderRadius: '14px' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: '#f1f5f9' } }}
                                                        />
                                                    </LocalizationProvider>

                                                    <Box sx={{ mt: 3 }}>
                                                        <Typography sx={{ fontWeight: 700, color: '#09090b', mb: 1.5, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <NotesIcon sx={{ fontSize: 16, color: '#6366f1' }} /> Notes (optional)
                                                        </Typography>
                                                        <TextField
                                                            multiline rows={4} fullWidth
                                                            placeholder="Any special requests or instructions..."
                                                            value={notes}
                                                            onChange={e => setNotes(e.target.value)}
                                                            sx={{
                                                                '& .MuiOutlinedInput-root': { borderRadius: '14px', fontSize: '0.9rem' },
                                                                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#f1f5f9' },
                                                                '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#6366f1' },
                                                            }}
                                                        />
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </>
                                    )}

                                    {/* Step 3: Confirm */}
                                    {activeStep === 3 && (
                                        <>
                                            <Typography variant="overline" sx={{ color: '#6366f1', fontWeight: 700, letterSpacing: '0.12em', fontSize: '0.7rem' }}>Final Step</Typography>
                                            <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: '#09090b', fontSize: '1.4rem', mb: 3, mt: 0.3 }}>Review & Confirm</Typography>

                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                {[
                                                    {
                                                        icon: <ContentCutIcon sx={{ fontSize: 18, color: '#6366f1' }} />,
                                                        label: 'Service',
                                                        primary: selectedService?.name,
                                                        secondary: `${selectedService?.duration} min · ${selectedService?.price}`,
                                                        color: '#6366f1',
                                                    },
                                                    {
                                                        icon: <PersonIcon sx={{ fontSize: 18, color: '#ec4899' }} />,
                                                        label: 'Stylist',
                                                        primary: (selectedBarber?.userId as any)?.name,
                                                        secondary: `${formatRating(selectedBarber?.rating)} ★ · ${selectedBarber?.experience} yrs experience`,
                                                        color: '#ec4899',
                                                    },
                                                    {
                                                        icon: <EventIcon sx={{ fontSize: 18, color: '#10b981' }} />,
                                                        label: 'Date & Time',
                                                        primary: selectedDate?.format('dddd, MMMM DD, YYYY'),
                                                        secondary: `at ${selectedTime?.format('hh:mm A')}`,
                                                        color: '#10b981',
                                                    },
                                                ].map((item, i) => (
                                                    <Box key={i} sx={{ display: 'flex', gap: 2, p: 2.5, borderRadius: '16px', bgcolor: '#f8fafc', border: '1px solid #f1f5f9', alignItems: 'center' }}>
                                                        <Box sx={{ width: 42, height: 42, borderRadius: '13px', bgcolor: alpha(item.color, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                            {item.icon}
                                                        </Box>
                                                        <Box>
                                                            <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.2 }}>{item.label}</Typography>
                                                            <Typography sx={{ fontWeight: 700, color: '#09090b', fontFamily: '"Outfit", sans-serif', mb: 0.2 }}>{item.primary}</Typography>
                                                            <Typography sx={{ fontSize: '0.8rem', color: '#64748b' }}>{item.secondary}</Typography>
                                                        </Box>
                                                    </Box>
                                                ))}

                                                {notes && (
                                                    <Box sx={{ p: 2.5, borderRadius: '16px', bgcolor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                                                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.5 }}>Notes</Typography>
                                                        <Typography sx={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.6 }}>{notes}</Typography>
                                                    </Box>
                                                )}

                                                <Alert severity="info" sx={{ borderRadius: '14px', '& .MuiAlert-message': { fontSize: '0.85rem', fontWeight: 600 } }}>
                                                    Please review your details above before confirming
                                                </Alert>
                                            </Box>
                                        </>
                                    )}
                                </MotionBox>
                            </AnimatePresence>

                            {/* Nav buttons inside card */}
                            <Box sx={{ px: { xs: 3, sm: 4 }, pb: 4, display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                                <Button
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                    startIcon={<ArrowBackIcon />}
                                    sx={{ borderRadius: '14px', px: 3, py: 1.3, fontWeight: 700, textTransform: 'none', color: '#64748b', border: '1.5px solid #e2e8f0', '&:hover': { borderColor: '#6366f1', color: '#6366f1' }, '&.Mui-disabled': { opacity: 0.4 } }}
                                >
                                    Back
                                </Button>
                                {activeStep === steps.length - 1 ? (
                                    <Button
                                        variant="contained" onClick={handleSubmit} disabled={submitting}
                                        sx={{ borderRadius: '14px', px: 4, py: 1.3, fontWeight: 700, textTransform: 'none', background: 'linear-gradient(135deg, #6366f1, #7c3aed)', boxShadow: '0 6px 20px rgba(99,102,241,0.35)', '&:hover': { boxShadow: '0 10px 28px rgba(99,102,241,0.5)' } }}
                                    >
                                        {submitting ? <CircularProgress size={20} color="inherit" /> : '✓ Confirm Booking'}
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained" onClick={handleNext}
                                        endIcon={<ArrowForwardIcon />}
                                        sx={{ borderRadius: '14px', px: 3.5, py: 1.3, fontWeight: 700, textTransform: 'none', background: 'linear-gradient(135deg, #6366f1, #7c3aed)', boxShadow: '0 4px 16px rgba(99,102,241,0.3)' }}
                                    >
                                        Continue
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </Grid>

                    {/* ── Summary Sidebar ── */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box sx={{ position: { md: 'sticky' }, top: { md: 90 } }}>
                            <MotionBox
                                initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
                                sx={{ p: 3.5, borderRadius: '22px', bgcolor: 'white', border: '1px solid #f1f5f9', boxShadow: '0 8px 28px rgba(0,0,0,0.06)', mb: 2 }}
                            >
                                {/* Header */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, pb: 2.5, borderBottom: '1px solid #f1f5f9' }}>
                                    <Box sx={{ width: 36, height: 36, borderRadius: '11px', background: 'linear-gradient(135deg, #6366f1, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <CheckIcon sx={{ color: 'white', fontSize: 16 }} />
                                    </Box>
                                    <Typography sx={{ fontWeight: 700, color: '#09090b', fontFamily: '"Outfit", sans-serif' }}>Booking Summary</Typography>
                                </Box>

                                {/* Summary rows */}
                                {[
                                    { label: 'Venue', value: salon?.name, color: '#64748b' },
                                    { label: 'Service', value: selectedService?.name, sub: selectedService && `${selectedService.duration} min`, color: selectedService ? '#09090b' : '#94a3b8' },
                                    { label: 'Stylist', value: (selectedBarber?.userId as any)?.name, color: selectedBarber ? '#09090b' : '#94a3b8' },
                                    { label: 'Date', value: selectedDate?.format('MMM DD, YYYY'), color: selectedDate ? '#09090b' : '#94a3b8' },
                                    { label: 'Time', value: selectedTime?.format('hh:mm A'), color: selectedTime ? '#09090b' : '#94a3b8' },
                                ].map((row, i) => (
                                    <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', py: 1.2, borderBottom: i < 4 ? '1px solid #f8fafc' : 'none' }}>
                                        <Typography sx={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>{row.label}</Typography>
                                        <Box sx={{ textAlign: 'right', ml: 2 }}>
                                            <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: row.color || '#09090b' }}>
                                                {row.value || 'Not selected'}
                                            </Typography>
                                            {row.sub && <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8' }}>{row.sub}</Typography>}
                                        </Box>
                                    </Box>
                                ))}

                                {selectedService && (
                                    <>
                                        <Divider sx={{ my: 2 }} />
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                            <Typography sx={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Service Value</Typography>
                                            <Typography sx={{ fontSize: '0.85rem', color: '#94a3b8', textDecoration: 'line-through' }}>{selectedService.price}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography sx={{ fontWeight: 700, color: '#09090b', fontSize: '0.95rem' }}>Pay Now</Typography>
                                            <Box sx={{ textAlign: 'right' }}>
                                                <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, color: '#10b981', fontSize: '1.4rem' }}>Free</Typography>
                                                <Typography sx={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 700 }}>Pay at venue</Typography>
                                            </Box>
                                        </Box>
                                    </>
                                )}
                            </MotionBox>

                            {/* Trust badges */}
                            <Box sx={{ p: 2.5, borderRadius: '18px', bgcolor: alpha('#6366f1', 0.04), border: '1px solid', borderColor: alpha('#6366f1', 0.1) }}>
                                {[
                                    'Zero upfront payment required',
                                    'Free cancellation anytime',
                                    'Verified professionals only',
                                ].map((text, i) => (
                                    <Box key={i} sx={{ display: 'flex', gap: 1.5, alignItems: 'center', py: 0.75 }}>
                                        <CheckCircleIcon sx={{ fontSize: 14, color: '#6366f1', flexShrink: 0 }} />
                                        <Typography sx={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>{text}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default BookingFlow;
