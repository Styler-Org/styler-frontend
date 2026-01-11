import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Button,
    CircularProgress,
    Card,
    CardContent,
    GridLegacy as Grid,
    Chip,
    Avatar,
    Divider,
    Paper,
    IconButton,
    useTheme,
    useMediaQuery,
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
} from '@mui/icons-material';
import { salonService } from '../../services/salonService';
import { barberService } from '../../services/barberService';
import { Salon, Service, Barber } from '../../types';
import './SalonDetails.css';

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
                } catch (err) {
                    console.error('Error fetching services:', err);
                }

                try {
                    const staffResponse = await barberService.getSalonBarbers(id);
                    setStaff(staffResponse.data || []);
                } catch (err) {
                    console.error('Error fetching staff:', err);
                }
            } catch (err) {
                console.error('Error fetching salon:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSalonData();
    }, [id]);

    // Auto-advance carousel
    useEffect(() => {
        if (!salon?.images || salon.images.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % salon.images.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [salon?.images]);

    const formatRating = (rating: any): string => {
        if (!rating) return 'N/A';
        if (typeof rating === 'number') return rating.toFixed(1);
        if (typeof rating === 'object' && rating.average && typeof rating.average === 'number') {
            return rating.average.toFixed(1);
        }
        return 'N/A';
    };

    const isSalonOpen = (): boolean => {
        if (!salon?.operatingHours || salon.operatingHours.length === 0) return false;

        const now = new Date();
        const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
        const currentTime = now.getHours() * 60 + now.getMinutes();

        const todayHours = salon.operatingHours.find(
            (hours) => hours.day.toLowerCase() === currentDay.toLowerCase()
        );

        if (!todayHours || !todayHours.isOpen || !todayHours.slots || todayHours.slots.length === 0) return false;

        // Check if current time falls within any of the time slots
        const firstSlot = todayHours.slots[0];
        const [openHour, openMin] = firstSlot.start.split(':').map(Number);
        const [closeHour, closeMin] = firstSlot.end.split(':').map(Number);

        const openingTime = openHour * 60 + openMin;
        const closingTime = closeHour * 60 + closeMin;

        return currentTime >= openingTime && currentTime <= closingTime;
    };

    const handlePrevImage = () => {
        if (!salon?.images) return;
        setCurrentImageIndex((prev) => (prev - 1 + salon.images.length) % salon.images.length);
    };

    const handleNextImage = () => {
        if (!salon?.images) return;
        setCurrentImageIndex((prev) => (prev + 1) % salon.images.length);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f8f9fa' }}>
                <CircularProgress size={60} sx={{ color: '#667eea' }} />
            </Box>
        );
    }

    if (!salon) {
        return (
            <Container sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>Salon not found</Typography>
                <Button variant="contained" onClick={() => navigate('/salons')} sx={{ mt: 2 }}>
                    Browse Salons
                </Button>
            </Container>
        );
    }

    const activeServices = services.filter(s => s.isActive);
    const activeStaff = staff.filter(s => s.isActive && s.status === 'approved');
    const salonImages = salon.images && salon.images.length > 0
        ? salon.images
        : ['https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800'];

    return (
        <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh' }}>
            {/* Image Carousel Section */}
            <Box sx={{ position: 'relative', height: { xs: '300px', md: '500px' }, overflow: 'hidden' }}>
                {/* Carousel Images */}
                <Box
                    sx={{
                        position: 'relative',
                        height: '100%',
                        width: '100%',
                    }}
                >
                    {salonImages.map((image, index) => (
                        <Box
                            key={index}
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                opacity: index === currentImageIndex ? 1 : 0,
                                transition: 'opacity 0.8s ease-in-out',
                                backgroundImage: `url(${image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)',
                                },
                            }}
                        />
                    ))}
                </Box>

                {/* Carousel Controls */}
                {salonImages.length > 1 && (
                    <>
                        <IconButton
                            onClick={handlePrevImage}
                            sx={{
                                position: 'absolute',
                                left: 16,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                bgcolor: 'rgba(255,255,255,0.9)',
                                '&:hover': { bgcolor: 'white' },
                                zIndex: 2,
                            }}
                        >
                            <ChevronLeft />
                        </IconButton>
                        <IconButton
                            onClick={handleNextImage}
                            sx={{
                                position: 'absolute',
                                right: 16,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                bgcolor: 'rgba(255,255,255,0.9)',
                                '&:hover': { bgcolor: 'white' },
                                zIndex: 2,
                            }}
                        >
                            <ChevronRight />
                        </IconButton>

                        {/* Carousel Indicators */}
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: 20,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                display: 'flex',
                                gap: 1,
                                zIndex: 2,
                            }}
                        >
                            {salonImages.map((_, index) => (
                                <FiberManualRecord
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    sx={{
                                        fontSize: 12,
                                        color: index === currentImageIndex ? 'white' : 'rgba(255,255,255,0.5)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                    }}
                                />
                            ))}
                        </Box>
                    </>
                )}

                {/* Salon Info Overlay */}
                <Container
                    maxWidth="lg"
                    sx={{
                        position: 'absolute',
                        bottom: 40,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 2,
                        width: '100%',
                    }}
                >
                    <Box sx={{ color: 'white' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                            <Typography
                                variant={isMobile ? 'h3' : 'h2'}
                                sx={{
                                    fontWeight: 800,
                                    textShadow: '2px 2px 8px rgba(0,0,0,0.3)',
                                    letterSpacing: '-0.5px'
                                }}
                            >
                                {salon.displayName || salon.name}
                            </Typography>
                            <Chip
                                icon={<FiberManualRecord sx={{ fontSize: 12, animation: isSalonOpen() ? 'pulse 2s infinite' : 'none' }} />}
                                label={isSalonOpen() ? 'Open Now' : 'Closed'}
                                sx={{
                                    bgcolor: isSalonOpen() ? '#10b981' : '#ef4444',
                                    color: 'white',
                                    fontWeight: 700,
                                    px: 2.5,
                                    py: 3,
                                    fontSize: '1rem',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                    '@keyframes pulse': {
                                        '0%, 100%': { opacity: 1 },
                                        '50%': { opacity: 0.7 },
                                    },
                                }}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
                            {(() => {
                                const ratingValue = formatRating(salon.rating);
                                if (ratingValue && ratingValue !== 'N/A') {
                                    return (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <StarIcon sx={{ fontSize: 24, color: '#fbbf24' }} />
                                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                                {ratingValue}
                                            </Typography>
                                            <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                                ({salon.totalReviews || 0} reviews)
                                            </Typography>
                                        </Box>
                                    );
                                }
                                return null;
                            })()}

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PersonIcon sx={{ fontSize: 24 }} />
                                <Typography variant="h6">{activeStaff.length} Stylists</Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CheckIcon sx={{ fontSize: 24 }} />
                                <Typography variant="h6">{activeServices.length} Services</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* Main Content */}
            <Container maxWidth="lg" sx={{ mt: -6, position: 'relative', zIndex: 1, pb: 8 }}>
                {/* Quick Booking Card */}
                <Card
                    sx={{
                        mb: 4,
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                        borderRadius: 3,
                        overflow: 'hidden',
                    }}
                >
                    <CardContent sx={{ p: 4, background: '#4338ca', color: 'white' }}>
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} md={8}>
                                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                                    {salon.description || 'Experience Premium Grooming'}
                                </Typography>
                                <Typography variant="body1" sx={{ opacity: 0.95 }}>
                                    Book your appointment now and transform your look with our expert team
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    onClick={() => navigate(`/booking/${salon._id}`)}
                                    sx={{
                                        bgcolor: 'white',
                                        color: 'white',
                                        py: 2,
                                        fontSize: '1.1rem',
                                        fontWeight: 700,
                                        boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                                        '&:hover': {
                                            bgcolor: '#f5f5f5',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 12px 24px rgba(0,0,0,0.25)',
                                        },
                                        transition: 'all 0.3s',
                                    }}
                                >
                                    Book Appointment
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Services Section */}
                <Box sx={{ mb: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                        <Box
                            sx={{
                                width: 6,
                                height: 40,
                                bgcolor: '#667eea',
                                borderRadius: 3,
                                mr: 2,
                            }}
                        />
                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a1a1a' }}>
                            Our Services
                        </Typography>
                    </Box>

                    {activeServices.length === 0 ? (
                        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
                            <Typography color="text.secondary" variant="h6">No services available</Typography>
                        </Paper>
                    ) : (
                        <Grid container spacing={3}>
                            {activeServices.map((service) => (
                                <Grid item xs={12} sm={6} md={4} key={service._id}>
                                    <Card
                                        sx={{
                                            height: '100%',
                                            borderRadius: 3,
                                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                            border: '2px solid transparent',
                                            '&:hover': {
                                                transform: 'translateY(-8px)',
                                                boxShadow: '0 20px 40px rgba(102, 126, 234, 0.25)',
                                                borderColor: '#667eea',
                                            },
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                background: '#4338ca',
                                                p: 2.5,
                                                color: 'white',
                                                position: 'relative',
                                                '&::after': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    height: '4px',
                                                    background: 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)',
                                                },
                                            }}
                                        >
                                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                                                {service.name}
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                                                <Typography variant="caption" sx={{ opacity: 0.95, fontSize: '0.85rem' }}>
                                                    {service.gender}
                                                </Typography>
                                                <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.7)' }} />
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <AccessTimeIcon sx={{ fontSize: 16, opacity: 0.9 }} />
                                                    <Typography variant="caption" sx={{ opacity: 0.95, fontSize: '0.85rem' }}>
                                                        {service.duration} min
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                        <CardContent sx={{ p: 3 }}>
                                            {service.description && (
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                                                    {service.description}
                                                </Typography>
                                            )}

                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                <Typography variant="h4" sx={{ fontWeight: 800, color: '#667eea' }}>
                                                    ₹{service.price}
                                                </Typography>
                                                <Chip
                                                    label={service.gender}
                                                    size="small"
                                                    sx={{ bgcolor: '#f0f0ff', color: '#6366f1', fontWeight: 600, textTransform: 'capitalize' }}
                                                />
                                            </Box>

                                            <Button
                                                variant="contained"
                                                size="large"
                                                fullWidth
                                                onClick={() => navigate(`/booking/${salon._id}?service=${service._id}`)}
                                                sx={{
                                                    background: '#4338ca',
                                                    py: 1.5,
                                                    fontWeight: 700,
                                                    fontSize: '1rem',
                                                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
                                                    '&:hover': {
                                                        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 6px 16px rgba(99, 102, 241, 0.5)',
                                                    },
                                                    transition: 'all 0.3s',
                                                }}
                                            >
                                                Book This Service
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>

                {/* Meet Our Team */}
                <Box sx={{ mb: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                        <Box
                            sx={{
                                width: 6,
                                height: 40,
                                bgcolor: '#667eea',
                                borderRadius: 3,
                                mr: 2,
                            }}
                        />
                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a1a1a' }}>
                            Meet Our Expert Team
                        </Typography>
                    </Box>

                    {activeStaff.length === 0 ? (
                        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
                            <Typography color="text.secondary" variant="h6">No team information available</Typography>
                        </Paper>
                    ) : (
                        <Grid container spacing={3}>
                            {activeStaff.map((barber) => (
                                <Grid item xs={12} sm={6} md={3} key={barber._id}>
                                    <Card
                                        sx={{
                                            height: '100%',
                                            borderRadius: 3,
                                            textAlign: 'center',
                                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                            '&:hover': {
                                                transform: 'translateY(-12px)',
                                                boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)',
                                            },
                                        }}
                                    >
                                        <CardContent sx={{ p: 3 }}>
                                            <Box sx={{ position: 'relative', width: 'fit-content', mx: 'auto', mb: 2 }}>
                                                <Avatar
                                                    sx={{
                                                        width: 120,
                                                        height: 120,
                                                        background: '#4338ca',
                                                        fontSize: '3rem',
                                                        boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
                                                        border: '4px solid white',
                                                    }}
                                                >
                                                    {(barber.userId as any)?.name?.charAt(0) || 'S'}
                                                </Avatar>
                                                {/* Availability Indicator */}
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        bottom: 5,
                                                        right: 5,
                                                        width: 24,
                                                        height: 24,
                                                        borderRadius: '50%',
                                                        bgcolor: '#10b981',
                                                        border: '3px solid white',
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                                    }}
                                                />
                                            </Box>

                                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                                                {(barber.userId as any)?.name || 'Stylist'}
                                            </Typography>

                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 2 }}>
                                                <StarIcon sx={{ fontSize: 18, color: '#fbbf24' }} />
                                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                                                    {formatRating(barber.rating)}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    • {barber.experience} yrs
                                                </Typography>
                                            </Box>

                                            {barber.specialties && barber.specialties.length > 0 && (
                                                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'center', mb: 2 }}>
                                                    {barber.specialties.slice(0, 3).map((specialty, idx) => (
                                                        <Chip
                                                            key={idx}
                                                            label={specialty}
                                                            size="small"
                                                            sx={{
                                                                fontSize: '0.75rem',
                                                                bgcolor: '#f0f0ff',
                                                                color: '#6366f1',
                                                                fontWeight: 600,
                                                                borderRadius: 2,
                                                            }}
                                                        />
                                                    ))}
                                                </Box>
                                            )}

                                            <Button
                                                variant="outlined"
                                                size="small"
                                                fullWidth
                                                onClick={() => navigate(`/booking/${salon._id}?staff=${barber._id}`)}
                                                sx={{
                                                    borderColor: '#6366f1',
                                                    color: '#6366f1',
                                                    fontWeight: 600,
                                                    py: 1,
                                                    '&:hover': {
                                                        borderColor: '#4f46e5',
                                                        bgcolor: '#f0f0ff',
                                                    },
                                                }}
                                            >
                                                Book with {(barber.userId as any)?.name?.split(' ')[0] || 'Stylist'}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>

                {/* Hours & Contact */}
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <AccessTimeIcon sx={{ fontSize: 32, color: '#667eea', mr: 1.5 }} />
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                Operating Hours
                            </Typography>
                        </Box>

                        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                            <CardContent sx={{ p: 3 }}>
                                {!salon.operatingHours || salon.operatingHours.length === 0 ? (
                                    <Typography color="text.secondary">Hours not available</Typography>
                                ) : (
                                    <Box>
                                        {salon.operatingHours.map((hours, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    py: 2,
                                                    borderBottom: index < salon.operatingHours.length - 1 ? '1px solid #f0f0f0' : 'none',
                                                }}
                                            >
                                                <Typography variant="body1" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                                                    {hours.day}
                                                </Typography>
                                                {hours.isOpen && hours.slots && hours.slots.length > 0 ? (
                                                    <Typography variant="body1" sx={{ color: '#10b981', fontWeight: 600 }}>
                                                        {hours.slots.map((slot: any, idx: number) => (
                                                            <span key={idx}>
                                                                {slot.start} - {slot.end}
                                                                {idx < hours.slots.length - 1 && <br />}
                                                            </span>
                                                        ))}
                                                    </Typography>
                                                ) : (
                                                    <Typography variant="body1" sx={{ color: '#ef4444', fontWeight: 600 }}>
                                                        Closed
                                                    </Typography>
                                                )}
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <LocationIcon sx={{ fontSize: 32, color: '#667eea', mr: 1.5 }} />
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                Contact & Location
                            </Typography>
                        </Box>

                        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    <Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                            <LocationIcon sx={{ color: '#667eea', fontSize: 24 }} />
                                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#667eea', textTransform: 'uppercase' }}>
                                                Address
                                            </Typography>
                                        </Box>
                                        <Typography variant="body1" sx={{ pl: 5, color: '#1a1a1a' }}>
                                            {salon.address?.street}
                                            <br />
                                            {salon.address?.city}, {salon.address?.state} - {salon.address?.pincode}
                                        </Typography>
                                    </Box>

                                    {salon.phone && (
                                        <Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                                <PhoneIcon sx={{ color: '#667eea', fontSize: 24 }} />
                                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#667eea', textTransform: 'uppercase' }}>
                                                    Phone
                                                </Typography>
                                            </Box>
                                            <Typography variant="body1" sx={{ pl: 5, color: '#1a1a1a', fontWeight: 600 }}>
                                                {salon.phone}
                                            </Typography>
                                        </Box>
                                    )}

                                    {salon.email && (
                                        <Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                                <EmailIcon sx={{ color: '#667eea', fontSize: 24 }} />
                                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#667eea', textTransform: 'uppercase' }}>
                                                    Email
                                                </Typography>
                                            </Box>
                                            <Typography variant="body1" sx={{ pl: 5, color: '#1a1a1a' }}>
                                                {salon.email}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Final CTA */}
                <Card
                    sx={{
                        mt: 6,
                        borderRadius: 4,
                        overflow: 'hidden',
                        boxShadow: '0 20px 60px rgba(102, 126, 234, 0.3)',
                    }}
                >
                    <Box
                        sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            p: 6,
                            textAlign: 'center',
                        }}
                    >
                        <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
                            Ready for Your Transformation?
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 4, opacity: 0.95, fontWeight: 300 }}>
                            Join thousands of satisfied customers at {salon.name}
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate(`/booking/${salon._id}`)}
                            sx={{
                                bgcolor: 'white',
                                color: '#667eea',
                                px: 8,
                                py: 2.5,
                                fontSize: '1.3rem',
                                fontWeight: 800,
                                borderRadius: 3,
                                boxShadow: '0 12px 24px rgba(0,0,0,0.2)',
                                '&:hover': {
                                    bgcolor: '#f5f5f5',
                                    transform: 'scale(1.05)',
                                    boxShadow: '0 16px 32px rgba(0,0,0,0.3)',
                                },
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                        >
                            Book Your Appointment Now
                        </Button>
                    </Box>
                </Card>
            </Container>
        </Box>
    );
};

export default SalonDetails;
