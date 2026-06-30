import React, { useState } from 'react';
import {
    Box, Container, Typography, Grid, Button, TextField, alpha,
    Chip, MenuItem, Select, FormControl, InputLabel, CircularProgress,
} from '@mui/material';
import {
    CheckCircle as CheckIcon, TrendingUp as GrowthIcon, Dashboard as DashboardIcon,
    Payment as PaymentIcon, People as PeopleIcon, Store as StoreIcon,
    Handshake as PartnerIcon, ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const MotionBox = motion(Box);
const ease      = [0.25, 0.1, 0.25, 1] as any;
const fadeUp    = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } };
const stagger   = (d = 0.09) => ({ hidden: {}, show: { transition: { staggerChildren: d } } });
const scaleIn   = { hidden: { opacity: 0, scale: 0.93 }, show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease } } };

const benefits = [
    { icon: <GrowthIcon />,   color: '#818cf8', title: '3x Client Growth',     desc: 'Partners see 3x more new clients within their first 90 days on Styler.' },
    { icon: <DashboardIcon />,color: '#f9a8d4', title: 'Powerful Dashboard',   desc: 'Manage appointments, staff, services, and revenue all from one place.' },
    { icon: <PaymentIcon />,  color: '#6ee7b7', title: 'Instant Payouts',      desc: 'Receive payments directly via Razorpay within 24 hours of each appointment.' },
    { icon: <PeopleIcon />,   color: '#fde68a', title: 'Staff Management',     desc: 'Assign services to staff, manage schedules, and track individual performance.' },
    { icon: <StoreIcon />,    color: '#fca5a5', title: 'Multi-location Ready', desc: 'Manage all your branches from a single account with unified analytics.' },
    { icon: <PartnerIcon />,  color: '#86efac', title: 'Dedicated Support',    desc: 'A dedicated partner success manager helps you get set up and grow.' },
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
        '& input, & textarea': { color: 'white' },
    },
    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.45)' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#818cf8' },
    '& .MuiSelect-select': { color: 'white' },
};

const BecomePartner: React.FC = () => {
    const [form, setForm] = useState({ name: '', business: '', phone: '', email: '', city: '', category: '', salons: '' });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: any) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.business || !form.phone || !form.email || !form.city || !form.category) {
            toast.error('Please fill in all required fields');
            return;
        }
        setLoading(true);
        await new Promise(r => setTimeout(r, 1600));
        setLoading(false);
        setSubmitted(true);
        toast.success('Application submitted! We\'ll reach out within 24 hours.');
    };

    return (
        <Box sx={{ bgcolor: '#09090b', overflowX: 'hidden' }}>

            {/* HERO */}
            <Box sx={{ pt: 18, pb: 12, position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ position: 'absolute', top: '5%', right: '8%', width: '45vw', height: '45vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 68%)', pointerEvents: 'none' }} />
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Grid container spacing={8} alignItems="center">
                        <Grid size={{ xs: 12, md: 6 }}>
                            <MotionBox variants={stagger(0.1)} initial="hidden" animate="show">
                                <MotionBox variants={fadeUp}>
                                    <Chip label="FOR BUSINESS OWNERS" sx={{ bgcolor: alpha('#6366f1', 0.2), color: '#a5b4fc', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.08em', mb: 3, borderRadius: '8px' }} />
                                </MotionBox>
                                <MotionBox variants={fadeUp}>
                                    <Typography variant="h1" sx={{ fontWeight: 900, color: 'white', fontSize: { xs: '2.4rem', md: '3.6rem' }, lineHeight: 1.1, letterSpacing: '-0.025em', mb: 3 }}>
                                        Grow your salon with{' '}
                                        <Box component="span" sx={{ background: 'linear-gradient(135deg,#a5b4fc 0%,#ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                            Styler
                                        </Box>
                                    </Typography>
                                </MotionBox>
                                <MotionBox variants={fadeUp}>
                                    <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '1.05rem', lineHeight: 1.75, mb: 5, maxWidth: '460px' }}>
                                        Join 10,000+ beauty businesses across India. Get discovered by new customers, manage your bookings, and grow your revenue — all from one dashboard.
                                    </Typography>
                                </MotionBox>
                                <MotionBox variants={fadeUp} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                    {[
                                        'Zero commission for your first 3 months',
                                        'Go live on the app within 48 hours',
                                        'Free onboarding and setup support',
                                        'No monthly subscription fee',
                                    ].map((b) => (
                                        <Box key={b} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Box sx={{ width: 22, height: 22, borderRadius: '50%', bgcolor: alpha('#6366f1', 0.2), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <CheckIcon sx={{ fontSize: 13, color: '#818cf8' }} />
                                            </Box>
                                            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>{b}</Typography>
                                        </Box>
                                    ))}
                                </MotionBox>

                                {/* Partner stats */}
                                <MotionBox variants={fadeUp} sx={{ display: 'flex', gap: 4, mt: 5, pt: 5, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                                    {[{ n: '₹2.4L', l: 'Avg. monthly revenue' }, { n: '3x', l: 'Client growth in 90 days' }, { n: '48h', l: 'To go live' }].map((s) => (
                                        <Box key={s.l}>
                                            <Typography variant="h4" sx={{ fontWeight: 900, color: '#818cf8', fontSize: '1.6rem' }}>{s.n}</Typography>
                                            <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', lineHeight: 1.4 }}>{s.l}</Typography>
                                        </Box>
                                    ))}
                                </MotionBox>
                            </MotionBox>
                        </Grid>

                        {/* Registration Form */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <MotionBox variants={fadeUp} initial="hidden" animate="show">
                                <Box component="form" onSubmit={handleSubmit} sx={{ p: { xs: 3, md: 5 }, borderRadius: '28px', bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}>
                                    {submitted ? (
                                        <Box sx={{ textAlign: 'center', py: 6 }}>
                                            <Box sx={{ width: 72, height: 72, borderRadius: '50%', bgcolor: alpha('#6ee7b7', 0.15), display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
                                                <CheckIcon sx={{ fontSize: 36, color: '#6ee7b7' }} />
                                            </Box>
                                            <Typography variant="h5" sx={{ fontWeight: 800, color: 'white', mb: 1.5 }}>Application Received!</Typography>
                                            <Typography sx={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
                                                Our partner success team will reach out to you at <strong style={{ color: '#818cf8' }}>{form.email}</strong> within 24 hours to get you onboarded.
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <>
                                            <Typography variant="h5" sx={{ fontWeight: 800, color: 'white', mb: 0.5 }}>Register your business</Typography>
                                            <Typography sx={{ color: 'rgba(255,255,255,0.4)', mb: 4, fontSize: '0.875rem' }}>Takes less than 5 minutes</Typography>

                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                                <Grid container spacing={2}>
                                                    <Grid size={{ xs: 12, sm: 6 }}>
                                                        <TextField fullWidth label="Your Name *" name="name" value={form.name} onChange={handleChange} sx={inputSx} />
                                                    </Grid>
                                                    <Grid size={{ xs: 12, sm: 6 }}>
                                                        <TextField fullWidth label="Business Name *" name="business" value={form.business} onChange={handleChange} sx={inputSx} />
                                                    </Grid>
                                                    <Grid size={{ xs: 12, sm: 6 }}>
                                                        <TextField fullWidth label="Phone Number *" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" sx={inputSx} />
                                                    </Grid>
                                                    <Grid size={{ xs: 12, sm: 6 }}>
                                                        <TextField fullWidth label="Email Address *" name="email" type="email" value={form.email} onChange={handleChange} sx={inputSx} />
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
                                                        <TextField fullWidth label="Number of Locations" name="salons" value={form.salons} onChange={handleChange} placeholder="e.g. 1, 2-5, 5+" sx={inputSx} />
                                                    </Grid>
                                                </Grid>

                                                <Button type="submit" variant="contained" fullWidth disabled={loading} endIcon={loading ? <CircularProgress size={16} color="inherit" /> : <ArrowIcon />}
                                                    sx={{ py: 1.75, borderRadius: '14px', fontWeight: 800, fontSize: '1rem', mt: 1, background: 'linear-gradient(135deg,#6366f1 0%,#4f46e5 100%)', boxShadow: '0 8px 28px rgba(99,102,241,0.4)', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 36px rgba(99,102,241,0.5)' }, transition: 'all 0.3s ease' }}>
                                                    {loading ? 'Submitting…' : 'Submit Application'}
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

            {/* BENEFITS */}
            <Box sx={{ py: { xs: 8, md: 14 }, bgcolor: '#0f172a' }}>
                <Container maxWidth="lg">
                    <MotionBox variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
                        <MotionBox variants={fadeUp} sx={{ textAlign: 'center', mb: 8 }}>
                            <Typography variant="overline" sx={{ color: '#818cf8', fontWeight: 700, letterSpacing: '0.12em' }}>PARTNER BENEFITS</Typography>
                            <Typography variant="h2" sx={{ fontWeight: 900, color: 'white', fontSize: { xs: '2rem', md: '2.8rem' }, letterSpacing: '-0.02em' }}>
                                Everything your business needs
                            </Typography>
                        </MotionBox>
                        <Grid container spacing={3}>
                            {benefits.map((b, i) => (
                                <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                                    <MotionBox variants={scaleIn}>
                                        <Box sx={{ p: 3.5, borderRadius: '24px', bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', height: '100%', transition: 'all 0.3s ease', '&:hover': { bgcolor: 'rgba(255,255,255,0.07)', transform: 'translateY(-4px)' } }}>
                                            <Box sx={{ width: 52, height: 52, borderRadius: '16px', bgcolor: alpha(b.color, 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center', color: b.color, mb: 2.5 }}>
                                                {b.icon}
                                            </Box>
                                            <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>{b.title}</Typography>
                                            <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.88rem', lineHeight: 1.7 }}>{b.desc}</Typography>
                                        </Box>
                                    </MotionBox>
                                </Grid>
                            ))}
                        </Grid>
                    </MotionBox>
                </Container>
            </Box>
        </Box>
    );
};

export default BecomePartner;
