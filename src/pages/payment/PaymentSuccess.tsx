import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Container, Typography, Button, alpha } from '@mui/material';
import {
    CheckCircle as CheckCircleIcon,
    CalendarToday as CalendarIcon,
    ArrowForward as ArrowForwardIcon,
    Home as HomeIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const PaymentSuccess: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const appointmentId = searchParams.get('appointmentId');

    return (
        <Box sx={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            bgcolor: '#f8fafc', position: 'relative', overflow: 'hidden', py: 6,
        }}>
            {/* Background glow orbs */}
            <Box sx={{ position: 'absolute', top: '10%', left: '20%', width: '40vw', height: '40vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <Box sx={{ position: 'absolute', bottom: '15%', right: '15%', width: '30vw', height: '30vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
                <MotionBox
                    initial={{ scale: 0.8, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, type: 'spring', bounce: 0.35 }}
                    sx={{
                        p: { xs: 4, sm: 6 }, borderRadius: '28px', bgcolor: 'white',
                        boxShadow: '0 24px 64px rgba(0,0,0,0.09)',
                        border: '1px solid #f1f5f9', textAlign: 'center',
                    }}
                >
                    {/* Icon */}
                    <MotionBox
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 18 }}
                        sx={{
                            width: 88, height: 88, borderRadius: '50%',
                            bgcolor: alpha('#10b981', 0.1),
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            mx: 'auto', mb: 3.5,
                        }}
                    >
                        <CheckCircleIcon sx={{ fontSize: 52, color: '#10b981' }} />
                    </MotionBox>

                    <MotionBox initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <Typography sx={{
                            fontFamily: '"Outfit", sans-serif', fontWeight: 800,
                            fontSize: { xs: '1.8rem', sm: '2.2rem' }, color: '#09090b',
                            letterSpacing: '-0.03em', mb: 1,
                        }}>
                            Appointment Confirmed!
                        </Typography>
                        <Typography sx={{ color: '#64748b', mb: 4, lineHeight: 1.7, fontSize: '0.95rem', maxWidth: 380, mx: 'auto' }}>
                            Your booking is locked in. No payment needed right now — just show up and enjoy your experience!
                        </Typography>
                    </MotionBox>

                    {/* Appointment ID card */}
                    {appointmentId && (
                        <MotionBox initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                            sx={{ p: 2.5, borderRadius: '18px', bgcolor: '#f8fafc', border: '1px solid #f1f5f9', mb: 4, textAlign: 'center' }}>
                            <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', mb: 0.5 }}>
                                Booking Reference
                            </Typography>
                            <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: '#6366f1', fontSize: '0.95rem', letterSpacing: '0.05em' }}>
                                #{appointmentId.slice(-8).toUpperCase()}
                            </Typography>
                        </MotionBox>
                    )}

                    {/* Trust points */}
                    <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                        sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 5, textAlign: 'left' }}>
                        {[
                            { emoji: '✅', text: 'No prepayment required — pay at the venue' },
                            { emoji: '📱', text: 'Check your profile for booking details' },
                            { emoji: '🔔', text: 'You\'ll receive a reminder before your appointment' },
                        ].map((item, i) => (
                            <Box key={i} sx={{ display: 'flex', gap: 1.5, alignItems: 'center', p: 1.5, borderRadius: '12px', bgcolor: alpha('#6366f1', 0.04) }}>
                                <Typography sx={{ fontSize: '1.1rem', lineHeight: 1 }}>{item.emoji}</Typography>
                                <Typography sx={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>{item.text}</Typography>
                            </Box>
                        ))}
                    </MotionBox>

                    {/* CTAs */}
                    <MotionBox initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
                        sx={{ display: 'flex', gap: 1.5, flexDirection: { xs: 'column', sm: 'row' } }}>
                        <Button
                            variant="contained" fullWidth size="large"
                            startIcon={<CalendarIcon />}
                            onClick={() => navigate('/appointments')}
                            sx={{
                                borderRadius: '16px', py: 1.6, fontWeight: 700, textTransform: 'none', fontSize: '0.95rem',
                                background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)',
                                boxShadow: '0 6px 20px rgba(99,102,241,0.35)',
                                '&:hover': { boxShadow: '0 10px 28px rgba(99,102,241,0.5)', transform: 'translateY(-1px)' },
                            }}
                        >
                            View Appointments
                        </Button>
                        <Button
                            variant="outlined" fullWidth size="large"
                            startIcon={<HomeIcon />}
                            onClick={() => navigate('/')}
                            sx={{
                                borderRadius: '16px', py: 1.6, fontWeight: 700, textTransform: 'none', fontSize: '0.95rem',
                                borderColor: '#e2e8f0', color: '#475569',
                                '&:hover': { borderColor: '#6366f1', color: '#6366f1', bgcolor: alpha('#6366f1', 0.04) },
                            }}
                        >
                            Back to Home
                        </Button>
                    </MotionBox>
                </MotionBox>

                {/* Footer note */}
                <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} sx={{ textAlign: 'center', mt: 3 }}>
                    <Typography sx={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                        Need help? Contact our support team anytime.
                    </Typography>
                </MotionBox>
            </Container>
        </Box>
    );
};

export default PaymentSuccess;
