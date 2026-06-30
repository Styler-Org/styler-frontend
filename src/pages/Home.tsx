import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    Avatar,
    InputBase,
    Divider,
    IconButton,
    alpha,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import {
    ArrowForward as ArrowForwardIcon,
    LocationOn as LocationOnIcon,
    Star as StarIcon,
    ContentCut as ScissorsIcon,
    CalendarToday as CalendarIcon,
    Schedule as ScheduleIcon,
    Smartphone as SmartphoneIcon,
    AutoAwesome as SparklesIcon,
    EmojiEvents as TrophyIcon,
    Face as FaceIcon,
    Spa as SpaIcon,
    Security as SecurityIcon,
    Search as SearchIcon,
    MyLocation as MyLocationIcon,
    ChevronRight as ChevronRightIcon,
    CheckCircle as CheckCircleIcon,
    FormatQuote as QuoteIcon,
} from '@mui/icons-material';
import { motion, useInView } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useAuthStore } from '../stores/authStore';
import CountUp from 'react-countup';
import { strapiService } from '../services/strapiService';

const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionTypography = motion(Typography);

/* ── Animation Variants ── */
const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show:   { opacity: 1, y: 0,  transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] } },
};

const stagger = (delay = 0.08) => ({
    hidden: {},
    show:   { transition: { staggerChildren: delay } },
});

const scaleIn = {
    hidden: { opacity: 0, scale: 0.94 },
    show:   { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};

const slideLeft = {
    hidden: { opacity: 0, x: -20 },
    show:   { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};

/* ── Category Pills ── */
const categories = [
    { icon: <ScissorsIcon />, label: 'Salons',        path: '/salons',          color: '#6366f1', bg: '#eef2ff' },
    { icon: <FaceIcon />,     label: 'Dermatologists', path: '/dermatologists', color: '#ec4899', bg: '#fdf2f8' },
    { icon: <SpaIcon />,      label: 'Wellness & Spa', path: '/spas',           color: '#10b981', bg: '#ecfdf5' },
    { icon: <SparklesIcon />, label: 'Nails & Lashes', path: '/salons',         color: '#f59e0b', bg: '#fffbeb' },
];

/* ── Stats ── */
const stats = [
    { count: 20,   suffix: '+',  label: 'Branches',         icon: <LocationOnIcon />, color: '#6366f1' },
    { count: 5000, suffix: '+',  label: 'Happy Clients',    icon: <StarIcon />,       color: '#ec4899' },
    { count: 150,  suffix: '+',  label: 'Expert Stylists',  icon: <ScissorsIcon />,   color: '#10b981' },
    { count: 10,   suffix: 'K+', label: 'Appointments',     icon: <CalendarIcon />,   color: '#f59e0b' },
];

/* ── Features ── */
const features = [
    { icon: <CalendarIcon />,   title: 'Instant Booking',    desc: 'Book appointments 24/7 with instant confirmation and zero waiting.', color: '#6366f1' },
    { icon: <ScissorsIcon />,   title: 'Expert Stylists',    desc: 'Certified professionals with years of experience in the latest trends.', color: '#ec4899' },
    { icon: <StarIcon />,       title: 'Top Rated',          desc: 'Consistently rated 4.8+ stars by thousands of satisfied customers.', color: '#10b981' },
    { icon: <SecurityIcon />,   title: 'Safe & Secure',      desc: 'Your bookings and payments are fully protected and encrypted.', color: '#f59e0b' },
];

/* ── How It Works ── */
const howItWorks = [
    { step: '01', title: 'Browse Salons',  desc: 'Find top-rated salons and spas near you using our smart search.' },
    { step: '02', title: 'Choose Service', desc: 'Pick from a curated list of premium beauty and wellness services.' },
    { step: '03', title: 'Book a Slot',    desc: 'Select your preferred time — morning, afternoon, or evening.' },
    { step: '04', title: 'Get Styled',     desc: 'Arrive, relax, and enjoy a world-class grooming experience.' },
];

/* ── Testimonials ── */
const testimonials = [
    { name: 'Rahul Sharma',  rating: 5, comment: 'Absolutely the best salon experience I have had. The staff is incredibly professional and the ambiance is stunning.', avatar: 'R', role: 'Regular Customer' },
    { name: 'Priya Patel',   rating: 5, comment: 'Love the convenience of booking online. My stylist always exceeds expectations. Highly recommend StylerApp!', avatar: 'P', role: 'Verified Buyer' },
    { name: 'Amit Kumar',    rating: 5, comment: 'Premium quality service at very reasonable prices. The app makes it so easy to manage all my appointments.', avatar: 'A', role: 'Loyal Member' },
];

/* ── Services Grid ── */
const serviceCards = [
    { icon: <ScissorsIcon />, title: 'Salons',          price: '₹500',  gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', path: '/salons' },
    { icon: <FaceIcon />,     title: 'Dermatologists',  price: '₹1,500', gradient: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)', path: '/dermatologists' },
    { icon: <SpaIcon />,      title: 'Wellness & Spa',  price: '₹3,000', gradient: 'linear-gradient(135deg, #10b981 0%, #0d9488 100%)', path: '/spas' },
    { icon: <SparklesIcon />, title: 'Nails & Lashes',  price: '₹2,000', gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)', path: '/salons' },
];

const Home: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { user } = useAuth();
    const { isAuthenticated, user: authUser } = useAuthStore();

    const [heroData, setHeroData] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchLocation, setSearchLocation] = useState('');
    const [searchDate, setSearchDate] = useState('');

    useEffect(() => {
        strapiService.getHomePageData().then(data => {
            if (data?.data) setHeroData(data.data.attributes);
        });
    }, []);

    useEffect(() => {
        if (isAuthenticated && authUser) {
            if (authUser.role === 'barber') navigate('/barber/dashboard', { replace: true });
            else if (authUser.role === 'salon_owner') navigate('/salon-owner/dashboard', { replace: true });
        }
    }, [isAuthenticated, authUser, navigate]);

    const handleSearch = () => {
        navigate('/salons', { state: { query: searchQuery, location: searchLocation, date: searchDate } });
    };

    return (
        <Box sx={{ bgcolor: '#f8fafc', overflowX: 'hidden' }}>

            {/* ═══════════════════════════════════
                HERO
            ═══════════════════════════════════ */}
            <Box
                sx={{
                    minHeight: '92vh',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    background: 'url(/images/hero-salon.png) center/cover no-repeat',
                    overflow: 'hidden',
                    pt: { xs: 10, md: 0 },
                    pb: 10,
                }}
            >
                {/* Dark gradient overlay */}
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to right, rgba(8, 8, 20, 0.92) 0%, rgba(8, 8, 20, 0.7) 50%, rgba(8, 8, 20, 0.5) 100%)',
                    }}
                />

                {/* Purple accent glow */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: '20%',
                        right: '8%',
                        width: '40vw',
                        height: '40vw',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: '10%',
                        left: '5%',
                        width: '30vw',
                        height: '30vw',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.12) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }}
                />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
                    <MotionBox
                        variants={stagger(0.1)}
                        initial="hidden"
                        animate="show"
                        sx={{ maxWidth: { xs: '100%', md: '75%', lg: '65%' } }}
                    >
                        {/* Badge */}
                        <MotionBox variants={fadeUp}>
                            <Box
                                sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 0.8,
                                    px: 2,
                                    py: 0.8,
                                    borderRadius: '50px',
                                    background: 'rgba(255,255,255,0.1)',
                                    backdropFilter: 'blur(12px)',
                                    border: '1px solid rgba(255,255,255,0.18)',
                                    mb: 3,
                                }}
                            >
                                <StarIcon sx={{ color: '#fbbf24', fontSize: 14 }} />
                                <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                                    {heroData?.badgeText || '#1 Rated Beauty & Grooming Platform'}
                                </Typography>
                            </Box>
                        </MotionBox>

                        {/* Heading */}
                        <MotionTypography
                            variants={fadeUp}
                            variant="h1"
                            sx={{
                                color: '#fff',
                                mb: 3,
                                textShadow: '0 4px 40px rgba(0,0,0,0.4)',
                                fontFamily: '"Outfit", sans-serif',
                            }}
                        >
                            {heroData?.heroTitle
                                ? <span dangerouslySetInnerHTML={{ __html: heroData.heroTitle }} />
                                : (
                                    <>
                                        Premium Salons,{' '}
                                        <Box component="span" sx={{ background: 'linear-gradient(135deg, #a5b4fc 0%, #f9a8d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                                            Beauty & Wellness
                                        </Box>
                                    </>
                                )
                            }
                        </MotionTypography>

                        {/* Subtitle */}
                        <MotionTypography
                            variants={fadeUp}
                            variant="h5"
                            sx={{ color: 'rgba(255,255,255,0.8)', mb: 5, maxWidth: 580, fontWeight: 400, lineHeight: 1.7, fontSize: { xs: '1rem', md: '1.2rem' } }}
                        >
                            {heroData?.heroSubtitle || 'Book appointments with the city\'s finest salons. Pay at the salon, and unlock exclusive wallet discounts.'}
                        </MotionTypography>

                        {/* Search Bar */}
                        <MotionBox variants={scaleIn}>
                            <Box
                                component="form"
                                onSubmit={e => { e.preventDefault(); handleSearch(); }}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    bgcolor: 'white',
                                    borderRadius: '16px',
                                    boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
                                    overflow: 'hidden',
                                    flexDirection: { xs: 'column', md: 'row' },
                                    border: '1px solid rgba(255,255,255,0.4)',
                                    maxWidth: 840,
                                }}
                            >
                                {/* Service input */}
                                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, px: 2, py: { xs: 1.5, md: 0 }, width: '100%', borderBottom: { xs: '1px solid #f1f5f9', md: 'none' } }}>
                                    <SearchIcon sx={{ color: '#94a3b8', mr: 1.5, flexShrink: 0 }} />
                                    <InputBase
                                        placeholder="Any treatment or venue..."
                                        fullWidth
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        sx={{ fontSize: '0.95rem', color: '#0f172a', '& input::placeholder': { color: '#94a3b8' } }}
                                    />
                                </Box>

                                <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' }, borderColor: '#f1f5f9' }} />

                                {/* Location input */}
                                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, px: 2, py: { xs: 1.5, md: 0 }, width: '100%', borderBottom: { xs: '1px solid #f1f5f9', md: 'none' } }}>
                                    <LocationOnIcon sx={{ color: '#94a3b8', mr: 1.5, flexShrink: 0 }} />
                                    <InputBase
                                        placeholder="Your location"
                                        fullWidth
                                        value={searchLocation}
                                        onChange={e => setSearchLocation(e.target.value)}
                                        sx={{ fontSize: '0.95rem', color: '#0f172a', '& input::placeholder': { color: '#94a3b8' } }}
                                    />
                                    <IconButton size="small" sx={{ ml: 0.5, color: '#6366f1', borderRadius: '8px', '&:hover': { bgcolor: alpha('#6366f1', 0.08), transform: 'none' } }}>
                                        <MyLocationIcon sx={{ fontSize: 18 }} />
                                    </IconButton>
                                </Box>

                                {/* Search button */}
                                <Box sx={{ p: { xs: 1.5, md: 1 }, width: { xs: '100%', md: 'auto' }, flexShrink: 0 }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        sx={{
                                            width: { xs: '100%', md: 'auto' },
                                            px: 4,
                                            py: 1.4,
                                            borderRadius: '12px',
                                            fontWeight: 700,
                                            fontSize: '0.95rem',
                                            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #5558e8 0%, #4338ca 100%)',
                                                boxShadow: '0 6px 20px rgba(99, 102, 241, 0.55)',
                                                transform: 'translateY(-1px)',
                                            },
                                        }}
                                        endIcon={<SearchIcon />}
                                    >
                                        Search
                                    </Button>
                                </Box>
                            </Box>
                        </MotionBox>

                        {/* Quick category pills */}
                        <MotionBox variants={fadeUp} sx={{ mt: 4, display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                            {categories.map((cat) => (
                                <Box
                                    key={cat.label}
                                    component={Link}
                                    to={cat.path}
                                    sx={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 0.75,
                                        px: 1.75,
                                        py: 0.8,
                                        borderRadius: '50px',
                                        background: 'rgba(255,255,255,0.1)',
                                        backdropFilter: 'blur(8px)',
                                        border: '1px solid rgba(255,255,255,0.18)',
                                        color: 'rgba(255,255,255,0.9)',
                                        textDecoration: 'none',
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        '& svg': { fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' },
                                        '&:hover': {
                                            background: 'rgba(255,255,255,0.18)',
                                            transform: 'translateY(-2px)',
                                        },
                                    }}
                                >
                                    {cat.icon}
                                    {cat.label}
                                </Box>
                            ))}
                        </MotionBox>
                    </MotionBox>
                </Container>
            </Box>

            {/* ═══════════════════════════════════
                STATS STRIP
            ═══════════════════════════════════ */}
            <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #f1f5f9' }}>
                <Container maxWidth="lg">
                    <Grid container>
                        {stats.map((stat, i) => (
                            <Grid size={{ xs: 6, md: 3 }} key={i}>
                                <MotionBox
                                    variants={fadeUp}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.08 }}
                                    sx={{
                                        py: { xs: 4, md: 5 },
                                        px: 2,
                                        textAlign: 'center',
                                        borderRight: i < 3 ? '1px solid #f1f5f9' : 'none',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 52,
                                            height: 52,
                                            borderRadius: '14px',
                                            bgcolor: alpha(stat.color, 0.1),
                                            color: stat.color,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mx: 'auto',
                                            mb: 2,
                                            '& svg': { fontSize: '1.4rem' },
                                        }}
                                    >
                                        {stat.icon}
                                    </Box>
                                    <Typography
                                        variant="h3"
                                        sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5, fontFamily: '"Outfit", sans-serif', fontSize: { xs: '1.8rem', md: '2.25rem' } }}
                                    >
                                        <CountUp end={stat.count} duration={2.5} enableScrollSpy scrollSpyOnce />
                                        {stat.suffix}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.72rem' }}>
                                        {stat.label}
                                    </Typography>
                                </MotionBox>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* ═══════════════════════════════════
                SERVICES SHOWCASE
            ═══════════════════════════════════ */}
            <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#f8fafc' }}>
                <Container maxWidth="lg">
                    {/* Section header */}
                    <MotionBox
                        variants={stagger(0.1)}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        sx={{ textAlign: 'center', mb: 8 }}
                    >
                        <MotionBox variants={fadeUp}>
                            <Typography variant="overline" sx={{ color: '#6366f1', fontWeight: 700, letterSpacing: '0.12em' }}>
                                Our Services
                            </Typography>
                        </MotionBox>
                        <MotionTypography variants={fadeUp} variant="h2" sx={{ mt: 1, fontFamily: '"Outfit", sans-serif', color: '#0f172a' }}>
                            Browse by Category
                        </MotionTypography>
                        <MotionTypography variants={fadeUp} variant="body1" sx={{ mt: 2, color: '#64748b', maxWidth: 480, mx: 'auto' }}>
                            Discover top-rated salons, spas, and wellness centres near you.
                        </MotionTypography>
                    </MotionBox>

                    <Grid container spacing={3}>
                        {serviceCards.map((svc, i) => (
                            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                                <MotionBox
                                    variants={scaleIn}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ y: -6 }}
                                >
                                    <Box
                                        onClick={() => navigate(svc.path)}
                                        sx={{
                                            borderRadius: '20px',
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            bgcolor: 'white',
                                            border: '1px solid #f1f5f9',
                                            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                boxShadow: '0 16px 40px rgba(0,0,0,0.1)',
                                                borderColor: '#e0e7ff',
                                            },
                                        }}
                                    >
                                        {/* Visual area */}
                                        <Box
                                            sx={{
                                                height: 180,
                                                background: svc.gradient,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                position: 'relative',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            {/* Decorative circles */}
                                            <Box sx={{ position: 'absolute', width: 120, height: 120, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.08)', top: -20, right: -20 }} />
                                            <Box sx={{ position: 'absolute', width: 80, height: 80, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.06)', bottom: -10, left: -10 }} />
                                            <Box sx={{ position: 'relative', color: 'white', '& svg': { fontSize: '3.5rem', opacity: 0.95 } }}>
                                                {svc.icon}
                                            </Box>
                                        </Box>

                                        {/* Info */}
                                        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Box>
                                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.3 }}>
                                                    {svc.title}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 500 }}>
                                                    Starts from <Box component="span" sx={{ fontWeight: 700, color: '#6366f1' }}>{svc.price}</Box>
                                                </Typography>
                                            </Box>
                                            <Box
                                                sx={{
                                                    width: 36,
                                                    height: 36,
                                                    borderRadius: '10px',
                                                    background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0,
                                                }}
                                            >
                                                <ArrowForwardIcon sx={{ color: 'white', fontSize: 16 }} />
                                            </Box>
                                        </Box>
                                    </Box>
                                </MotionBox>
                            </Grid>
                        ))}
                    </Grid>

                    <Box sx={{ textAlign: 'center', mt: 6 }}>
                        <Button
                            variant="outlined"
                            endIcon={<ArrowForwardIcon />}
                            onClick={() => navigate('/services')}
                            sx={{
                                px: 4, py: 1.3, borderRadius: '12px', fontWeight: 700,
                                borderColor: '#e2e8f0', color: '#475569',
                                '&:hover': { borderColor: '#6366f1', color: '#6366f1', bgcolor: alpha('#6366f1', 0.04) },
                            }}
                        >
                            View All Services
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* ═══════════════════════════════════
                WHY CHOOSE US
            ═══════════════════════════════════ */}
            <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'white' }}>
                <Container maxWidth="lg">
                    <Grid container spacing={{ xs: 6, md: 10 }} alignItems="center">
                        {/* Left: text */}
                        <Grid size={{ xs: 12, md: 5 }}>
                            <MotionBox
                                variants={stagger(0.1)}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true }}
                            >
                                <MotionBox variants={fadeUp}>
                                    <Typography variant="overline" sx={{ color: '#6366f1', fontWeight: 700, letterSpacing: '0.12em' }}>
                                        Why Choose Us
                                    </Typography>
                                </MotionBox>
                                <MotionTypography variants={fadeUp} variant="h2" sx={{ mt: 1, fontFamily: '"Outfit", sans-serif', color: '#0f172a', mb: 2 }}>
                                    Experience the Premium Difference
                                </MotionTypography>
                                <MotionTypography variants={fadeUp} variant="body1" sx={{ color: '#64748b', mb: 5, lineHeight: 1.8 }}>
                                    We partner exclusively with verified, top-rated salons and wellness centres to ensure every visit exceeds your expectations.
                                </MotionTypography>
                                <MotionBox variants={fadeUp}>
                                    <Button
                                        variant="contained"
                                        endIcon={<ArrowForwardIcon />}
                                        onClick={() => navigate(user ? '/salons' : '/login')}
                                        sx={{ borderRadius: '12px', px: 3, py: 1.3, fontWeight: 700 }}
                                    >
                                        Book Your Session
                                    </Button>
                                </MotionBox>
                            </MotionBox>
                        </Grid>

                        {/* Right: feature cards */}
                        <Grid size={{ xs: 12, md: 7 }}>
                            <Grid container spacing={2}>
                                {features.map((f, i) => (
                                    <Grid size={{ xs: 12, sm: 6 }} key={i}>
                                        <MotionBox
                                            variants={scaleIn}
                                            initial="hidden"
                                            whileInView="show"
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.1 }}
                                            whileHover={{ y: -4 }}
                                        >
                                            <Box
                                                sx={{
                                                    p: 3,
                                                    borderRadius: '20px',
                                                    bgcolor: '#f8fafc',
                                                    border: '1px solid #f1f5f9',
                                                    transition: 'all 0.25s ease',
                                                    '&:hover': {
                                                        bgcolor: 'white',
                                                        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                                                        borderColor: alpha(f.color, 0.3),
                                                    },
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: 48,
                                                        height: 48,
                                                        borderRadius: '14px',
                                                        bgcolor: alpha(f.color, 0.1),
                                                        color: f.color,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        mb: 2,
                                                        '& svg': { fontSize: '1.4rem' },
                                                    }}
                                                >
                                                    {f.icon}
                                                </Box>
                                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.75, fontSize: '1rem' }}>
                                                    {f.title}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.65 }}>
                                                    {f.desc}
                                                </Typography>
                                            </Box>
                                        </MotionBox>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* ═══════════════════════════════════
                HOW IT WORKS
            ═══════════════════════════════════ */}
            <Box
                sx={{
                    py: { xs: 8, md: 14 },
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Grid pattern */}
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                        backgroundSize: '48px 48px',
                        maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 75%)',
                        WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 75%)',
                    }}
                />
                {/* Glow */}
                <Box sx={{ position: 'absolute', top: '20%', left: '20%', width: '60%', height: '60%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
                    <MotionBox
                        variants={stagger(0.1)}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        sx={{ textAlign: 'center', mb: 10 }}
                    >
                        <MotionBox variants={fadeUp}>
                            <Typography variant="overline" sx={{ color: 'rgba(165,180,252,0.8)', fontWeight: 700, letterSpacing: '0.12em' }}>
                                Simple Process
                            </Typography>
                        </MotionBox>
                        <MotionTypography variants={fadeUp} variant="h2" sx={{ color: '#fff', mt: 1, fontFamily: '"Outfit", sans-serif' }}>
                            How It Works
                        </MotionTypography>
                    </MotionBox>

                    <Grid container spacing={3}>
                        {howItWorks.map((step, i) => (
                            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                                <MotionBox
                                    variants={fadeUp}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ y: -6 }}
                                    sx={{
                                        p: 3.5,
                                        borderRadius: '24px',
                                        background: 'rgba(255,255,255,0.04)',
                                        backdropFilter: 'blur(16px)',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        textAlign: 'center',
                                        position: 'relative',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            background: 'rgba(255,255,255,0.07)',
                                            border: '1px solid rgba(99,102,241,0.3)',
                                        },
                                    }}
                                >
                                    {/* Step number */}
                                    <Box
                                        sx={{
                                            width: 64,
                                            height: 64,
                                            borderRadius: '20px',
                                            background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(236,72,153,0.2) 100%)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mx: 'auto',
                                            mb: 3,
                                            backdropFilter: 'blur(8px)',
                                        }}
                                    >
                                        <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, fontSize: '1.4rem', color: 'white', letterSpacing: '-0.02em' }}>
                                            {step.step}
                                        </Typography>
                                    </Box>

                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff', mb: 1, fontFamily: '"Outfit", sans-serif' }}>
                                        {step.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
                                        {step.desc}
                                    </Typography>

                                    {/* Arrow connector */}
                                    {i < 3 && !isMobile && (
                                        <ChevronRightIcon sx={{ position: 'absolute', right: -18, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)', fontSize: 32, display: { xs: 'none', md: 'block' } }} />
                                    )}
                                </MotionBox>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* ═══════════════════════════════════
                TESTIMONIALS
            ═══════════════════════════════════ */}
            <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#f8fafc' }}>
                <Container maxWidth="lg">
                    <MotionBox
                        variants={stagger(0.1)}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        sx={{ textAlign: 'center', mb: 8 }}
                    >
                        <MotionBox variants={fadeUp}>
                            <Typography variant="overline" sx={{ color: '#6366f1', fontWeight: 700, letterSpacing: '0.12em' }}>
                                Testimonials
                            </Typography>
                        </MotionBox>
                        <MotionTypography variants={fadeUp} variant="h2" sx={{ mt: 1, fontFamily: '"Outfit", sans-serif', color: '#0f172a' }}>
                            Loved by Our Clients
                        </MotionTypography>
                    </MotionBox>

                    <Grid container spacing={3}>
                        {testimonials.map((t, i) => (
                            <Grid size={{ xs: 12, md: 4 }} key={i}>
                                <MotionBox
                                    variants={fadeUp}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ y: -5 }}
                                >
                                    <Box
                                        sx={{
                                            p: 3.5,
                                            borderRadius: '24px',
                                            bgcolor: 'white',
                                            border: '1px solid #f1f5f9',
                                            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                boxShadow: '0 16px 40px rgba(0,0,0,0.08)',
                                                borderColor: alpha('#6366f1', 0.2),
                                            },
                                        }}
                                    >
                                        {/* Stars */}
                                        <Box sx={{ display: 'flex', gap: 0.3, mb: 2.5 }}>
                                            {[...Array(t.rating)].map((_, si) => (
                                                <StarIcon key={si} sx={{ color: '#fbbf24', fontSize: 18 }} />
                                            ))}
                                        </Box>

                                        {/* Quote icon */}
                                        <QuoteIcon sx={{ color: '#e0e7ff', fontSize: 36, mb: 1 }} />

                                        <Typography variant="body1" sx={{ color: '#334155', lineHeight: 1.75, fontStyle: 'italic', flexGrow: 1, mb: 3, fontSize: '0.95rem' }}>
                                            "{t.comment}"
                                        </Typography>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Avatar sx={{ width: 44, height: 44, background: 'linear-gradient(135deg, #6366f1, #ec4899)', fontWeight: 800, fontSize: '1rem' }}>
                                                {t.avatar}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                                                    {t.name}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 500 }}>
                                                    {t.role}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </MotionBox>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* ═══════════════════════════════════
                CTA SECTION
            ═══════════════════════════════════ */}
            <Box
                sx={{
                    py: { xs: 10, md: 16 },
                    position: 'relative',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
                }}
            >
                {/* Animated gradient orbs */}
                <Box sx={{ position: 'absolute', top: '-20%', left: '-10%', width: '50%', height: '150%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 60%)', pointerEvents: 'none' }} />
                <Box sx={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '50%', height: '150%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 60%)', pointerEvents: 'none' }} />

                {/* Grid pattern */}
                <Box sx={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '60px 60px', maskImage: 'radial-gradient(circle at center, black 30%, transparent 70%)', WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 70%)' }} />

                <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                    <MotionBox
                        initial={{ opacity: 0, scale: 0.92 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                        {/* Icon */}
                        <Box
                            sx={{
                                width: 72,
                                height: 72,
                                borderRadius: '22px',
                                background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(236,72,153,0.2) 100%)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mx: 'auto',
                                mb: 4,
                                backdropFilter: 'blur(8px)',
                            }}
                        >
                            <TrophyIcon sx={{ fontSize: 36, color: '#fbbf24' }} />
                        </Box>

                        <Typography
                            variant="h2"
                            sx={{ color: 'white', mb: 2.5, fontFamily: '"Outfit", sans-serif', fontWeight: 800, fontSize: { xs: '1.8rem', md: '2.8rem' } }}
                        >
                            Ready to Transform Your Look?
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{ color: 'rgba(255,255,255,0.7)', mb: 6, maxWidth: 520, mx: 'auto', lineHeight: 1.7, fontWeight: 400, fontSize: { xs: '1rem', md: '1.1rem' } }}
                        >
                            Join thousands of satisfied customers who trust StylerApp for their premium grooming and wellness needs.
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => navigate(user ? '/salons' : '/login')}
                                endIcon={<ArrowForwardIcon />}
                                sx={{
                                    px: 5,
                                    py: 1.8,
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    borderRadius: '14px',
                                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                    boxShadow: '0 8px 32px rgba(99, 102, 241, 0.4)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #5558e8 0%, #4338ca 100%)',
                                        boxShadow: '0 12px 40px rgba(99, 102, 241, 0.55)',
                                        transform: 'translateY(-2px)',
                                    },
                                }}
                            >
                                {user ? 'Browse Salons' : 'Get Started Free'}
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                onClick={() => navigate('/services')}
                                sx={{
                                    px: 5,
                                    py: 1.8,
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    borderRadius: '14px',
                                    borderColor: 'rgba(255,255,255,0.25)',
                                    color: 'white',
                                    backdropFilter: 'blur(8px)',
                                    '&:hover': {
                                        borderColor: 'rgba(255,255,255,0.5)',
                                        bgcolor: 'rgba(255,255,255,0.08)',
                                        transform: 'translateY(-2px)',
                                    },
                                }}
                            >
                                Explore Services
                            </Button>
                        </Box>
                    </MotionBox>
                </Container>
            </Box>

        </Box>
    );
};

export default Home;
