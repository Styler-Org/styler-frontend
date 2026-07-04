import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Box, Container, Typography, Button, Grid, Avatar, alpha,
    Chip, TextField, FormControl, InputLabel, Select, MenuItem, CircularProgress,
} from '@mui/material';
import {
    Star as StarIcon,
    ContentCut as ScissorsIcon,
    CalendarToday as CalendarIcon,
    ArrowForward as ArrowForwardIcon,
    AutoAwesome as SparklesIcon,
    Face as FaceIcon,
    Spa as SpaIcon,
    Shield as ShieldIcon,
    CheckCircle as CheckIcon,
    Public as GlobeIcon,
    TrendingUp as TrendingIcon,
    Groups as GroupsIcon,
    PhoneIphone as AppIcon,
    Handshake as PartnerIcon,
    NotificationsActive as NotifyIcon,
    Payment as PaymentIcon,
    LocationOn as LocationIcon,
    DesignServices as DesignIcon,
    Dashboard as DashboardIcon,
    Store as StoreIcon,
    Favorite as HeartIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import CountUp from 'react-countup';
import toast from 'react-hot-toast';
import Logo from '../components/common/Logo';
import { partnerService } from '../services/partnerService';
import { useParallax } from '../hooks/useParallax';
import { useMagnetic } from '../hooks/useMagnetic';
import { useSplitReveal } from '../hooks/useSplitReveal';
import { gsap } from '../lib/gsap';

const MotionBox  = motion(Box);
const MotionTypo = motion(Typography);
const ease   = [0.25, 0.1, 0.25, 1] as any;
const fadeUp = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } };
const stagger = (d = 0.09) => ({ hidden: {}, show: { transition: { staggerChildren: d } } });
const scaleIn = { hidden: { opacity: 0, scale: 0.93 }, show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease } } };

/* ─── DATA ─── */
const stats = [
    { count: 100, suffix: '+',  label: 'Cities in India',     icon: <GlobeIcon />,    color: '#818cf8' },
    { count: 10,  suffix: 'K+', label: 'Verified Venues',     icon: <CheckIcon />,    color: '#f9a8d4' },
    { count: 500, suffix: 'K+', label: 'Appointments Booked', icon: <CalendarIcon />, color: '#6ee7b7' },
    { count: 4.9, suffix: '★',  label: 'Average Rating',      icon: <StarIcon />,     color: '#fde68a' },
];

const serviceCategories = [
    { label: 'Salons & Barbershops', icon: <ScissorsIcon />, color: '#818cf8', desc: 'Haircuts, colour, styling & grooming',     img: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80' },
    { label: 'Skin & Dermatology',   icon: <FaceIcon />,     color: '#f9a8d4', desc: 'Facials, peels, laser & derma consults',   img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80' },
    { label: 'Wellness & Spa',       icon: <SpaIcon />,      color: '#6ee7b7', desc: 'Massage, body wraps & holistic care',      img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80' },
    { label: 'Nails & Lashes',       icon: <SparklesIcon />, color: '#fde68a', desc: 'Manicures, nail art & lash extensions',    img: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80' },
    { label: 'Bridal Packages',      icon: <DesignIcon />,   color: '#fca5a5', desc: 'Makeup, mehendi & wedding day beauty',     img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80' },
    { label: 'Fitness & Yoga',       icon: <GroupsIcon />,   color: '#86efac', desc: 'Yoga studios, gyms & meditation centres', img: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&q=80' },
];

const appFeatures = [
    { icon: <LocationIcon />, color: '#818cf8', title: 'Nearby Discovery', desc: 'Find the best salons and spas near you, filtered by rating, price & services.' },
    { icon: <CalendarIcon />, color: '#f9a8d4', title: 'Instant Booking',  desc: 'Real-time slots, zero waiting. Book in seconds, 24/7, no phone calls needed.' },
    { icon: <NotifyIcon />,   color: '#6ee7b7', title: 'Smart Reminders',  desc: 'Appointment reminders and real-time updates so you never miss a session.' },
    { icon: <PaymentIcon />,  color: '#fde68a', title: 'Pay at Venue',     desc: 'Book for free and pay directly at the salon after your service. No prepayment.' },
    { icon: <StarIcon />,     color: '#fca5a5', title: 'Verified Reviews', desc: 'Authentic ratings from real customers — no fake reviews, ever.' },
    { icon: <ShieldIcon />,   color: '#86efac', title: 'Safe & Secure',    desc: 'End-to-end encrypted data. Your privacy is our top priority.' },
];

const howItWorks = [
    { step: '01', icon: <AppIcon />,      title: 'Download the App', desc: 'Get the Styler app on the App Store or Google Play — free, always.' },
    { step: '02', icon: <LocationIcon />, title: 'Find Nearby',      desc: 'Browse thousands of verified salons, spas & wellness venues near you.' },
    { step: '03', icon: <CalendarIcon />, title: 'Book Instantly',   desc: 'Pick your service, professional & time slot. Confirm in seconds.' },
    { step: '04', icon: <SparklesIcon />, title: 'Glow Up',          desc: 'Arrive, relax, and enjoy a premium beauty experience. Pay on-site.' },
];

const partnerSteps = [
    { step: '01', icon: <StoreIcon />,    color: '#818cf8', title: 'Register Your Business', desc: 'Sign up as a partner on our website. Add your salon details, services, pricing, and team members. Takes under 15 minutes.' },
    { step: '02', icon: <CheckIcon />,    color: '#f9a8d4', title: 'Get Verified',            desc: "Our team reviews and verifies your listing within 48 hours. Once approved, you're live on the Styler app." },
    { step: '03', icon: <DashboardIcon />,color: '#6ee7b7', title: 'Manage Bookings',         desc: 'Use the Styler Partner Dashboard to manage appointments, update availability, handle staff, and view analytics.' },
    { step: '04', icon: <TrendingIcon />, color: '#fde68a', title: 'Grow Revenue',            desc: 'Watch your clientele grow as Styler brings new customers to your door. Get instant payouts via Razorpay.' },
];

const whyStyler = [
    { icon: <GlobeIcon />,    color: '#818cf8', title: 'Pan-India Network',  desc: '10,000+ venues across 100+ cities — from metros to Tier-2 towns.' },
    { icon: <ShieldIcon />,   color: '#6ee7b7', title: 'Verified Quality',   desc: 'Every venue is vetted and continuously rated by real customers.' },
    { icon: <CalendarIcon />, color: '#f9a8d4', title: 'Instant Booking',    desc: 'Real-time availability. Confirm in seconds, any time of day.' },
    { icon: <TrendingIcon />, color: '#fde68a', title: 'No Prepayment',      desc: 'Book for free and pay directly at the venue after your service.' },
    { icon: <GroupsIcon />,   color: '#86efac', title: 'Expert Stylists',    desc: 'Certified professionals with verified track records and reviews.' },
    { icon: <SparklesIcon />, color: '#fca5a5', title: 'Premium for All',    desc: 'From budget-friendly to ultra-luxury — every taste, every budget.' },
];

const testimonials = [
    { name: 'Priya Sharma',  city: 'Mumbai',    comment: 'Found the most incredible salon five minutes from my office. Booking was instant and the experience was flawless!', avatar: 'P', color: '#818cf8' },
    { name: 'Anjali Verma',  city: 'New Delhi', comment: 'I book my weekly spa sessions through Styler. Zero hassle, always perfect. Totally recommend it to every working woman!', avatar: 'A', color: '#f9a8d4' },
    { name: 'Sneha Reddy',   city: 'Hyderabad', comment: 'The bridal package I found through Styler was stunning. My wedding look was everything I dreamed of.', avatar: 'S', color: '#6ee7b7' },
    { name: 'Ravi Krishnan', city: 'Bangalore', comment: 'From the UI to the actual salon experience — everything about Styler is premium. Best beauty app in India.', avatar: 'R', color: '#fde68a' },
    { name: 'Meera Iyer',    city: 'Chennai',   comment: 'Switched from another app and never looked back. The selection of salons and booking experience is just better.', avatar: 'M', color: '#fca5a5' },
    { name: 'Pooja Agarwal', city: 'Pune',      comment: "Used Styler for my entire team's pre-event grooming. Customer support is exceptional and salons are top-notch.", avatar: 'P', color: '#86efac' },
];

const partnerBenefits = [
    'Zero commission on the first 3 months',
    'Real-time appointment management dashboard',
    'Staff scheduling & availability tools',
    'Revenue analytics & growth insights',
    'Instant payout via Razorpay',
    'Dedicated onboarding support team',
];

const values = [
    { icon: <HeartIcon />,   color: '#f9a8d4', title: 'Customer First',      desc: 'Every decision starts with the question: does this make the customer experience better?' },
    { icon: <SparklesIcon />,color: '#818cf8', title: 'Quality Always',      desc: 'We verify every partner on our platform. No shortcuts, no compromises.' },
    { icon: <GroupsIcon />,  color: '#6ee7b7', title: 'Empowering Partners', desc: "Our partners' success is our success. We build tools that help businesses grow." },
    { icon: <TrendingIcon />,color: '#fde68a', title: 'Built for India',     desc: 'Not a copy-paste of a global product — designed ground-up for Indian customers and businesses.' },
];

const faqs = [
    { q: 'Is the Styler app free to download?', a: 'Yes, completely free. No subscription, no hidden charges. Just download and start booking.' },
    { q: 'Do I need to pay in advance?',        a: 'No. Styler has a zero-prepayment model. You book for free and pay directly at the venue after your service.' },
    { q: 'How do I cancel a booking?',          a: 'You can cancel any booking from the app up to 2 hours before your appointment time, at no charge.' },
    { q: 'Is it available in my city?',         a: "We're live in 100+ Indian cities including all metros, Tier-1 and major Tier-2 cities. Check the app for your area." },
    { q: 'How do I register my salon?',         a: 'Fill in the partner registration form on this page, and our team will have you live in 48 hours.' },
    { q: 'What does it cost to list on Styler?',a: 'Zero commission for the first 3 months. After that, a small per-booking fee applies. No monthly subscription.' },
];

const categories = ['Salon & Barbershop', 'Spa & Wellness', 'Skin & Dermatology', 'Nail Studio', 'Bridal Studio', 'Fitness & Yoga', 'Other'];
const cities     = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kochi', 'Chandigarh', 'Other'];

const inputSx = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '14px',
        bgcolor: 'rgba(255,255,255,0.05)',
        '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
        '&.Mui-focused fieldset': { borderColor: '#6366f1' },
        '& input, & textarea': { color: 'white', backgroundColor: 'transparent' },
    },
    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.45)' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#818cf8' },
    '& .MuiSelect-select': { color: 'white' },
    '& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active': {
        WebkitBoxShadow: '0 0 0 1000px #0f172a inset',
        WebkitTextFillColor: '#ffffff',
        caretColor: '#ffffff',
        transition: 'background-color 9999s ease-in-out 0s',
    },
};

/* ─── COMPONENT ─── */
const Home: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user: authUser } = useAuthStore();

    const [form, setForm]           = useState({ name: '', business: '', phone: '', email: '', city: '', category: '', salons: '' });
    const [formLoading, setFormLoading] = useState(false);
    const [submitted, setSubmitted]     = useState(false);
    const [headerScrolled, setHeaderScrolled] = useState(false);

    const heroVideoRef = useParallax<HTMLDivElement>(0.18);
    const downloadCta = useMagnetic<HTMLButtonElement>(0.25);
    const partnerCta  = useMagnetic<HTMLButtonElement>(0.25);
    const servicesTitleRef = useSplitReveal<HTMLSpanElement>({ type: 'words' });
    const whyStylerTitleRef = useSplitReveal<HTMLSpanElement>({ type: 'words' });

    useEffect(() => {
        if (isAuthenticated && authUser) {
            if (authUser.role === 'barber')           navigate('/barber/dashboard',      { replace: true });
            else if (authUser.role === 'salon_owner') navigate('/salon-owner/dashboard', { replace: true });
        }
    }, [isAuthenticated, authUser, navigate]);

    useEffect(() => {
        const onScroll = () => setHeaderScrolled(window.scrollY > 60);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        if (!heroVideoRef.current) return;
        const tween = gsap.to(heroVideoRef.current, {
            scale: 1.08, duration: 9, ease: 'sine.inOut', repeat: -1, yoyo: true,
        });
        return () => { tween.kill(); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const scrollTo = (id: string) => (e: React.MouseEvent) => {
        e.preventDefault();
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    const setField = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm(prev => ({ ...prev, [key]: e.target.value }));

    const handleChange = (e: any) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.business || !form.phone || !form.email || !form.city || !form.category) {
            toast.error('Please fill in all required fields');
            return;
        }
        setFormLoading(true);
        try {
            await partnerService.submitApplication({
                ownerName: form.name,
                businessName: form.business,
                phone: form.phone,
                email: form.email,
                city: form.city,
                category: form.category,
                numberOfLocations: form.salons || undefined,
            });
            setSubmitted(true);
            toast.success("Application submitted! We'll reach out within 24 hours.");
        } catch (err: any) {
            const message = err?.response?.data?.error?.message || "Something went wrong. Please try again.";
            toast.error(message);
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <Box sx={{ bgcolor: '#fafafa', overflowX: 'hidden' }}>

            {/* ══════════════════════════════════════════════
                MINIMAL STICKY HEADER
            ══════════════════════════════════════════════ */}
            <Box sx={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                px: { xs: 2, md: 6 }, height: 64,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                transition: 'background 0.3s ease, backdrop-filter 0.3s ease, box-shadow 0.3s ease',
                background: headerScrolled ? 'rgba(9,9,11,0.92)' : 'transparent',
                backdropFilter: headerScrolled ? 'blur(16px)' : 'none',
                boxShadow: headerScrolled ? '0 1px 0 rgba(255,255,255,0.06)' : 'none',
            }}>
                <Logo variant="light" size="small" />
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                    <Button
                        component={Link} to="/login"
                        variant="text" size="small"
                        sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '0.82rem', textTransform: 'none', '&:hover': { color: 'white', bgcolor: 'transparent' } }}
                    >
                        Partner Login
                    </Button>
                    <Button
                        component={Link} to="/download"
                        variant="contained" size="small"
                        sx={{ px: 2.5, py: 0.85, borderRadius: '50px', fontWeight: 700, fontSize: '0.82rem', textTransform: 'none', background: 'linear-gradient(135deg,#6366f1 0%,#4f46e5 100%)', boxShadow: '0 4px 14px rgba(99,102,241,0.4)', '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 6px 20px rgba(99,102,241,0.5)' }, transition: 'all 0.2s ease' }}
                    >
                        Download App
                    </Button>
                </Box>
            </Box>

            {/* ══════════════════════════════════════════════
                HERO — Full-screen video background
            ══════════════════════════════════════════════ */}
            <Box sx={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', overflow: 'hidden', pb: { xs: 8, md: 0 } }}>
                <Box ref={heroVideoRef} component="video" autoPlay muted loop playsInline
                    poster="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&q=90"
                    sx={{ position: 'absolute', inset: '-10% 0', width: '100%', height: '120%', objectFit: 'cover', objectPosition: 'center 30%' }}>
                    <source src="https://videos.pexels.com/video-files/6953564/6953564-uhd_2560_1440_25fps.mp4" type="video/mp4" />
                    <source src="https://videos.pexels.com/video-files/3552840/3552840-hd_1920_1080_25fps.mp4" type="video/mp4" />
                    <source src="https://videos.pexels.com/video-files/5709661/5709661-hd_1920_1080_25fps.mp4" type="video/mp4" />
                </Box>
                <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(4,0,20,0.96) 0%, rgba(4,0,20,0.82) 40%, rgba(4,0,20,0.5) 70%, rgba(4,0,20,0.35) 100%)' }} />
                <Box sx={{ position: 'absolute', top: '10%', right: '12%', width: '38vw', height: '38vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 68%)', pointerEvents: 'none' }} />
                <Box sx={{ position: 'absolute', bottom: '8%', left: '3%', width: '28vw', height: '28vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.14) 0%, transparent 68%)', pointerEvents: 'none' }} />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
                    <MotionBox variants={stagger(0.1)} initial="hidden" animate="show" sx={{ maxWidth: { xs: '100%', md: '72%', lg: '62%' } }}>

                        <MotionBox variants={fadeUp}>
                            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mb: 3.5, px: 2, py: 0.85, borderRadius: '50px', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.14)' }}>
                                <GlobeIcon sx={{ fontSize: 13, color: '#a5b4fc' }} />
                                <Typography sx={{ color: 'rgba(255,255,255,0.88)', fontSize: '0.71rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                    Trusted Across 100+ Cities in India
                                </Typography>
                            </Box>
                        </MotionBox>

                        <MotionTypo variants={fadeUp} variant="h1" sx={{ fontWeight: 900, fontSize: { xs: '2.6rem', sm: '3.5rem', md: '4.5rem' }, lineHeight: 1.08, color: 'white', mb: 2.5, letterSpacing: '-0.025em' }}>
                            India's Premier{' '}
                            <Box component="span" sx={{ background: 'linear-gradient(135deg, #a5b4fc 0%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                Beauty & Wellness
                            </Box>{' '}Platform
                        </MotionTypo>

                        <MotionTypo variants={fadeUp} variant="h6" sx={{ color: 'rgba(255,255,255,0.72)', fontWeight: 400, lineHeight: 1.6, mb: 5, fontSize: { xs: '1rem', md: '1.15rem' }, maxWidth: '560px' }}>
                            Book salons, spas, dermatologists & wellness centres across India — instantly, from your phone. No calls. No waiting.
                        </MotionTypo>

                        <MotionBox variants={fadeUp} sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <Button ref={downloadCta.ref} onMouseMove={downloadCta.onMouseMove} onMouseLeave={downloadCta.onMouseLeave}
                                component={Link} to="/download" variant="contained" size="large"
                                startIcon={<AppIcon />}
                                sx={{ px: 4, py: 1.75, borderRadius: '50px', fontWeight: 800, fontSize: '1rem', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', boxShadow: '0 8px 30px rgba(99,102,241,0.5)', '&:hover': { background: 'linear-gradient(135deg,#5558e8 0%,#4338ca 100%)', boxShadow: '0 12px 36px rgba(99,102,241,0.6)' }, transition: 'background 0.3s ease, box-shadow 0.3s ease' }}>
                                Download the App
                            </Button>
                            <Button ref={partnerCta.ref} onMouseMove={partnerCta.onMouseMove} onMouseLeave={partnerCta.onMouseLeave}
                                onClick={scrollTo('partner')} variant="outlined" size="large"
                                startIcon={<PartnerIcon />}
                                sx={{ px: 4, py: 1.75, borderRadius: '50px', fontWeight: 700, fontSize: '1rem', color: 'white', borderColor: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(8px)', bgcolor: 'rgba(255,255,255,0.06)', '&:hover': { bgcolor: 'rgba(255,255,255,0.12)', borderColor: 'white' }, transition: 'background 0.3s ease, border-color 0.3s ease' }}>
                                Become a Partner
                            </Button>
                        </MotionBox>

                        <MotionBox variants={fadeUp} sx={{ mt: 5, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                            {[{ icon: '⭐', text: '4.9 avg. rating' }, { icon: '✅', text: '10K+ verified venues' }, { icon: '📲', text: 'iOS & Android' }].map((t) => (
                                <Box key={t.text} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                    <Typography sx={{ fontSize: '0.95rem' }}>{t.icon}</Typography>
                                    <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.82rem', fontWeight: 600 }}>{t.text}</Typography>
                                </Box>
                            ))}
                        </MotionBox>
                    </MotionBox>
                </Container>
            </Box>

            {/* ══ STATS STRIP ══ */}
            <Box sx={{ bgcolor: '#09090b', py: 5 }}>
                <Container maxWidth="lg">
                    <Grid container spacing={3} justifyContent="center">
                        {stats.map((s, i) => (
                            <Grid key={i} size={{ xs: 6, md: 3 }}>
                                <MotionBox variants={scaleIn} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} sx={{ textAlign: 'center' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.5 }}>
                                        <Box sx={{ color: s.color, '& svg': { fontSize: '1.1rem' } }}>{s.icon}</Box>
                                        <Typography variant="h3" sx={{ fontWeight: 900, color: 'white', fontSize: { xs: '1.8rem', md: '2.4rem' } }}>
                                            <CountUp end={s.count} duration={2} decimals={s.suffix === '★' ? 1 : 0} separator="," />
                                            <Box component="span" sx={{ color: s.color }}>{s.suffix}</Box>
                                        </Typography>
                                    </Box>
                                    <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</Typography>
                                </MotionBox>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* ══ APP SHOWCASE ══ */}
            <Box sx={{ py: { xs: 8, md: 14 }, bgcolor: 'white', overflow: 'hidden' }}>
                <Container maxWidth="lg">
                    <Grid container spacing={{ xs: 6, md: 10 }} alignItems="center">
                        <Grid size={{ xs: 12, md: 5 }}>
                            <MotionBox variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
                                <Box sx={{ position: 'relative', maxWidth: 320, mx: 'auto' }}>
                                    <Box sx={{ position: 'absolute', inset: '-20%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', zIndex: 0 }} />
                                    <Box sx={{ position: 'relative', zIndex: 1, width: 280, height: 560, mx: 'auto', borderRadius: '40px', bgcolor: '#0f172a', border: '8px solid #1e293b', boxShadow: '0 40px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                                        <Box sx={{ width: '100%', height: '100%', background: 'linear-gradient(160deg, #1e1b4b 0%, #312e81 40%, #1e1b4b 100%)', display: 'flex', flexDirection: 'column', p: 2.5 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, opacity: 0.5 }}>
                                                <Typography sx={{ color: 'white', fontSize: '0.6rem', fontWeight: 700 }}>9:41</Typography>
                                                <Typography sx={{ color: 'white', fontSize: '0.6rem', fontWeight: 700 }}>●●●</Typography>
                                            </Box>
                                            <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '1rem', mb: 0.5 }}>Hi, Priya 👋</Typography>
                                            <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.65rem', mb: 2 }}>Mumbai, Maharashtra</Typography>
                                            <Box sx={{ bgcolor: 'rgba(255,255,255,0.08)', borderRadius: '12px', p: 1.5, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.3)' }} />
                                                <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.62rem' }}>Search salons near you…</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', gap: 0.8, mb: 2, flexWrap: 'wrap' }}>
                                                {['Salons', 'Spa', 'Skin', 'Nails'].map((c) => (
                                                    <Box key={c} sx={{ px: 1.2, py: 0.4, borderRadius: '20px', bgcolor: c === 'Salons' ? '#6366f1' : 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                                        <Typography sx={{ color: 'white', fontSize: '0.55rem', fontWeight: 700 }}>{c}</Typography>
                                                    </Box>
                                                ))}
                                            </Box>
                                            {[{ name: 'Lakme Salon', rating: '4.9', price: '₹499' }, { name: 'Enrich Salon', rating: '4.8', price: '₹399' }].map((s) => (
                                                <Box key={s.name} sx={{ bgcolor: 'rgba(255,255,255,0.06)', borderRadius: '12px', p: 1.5, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Box>
                                                        <Typography sx={{ color: 'white', fontSize: '0.65rem', fontWeight: 700 }}>{s.name}</Typography>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.3 }}>
                                                            <Typography sx={{ color: '#fde68a', fontSize: '0.55rem' }}>★</Typography>
                                                            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.55rem' }}>{s.rating}</Typography>
                                                        </Box>
                                                    </Box>
                                                    <Box sx={{ bgcolor: '#6366f1', borderRadius: '8px', px: 1, py: 0.4 }}>
                                                        <Typography sx={{ color: 'white', fontSize: '0.55rem', fontWeight: 700 }}>{s.price}</Typography>
                                                    </Box>
                                                </Box>
                                            ))}
                                        </Box>
                                    </Box>
                                    <Box sx={{ position: 'absolute', top: '15%', right: -20, bgcolor: 'white', borderRadius: '14px', p: 1.5, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 2 }}>
                                        <Typography sx={{ fontSize: '1.2rem', lineHeight: 1 }}>⭐</Typography>
                                        <Typography sx={{ fontWeight: 800, fontSize: '0.7rem', color: '#0f172a' }}>4.9</Typography>
                                    </Box>
                                    <Box sx={{ position: 'absolute', bottom: '20%', left: -24, bgcolor: 'white', borderRadius: '14px', px: 1.5, py: 1, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 2 }}>
                                        <Typography sx={{ fontWeight: 700, fontSize: '0.62rem', color: '#6366f1' }}>✓ Booked!</Typography>
                                        <Typography sx={{ fontSize: '0.55rem', color: '#64748b', mt: 0.2 }}>Appointment confirmed</Typography>
                                    </Box>
                                </Box>
                            </MotionBox>
                        </Grid>

                        <Grid size={{ xs: 12, md: 7 }}>
                            <MotionBox variants={stagger(0.1)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
                                <MotionBox variants={fadeUp}>
                                    <Typography variant="overline" sx={{ color: '#6366f1', fontWeight: 700, letterSpacing: '0.12em' }}>THE APP</Typography>
                                    <Typography variant="h2" sx={{ fontWeight: 900, letterSpacing: '-0.02em', color: '#0f172a', mb: 1.5, fontSize: { xs: '2rem', md: '2.8rem' } }}>
                                        Everything beauty,<br />in your pocket
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: '#64748b', mb: 5, lineHeight: 1.7, maxWidth: '480px' }}>
                                        The Styler app puts 10,000+ salons, spas, and wellness experts at your fingertips. Available on iOS & Android — free forever.
                                    </Typography>
                                </MotionBox>
                                <Grid container spacing={3}>
                                    {appFeatures.map((f, i) => (
                                        <Grid key={i} size={{ xs: 12, sm: 6 }}>
                                            <MotionBox variants={fadeUp}>
                                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                                    <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: alpha(f.color, 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: f.color }}>{f.icon}</Box>
                                                    <Box>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>{f.title}</Typography>
                                                        <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.6, fontSize: '0.82rem' }}>{f.desc}</Typography>
                                                    </Box>
                                                </Box>
                                            </MotionBox>
                                        </Grid>
                                    ))}
                                </Grid>
                                <MotionBox variants={fadeUp} sx={{ mt: 5, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                    {[{ sub: 'Download on the', main: 'App Store' }, { sub: 'Get it on', main: 'Google Play' }].map((b) => (
                                        <Button key={b.main} component={Link} to="/download" variant="contained"
                                            sx={{ px: 3.5, py: 1.5, borderRadius: '14px', bgcolor: '#0f172a', color: 'white', fontWeight: 700, boxShadow: 'none', '&:hover': { bgcolor: '#1e293b', transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }, transition: 'all 0.25s ease', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0 }}>
                                            <Typography sx={{ fontSize: '0.6rem', opacity: 0.6, lineHeight: 1, textTransform: 'none' }}>{b.sub}</Typography>
                                            <Typography sx={{ fontSize: '1rem', fontWeight: 800, lineHeight: 1.2, textTransform: 'none' }}>{b.main}</Typography>
                                        </Button>
                                    ))}
                                </MotionBox>
                            </MotionBox>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* ══ SERVICES ══ */}
            <Box sx={{ py: { xs: 8, md: 14 }, bgcolor: '#f8fafc' }} id="services">
                <Container maxWidth="lg">
                    <MotionBox variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
                        <MotionBox variants={fadeUp} sx={{ textAlign: 'center', mb: 8 }}>
                            <Typography variant="overline" sx={{ color: '#6366f1', fontWeight: 700, letterSpacing: '0.12em' }}>WHAT WE OFFER</Typography>
                            <Typography ref={servicesTitleRef} variant="h2" component="span" sx={{ display: 'block', fontWeight: 900, letterSpacing: '-0.02em', color: '#0f172a', mb: 2, fontSize: { xs: '2rem', md: '2.8rem' } }}>
                                Every beauty service, one platform
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#64748b', maxWidth: '520px', mx: 'auto', lineHeight: 1.7 }}>
                                From a quick haircut to a full bridal transformation — Styler covers every beauty and wellness category.
                            </Typography>
                        </MotionBox>
                        <Grid container spacing={3}>
                            {serviceCategories.map((cat, i) => (
                                <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                                    <MotionBox variants={scaleIn}>
                                        <Box sx={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', height: 260, '&:hover .cat-img': { transform: 'scale(1.06)' }, '&:hover .cat-overlay': { background: 'linear-gradient(180deg, rgba(10,5,30,0.1) 0%, rgba(10,5,30,0.92) 100%)' } }}>
                                            <Box className="cat-img" component="img" src={cat.img} alt={cat.label} sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }} />
                                            <Box className="cat-overlay" sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10,5,30,0) 20%, rgba(10,5,30,0.88) 100%)', transition: 'background 0.4s ease' }} />
                                            <Box sx={{ position: 'absolute', inset: 0, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                    <Box sx={{ color: cat.color, '& svg': { fontSize: '1.1rem' } }}>{cat.icon}</Box>
                                                    <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '1rem' }}>{cat.label}</Typography>
                                                </Box>
                                                <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.8rem', lineHeight: 1.5 }}>{cat.desc}</Typography>
                                            </Box>
                                        </Box>
                                    </MotionBox>
                                </Grid>
                            ))}
                        </Grid>
                    </MotionBox>
                </Container>
            </Box>

            {/* ══ HOW IT WORKS — CUSTOMERS ══ */}
            <Box sx={{ py: { xs: 8, md: 14 }, bgcolor: '#09090b', position: 'relative', overflow: 'hidden' }} id="how-it-works">
                <Box sx={{ position: 'absolute', top: '10%', left: '5%', width: '30vw', height: '30vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <Box sx={{ position: 'absolute', bottom: '5%', right: '5%', width: '25vw', height: '25vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <MotionBox variants={stagger(0.1)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
                        <MotionBox variants={fadeUp} sx={{ textAlign: 'center', mb: 8 }}>
                            <Chip label="FOR CUSTOMERS" sx={{ bgcolor: alpha('#6366f1', 0.15), color: '#a5b4fc', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.08em', mb: 2 }} />
                            <Typography variant="h2" sx={{ fontWeight: 900, color: 'white', letterSpacing: '-0.02em', mb: 2, fontSize: { xs: '2rem', md: '2.8rem' } }}>
                                Book your next look<br />in 4 easy steps
                            </Typography>
                            <Typography sx={{ color: 'rgba(255,255,255,0.5)', maxWidth: '480px', mx: 'auto', lineHeight: 1.7 }}>
                                From download to doorstep — getting pampered has never been this simple.
                            </Typography>
                        </MotionBox>
                        <Grid container spacing={3}>
                            {howItWorks.map((step, i) => (
                                <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                                    <MotionBox variants={fadeUp}>
                                        <Box sx={{ p: 3.5, borderRadius: '24px', bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', height: '100%', transition: 'all 0.3s ease', '&:hover': { bgcolor: 'rgba(255,255,255,0.07)', transform: 'translateY(-4px)' } }}>
                                            <Typography sx={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '2.5rem', color: 'rgba(255,255,255,0.08)', lineHeight: 1, mb: 2 }}>{step.step}</Typography>
                                            <Box sx={{ width: 48, height: 48, borderRadius: '14px', bgcolor: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8', mb: 2.5 }}>{step.icon}</Box>
                                            <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', mb: 1, fontSize: '1rem' }}>{step.title}</Typography>
                                            <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', lineHeight: 1.7 }}>{step.desc}</Typography>
                                        </Box>
                                    </MotionBox>
                                </Grid>
                            ))}
                        </Grid>
                        <MotionBox variants={fadeUp} sx={{ textAlign: 'center', mt: 7 }}>
                            <Button component={Link} to="/download" variant="contained" size="large" startIcon={<AppIcon />}
                                sx={{ px: 5, py: 1.75, borderRadius: '50px', fontWeight: 800, fontSize: '1rem', background: 'linear-gradient(135deg,#6366f1 0%,#4f46e5 100%)', boxShadow: '0 8px 30px rgba(99,102,241,0.4)', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 40px rgba(99,102,241,0.5)' }, transition: 'all 0.3s ease' }}>
                                Download Styler — Free
                            </Button>
                        </MotionBox>
                    </MotionBox>
                </Container>
            </Box>

            {/* ══ HOW IT WORKS — PARTNERS ══ */}
            <Box sx={{ py: { xs: 8, md: 14 }, bgcolor: 'white' }}>
                <Container maxWidth="lg">
                    <MotionBox variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
                        <MotionBox variants={fadeUp} sx={{ mb: 8 }}>
                            <Chip label="FOR BUSINESS OWNERS" sx={{ bgcolor: alpha('#ec4899', 0.1), color: '#ec4899', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.08em', mb: 2 }} />
                            <Typography variant="h2" sx={{ fontWeight: 900, color: '#0f172a', fontSize: { xs: '2rem', md: '2.6rem' }, letterSpacing: '-0.02em', mb: 2 }}>
                                List your business in 48 hours
                            </Typography>
                            <Typography sx={{ color: '#64748b', maxWidth: '500px', lineHeight: 1.7 }}>
                                Getting your salon on Styler is simple. Register today and start receiving bookings from day one.
                            </Typography>
                        </MotionBox>
                        <Grid container spacing={3}>
                            {partnerSteps.map((step, i) => (
                                <Grid key={i} size={{ xs: 12, sm: 6 }}>
                                    <MotionBox variants={scaleIn}>
                                        <Box sx={{ p: 4, borderRadius: '24px', bgcolor: '#f8fafc', border: '1px solid #f1f5f9', height: '100%', transition: 'all 0.3s ease', '&:hover': { bgcolor: 'white', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', transform: 'translateY(-4px)' } }}>
                                            <Typography sx={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '2.5rem', color: alpha(step.color, 0.15), lineHeight: 1, mb: 2 }}>{step.step}</Typography>
                                            <Box sx={{ width: 52, height: 52, borderRadius: '14px', bgcolor: alpha(step.color, 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center', color: step.color, mb: 2.5 }}>{step.icon}</Box>
                                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>{step.title}</Typography>
                                            <Typography sx={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.7 }}>{step.desc}</Typography>
                                        </Box>
                                    </MotionBox>
                                </Grid>
                            ))}
                        </Grid>
                    </MotionBox>
                </Container>
            </Box>

            {/* ══ WHY STYLER ══ */}
            <Box sx={{ py: { xs: 8, md: 14 }, bgcolor: '#f8fafc' }}>
                <Container maxWidth="lg">
                    <MotionBox variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
                        <MotionBox variants={fadeUp} sx={{ textAlign: 'center', mb: 8 }}>
                            <Typography variant="overline" sx={{ color: '#6366f1', fontWeight: 700, letterSpacing: '0.12em' }}>WHY STYLER</Typography>
                            <Typography ref={whyStylerTitleRef} variant="h2" component="span" sx={{ display: 'block', fontWeight: 900, letterSpacing: '-0.02em', color: '#0f172a', mb: 2, fontSize: { xs: '2rem', md: '2.8rem' } }}>
                                India's Most Trusted Beauty Platform
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#64748b', maxWidth: '520px', mx: 'auto', lineHeight: 1.7 }}>
                                We've built the most complete, reliable, and beautiful booking experience for Indian customers.
                            </Typography>
                        </MotionBox>
                        <Grid container spacing={3.5}>
                            {whyStyler.map((f, i) => (
                                <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                                    <MotionBox variants={scaleIn}>
                                        <Box sx={{ p: 3.5, borderRadius: '24px', bgcolor: 'white', border: '1px solid #f1f5f9', height: '100%', transition: 'all 0.3s ease', '&:hover': { boxShadow: '0 8px 30px rgba(0,0,0,0.08)', transform: 'translateY(-4px)' } }}>
                                            <Box sx={{ width: 52, height: 52, borderRadius: '16px', bgcolor: alpha(f.color, 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.color, mb: 2.5 }}>{f.icon}</Box>
                                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>{f.title}</Typography>
                                            <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.7 }}>{f.desc}</Typography>
                                        </Box>
                                    </MotionBox>
                                </Grid>
                            ))}
                        </Grid>
                    </MotionBox>
                </Container>
            </Box>

            {/* ══ TESTIMONIALS ══ */}
            <Box sx={{ py: { xs: 8, md: 14 }, bgcolor: 'white' }}>
                <Container maxWidth="lg">
                    <MotionBox variants={stagger(0.07)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}>
                        <MotionBox variants={fadeUp} sx={{ textAlign: 'center', mb: 8 }}>
                            <Typography variant="overline" sx={{ color: '#6366f1', fontWeight: 700, letterSpacing: '0.12em' }}>TESTIMONIALS</Typography>
                            <Typography variant="h2" sx={{ fontWeight: 900, letterSpacing: '-0.02em', color: '#0f172a', mb: 2, fontSize: { xs: '2rem', md: '2.8rem' } }}>
                                Loved Across India
                            </Typography>
                        </MotionBox>
                        <Grid container spacing={3}>
                            {testimonials.map((t, i) => (
                                <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                                    <MotionBox variants={fadeUp}>
                                        <Box sx={{ p: 3.5, borderRadius: '24px', bgcolor: '#f8fafc', border: '1px solid #f1f5f9', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                            <Box sx={{ display: 'flex', mb: 2 }}>
                                                {Array.from({ length: 5 }).map((_, j) => <StarIcon key={j} sx={{ color: '#fbbf24', fontSize: 16 }} />)}
                                            </Box>
                                            <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.75, flex: 1, mb: 3, fontStyle: 'italic' }}>
                                                "{t.comment}"
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Avatar sx={{ width: 40, height: 40, bgcolor: alpha(t.color, 0.15), color: t.color, fontWeight: 800, fontSize: '0.85rem' }}>{t.avatar}</Avatar>
                                                <Box>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>{t.name}</Typography>
                                                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>{t.city}</Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </MotionBox>
                                </Grid>
                            ))}
                        </Grid>
                    </MotionBox>
                </Container>
            </Box>

            {/* ══ ABOUT / OUR STORY ══ */}
            <Box sx={{ py: { xs: 8, md: 14 }, bgcolor: '#09090b', position: 'relative', overflow: 'hidden' }} id="about">
                <Box sx={{ position: 'absolute', top: '15%', right: '5%', width: '35vw', height: '35vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 68%)', pointerEvents: 'none' }} />
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <MotionBox variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
                        <Grid container spacing={8} alignItems="center">
                            <Grid size={{ xs: 12, md: 5 }}>
                                <MotionBox variants={stagger(0.1)}>
                                    <MotionBox variants={fadeUp}>
                                        <Typography variant="overline" sx={{ color: '#818cf8', fontWeight: 700, letterSpacing: '0.12em' }}>OUR STORY</Typography>
                                    </MotionBox>
                                    <MotionBox variants={fadeUp}>
                                        <Typography variant="h2" sx={{ fontWeight: 900, color: 'white', fontSize: { xs: '2rem', md: '2.8rem' }, lineHeight: 1.1, letterSpacing: '-0.025em', mb: 3 }}>
                                            Building the future of{' '}
                                            <Box component="span" sx={{ background: 'linear-gradient(135deg,#a5b4fc 0%,#ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                                beauty in India
                                            </Box>
                                        </Typography>
                                    </MotionBox>
                                    <MotionBox variants={fadeUp}>
                                        <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', lineHeight: 1.75, mb: 4 }}>
                                            Styler was born out of a simple frustration — booking a good salon in India was still stuck in 2010. Phone calls, no-shows, no idea of prices. We decided to fix that.
                                        </Typography>
                                    </MotionBox>
                                    <MotionBox variants={fadeUp} sx={{ display: 'flex', gap: 4 }}>
                                        {[{ n: '100+', l: 'Cities' }, { n: '10K+', l: 'Partners' }, { n: '5L+', l: 'Users' }].map((s) => (
                                            <Box key={s.l}>
                                                <Typography sx={{ fontWeight: 900, color: 'white', fontSize: '1.8rem', lineHeight: 1 }}>{s.n}</Typography>
                                                <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.l}</Typography>
                                            </Box>
                                        ))}
                                    </MotionBox>
                                </MotionBox>
                            </Grid>
                            <Grid size={{ xs: 12, md: 7 }}>
                                <Grid container spacing={2.5}>
                                    {values.map((v, i) => (
                                        <Grid key={i} size={{ xs: 12, sm: 6 }}>
                                            <MotionBox variants={scaleIn}>
                                                <Box sx={{ p: 3.5, borderRadius: '20px', bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', height: '100%', transition: 'all 0.3s ease', '&:hover': { bgcolor: 'rgba(255,255,255,0.07)', transform: 'translateY(-4px)' } }}>
                                                    <Box sx={{ width: 48, height: 48, borderRadius: '14px', bgcolor: alpha(v.color, 0.15), display: 'flex', alignItems: 'center', justifyContent: 'center', color: v.color, mb: 2 }}>{v.icon}</Box>
                                                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', mb: 1, fontSize: '0.95rem' }}>{v.title}</Typography>
                                                    <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', lineHeight: 1.7 }}>{v.desc}</Typography>
                                                </Box>
                                            </MotionBox>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                        </Grid>
                    </MotionBox>
                </Container>
            </Box>

            {/* ══ BECOME A PARTNER ══ */}
            <Box sx={{ py: { xs: 8, md: 14 }, bgcolor: '#0f172a', position: 'relative', overflow: 'hidden' }} id="partner">
                <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(236,72,153,0.08) 100%)', pointerEvents: 'none' }} />
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Grid container spacing={8} alignItems="flex-start">
                        <Grid size={{ xs: 12, md: 6 }}>
                            <MotionBox variants={stagger(0.1)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
                                <MotionBox variants={fadeUp}>
                                    <Chip label="FOR BUSINESS OWNERS" sx={{ bgcolor: alpha('#6366f1', 0.15), color: '#a5b4fc', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.08em', mb: 3, borderRadius: '8px' }} />
                                    <Typography variant="h2" sx={{ fontWeight: 900, color: 'white', mb: 2.5, letterSpacing: '-0.02em', fontSize: { xs: '2rem', md: '2.8rem' } }}>
                                        Grow your salon<br />with Styler
                                    </Typography>
                                    <Typography sx={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, mb: 5, fontSize: '1rem', maxWidth: '480px' }}>
                                        Join 10,000+ businesses across India using Styler to manage appointments, grow their clientele, and increase revenue — all from one powerful dashboard.
                                    </Typography>
                                </MotionBox>
                                <MotionBox variants={stagger(0.06)} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 5 }}>
                                    {partnerBenefits.map((b, i) => (
                                        <MotionBox key={i} variants={fadeUp} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{ width: 22, height: 22, borderRadius: '50%', bgcolor: alpha('#6366f1', 0.2), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <CheckIcon sx={{ fontSize: 13, color: '#818cf8' }} />
                                            </Box>
                                            <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem' }}>{b}</Typography>
                                        </MotionBox>
                                    ))}
                                </MotionBox>
                                <MotionBox variants={fadeUp} sx={{ display: 'flex', gap: 4 }}>
                                    {[{ value: '₹2.4L', label: 'Avg. monthly revenue' }, { value: '3x', label: 'Client growth in 90 days' }, { value: '48h', label: 'To go live' }].map((s) => (
                                        <Box key={s.label}>
                                            <Typography sx={{ fontWeight: 900, color: '#818cf8', fontSize: '1.6rem', lineHeight: 1 }}>{s.value}</Typography>
                                            <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', lineHeight: 1.4 }}>{s.label}</Typography>
                                        </Box>
                                    ))}
                                </MotionBox>
                            </MotionBox>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <MotionBox variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
                                <Box component="form" onSubmit={handleSubmit} autoComplete="off" className="dark-autofill"
                                    sx={{ p: { xs: 3, md: 5 }, borderRadius: '28px', bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}>
                                    {submitted ? (
                                        <Box sx={{ textAlign: 'center', py: 6 }}>
                                            <Box sx={{ width: 72, height: 72, borderRadius: '50%', bgcolor: alpha('#6ee7b7', 0.15), display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
                                                <CheckIcon sx={{ fontSize: 36, color: '#6ee7b7' }} />
                                            </Box>
                                            <Typography variant="h5" sx={{ fontWeight: 800, color: 'white', mb: 1.5 }}>Application Received!</Typography>
                                            <Typography sx={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
                                                Our partner success team will reach out to you at <strong style={{ color: '#818cf8' }}>{form.email}</strong> within 24 hours.
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <>
                                            <Typography variant="h5" sx={{ fontWeight: 800, color: 'white', mb: 0.5 }}>Register your business</Typography>
                                            <Typography sx={{ color: 'rgba(255,255,255,0.4)', mb: 4, fontSize: '0.875rem' }}>Takes less than 5 minutes</Typography>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                                <Grid container spacing={2}>
                                                    <Grid size={{ xs: 12, sm: 6 }}>
                                                        <TextField fullWidth label="Your Name *" value={form.name} onChange={setField('name')}
                                                            slotProps={{ htmlInput: { name: 'bp_owner', autoComplete: 'off' } }} sx={inputSx} />
                                                    </Grid>
                                                    <Grid size={{ xs: 12, sm: 6 }}>
                                                        <TextField fullWidth label="Business Name *" value={form.business} onChange={setField('business')}
                                                            slotProps={{ htmlInput: { name: 'bp_biz', autoComplete: 'off' } }} sx={inputSx} />
                                                    </Grid>
                                                    <Grid size={{ xs: 12, sm: 6 }}>
                                                        <TextField fullWidth label="Phone Number *" value={form.phone} onChange={setField('phone')} placeholder="+91 98765 43210"
                                                            slotProps={{ htmlInput: { name: 'bp_phone', autoComplete: 'off' } }} sx={inputSx} />
                                                    </Grid>
                                                    <Grid size={{ xs: 12, sm: 6 }}>
                                                        <TextField fullWidth label="Email Address *" type="email" value={form.email} onChange={setField('email')}
                                                            slotProps={{ htmlInput: { name: 'bp_mail', autoComplete: 'off' } }} sx={inputSx} />
                                                    </Grid>
                                                    <Grid size={{ xs: 12, sm: 6 }}>
                                                        <FormControl fullWidth sx={inputSx}>
                                                            <InputLabel>City *</InputLabel>
                                                            <Select name="city" value={form.city} label="City *" onChange={handleChange}
                                                                MenuProps={{ PaperProps: { sx: { bgcolor: '#1e293b', color: 'white', '& .MuiMenuItem-root:hover': { bgcolor: 'rgba(255,255,255,0.08)' } } } }}>
                                                                {cities.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid size={{ xs: 12, sm: 6 }}>
                                                        <FormControl fullWidth sx={inputSx}>
                                                            <InputLabel>Category *</InputLabel>
                                                            <Select name="category" value={form.category} label="Category *" onChange={handleChange}
                                                                MenuProps={{ PaperProps: { sx: { bgcolor: '#1e293b', color: 'white', '& .MuiMenuItem-root:hover': { bgcolor: 'rgba(255,255,255,0.08)' } } } }}>
                                                                {categories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid size={{ xs: 12 }}>
                                                        <TextField fullWidth label="Number of Locations" value={form.salons} onChange={setField('salons')} placeholder="e.g. 1, 2-5, 5+"
                                                            slotProps={{ htmlInput: { name: 'bp_salons', autoComplete: 'off' } }} sx={inputSx} />
                                                    </Grid>
                                                </Grid>
                                                <Button type="submit" variant="contained" fullWidth disabled={formLoading}
                                                    endIcon={formLoading ? <CircularProgress size={16} color="inherit" /> : <ArrowForwardIcon />}
                                                    sx={{ py: 1.75, borderRadius: '14px', fontWeight: 800, fontSize: '1rem', mt: 1, background: 'linear-gradient(135deg,#6366f1 0%,#4f46e5 100%)', boxShadow: '0 8px 28px rgba(99,102,241,0.4)', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 36px rgba(99,102,241,0.5)' }, transition: 'all 0.3s ease' }}>
                                                    {formLoading ? 'Submitting…' : 'Submit Application'}
                                                </Button>
                                                <Typography sx={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.72rem', textAlign: 'center' }}>
                                                    By submitting you agree to our Terms of Service. No spam — we'll only contact you about your application.
                                                </Typography>
                                            </Box>
                                        </>
                                    )}
                                </Box>
                            </MotionBox>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* ══ FAQ ══ */}
            <Box sx={{ py: { xs: 8, md: 14 }, bgcolor: '#f8fafc' }} id="faq">
                <Container maxWidth="md">
                    <MotionBox variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}>
                        <MotionBox variants={fadeUp} sx={{ textAlign: 'center', mb: 8 }}>
                            <Typography variant="overline" sx={{ color: '#6366f1', fontWeight: 700, letterSpacing: '0.12em' }}>FAQ</Typography>
                            <Typography variant="h2" sx={{ fontWeight: 900, color: '#0f172a', fontSize: { xs: '2rem', md: '2.6rem' }, letterSpacing: '-0.02em' }}>
                                Common questions
                            </Typography>
                        </MotionBox>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {faqs.map((faq, i) => (
                                <MotionBox key={i} variants={fadeUp}>
                                    <Box sx={{ p: 3.5, borderRadius: '20px', bgcolor: 'white', border: '1px solid #f1f5f9', transition: 'all 0.3s ease', '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.06)', transform: 'translateY(-2px)' } }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>{faq.q}</Typography>
                                        <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.7 }}>{faq.a}</Typography>
                                    </Box>
                                </MotionBox>
                            ))}
                        </Box>
                    </MotionBox>
                </Container>
            </Box>

            {/* ══ FINAL CTA ══ */}
            <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'white' }}>
                <Container maxWidth="md">
                    <MotionBox variants={stagger(0.1)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }}>
                        <MotionBox variants={fadeUp} sx={{ textAlign: 'center' }}>
                            <Typography variant="overline" sx={{ color: '#6366f1', fontWeight: 700, letterSpacing: '0.12em' }}>GET STARTED TODAY</Typography>
                            <Typography variant="h2" sx={{ fontWeight: 900, letterSpacing: '-0.02em', color: '#0f172a', mb: 2, fontSize: { xs: '2rem', md: '2.8rem' } }}>
                                Ready for your<br />glow-up moment?
                            </Typography>
                            <Typography sx={{ color: '#64748b', mb: 5, lineHeight: 1.7, maxWidth: '440px', mx: 'auto' }}>
                                Join 5 lakh+ customers across India who trust Styler for every beauty and wellness need.
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                                <Button component={Link} to="/download" variant="contained" size="large" startIcon={<AppIcon />}
                                    sx={{ px: 5, py: 1.75, borderRadius: '50px', fontWeight: 800, fontSize: '1rem', background: 'linear-gradient(135deg,#6366f1 0%,#4f46e5 100%)', boxShadow: '0 8px 30px rgba(99,102,241,0.35)', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 40px rgba(99,102,241,0.5)' }, transition: 'all 0.3s ease' }}>
                                    Download the App
                                </Button>
                                <Button onClick={scrollTo('partner')} variant="outlined" size="large" startIcon={<PartnerIcon />}
                                    sx={{ px: 4, py: 1.75, borderRadius: '50px', fontWeight: 700, fontSize: '1rem', borderColor: '#6366f1', color: '#6366f1', '&:hover': { bgcolor: alpha('#6366f1', 0.05), borderColor: '#4f46e5' }, transition: 'all 0.3s ease' }}>
                                    Partner with Us
                                </Button>
                            </Box>
                        </MotionBox>
                    </MotionBox>
                </Container>
            </Box>

        </Box>
    );
};

export default Home;
