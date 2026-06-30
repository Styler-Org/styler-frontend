import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Container, Typography, Button, alpha } from '@mui/material';
import { ErrorOutline as ErrorIcon, Replay as RetryIcon, Home as HomeIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const PaymentFailed: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const error = searchParams.get('error') || 'Something went wrong while processing your booking.';

    return (
        <Box sx={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            bgcolor: '#f8fafc', position: 'relative', overflow: 'hidden', py: 6,
        }}>
            <Box sx={{ position: 'absolute', top: '15%', right: '20%', width: '36vw', height: '36vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(239,68,68,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
                <MotionBox
                    initial={{ scale: 0.85, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, type: 'spring', bounce: 0.3 }}
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
                        transition={{ delay: 0.15, type: 'spring', stiffness: 220, damping: 18 }}
                        sx={{
                            width: 88, height: 88, borderRadius: '50%',
                            bgcolor: alpha('#ef4444', 0.1),
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            mx: 'auto', mb: 3.5,
                        }}
                    >
                        <ErrorIcon sx={{ fontSize: 50, color: '#ef4444' }} />
                    </MotionBox>

                    <Typography sx={{
                        fontFamily: '"Outfit", sans-serif', fontWeight: 800,
                        fontSize: { xs: '1.8rem', sm: '2.2rem' }, color: '#09090b',
                        letterSpacing: '-0.03em', mb: 1,
                    }}>
                        Booking Failed
                    </Typography>
                    <Typography sx={{ color: '#64748b', mb: 3.5, lineHeight: 1.7, fontSize: '0.95rem', maxWidth: 380, mx: 'auto' }}>
                        We weren't able to complete your booking. Don't worry — no charges were made.
                    </Typography>

                    {/* Error detail */}
                    <Box sx={{ p: 2.5, borderRadius: '16px', bgcolor: alpha('#ef4444', 0.06), border: `1px solid ${alpha('#ef4444', 0.15)}`, mb: 5, textAlign: 'left' }}>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.5 }}>
                            Error details
                        </Typography>
                        <Typography sx={{ fontSize: '0.88rem', color: '#7f1d1d', fontWeight: 500 }}>{error}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1.5, flexDirection: { xs: 'column', sm: 'row' } }}>
                        <Button
                            variant="contained" fullWidth size="large"
                            startIcon={<RetryIcon />}
                            onClick={() => navigate(-1)}
                            sx={{
                                borderRadius: '16px', py: 1.6, fontWeight: 700, textTransform: 'none', fontSize: '0.95rem',
                                background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)',
                                boxShadow: '0 6px 20px rgba(99,102,241,0.35)',
                                '&:hover': { boxShadow: '0 10px 28px rgba(99,102,241,0.5)', transform: 'translateY(-1px)' },
                            }}
                        >
                            Try Again
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
                            Go Home
                        </Button>
                    </Box>
                </MotionBox>

                <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} sx={{ textAlign: 'center', mt: 3 }}>
                    <Typography sx={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                        If the problem persists, please contact our support team.
                    </Typography>
                </MotionBox>
            </Container>
        </Box>
    );
};

export default PaymentFailed;
