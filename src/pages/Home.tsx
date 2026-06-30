import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Box, Container, Typography, Button, Grid, Avatar,
    InputBase, Divider, IconButton, alpha, useMediaQuery, useTheme, Chip,
} from '@mui/material';
import {
    Search as SearchIcon,
    LocationOn as LocationOnIcon,
    Star as StarIcon,
    ContentCut as ScissorsIcon,
    CalendarToday as CalendarIcon,
    ArrowForward as ArrowForwardIcon,
    AutoAwesome as SparklesIcon,
    Face as FaceIcon,
    Spa as SpaIcon,
    Shield as ShieldIcon,
    CheckCircle as CheckIcon,
    MyLocation as MyLocationIcon,
    Public as GlobeIcon,
    TrendingUp as TrendingIcon,
    Groups as GroupsIcon,
    KeyboardArrowRight as ArrowRightIcon,
} from '@mui/icons-material';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useAuthStore } from '../stores/authStore';
import CountUp from 'react-countup';
import { strapiService } from '../services/strapiService';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

const ease = [0.25, 0.1, 0.25, 1] as any;

const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};
const stagger = (d = 0.09) => ({ hidden: {}, show: { transition: { staggerChildren: d } } });
const scaleIn = {
    hidden: { opacity: 0, scale: 0.93 },
    show:   { opacity: 1, scale: 1, transition: { duration: 0.5, ease } },
};

/* ─── DATA ─── */
const categories = [
    {
        label: 'Salons & Barbershops',
        sub: 'Haircuts, color, styling & more',
        path: '/salons',
        image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=900&q=85',
        gradient: 'linear-gradient(180deg, rgba(10,5,30,0) 30%, rgba(10,5,30,0.92) 100%)',
        badge: 'Most Popular',
        color: '#818cf8',
    },
    {
        label: 'Skin & Dermatology',
        sub: 'Facials, peels, laser & derma consults',
        path: '/salons?category=Dermatologists',
        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=900&q=85',
        gradient: 'linear-gradient(180deg, rgba(10,5,30,0) 30%, rgba(10,5,30,0.92) 100%)',
        badge: 'Trending',
        color: '#f9a8d4',
    },
    {
        label: 'Wellness & Spa',
        sub: 'Massage, body wraps & holistic care',
        path: '/salons?category=Wellness+%26+Spa',
        image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=900&q=85',
        gradient: 'linear-gradient(180deg, rgba(10,5,30,0) 30%, rgba(10,5,30,0.92) 100%)',
        badge: 'Relaxation',
        color: '#6ee7b7',
    },
    {
        label: 'Nails & Lashes',
        sub: 'Manicures, nail art, lash extensions',
        path: '/salons?category=Nails+%26+Lashes',
        image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=900&q=85',
        gradient: 'linear-gradient(180deg, rgba(10,5,30,0) 30%, rgba(10,5,30,0.92) 100%)',
        badge: 'Trending',
        color: '#fde68a',
    },
];

const stats = [
    { count: 500,  suffix: '+',  label: 'Cities Worldwide',    icon: <GlobeIcon />,    color: '#818cf8' },
    { count: 50,   suffix: 'K+', label: 'Verified Venues',     icon: <CheckIcon />,    color: '#f9a8d4' },
    { count: 1,    suffix: 'M+', label: 'Appointments Booked', icon: <CalendarIcon />, color: '#6ee7b7' },
    { count: 4.9,  suffix: '★',  label: 'Average Rating',      icon: <StarIcon />,     color: '#fde68a' },
];

const cities = [
    { name: 'Dubai',     img: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=400&q=75' },
    { name: 'Mumbai',    img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&q=75' },
    { name: 'London',    img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&q=75' },
    { name: 'New York',  img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&q=75' },
    { name: 'Singapore', img: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&q=75' },
    { name: 'Paris',     img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=75' },
    { name: 'Sydney',    img: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&q=75' },
    { name: 'Toronto',   img: 'https://images.unsplash.com/photo-1517090504586-fde19ea6066f?w=400&q=75' },
];

const howItWorks = [
    { step: '01', icon: <SearchIcon />,  title: 'Discover',      desc: 'Browse thousands of verified salons, spas, and wellness venues worldwide.' },
    { step: '02', icon: <ScissorsIcon />, title: 'Choose',       desc: 'Pick your service, preferred professional, and perfect time slot.' },
    { step: '03', icon: <CalendarIcon />, title: 'Book Instantly', desc: 'Confirm your appointment with zero upfront payment required.' },
    { step: '04', icon: <SparklesIcon />, title: 'Glow Up',      desc: 'Arrive, relax, and enjoy a world-class beauty experience.' },
];

const features = [
    { icon: <GlobeIcon />,    color: '#818cf8', title: 'Global Network',    desc: 'Access 50,000+ venues in 500+ cities across 60+ countries.' },
    { icon: <ShieldIcon />,   color: '#6ee7b7', title: 'Verified Quality',  desc: 'Every venue is vetted and continuously rated by real customers.' },
    { icon: <CalendarIcon />, color: '#f9a8d4', title: 'Instant Booking',   desc: 'Real-time availability. Confirm in seconds, 24/7.' },
    { icon: <TrendingIcon />, color: '#fde68a', title: 'No Prepayment',     desc: 'Book for free and pay directly at the venue after your service.' },
    { icon: <GroupsIcon />,   color: '#86efac', title: 'Expert Stylists',   desc: 'Certified professionals with proven track records and reviews.' },
    { icon: <SparklesIcon />, color: '#fca5a5', title: 'Premium Services',  desc: 'From budget-friendly to ultra-luxury — every taste, every budget.' },
];

const testimonials = [
    { name: 'Priya Mehra',      city: 'Mumbai, India',       rating: 5, comment: 'Found the most incredible blow-dry bar five minutes from my hotel. This app is a traveller\'s best friend!', avatar: 'P' },
    { name: 'James Carter',     city: 'London, UK',          rating: 5, comment: 'Used Styler in four countries this year. The consistency and quality of bookings is unmatched.', avatar: 'J' },
    { name: 'Sofia Al-Rashidi', city: 'Dubai, UAE',          rating: 5, comment: 'I book my weekly spa sessions through Styler. Zero hassle, always perfect. Truly world-class service.', avatar: 'S' },
    { name: 'Lucas Fontaine',   city: 'Paris, France',       rating: 5, comment: 'From the UI to the actual salon experience — everything about Styler is premium. Love it.', avatar: 'L' },
    { name: 'Aisha Okafor',     city: 'Toronto, Canada',     rating: 5, comment: 'Switched from another app and never looked back. The selection and booking experience is just better.', avatar: 'A' },
    { name: 'Ravi Krishnan',    city: 'Singapore',           rating: 5, comment: 'My entire team uses Styler for corporate grooming packages. Customer support is exceptional too.', avatar: 'R' },
];

/* ─── COMPONENT ─── */
const Home: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isMd = useMediaQuery(theme.breakpoints.down('md'));
    const { user } = useAuth();
    const { isAuthenticated, user: authUser } = useAuthStore();

    const [heroData, setHeroData] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchCity, setSearchCity] = useState('');

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
        navigate('/salons', { state: { query: searchQuery, location: searchCity } });
    };

    return (
        <Box sx={{ bgcolor: '#fafafa', overflowX: 'hidden' }}>

            {/* ══════════════════════════════════════════════
                HERO — Full-screen premium image + search
            ══════════════════════════════════════════════ */}
            <Box
                sx={{
                    minHeight: '100vh',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    overflow: 'hidden',
                    pt: { xs: 10, md: 0 },
                    pb: { xs: 8, md: 0 },
                }}
            >
                {/* Background image */}
                <Box sx={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'url(https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&q=90)',
                    backgroundSize: 'cover', backgroundPosition: 'center 30%',
                    transform: 'scale(1.04)',
                    transition: 'transform 8s ease',
                }} />

                {/* Rich dark overlay — deeper on left, lighter right */}
                <Box sx={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(105deg, rgba(4,0,20,0.96) 0%, rgba(4,0,20,0.82) 40%, rgba(4,0,20,0.5) 70%, rgba(4,0,20,0.35) 100%)',
                }} />

                {/* Ambient glow blobs */}
                <Box sx={{ position: 'absolute', top: '10%', right: '12%', width: '38vw', height: '38vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 68%)', pointerEvents: 'none' }} />
                <Box sx={{ position: 'absolute', bottom: '8%', left: '3%', width: '28vw', height: '28vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.14) 0%, transparent 68%)', pointerEvents: 'none' }} />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
                    <MotionBox variants={stagger(0.1)} initial="hidden" animate="show" sx={{ maxWidth: { xs: '100%', md: '72%', lg: '60%' } }}>

                        {/* Trust badge */}
                        <MotionBox variants={fadeUp}>
                            <Box sx={{
                                display: 'inline-flex', alignItems: 'center', gap: 1, mb: 3.5,
                                px: 2, py: 0.85, borderRadius: '50px',
                                background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)',
                                border: '1px solid rgba(255,255,255,0.14)',
                            }}>
                                <GlobeIcon sx={{ fontSize: 13, color: '#a5b4fc' }} />
                                <Typography sx={{ color: 'rgba(255,255,255,0.88)', fontSize: '0.71rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                    {heroData?.badgeText || 'Available in 500+ Cities Worldwide'}
                                </Typography>
                            </Box>
                        </MotionBox>

                        {/* Headline */}
                        <MotionTypography
                            variants={fadeUp}
                            sx={{
                                color: '#fff', mb: 3, lineHeight: 1.08,
                                fontFamily: '"Outfit", sans-serif',
                                fontWeight: 800,
                                fontSize: { xs: '2.4rem', sm: '3rem', md: '3.8rem', lg: '4.5rem' },
                                letterSpacing: '-0.03em',
                                textShadow: '0 4px 48px rgba(0,0,0,0.5)',
                            }}
                        >
                            {heroData?.heroTitle
                                ? <span dangerouslySetInnerHTML={{ __html: heroData.heroTitle }} />
                                : (
                                    <>
                                        Your Perfect Look,{' '}
                                        <Box component="span" sx={{
                                            background: 'linear-gradient(110deg, #c4b5fd 0%, #f0abfc 50%, #fda4af 100%)',
                                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                        }}>
                                            Anywhere.
                                        </Box>
                                    </>
                                )
                            }
                        </MotionTypography>

                        {/* Subtext */}
                        <MotionTypography
                            variants={fadeUp}
                            sx={{ color: 'rgba(255,255,255,0.72)', mb: 5.5, maxWidth: 560, lineHeight: 1.75, fontSize: { xs: '1rem', md: '1.15rem' }, fontWeight: 400 }}
                        >
                            {heroData?.heroSubtitle || 'Book top-rated salons, spas, dermatologists, and wellness experiences in minutes. Zero prepayment. Pure luxury.'}
                        </MotionTypography>

                        {/* Search widget */}
                        <MotionBox variants={scaleIn}>
                            <Box
                                component="form"
                                onSubmit={e => { e.preventDefault(); handleSearch(); }}
                                sx={{
                                    display: 'flex', flexDirection: { xs: 'column', sm: 'row' },
                                    bgcolor: 'white', borderRadius: '18px',
                                    boxShadow: '0 24px 64px rgba(0,0,0,0.32)',
                                    overflow: 'hidden', maxWidth: 760,
                                    border: '1px solid rgba(255,255,255,0.15)',
                                }}
                            >
                                {/* Service */}
                                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1.4, px: 2.5, py: { xs: 1.75, sm: 0 }, borderBottom: { xs: '1px solid #f1f5f9', sm: 'none' } }}>
                                    <SearchIcon sx={{ color: '#94a3b8', mr: 1.5, flexShrink: 0, fontSize: '1.15rem' }} />
                                    <Box>
                                        <Typography sx={{ fontSize: '0.67rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase', lineHeight: 1, mb: 0.3 }}>Service</Typography>
                                        <InputBase
                                            placeholder="Haircut, massage, facial..."
                                            fullWidth value={searchQuery}
                                            onChange={e => setSearchQuery(e.target.value)}
                                            sx={{ fontSize: '0.93rem', color: '#0f172a', '& input::placeholder': { color: '#cbd5e1' } }}
                                        />
                                    </Box>
                                </Box>

                                <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' }, borderColor: '#f1f5f9', my: 1.5 }} />

                                {/* City */}
                                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, px: 2.5, py: { xs: 1.75, sm: 0 }, borderBottom: { xs: '1px solid #f1f5f9', sm: 'none' } }}>
                                    <LocationOnIcon sx={{ color: '#94a3b8', mr: 1.5, flexShrink: 0, fontSize: '1.15rem' }} />
                                    <Box sx={{ flex: 1 }}>
                                        <Typography sx={{ fontSize: '0.67rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase', lineHeight: 1, mb: 0.3 }}>City</Typography>
                                        <InputBase
                                            placeholder="Dubai, London, Mumbai..."
                                            fullWidth value={searchCity}
                                            onChange={e => setSearchCity(e.target.value)}
                                            sx={{ fontSize: '0.93rem', color: '#0f172a', '& input::placeholder': { color: '#cbd5e1' } }}
                                        />
                                    </Box>
                                    <IconButton size="small" onClick={() => {}} sx={{ color: '#6366f1', '&:hover': { bgcolor: alpha('#6366f1', 0.08) } }}>
                                        <MyLocationIcon sx={{ fontSize: 17 }} />
                                    </IconButton>
                                </Box>

                                {/* CTA */}
                                <Box sx={{ p: { xs: 1.5, sm: 1 }, flexShrink: 0 }}>
                                    <Button
                                        type="submit" variant="contained" size="large"
                                        endIcon={<SearchIcon />}
                                        sx={{
                                            width: { xs: '100%', sm: 'auto' }, px: 4, py: 1.55, borderRadius: '13px',
                                            fontWeight: 700, fontSize: '0.95rem',
                                            background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)',
                                            boxShadow: '0 6px 20px rgba(99,102,241,0.4)',
                                            '&:hover': { background: 'linear-gradient(135deg, #5558e8 0%, #6d28d9 100%)', boxShadow: '0 10px 30px rgba(99,102,241,0.55)', transform: 'translateY(-1px)' },
                                        }}
                                    >
                                        Search
                                    </Button>
                                </Box>
                            </Box>
                        </MotionBox>

                        {/* Quick pills */}
                        <MotionBox variants={fadeUp} sx={{ mt: 3.5, display: 'flex', gap: 1.25, flexWrap: 'wrap' }}>
                            {[
                                { label: '✂️ Salons', path: '/salons' },
                                { label: '✨ Skin & Derma', path: '/salons?category=Dermatologists' },
                                { label: '🧘 Wellness & Spa', path: '/salons?category=Wellness+%26+Spa' },
                                { label: '💅 Nails & Lashes', path: '/salons?category=Nails+%26+Lashes' },
                            ].map(pill => (
                                <Box
                                    key={pill.label}
                                    component={Link} to={pill.path}
                                    sx={{
                                        display: 'inline-flex', alignItems: 'center', px: 1.75, py: 0.7,
                                        borderRadius: '50px', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600,
                                        background: 'rgba(255,255,255,0.09)', backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,255,255,0.16)', color: 'rgba(255,255,255,0.88)',
                                        transition: 'all 0.2s ease',
                                        '&:hover': { background: 'rgba(255,255,255,0.17)', transform: 'translateY(-2px)' },
                                    }}
                                >
                                    {pill.label}
                                </Box>
                            ))}
                        </MotionBox>
                    </MotionBox>
                </Container>

                {/* Scroll hint */}
                <Box sx={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', zIndex: 2, display: { xs: 'none', md: 'flex' }, flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Scroll to explore</Typography>
                    <MotionBox animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}>
                        <Box sx={{ width: 22, height: 36, borderRadius: '11px', border: '2px solid rgba(255,255,255,0.25)', display: 'flex', justifyContent: 'center', pt: 0.8 }}>
                            <Box sx={{ width: 4, height: 8, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.55)' }} />
                        </Box>
                    </MotionBox>
                </Box>
            </Box>

            {/* ══════════════════════════════════════════════
                STATS STRIP
            ══════════════════════════════════════════════ */}
            <Box sx={{ bgcolor: '#09090b', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <Container maxWidth="lg">
                    <Grid container>
                        {stats.map((stat, i) => (
                            <Grid size={{ xs: 6, md: 3 }} key={i}>
                                <MotionBox
                                    variants={fadeUp} initial="hidden" whileInView="show"
                                    viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                                    sx={{
                                        py: { xs: 4, md: 5 }, px: 2, textAlign: 'center',
                                        borderRight: { xs: i % 2 === 0 ? '1px solid rgba(255,255,255,0.06)' : 'none', md: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none' },
                                        borderBottom: { xs: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none', md: 'none' },
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 1.5, color: stat.color, '& svg': { fontSize: '1.1rem' } }}>
                                        {stat.icon}
                                    </Box>
                                    <Typography sx={{ fontWeight: 800, color: '#fff', lineHeight: 1, fontFamily: '"Outfit", sans-serif', fontSize: { xs: '2rem', md: '2.4rem' } }}>
                                        <CountUp end={stat.count} duration={2.5} decimals={stat.count === 4.9 ? 1 : 0} enableScrollSpy scrollSpyOnce />
                                        {stat.suffix}
                                    </Typography>
                                    <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', mt: 0.75 }}>
                                        {stat.label}
                                    </Typography>
                                </MotionBox>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* ══════════════════════════════════════════════
                CATEGORIES — large image cards
            ══════════════════════════════════════════════ */}
            <Box sx={{ py: { xs: 8, md: 14 }, bgcolor: '#fafafa' }}>
                <Container maxWidth="lg">
                    <MotionBox variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={{ once: true }} sx={{ textAlign: 'center', mb: { xs: 6, md: 10 } }}>
                        <MotionBox variants={fadeUp}>
                            <Typography variant="overline" sx={{ color: '#6366f1', fontWeight: 700, letterSpacing: '0.14em', fontSize: '0.72rem' }}>
                                Explore Services
                            </Typography>
                        </MotionBox>
                        <MotionTypography variants={fadeUp} sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: '#09090b', fontSize: { xs: '1.9rem', md: '2.75rem' }, letterSpacing: '-0.03em', mt: 1 }}>
                            What are you looking for?
                        </MotionTypography>
                        <MotionTypography variants={fadeUp} sx={{ color: '#64748b', mt: 2, maxWidth: 500, mx: 'auto', lineHeight: 1.7 }}>
                            From everyday grooming to luxury wellness — find and book exactly what you need.
                        </MotionTypography>
                    </MotionBox>

                    <Grid container spacing={2.5}>
                        {/* Large left card */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <MotionBox variants={scaleIn} initial="hidden" whileInView="show" viewport={{ once: true }} whileHover={{ y: -5 }}>
                                <Box
                                    onClick={() => navigate(categories[0].path)}
                                    sx={{
                                        height: { xs: 260, md: 380 }, borderRadius: '24px', overflow: 'hidden',
                                        cursor: 'pointer', position: 'relative',
                                        backgroundImage: `url(${categories[0].image})`, backgroundSize: 'cover', backgroundPosition: 'center',
                                        '&:hover .category-overlay': { opacity: 1 },
                                        '&:hover img': { transform: 'scale(1.06)' },
                                    }}
                                >
                                    <Box sx={{ position: 'absolute', inset: 0, background: categories[0].gradient }} />
                                    <Box className="category-overlay" sx={{ position: 'absolute', inset: 0, background: 'rgba(99,102,241,0.15)', opacity: 0, transition: 'opacity 0.3s ease' }} />
                                    <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: { xs: 2.5, md: 3.5 } }}>
                                        <Chip label={categories[0].badge} size="small" sx={{ bgcolor: categories[0].color, color: '#09090b', fontWeight: 700, fontSize: '0.68rem', mb: 1.5, borderRadius: '6px' }} />
                                        <Typography sx={{ color: 'white', fontWeight: 800, fontSize: { xs: '1.3rem', md: '1.7rem' }, fontFamily: '"Outfit", sans-serif', lineHeight: 1.2, mb: 0.5 }}>{categories[0].label}</Typography>
                                        <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.88rem' }}>{categories[0].sub}</Typography>
                                        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, mt: 2, color: 'white', fontWeight: 600, fontSize: '0.85rem' }}>
                                            Browse now <ArrowRightIcon sx={{ fontSize: 18 }} />
                                        </Box>
                                    </Box>
                                </Box>
                            </MotionBox>
                        </Grid>

                        {/* Right column — 3 stacked */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Grid container spacing={2.5} sx={{ height: '100%' }}>
                                {categories.slice(1).map((cat, i) => (
                                    <Grid size={{ xs: 12, sm: 4, md: 12 }} key={i} sx={{ height: { md: `calc(33.33% - 10px)` } }}>
                                        <MotionBox variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ x: 5 }} sx={{ height: '100%' }}>
                                            <Box
                                                onClick={() => navigate(cat.path)}
                                                sx={{
                                                    display: 'flex', alignItems: 'center', gap: 0, height: '100%',
                                                    minHeight: 100, borderRadius: '18px', overflow: 'hidden', cursor: 'pointer',
                                                    transition: 'box-shadow 0.25s ease',
                                                    '&:hover': { boxShadow: '0 8px 28px rgba(0,0,0,0.14)' },
                                                    position: 'relative',
                                                }}
                                            >
                                                <Box sx={{ width: { xs: 120, sm: 100, md: 140 }, height: '100%', minHeight: 100, backgroundImage: `url(${cat.image})`, backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0 }} />
                                                <Box sx={{ background: categories[0].gradient.replace('180deg', '90deg'), position: 'absolute', inset: 0, width: { xs: 120, sm: 100, md: 140 } }} />
                                                <Box sx={{ flex: 1, p: { xs: 2, md: 2.5 }, bgcolor: 'white', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                    <Chip label={cat.badge} size="small" sx={{ bgcolor: alpha(cat.color, 0.15), color: '#475569', fontWeight: 700, fontSize: '0.65rem', mb: 0.75, borderRadius: '6px', alignSelf: 'flex-start' }} />
                                                    <Typography sx={{ fontWeight: 700, color: '#09090b', fontSize: { xs: '0.9rem', md: '0.95rem' }, fontFamily: '"Outfit", sans-serif', lineHeight: 1.3, mb: 0.4 }}>{cat.label}</Typography>
                                                    <Typography sx={{ color: '#64748b', fontSize: '0.78rem', lineHeight: 1.5, display: { xs: 'none', sm: 'block' } }}>{cat.sub}</Typography>
                                                </Box>
                                                <Box sx={{ pr: 2, color: '#94a3b8', flexShrink: 0 }}>
                                                    <ArrowRightIcon />
                                                </Box>
                                            </Box>
                                        </MotionBox>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* ══════════════════════════════════════════════
                CITIES WE SERVE
            ══════════════════════════════════════════════ */}
            <Box sx={{ py: { xs: 8, md: 14 }, bgcolor: '#09090b', overflow: 'hidden' }}>
                <Container maxWidth="lg">
                    <MotionBox variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={{ once: true }} sx={{ mb: { xs: 6, md: 10 } }}>
                        <MotionBox variants={fadeUp}>
                            <Typography variant="overline" sx={{ color: '#818cf8', fontWeight: 700, letterSpacing: '0.14em', fontSize: '0.72rem' }}>
                                Global Coverage
                            </Typography>
                        </MotionBox>
                        <MotionBox variants={fadeUp} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: 1, flexWrap: 'wrap', gap: 3 }}>
                            <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: 'white', fontSize: { xs: '1.9rem', md: '2.75rem' }, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                                Now Available In<br />
                                <Box component="span" sx={{ background: 'linear-gradient(90deg, #c4b5fd, #f0abfc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                    500+ Cities
                                </Box>
                            </Typography>
                            <Button
                                variant="outlined"
                                endIcon={<ArrowForwardIcon />}
                                onClick={() => navigate('/salons')}
                                sx={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)', textTransform: 'none', fontWeight: 600, borderRadius: '12px', '&:hover': { borderColor: '#818cf8', color: '#818cf8' } }}
                            >
                                Browse All Cities
                            </Button>
                        </MotionBox>
                    </MotionBox>

                    <Grid container spacing={2}>
                        {cities.map((city, i) => (
                            <Grid size={{ xs: 6, sm: 3, md: 3 }} key={city.name}>
                                <MotionBox
                                    variants={scaleIn} initial="hidden" whileInView="show"
                                    viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                                    whileHover={{ y: -6, scale: 1.02 }}
                                    onClick={() => navigate('/salons', { state: { location: city.name } })}
                                    sx={{ cursor: 'pointer', borderRadius: '16px', overflow: 'hidden', position: 'relative', aspectRatio: '4/3' }}
                                >
                                    <Box sx={{ position: 'absolute', inset: 0, backgroundImage: `url(${city.img})`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'transform 0.4s ease', '&:hover': { transform: 'scale(1.08)' } }} />
                                    <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%)' }} />
                                    <Box sx={{ position: 'absolute', bottom: 0, left: 0, p: 2 }}>
                                        <Typography sx={{ fontWeight: 700, color: 'white', fontSize: '0.95rem', fontFamily: '"Outfit", sans-serif' }}>{city.name}</Typography>
                                        <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.72rem' }}>Explore →</Typography>
                                    </Box>
                                </MotionBox>
                            </Grid>
                        ))}
                    </Grid>

                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                        <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem' }}>
                            + Many more cities across Asia, Europe, Americas & Middle East
                        </Typography>
                    </Box>
                </Container>
            </Box>

            {/* ══════════════════════════════════════════════
                HOW IT WORKS
            ══════════════════════════════════════════════ */}
            <Box sx={{ py: { xs: 8, md: 14 }, bgcolor: '#fafafa', position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '80%', height: '60%', background: 'radial-gradient(ellipse, rgba(99,102,241,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <MotionBox variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={{ once: true }} sx={{ textAlign: 'center', mb: { xs: 6, md: 10 } }}>
                        <MotionBox variants={fadeUp}>
                            <Typography variant="overline" sx={{ color: '#6366f1', fontWeight: 700, letterSpacing: '0.14em', fontSize: '0.72rem' }}>
                                Simple Process
                            </Typography>
                        </MotionBox>
                        <MotionTypography variants={fadeUp} sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: '#09090b', fontSize: { xs: '1.9rem', md: '2.75rem' }, letterSpacing: '-0.03em', mt: 1 }}>
                            Book in 4 Easy Steps
                        </MotionTypography>
                    </MotionBox>

                    <Grid container spacing={3}>
                        {howItWorks.map((step, i) => (
                            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                                <MotionBox
                                    variants={fadeUp} initial="hidden" whileInView="show"
                                    viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                                    whileHover={{ y: -6 }}
                                    sx={{
                                        p: 3.5, borderRadius: '22px', bgcolor: 'white',
                                        border: '1px solid #f1f5f9', height: '100%',
                                        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': { boxShadow: '0 16px 40px rgba(0,0,0,0.09)', borderColor: alpha('#6366f1', 0.2) },
                                        position: 'relative', overflow: 'hidden',
                                    }}
                                >
                                    {/* Step number background */}
                                    <Typography sx={{
                                        position: 'absolute', top: -12, right: 12,
                                        fontFamily: '"Outfit", sans-serif', fontWeight: 900,
                                        fontSize: '4.5rem', color: '#f8fafc', lineHeight: 1, userSelect: 'none',
                                    }}>{step.step}</Typography>

                                    <Box sx={{ width: 52, height: 52, borderRadius: '16px', bgcolor: alpha('#6366f1', 0.08), color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2.5, position: 'relative', zIndex: 1, '& svg': { fontSize: '1.3rem' } }}>
                                        {step.icon}
                                    </Box>
                                    <Typography sx={{ fontWeight: 700, color: '#09090b', mb: 1, fontFamily: '"Outfit", sans-serif', position: 'relative', zIndex: 1 }}>
                                        {step.title}
                                    </Typography>
                                    <Typography sx={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.7, position: 'relative', zIndex: 1 }}>
                                        {step.desc}
                                    </Typography>
                                </MotionBox>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* ══════════════════════════════════════════════
                WHY STYLER — features grid
            ══════════════════════════════════════════════ */}
            <Box sx={{ py: { xs: 8, md: 14 }, bgcolor: '#09090b' }}>
                <Container maxWidth="lg">
                    <Grid container spacing={{ xs: 6, md: 10 }} alignItems="center">
                        <Grid size={{ xs: 12, md: 5 }}>
                            <MotionBox variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={{ once: true }}>
                                <MotionBox variants={fadeUp}>
                                    <Typography variant="overline" sx={{ color: '#818cf8', fontWeight: 700, letterSpacing: '0.14em', fontSize: '0.72rem' }}>
                                        Why Choose Styler
                                    </Typography>
                                </MotionBox>
                                <MotionTypography variants={fadeUp} sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: 'white', fontSize: { xs: '1.9rem', md: '2.75rem' }, letterSpacing: '-0.03em', mt: 1, mb: 2 }}>
                                    The World's Most Trusted Beauty Platform
                                </MotionTypography>
                                <MotionTypography variants={fadeUp} sx={{ color: 'rgba(255,255,255,0.55)', mb: 5, lineHeight: 1.8, fontSize: '0.95rem' }}>
                                    We partner exclusively with verified, top-rated venues to ensure every visit exceeds your expectations — whether you're at home or halfway across the globe.
                                </MotionTypography>
                                <MotionBox variants={fadeUp}>
                                    <Button
                                        variant="contained" size="large"
                                        endIcon={<ArrowForwardIcon />}
                                        onClick={() => navigate(user ? '/salons' : '/login')}
                                        sx={{ borderRadius: '14px', px: 3.5, py: 1.4, fontWeight: 700, background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)', boxShadow: '0 6px 24px rgba(99,102,241,0.35)' }}
                                    >
                                        Start Exploring
                                    </Button>
                                </MotionBox>
                            </MotionBox>
                        </Grid>

                        <Grid size={{ xs: 12, md: 7 }}>
                            <Grid container spacing={2}>
                                {features.map((f, i) => (
                                    <Grid size={{ xs: 12, sm: 6 }} key={i}>
                                        <MotionBox
                                            variants={scaleIn} initial="hidden" whileInView="show"
                                            viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                                            whileHover={{ y: -4 }}
                                            sx={{
                                                p: 3, borderRadius: '18px',
                                                background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)',
                                                border: '1px solid rgba(255,255,255,0.07)',
                                                transition: 'all 0.25s ease',
                                                '&:hover': { background: 'rgba(255,255,255,0.07)', border: `1px solid ${alpha(f.color, 0.3)}` },
                                            }}
                                        >
                                            <Box sx={{ width: 44, height: 44, borderRadius: '13px', bgcolor: alpha(f.color, 0.12), color: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, '& svg': { fontSize: '1.2rem' } }}>
                                                {f.icon}
                                            </Box>
                                            <Typography sx={{ fontWeight: 700, color: 'white', mb: 0.6, fontSize: '0.95rem', fontFamily: '"Outfit", sans-serif' }}>{f.title}</Typography>
                                            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.83rem', lineHeight: 1.65 }}>{f.desc}</Typography>
                                        </MotionBox>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* ══════════════════════════════════════════════
                TESTIMONIALS
            ══════════════════════════════════════════════ */}
            <Box sx={{ py: { xs: 8, md: 14 }, bgcolor: '#fafafa', overflow: 'hidden' }}>
                <Container maxWidth="lg">
                    <MotionBox variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={{ once: true }} sx={{ textAlign: 'center', mb: { xs: 6, md: 10 } }}>
                        <MotionBox variants={fadeUp}>
                            <Typography variant="overline" sx={{ color: '#6366f1', fontWeight: 700, letterSpacing: '0.14em', fontSize: '0.72rem' }}>
                                Client Stories
                            </Typography>
                        </MotionBox>
                        <MotionTypography variants={fadeUp} sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: '#09090b', fontSize: { xs: '1.9rem', md: '2.75rem' }, letterSpacing: '-0.03em', mt: 1 }}>
                            Loved Across the Globe
                        </MotionTypography>
                    </MotionBox>

                    <Grid container spacing={2.5}>
                        {testimonials.map((t, i) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                                <MotionBox
                                    variants={fadeUp} initial="hidden" whileInView="show"
                                    viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                                    whileHover={{ y: -5 }}
                                    sx={{
                                        p: 3.5, borderRadius: '22px', bgcolor: 'white',
                                        border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                                        height: '100%', display: 'flex', flexDirection: 'column',
                                        transition: 'all 0.3s ease',
                                        '&:hover': { boxShadow: '0 16px 40px rgba(0,0,0,0.09)', borderColor: alpha('#6366f1', 0.15) },
                                    }}
                                >
                                    <Box sx={{ display: 'flex', gap: 0.3, mb: 2 }}>
                                        {[...Array(t.rating)].map((_, si) => <StarIcon key={si} sx={{ color: '#fbbf24', fontSize: 16 }} />)}
                                    </Box>
                                    <Typography sx={{ color: '#334155', lineHeight: 1.75, fontStyle: 'italic', flexGrow: 1, mb: 3, fontSize: '0.93rem' }}>
                                        "{t.comment}"
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Avatar sx={{ width: 40, height: 40, background: 'linear-gradient(135deg, #6366f1, #ec4899)', fontWeight: 800, fontSize: '0.95rem' }}>
                                            {t.avatar}
                                        </Avatar>
                                        <Box>
                                            <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>{t.name}</Typography>
                                            <Typography sx={{ color: '#94a3b8', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <LocationOnIcon sx={{ fontSize: 11 }} /> {t.city}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </MotionBox>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* ══════════════════════════════════════════════
                CTA BANNER
            ══════════════════════════════════════════════ */}
            <Box sx={{
                position: 'relative', overflow: 'hidden',
                backgroundImage: 'url(https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1920&q=90)',
                backgroundSize: 'cover', backgroundPosition: 'center 40%',
            }}>
                <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(4,0,20,0.97) 0%, rgba(4,0,20,0.9) 50%, rgba(4,0,20,0.75) 100%)' }} />
                <Box sx={{ position: 'absolute', top: '20%', right: '8%', width: '40%', height: '80%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 68%)', pointerEvents: 'none' }} />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: { xs: 10, md: 16 } }}>
                    <Grid container spacing={6} alignItems="center">
                        <Grid size={{ xs: 12, md: 7 }}>
                            <MotionBox initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease }}>
                                <Typography variant="overline" sx={{ color: '#c4b5fd', fontWeight: 700, letterSpacing: '0.12em', fontSize: '0.72rem' }}>
                                    Get Started Today
                                </Typography>
                                <Typography sx={{
                                    fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: 'white',
                                    fontSize: { xs: '2rem', md: '3rem' }, letterSpacing: '-0.03em',
                                    lineHeight: 1.1, mt: 1, mb: 2.5,
                                }}>
                                    Your Next Great Look<br />
                                    <Box component="span" sx={{ background: 'linear-gradient(90deg, #c4b5fd, #f0abfc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                        Is One Tap Away.
                                    </Box>
                                </Typography>
                                <Typography sx={{ color: 'rgba(255,255,255,0.6)', mb: 5, lineHeight: 1.75, maxWidth: 520, fontSize: '0.95rem' }}>
                                    Join over 1 million customers who trust Styler for their beauty and wellness needs — from everyday haircuts to luxury spa days.
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                    <Button
                                        variant="contained" size="large"
                                        onClick={() => navigate(user ? '/salons' : '/login')}
                                        endIcon={<ArrowForwardIcon />}
                                        sx={{ px: 4.5, py: 1.7, borderRadius: '14px', fontWeight: 700, background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)', boxShadow: '0 8px 28px rgba(99,102,241,0.4)', fontSize: '1rem', '&:hover': { boxShadow: '0 12px 36px rgba(99,102,241,0.55)', transform: 'translateY(-2px)' } }}
                                    >
                                        {user ? 'Browse Venues' : 'Sign Up Free'}
                                    </Button>
                                    <Button
                                        variant="outlined" size="large"
                                        onClick={() => navigate('/salons')}
                                        sx={{ px: 4.5, py: 1.7, borderRadius: '14px', fontWeight: 700, borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.85)', fontSize: '1rem', backdropFilter: 'blur(8px)', '&:hover': { borderColor: 'rgba(255,255,255,0.4)', bgcolor: 'rgba(255,255,255,0.06)' } }}
                                    >
                                        Explore Services
                                    </Button>
                                </Box>
                            </MotionBox>
                        </Grid>

                        <Grid size={{ xs: 12, md: 5 }}>
                            <MotionBox initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15, ease }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {[
                                        { icon: <CheckIcon />, text: 'No booking fees or hidden charges' },
                                        { icon: <CheckIcon />, text: 'Pay at the venue — zero prepayment' },
                                        { icon: <CheckIcon />, text: 'Cancel or reschedule anytime, free' },
                                        { icon: <CheckIcon />, text: 'Verified venues with real reviews' },
                                        { icon: <CheckIcon />, text: 'Available in 500+ cities worldwide' },
                                    ].map((item, i) => (
                                        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{ width: 28, height: 28, borderRadius: '8px', bgcolor: alpha('#6366f1', 0.2), color: '#a5b4fc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, '& svg': { fontSize: '0.9rem' } }}>
                                                {item.icon}
                                            </Box>
                                            <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.93rem', fontWeight: 500 }}>{item.text}</Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </MotionBox>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

        </Box>
    );
};

export default Home;
