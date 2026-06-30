import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    TextField,
    Button,
    Typography,
    InputAdornment,
    CircularProgress,
    alpha,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import {
    Email as EmailIcon,
    Lock as LockIcon,
    AdminPanelSettings as AdminIcon,
    ArrowForward as ArrowForwardIcon,
    Security as SecurityIcon,
    BarChart as BarChartIcon,
    ManageAccounts as ManageIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';

const MotionBox = motion(Box);

const FeatureBullet: React.FC<{ icon: React.ReactNode; title: string; sub: string }> = ({ icon, title, sub }) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <Box sx={{
            width: 40, height: 40, borderRadius: '12px',
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, color: 'rgba(255,255,255,0.85)', '& svg': { fontSize: '1.1rem' },
        }}>
            {icon}
        </Box>
        <Box>
            <Typography sx={{ fontWeight: 700, color: 'white', fontSize: '0.88rem', lineHeight: 1.3 }}>{title}</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.78rem', mt: 0.25 }}>{sub}</Typography>
        </Box>
    </Box>
);

const AdminLogin: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await authService.login({
                emailOrPhone: credentials.email,
                password: credentials.password,
            });
            if (response.success && response.data) {
                const { user, tokens } = response.data;
                setAuth(user, tokens.accessToken, tokens.refreshToken);
                toast.success('Admin login successful!');
                setTimeout(() => navigate('/admin/dashboard'), 500);
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Login failed. Check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>

            {/* ── Left Panel ── */}
            {!isMobile && (
                <Box sx={{
                    width: '44%', flexShrink: 0,
                    background: 'linear-gradient(145deg, #0f172a 0%, #1e3a5f 40%, #1e1b4b 100%)',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center',
                    p: 6, position: 'relative', overflow: 'hidden',
                }}>
                    {/* Decorative orbs */}
                    <Box sx={{ position: 'absolute', top: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(30,58,95,0.6) 0%, transparent 70%)', pointerEvents: 'none' }} />
                    <Box sx={{ position: 'absolute', bottom: -60, right: -60, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />

                    {/* Grid pattern */}
                    <Box sx={{
                        position: 'absolute', inset: 0, pointerEvents: 'none',
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
                        backgroundSize: '48px 48px',
                    }} />

                    <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} sx={{ position: 'relative', zIndex: 1 }}>

                        {/* Admin badge */}
                        <Box sx={{
                            display: 'inline-flex', alignItems: 'center', gap: 1.5, mb: 4,
                            px: 2, py: 1, borderRadius: '10px',
                            bgcolor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
                        }}>
                            <AdminIcon sx={{ fontSize: '1rem', color: '#60a5fa' }} />
                            <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.05em' }}>
                                ADMIN PORTAL
                            </Typography>
                        </Box>

                        <Typography sx={{
                            fontSize: 'clamp(1.8rem, 2.5vw, 2.5rem)', fontWeight: 800,
                            color: 'white', lineHeight: 1.2, mb: 2, fontFamily: '"Outfit", sans-serif',
                        }}>
                            Platform{' '}
                            <Box component="span" sx={{ background: 'linear-gradient(90deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                Control Center
                            </Box>
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem', mb: 5, lineHeight: 1.6 }}>
                            Manage salons, users, bookings, and platform performance from a single secure hub.
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 5 }}>
                            <FeatureBullet icon={<ManageIcon />} title="User Management" sub="Control access for all roles" />
                            <FeatureBullet icon={<BarChartIcon />} title="Platform Analytics" sub="Revenue, bookings, and growth" />
                            <FeatureBullet icon={<SecurityIcon />} title="Security Controls" sub="Audit logs and permissions" />
                        </Box>

                        {/* Security notice */}
                        <Box sx={{
                            p: 2.5, borderRadius: '14px',
                            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)',
                        }}>
                            <Typography sx={{ color: 'rgba(248,113,113,0.9)', fontSize: '0.8rem', lineHeight: 1.6 }}>
                                🔒 This is a restricted area. Unauthorized access is prohibited and will be logged.
                            </Typography>
                        </Box>
                    </MotionBox>
                </Box>
            )}

            {/* ── Right Panel ── */}
            <Box sx={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                p: { xs: 3, sm: 5 }, bgcolor: '#f8fafc',
            }}>
                <MotionBox
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    sx={{ width: '100%', maxWidth: 440 }}
                >
                    {/* Mobile badge */}
                    {isMobile && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                            <Box sx={{
                                display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5, py: 1.25,
                                borderRadius: '12px', bgcolor: alpha('#1e3a5f', 0.06), border: '1px solid', borderColor: alpha('#1e3a5f', 0.1),
                            }}>
                                <AdminIcon sx={{ color: '#1e3a5f', fontSize: '1.1rem' }} />
                                <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}>Admin Portal</Typography>
                            </Box>
                        </Box>
                    )}

                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.75, fontFamily: '"Outfit", sans-serif' }}>
                        Admin Sign In
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', mb: 4, lineHeight: 1.6 }}>
                        Enter your administrator credentials to access the dashboard.
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            fullWidth label="Email Address" type="email"
                            value={credentials.email}
                            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                            required
                            sx={{ mb: 2.5 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon sx={{ color: '#94a3b8', fontSize: '1.1rem' }} />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            fullWidth label="Password"
                            type={showPassword ? 'text' : 'password'}
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            required
                            sx={{ mb: 3.5 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon sx={{ color: '#94a3b8', fontSize: '1.1rem' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Typography
                                            onClick={() => setShowPassword(!showPassword)}
                                            sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#6366f1', cursor: 'pointer', userSelect: 'none' }}
                                        >
                                            {showPassword ? 'Hide' : 'Show'}
                                        </Typography>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Button
                            type="submit" variant="contained" fullWidth size="large"
                            disabled={loading || !credentials.email || !credentials.password}
                            endIcon={!loading && <ArrowForwardIcon />}
                            sx={{ height: 52 }}
                        >
                            {loading ? <CircularProgress size={22} color="inherit" /> : 'Sign In to Dashboard'}
                        </Button>
                    </Box>

                    <Box sx={{
                        mt: 4, p: 2, borderRadius: '12px',
                        bgcolor: alpha('#f59e0b', 0.06), border: `1px solid ${alpha('#f59e0b', 0.15)}`,
                    }}>
                        <Typography variant="caption" sx={{ color: '#92400e', lineHeight: 1.6, display: 'block' }}>
                            <strong>Security reminder:</strong> Never share your admin credentials. Session activity is logged for audit purposes.
                        </Typography>
                    </Box>
                </MotionBox>
            </Box>
        </Box>
    );
};

export default AdminLogin;
