import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Typography, Grid, Button, alpha, Chip } from '@mui/material';
import {
    PhoneIphone as AppIcon, LocationOn as LocationIcon, CalendarToday as CalendarIcon,
    AutoAwesome as SparklesIcon, Store as StoreIcon, Dashboard as DashboardIcon,
    People as PeopleIcon, TrendingUp as TrendingIcon, ArrowForward as ArrowIcon,
    CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const ease      = [0.25, 0.1, 0.25, 1] as any;
const fadeUp    = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } };
const stagger   = (d = 0.09) => ({ hidden: {}, show: { transition: { staggerChildren: d } } });
const scaleIn   = { hidden: { opacity: 0, scale: 0.93 }, show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease } } };

const customerSteps = [
    { step: '01', icon: <AppIcon />,      color: '#818cf8', title: 'Download the App',   desc: 'Get Styler on App Store (iOS) or Google Play (Android). Free, always. Create your account with just a phone number.' },
    { step: '02', icon: <LocationIcon />, color: '#f9a8d4', title: 'Find Nearby',         desc: 'Browse thousands of salons, spas, and wellness centres near you. Filter by service, rating, price, and availability.' },
    { step: '03', icon: <CalendarIcon />, color: '#6ee7b7', title: 'Book Instantly',      desc: 'Pick your service, preferred professional, and a time that works for you. Confirm in seconds — no phone calls, no deposits.' },
    { step: '04', icon: <SparklesIcon />, color: '#fde68a', title: 'Enjoy & Review',      desc: 'Show up, relax, and get pampered. Pay at the venue. Share your experience to help others find great places.' },
];

const partnerSteps = [
    { step: '01', icon: <StoreIcon />,    color: '#818cf8', title: 'Register Your Business', desc: 'Sign up as a partner on our website. Add your salon details, services, pricing, and team members. Takes under 15 minutes.' },
    { step: '02', icon: <CheckIcon />,    color: '#f9a8d4', title: 'Get Verified',            desc: 'Our team reviews and verifies your listing within 48 hours. Once approved, you\'re live on the Styler app.' },
    { step: '03', icon: <DashboardIcon />,color: '#6ee7b7', title: 'Manage Bookings',         desc: 'Use the Styler Partner Dashboard to manage appointments, update availability, handle staff, and view analytics.' },
    { step: '04', icon: <TrendingIcon />, color: '#fde68a', title: 'Grow Revenue',             desc: 'Watch your clientele grow as Styler brings new customers to your door. Get instant payouts via Razorpay.' },
];

const faqs = [
    { q: 'Is the Styler app free to download?', a: 'Yes, completely free. No subscription, no hidden charges. Just download and start booking.' },
    { q: 'Do I need to pay in advance?', a: 'No. Styler has a zero-prepayment model. You book for free and pay directly at the venue after your service.' },
    { q: 'How do I cancel a booking?', a: 'You can cancel any booking from the app up to 2 hours before your appointment time, at no charge.' },
    { q: 'Is it available in my city?', a: 'We\'re live in 100+ Indian cities including all metros, Tier-1 and major Tier-2 cities. Check the app for your area.' },
    { q: 'How do I register my salon?', a: 'Click "Become a Partner" on our website, fill in your details, and our team will have you live in 48 hours.' },
    { q: 'What does it cost to list on Styler?', a: 'Zero commission for the first 3 months. After that, a small per-booking fee applies. No monthly subscription.' },
];

const HowItWorksPage: React.FC = () => (
    <Box sx={{ bgcolor: '#fafafa', overflowX: 'hidden' }}>

        {/* HERO */}
        <Box sx={{ bgcolor: '#09090b', pt: 18, pb: 12, position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ position: 'absolute', top: '10%', right: '8%', width: '40vw', height: '40vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 68%)', pointerEvents: 'none' }} />
            <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <MotionBox variants={stagger(0.1)} initial="hidden" animate="show">
                    <MotionBox variants={fadeUp}>
                        <Typography variant="overline" sx={{ color: '#818cf8', fontWeight: 700, letterSpacing: '0.12em' }}>HOW IT WORKS</Typography>
                    </MotionBox>
                    <MotionBox variants={fadeUp}>
                        <Typography variant="h1" sx={{ fontWeight: 900, color: 'white', fontSize: { xs: '2.4rem', md: '3.8rem' }, lineHeight: 1.1, letterSpacing: '-0.025em', mb: 3 }}>
                            Simple. Fast.{' '}
                            <Box component="span" sx={{ background: 'linear-gradient(135deg,#a5b4fc 0%,#ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                Beautiful.
                            </Box>
                        </Typography>
                    </MotionBox>
                    <MotionBox variants={fadeUp}>
                        <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '1.1rem', lineHeight: 1.75, maxWidth: '540px', mx: 'auto' }}>
                            Whether you're booking your next blowout or registering your salon — the Styler experience is designed to be effortless.
                        </Typography>
                    </MotionBox>
                </MotionBox>
            </Container>
        </Box>

        {/* FOR CUSTOMERS */}
        <Box sx={{ py: { xs: 8, md: 14 }, bgcolor: 'white' }}>
            <Container maxWidth="lg">
                <MotionBox variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
                    <MotionBox variants={fadeUp} sx={{ mb: 8 }}>
                        <Chip label="FOR CUSTOMERS" sx={{ bgcolor: alpha('#6366f1', 0.1), color: '#6366f1', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.08em', mb: 2 }} />
                        <Typography variant="h2" sx={{ fontWeight: 900, color: '#0f172a', fontSize: { xs: '2rem', md: '2.6rem' }, letterSpacing: '-0.02em' }}>
                            Book beauty in 4 steps
                        </Typography>
                    </MotionBox>

                    {customerSteps.map((step, i) => (
                        <MotionBox key={i} variants={fadeUp}>
                            <Grid container spacing={4} alignItems="center" sx={{ mb: 6, flexDirection: i % 2 !== 0 ? 'row-reverse' : 'row' }}>
                                <Grid size={{ xs: 12, md: 1 }}>
                                    <Typography sx={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '3.5rem', color: alpha(step.color, 0.15), lineHeight: 1 }}>
                                        {step.step}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, md: 2 }}>
                                    <Box sx={{ width: 72, height: 72, borderRadius: '20px', bgcolor: alpha(step.color, 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center', color: step.color, '& svg': { fontSize: '2rem' } }}>
                                        {step.icon}
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 12, md: 9 }}>
                                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>{step.title}</Typography>
                                    <Typography sx={{ color: '#64748b', lineHeight: 1.75, maxWidth: 540 }}>{step.desc}</Typography>
                                </Grid>
                            </Grid>
                            {i < customerSteps.length - 1 && <Box sx={{ borderBottom: '1px dashed #e2e8f0', mb: 6 }} />}
                        </MotionBox>
                    ))}

                    <MotionBox variants={fadeUp} sx={{ mt: 6 }}>
                        <Button component={Link} to="/download" variant="contained" size="large" startIcon={<AppIcon />}
                            sx={{ px: 5, py: 1.75, borderRadius: '50px', fontWeight: 800, fontSize: '1rem', background: 'linear-gradient(135deg,#6366f1 0%,#4f46e5 100%)', boxShadow: '0 8px 28px rgba(99,102,241,0.35)', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 36px rgba(99,102,241,0.45)' }, transition: 'all 0.3s ease' }}>
                            Download Styler Free
                        </Button>
                    </MotionBox>
                </MotionBox>
            </Container>
        </Box>

        {/* FOR PARTNERS */}
        <Box sx={{ py: { xs: 8, md: 14 }, bgcolor: '#09090b' }}>
            <Container maxWidth="lg">
                <MotionBox variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
                    <MotionBox variants={fadeUp} sx={{ mb: 8 }}>
                        <Chip label="FOR BUSINESS OWNERS" sx={{ bgcolor: alpha('#ec4899', 0.15), color: '#f9a8d4', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.08em', mb: 2 }} />
                        <Typography variant="h2" sx={{ fontWeight: 900, color: 'white', fontSize: { xs: '2rem', md: '2.6rem' }, letterSpacing: '-0.02em' }}>
                            List your business in 48 hours
                        </Typography>
                    </MotionBox>

                    <Grid container spacing={3}>
                        {partnerSteps.map((step, i) => (
                            <Grid key={i} size={{ xs: 12, sm: 6 }}>
                                <MotionBox variants={scaleIn}>
                                    <Box sx={{ p: 4, borderRadius: '24px', bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', height: '100%', transition: 'all 0.3s ease', '&:hover': { bgcolor: 'rgba(255,255,255,0.07)', transform: 'translateY(-4px)' } }}>
                                        <Typography sx={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '2.5rem', color: 'rgba(255,255,255,0.06)', lineHeight: 1, mb: 2 }}>{step.step}</Typography>
                                        <Box sx={{ width: 52, height: 52, borderRadius: '14px', bgcolor: alpha(step.color, 0.15), display: 'flex', alignItems: 'center', justifyContent: 'center', color: step.color, mb: 2.5 }}>
                                            {step.icon}
                                        </Box>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>{step.title}</Typography>
                                        <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', lineHeight: 1.7 }}>{step.desc}</Typography>
                                    </Box>
                                </MotionBox>
                            </Grid>
                        ))}
                    </Grid>

                    <MotionBox variants={fadeUp} sx={{ mt: 7 }}>
                        <Button component={Link} to="/become-a-partner" variant="contained" size="large"
                            sx={{ px: 5, py: 1.75, borderRadius: '50px', fontWeight: 800, fontSize: '1rem', background: 'linear-gradient(135deg,#ec4899 0%,#be185d 100%)', boxShadow: '0 8px 28px rgba(236,72,153,0.35)', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 36px rgba(236,72,153,0.45)' }, transition: 'all 0.3s ease' }}>
                            Register My Business
                        </Button>
                    </MotionBox>
                </MotionBox>
            </Container>
        </Box>

        {/* FAQ */}
        <Box sx={{ py: { xs: 8, md: 14 }, bgcolor: '#f8fafc' }}>
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
    </Box>
);

export default HowItWorksPage;
