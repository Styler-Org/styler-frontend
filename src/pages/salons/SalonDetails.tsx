import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Container, Typography, Button, CircularProgress, Grid,
    Chip, Avatar, Divider, IconButton, alpha,
    useTheme, useMediaQuery,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    LocationOn as LocationIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    Star as StarIcon,
    AccessTime as AccessTimeIcon,
    Check as CheckIcon,
    Person as PersonIcon,
    ChevronLeft,
    ChevronRight,
    FiberManualRecord,
    CalendarToday as CalendarIcon,
    ArrowForward as ArrowForwardIcon,
    Circle as CircleIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { salonService } from '../../services/salonService';
import { barberService } from '../../services/barberService';
import { Salon, Service, Barber } from '../../types';

const MotionBox = motion(Box);

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const SalonDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [salon, setSalon] = useState<Salon | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [staff, setStaff] = useState<Barber[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchSalonData = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const salonResponse = await salonService.getSalonById(id);
                setSalon(salonResponse.data as Salon);
                try {
                    const servicesResponse = await salonService.getSalonServices(id);
                    setServices(servicesResponse.data || []);
                } catch (err) { console.error('Error fetching services:', err); }
                try {
                    const staffResponse = await barberService.getSalonBarbers(id);
                    setStaff(staffResponse.data || []);
                } catch (err) { console.error('Error fetching staff:', err); }
            } catch (err) {
                console.error('Error fetching salon:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSalonData();
    }, [id]);

    useEffect(() => {
        if (!salon?.images || salon.images.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentImageIndex(prev => (prev + 1) % salon.images.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [salon?.images]);

    const formatRating = (rating: any): string => {
        if (!rating) return 'N/A';
        if (typeof rating === 'number') return rating.toFixed(1);
        if (typeof rating === 'object' && rating.average && typeof rating.average === 'number') return rating.average.toFixed(1);
        return 'N/A';
    };

    const isSalonOpen = (): boolean => {
        if (!salon?.operatingHours || salon.operatingHours.length === 0) return false;
        const now = new Date();
        const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
        const currentTime = now.getHours() * 60 + now.getMinutes();
        const todayHours = salon.operatingHours.find(h => h.day.toLowerCase() === currentDay.toLowerCase());
        if (!todayHours || !todayHours.isOpen || !todayHours.slots || todayHours.slots.length === 0) return false;
        const firstSlot = todayHours.slots[0];
        const [openHour, openMin] = firstSlot.start.split(':').map(Number);
        const [closeHour, closeMin] = firstSlot.end.split(':').map(Number);
        return currentTime >= (openHour * 60 + openMin) && currentTime <= (closeHour * 60 + closeMin);
    };

    const handlePrevImage = () => {
        if (!salon?.images) return;
        setCurrentImageIndex(prev => (prev - 1 + salon.images.length) % salon.images.length);
    };
    const handleNextImage = () => {
        if (!salon?.images) return;
        setCurrentImageIndex(prev => (prev + 1) % salon.images.length);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f8fafc', flexDirection: 'column', gap: 2 }}>
                <CircularProgress size={44} sx={{ color: '#6366f1' }} />
                <Typography sx={{ color: '#64748b', fontSize: '0.9rem' }}>Loading venue details...</Typography>
            </Box>
        );
    }

    if (!salon) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 3, bgcolor: '#f8fafc' }}>
                <Box sx={{ width: 80, height: 80, borderRadius: '24px', bgcolor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LocationIcon sx={{ fontSize: 36, color: '#94a3b8' }} />
                </Box>
                <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, fontSize: '1.5rem', color: '#09090b' }}>Venue not found</Typography>
                <Typography sx={{ color: '#64748b' }}>This venue may have moved or been removed.</Typography>
                <Button variant="contained" onClick={() => navigate('/salons')} sx={{ borderRadius: '14px', px: 3, py: 1.4, fontWeight: 700, background: 'linear-gradient(135deg, #6366f1, #7c3aed)' }}>
                    Browse Venues
                </Button>
            </Box>
        );
    }

    const activeServices = services.filter(s => s.isActive);
    const activeStaff = staff.filter(s => s.isActive && s.status === 'approved');
    const salonImages = salon.images && salon.images.length > 0
        ? salon.images
        : ['https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1200&q=85'];

    const isOpen = isSalonOpen();
    const ratingValue = formatRating(salon.rating);

    return (
        <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh' }}>

            {/* ── Image Carousel Hero ── */}
            <Box sx={{ position: 'relative', height: { xs: '52vw', sm: '45vw', md: '56vh' }, maxHeight: 640, overflow: 'hidden' }}>
                {/* Images */}
                {salonImages.map((image, index) => (
                    <Box key={index} sx={{
                        position: 'absolute', inset: 0,
                        backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center',
                        opacity: index === currentImageIndex ? 1 : 0,
                        transition: 'opacity 0.9s ease',
                    }} />
                ))}

                {/* Gradient overlays */}
                <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.65) 100%)' }} />

                {/* Back button */}
                <Box sx={{ position: 'absolute', top: { xs: 70, md: 24 }, left: 24, zIndex: 3 }}>
                    <IconButton
                        onClick={() => navigate(-1)}
                        sx={{ bgcolor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' } }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                </Box>

                {/* Photo count badge */}
                {salonImages.length > 1 && (
                    <Box sx={{ position: 'absolute', top: { xs: 70, md: 24 }, right: 24, zIndex: 3 }}>
                        <Chip
                            label={`${currentImageIndex + 1} / ${salonImages.length}`}
                            sx={{ bgcolor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', color: 'white', fontWeight: 600, fontSize: '0.78rem', border: '1px solid rgba(255,255,255,0.2)' }}
                        />
                    </Box>
                )}

                {/* Carousel controls */}
                {salonImages.length > 1 && (
                    <>
                        <IconButton onClick={handlePrevImage} sx={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', zIndex: 2, bgcolor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.28)' } }}>
                            <ChevronLeft />
                        </IconButton>
                        <IconButton onClick={handleNextImage} sx={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', zIndex: 2, bgcolor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.28)' } }}>
                            <ChevronRight />
                        </IconButton>

                        {/* Dot indicators */}
                        <Box sx={{ position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 0.75, zIndex: 2 }}>
                            {salonImages.map((_, i) => (
                                <Box key={i} onClick={() => setCurrentImageIndex(i)} sx={{
                                    width: i === currentImageIndex ? 22 : 7, height: 7, borderRadius: '4px',
                                    bgcolor: i === currentImageIndex ? 'white' : 'rgba(255,255,255,0.45)',
                                    transition: 'all 0.35s ease', cursor: 'pointer',
                                }} />
                            ))}
                        </Box>
                    </>
                )}

                {/* Salon title overlay */}
                <Container maxWidth="lg" sx={{ position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)', zIndex: 2, width: '100%' }}>
                    <Box sx={{ color: 'white' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5, flexWrap: 'wrap' }}>
                            <Typography sx={{
                                fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: 'white',
                                fontSize: { xs: '1.6rem', sm: '2rem', md: '2.6rem' }, letterSpacing: '-0.03em',
                                textShadow: '0 2px 20px rgba(0,0,0,0.4)', lineHeight: 1.1,
                            }}>
                                {salon.displayName || salon.name}
                            </Typography>
                            <Chip
                                icon={<CircleIcon sx={{ fontSize: '10px !important', color: `${isOpen ? '#fff' : '#fff'} !important`, animation: isOpen ? 'sdPulse 2s infinite' : 'none', '@keyframes sdPulse': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.5 } } }} />}
                                label={isOpen ? 'Open Now' : 'Closed'}
                                size="small"
                                sx={{
                                    bgcolor: isOpen ? alpha('#10b981', 0.85) : alpha('#ef4444', 0.85),
                                    backdropFilter: 'blur(8px)', color: 'white', fontWeight: 700, fontSize: '0.8rem',
                                    border: `1px solid ${isOpen ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
                                }}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                            {ratingValue !== 'N/A' && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                                    <StarIcon sx={{ fontSize: 18, color: '#fbbf24' }} />
                                    <Typography sx={{ fontWeight: 700, color: 'white', fontSize: '0.95rem' }}>{ratingValue}</Typography>
                                    <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.88rem' }}>({salon.totalReviews || 0} reviews)</Typography>
                                </Box>
                            )}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                                <PersonIcon sx={{ fontSize: 17, color: 'rgba(255,255,255,0.8)' }} />
                                <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.88rem', fontWeight: 600 }}>{activeStaff.length} Stylists</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                                <CheckIcon sx={{ fontSize: 17, color: 'rgba(255,255,255,0.8)' }} />
                                <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.88rem', fontWeight: 600 }}>{activeServices.length} Services</Typography>
                            </Box>
                            {salon.address?.city && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                                    <LocationIcon sx={{ fontSize: 17, color: 'rgba(255,255,255,0.8)' }} />
                                    <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.88rem' }}>{salon.address.city}</Typography>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* ── Main Content ── */}
            <Container maxWidth="lg" sx={{ pt: { xs: 3, md: 5 }, pb: 10 }}>
                <Grid container spacing={4} alignItems="flex-start">

                    {/* ── Left: Details ── */}
                    <Grid size={{ xs: 12, md: 8 }}>

                        {/* Services */}
                        <MotionBox variants={fadeUp} initial="hidden" animate="show" sx={{ mb: 6 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                                <Box>
                                    <Typography variant="overline" sx={{ color: '#6366f1', fontWeight: 700, letterSpacing: '0.12em', fontSize: '0.7rem' }}>
                                        What We Offer
                                    </Typography>
                                    <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: '#09090b', fontSize: { xs: '1.4rem', md: '1.8rem' }, letterSpacing: '-0.02em', mt: 0.3 }}>
                                        Services
                                    </Typography>
                                </Box>
                                {activeServices.length > 0 && (
                                    <Chip label={`${activeServices.length} available`} size="small" sx={{ bgcolor: alpha('#6366f1', 0.08), color: '#6366f1', fontWeight: 700, fontSize: '0.75rem', borderRadius: '8px' }} />
                                )}
                            </Box>

                            {activeServices.length === 0 ? (
                                <Box sx={{ p: 5, textAlign: 'center', bgcolor: 'white', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
                                    <Typography sx={{ color: '#64748b' }}>No services listed yet</Typography>
                                </Box>
                            ) : (
                                <Grid container spacing={2}>
                                    {activeServices.map((service, i) => (
                                        <Grid size={{ xs: 12, sm: 6 }} key={service._id}>
                                            <MotionBox
                                                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.06 }}
                                                whileHover={{ y: -3 }}
                                                sx={{
                                                    p: 2.5, borderRadius: '18px', bgcolor: 'white',
                                                    border: '1px solid #f1f5f9', height: '100%',
                                                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                                                    transition: 'all 0.25s ease',
                                                    '&:hover': { boxShadow: '0 12px 28px rgba(0,0,0,0.08)', borderColor: alpha('#6366f1', 0.2) },
                                                    display: 'flex', flexDirection: 'column',
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                                    <Typography sx={{ fontWeight: 700, color: '#09090b', fontFamily: '"Outfit", sans-serif', fontSize: '0.98rem', pr: 1 }}>
                                                        {service.name}
                                                    </Typography>
                                                    <Chip label={service.gender} size="small" sx={{ bgcolor: alpha('#6366f1', 0.08), color: '#4f46e5', fontWeight: 600, fontSize: '0.68rem', borderRadius: '6px', flexShrink: 0 }} />
                                                </Box>
                                                {service.description && (
                                                    <Typography sx={{ color: '#64748b', fontSize: '0.82rem', lineHeight: 1.65, mb: 2, flexGrow: 1 }}>
                                                        {service.description}
                                                    </Typography>
                                                )}
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                                                    <AccessTimeIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
                                                    <Typography sx={{ color: '#64748b', fontSize: '0.8rem' }}>{service.duration} min</Typography>
                                                    <Box sx={{ ml: 'auto' }}>
                                                        <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: '#09090b', fontSize: '1.15rem' }}>
                                                            {service.price}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Button
                                                    variant="outlined" size="small" fullWidth
                                                    onClick={() => navigate(`/booking/${salon._id}?service=${service._id}`)}
                                                    sx={{
                                                        borderRadius: '12px', fontWeight: 700, fontSize: '0.82rem',
                                                        borderColor: '#e2e8f0', color: '#475569', textTransform: 'none',
                                                        '&:hover': { borderColor: '#6366f1', color: '#6366f1', bgcolor: alpha('#6366f1', 0.04) },
                                                    }}
                                                >
                                                    Book This Service
                                                </Button>
                                            </MotionBox>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </MotionBox>

                        {/* Team */}
                        {activeStaff.length > 0 && (
                            <MotionBox variants={fadeUp} initial="hidden" animate="show" sx={{ mb: 6 }}>
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="overline" sx={{ color: '#6366f1', fontWeight: 700, letterSpacing: '0.12em', fontSize: '0.7rem' }}>
                                        Our Professionals
                                    </Typography>
                                    <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: '#09090b', fontSize: { xs: '1.4rem', md: '1.8rem' }, letterSpacing: '-0.02em', mt: 0.3 }}>
                                        Expert Team
                                    </Typography>
                                </Box>

                                <Grid container spacing={2}>
                                    {activeStaff.map((barber, i) => (
                                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={barber._id}>
                                            <MotionBox
                                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: i * 0.07 }}
                                                whileHover={{ y: -4 }}
                                                sx={{
                                                    p: 3, borderRadius: '20px', bgcolor: 'white',
                                                    border: '1px solid #f1f5f9', textAlign: 'center',
                                                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                                                    transition: 'all 0.25s ease',
                                                    '&:hover': { boxShadow: '0 14px 36px rgba(0,0,0,0.09)', borderColor: alpha('#6366f1', 0.18) },
                                                }}
                                            >
                                                <Box sx={{ position: 'relative', width: 'fit-content', mx: 'auto', mb: 2 }}>
                                                    <Avatar sx={{
                                                        width: 72, height: 72,
                                                        background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                                                        fontSize: '1.6rem', fontWeight: 800,
                                                        boxShadow: '0 6px 20px rgba(99,102,241,0.3)',
                                                        border: '3px solid white',
                                                    }}>
                                                        {(barber.userId as any)?.name?.charAt(0) || 'S'}
                                                    </Avatar>
                                                    <Box sx={{ position: 'absolute', bottom: 2, right: 2, width: 16, height: 16, borderRadius: '50%', bgcolor: '#10b981', border: '2.5px solid white' }} />
                                                </Box>

                                                <Typography sx={{ fontWeight: 700, color: '#09090b', fontFamily: '"Outfit", sans-serif', mb: 0.3, fontSize: '0.95rem' }}>
                                                    {(barber.userId as any)?.name || 'Stylist'}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 1.5 }}>
                                                    <StarIcon sx={{ fontSize: 13, color: '#fbbf24' }} />
                                                    <Typography sx={{ color: '#64748b', fontSize: '0.78rem', fontWeight: 600 }}>{formatRating(barber.rating)}</Typography>
                                                    {barber.experience && (
                                                        <Typography sx={{ color: '#94a3b8', fontSize: '0.78rem' }}>• {barber.experience}y exp</Typography>
                                                    )}
                                                </Box>

                                                {barber.specialties && barber.specialties.length > 0 && (
                                                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'center', mb: 2 }}>
                                                        {barber.specialties.slice(0, 2).map((s, idx) => (
                                                            <Chip key={idx} label={s} size="small" sx={{ fontSize: '0.68rem', bgcolor: '#f1f5f9', color: '#475569', fontWeight: 600, borderRadius: '6px' }} />
                                                        ))}
                                                    </Box>
                                                )}

                                                <Button
                                                    variant="text" size="small" fullWidth
                                                    onClick={() => navigate(`/booking/${salon._id}?staff=${barber._id}`)}
                                                    sx={{ borderRadius: '10px', fontWeight: 600, fontSize: '0.8rem', color: '#6366f1', textTransform: 'none', bgcolor: alpha('#6366f1', 0.06), '&:hover': { bgcolor: alpha('#6366f1', 0.12) } }}
                                                >
                                                    Book with {(barber.userId as any)?.name?.split(' ')[0] || 'Stylist'}
                                                </Button>
                                            </MotionBox>
                                        </Grid>
                                    ))}
                                </Grid>
                            </MotionBox>
                        )}

                        {/* Hours + Contact row */}
                        <Grid container spacing={3}>
                            {/* Operating Hours */}
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <MotionBox variants={fadeUp} initial="hidden" animate="show"
                                    sx={{ p: 3, borderRadius: '20px', bgcolor: 'white', border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                                        <Box sx={{ width: 36, height: 36, borderRadius: '11px', bgcolor: alpha('#6366f1', 0.08), color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <AccessTimeIcon sx={{ fontSize: 17 }} />
                                        </Box>
                                        <Typography sx={{ fontWeight: 700, color: '#09090b', fontFamily: '"Outfit", sans-serif' }}>Hours</Typography>
                                    </Box>
                                    {!salon.operatingHours || salon.operatingHours.length === 0 ? (
                                        <Typography sx={{ color: '#64748b', fontSize: '0.88rem' }}>Hours not available</Typography>
                                    ) : (
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                                            {salon.operatingHours.map((hours, i) => (
                                                <Box key={i} sx={{
                                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                    py: 1.25,
                                                    borderBottom: i < salon.operatingHours.length - 1 ? '1px solid #f8fafc' : 'none',
                                                }}>
                                                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>{hours.day}</Typography>
                                                    {hours.isOpen && hours.slots?.length > 0 ? (
                                                        <Typography sx={{ fontSize: '0.82rem', color: '#10b981', fontWeight: 700 }}>
                                                            {hours.slots[0].start} – {hours.slots[0].end}
                                                        </Typography>
                                                    ) : (
                                                        <Typography sx={{ fontSize: '0.82rem', color: '#ef4444', fontWeight: 600 }}>Closed</Typography>
                                                    )}
                                                </Box>
                                            ))}
                                        </Box>
                                    )}
                                </MotionBox>
                            </Grid>

                            {/* Contact */}
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <MotionBox variants={fadeUp} initial="hidden" animate="show"
                                    sx={{ p: 3, borderRadius: '20px', bgcolor: 'white', border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', height: '100%' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                                        <Box sx={{ width: 36, height: 36, borderRadius: '11px', bgcolor: alpha('#ec4899', 0.08), color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <LocationIcon sx={{ fontSize: 17 }} />
                                        </Box>
                                        <Typography sx={{ fontWeight: 700, color: '#09090b', fontFamily: '"Outfit", sans-serif' }}>Contact</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                                            <LocationIcon sx={{ fontSize: 16, color: '#94a3b8', mt: 0.2, flexShrink: 0 }} />
                                            <Typography sx={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.6 }}>
                                                {salon.address?.street && <>{salon.address.street}<br /></>}
                                                {[salon.address?.city, salon.address?.state, salon.address?.pincode].filter(Boolean).join(', ')}
                                            </Typography>
                                        </Box>
                                        {salon.phone && (
                                            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                                                <PhoneIcon sx={{ fontSize: 15, color: '#94a3b8', flexShrink: 0 }} />
                                                <Typography sx={{ fontSize: '0.85rem', color: '#334155', fontWeight: 600 }}>{salon.phone}</Typography>
                                            </Box>
                                        )}
                                        {salon.email && (
                                            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                                                <EmailIcon sx={{ fontSize: 15, color: '#94a3b8', flexShrink: 0 }} />
                                                <Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>{salon.email}</Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </MotionBox>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* ── Right: Sticky Booking Sidebar ── */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box sx={{ position: { md: 'sticky' }, top: { md: 90 } }}>
                            {/* Booking card */}
                            <MotionBox
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.15 }}
                                sx={{
                                    p: 3.5, borderRadius: '24px', bgcolor: 'white',
                                    border: '1px solid #f1f5f9', boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                                    mb: 2.5,
                                }}
                            >
                                {/* Status */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: isOpen ? '#10b981' : '#ef4444', boxShadow: isOpen ? '0 0 8px rgba(16,185,129,0.6)' : 'none' }} />
                                    <Typography sx={{ fontWeight: 700, color: isOpen ? '#10b981' : '#ef4444', fontSize: '0.88rem' }}>
                                        {isOpen ? 'Open Now — Ready to Book' : 'Currently Closed'}
                                    </Typography>
                                </Box>

                                <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: '#09090b', fontSize: '1.4rem', mb: 0.5, lineHeight: 1.2 }}>
                                    Book an Appointment
                                </Typography>
                                <Typography sx={{ color: '#64748b', fontSize: '0.85rem', mb: 3, lineHeight: 1.6 }}>
                                    {salon.description || 'Experience a world-class service with our expert team. Choose your preferred time slot.'}
                                </Typography>

                                {/* Quick stats */}
                                <Box sx={{ display: 'flex', gap: 2, mb: 3.5 }}>
                                    {ratingValue !== 'N/A' && (
                                        <Box sx={{ flex: 1, p: 1.5, borderRadius: '14px', bgcolor: '#f8fafc', textAlign: 'center' }}>
                                            <Typography sx={{ fontWeight: 800, color: '#09090b', fontFamily: '"Outfit", sans-serif' }}>{ratingValue}</Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.3, mt: 0.2 }}>
                                                <StarIcon sx={{ fontSize: 11, color: '#fbbf24' }} />
                                                <Typography sx={{ color: '#64748b', fontSize: '0.7rem' }}>Rating</Typography>
                                            </Box>
                                        </Box>
                                    )}
                                    <Box sx={{ flex: 1, p: 1.5, borderRadius: '14px', bgcolor: '#f8fafc', textAlign: 'center' }}>
                                        <Typography sx={{ fontWeight: 800, color: '#09090b', fontFamily: '"Outfit", sans-serif' }}>{activeStaff.length}</Typography>
                                        <Typography sx={{ color: '#64748b', fontSize: '0.7rem', mt: 0.2 }}>Stylists</Typography>
                                    </Box>
                                    <Box sx={{ flex: 1, p: 1.5, borderRadius: '14px', bgcolor: '#f8fafc', textAlign: 'center' }}>
                                        <Typography sx={{ fontWeight: 800, color: '#09090b', fontFamily: '"Outfit", sans-serif' }}>{activeServices.length}</Typography>
                                        <Typography sx={{ color: '#64748b', fontSize: '0.7rem', mt: 0.2 }}>Services</Typography>
                                    </Box>
                                </Box>

                                <Button
                                    variant="contained" size="large" fullWidth
                                    onClick={() => navigate(`/booking/${salon._id}`)}
                                    endIcon={<ArrowForwardIcon />}
                                    sx={{
                                        borderRadius: '16px', py: 1.75, fontWeight: 700, fontSize: '1rem',
                                        background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)',
                                        boxShadow: '0 8px 24px rgba(99,102,241,0.35)',
                                        '&:hover': { background: 'linear-gradient(135deg, #5558e8 0%, #6d28d9 100%)', boxShadow: '0 12px 32px rgba(99,102,241,0.5)', transform: 'translateY(-1px)' },
                                        transition: 'all 0.25s ease',
                                    }}
                                >
                                    Book Now — Free
                                </Button>

                                <Typography sx={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.75rem', mt: 1.5 }}>
                                    No prepayment required · Cancel anytime
                                </Typography>
                            </MotionBox>

                            {/* Contact quick card */}
                            {(salon.address?.city || salon.phone) && (
                                <MotionBox
                                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.25 }}
                                    sx={{ p: 2.5, borderRadius: '20px', bgcolor: 'white', border: '1px solid #f1f5f9' }}
                                >
                                    {salon.address?.city && (
                                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', mb: salon.phone ? 1.5 : 0 }}>
                                            <LocationIcon sx={{ fontSize: 16, color: '#6366f1', flexShrink: 0 }} />
                                            <Typography sx={{ fontSize: '0.85rem', color: '#334155', fontWeight: 500 }}>
                                                {[salon.address.city, salon.address.state].filter(Boolean).join(', ')}
                                            </Typography>
                                        </Box>
                                    )}
                                    {salon.phone && (
                                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                                            <PhoneIcon sx={{ fontSize: 15, color: '#6366f1', flexShrink: 0 }} />
                                            <Typography sx={{ fontSize: '0.85rem', color: '#334155', fontWeight: 600 }}>{salon.phone}</Typography>
                                        </Box>
                                    )}
                                </MotionBox>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default SalonDetails;
