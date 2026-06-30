import React, { useState } from 'react';
import {
    Box, Container, Typography, Grid, TextField, Button, alpha,
    CircularProgress,
} from '@mui/material';
import {
    Email as EmailIcon, Phone as PhoneIcon, LocationOn as LocationIcon,
    Send as SendIcon, CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const MotionBox = motion(Box);
const ease      = [0.25, 0.1, 0.25, 1] as any;
const fadeUp    = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } };
const stagger   = (d = 0.09) => ({ hidden: {}, show: { transition: { staggerChildren: d } } });

const contactInfo = [
    { icon: <EmailIcon />,    color: '#818cf8', label: 'Email Us',       value: 'hello@stylerapp.in',    sub: 'We reply within 4 business hours' },
    { icon: <PhoneIcon />,    color: '#f9a8d4', label: 'Call Us',        value: '+91 80 4567 8900',      sub: 'Mon – Sat, 9 AM to 7 PM IST' },
    { icon: <LocationIcon />, color: '#6ee7b7', label: 'Headquarters',   value: 'Indiranagar, Bangalore', sub: 'Karnataka, India – 560038' },
];

const inputSx = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '14px',
        bgcolor: '#f8fafc',
        '& fieldset': { borderColor: '#e2e8f0' },
        '&:hover fieldset': { borderColor: '#6366f1' },
        '&.Mui-focused fieldset': { borderColor: '#6366f1', borderWidth: '2px' },
    },
    '& .MuiInputLabel-root.Mui-focused': { color: '#6366f1' },
};

const Contact: React.FC = () => {
    const [form, setForm]       = useState({ name: '', email: '', subject: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [sent, setSent]       = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.message) { toast.error('Please fill in all required fields'); return; }
        setLoading(true);
        await new Promise(r => setTimeout(r, 1400));
        setLoading(false);
        setSent(true);
        toast.success('Message sent! We\'ll be in touch soon.');
    };

    return (
        <Box sx={{ bgcolor: '#fafafa', overflowX: 'hidden' }}>

            {/* HERO */}
            <Box sx={{ bgcolor: '#09090b', pt: 18, pb: 12, position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ position: 'absolute', top: '10%', right: '8%', width: '40vw', height: '40vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 68%)', pointerEvents: 'none' }} />
                <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <MotionBox variants={stagger(0.1)} initial="hidden" animate="show">
                        <MotionBox variants={fadeUp}>
                            <Typography variant="overline" sx={{ color: '#818cf8', fontWeight: 700, letterSpacing: '0.12em' }}>CONTACT US</Typography>
                        </MotionBox>
                        <MotionBox variants={fadeUp}>
                            <Typography variant="h1" sx={{ fontWeight: 900, color: 'white', fontSize: { xs: '2.4rem', md: '3.8rem' }, lineHeight: 1.1, letterSpacing: '-0.025em', mb: 3 }}>
                                We'd love to{' '}
                                <Box component="span" sx={{ background: 'linear-gradient(135deg,#a5b4fc 0%,#ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                    hear from you
                                </Box>
                            </Typography>
                        </MotionBox>
                        <MotionBox variants={fadeUp}>
                            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: '480px', mx: 'auto' }}>
                                Whether you're a customer with a question, a business owner ready to partner, or a journalist — we're here.
                            </Typography>
                        </MotionBox>
                    </MotionBox>
                </Container>
            </Box>

            {/* CONTACT CARDS */}
            <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'white' }}>
                <Container maxWidth="lg">
                    <Grid container spacing={3} justifyContent="center">
                        {contactInfo.map((c, i) => (
                            <Grid key={i} size={{ xs: 12, sm: 4 }}>
                                <MotionBox variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
                                    <Box sx={{ p: 4, borderRadius: '24px', bgcolor: '#f8fafc', border: '1px solid #f1f5f9', textAlign: 'center', height: '100%', transition: 'all 0.3s ease', '&:hover': { bgcolor: 'white', boxShadow: '0 8px 30px rgba(0,0,0,0.07)', transform: 'translateY(-4px)' } }}>
                                        <Box sx={{ width: 56, height: 56, borderRadius: '16px', bgcolor: alpha(c.color, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color, mx: 'auto', mb: 2 }}>
                                            {c.icon}
                                        </Box>
                                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{c.label}</Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', mt: 0.5, mb: 0.5 }}>{c.value}</Typography>
                                        <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.8rem' }}>{c.sub}</Typography>
                                    </Box>
                                </MotionBox>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* CONTACT FORM */}
            <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#f8fafc' }}>
                <Container maxWidth="md">
                    <MotionBox variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
                        <MotionBox variants={fadeUp} sx={{ textAlign: 'center', mb: 7 }}>
                            <Typography variant="h3" sx={{ fontWeight: 900, color: '#0f172a', mb: 1.5 }}>Send us a message</Typography>
                            <Typography sx={{ color: '#64748b', lineHeight: 1.7 }}>
                                Fill in the form and we'll get back to you within one business day.
                            </Typography>
                        </MotionBox>

                        <MotionBox variants={fadeUp}>
                            <Box component="form" onSubmit={handleSubmit} sx={{ p: { xs: 3, md: 6 }, borderRadius: '28px', bgcolor: 'white', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
                                {sent ? (
                                    <Box sx={{ textAlign: 'center', py: 6 }}>
                                        <Box sx={{ width: 72, height: 72, borderRadius: '50%', bgcolor: alpha('#6ee7b7', 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
                                            <CheckIcon sx={{ fontSize: 36, color: '#22c55e' }} />
                                        </Box>
                                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mb: 1.5 }}>Message Sent!</Typography>
                                        <Typography sx={{ color: '#64748b', lineHeight: 1.7 }}>
                                            Thank you, {form.name}. We'll get back to you at <strong style={{ color: '#6366f1' }}>{form.email}</strong> within one business day.
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField fullWidth label="Your Name *" name="name" value={form.name} onChange={handleChange} sx={inputSx} />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField fullWidth label="Email Address *" name="email" type="email" value={form.email} onChange={handleChange} sx={inputSx} />
                                        </Grid>
                                        <Grid size={{ xs: 12 }}>
                                            <TextField fullWidth label="Subject" name="subject" value={form.subject} onChange={handleChange} sx={inputSx} />
                                        </Grid>
                                        <Grid size={{ xs: 12 }}>
                                            <TextField fullWidth label="Message *" name="message" multiline rows={5} value={form.message} onChange={handleChange} sx={inputSx} />
                                        </Grid>
                                        <Grid size={{ xs: 12 }}>
                                            <Button type="submit" variant="contained" size="large" disabled={loading} endIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
                                                sx={{ px: 5, py: 1.6, borderRadius: '50px', fontWeight: 800, fontSize: '1rem', background: 'linear-gradient(135deg,#6366f1 0%,#4f46e5 100%)', boxShadow: '0 8px 24px rgba(99,102,241,0.35)', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 32px rgba(99,102,241,0.45)' }, transition: 'all 0.3s ease' }}>
                                                {loading ? 'Sending…' : 'Send Message'}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                )}
                            </Box>
                        </MotionBox>
                    </MotionBox>
                </Container>
            </Box>
        </Box>
    );
};

export default Contact;
