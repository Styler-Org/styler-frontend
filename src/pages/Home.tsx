import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Grid, Card, CardContent, Box, Avatar } from '@mui/material';
import {
    ArrowForward as ArrowForwardIcon,
    LocationOn as LocationOnIcon,
    Star as StarIcon,
    ContentCut as ScissorsIcon,
    CalendarToday as CalendarIcon,
    CheckCircle as CheckIcon,
    Schedule as ScheduleIcon,
    Smartphone as SmartphoneIcon,
    AutoAwesome as SparklesIcon,
    EmojiEvents as TrophyIcon,
    Face as FaceIcon,
    Spa as SpaIcon,
    Security as SecurityIcon,
    LocalOffer as OfferIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useAuthStore } from '../stores/authStore';
import CountUp from 'react-countup';
import './Home.css';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

interface Stat {
    count: number;
    suffix: string;
    title: string;
    color: string;
    icon: React.ReactNode;
}

import { strapiService } from '../services/strapiService';

// ... existing imports ...

const Home: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { isAuthenticated, user: authUser } = useAuthStore();

    // Strapi Data State
    const [heroData, setHeroData] = useState<any>(null);

    // Fetch Strapi Data
    useEffect(() => {
        const fetchStrapiData = async () => {
            const data = await strapiService.getHomePageData();
            if (data && data.data) {
                setHeroData(data.data.attributes);
            }
        };
        fetchStrapiData();
    }, []);

    // Redirect professionals to their dashboard
    useEffect(() => {
        if (isAuthenticated && authUser) {
            const role = authUser.role;
            if (role === 'barber') {
                navigate('/barber/dashboard', { replace: true });
            } else if (role === 'salon_owner') {
                navigate('/salon-owner/dashboard', { replace: true });
            }
        }
    }, [isAuthenticated, authUser, navigate]);

    const [stats] = useState<Stat[]>([
        { count: 20, suffix: '+', title: 'Branches', color: '#f59e0b', icon: <LocationOnIcon /> },
        { count: 5000, suffix: '+', title: 'Happy Clients', color: '#14b8a6', icon: <StarIcon /> },
        { count: 150, suffix: '+', title: 'Expert Stylists', color: '#8b5cf6', icon: <ScissorsIcon /> },
        { count: 10, suffix: 'K+', title: 'Total Appointments', color: '#4338ca', icon: <CalendarIcon /> },
    ]);

    const features = [
        {
            icon: <CalendarIcon />,
            title: 'Easy Booking',
            description: 'Book appointments 24/7 through our platform with instant confirmation',
        },
        {
            icon: <ScissorsIcon />,
            title: 'Expert Stylists',
            description: 'Certified professionals with years of experience in latest trends',
        },
        {
            icon: <StarIcon />,
            title: 'Top Rated Service',
            description: 'Consistently rated 4.8+ stars by thousands of satisfied customers',
        },
        {
            icon: <ScheduleIcon />,
            title: 'Flexible Scheduling',
            description: 'Choose from morning, afternoon, or evening slots that fit your schedule',
        },
    ];

    const services = [
        {
            icon: <ScissorsIcon />,
            title: 'Salons',
            price: '₹500',
            image: '/images/mens-haircut.png',
        },
        {
            icon: <FaceIcon />,
            title: 'Dermatologists',
            price: '₹1500',
            image: '/images/beard-grooming.png',
        },
        {
            icon: <SpaIcon />,
            title: 'Wellness & Spa',
            price: '₹3000',
            image: '/images/spa-facial.png',
        },
        {
            icon: <SparklesIcon />,
            title: 'Nails & Lashes',
            price: '₹2000',
            image: '/images/womens-styling.png',
        },
    ];

    const testimonials = [
        {
            name: 'Rahul Sharma',
            rating: 5,
            comment: 'Best salon experience! The staff is professional and the ambiance is amazing.',
            avatar: 'R',
        },
        {
            name: 'Priya Patel',
            rating: 5,
            comment: 'Love the convenience of booking online. My stylist always does an excellent job!',
            avatar: 'P',
        },
        {
            name: 'Amit Kumar',
            rating: 5,
            comment: 'Premium quality service at reasonable prices. Highly recommended!',
            avatar: 'A',
        },
    ];

    const howItWorks = [
        { step: '1', title: 'Browse Salons', description: 'Find top-rated salons near you' },
        { step: '2', title: 'Choose Service', description: 'Select from various grooming services' },
        { step: '3', title: 'Pick Time Slot', description: 'Book at your convenient time' },
        { step: '4', title: 'Get Styled', description: 'Enjoy premium grooming experience' },
    ];

    const getHeroTitle = () => {
        if (heroData?.heroTitle) {
            return <span dangerouslySetInnerHTML={{ __html: heroData.heroTitle }} />;
        }
        return (
            <>
                Premium Salons, <br />
                <span style={{
                    background: 'linear-gradient(to right, #4f46e5, #f472b6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>Zero Pre-Payment</span>
            </>
        );
    };

    return (
        <Box className="home-page">
            {/* Hero Section */}
            <Box className="hero-section" sx={{
                backgroundImage: heroData?.heroImage?.data ? `url(${strapiService.getImageUrl(heroData.heroImage)})` : undefined
            }}>
                <Box className="hero-overlay" />
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
                    <MotionBox
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="hero-content"
                    >
                        <Box sx={{ mb: 3, display: 'inline-block' }}>
                            <Box sx={{
                                bgcolor: 'rgba(255,255,255,0.1)',
                                backdropFilter: 'blur(10px)',
                                px: 2,
                                py: 0.5,
                                borderRadius: '20px',
                                border: '1px solid rgba(255,255,255,0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                <StarIcon sx={{ color: '#fbbf24', fontSize: '1rem' }} />
                                <Typography variant="caption" sx={{ color: 'white', fontWeight: 600, letterSpacing: 0.5 }}>
                                    {heroData?.badgeText || '#1 RATED GROOMING PLATFORM'}
                                </Typography>
                            </Box>
                        </Box>

                        <Typography variant="h1" sx={{
                            color: 'white',
                            mb: 2,
                            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                            fontWeight: 800,
                            lineHeight: 1.1,
                            textShadow: '0 4px 60px rgba(0,0,0,0.5)'
                        }}>
                            {getHeroTitle()}
                        </Typography>

                        <Typography variant="h5" sx={{
                            color: 'rgba(255, 255, 255, 0.95)',
                            mb: 5,
                            maxWidth: 800,
                            mx: 'auto',
                            fontSize: { xs: '1rem', sm: '1.25rem' },
                            lineHeight: 1.6,
                            fontWeight: 400
                        }}>
                            {heroData?.heroSubtitle || "Book appointments with the city's finest salons. Pay nothing now, pay at the salon, and get exclusive wallet discounts."}
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => navigate('/salons')}
                                sx={{
                                    px: 5,
                                    py: 1.8,
                                    fontSize: '1.1rem',
                                    background: 'white',
                                    color: '#4f46e5',
                                    fontWeight: 700,
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                                    '&:hover': {
                                        background: '#f8fafc',
                                        transform: 'translateY(-2px)'
                                    }
                                }}
                            >
                                Find a Salon
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                onClick={() => navigate('/services')}
                                sx={{
                                    px: 5,
                                    py: 1.8,
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    color: 'white',
                                    borderColor: 'rgba(255,255,255,0.4)',
                                    backdropFilter: 'blur(5px)',
                                    '&:hover': {
                                        borderColor: 'white',
                                        bgcolor: 'rgba(255,255,255,0.1)'
                                    },
                                }}
                            >
                                Explore Services
                            </Button>
                        </Box>
                    </MotionBox>
                </Container>
            </Box >

            {/* Stats Section */}
            < Container maxWidth="lg" className="stats-section">
                <Grid container spacing={3}>
                    {stats.map((stat, index) => (
                        <Grid size={{ xs: 6, md: 3 }} key={index}>
                            <MotionCard
                                className="stat-card"
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                elevation={0}
                            >
                                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                                    <Box className="stat-icon-wrapper" sx={{ bgcolor: `${stat.color}15`, color: stat.color }}>
                                        {stat.icon}
                                    </Box>
                                    <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>
                                        <CountUp end={stat.count} duration={2.5} />
                                        {stat.suffix}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 1 }}>
                                        {stat.title}
                                    </Typography>
                                </CardContent>
                            </MotionCard>
                        </Grid>
                    ))}
                </Grid>
            </Container >

            {/* Features Section */}
            < Box className="features-section" >
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: 2 }}>
                            WHY CHOOSE US
                        </Typography>
                        <Typography variant="h2" sx={{ fontWeight: 800, mt: 1 }}>
                            Experience the Premium Difference
                        </Typography>
                    </Box>

                    <Grid container spacing={4}>
                        {features.map((feature, index) => (
                            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                                <MotionCard
                                    className="feature-card"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    elevation={0}
                                    sx={{ height: '100%', borderRadius: '24px', bgcolor: 'transparent' }}
                                >
                                    <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                        <Box className="feature-icon-box">
                                            {feature.icon}
                                        </Box>
                                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mt: 2 }}>
                                            {feature.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                            {feature.description}
                                        </Typography>
                                    </CardContent>
                                </MotionCard>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box >

            {/* Services Showcase */}
            < Box className="services-showcase" >
                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 6 }}>
                        <Box>
                            <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: 2 }}>
                                OUR MENU
                            </Typography>
                            <Typography variant="h2" sx={{ fontWeight: 800, mt: 1 }}>
                                Popular Services
                            </Typography>
                        </Box>
                        <Button endIcon={<ArrowForwardIcon />} onClick={() => navigate('/services')} sx={{ display: { xs: 'none', md: 'flex' } }}>
                            View All
                        </Button>
                    </Box>

                    <Grid container spacing={4}>
                        {services.map((service, index) => (
                            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                                <MotionCard
                                    className="service-showcase-card"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    onClick={() => navigate('/salons', { state: { category: service.title } })}
                                    elevation={0}
                                >
                                    <Box
                                        className="service-image-container"
                                        sx={{
                                            backgroundImage: `url(${service.image})`,
                                        }}
                                    >
                                        <Box className="service-overlay">
                                            <Typography variant="h4" color="white">
                                                {service.icon}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <CardContent sx={{ p: 3 }}>
                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                                            {service.title}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Starts from
                                            </Typography>
                                            <Typography variant="h6" color="primary" sx={{ fontWeight: 800 }}>
                                                {service.price}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </MotionCard>
                            </Grid>
                        ))}
                    </Grid>
                    <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', mt: 4 }}>
                        <Button endIcon={<ArrowForwardIcon />} onClick={() => navigate('/services')}>
                            View All Services
                        </Button>
                    </Box>
                </Container>
            </Box >

            {/* How It Works */}
            < Box className="how-it-works" >
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Typography variant="overline" color="white" sx={{ fontWeight: 700, letterSpacing: 2, opacity: 0.8 }}>
                            SIMPLE PROCESS
                        </Typography>
                        <Typography variant="h2" sx={{ fontWeight: 800, mt: 1, color: 'white' }}>
                            How It Works
                        </Typography>
                    </Box>

                    <Grid container spacing={4}>
                        {howItWorks.map((item, index) => (
                            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                                <MotionBox
                                    className="step-card"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Box className="step-number">{item.step}</Box>
                                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mt: 3, color: 'white' }}>
                                        {item.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                                        {item.description}
                                    </Typography>
                                </MotionBox>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box >

            {/* Testimonials */}
            < Box className="testimonials-section" >
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: 2 }}>
                            TESTIMONIALS
                        </Typography>
                        <Typography variant="h2" sx={{ fontWeight: 800, mt: 1 }}>
                            Loved by Clients
                        </Typography>
                    </Box>

                    <Grid container spacing={4}>
                        {testimonials.map((testimonial, index) => (
                            <Grid size={{ xs: 12, md: 4 }} key={index}>
                                <MotionCard
                                    className="testimonial-card"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    elevation={0}
                                >
                                    <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
                                        <Box sx={{ mb: 3 }}>
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <StarIcon key={i} sx={{ color: '#fbbf24', fontSize: 20 }} />
                                            ))}
                                        </Box>
                                        <Typography variant="h6" sx={{ fontStyle: 'italic', fontWeight: 500, lineHeight: 1.6, flexGrow: 1, mb: 3 }}>
                                            "{testimonial.comment}"
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.main', mr: 2, fontWeight: 700 }}>
                                                {testimonial.avatar}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                                    {testimonial.name}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Verified Customer
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </MotionCard>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box >

            {/* CTA Section */}
            < Box className="cta-section" >
                <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
                    <MotionBox
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Box sx={{
                            width: 80,
                            height: 80,
                            bgcolor: 'rgba(255,255,255,0.2)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 3,
                            backdropFilter: 'blur(5px)'
                        }}>
                            <TrophyIcon sx={{ fontSize: 40, color: 'white' }} />
                        </Box>

                        <Typography variant="h2" sx={{ mb: 3, color: 'white', fontWeight: 800, fontSize: { xs: '2rem', md: '3rem' } }}>
                            Ready to Transform Your Look?
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 5, color: 'rgba(255,255,255,0.9)', maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}>
                            Join thousands of satisfied customers who trust StylerApp for their premium grooming needs.
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate(user ? '/salons' : '/login')}
                            sx={{
                                px: 6,
                                py: 2,
                                fontSize: '1.2rem',
                                bgcolor: 'white',
                                color: 'white',
                                fontWeight: 800,
                                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                                '&:hover': {
                                    bgcolor: '#f8fafc',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 15px 40px rgba(0,0,0,0.3)'
                                },
                            }}
                            endIcon={<ArrowForwardIcon />}
                        >
                            {user ? 'Browse Salons' : 'Get Started Now'}
                        </Button>
                    </MotionBox>
                </Container>
            </Box >
        </Box >
    );
};

export default Home;
