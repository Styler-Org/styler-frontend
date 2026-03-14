import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    TextField,
    Button,
    CardContent,
    Typography,
    InputAdornment,
    CircularProgress,
} from '@mui/material';
import {
    Person as PersonIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    VpnKey as VpnKeyIcon,
    ContentCut as ScissorsIcon,
    CalendarMonth as CalendarIcon,
    Store as StoreIcon,
    ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { authService } from '../services/authService';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';
import { AuthResponse, UserRole } from '../types';
import Logo from '../components/common/Logo';
import './Login.css';

const MotionBox = motion(Box);

const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

type AuthStep = 'PHONE_ENTRY' | 'OTP_VERIFICATION' | 'REGISTRATION_DETAILS';

interface LoginProps {
    isRegisterMode?: boolean;
}

const Login: React.FC<LoginProps> = ({ isRegisterMode = false }) => {
    const [step, setStep] = useState<AuthStep>('PHONE_ENTRY');
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [dob, setDob] = useState('');
    const [pendingAuth, setPendingAuth] = useState<AuthResponse | null>(null);

    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);
    const { isAuthenticated, user } = useAuthStore();

    useEffect(() => {
        if (isAuthenticated && user) {
            const dashboardPath = getDashboardPath(user.role);
            navigate(dashboardPath, { replace: true });
        }
    }, [isAuthenticated, user, navigate]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (resendTimer > 0 && step === 'OTP_VERIFICATION') {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer, step]);

    const getDashboardPath = (role: string) => {
        switch (role) {
            case 'barber': return '/barber/dashboard';
            case 'salon_owner': return '/salon-owner/dashboard';
            case 'superadmin': return '/admin/superadmin';
            case 'customer':
            default: return '/salons';
        }
    };

    const normalizePhone = (value: string) => value.replace(/\D/g, '').slice(-10);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!phone.trim() || phone.length < 10) {
            toast.error('Please enter a valid phone number');
            return;
        }

        setLoading(true);
        try {
            const response = await authService.requestOtp({ phone: phone.trim() });
            if (response.success) {
                setOtp('');
                setStep('OTP_VERIFICATION');
                setResendTimer(30);
                toast.success('OTP sent to your phone.');
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.error?.message || err.response?.data?.message || 'Failed to send OTP';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleRequestOtp = async (e?: React.FormEvent) => {
        e?.preventDefault();

        if (!phone || phone.length < 10) {
            toast.error('Missing phone number for OTP verification');
            return;
        }

        setLoading(true);
        try {
            const response = await authService.requestOtp({ phone });
            if (response.success) {
                toast.success('OTP sent successfully!');
                setResendTimer(30);
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.error?.message || err.response?.data?.message || 'Failed to send OTP';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!otp || otp.length < 6) {
            toast.error('Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);
        try {
            const response = await authService.verifyOtp({
                phone,
                otp,
                ...(step === 'REGISTRATION_DETAILS' ? { name, email, dateOfBirth: dob } : {})
            });

            if (response.success) {
                const authPayload = response.data || pendingAuth;

                if (!authPayload) {
                    toast.error('Authentication payload missing after OTP verification');
                    return;
                }

                const { user: authUser, tokens } = authPayload;
                setAuth(authUser, tokens.accessToken, tokens.refreshToken);
                toast.success('Two-step authentication successful!');

                const dashboardPath = getDashboardPath(authUser.role);
                setTimeout(() => navigate(dashboardPath), 500);
            }
        } catch (err: any) {
            try {
                let errorMessage = 'Verification failed';
                const rawError = err.response?.data?.error?.message || err.response?.data?.message || err.response?.data?.name || err.message;

                if (typeof rawError === 'string') {
                    errorMessage = rawError;
                } else if (Array.isArray(rawError) && rawError.length > 0) {
                    errorMessage = String(rawError[0]);
                } else if (rawError) {
                    errorMessage = String(rawError);
                }

                if (String(errorMessage).toLowerCase().includes('name is required')) {
                    setStep('REGISTRATION_DETAILS');
                } else {
                    toast.error(String(errorMessage));
                }
            } catch (innerErr) {
                console.error('Error parsing backend response:', innerErr);
                toast.error('Verification failed due to a server error.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className="login-page">
            <Box className="login-left">
                <MotionBox
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="login-branding"
                >
                    <Box sx={{ mb: 4 }}>
                        <Logo variant="light" size="large" clickable={false} />
                    </Box>
                    <Typography className="login-tagline">
                        Experience the art of grooming with StylerApp. Check in to check out the best salons near you.
                    </Typography>

                    <Box className="login-features">
                        <Box className="login-feature">
                            <Box className="login-feature-icon"><ScissorsIcon /></Box>
                            <Box>
                                <Typography fontWeight={700}>Expert Stylists</Typography>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>Top-tier professionals</Typography>
                            </Box>
                        </Box>
                        <Box className="login-feature">
                            <Box className="login-feature-icon"><CalendarIcon /></Box>
                            <Box>
                                <Typography fontWeight={700}>Easy Booking</Typography>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>Schedule in seconds</Typography>
                            </Box>
                        </Box>
                        <Box className="login-feature">
                            <Box className="login-feature-icon"><StoreIcon /></Box>
                            <Box>
                                <Typography fontWeight={700}>Premium Salons</Typography>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>Curated locations</Typography>
                            </Box>
                        </Box>
                    </Box>
                </MotionBox>
            </Box>

            <Box className="login-right">
                <MotionBox
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="login-form-container"
                >
                    <Box className="login-form-header">
                        <Typography variant="h1">
                            {step === 'PHONE_ENTRY' && 'Welcome'}
                            {step === 'OTP_VERIFICATION' && 'Verify OTP'}
                            {step === 'REGISTRATION_DETAILS' && 'Welcome to Styler! 🎉'}
                        </Typography>
                        <Typography variant="body1">
                            {step === 'PHONE_ENTRY' && 'Enter your phone number to continue.'}
                            {step === 'OTP_VERIFICATION' && `Step 2: Enter the 6-digit OTP sent to ${phone}`}
                            {step === 'REGISTRATION_DETAILS' && 'It looks like you are new here. Please complete your profile to continue.'}
                        </Typography>
                    </Box>

                    <CardContent sx={{ p: 0, mt: 4 }}>
                        {step === 'PHONE_ENTRY' && (
                            <Box component="form" onSubmit={handleSendOtp} className="login-form">
                                <MotionBox variants={staggerContainer} initial="hidden" animate="show">
                                    <MotionBox variants={itemVariant}>
                                        <TextField
                                            fullWidth
                                            label="Phone Number"
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            required
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PhoneIcon sx={{ color: '#94a3b8' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{ mb: 4 }}
                                        />
                                    </MotionBox>

                                    <MotionBox variants={itemVariant}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            fullWidth
                                            size="large"
                                            disabled={loading || phone.length < 10}
                                            endIcon={!loading && <ArrowForwardIcon />}
                                            sx={{
                                                height: 56,
                                                borderRadius: '16px',
                                                background: 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)',
                                                boxShadow: '0 8px 20px rgba(79, 70, 229, 0.25)',
                                                textTransform: 'none',
                                                fontSize: '1.1rem',
                                                fontWeight: 600,
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #4338ca 0%, #2e287c 100%)',
                                                    boxShadow: '0 12px 25px rgba(79, 70, 229, 0.4)',
                                                    transform: 'translateY(-2px)'
                                                },
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                            }}
                                        >
                                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Continue'}
                                        </Button>
                                    </MotionBox>
                                </MotionBox>
                            </Box>
                        )}

                        {step === 'OTP_VERIFICATION' && (
                            <Box component="form" onSubmit={handleVerifyOtp} className="login-form">
                                <MotionBox variants={staggerContainer} initial="hidden" animate="show">
                                    <MotionBox variants={itemVariant}>
                                        <TextField
                                            fullWidth
                                            label="Enter OTP"
                                            type="text"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            required
                                            inputProps={{ maxLength: 6 }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <VpnKeyIcon sx={{ color: '#94a3b8' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{ mb: 4 }}
                                        />
                                    </MotionBox>

                                    <MotionBox variants={itemVariant}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            fullWidth
                                            size="large"
                                            disabled={loading || otp.length < 6}
                                            endIcon={!loading && <ArrowForwardIcon />}
                                            sx={{
                                                height: 56,
                                                borderRadius: '16px',
                                                background: 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)',
                                                boxShadow: '0 8px 20px rgba(79, 70, 229, 0.25)',
                                                textTransform: 'none',
                                                fontSize: '1.1rem',
                                                fontWeight: 600,
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #4338ca 0%, #2e287c 100%)',
                                                    boxShadow: '0 12px 25px rgba(79, 70, 229, 0.4)',
                                                    transform: 'translateY(-2px)'
                                                },
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                            }}
                                        >
                                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify OTP'}
                                        </Button>
                                    </MotionBox>

                                    <MotionBox variants={itemVariant} sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
                                        <Button
                                            type="button"
                                            onClick={() => handleRequestOtp()}
                                            disabled={resendTimer > 0 || loading}
                                            sx={{
                                                color: resendTimer > 0 ? '#94a3b8' : '#4f46e5',
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                '&:hover': {
                                                    color: resendTimer > 0 ? '#94a3b8' : '#4338ca',
                                                    background: resendTimer > 0 ? 'transparent' : 'rgba(79, 70, 229, 0.05)',
                                                    borderRadius: '12px'
                                                }
                                            }}
                                        >
                                            {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                                        </Button>

                                        <Button
                                            type="button"
                                            onClick={() => {
                                                setStep('PHONE_ENTRY');
                                                setResendTimer(0);
                                                setOtp('');
                                                setPendingAuth(null);
                                            }}
                                            sx={{
                                                color: '#64748b',
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                '&:hover': {
                                                    color: '#4f46e5',
                                                    background: 'rgba(79, 70, 229, 0.05)',
                                                    borderRadius: '12px'
                                                }
                                            }}
                                        >
                                            Change Phone Number
                                        </Button>
                                    </MotionBox>
                                </MotionBox>
                            </Box>
                        )}

                        {step === 'REGISTRATION_DETAILS' && (
                            <Box component="form" onSubmit={handleVerifyOtp} className="login-form">
                                <MotionBox variants={staggerContainer} initial="hidden" animate="show">
                                    <MotionBox variants={itemVariant} sx={{ display: 'grid', gap: 2.5, mb: 4 }}>
                                        <TextField
                                            fullWidth
                                            label="Full Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: '#94a3b8' }} /></InputAdornment>,
                                            }}
                                        />

                                        <TextField
                                            fullWidth
                                            label="Email Address"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: '#94a3b8' }} /></InputAdornment>,
                                            }}
                                        />

                                        <TextField
                                            fullWidth
                                            label="Date of Birth"
                                            type="date"
                                            value={dob}
                                            onChange={(e) => setDob(e.target.value)}
                                            required
                                            InputLabelProps={{ shrink: true }}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start"><CalendarIcon sx={{ color: '#94a3b8' }} /></InputAdornment>,
                                            }}
                                        />
                                    </MotionBox>

                                    <MotionBox variants={itemVariant}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            fullWidth
                                            size="large"
                                            disabled={loading || !name || !email || !dob}
                                            sx={{
                                                height: 56,
                                                borderRadius: '16px',
                                                background: 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)',
                                                boxShadow: '0 8px 20px rgba(79, 70, 229, 0.25)',
                                                textTransform: 'none',
                                                fontSize: '1.1rem',
                                                fontWeight: 600,
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #4338ca 0%, #2e287c 100%)',
                                                    boxShadow: '0 12px 25px rgba(79, 70, 229, 0.4)',
                                                    transform: 'translateY(-2px)'
                                                },
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                            }}
                                        >
                                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Complete Registration'}
                                        </Button>
                                    </MotionBox>
                                </MotionBox>
                            </Box>
                        )}
                    </CardContent>
                </MotionBox>
            </Box>
        </Box>
    );
};

export default Login;
