import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    TextField,
    Button,
    CardContent,
    Typography,
    ToggleButtonGroup,
    ToggleButton,
    InputAdornment,
    CircularProgress,
    IconButton,
    Dialog,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import {
    Person as PersonIcon,
    Email as EmailIcon,
    Lock as LockIcon,
    ContentCut as ScissorsIcon,
    CalendarMonth as CalendarIcon,
    ArrowForward as ArrowForwardIcon,
    Close as CloseIcon,
    VpnKey as VpnKeyIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import toast from 'react-hot-toast';
import { AuthResponse, UserRole } from '../../types';
import Logo from '../common/Logo';
import '../../pages/Login.css'; // Reuse existing styles

const MotionBox = motion(Box);

type AuthStep = 'CREDENTIALS_ENTRY' | 'OTP_VERIFICATION' | 'REGISTRATION_DETAILS';

const AuthModal: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();

    // Store State
    const { isLoginModalOpen, closeLoginModal } = useUIStore();
    const setAuth = useAuthStore((state) => state.setAuth);

    // Form State
    const [step, setStep] = useState<AuthStep>('CREDENTIALS_ENTRY');
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.CUSTOMER);

    const [credentials, setCredentials] = useState({ emailOrPhone: '', password: '' });
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pendingAuth, setPendingAuth] = useState<AuthResponse | null>(null);

    // Sync URL with Modal State
    useEffect(() => {
        if (isLoginModalOpen) {
            const currentPath = window.location.pathname;
            if (currentPath !== '/login') {
                window.history.pushState({ modal: true }, '', '/login');
            }

            const handlePopState = () => {
                closeLoginModal();
            };

            window.addEventListener('popstate', handlePopState);

            return () => {
                window.removeEventListener('popstate', handlePopState);
                if (window.location.pathname === '/login') {
                    window.history.back();
                }
            };
        }
    }, [isLoginModalOpen, closeLoginModal]);

    // Added reset state on close
    useEffect(() => {
        if (!isLoginModalOpen) {
            setStep('CREDENTIALS_ENTRY');
            setResendTimer(0);
            setCredentials({ emailOrPhone: '', password: '' });
            setPhone('');
            setOtp('');
            setName('');
            setEmail('');
            setPendingAuth(null);
            setSelectedRole(UserRole.CUSTOMER);
        }
    }, [isLoginModalOpen]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (resendTimer > 0 && step === 'OTP_VERIFICATION') {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer, step]);

    const normalizePhone = (value: string) => value.replace(/\D/g, '').slice(-10);

    const handlePrimaryLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!credentials.emailOrPhone.trim() || !credentials.password.trim()) {
            toast.error('Please enter your email/phone and password');
            return;
        }

        setLoading(true);
        try {
            const response = await authService.login({
                emailOrPhone: credentials.emailOrPhone.trim(),
                password: credentials.password,
            });

            if (response.success && response.data) {
                const fallbackPhone = normalizePhone(credentials.emailOrPhone);
                const otpPhone = response.data.user.phone || fallbackPhone;

                if (!otpPhone || otpPhone.length < 10) {
                    toast.error('Phone number is required to complete OTP verification');
                    return;
                }

                await authService.requestOtp({ phone: otpPhone });

                setPendingAuth(response.data);
                setPhone(otpPhone);
                setOtp('');
                setStep('OTP_VERIFICATION');
                setResendTimer(30);
                toast.success('Password verified. OTP sent to your phone.');
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.error?.message || err.response?.data?.message || 'Login failed';
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
                ...(step === 'REGISTRATION_DETAILS' ? { name, email, role: selectedRole } : {})
            });

            if (response.success) {
                const authPayload = response.data || pendingAuth;
                if (!authPayload) {
                    toast.error('Authentication payload missing after OTP verification');
                    return;
                }

                const { user, tokens } = authPayload;
                setAuth(user, tokens.accessToken, tokens.refreshToken);
                toast.success('Authentication successful!');
                closeLoginModal();

                // Navigation logic based on role
                switch (user.role) {
                    case UserRole.BARBER:
                        navigate('/barber/dashboard', { replace: true });
                        break;
                    case UserRole.SALON_OWNER:
                        navigate('/salon-owner/dashboard', { replace: true });
                        break;
                    case UserRole.SUPER_ADMIN:
                        navigate('/admin/superadmin', { replace: true });
                        break;
                    case UserRole.CUSTOMER:
                    default:
                        navigate('/customer/dashboard', { replace: true });
                }
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
        <Dialog
            open={isLoginModalOpen}
            onClose={closeLoginModal}
            maxWidth="lg"
            fullScreen={true}
            PaperProps={{
                sx: {
                    borderRadius: 0,
                    overflow: 'hidden',
                    maxHeight: '100%',
                    margin: 0
                }
            }}
        >
            <Box className="login-page" sx={{ minHeight: '100vh', background: '#f8fafc' }}>

                {/* Close Button */}
                <IconButton
                    onClick={closeLoginModal}
                    sx={{
                        position: 'absolute',
                        right: 20,
                        top: 20,
                        zIndex: 1000,
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        backdropFilter: 'blur(4px)',
                        color: '#64748b',
                        '&:hover': {
                            backgroundColor: 'white',
                            color: '#ef4444'
                        }
                    }}
                >
                    <CloseIcon />
                </IconButton>

                {/* Left Side - Branding */}
                {!isMobile && (
                    <Box className="login-left" sx={{ width: '45%' }}>
                        <MotionBox
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="login-branding"
                        >
                            <Box sx={{ mb: 4 }}>
                                <Logo variant="light" size="large" clickable={false} />
                            </Box>
                            <Typography className="login-tagline">
                                Experience the art of grooming.
                            </Typography>
                            <Box className="login-features">
                                <Box className="login-feature">
                                    <Box className="login-feature-icon"><ScissorsIcon /></Box>
                                    <Box>
                                        <Typography fontWeight={700}>Expert Stylists</Typography>
                                    </Box>
                                </Box>
                                <Box className="login-feature">
                                    <Box className="login-feature-icon"><CalendarIcon /></Box>
                                    <Box>
                                        <Typography fontWeight={700}>Easy Booking</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </MotionBox>
                    </Box>
                )}

                {/* Right Side - Form */}
                <Box className="login-right" sx={{ flex: 1, padding: isMobile ? 3 : 6, width: isMobile ? '100%' : '55%' }}>
                    <MotionBox
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="login-form-container"
                        sx={{ maxWidth: '450px !important', margin: '0 auto' }}
                    >
                        {/* Mobile Logo Show only if mobile */}
                        {isMobile && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                                <Logo variant="default" size="medium" clickable={false} />
                            </Box>
                        )}

                        <Box className="login-form-header" sx={{ textAlign: 'center', mb: 4 }}>
                            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>
                                {step === 'CREDENTIALS_ENTRY' && 'Welcome'}
                                {step === 'OTP_VERIFICATION' && 'Verify OTP'}
                                {step === 'REGISTRATION_DETAILS' && 'Welcome to Styler! 🎉'}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                                {step === 'CREDENTIALS_ENTRY' && 'Enter your email/phone and password to continue.'}
                                {step === 'OTP_VERIFICATION' && `Step 2: Enter the 6-digit OTP sent to ${phone}`}
                                {step === 'REGISTRATION_DETAILS' && 'It looks like you are new here. Please complete your profile to continue.'}
                            </Typography>
                        </Box>

                        <CardContent sx={{ p: 0 }}>
                            {step === 'CREDENTIALS_ENTRY' && (
                                <Box component="form" onSubmit={handlePrimaryLogin}>
                                    <TextField
                                        fullWidth
                                        label="Email or Phone"
                                        type="text"
                                        value={credentials.emailOrPhone}
                                        onChange={(e) => setCredentials({ ...credentials, emailOrPhone: e.target.value })}
                                        required
                                        sx={{ mb: 4 }}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: '#94a3b8' }} /></InputAdornment>,
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Password"
                                        type="password"
                                        value={credentials.password}
                                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                        required
                                        sx={{ mb: 4 }}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: '#94a3b8' }} /></InputAdornment>,
                                        }}
                                    />
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        fullWidth
                                        size="large"
                                        disabled={loading || !credentials.emailOrPhone || !credentials.password}
                                        endIcon={!loading && <ArrowForwardIcon />}
                                        sx={{ height: 50 }}
                                    >
                                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Continue'}
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
                                        sx={{ height: 50 }}
                                    >
                                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify OTP'}
                                    </Button>

                                    <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
                                        <Button
                                            type="button"
                                            onClick={() => handleRequestOtp()}
                                            disabled={resendTimer > 0 || loading}
                                            sx={{ color: resendTimer > 0 ? '#94a3b8' : '#4f46e5', textTransform: 'none', fontWeight: 600 }}
                                        >
                                            {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                setStep('CREDENTIALS_ENTRY');
                                                setResendTimer(0);
                                                setOtp('');
                                                setPendingAuth(null);
                                            }}
                                            sx={{ color: '#64748b', textTransform: 'none', fontWeight: 600 }}
                                        >
                                            Change Credentials
                                        </Button>
                                    </Box>
                                </Box>
                            )}

                            {step === 'REGISTRATION_DETAILS' && (
                                <Box component="form" onSubmit={handleVerifyOtp}>
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 700, color: '#64748b', textAlign: 'center' }}>
                                            I AM A:
                                        </Typography>
                                        <ToggleButtonGroup
                                            value={selectedRole}
                                            exclusive
                                            onChange={(_, newRole) => newRole && setSelectedRole(newRole)}
                                            fullWidth
                                            className="role-selection-group"
                                        >
                                            <ToggleButton value={UserRole.CUSTOMER} className="role-card-btn">Customer</ToggleButton>
                                            <ToggleButton value={UserRole.BARBER} className="role-card-btn">Barber</ToggleButton>
                                            <ToggleButton value={UserRole.SALON_OWNER} className="role-card-btn">Owner</ToggleButton>
                                        </ToggleButtonGroup>
                                    </Box>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <TextField
                                            fullWidth
                                            label="Full Name"
                                            size="small"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: '#94a3b8' }} /></InputAdornment>,
                                            }}
                                        />
                                        <TextField
                                            fullWidth
                                            label="Email Required"
                                            size="small"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
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
                                        disabled={loading || !name || !email}
                                        sx={{ mt: 3, height: 50 }}
                                    >
                                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Complete Registration'}
                                    </Button>
                                </Box>
                            )}
                        </CardContent>
                    </MotionBox>
                </Box>
            </Box>
        </Dialog>
    );
};

export default AuthModal;
