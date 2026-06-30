import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Stack, alpha } from '@mui/material';
import { LockOutlined as LockIcon, HomeOutlined as HomeIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const Unauthorized: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(140deg, #f8fafc 0%, #eef2ff 50%, #fdf2f8 100%)',
        }}>
            {/* Decorative glow orbs */}
            <Box sx={{ position: 'absolute', top: '10%', left: '15%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <Box sx={{ position: 'absolute', bottom: '15%', right: '10%', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <MotionBox
                initial={{ opacity: 0, y: 32, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                sx={{ textAlign: 'center', maxWidth: 480, width: '100%', position: 'relative', zIndex: 1 }}
            >
                {/* Lock Icon Badge */}
                <MotionBox
                    initial={{ scale: 0.5, rotate: -15 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.15 }}
                    sx={{ display: 'inline-flex', mb: 4 }}
                >
                    <Box sx={{
                        width: 96, height: 96, borderRadius: '28px',
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 16px 40px rgba(239,68,68,0.35)',
                    }}>
                        <LockIcon sx={{ fontSize: 44, color: 'white' }} />
                    </Box>
                </MotionBox>

                {/* Status Code */}
                <Typography
                    variant="h1"
                    sx={{
                        fontWeight: 900,
                        fontSize: { xs: '5rem', sm: '7rem' },
                        lineHeight: 1,
                        background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 2,
                        letterSpacing: '-0.04em',
                    }}
                >
                    403
                </Typography>

                <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mb: 2, letterSpacing: '-0.02em' }}>
                    Access Denied
                </Typography>

                <Typography variant="body1" sx={{ color: '#64748b', mb: 5, lineHeight: 1.7, maxWidth: 360, mx: 'auto' }}>
                    You don't have permission to view this page. Please contact your administrator or return to a safe area.
                </Typography>

                {/* Divider line */}
                <Box sx={{ width: 48, height: 3, borderRadius: 2, background: 'linear-gradient(90deg, #6366f1, #ec4899)', mx: 'auto', mb: 5 }} />

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                    <Button
                        variant="outlined"
                        size="large"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate(-1)}
                        sx={{
                            borderRadius: '50px', px: 4, py: 1.5, fontWeight: 700,
                            textTransform: 'none', borderColor: '#e2e8f0', color: '#64748b',
                            '&:hover': { borderColor: '#6366f1', color: '#6366f1', bgcolor: alpha('#6366f1', 0.04) }
                        }}
                    >
                        Go Back
                    </Button>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<HomeIcon />}
                        onClick={() => navigate('/')}
                        sx={{
                            borderRadius: '50px', px: 4, py: 1.5, fontWeight: 700,
                            textTransform: 'none',
                            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                            boxShadow: '0 6px 20px rgba(99,102,241,0.4)',
                            '&:hover': { boxShadow: '0 8px 28px rgba(99,102,241,0.5)' }
                        }}
                    >
                        Go to Home
                    </Button>
                </Stack>
            </MotionBox>
        </Box>
    );
};

export default Unauthorized;
