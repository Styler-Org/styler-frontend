import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Typography, Grid, Avatar, Button, alpha } from '@mui/material';
import { AutoAwesome as SparklesIcon, Favorite as HeartIcon, Groups as TeamIcon, TrendingUp as GrowthIcon, ArrowForward as ArrowIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionBox  = motion(Box);
const ease       = [0.25, 0.1, 0.25, 1] as any;
const fadeUp     = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } };
const stagger    = (d = 0.09) => ({ hidden: {}, show: { transition: { staggerChildren: d } } });
const scaleIn    = { hidden: { opacity: 0, scale: 0.93 }, show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease } } };

const values = [
    { icon: <HeartIcon />,   color: '#f9a8d4', title: 'Customer First',   desc: 'Every decision starts with the question: does this make the customer experience better?' },
    { icon: <SparklesIcon />,color: '#818cf8', title: 'Quality Always',   desc: 'We verify every partner on our platform. No shortcuts, no compromises.' },
    { icon: <TeamIcon />,    color: '#6ee7b7', title: 'Empowering Partners', desc: 'Our partners\' success is our success. We build tools that help businesses grow.' },
    { icon: <GrowthIcon />,  color: '#fde68a', title: 'Built for India',  desc: 'Not a copy-paste of a global product — designed ground-up for Indian customers and businesses.' },
];

const milestones = [
    { year: '2022', title: 'Founded in Bangalore', desc: 'Started with 10 partner salons in Indiranagar.' },
    { year: '2023', title: 'Pan-India Expansion',  desc: 'Reached 50 cities and 1,000+ partner venues.' },
    { year: '2024', title: 'Crossed 1 Lakh Users', desc: '1,00,000 appointments booked in a single month.' },
    { year: '2025', title: 'Series A Funding',     desc: 'Raised ₹42 Cr to build the mobile platform.' },
    { year: '2026', title: 'The Styler App',        desc: 'Launched on iOS & Android — serving 100+ cities.' },
];

const team = [
    { name: 'Arjun Mehta',    role: 'Co-founder & CEO',     bg: '#818cf8' },
    { name: 'Shruti Kapoor',  role: 'Co-founder & CTO',     bg: '#f9a8d4' },
    { name: 'Rohit Joshi',    role: 'Head of Growth',        bg: '#6ee7b7' },
    { name: 'Priya Nair',     role: 'Head of Partner Success', bg: '#fde68a' },
];

const About: React.FC = () => (
    <Box sx={{ bgcolor: '#fafafa', overflowX: 'hidden' }}>

        {/* HERO */}
        <Box sx={{ minHeight: '70vh', position: 'relative', display: 'flex', alignItems: 'center', bgcolor: '#09090b', overflow: 'hidden', pt: 12, pb: 10 }}>
            <Box sx={{ position: 'absolute', top: '10%', right: '8%', width: '40vw', height: '40vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 68%)', pointerEvents: 'none' }} />
            <Box sx={{ position: 'absolute', bottom: '5%', left: '2%', width: '30vw', height: '30vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 68%)', pointerEvents: 'none' }} />
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <MotionBox variants={stagger(0.1)} initial="hidden" animate="show" sx={{ maxWidth: 640 }}>
                    <MotionBox variants={fadeUp}>
                        <Typography variant="overline" sx={{ color: '#818cf8', fontWeight: 700, letterSpacing: '0.12em' }}>OUR STORY</Typography>
                    </MotionBox>
                    <MotionBox variants={fadeUp}>
                        <Typography variant="h1" sx={{ fontWeight: 900, color: 'white', fontSize: { xs: '2.6rem', md: '4rem' }, lineHeight: 1.1, letterSpacing: '-0.025em', mb: 3 }}>
                            We're building the future of{' '}
                            <Box component="span" sx={{ background: 'linear-gradient(135deg,#a5b4fc 0%,#ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                beauty in India
                            </Box>
                        </Typography>
                    </MotionBox>
                    <MotionBox variants={fadeUp}>
                        <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', lineHeight: 1.75, mb: 5 }}>
                            Styler was born out of a simple frustration — booking a good salon in India was still stuck in 2010. Phone calls, no-shows, no idea of prices. We decided to fix that.
                        </Typography>
                    </MotionBox>
                    <MotionBox variants={fadeUp} sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                        {[{ n: '100+', l: 'Cities' }, { n: '10K+', l: 'Partners' }, { n: '5L+', l: 'Users' }].map((s) => (
                            <Box key={s.l}>
                                <Typography variant="h3" sx={{ fontWeight: 900, color: 'white', fontSize: '2rem' }}>{s.n}</Typography>
                                <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.l}</Typography>
                            </Box>
                        ))}
                    </MotionBox>
                </MotionBox>
            </Container>
        </Box>

        {/* MISSION */}
        <Box sx={{ py: { xs: 8, md: 14 }, bgcolor: 'white' }}>
            <Container maxWidth="lg">
                <Grid container spacing={8} alignItems="center">
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Box sx={{ position: 'relative' }}>
                            <Box component="img" src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=85" alt="Salon"
                                sx={{ width: '100%', borderRadius: '28px', boxShadow: '0 24px 60px rgba(0,0,0,0.12)', display: 'block' }} />
                            <Box sx={{ position: 'absolute', bottom: -20, right: -20, bgcolor: '#6366f1', borderRadius: '20px', p: 2.5, boxShadow: '0 12px 30px rgba(99,102,241,0.4)' }}>
                                <Typography sx={{ color: 'white', fontWeight: 900, fontSize: '1.5rem', lineHeight: 1 }}>₹0</Typography>
                                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem', fontWeight: 600 }}>Prepayment ever</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 7 }}>
                        <MotionBox variants={stagger(0.1)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
                            <MotionBox variants={fadeUp}>
                                <Typography variant="overline" sx={{ color: '#6366f1', fontWeight: 700, letterSpacing: '0.12em' }}>OUR MISSION</Typography>
                                <Typography variant="h2" sx={{ fontWeight: 900, color: '#0f172a', mb: 2.5, fontSize: { xs: '2rem', md: '2.6rem' }, letterSpacing: '-0.02em' }}>
                                    Making premium beauty accessible to every Indian
                                </Typography>
                                <Typography sx={{ color: '#64748b', lineHeight: 1.8, mb: 3 }}>
                                    We believe that a great haircut, a relaxing massage, or a glowing facial shouldn't require luck or connections. It should be a seamless, trustworthy experience — available to everyone, everywhere in India.
                                </Typography>
                                <Typography sx={{ color: '#64748b', lineHeight: 1.8 }}>
                                    Our platform connects customers with verified, high-quality beauty and wellness businesses, empowering both sides with technology that was previously only available to large chains.
                                </Typography>
                            </MotionBox>
                        </MotionBox>
                    </Grid>
                </Grid>
            </Container>
        </Box>

        {/* VALUES */}
        <Box sx={{ py: { xs: 8, md: 14 }, bgcolor: '#f8fafc' }}>
            <Container maxWidth="lg">
                <MotionBox variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
                    <MotionBox variants={fadeUp} sx={{ textAlign: 'center', mb: 8 }}>
                        <Typography variant="overline" sx={{ color: '#6366f1', fontWeight: 700, letterSpacing: '0.12em' }}>OUR VALUES</Typography>
                        <Typography variant="h2" sx={{ fontWeight: 900, color: '#0f172a', fontSize: { xs: '2rem', md: '2.8rem' }, letterSpacing: '-0.02em' }}>
                            What drives us
                        </Typography>
                    </MotionBox>
                    <Grid container spacing={3}>
                        {values.map((v, i) => (
                            <Grid key={i} size={{ xs: 12, sm: 6 }}>
                                <MotionBox variants={scaleIn}>
                                    <Box sx={{ p: 4, borderRadius: '24px', bgcolor: 'white', border: '1px solid #f1f5f9', display: 'flex', gap: 3, alignItems: 'flex-start', height: '100%', transition: 'all 0.3s ease', '&:hover': { boxShadow: '0 8px 30px rgba(0,0,0,0.07)', transform: 'translateY(-3px)' } }}>
                                        <Box sx={{ width: 52, height: 52, borderRadius: '16px', bgcolor: alpha(v.color, 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center', color: v.color, flexShrink: 0 }}>
                                            {v.icon}
                                        </Box>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>{v.title}</Typography>
                                            <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.7 }}>{v.desc}</Typography>
                                        </Box>
                                    </Box>
                                </MotionBox>
                            </Grid>
                        ))}
                    </Grid>
                </MotionBox>
            </Container>
        </Box>

        {/* TIMELINE */}
        <Box sx={{ py: { xs: 8, md: 14 }, bgcolor: '#09090b' }}>
            <Container maxWidth="md">
                <MotionBox variants={stagger(0.1)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
                    <MotionBox variants={fadeUp} sx={{ textAlign: 'center', mb: 8 }}>
                        <Typography variant="overline" sx={{ color: '#818cf8', fontWeight: 700, letterSpacing: '0.12em' }}>JOURNEY</Typography>
                        <Typography variant="h2" sx={{ fontWeight: 900, color: 'white', fontSize: { xs: '2rem', md: '2.8rem' }, letterSpacing: '-0.02em' }}>
                            Our milestones
                        </Typography>
                    </MotionBox>
                    <Box sx={{ position: 'relative', '&::before': { content: '""', position: 'absolute', left: { xs: 20, md: '50%' }, top: 0, bottom: 0, width: '2px', bgcolor: 'rgba(255,255,255,0.07)', transform: { md: 'translateX(-50%)' } } }}>
                        {milestones.map((m, i) => (
                            <MotionBox key={i} variants={fadeUp} sx={{ display: 'flex', gap: 3, mb: 5, flexDirection: { md: i % 2 === 0 ? 'row' : 'row-reverse' }, alignItems: 'center' }}>
                                <Box sx={{ flex: 1, textAlign: { md: i % 2 === 0 ? 'right' : 'left' }, display: { xs: 'none', md: 'block' } }}>
                                    {i % 2 === 0 && (
                                        <Box sx={{ p: 3, borderRadius: '20px', bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                            <Typography sx={{ color: '#818cf8', fontWeight: 800, fontSize: '0.85rem', mb: 0.5 }}>{m.year}</Typography>
                                            <Typography sx={{ color: 'white', fontWeight: 700, mb: 0.5 }}>{m.title}</Typography>
                                            <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem' }}>{m.desc}</Typography>
                                        </Box>
                                    )}
                                </Box>
                                <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1, boxShadow: '0 0 0 6px rgba(99,102,241,0.15)' }}>
                                    <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '0.6rem' }}>{m.year.slice(2)}</Typography>
                                </Box>
                                <Box sx={{ flex: 1, display: { xs: 'block', md: i % 2 !== 0 ? 'block' : 'none' } }}>
                                    <Box sx={{ p: 3, borderRadius: '20px', bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                        <Typography sx={{ color: '#818cf8', fontWeight: 800, fontSize: '0.85rem', mb: 0.5 }}>{m.year}</Typography>
                                        <Typography sx={{ color: 'white', fontWeight: 700, mb: 0.5 }}>{m.title}</Typography>
                                        <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem' }}>{m.desc}</Typography>
                                    </Box>
                                </Box>
                            </MotionBox>
                        ))}
                    </Box>
                </MotionBox>
            </Container>
        </Box>

        {/* TEAM */}
        <Box sx={{ py: { xs: 8, md: 14 }, bgcolor: 'white' }}>
            <Container maxWidth="lg">
                <MotionBox variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
                    <MotionBox variants={fadeUp} sx={{ textAlign: 'center', mb: 8 }}>
                        <Typography variant="overline" sx={{ color: '#6366f1', fontWeight: 700, letterSpacing: '0.12em' }}>THE TEAM</Typography>
                        <Typography variant="h2" sx={{ fontWeight: 900, color: '#0f172a', fontSize: { xs: '2rem', md: '2.8rem' }, letterSpacing: '-0.02em' }}>
                            Built by people who love beauty
                        </Typography>
                    </MotionBox>
                    <Grid container spacing={3} justifyContent="center">
                        {team.map((t, i) => (
                            <Grid key={i} size={{ xs: 6, md: 3 }}>
                                <MotionBox variants={scaleIn} sx={{ textAlign: 'center' }}>
                                    <Avatar sx={{ width: 88, height: 88, bgcolor: alpha(t.bg, 0.15), color: t.bg, fontWeight: 900, fontSize: '2rem', mx: 'auto', mb: 2, border: `3px solid ${alpha(t.bg, 0.2)}` }}>
                                        {t.name.charAt(0)}
                                    </Avatar>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>{t.name}</Typography>
                                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>{t.role}</Typography>
                                </MotionBox>
                            </Grid>
                        ))}
                    </Grid>
                </MotionBox>
            </Container>
        </Box>

        {/* CTA */}
        <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#f8fafc', textAlign: 'center' }}>
            <Container maxWidth="sm">
                <MotionBox variants={stagger(0.1)} initial="hidden" whileInView="show" viewport={{ once: true }}>
                    <MotionBox variants={fadeUp}>
                        <Typography variant="h3" sx={{ fontWeight: 900, color: '#0f172a', mb: 2 }}>Join us on the journey</Typography>
                        <Typography sx={{ color: '#64748b', mb: 5, lineHeight: 1.7 }}>
                            Whether you're a customer seeking beauty services or a business ready to grow — Styler is for you.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Button component={Link} to="/download" variant="contained" size="large" endIcon={<ArrowIcon />}
                                sx={{ px: 4, py: 1.5, borderRadius: '50px', fontWeight: 700, background: 'linear-gradient(135deg,#6366f1 0%,#4f46e5 100%)', boxShadow: '0 8px 24px rgba(99,102,241,0.35)', '&:hover': { transform: 'translateY(-2px)' }, transition: 'all 0.3s ease' }}>
                                Download the App
                            </Button>
                            <Button component={Link} to="/become-a-partner" variant="outlined" size="large"
                                sx={{ px: 4, py: 1.5, borderRadius: '50px', fontWeight: 700, borderColor: '#6366f1', color: '#6366f1', '&:hover': { bgcolor: alpha('#6366f1', 0.05) } }}>
                                Become a Partner
                            </Button>
                        </Box>
                    </MotionBox>
                </MotionBox>
            </Container>
        </Box>
    </Box>
);

export default About;
