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
    PersonAdd as PersonAddIcon,
    ContentCut as ScissorsIcon,
    CalendarMonth as CalendarIcon,
    Store as StoreIcon,
    ArrowForward as ArrowForwardIcon,
    VpnKey as VpnKeyIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { authService } from '../services/authService';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';
import { UserRole } from '../types';
import Logo from '../components/common/Logo';
import './Login.css';

const MotionBox = motion(Box);

type OtpStep = 'PHONE_ENTRY' | 'OTP_VERIFICATION' | 'REGISTRATION_DETAILS';

interface LoginProps {
    isRegisterMode?: boolean;
}

const Login: React.FC<LoginProps> = ({ isRegisterMode = false }) => {
    const [step, setStep] = useState<OtpStep>('PHONE_ENTRY');
    const [loading, setLoading] = useState(false);

    // Form States
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);
    const { isAuthenticated, user } = useAuthStore();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated && user) {
            const dashboardPath = getDashboardPath(user.role);
            navigate(dashboardPath, { replace: true });
        }
    }, [isAuthenticated, user, navigate]);

    const getDashboardPath = (role: string) => {
        switch (role) {
            case 'barber': return '/barber/dashboard';
            case 'salon_owner': return '/salon-owner/dashboard';
            case 'superadmin': return '/admin/superadmin';
            case 'customer':
            default: return '/customer/dashboard';
        }
    };

    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!phone || phone.length < 10) {
            toast.error('Please enter a valid phone number');
            return;
        }

        setLoading(true);
        try {
            const response = await authService.requestOtp({ phone });
            if (response.success) {
                toast.success('OTP sent successfully!');
                setStep('OTP_VERIFICATION');
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
                ...(step === 'REGISTRATION_DETAILS' ? { name, email } : {})
            });

            if (response.success && response.data) {
                const { user, tokens } = response.data;
                setAuth(user, tokens.accessToken, tokens.refreshToken);
                toast.success('Authentication successful!');

                const dashboardPath = getDashboardPath(user.role);
                setTimeout(() => navigate(dashboardPath), 500);
            }
        } catch (err: any) {
            try {
                // Safely parse error message, handling potential arrays or objects from backend
                let errorMessage = 'Verification failed';
                const rawError = err.response?.data?.error?.message || err.response?.data?.message || err.response?.data?.name || err.message;

                if (typeof rawError === 'string') {
                    errorMessage = rawError;
                } else if (Array.isArray(rawError) && rawError.length > 0) {
                    errorMessage = String(rawError[0]);
                } else if (rawError) {
                    errorMessage = String(rawError);
                }

                // If the user doesn't exist and name is required, fallback to registration details
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
            {/* Left Side - Branding */}
            <Box className="login-left">
                <MotionBox
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
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

            {/* Right Side - Form */}
            <Box className="login-right">
                <MotionBox
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="login-form-container"
                >
                    <Box className="login-form-header">
                        <Typography variant="h1">
                            {step === 'PHONE_ENTRY' && 'Welcome '}
                            {step === 'OTP_VERIFICATION' && 'Verify OTP'}
                            {step === 'REGISTRATION_DETAILS' && 'Welcome to Styler! 🎉'}
                        </Typography>
                        <Typography variant="body1">
                            {step === 'PHONE_ENTRY' && 'Please enter your phone number to sign in or sign up.'}
                            {step === 'OTP_VERIFICATION' && `Enter the 6-digit code sent to ${phone}`}
                            {step === 'REGISTRATION_DETAILS' && 'It looks like you are new here. Please complete your profile to continue.'}
                        </Typography>
                    </Box>

                    <CardContent sx={{ p: 0, mt: 4 }}>
                        {step === 'PHONE_ENTRY' && (
                            <Box component="form" onSubmit={handleRequestOtp} className="login-form">
                                <TextField
                                    fullWidth
                                    label="Phone Number"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                    inputProps={{ maxLength: 10 }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PhoneIcon sx={{ color: '#94a3b8' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mb: 4 }}
                                />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    disabled={loading || phone.length < 10}
                                    endIcon={!loading && <ArrowForwardIcon />}
                                    sx={{ height: 56 }}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Send OTP'}
                                </Button>
                            </Box>
                        )}

                        {step === 'OTP_VERIFICATION' && (
                            <Box component="form" onSubmit={handleVerifyOtp} className="login-form">
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

                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    disabled={loading || otp.length < 6}
                                    endIcon={!loading && <ArrowForwardIcon />}
                                    sx={{ height: 56 }}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify OTP'}
                                </Button>

                                <Box sx={{ mt: 3, textAlign: 'center' }}>
                                    <Button type="button" onClick={() => setStep('PHONE_ENTRY')} sx={{ color: '#64748b', textTransform: 'none', fontWeight: 600 }}>
                                        Change Phone Number
                                    </Button>
                                </Box>
                            </Box>
                        )}

                        {step === 'REGISTRATION_DETAILS' && (
                            <Box component="form" onSubmit={handleVerifyOtp} className="login-form">
                                <Box sx={{ display: 'grid', gap: 2.5, mb: 4 }}>
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
                                        label="Email Address (Optional)"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: '#94a3b8' }} /></InputAdornment>,
                                        }}
                                    />
                                </Box>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    disabled={loading || !name}
                                    sx={{ height: 56 }}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Complete Registration'}
                                </Button>
                            </Box>
                        )}
                    </CardContent>
                </MotionBox>
            </Box>
        </Box>
    );
};

export default Login;
