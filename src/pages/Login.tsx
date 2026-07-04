import React, { useState, useEffect, useRef } from 'react';
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
    Person as PersonIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    CalendarMonth as CalendarIcon,
    ArrowForward as ArrowForwardIcon,
    CheckCircleOutlined as CheckIcon,
    Star as StarIcon,
    TrendingUp as TrendingIcon,
    Groups as PeopleIcon,
    BarChart as AnalyticsIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../services/authService';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';
import { AuthResponse, UserRole } from '../types';
import Logo from '../components/common/Logo';

const MotionBox = motion(Box);

/* ── Variants ── */
const slideRight = {
    hidden: { opacity: 0, x: 24 },
    show:   { opacity: 1, x: 0,  transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] } },
    exit:   { opacity: 0, x: -24, transition: { duration: 0.3 } },
};

const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show:   { opacity: 1, y: 0,  transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
};

const stagger = {
    hidden: {},
    show:   { transition: { staggerChildren: 0.08 } },
};

/* ── Feature Bullet ── */
const FeatureBullet: React.FC<{ icon: React.ReactNode; title: string; sub: string }> = ({ icon, title, sub }) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <Box
            sx={{
                width: 44,
                height: 44,
                borderRadius: '14px',
                background: 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: 'rgba(255,255,255,0.9)',
                '& svg': { fontSize: '1.2rem' },
            }}
        >
            {icon}
        </Box>
        <Box>
            <Typography sx={{ fontWeight: 700, color: 'white', fontSize: '0.9rem', lineHeight: 1.3 }}>
                {title}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', mt: 0.3 }}>
                {sub}
            </Typography>
        </Box>
    </Box>
);

/* ── OTP Input ── */
const OtpInput: React.FC<{ value: string; onChange: (v: string) => void; length?: number }> = ({ value, onChange, length = 6 }) => {
    const inputs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const char = e.target.value.replace(/\D/g, '').slice(-1);
        const arr = value.split('');
        arr[i] = char;
        const next = arr.join('').slice(0, length);
        onChange(next);
        if (char && i < length - 1) inputs.current[i + 1]?.focus();
    };

    const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !value[i] && i > 0) inputs.current[i - 1]?.focus();
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
        onChange(pasted);
        const nextIdx = Math.min(pasted.length, length - 1);
        inputs.current[nextIdx]?.focus();
        e.preventDefault();
    };

    return (
        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center' }}>
            {Array.from({ length }).map((_, i) => (
                <Box
                    key={i}
                    component="input"
                    ref={(el: HTMLInputElement | null) => { inputs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={value[i] || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(i, e)}
                    onKeyDown={(e: React.KeyboardEvent) => handleKeyDown(i, e)}
                    onPaste={i === 0 ? handlePaste : undefined}
                    sx={{
                        width: { xs: 44, sm: 52 },
                        height: { xs: 52, sm: 60 },
                        border: '2px solid',
                        borderColor: value[i] ? '#6366f1' : '#e2e8f0',
                        borderRadius: '14px',
                        textAlign: 'center',
                        fontSize: '1.4rem',
                        fontWeight: 800,
                        color: '#0f172a',
                        bgcolor: value[i] ? alpha('#6366f1', 0.05) : '#f8fafc',
                        fontFamily: '"Outfit", sans-serif',
                        outline: 'none',
                        transition: 'all 0.2s ease',
                        cursor: 'text',
                        '&:focus': {
                            borderColor: '#6366f1',
                            bgcolor: alpha('#6366f1', 0.04),
                            boxShadow: `0 0 0 3px ${alpha('#6366f1', 0.12)}`,
                        },
                    }}
                />
            ))}
        </Box>
    );
};

/* ── Step Indicator ── */
const StepIndicator: React.FC<{ current: number; total: number }> = ({ current, total }) => (
    <Box sx={{ display: 'flex', gap: 0.75, mb: 3 }}>
        {Array.from({ length: total }).map((_, i) => (
            <Box
                key={i}
                sx={{
                    height: 4,
                    borderRadius: '2px',
                    flex: i < current ? 1 : 0.3,
                    bgcolor: i < current ? '#6366f1' : '#e2e8f0',
                    transition: 'all 0.4s ease',
                }}
            />
        ))}
    </Box>
);

type AuthStep = 'PHONE_ENTRY' | 'OTP_VERIFICATION' | 'REGISTRATION_DETAILS';

const Login: React.FC<{ isRegisterMode?: boolean }> = ({ isRegisterMode = false }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [step, setStep] = useState<AuthStep>('PHONE_ENTRY');
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [dob, setDob] = useState('');
    const [pendingAuth, setPendingAuth] = useState<AuthResponse | null>(null);

    const setAuth = useAuthStore((state) => state.setAuth);
    const { isAuthenticated, user } = useAuthStore();

    const getDashboardPath = (role: string) => {
        switch (role) {
            case 'barber': return '/barber/dashboard';
            case 'salon_owner': return '/salon-owner/dashboard';
            case 'superadmin': return '/admin/superadmin';
            default: return '/salons';
        }
    };

    const stepIndex = step === 'PHONE_ENTRY' ? 1 : step === 'OTP_VERIFICATION' ? 2 : 3;

    useEffect(() => {
        if (isAuthenticated && user) navigate(getDashboardPath(user.role), { replace: true });
    }, [isAuthenticated, user]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (resendTimer > 0 && step === 'OTP_VERIFICATION') {
            interval = setInterval(() => setResendTimer(prev => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer, step]);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!phone.trim() || phone.length < 10) { toast.error('Please enter a valid 10-digit phone number'); return; }
        setLoading(true);
        try {
            const res = await authService.requestOtp({ phone: phone.trim() });
            if (res.success) { setOtp(''); setStep('OTP_VERIFICATION'); setResendTimer(30); toast.success('OTP sent to your phone.'); }
        } catch (err: any) {
            toast.error(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to send OTP');
        } finally { setLoading(false); }
    };

    const handleResendOtp = async () => {
        if (!phone || phone.length < 10 || resendTimer > 0 || loading) return;
        setLoading(true);
        try {
            const res = await authService.requestOtp({ phone });
            if (res.success) { toast.success('OTP resent!'); setResendTimer(30); }
        } catch (err: any) {
            toast.error(err.response?.data?.error?.message || 'Failed to resend OTP');
        } finally { setLoading(false); }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otp || otp.length < 6) { toast.error('Please enter the complete 6-digit OTP'); return; }
        setLoading(true);
        try {
            const res = await authService.verifyOtp({
                phone,
                otp,
                ...(step === 'REGISTRATION_DETAILS' ? { name, email, dateOfBirth: dob, role: 'salon_owner' } : {}),
            });
            if (res.success) {
                const payload = res.data || pendingAuth;
                if (!payload) { toast.error('Authentication payload missing'); return; }
                const { user: authUser, tokens } = payload;
                setAuth(authUser, tokens.accessToken, tokens.refreshToken);
                toast.success('Welcome to StylerApp!');
                setTimeout(() => navigate(getDashboardPath(authUser.role)), 400);
            }
        } catch (err: any) {
            const raw = err.response?.data?.error?.message || err.response?.data?.message || err.message || 'Verification failed';
            if (String(raw).toLowerCase().includes('name is required')) {
                setStep('REGISTRATION_DETAILS');
            } else {
                toast.error(String(raw));
            }
        } finally { setLoading(false); }
    };

    /* ── FORM CONTENT ── */
    const formContent = (
        <AnimatePresence mode="wait">
            {step === 'PHONE_ENTRY' && (
                <MotionBox key="phone" variants={slideRight} initial="hidden" animate="show" exit="exit">
                    <StepIndicator current={1} total={3} />
                    <Typography variant="h4" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: '#0f172a', mb: 0.75, letterSpacing: '-0.02em' }}>
                        Partner Login
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748b', mb: 4, lineHeight: 1.6 }}>
                        Enter your registered phone number to access your partner dashboard.
                    </Typography>

                    <Box component="form" onSubmit={handleSendOtp}>
                        <TextField
                            fullWidth
                            label="Phone Number"
                            type="tel"
                            value={phone}
                            onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            required
                            placeholder="Enter your 10-digit phone number"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, pr: 1, borderRight: '1px solid #e2e8f0' }}>
                                            <PhoneIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
                                            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>+91</Typography>
                                        </Box>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 3 }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            disabled={loading || phone.length < 10}
                            endIcon={!loading && <ArrowForwardIcon />}
                            sx={{
                                height: 52,
                                borderRadius: '14px',
                                fontWeight: 700,
                                fontSize: '0.975rem',
                            }}
                        >
                            {loading ? <CircularProgress size={22} color="inherit" /> : 'Continue'}
                        </Button>

                        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 3, color: '#94a3b8', lineHeight: 1.6 }}>
                            By continuing, you agree to our{' '}
                            <Box component="span" sx={{ color: '#6366f1', cursor: 'pointer', fontWeight: 600 }}>Terms</Box>
                            {' '}and{' '}
                            <Box component="span" sx={{ color: '#6366f1', cursor: 'pointer', fontWeight: 600 }}>Privacy Policy</Box>.
                        </Typography>
                    </Box>
                </MotionBox>
            )}

            {step === 'OTP_VERIFICATION' && (
                <MotionBox key="otp" variants={slideRight} initial="hidden" animate="show" exit="exit">
                    <StepIndicator current={2} total={3} />
                    <Typography variant="h4" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: '#0f172a', mb: 0.75, letterSpacing: '-0.02em' }}>
                        Verify your number
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748b', mb: 4, lineHeight: 1.6 }}>
                        We sent a 6-digit code to{' '}
                        <Box component="span" sx={{ color: '#0f172a', fontWeight: 700 }}>+91 {phone}</Box>
                    </Typography>

                    <Box component="form" onSubmit={handleVerifyOtp}>
                        <Box sx={{ mb: 4 }}>
                            <OtpInput value={otp} onChange={setOtp} />
                        </Box>

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            disabled={loading || otp.length < 6}
                            endIcon={!loading && <CheckIcon />}
                            sx={{ height: 52, borderRadius: '14px', fontWeight: 700, fontSize: '0.975rem', mb: 3 }}
                        >
                            {loading ? <CircularProgress size={22} color="inherit" /> : 'Verify & Continue'}
                        </Button>

                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                            <Button
                                onClick={handleResendOtp}
                                disabled={resendTimer > 0 || loading}
                                variant="text"
                                size="small"
                                sx={{
                                    color: resendTimer > 0 ? '#94a3b8' : '#6366f1',
                                    fontWeight: 600,
                                    borderRadius: '8px',
                                    fontSize: '0.85rem',
                                    '&:hover': { bgcolor: resendTimer > 0 ? 'transparent' : alpha('#6366f1', 0.06) },
                                }}
                            >
                                {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend OTP'}
                            </Button>

                            <Button
                                onClick={() => { setStep('PHONE_ENTRY'); setResendTimer(0); setOtp(''); }}
                                variant="text"
                                size="small"
                                sx={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.82rem', borderRadius: '8px', '&:hover': { color: '#64748b', bgcolor: '#f8fafc' } }}
                            >
                                Change phone number
                            </Button>
                        </Box>
                    </Box>
                </MotionBox>
            )}

            {step === 'REGISTRATION_DETAILS' && (
                <MotionBox key="register" variants={slideRight} initial="hidden" animate="show" exit="exit">
                    <StepIndicator current={3} total={3} />
                    <Typography variant="h4" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: '#0f172a', mb: 0.75, letterSpacing: '-0.02em' }}>
                        Set up your account
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748b', mb: 4, lineHeight: 1.6 }}>
                        A few details to personalise your partner experience.
                    </Typography>

                    <Box component="form" onSubmit={handleVerifyOtp}>
                        <MotionBox variants={stagger} initial="hidden" animate="show" sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mb: 3.5 }}>
                            <MotionBox variants={fadeUp}>
                                <TextField
                                    fullWidth
                                    label="Full Name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                    placeholder="Your full name"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: '#94a3b8', fontSize: 20 }} /></InputAdornment>,
                                    }}
                                />
                            </MotionBox>

                            <MotionBox variants={fadeUp}>
                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    placeholder="you@example.com"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: '#94a3b8', fontSize: 20 }} /></InputAdornment>,
                                    }}
                                />
                            </MotionBox>

                            <MotionBox variants={fadeUp}>
                                <TextField
                                    fullWidth
                                    label="Date of Birth"
                                    type="date"
                                    value={dob}
                                    onChange={e => setDob(e.target.value)}
                                    required
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><CalendarIcon sx={{ color: '#94a3b8', fontSize: 20 }} /></InputAdornment>,
                                    }}
                                />
                            </MotionBox>
                        </MotionBox>

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            disabled={loading || !name || !email || !dob}
                            endIcon={!loading && <ArrowForwardIcon />}
                            sx={{ height: 52, borderRadius: '14px', fontWeight: 700, fontSize: '0.975rem' }}
                        >
                            {loading ? <CircularProgress size={22} color="inherit" /> : 'Complete Registration'}
                        </Button>
                    </Box>
                </MotionBox>
            )}
        </AnimatePresence>
    );

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '#f8fafc' }}>

            {/* ── LEFT PANEL ── */}
            {!isMobile && (
                <Box
                    sx={{
                        width: '44%',
                        minHeight: '100vh',
                        position: 'sticky',
                        top: 0,
                        background: 'linear-gradient(145deg, #1e1b4b 0%, #2d1b69 40%, #0f172a 100%)',
                        display: 'flex',
                        flexDirection: 'column',
                        p: 6,
                        overflow: 'hidden',
                    }}
                >
                    {/* Background decoration */}
                    <Box sx={{ position: 'absolute', top: '-15%', right: '-15%', width: '55%', height: '55%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 65%)', pointerEvents: 'none' }} />
                    <Box sx={{ position: 'absolute', bottom: '5%', left: '-10%', width: '40%', height: '40%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.18) 0%, transparent 65%)', pointerEvents: 'none' }} />
                    <Box sx={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '40px 40px', maskImage: 'radial-gradient(ellipse at 30% 30%, black 20%, transparent 70%)', WebkitMaskImage: 'radial-gradient(ellipse at 30% 30%, black 20%, transparent 70%)' }} />

                    {/* Content */}
                    <Box sx={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ mb: 'auto' }}>
                            <Logo variant="light" size="medium" clickable={false} />
                            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, mt: 1.5, px: 1.5, py: 0.5, borderRadius: '50px', bgcolor: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.35)' }}>
                                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#6ee7b7', flexShrink: 0 }} />
                                <Typography sx={{ color: '#a5b4fc', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Partner Dashboard</Typography>
                            </Box>
                        </Box>

                        <Box sx={{ my: 'auto' }}>
                            <Typography
                                variant="h2"
                                sx={{ color: 'white', fontFamily: '"Outfit", sans-serif', fontWeight: 800, mb: 2, lineHeight: 1.12, letterSpacing: '-0.025em' }}
                            >
                                Grow your salon
                                <br />
                                <Box component="span" sx={{ background: 'linear-gradient(135deg, #6ee7b7 0%, #a5b4fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                                    with confidence.
                                </Box>
                            </Typography>

                            <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem', lineHeight: 1.75, mb: 5, maxWidth: 360 }}>
                                The complete business dashboard for salons, spas & wellness businesses across India.
                            </Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mb: 5 }}>
                                <FeatureBullet icon={<AnalyticsIcon />} title="Revenue & Analytics"  sub="Track earnings, appointments & growth in real-time" />
                                <FeatureBullet icon={<CalendarIcon />}  title="Smart Scheduling"     sub="Manage staff availability & bookings effortlessly" />
                                <FeatureBullet icon={<PeopleIcon />}    title="Client Growth"         sub="Reach thousands of new customers in your city" />
                            </Box>

                            {/* Stats row */}
                            <Box sx={{ display: 'flex', gap: 3, pt: 4, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                                {[
                                    { value: '10K+', label: 'Business partners' },
                                    { value: '0%',   label: 'Commission — 3 months' },
                                    { value: '48h',  label: 'To go live' },
                                ].map((s) => (
                                    <Box key={s.label}>
                                        <Typography sx={{ fontWeight: 900, color: '#a5b4fc', fontSize: '1.3rem', lineHeight: 1 }}>{s.value}</Typography>
                                        <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', mt: 0.4, lineHeight: 1.3 }}>{s.label}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>

                        {/* Partner Testimonial */}
                        <Box
                            sx={{
                                mt: 5,
                                p: 2.5,
                                borderRadius: '16px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.09)',
                                backdropFilter: 'blur(8px)',
                            }}
                        >
                            <Box sx={{ display: 'flex', gap: 0.5, mb: 1.5 }}>
                                {[...Array(5)].map((_, i) => <StarIcon key={i} sx={{ color: '#fbbf24', fontSize: 14 }} />)}
                            </Box>
                            <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', lineHeight: 1.7, fontStyle: 'italic', mb: 1.5 }}>
                                "Styler brought us 200+ new clients in our first month. The booking dashboard is a game-changer for our entire team."
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: alpha('#6ee7b7', 0.2), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Typography sx={{ color: '#6ee7b7', fontWeight: 800, fontSize: '0.75rem' }}>K</Typography>
                                </Box>
                                <Box>
                                    <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.75rem', fontWeight: 700 }}>Kavya R.</Typography>
                                    <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.68rem' }}>Salon Owner, Bangalore</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            )}

            {/* ── RIGHT PANEL ── */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: { xs: 3, sm: 5 },
                    minHeight: '100vh',
                }}
            >
                <Box sx={{ width: '100%', maxWidth: 440 }}>
                    {/* Mobile logo */}
                    {isMobile && (
                        <Box sx={{ mb: 4, textAlign: 'center' }}>
                            <Logo variant="default" size="medium" clickable={false} />
                        </Box>
                    )}

                    {formContent}
                </Box>
            </Box>
        </Box>
    );
};

export default Login;
