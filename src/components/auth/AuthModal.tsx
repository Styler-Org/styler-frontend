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
    Phone as PhoneIcon,
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
import { UserRole } from '../../types';
import Logo from '../common/Logo';
import '../../pages/Login.css'; // Reuse existing styles

const MotionBox = motion(Box);

type OtpStep = 'PHONE_ENTRY' | 'OTP_VERIFICATION' | 'REGISTRATION_DETAILS';

const AuthModal: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();

    // Store State
    const { isLoginModalOpen, closeLoginModal } = useUIStore();
    const setAuth = useAuthStore((state) => state.setAuth);

    // Form State
    const [step, setStep] = useState<OtpStep>('PHONE_ENTRY');
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.CUSTOMER);

    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

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
            setStep('PHONE_ENTRY');
            setPhone('');
            setOtp('');
            setName('');
            setEmail('');
            setSelectedRole(UserRole.CUSTOMER);
        }
    }, [isLoginModalOpen]);

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
                ...(step === 'REGISTRATION_DETAILS' ? { name, email, role: selectedRole } : {})
            });

            if (response.success && response.data) {
                const { user, tokens } = response.data;
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
                                {step === 'PHONE_ENTRY' && 'Welcome '}
                                {step === 'OTP_VERIFICATION' && 'Verify OTP'}
                                {step === 'REGISTRATION_DETAILS' && 'Welcome to Styler! 🎉'}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                                {step === 'PHONE_ENTRY' && 'Please enter your phone number to sign in or sign up.'}
                                {step === 'OTP_VERIFICATION' && `Enter the 6-digit code sent to ${phone}`}
                                {step === 'REGISTRATION_DETAILS' && 'It looks like you are new here. Please complete your profile to continue.'}
                            </Typography>
                        </Box>

                        <CardContent sx={{ p: 0 }}>
                            {step === 'PHONE_ENTRY' && (
                                <Box component="form" onSubmit={handleRequestOtp}>
                                    <TextField
                                        fullWidth
                                        label="Phone Number"
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        required
                                        inputProps={{ maxLength: 10 }}
                                        sx={{ mb: 4 }}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ color: '#94a3b8' }} /></InputAdornment>,
                                        }}
                                    />
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        fullWidth
                                        size="large"
                                        disabled={loading || phone.length < 10}
                                        endIcon={!loading && <ArrowForwardIcon />}
                                        sx={{ height: 50 }}
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
                                        sx={{ height: 50 }}
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
                                            label="Email (Optional)"
                                            size="small"
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
