import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    TextField,
    Button,
    Typography,
    InputAdornment,
    CircularProgress,
    IconButton,
    Dialog,
    alpha,
    useMediaQuery,
    useTheme,
    ToggleButtonGroup,
    ToggleButton,
} from '@mui/material';
import {
    Person as PersonIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    ContentCut as ScissorsIcon,
    CalendarMonth as CalendarIcon,
    Store as StoreIcon,
    ArrowForward as ArrowForwardIcon,
    Star as StarIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import toast from 'react-hot-toast';
import { AuthResponse, UserRole } from '../../types';
import Logo from '../common/Logo';

const MotionBox = motion(Box);

type AuthStep = 'PHONE_ENTRY' | 'OTP_VERIFICATION' | 'REGISTRATION_DETAILS';

const slideRight = {
    hidden: { opacity: 0, x: 24 },
    show:   { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as any } },
    exit:   { opacity: 0, x: -24, transition: { duration: 0.25 } },
};

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
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(i, e)}
                    onPaste={handlePaste}
                    sx={{
                        width: { xs: 44, sm: 52 },
                        height: { xs: 52, sm: 60 },
                        borderRadius: '14px',
                        border: value[i] ? '2px solid #6366f1' : '1.5px solid #e2e8f0',
                        background: value[i] ? alpha('#6366f1', 0.05) : '#f8fafc',
                        fontSize: '1.4rem',
                        fontWeight: 700,
                        textAlign: 'center',
                        color: '#1e293b',
                        outline: 'none',
                        transition: 'all 0.2s ease',
                        fontFamily: '"Outfit", sans-serif',
                        cursor: 'text',
                        '&:focus': {
                            borderColor: '#6366f1',
                            boxShadow: `0 0 0 3px ${alpha('#6366f1', 0.15)}`,
                            background: 'white',
                        },
                    }}
                />
            ))}
        </Box>
    );
};

/* ── Feature Bullet ── */
const FeatureBullet: React.FC<{ icon: React.ReactNode; title: string; sub: string }> = ({ icon, title, sub }) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <Box sx={{
            width: 44, height: 44, borderRadius: '14px',
            background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, color: 'rgba(255,255,255,0.9)',
            '& svg': { fontSize: '1.2rem' },
        }}>
            {icon}
        </Box>
        <Box>
            <Typography sx={{ fontWeight: 700, color: 'white', fontSize: '0.9rem', lineHeight: 1.3 }}>{title}</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', mt: 0.3 }}>{sub}</Typography>
        </Box>
    </Box>
);

/* ── Step Progress Indicator ── */
const StepIndicator: React.FC<{ step: AuthStep }> = ({ step }) => {
    const steps: AuthStep[] = ['PHONE_ENTRY', 'OTP_VERIFICATION', 'REGISTRATION_DETAILS'];
    const currentIdx = steps.indexOf(step);
    return (
        <Box sx={{ display: 'flex', gap: 0.75, mb: 3 }}>
            {steps.map((s, i) => (
                <Box key={s} sx={{
                    height: 4, borderRadius: 2,
                    flex: i <= currentIdx ? 1 : 0.3,
                    bgcolor: i <= currentIdx ? '#6366f1' : '#e2e8f0',
                    transition: 'all 0.4s ease',
                }} />
            ))}
        </Box>
    );
};

const AuthModal: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();

    const { isLoginModalOpen, closeLoginModal } = useUIStore();
    const setAuth = useAuthStore((state) => state.setAuth);

    const [step, setStep] = useState<AuthStep>('PHONE_ENTRY');
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.CUSTOMER);

    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [dob, setDob] = useState('');
    const [pendingAuth, setPendingAuth] = useState<AuthResponse | null>(null);

    useEffect(() => {
        if (isLoginModalOpen) {
            const currentPath = window.location.pathname;
            if (currentPath !== '/login') window.history.pushState({ modal: true }, '', '/login');
            const handlePopState = () => closeLoginModal();
            window.addEventListener('popstate', handlePopState);
            return () => {
                window.removeEventListener('popstate', handlePopState);
                if (window.location.pathname === '/login') window.history.back();
            };
        }
    }, [isLoginModalOpen, closeLoginModal]);

    useEffect(() => {
        if (!isLoginModalOpen) {
            setStep('PHONE_ENTRY'); setResendTimer(0);
            setPhone(''); setOtp(''); setName(''); setEmail(''); setDob('');
            setPendingAuth(null); setSelectedRole(UserRole.CUSTOMER);
        }
    }, [isLoginModalOpen]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (resendTimer > 0 && step === 'OTP_VERIFICATION') {
            interval = setInterval(() => setResendTimer((p) => p - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer, step]);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!phone.trim() || phone.length < 10) { toast.error('Please enter a valid phone number'); return; }
        setLoading(true);
        try {
            const response = await authService.requestOtp({ phone: phone.trim() });
            if (response.success) {
                setOtp(''); setStep('OTP_VERIFICATION'); setResendTimer(30);
                toast.success('OTP sent to your phone.');
            }
        } catch (err: any) {
            toast.error(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to send OTP');
        } finally { setLoading(false); }
    };

    const handleResendOtp = async () => {
        if (!phone || phone.length < 10) { toast.error('Missing phone number'); return; }
        setLoading(true);
        try {
            const response = await authService.requestOtp({ phone });
            if (response.success) { toast.success('OTP resent!'); setResendTimer(30); }
        } catch (err: any) {
            toast.error(err.response?.data?.error?.message || 'Failed to resend OTP');
        } finally { setLoading(false); }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otp || otp.length < 6) { toast.error('Please enter a valid 6-digit OTP'); return; }
        setLoading(true);
        try {
            const response = await authService.verifyOtp({
                phone, otp,
                ...(step === 'REGISTRATION_DETAILS' ? { name, email, role: selectedRole, dateOfBirth: dob } : {})
            });
            if (response.success) {
                const authPayload = response.data || pendingAuth;
                if (!authPayload) { toast.error('Authentication payload missing'); return; }
                const { user, tokens } = authPayload;
                setAuth(user, tokens.accessToken, tokens.refreshToken);
                toast.success('Welcome to Styler!');
                closeLoginModal();
                switch (user.role) {
                    case UserRole.BARBER: navigate('/barber/dashboard', { replace: true }); break;
                    case UserRole.SALON_OWNER: navigate('/salon-owner/dashboard', { replace: true }); break;
                    case UserRole.SUPER_ADMIN: navigate('/admin/superadmin', { replace: true }); break;
                    default: navigate('/customer/dashboard', { replace: true });
                }
            }
        } catch (err: any) {
            try {
                let errorMessage = 'Verification failed';
                const rawError = err.response?.data?.error?.message || err.response?.data?.message || err.message;
                if (typeof rawError === 'string') errorMessage = rawError;
                else if (Array.isArray(rawError) && rawError.length > 0) errorMessage = String(rawError[0]);
                else if (rawError) errorMessage = String(rawError);

                if (String(errorMessage).toLowerCase().includes('name is required')) {
                    setStep('REGISTRATION_DETAILS');
                } else {
                    toast.error(String(errorMessage));
                }
            } catch { toast.error('Verification failed due to a server error.'); }
        } finally { setLoading(false); }
    };

    const stepTitle: Record<AuthStep, string> = {
        PHONE_ENTRY: 'Welcome back',
        OTP_VERIFICATION: 'Check your phone',
        REGISTRATION_DETAILS: 'Create your account',
    };

    const stepSub: Record<AuthStep, string> = {
        PHONE_ENTRY: 'Sign in or create an account with your phone number.',
        OTP_VERIFICATION: `Enter the 6-digit code we sent to +91 ${phone || '•••••••••'}`,
        REGISTRATION_DETAILS: "You're almost there — just a few more details.",
    };

    return (
        <Dialog
            open={isLoginModalOpen}
            onClose={closeLoginModal}
            maxWidth="lg"
            fullScreen
            PaperProps={{ sx: { borderRadius: 0, overflow: 'hidden', m: 0 } }}
        >
            <Box sx={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>

                {/* ── Close ── */}
                <IconButton
                    onClick={closeLoginModal}
                    sx={{
                        position: 'fixed', right: 20, top: 20, zIndex: 1300,
                        bgcolor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.1)', color: '#64748b',
                        '&:hover': { bgcolor: 'white', color: '#ef4444', transform: 'scale(1.05)' },
                        transition: 'all 0.2s ease',
                    }}
                >
                    <CloseIcon />
                </IconButton>

                {/* ── Left Panel ── */}
                {!isMobile && (
                    <Box sx={{
                        width: '44%', flexShrink: 0, position: 'sticky', top: 0, height: '100vh',
                        background: 'linear-gradient(145deg, #1e1b4b 0%, #312e81 40%, #4c1d95 100%)',
                        display: 'flex', flexDirection: 'column', justifyContent: 'center',
                        p: 6, overflow: 'hidden',
                    }}>
                        <Box sx={{ position: 'absolute', top: -80, left: -80, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)', pointerEvents: 'none' }} />
                        <Box sx={{ position: 'absolute', bottom: -60, right: -60, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />

                        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} sx={{ position: 'relative', zIndex: 1 }}>
                            <Box sx={{ mb: 5 }}>
                                <Logo variant="light" size="large" clickable={false} />
                            </Box>

                            <Typography sx={{
                                fontSize: 'clamp(1.8rem, 2.5vw, 2.5rem)', fontWeight: 800,
                                color: 'white', lineHeight: 1.2, mb: 2, fontFamily: '"Outfit", sans-serif',
                            }}>
                                Your perfect look,{' '}
                                <Box component="span" sx={{ background: 'linear-gradient(90deg, #a78bfa, #f9a8d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                    one tap away.
                                </Box>
                            </Typography>
                            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', mb: 5, lineHeight: 1.6 }}>
                                Join thousands of clients who book premium salon experiences with Styler.
                            </Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 5 }}>
                                <FeatureBullet icon={<ScissorsIcon />} title="Expert Stylists" sub="Handpicked, rated professionals near you" />
                                <FeatureBullet icon={<CalendarIcon />} title="Instant Booking" sub="Real-time availability, zero waiting" />
                                <FeatureBullet icon={<StoreIcon />} title="Premium Salons" sub="Curated venues with verified reviews" />
                            </Box>

                            <Box sx={{
                                p: 3, borderRadius: '16px',
                                background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)',
                                border: '1px solid rgba(255,255,255,0.12)',
                            }}>
                                <Box sx={{ display: 'flex', gap: 0.25, mb: 1.5 }}>
                                    {Array.from({ length: 5 }).map((_, i) => <StarIcon key={i} sx={{ fontSize: 14, color: '#fbbf24' }} />)}
                                </Box>
                                <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.88rem', lineHeight: 1.6, mb: 1.5, fontStyle: 'italic' }}>
                                    "The best salon booking app I've ever used. Found my go-to barber in minutes!"
                                </Typography>
                                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', fontWeight: 600 }}>
                                    — Priya Mehta, Mumbai
                                </Typography>
                            </Box>
                        </MotionBox>
                    </Box>
                )}

                {/* ── Right Panel ── */}
                <Box sx={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    p: { xs: 3, sm: 5 }, bgcolor: '#f8fafc', overflowY: 'auto',
                }}>
                    <Box sx={{ width: '100%', maxWidth: 440 }}>
                        {isMobile && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                                <Logo variant="default" size="medium" clickable={false} />
                            </Box>
                        )}

                        <StepIndicator step={step} />

                        <AnimatePresence mode="wait">
                            <MotionBox key={step} variants={slideRight} initial="hidden" animate="show" exit="exit">
                                <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 0.75, fontFamily: '"Outfit", sans-serif' }}>
                                    {stepTitle[step]}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#64748b', mb: 4, lineHeight: 1.6 }}>
                                    {stepSub[step]}
                                </Typography>

                                {/* Step 1 */}
                                {step === 'PHONE_ENTRY' && (
                                    <Box component="form" onSubmit={handleSendOtp}>
                                        <TextField
                                            fullWidth label="Phone Number" type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                            required placeholder="10-digit mobile number"
                                            sx={{ mb: 3 }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, pr: 1.5, borderRight: '1px solid #e2e8f0', mr: 0.5 }}>
                                                            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>🇮🇳 +91</Typography>
                                                        </Box>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        <Button
                                            type="submit" variant="contained" fullWidth size="large"
                                            disabled={loading || phone.length < 10}
                                            endIcon={!loading && <ArrowForwardIcon />}
                                            sx={{ height: 52 }}
                                        >
                                            {loading ? <CircularProgress size={22} color="inherit" /> : 'Continue'}
                                        </Button>
                                        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 3, color: '#94a3b8', lineHeight: 1.6 }}>
                                            By continuing, you agree to our{' '}
                                            <Box component="span" sx={{ color: '#6366f1', cursor: 'pointer', fontWeight: 600 }}>Terms of Service</Box>
                                            {' '}and{' '}
                                            <Box component="span" sx={{ color: '#6366f1', cursor: 'pointer', fontWeight: 600 }}>Privacy Policy</Box>.
                                        </Typography>
                                    </Box>
                                )}

                                {/* Step 2 */}
                                {step === 'OTP_VERIFICATION' && (
                                    <Box component="form" onSubmit={handleVerifyOtp}>
                                        <OtpInput value={otp} onChange={setOtp} />
                                        <Button
                                            type="submit" variant="contained" fullWidth size="large"
                                            disabled={loading || otp.length < 6}
                                            sx={{ height: 52, mt: 4 }}
                                        >
                                            {loading ? <CircularProgress size={22} color="inherit" /> : 'Verify & Continue'}
                                        </Button>
                                        <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
                                            <Button
                                                type="button" onClick={handleResendOtp}
                                                disabled={resendTimer > 0 || loading}
                                                sx={{ color: resendTimer > 0 ? '#94a3b8' : '#6366f1', textTransform: 'none', fontWeight: 600, fontSize: '0.88rem' }}
                                            >
                                                {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                                            </Button>
                                            <Button
                                                type="button"
                                                onClick={() => { setStep('PHONE_ENTRY'); setResendTimer(0); setOtp(''); setPendingAuth(null); }}
                                                sx={{ color: '#64748b', textTransform: 'none', fontWeight: 600, fontSize: '0.88rem' }}
                                            >
                                                ← Change phone number
                                            </Button>
                                        </Box>
                                    </Box>
                                )}

                                {/* Step 3 */}
                                {step === 'REGISTRATION_DETAILS' && (
                                    <Box component="form" onSubmit={handleVerifyOtp}>
                                        <Typography variant="caption" sx={{ display: 'block', mb: 1.5, fontWeight: 700, color: '#64748b', letterSpacing: '0.05em' }}>
                                            I AM A
                                        </Typography>
                                        <ToggleButtonGroup
                                            value={selectedRole} exclusive
                                            onChange={(_, v) => v && setSelectedRole(v)}
                                            fullWidth sx={{ mb: 3, gap: 1 }}
                                        >
                                            {[
                                                { value: UserRole.CUSTOMER, label: 'Customer' },
                                                { value: UserRole.BARBER, label: 'Barber' },
                                                { value: UserRole.SALON_OWNER, label: 'Owner' },
                                            ].map(({ value, label }) => (
                                                <ToggleButton
                                                    key={value} value={value}
                                                    sx={{
                                                        flex: 1, borderRadius: '12px !important', py: 1.5,
                                                        border: '1.5px solid #e2e8f0 !important',
                                                        fontWeight: 600, textTransform: 'none', fontSize: '0.88rem', color: '#64748b',
                                                        '&.Mui-selected': {
                                                            bgcolor: alpha('#6366f1', 0.08),
                                                            borderColor: '#6366f1 !important',
                                                            color: '#6366f1',
                                                        },
                                                    }}
                                                >
                                                    {label}
                                                </ToggleButton>
                                            ))}
                                        </ToggleButtonGroup>

                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                                            <TextField
                                                fullWidth label="Full Name" value={name}
                                                onChange={(e) => setName(e.target.value)} required
                                                InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: '#94a3b8', fontSize: '1.1rem' }} /></InputAdornment> }}
                                            />
                                            <TextField
                                                fullWidth label="Email Address" type="email" value={email}
                                                onChange={(e) => setEmail(e.target.value)} required
                                                InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: '#94a3b8', fontSize: '1.1rem' }} /></InputAdornment> }}
                                            />
                                            <TextField
                                                fullWidth label="Date of Birth" type="date" value={dob}
                                                onChange={(e) => setDob(e.target.value)} required
                                                InputLabelProps={{ shrink: true }}
                                                InputProps={{ startAdornment: <InputAdornment position="start"><CalendarIcon sx={{ color: '#94a3b8', fontSize: '1.1rem' }} /></InputAdornment> }}
                                            />
                                        </Box>

                                        <Button
                                            type="submit" variant="contained" fullWidth size="large"
                                            disabled={loading || !name || !email || !dob}
                                            sx={{ height: 52 }}
                                        >
                                            {loading ? <CircularProgress size={22} color="inherit" /> : 'Complete Registration'}
                                        </Button>
                                    </Box>
                                )}
                            </MotionBox>
                        </AnimatePresence>
                    </Box>
                </Box>
            </Box>
        </Dialog>
    );
};

export default AuthModal;
