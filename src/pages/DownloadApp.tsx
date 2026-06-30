import React from 'react';
import { Box, Container, Typography, Grid, Button, alpha, Chip } from '@mui/material';
import {
    PhoneIphone as AppIcon, Star as StarIcon, Shield as ShieldIcon,
    Speed as SpeedIcon, Notifications as NotifyIcon, LocationOn as LocationIcon,
    CalendarToday as CalendarIcon, CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const ease      = [0.25, 0.1, 0.25, 1] as any;
const fadeUp    = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } };
const stagger   = (d = 0.09) => ({ hidden: {}, show: { transition: { staggerChildren: d } } });
const scaleIn   = { hidden: { opacity: 0, scale: 0.93 }, show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease } } };

const features = [
    { icon: <LocationIcon />, color: '#818cf8', title: 'Nearby Discovery',  desc: 'Find top-rated salons and spas within minutes of your location.' },
    { icon: <CalendarIcon />, color: '#f9a8d4', title: 'Instant Booking',   desc: 'Real-time slot availability. Book in seconds, no calls needed.' },
    { icon: <NotifyIcon />,   color: '#6ee7b7', title: 'Smart Reminders',   desc: 'Never miss an appointment with automatic push reminders.' },
    { icon: <ShieldIcon />,   color: '#fde68a', title: 'Safe & Secure',     desc: 'End-to-end encrypted. Your data is never shared or sold.' },
    { icon: <StarIcon />,     color: '#fca5a5', title: 'Verified Reviews',  desc: 'Real ratings from real customers — always authentic.' },
    { icon: <SpeedIcon />,    color: '#86efac', title: 'Zero Prepayment',   desc: 'Book for free. Pay only at the venue after your service.' },
];

const screenshots = [
    { label: 'Home', bg: 'linear-gradient(160deg, #1e1b4b 0%, #312e81 100%)' },
    { label: 'Discover', bg: 'linear-gradient(160deg, #1e293b 0%, #0f172a 100%)' },
    { label: 'Booking', bg: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 100%)' },
];

const DownloadApp: React.FC = () => (
    <Box sx={{ bgcolor: '#09090b', overflowX: 'hidden' }}>

        {/* HERO */}
        <Box sx={{ pt: 18, pb: 14, position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ position: 'absolute', top: '5%', right: '-5%', width: '50vw', height: '50vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 65%)', pointerEvents: 'none' }} />
            <Box sx={{ position: 'absolute', bottom: '-5%', left: '-5%', width: '35vw', height: '35vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 65%)', pointerEvents: 'none' }} />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Grid container spacing={8} alignItems="center">
                    <Grid size={{ xs: 12, md: 6 }}>
                        <MotionBox variants={stagger(0.1)} initial="hidden" animate="show">
                            <MotionBox variants={fadeUp}>
                                <Chip label="FREE TO DOWNLOAD" sx={{ bgcolor: alpha('#6366f1', 0.2), color: '#a5b4fc', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.08em', mb: 3, borderRadius: '8px' }} />
                            </MotionBox>
                            <MotionBox variants={fadeUp}>
                                <Typography variant="h1" sx={{ fontWeight: 900, color: 'white', fontSize: { xs: '2.6rem', md: '4rem' }, lineHeight: 1.08, letterSpacing: '-0.025em', mb: 3 }}>
                                    Beauty at your{' '}
                                    <Box component="span" sx={{ background: 'linear-gradient(135deg,#a5b4fc 0%,#ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                        fingertips
                                    </Box>
                                </Typography>
                            </MotionBox>
                            <MotionBox variants={fadeUp}>
                                <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '1.1rem', lineHeight: 1.75, mb: 6, maxWidth: '480px' }}>
                                    Download the Styler app and discover the best salons, spas, and wellness centres near you — instantly bookable, zero prepayment.
                                </Typography>
                            </MotionBox>

                            {/* Store Badges */}
                            <MotionBox variants={fadeUp} sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 5 }}>
                                {[
                                    { platform: 'App Store', sub: 'Download on the', icon: '🍎', rating: '4.9 ★ — 50K+ ratings' },
                                    { platform: 'Google Play', sub: 'Get it on', icon: '▶', rating: '4.8 ★ — 80K+ ratings' },
                                ].map((b) => (
                                    <Box key={b.platform} sx={{
                                        display: 'flex', alignItems: 'center', gap: 2, px: 3, py: 2,
                                        bgcolor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '16px', cursor: 'pointer', transition: 'all 0.25s ease',
                                        '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' },
                                    }}>
                                        <Typography sx={{ fontSize: '1.8rem', lineHeight: 1 }}>{b.icon}</Typography>
                                        <Box>
                                            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.62rem', lineHeight: 1, mb: 0.3 }}>{b.sub}</Typography>
                                            <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '1.1rem', lineHeight: 1.2 }}>{b.platform}</Typography>
                                            <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.6rem', mt: 0.3 }}>{b.rating}</Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </MotionBox>

                            {/* Trust tags */}
                            <MotionBox variants={fadeUp} sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                {['100% Free', 'iOS & Android', 'No Signup Fee', '100+ Cities'].map((t) => (
                                    <Box key={t} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                        <CheckIcon sx={{ fontSize: 14, color: '#6ee7b7' }} />
                                        <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', fontWeight: 600 }}>{t}</Typography>
                                    </Box>
                                ))}
                            </MotionBox>
                        </MotionBox>
                    </Grid>

                    {/* Phone mockup trio */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <MotionBox variants={fadeUp} initial="hidden" animate="show" sx={{ display: 'flex', justifyContent: 'center', gap: 2, alignItems: 'flex-end', px: { xs: 2, md: 0 } }}>
                            {screenshots.map((s, i) => (
                                <Box key={i} sx={{
                                    width: i === 1 ? 160 : 130,
                                    height: i === 1 ? 320 : 260,
                                    borderRadius: '28px',
                                    background: s.bg,
                                    border: '6px solid rgba(255,255,255,0.07)',
                                    boxShadow: i === 1 ? '0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)' : '0 16px 40px rgba(0,0,0,0.4)',
                                    transform: i === 0 ? 'rotate(-5deg) translateY(20px)' : i === 2 ? 'rotate(5deg) translateY(20px)' : 'rotate(0deg)',
                                    transition: 'transform 0.5s ease',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1.5,
                                }}>
                                    <Box sx={{ width: 32, height: 4, bgcolor: 'rgba(255,255,255,0.15)', borderRadius: '2px' }} />
                                    <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem', fontWeight: 700 }}>{s.label}</Typography>
                                    {[...Array(4)].map((_, j) => (
                                        <Box key={j} sx={{ width: i === 1 ? '80%' : '70%', height: i === 1 ? 36 : 28, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }} />
                                    ))}
                                </Box>
                            ))}
                        </MotionBox>
                    </Grid>
                </Grid>
            </Container>
        </Box>

        {/* FEATURES */}
        <Box sx={{ py: { xs: 8, md: 14 }, bgcolor: '#0f172a' }}>
            <Container maxWidth="lg">
                <MotionBox variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
                    <MotionBox variants={fadeUp} sx={{ textAlign: 'center', mb: 8 }}>
                        <Typography variant="overline" sx={{ color: '#818cf8', fontWeight: 700, letterSpacing: '0.12em' }}>APP FEATURES</Typography>
                        <Typography variant="h2" sx={{ fontWeight: 900, color: 'white', fontSize: { xs: '2rem', md: '2.8rem' }, letterSpacing: '-0.02em' }}>
                            Everything you need
                        </Typography>
                    </MotionBox>

                    <Grid container spacing={3}>
                        {features.map((f, i) => (
                            <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                                <MotionBox variants={scaleIn}>
                                    <Box sx={{ p: 3.5, borderRadius: '24px', bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', height: '100%', transition: 'all 0.3s ease', '&:hover': { bgcolor: 'rgba(255,255,255,0.07)', transform: 'translateY(-4px)' } }}>
                                        <Box sx={{ width: 52, height: 52, borderRadius: '16px', bgcolor: alpha(f.color, 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.color, mb: 2.5 }}>
                                            {f.icon}
                                        </Box>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>{f.title}</Typography>
                                        <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.88rem', lineHeight: 1.7 }}>{f.desc}</Typography>
                                    </Box>
                                </MotionBox>
                            </Grid>
                        ))}
                    </Grid>
                </MotionBox>
            </Container>
        </Box>

        {/* QR CODE SECTION */}
        <Box sx={{ py: { xs: 8, md: 14 }, bgcolor: '#09090b', textAlign: 'center' }}>
            <Container maxWidth="sm">
                <MotionBox variants={stagger(0.1)} initial="hidden" whileInView="show" viewport={{ once: true }}>
                    <MotionBox variants={fadeUp}>
                        <Box sx={{ width: 140, height: 140, bgcolor: 'white', borderRadius: '20px', mx: 'auto', mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 8px rgba(255,255,255,0.06)' }}>
                            {/* QR placeholder */}
                            <Box sx={{ width: 100, height: 100, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
                                {[...Array(49)].map((_, j) => (
                                    <Box key={j} sx={{ bgcolor: Math.random() > 0.4 ? '#0f172a' : 'transparent', borderRadius: '1px' }} />
                                ))}
                            </Box>
                        </Box>
                        <Typography variant="h4" sx={{ fontWeight: 900, color: 'white', mb: 1.5 }}>Scan to Download</Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.45)', mb: 5, lineHeight: 1.7 }}>
                            Point your phone camera at the QR code above, or search "Styler" on the App Store or Google Play.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Button variant="contained" startIcon={<AppIcon />}
                                sx={{ px: 4, py: 1.5, borderRadius: '14px', fontWeight: 700, bgcolor: 'white', color: '#0f172a', '&:hover': { bgcolor: '#f8fafc', transform: 'translateY(-2px)' }, transition: 'all 0.25s ease', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
                                App Store
                            </Button>
                            <Button variant="contained" startIcon={<AppIcon />}
                                sx={{ px: 4, py: 1.5, borderRadius: '14px', fontWeight: 700, bgcolor: 'white', color: '#0f172a', '&:hover': { bgcolor: '#f8fafc', transform: 'translateY(-2px)' }, transition: 'all 0.25s ease', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
                                Google Play
                            </Button>
                        </Box>
                    </MotionBox>
                </MotionBox>
            </Container>
        </Box>
    </Box>
);

export default DownloadApp;
